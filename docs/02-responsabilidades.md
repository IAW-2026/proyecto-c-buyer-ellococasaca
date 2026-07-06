# 1.2. Asignación de responsabilidades

> **Tipo C — Marketplace**

## 1.2.1 Responsabilidad por integrante
| Integrante | Webapp | Responsabilidad principal |
| ---------- | ------ | ------------------------- |
| Matias Emiliano Diomedi | Buyer App | Búsqueda de productos, carrito, historial de compras, visualización de estado del pedido |
| Francisco Luis Flaibani | Seller App | Publicación y gestión de productos, stock, consulta de ventas, visualización de estado del pedido |
| Simon Paillan | Payments App | Registro de pagos, transacciones, acreditaciones, disputas, consulta de estado de pagos |
| Franco Tomas Cippitelli | Shipping App | Gestión de envíos, actualización de estados logísticos, historial de entregas |
| Jeremias Eloy Segurado Negrin | Feedback App | Reseñas, calificaciones, reportes y moderación |


## 1.2.2 Datos propios de cada app
| App | Datos propios / entidades | Base de datos propietaria |
| --- | ------------------------- | ------------------------- |
| **Buyer App** | Carts, Wishlists, Buyer Profile, Search History. | DB Buyer |
| **Seller App** | Products, Categories (Leagues/Clubs), Inventory, Messages, Notifications | DB Seller |
| **Payments App** | Charges, Refunds, Invoices, Accounting Ledger, Payment Methods. | DB Payments |
| **Shipping App** | shipment, shipment_status_history, shipping_address, shipment_event | DB Shipping |
| **Feedback App** | review, seller_rating, product_rating, review_report, moderation_action | DB Feedback |

## 1.2.3 Integraciones necesarias entre apps
| App origen | App destino | Motivo de integración | Tipo |
| ---------- | ----------- | --------------------- | ---- |
| Buyer App | Shipping App | Consultar seguimiento de envío | API REST |
| Buyer App | Feedback App | Consultar reseñas de producto/vendedor y crear reseña | API REST |
| Seller App | Shipping App | Consultar estado de los envíos de sus ventas | API REST |
| Seller App | Feedback App | Consultar reputación y reseñas recibidas | API REST |
| Payments App | Shipping App | Habilitar creación de envío luego de pago aprobado, o informar estado pago | API REST |
| Shipping App | Feedback App | Informar que una compra fue entregada y habilitar reseña | API REST |
| Seller App | Feedback App | Consultar reputacion de mis productos| API REST |
| Buyer App | Seller App | Consultar productos disponibles | API REST |
| Buyer App | Payments App | Comunicacion sobre la forma de pago | API REST |
