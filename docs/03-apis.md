# 1.3 — Diseño de APIs Inter-Servicios

> **Tipo C — Marketplace**

| Endpoint | Método | Quién llama a quién | Request (Payload) | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/products` | GET | Buyer → Seller | `query, category, league` | `[{ id, name, price, stock, images }]` |
| `/api/payments/pay` | POST | Buyer → Payments | `order_id, amount, buyer_id` | `token, redirect_url` |
| `/api/shipments` | POST | Buyer → Shipping | `order_id, destination, package_info` | `tracking_number, estimated_date` |
| `/api/inventory/reserve`| PATCH | Buyer → Seller | `product_id, quantity` | `status: "reserved" | "out_of_stock"` |

---

## 1.3.1 Buyer App → Seller App

**Motivo:** Consultar productos disponibles.

### `GET /api/products`

| Campo | Detalle |
|---|---|
| **Quién llama** | Buyer App |
| **Quién responde** | Seller App |
| **Request** | Query params opcionales: `search`, `categoryId`, `page`, `limit` |
| **Response** | Lista de productos con `productId`, `title`, `price`, `stock`, `categoryId`, `sellerId`, `imageUrl`; `total`, `page`, `limit` |

### `GET /api/products/{productId}`

| Campo | Detalle |
|---|---|
| **Quién llama** | Buyer App |
| **Quién responde** | Seller App |
| **Request** | `productId` en path |
| **Response** | `productId`, `title`, `description`, `price`, `stock`, `categoryId`, `sellerId`, `imageUrl` |


## 1.3.2. Buyer App → Payments App

**Motivo:** Comunicación sobre la forma de pago al realizar una compra.

### `POST /api/charges`

| Campo | Detalle |
|---|---|
| **Quién llama** | Buyer App |
| **Quién responde** | Payments App |
| **Request** | `buyerId`, lista de `items` (con `productId`, `quantity`, `unitPrice`), `paymentMethodId`, `totalAmount` |
| **Response** | `chargeId`, `status` (pending / approved / rejected), `createdAt` |

### `GET /api/charges/{chargeId}`

| Campo | Detalle |
|---|---|
| **Quién llama** | Buyer App |
| **Quién responde** | Payments App |
| **Request** | `chargeId` en path |
| **Response** | `chargeId`, `buyerId`, `status`, `totalAmount`, `createdAt`, `updatedAt` |


## 1.3.3. Buyer App → Shipping App

**Motivo:** Consultar el seguimiento del envío de una compra.

### `GET /api/shipments/{shipmentId}/tracking`

| Campo | Detalle |
|---|---|
| **Quién llama** | Buyer App |
| **Quién responde** | Shipping App |
| **Request** | `shipmentId` en path |
| **Response** | `shipmentId`, `orderId`, `currentStatus`, `estimatedDelivery`, historial de estados con `status`, `description`, `timestamp` |


## 1.3.4. Buyer App → Feedback App

**Motivo:** Consultar reseñas de producto/vendedor y crear una reseña tras recibir el pedido.

### `GET /api/reviews/product/{productId}`

| Campo | Detalle |
|---|---|
| **Quién llama** | Buyer App |
| **Quién responde** | Feedback App |
| **Request** | `productId` en path |
| **Response** | `productId`, `averageRating`, `totalReviews`, lista de reseñas con `reviewId`, `buyerId`, `rating`, `comment`, `createdAt` |

### `GET /api/reviews/seller/{sellerId}`

| Campo | Detalle |
|---|---|
| **Quién llama** | Buyer App |
| **Quién responde** | Feedback App |
| **Request** | `sellerId` en path |
| **Response** | `sellerId`, `averageRating`, `totalReviews`, lista de reseñas con `reviewId`, `buyerId`, `rating`, `comment`, `createdAt` |

### `POST /api/reviews`

| Campo | Detalle |
|---|---|
| **Quién llama** | Buyer App |
| **Quién responde** | Feedback App |
| **Request** | `buyerId`, `orderId`, `productId`, `sellerId`, `productRating` (1–5), `sellerRating` (1–5), `comment` |
| **Response** | `reviewId`, `status`, `createdAt` |


## 1.3.5. Seller App → Shipping App

**Motivo:** Consultar el estado de los envíos de sus ventas.

### `GET /api/shipments?sellerId={sellerId}`

| Campo | Detalle |
|---|---|
| **Quién llama** | Seller App |
| **Quién responde** | Shipping App |
| **Request** | `sellerId` como query param |
| **Response** | Lista de envíos con `shipmentId`, `orderId`, `buyerId`, `currentStatus`, `updatedAt` |


## 1.3.6. Seller App → Feedback App

**Motivo:** Consultar reputación del vendedor y calificaciones de sus productos.

### `GET /api/seller-ratings/{sellerId}`

| Campo | Detalle |
|---|---|
| **Quién llama** | Seller App |
| **Quién responde** | Feedback App |
| **Request** | `sellerId` en path |
| **Response** | `sellerId`, `averageRating`, `totalReviews`, lista de reseñas con `reviewId`, `buyerId`, `rating`, `comment`, `createdAt` |

### `GET /api/product-ratings/{productId}`

| Campo | Detalle |
|---|---|
| **Quién llama** | Seller App |
| **Quién responde** | Feedback App |
| **Request** | `productId` en path |
| **Response** | `productId`, `averageRating`, `totalReviews`, lista de reseñas con `reviewId`, `buyerId`, `rating`, `comment`, `createdAt` |


## 1.3.7. Payments App → Shipping App

**Motivo:** Habilitar la creación del envío luego de un pago aprobado.

### `POST /api/shipments`

| Campo | Detalle |
|---|---|
| **Quién llama** | Payments App |
| **Quién responde** | Shipping App |
| **Request** | `orderId`, `chargeId`, `buyerId`, `sellerId`, lista de `items` (con `productId`, `quantity`), `shippingAddress` (con `street`, `city`, `province`, `postalCode`, `country`) |
| **Response** | `shipmentId`, `status`, `estimatedDelivery` |


## 1.3.8. Shipping App → Feedback App

**Motivo:** Informar que una compra fue entregada y habilitar la reseña.

### `POST /api/reviews/enable`

| Campo | Detalle |
|---|---|
| **Quién llama** | Shipping App |
| **Quién responde** | Feedback App |
| **Request** | `orderId`, `shipmentId`, `buyerId`, `sellerId`, lista de `productIds`, `deliveredAt` |
| **Response** | `orderId`, `reviewEnabled`, `message` |
