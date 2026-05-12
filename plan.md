# Plan de Implementación — Buyer App (El Loco Casaca)

**Fecha:** 2026-05-07  
**Repo:** Buyer App (`proyecto-c-buyer-ellococasaca`)  
**Objetivo:** Tener una Buyer App funcional primero con **Mocks (Etapa 2)** y luego integrarla con **Seller/Payments/Shipping reales (Etapa 3)**, manteniendo Clean Code, App Router y patrón API Client / Service.

---

## 0) Estado actual (hoy)

### Etapa actual
- **Estamos en Etapa 2 (Mocks)**.

### Cómo se recuperan las camisetas hoy
- Se obtienen desde **mocks hardcodeados** en el Buyer:
  - Archivo: `src/lib/api-clients/seller.ts`
  - `MOCK_PRODUCTS` se retorna cuando `USE_MOCKS === "true"`.

### Qué ya anda
- Home `/` mostrando catálogo con estilos (Tailwind funcionando).
- App visible en `localhost` (confirmado).
- Modo mocks activable con `.env.local`.

---

## 1) Variables de entorno (contrato mínimo)

Crear/asegurar `.env.local`:

- `USE_MOCKS="true"` → fuerza mocks para Etapa 2  
- (Etapa 3) `SELLER_API_URL="https://seller..."` → base URL real del Seller  
- (Etapa 3) `PAYMENTS_API_URL="https://payments..."`  
- (Etapa 3) `SHIPPING_API_URL="https://shipping..."`  
- (Autenticación) variables de Clerk (según setup del repo)

**Nota:** En Etapa 2 NO se debe depender de `SELLER_API_URL`.

---

## 2) Backlog por etapas

### ETAPA 2 — Mocks (sin coordinación real con otras apps) ✅/🚧

**Objetivo:** Buyer totalmente usable sin Seller/Payments/Shipping reales.

#### 2.1 Catálogo (Products)
**Hoy:** `MOCK_PRODUCTS` vive en `src/lib/api-clients/seller.ts`.

**Pendiente recomendado:**
1. **Mover mocks a endpoints locales** (para simular contrato HTTP real sin depender de Seller):
   - `GET /api/products`
   - `GET /api/products/:id`
   - Ventaja: el resto del front consume HTTP local y más adelante se transforma en “proxy” a Seller real sin tocar UI.
2. Agregar filtros soportados por marketplace:
   - `search`, `category` (ya existe)
   - `sellerId` (marketplace: “ver productos de un vendedor”)
   - `team`, `season`, `minPrice`, `maxPrice`, `inStock` (si aplica)

**Criterio de aceptación:**
- La UI nunca intenta pegarle a un host externo cuando `USE_MOCKS=true`.
- El catálogo responde rápido y con filtrado consistente.

#### 2.2 Carrito (Cart)
**Pendiente:**
- Definir almacenamiento en Etapa 2:
  - Opción A: **in-memory** (se pierde al refrescar)
  - Opción B: **cookies/session** (mejor UX)
  - Opción C: **localStorage** (solo client-side)
- Asegurar que `/cart` no dependa de Prisma/DB en Etapa 2 si aún no está configurado.

**Criterio de aceptación:**
- `add to cart`, `remove`, `update quantity` funcionan sin DB real.
- No rompe si faltan variables de DB.

#### 2.3 Checkout (Payments + Orders)
**Pendiente:**
- Definir “mock checkout”:
  1. Crear orden local (estado `PENDING`)
  2. Simular pago (estado `PAID` o `FAILED`)
  3. Llevar al detalle de orden `/orders/:id`
- Generar IDs consistentes y persistencia mínima (ver 2.2).

**Criterio de aceptación:**
- Flujo completo: catálogo → carrito → checkout → orden.

#### 2.4 Shipping (envío)
**Pendiente:**
- Mock de cálculo de envío (por ejemplo tarifa fija o por zona).
- Mock tracking (estado `CREATED`, `IN_TRANSIT`, `DELIVERED`).

**Criterio de aceptación:**
- En checkout se muestra costo y ETA estimada.
- Orden muestra estado de envío simulado.

#### 2.5 Autenticación (Clerk)
**Pendiente (según alcance de la etapa):**
- Definir si Etapa 2 requiere login real (Clerk) o modo “guest”.
- Si se usa Clerk:
  - páginas protegidas: `/profile`, `/orders`
  - fixtures/mocks para usuario si no está configurado.

**Criterio de aceptación:**
- Navegación no se rompe sin Clerk configurado (si el objetivo es demo-mocks).
- O, si Clerk es obligatorio, instrucciones claras para setear env vars.

---

### ETAPA 3 — Integración real (Seller / Payments / Shipping) 🚧

**Objetivo:** Reemplazar mocks por llamadas reales manteniendo el contrato y la separación por API Clients.

#### 3.1 Integración con Seller (productos del marketplace)
**Pendiente:**
- Definir contrato HTTP con Seller:
  - `GET /api/products`
  - `GET /api/products/:id`
  - filtros y paginación (muy importante): `page`, `pageSize`, `sort`, etc.
- Configurar `SELLER_API_URL` y remover fallback local cuando esté listo.
- Manejo de errores y timeouts:
  - retries simples o mensajes de error claros
  - estados de carga (skeletons)

**Criterio de aceptación:**
- `USE_MOCKS=false` → catálogo se alimenta desde Seller real.
- Marketplace consistente: productos creados por Seller aparecen en Buyer.

#### 3.2 Payments real
**Pendiente:**
- Endpoints y flujo:
  - crear intent de pago, confirmar pago, webhooks de confirmación (si aplica)
- Persistencia de orden y estado transaccional.

**Criterio de aceptación:**
- Orden pasa a `PAID` solo con confirmación real.

#### 3.3 Shipping real
**Pendiente:**
- Crear envío al pagar, obtener tracking, actualizar estados.
- Webhooks de shipping (si aplica).

**Criterio de aceptación:**
- Orden refleja tracking real.

---

## 3) Tareas técnicas transversales (deuda técnica / calidad)

### 3.1 Contratos y Tipos
- Unificar `Product` contra el contrato del Seller real.
- Agregar `zod` (opcional) para validar payloads en los API clients.

### 3.2 Testing
- Unit tests para:
  - `SellerApiClient.getProducts` (mocks + filtros)
  - `CartService` (agregar/quitar/total)
- Tests de integración para endpoints `/api/products` si se implementan.

### 3.3 Observabilidad / DX
- Logs claros cuando `USE_MOCKS` está activo.
- Un banner en dev (opcional) indicando “MOCK MODE”.

---

## 4) Propuesta de ejecución (orden recomendado)

1. **Etapa 2 — consolidar mocks**
   - (A) mover `MOCK_PRODUCTS` a `/api/products` local
   - (B) carrito mock estable (persistencia mínima)
   - (C) checkout mock + orders mock
2. **Definir contratos con Seller**
   - filtros, paginación, tipos
3. **Etapa 3 — integración**
   - Seller real → Payments → Shipping

---

## 5) “Definition of Done” por etapa

### DoD Etapa 2
- App navegable completa sin servicios externos.
- `USE_MOCKS=true` es suficiente para que todo funcione.
- No hay crashes por falta de `SELLER_API_URL` / DB / otros.

### DoD Etapa 3
- `USE_MOCKS=false` y env vars reales → el catálogo/checkout/envíos usan servicios reales.
- Buyer refleja productos “subidos por vendedor” correctamente (marketplace).

---

## 6) Archivos clave (en este repo)

- Productos (cliente externo/mocks): `src/lib/api-clients/seller.ts`
- Carrito (lógica negocio): `src/services/cart.service.ts`
- Acciones server: `src/lib/actions/cart.ts`
- UI products: `src/components/products/*`
- Rutas Next App Router: `src/app/(store)/*`
- Docs: `docs/*`