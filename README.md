# El Loco Casaca — Buyer App 👕⚽

**Deploy:** <https://proyecto-c-buyer-ellococasaca.vercel.app/>

Aplicación **Buyer** del Proyecto IAW 2026.

Es el módulo encargado de la experiencia de compra dentro del marketplace **El Loco Casaca**, permitiendo a los compradores explorar productos, gestionar su carrito, realizar compras y consultar el estado de sus pedidos.

---

## Usuarios de prueba

La autenticación se realiza mediante **Clerk**. Dependiendo del rol del usuario autenticado, la Buyer App funciona como punto de entrada al ecosistema y redirige automáticamente al módulo correspondiente.

| Rol | Usuario | Mail | Contraseña |
|------|---------|------|------------|
| Buyer | `buyerTest` | buyer+clerk_test@iaw.com | `iawuser#` |
| Seller | `sellerTest` | seller+clerk_test@iaw.com | `iawuser#` |
| Admin | `adminTest` | admin+clerk_test@iaw.com | `iawuser#` |
| Moderator | `moderatorTest` | moderator+clerk_test@iaw.com | `iawuser#` |
| Courier | `Lionel Messi` | repartidor1+clerk_test@iaw.com | `iawuser#` |
| Courier | `Carlos Sanchez` | repartidor2+clerk_test@iaw.com | `iawuser#` |

---

## Funcionalidades principales

- Navegación y búsqueda de productos.
- Visualización del detalle de cada producto.
- Gestión del carrito de compras.
- Proceso de checkout.
- Consulta de pedidos realizados.
- Autenticación mediante Clerk.
- Redirección automática a la aplicación correspondiente según el rol del usuario.
- Integración con los distintos microservicios del ecosistema (Products, Orders, Shipping, Feedback, entre otros).

---

## Stack tecnológico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Autenticación:** Clerk
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Estilos:** Tailwind CSS
- **Deploy:** Vercel

---

## Arquitectura

La aplicación sigue una arquitectura basada en la separación de responsabilidades y el consumo de APIs REST para interactuar con los demás servicios del marketplace.

Las principales decisiones de diseño incluyen:

- Uso de Clerk como proveedor centralizado de autenticación e identidad.
- Comunicación desacoplada mediante APIs REST entre los distintos servicios.
- Persistencia de la información utilizando PostgreSQL y Prisma ORM.

## Observaciones e Historial de Integración

Anteriormente existían limitaciones de integración con la **Shipping App** y mocks de desarrollo. Todos estos puntos han sido resueltos de forma definitiva:

- **Resolución de Shipping:** El filtrado local temporal fue reemplazado por la consulta directa al endpoint `/api/shipments/by-order/[orderId]`.
- **Limpieza de Código:** Todos los mocks y lógica auxiliar obsoleta fueron eliminados.

---

## Actualizaciones de Integración y Seguridad (Etapa 3)

Se realizaron mejoras clave para completar la integración real con el ecosistema y asegurar el canal de comunicación inter-servicios:

### 🛡️ Seguridad Inter-Servicios (`INTER_SERVICE_SECRET`)
- **Protección de Endpoints Propios**: Los endpoints administrativos y de analíticas ofrecidos por la Buyer App (`/api/analytics`, `/api/admin/users`, `/api/admin/orders` y `/api/admin/orders/[id]`) validan de forma estricta la firma secreta de comunicación interna mediante la cabecera `x-inter-service-secret`.
- **Consumo Protegido**: Se actualizaron todos los clientes de API salientes (**Seller**, **Shipping**, **Payments** y **Feedback**) para incluir automáticamente el encabezado `x-inter-service-secret` en sus peticiones fetch, garantizando que todos los microservicios autoricen nuestras consultas.
- **Remoción de Fallbacks**: Se eliminó cualquier valor por defecto hardcodeado en la lógica de autenticación (`src/utils/auth.ts`), forzando a que la clave resida única y exclusivamente en las variables de entorno del archivo `.env`.

### 🚚 Integración de Envío por ID de Orden
- Se integró el endpoint definitivo provisto por el equipo de Shipping: `/api/shipments/by-order/[orderId]`.
- Se mantiene un flujo de **resiliencia** que automáticamente hace fallback a la búsqueda en la lista de envíos en caso de que la consulta directa falle o retorne un error de compatibilidad.

### 🧹 Limpieza de Mocks e Infraestructura de Pruebas
- Se eliminaron mocks locales obsoletos y archivos temporales de testing.
- Se configuró el archivo `.gitignore` para omitir carpetas de endpoints experimentales (`src/app/api/test-shipping-endpoint/`) y scripts locales de prueba (`test*.ts` / `test-*.ts`) para mantener el repositorio limpio y seguro.