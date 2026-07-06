# 1. Descripcion del sistema

## 1.1 — Descripcion del Sistema

**Tipo C — Marketplace**

### ¿Que problema resuelve?

"El Loco Casaca" resuelve la necesidad de contar con una plataforma digital integrada para la compra-venta de camisetas deportivas entre usuarios, centralizando en un unico sistema:

- Publicacion y administracion de camisetas deportivas  
- Busqueda y compra por parte de los usuarios  
- Procesamiento y registro de pagos  
- Gestion logistica de envios  
- Sistema de resenas y calificaciones  

De esta forma, se evita que compradores y vendedores deban coordinar manualmente cuestiones como stock, pago, seguimiento del envio o reputacion.

## 1.2 Actores del sistema

| Actor | Descripcion | Apps donde interactua |
|------|------------|-----------------------|
| Comprador | Usuario que navega productos, realiza compras, paga pedidos, consulta envios y deja resenas | Buyer App, Payments App, Shipping App, Feedback App |
| Vendedor | Usuario que publica productos, administra stock, consulta ventas, recibe acreditaciones y visualiza resenas | Seller App, Payments App, Feedback App |
| Operador logistico | Rol encargado de gestionar envios y actualizar estados logisticos | Shipping App |
| Administrador | Usuario con privilegios administrativos para supervisar el sistema, gestionar disputas y controlar operaciones | Payments App, Feedback App |
| Moderador | Usuario encargado de revisar publicaciones y validar vendedores | Seller App, Feedback App |


## 1.3 Aplicaciones del sistema

### 1.3.1 Buyer App
Aplicación orientada al comprador. Permite buscar productos, agregarlos al carrito, comprar, consultar historial de compras y hacer seguimiento del pedido.

### 1.3.2 Seller App
Aplicación orientada al vendedor. Permite publicar productos, editar publicaciones, administrar stock y consultar ventas.

### 1.3.3 Payments App
Aplicación encargada de registrar pagos, procesar cobros, manejar acreditaciones a vendedores y almacenar el historial de transacciones y disputas.

### 1.3.4 Shipping App
Aplicación encargada de la logística de los pedidos. Permite crear envíos, asignar datos logísticos, actualizar estados y consultar historial de entrega.

### 1.3.5 Feedback App
Aplicación encargada del sistema de reputación. Permite a compradores dejar reseñas y calificaciones sobre productos o vendedores, reportar reseñas y moderarlas.

## 1.4 Flujo de uso
El flujo general del sistema es el siguiente:

1. Un vendedor inicia sesión y publica un producto en la Seller App.
2. La publicación queda disponible para ser consultada desde la Buyer App.
3. Un comprador inicia sesión, busca un producto, lo agrega al carrito y confirma la compra.
4. La Buyer App solicita a la Payments App el registro y procesamiento del pago.
5. Si el pago es aprobado, se genera una orden de compra.
6. A partir de la orden confirmada, se solicita a la Shipping App la creación de un envío.
7. La Shipping App registra el envío y permite actualizar su estado a lo largo del proceso logístico.
8. El comprador consulta desde la Buyer App el estado del pedido y su envío.
9. Una vez entregado el producto, el comprador puede dejar una calificación y reseña en la Feedback App.
10. El vendedor puede visualizar su reputación y las reseñas recibidas.

## 1.4.1 Flujo Buyer

1. El Comprador busca una camiseta (vía Seller App API)  
2. Agrega al carrito y selecciona talle
3. Inicia Checkout
4. **Payments App** procesa el cobro (Mercado Pago)
5. **Payments** notifica éxito 
6. **Buyer App** confirma la orden y solicita envío a **Shipping App** 
7. El Comprador califica al Vendedor (vía **Feedback App**).

## 1.4.2 Flujo Seller

1. El vendedor crea una cuenta, si no tiene, y luego inicia sesión en la Seller App.
2. El vendedor crea una nueva publicación, completando los datos claves de la misma:
    - Equipo.
    - Temporada/Año.
    - (OPCIONAL) Jugador y dorsal.
    - Tipo de producto (original, réplica, usado en algún partido).
    - Estado del producto (nuevo, usado, etcétera).
    - Precio.
    - Foto/s del producto.
3. El producto queda en estado de revisión, a la espera de que un moderador corrobore la información y pase a estado publicado.
4. El moderador se encarga de revisar la publicación. Podrá:
    - Aprobar la publicación.
    - Rechazar la publicación.
5. Si el producto es aprobado, el vendedor es informado que su producto fue aprobado y el mismo es publicado en la aplicación Buyer App.
6. Si el producto es rechazado, el vendedor es informado que su producto fue rechazado, detallando el motivo en el mismo.

## 1.4.3 Flujo Payment

1. Se recibe un pedido de compra.
2. Se crea un intento de pago.
3. Se procesa el pago con una aplicación de terceros
4. Mientras el vendedor puede ver el estado.
5. Una vez aprobado el pago se envía un mensaje a shipping app para enviar el producto
6. Luego de un tiempo o cuando el cliente deja un feedback positivo se entrega el dinero al vendedor


## 1.4.4 Flujo Shipping
1. Se confirma una compra pagada.
2. La Buyer App solicita a Shipping App la creación del envío.
3. Shipping App registra dirección, pedido asociado, comprador, vendedor y estado inicial.
4. El servicio de reparto actualiza los estados del envío durante el traslado.
5. Buyer App consulta el estado del envío para mostrar seguimiento al comprador.

Estados posibles de ejemplo:
- pending
- preparing
- shipped
- in_transit
- delivered
- canceled

## 1.4.5 Flujo Feedback
1. Un pedido se marca como entregado en Shipping App.
2. El sistema habilita la posibilidad de dejar reseña.
3. El comprador ingresa a Feedback App y califica producto y/o vendedor.
4. La reseña queda visible para otros usuarios.
5. Si una reseña es reportada, un administrador o moderador puede revisarla y aprobarla, ocultarla o eliminarla.
