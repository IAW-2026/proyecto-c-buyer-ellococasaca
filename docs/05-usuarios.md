# 1.5 — Usuarios Compartidos

> **Tipo C — Marketplace**

El sistema utiliza **Clerk** como servicio centralizado de autenticación. Los usuarios se autentican a través de Clerk independientemente de qué app estén usando, y la identidad se propaga entre servicios mediante el token JWT emitido por Clerk.

---

## 1.5.1 Apps que comparten usuarios

| Usuario | Apps donde puede autenticarse |
|---------|------------------------------|
| Comprador | Buyer App, Payments App, Shipping App, Feedback App |
| Vendedor | Seller App, Payments App, Shipping App, Feedback App |
| Servicio de reparto (tipo correo argentino) | Shipping App |
| Administrador / Moderador | Feedback App |

---

## Claims del JWT relevantes por app

| App | Claims utilizados | Para qué |
|-----|------------------|----------|
| Buyer App | `sub` (user ID), `role` | Identificar comprador, verificar rol `buyer` |
| Seller App | `sub` (user ID), `role` | Identificar vendedor, verificar rol `seller` |
| Shipping App | `sub` (user ID), `role` | Identificar operador, verificar rol `logistics` |
| Payments App | `sub` (user ID) | Asociar transacciones al usuario |
| Feedback App | `sub` (user ID) | Verificar identidad del calificador |

## 1.5.2 Claims relevantes del JWT
Se propone utilizar los siguientes claims:

- `sub`: identificador único global del usuario en Clerk
- `email`: correo del usuario
- `name` o `full_name`: nombre visible
- `role`: rol principal del usuario
- `permissions`: permisos específicos
- `iat`: fecha de emisión del token
- `exp`: expiración del token

## 1.5.3 Uso de claims por aplicación
| App | Claims relevantes | Uso |
|---|---|---|
| Buyer App | `sub`, `email`, `role` | identificar comprador y proteger operaciones del carrito e historial |
| Seller App | `sub`, `email`, `role` | identificar vendedor y restringir edición de productos propios |
| Payments App | `sub`, `role`, `permissions` | asociar pagos a comprador/vendedor y controlar acceso a disputas |
| Shipping App | `sub`, `role`, `permissions` | permitir consulta de envíos al comprador/vendedor correcto y actualización solo a operador logístico |
| Feedback App | `sub`, `role`, `permissions` | permitir crear reseñas como comprador y moderar como administrador |

---

## 1.5.4 Estrategia de roles

Los roles del sistema definen las capacidades de cada usuario dentro de las distintas aplicaciones. Se propone una estrategia basada en metadata de usuario, con posibilidad de extensión a múltiples roles.

### 1.5.4.1 Definición de roles

Los roles se almacenan como metadata asociada al usuario:

- Opción simple:
  - `publicMetadata.role = "buyer" | "seller" | "logistics_operator" | "admin"`

- Opción extensible (recomendada):
  - `publicMetadata.roles = ["buyer", "seller"]`

Esto permite que un mismo usuario pueda operar en más de un contexto (por ejemplo, comprador y vendedor).

### 1.5.4.2  Roles propuestos

#### 1.5.4.2.1 buyer
Puede:
- navegar productos,
- comprar,
- pagar,
- consultar envíos,
- dejar reseñas.

#### 1.5.4.2.2 seller
Puede:
- publicar productos,
- administrar stock,
- consultar ventas,
- consultar reseñas recibidas,
- ver envíos asociados a sus ventas.

#### 1.5.4.2.3 logistics_operator
Puede:
- consultar envíos,
- actualizar estado logístico,
- registrar eventos.

#### 1.5.4.2.4 admin
Puede:
- moderar reseñas,
- revisar reportes,
- realizar acciones administrativas.

### 1.5.4.3 Regla de autorización

La autenticación es compartida entre aplicaciones, pero la autorización se resuelve de forma local en cada una.

Esto implica que:
- múltiples aplicaciones pueden identificar al mismo usuario,
- cada aplicación decide qué acciones permite según:
  - `role` o `roles`,
  - `permissions`,
  - reglas de negocio propias.

### 1.5.4.4 Ejemplos de uso

#### Ejemplo 1
Un usuario con:
- `sub = user_123`
- `roles = ["buyer"]`

Puede:
- comprar en Buyer App,
- consultar su envío en Shipping App,
- crear una reseña en Feedback App,

No puede:
- actualizar el estado de un envío.

#### Ejemplo 2
Un usuario con:
- `sub = user_456`
- `roles = ["logistics_operator"]`

Puede:
- ingresar a Shipping App,
- cambiar el estado de un envío,

No puede:
- crear productos,
- dejar reseñas como comprador.

#### Ejemplo 3
Un usuario con:
- `sub = user_789`
- `roles = ["admin"]`

Puede:
- moderar reseñas reportadas en Feedback App.