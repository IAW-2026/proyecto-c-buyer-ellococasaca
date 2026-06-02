# 1.4 — Modelo de Datos por Aplicación

> **Tipo C — Marketplace**

---

## 1.4.1 Buyer App (Base de Datos: `db_buyer`)
Responsable de la experiencia de compra, carritos y persistencia de la intención de compra del usuario.

*   **Users :** `clerk_id` (PK), `email`, `display_name`, `default_address_snapshot`.
    *   *Sincronización:* Vía Webhooks de Clerk.
*   **Carts:** `id` (PK), `user_id` (FK a Users), `is_active` (boolean).
*   **CartItems:** `id` (PK), `cart_id` (FK), `product_id` (Referencia externa a Seller App), `quantity`, `snapshot_price`, `snapshot_name`, `snapshot_image`.
    *   *Nota:* Se guardan snapshots para evitar inconsistencias si el vendedor cambia el precio mientras el item está en el carrito.
*   **Orders (Shadow Table):** `id` (PK), `external_order_id` (Ref a Seller/Payments), `status`, `total_amount`, `tracking_id` (Ref a Shipping).

## 1.4.2. Seller App (Base de Datos: `db_seller`)
Responsable del catálogo maestro de camisetas y la gestión de inventario.

*   **Users :** `clerk_id` (PK), `email`, `display_name`, `is_verified_seller` (boolean), `description` .
*   **Products:** `id` (PK), `seller_id` (FK a Users), `title`, `description`, `price`, `stock`, `category_id` (FK), `image_urls` (JSONB), `season`, `team`, `size`, `version` (Player/Stadium), ` state `. 
*   **Categories:** `id` (PK), `name` (Ej: "Premier League", "Selecciones", "Retro").
*   **SalesOrders:** `id` (PK), `product_id` (FK), `quantity`, `buyer_id` (Clerk ID), `status` (pending, prepared, shipped), `total_sale_price`.

## 1.4.3. Payments App (Base de Datos: `db_payments`)
Responsable de la integridad financiera y el flujo de caja.

*   **Users :** `clerk_id` (PK), `mp_customer_id` (Referencia a Mercado Pago).
*   **Charges:** `id` (PK), `order_id` (Referencia externa), `buyer_id` (Clerk ID), `amount`, `status` (pending, approved, rejected, refunded), `mp_payment_id` (Mercado Pago ID), `created_at`.
*   **Payouts (Liquidaciones):** `id` (PK), `seller_id` (Clerk ID), `amount`, `status` (pending, paid), `charge_id` (FK).

## 1.4.4. Shipping App (Base de Datos: `db_shipping`)
Responsable de la logística y el seguimiento de los paquetes.

*   **Shipments:** `id` (PK), `order_id` (Ref externa), `buyer_id` (Clerk ID), `seller_id` (Clerk ID), `status` (preparing, in_transit, delivered), `tracking_code`, `address_snapshot` (JSONB: street, city, postal_code).
*   **TrackingHistory:** `id` (PK), `shipment_id` (FK), `status`, `location`, `description`, `timestamp`.

## 1.4.5. Feedback App (Base de Datos: `db_feedback`)
Responsable de la reputación de productos y vendedores.

*   **Reviews:** `id` (PK), `order_id` (Unique Ref), `buyer_id` (Clerk ID), `seller_id` (Clerk ID), `product_id` (Ref externa), `rating_product` (1-5), `rating_seller` (1-5), `comment`, `is_moderated` (boolean).
*   **RatingsCache:** `target_id` (Product ID o Seller ID), `average_rating`, `total_reviews`.
    *   *Nota:* Tabla de optimización para no recalcular promedios en cada lectura de catálogo.

---

## 1.4.6 Estrategia de Consistencia e Inconsistencias

### 1.4.6.1. Inconsistencias de Perfil (Clerk Webhooks)
**Problema:** Un usuario cambia su nombre en la Buyer App, pero la Seller App aún tiene el nombre viejo en sus registros de ventas.
**Solución:** Clerk actúa como "Single Source of Truth". Cada aplicación expone un endpoint de Webhook (`/api/webhooks/clerk`) que escucha el evento `user.updated`. Al recibirlo, cada base de datos local actualiza su tabla de `Users` correspondiente.

### 1.4.6.2. Inconsistencias de Precios y Productos (Snapshotting)
**Problema:** Un comprador agrega una camiseta de $50 al carrito. Antes de pagar, el vendedor sube el precio a $70.
**Solución:** 
- Al agregar al carrito, la **Buyer App** consulta el precio a la **Seller App** y guarda un `snapshot_price`. 
- Durante el checkout, se respeta el precio del snapshot (o se valida si el snapshot tiene más de X tiempo). 
- Una vez pagado, la **Payments App** persiste el monto final cobrado, blindando la transacción de cambios futuros en el catálogo.

### 1.4.6.3. Consistencia Eventual en Flujos Transversales
**Problema:** El pago se aprueba en la Payments App, pero la Shipping App falla al crear el envío.
**Solución:** 
- Se utiliza un patrón de **Retry Logic** en las llamadas entre APIs.
- El **Control Plane** (Etapa 3) tendrá una función de "Conciliación" para identificar órdenes pagadas que no tengan un envío asociado en la Shipping App, permitiendo al administrador disparar el reintento manualmente.

---

## 1.4.7. Usuarios Compartidos - Clerk

El sistema utiliza **Clerk** como Single Source of Truth (SSoT) para la identidad. Todas las aplicaciones del ecosistema comparten la misma base de usuarios, aunque el acceso a funcionalidades específicas depende del rol asignado.

### 1.4.7.1 Aplicaciones que comparten usuarios
La identidad es transversal a todo el ecosistema. Los usuarios comparten su sesión entre las siguientes aplicaciones:

*   **Flujo Comprador:** Un usuario con rol `"buyer"` utiliza la **Buyer App** para navegar, pero su identidad persiste al ser redireccionado o al interactuar con las APIs de la **Payments App** (pago), **Shipping App** (seguimiento) y **Feedback App** (reseñas).
*   **Flujo Vendedor:** Un usuario con rol `"seller"` accede a la **Seller App** para gestionar su catálogo y utiliza la **Shipping App** para coordinar y monitorear despachos y la **Feedback App** para monitorear su reputación.
*   **Flujo Administrativo:** Los usuarios con rol `"admin"` comparten su identidad entre el **Control Plane** y el **Analytics Dashboard**, teniendo además permisos de supervisión en las apps operativas.

### 1.4.7.2 Identidad Centralizada y Propagación
*   **Identificador Universal:** El `clerk_id` (vía claim `sub` del JWT) es la Primary Key (o FK principal) en todas las tablas locales de `Users`. Esto permite que una orden en la `db_buyer` pueda asociarse inequívocamente con un vendedor en la `db_seller` sin necesidad de una base de datos central.
*   **Propagación vía JWT:** Cada solicitud inter-servicio debe incluir el JWT original en el Header `Authorization: Bearer <token>`. Las aplicaciones receptoras validarán este token para confirmar la identidad y los permisos del llamador.

### 1.4.7.3 Claims Relevantes del JWT
Las aplicaciones basarán su lógica de autorización en los siguientes claims del token:
*   **`sub`:** ID único del usuario (Clerk ID).
*   **`email`:** Para comunicaciones directas y logs de auditoría.
*   **`metadata.role`:** Array que define las capacidades del usuario en el ecosistema:
    *   `"buyer"`: Permite crear carritos, realizar pagos y calificar productos.
    *   `"seller"`: Permite gestionar catálogo, stock y ver estados de venta.
    *   `"admin"`: Acceso total al Control Plane y dashboards de Analytics.
*   **`metadata.premium`:** Boolean para lógica de la Promotions App (si aplica).

### 1.4.7.4 Gestión de Roles y Privilegios
*   **Multi-rol:** Un mismo `clerk_id` puede tener múltiples roles (ej: ser comprador y vendedor simultáneamente).
*   **Validación de Dominio:** Aunque el JWT sea válido, cada aplicación verificará si el usuario tiene el rol necesario para realizar la acción solicitada (ej: la `Seller App` rechazará intentos de publicación de productos si el token no contiene el rol `"seller"`).

---

## Datos duplicados y estrategia de consistencia

| Dato duplicado | Apps que lo tienen | Fuente de verdad | Estrategia |
|----------------|--------------------|-----------------|------------|
| Usuario (clerk_user_id) | Todas | Clerk | Cada app sincroniza al primer login vía webhook o lazy load |
| *(agregar otros)* | | | |
