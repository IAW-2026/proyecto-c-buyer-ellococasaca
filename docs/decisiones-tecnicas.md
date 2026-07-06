# Registro de Decisiones Técnicas (ADR)

Este documento registra las decisiones arquitectónicas tomadas durante el desarrollo de la Buyer App.

## ADR 001: Identidad Centralizada con Clerk
Usar Clerk como proveedor de identidad. El `clerk_id` es el identificador universal en todas las bases de datos del sistema.

## ADR 002: Estrategia de Mocks (Etapa 2)
Implementar API Clients que devuelvan datos simulados para permitir el desarrollo independiente de la Buyer App.

## ADR 003: Snapshotting en Carrito
Guardar el precio del producto al momento de agregarlo al carrito para evitar conflictos si el vendedor cambia el precio antes del checkout.

## ADR 004: Integración de Feedback y Reputación
Se decidió centralizar la lógica de reputación del vendedor en la Feedback App. La Buyer App consulta esta información en tiempo real para mostrarla en el perfil del vendedor y en el detalle del producto, asegurando que el comprador tenga información actualizada.

## ADR 005: Seguimiento de Pedidos sin Persistencia Local
Para el tracking de envíos, la Buyer App no almacena el estado detallado del envío. En su lugar, consulta a la Shipping App en cada visualización de la orden. Esto garantiza que la información de seguimiento sea siempre la fuente oficial de la transportadora.

## ADR 006: Validación de Stock en Carrito (Coordinación con Seller App)
Al agregar o actualizar cantidades en el carrito, la Buyer App realiza una consulta síncrona al API del Seller App para verificar el stock disponible. Esto evita que el usuario avance en el checkout con items que ya no están disponibles, reduciendo la tasa de errores en el proceso de pago.

## ADR 007: Orquestación de Envío Post-Pago (Coordinación con Payments y Shipping)
Se acordó que la Buyer App es responsable de iniciar el pago en la Payments App. Una vez que el pago es exitoso, la Payments App tiene la responsabilidad de notificar a la Shipping App para la creación del envío. La Buyer App solo recibe el `trackingId` resultante para su visualización.

## ADR 008: Snapshotting como Contrato de Precio (Coordinación con Seller App)
La Buyer App congelea el precio del producto en la tabla `CartItem` en el momento de la inserción. Si el vendedor actualiza el precio en el Seller App antes de que el comprador finalice la compra, la Buyer App respeta el precio del snapshot. Este acuerdo protege al comprador de cambios repentinos durante su sesión de navegación.

## ADR 009: Tracking de Envíos Externo (Coordinación con Shipping App)
Se decidió que la Buyer App no almacenará estados intermedios del envío (ej. "En Camino", "Entregado"). La Shipping App es el Single Source of Truth para la logística. La Buyer App consultará el API de Shipping en tiempo real mediante el `orderId` para mostrar la línea de tiempo de seguimiento al usuario.

## ADR 010: Delegación de Reputación y Reseñas (Coordinación con Feedback App)
Toda la lógica de calificación de productos y vendedores reside en la Feedback App. La Buyer App actúa como consumidor de estas métricas (`averageRating`) y como facilitador para la creación de nuevas reseñas, enviando los datos crudos a la Feedback App sin procesamiento local previo. La Buyer App confía en los cálculos de reputación provistos por el servicio de Feedback.

## ADR 011: Patrón Order Shadow para Historial Local (Coordinación con Payments)
Se implementó la tabla `OrderShadow` en la base de datos de la Buyer App. Esta tabla actúa como un registro histórico local de las intenciones de compra y sus resultados.
- **Por qué:** Permite que la Buyer App muestre un historial de pedidos rápido sin depender exclusivamente de llamadas a la API de Payments/Shipping para el listado básico.
- **Sincronización:** El estado inicial es `PENDING`. Se actualiza a `APPROVED` solo tras la confirmación de la Payments App. La Buyer App no es el dueño de la transacción financiera, pero sí del historial de navegación y compra del usuario.
- **Impacto:** Facilita la auditoría local y mejora la performance de la página `/orders`.

## ADR 012: Resolución de Discrepancias de Rutas de Integración (Etapa 3)
Al iniciar la integración con los repositorios reales de los demás servicios, se detectaron discrepancias entre las rutas originalmente planeadas y los contratos finales definidos por cada equipo.
* **Decisión para Feedback App:** Se acopló el cliente `FeedbackApiClient` con el contrato definitivo detallado en [jere-api-plan.md](file:///home/md/Escritorio/1ercuatri/iaw/proyecto-c-buyer-ellococasaca/docs/jere-api-plan.md). Las consultas de listado se realizan a `/api/reviews/product/:productId` y `/api/reviews/seller/:sellerId` con soporte para paginación (`?limit=100`). En el payload de creación de reseña, se adaptó el mapeo de campos locales (`ratingProduct` / `ratingSeller`) a los parámetros requeridos por la API (`productRating` / `sellerRating`).
* **Decisión para Shipping App:** El equipo de Shipping App implementó el endpoint `/api/shipments/order/[orderId]`. Consecuentemente, se procedió a la remoción completa de los mocks locales y su respectiva variable en la Buyer App, permitiendo la comunicación directa.
* **Impacto:** Conexión 100% directa y real con todos los microservicios externos (Seller, Payments, Feedback y Shipping) sin mocks activos, normalizando la interfaz de datos en el cliente local de la API de Feedback.

## ADR 013: División de Órdenes y Pagos por Vendedor (Checkout Multivendedor)
Para soportar carritos con productos de distintos vendedores sin concentrar los cobros o pedidos en un único vendedor de manera errónea:
- **Decisión:** En el momento de iniciar el checkout, los ítems del carrito son agrupados por su `sellerId`. Por cada vendedor se crea un `OrderShadow` independiente y se solicita el cobro correspondiente a la `Payments App` enviando el `sellerId` en la solicitud de cargo.
- **Impacto:** Permite acreditar los fondos correspondientes a cada vendedor y asegura que cada uno reciba únicamente sus órdenes específicas.

## ADR 014: Remoción de Entrada de Calificación del Vendedor (Feedback Inferido)
Se eliminó la opción para que el comprador califique manualmente al vendedor durante la creación de reseñas:
- **Decisión:** La `Feedback App` deduce automáticamente la reputación del vendedor a partir de las calificaciones de sus productos. Por lo tanto, el formulario de opiniones se simplificó eliminando el campo de calificación del vendedor, enviando en su lugar la puntuación del producto como valor referencial seguro en el payload de creación.
- **Impacto:** Interfaz de usuario más fluida y consistencia con la lógica inferida del servicio de reseñas.

## ADR 015: Consulta Resiliente de Órdenes al Seller App
Siguiendo los acuerdos de integración, las compras del buyer deben ser expuestas por el Seller App:
- **Decisión:** Al ingresar a `/orders`, la Buyer App solicita las órdenes correspondientes al usuario en el Seller App. Adicionalmente, el servicio realiza una mezcla resiliente combinando y ordenando cronológicamente estas órdenes con los datos locales persistidos en la tabla `OrderShadow`.
- **Impacto:** Si la Seller App está inactiva o no posee ciertos registros, el usuario no perderá su historial local gracias al respaldo de `OrderShadow`.

## ADR 016: Requerimientos de Sincronización de Sesión en Aplicaciones Satélite (Control Plane, Seller, Feedback, Shipping)
Para que la sesión iniciada en la Buyer App (Dominio Principal) sea reconocida correctamente por las demás aplicaciones del ecosistema (Control Plane, Seller App, Feedback App, Shipping App) sin forzar logins repetidos o quedar en un estado de sesión inconsistente:
- **Decisión:** Todas las aplicaciones secundarias que utilicen la misma instancia de Clerk deben ser configuradas explícitamente como **Satellite Apps** de Clerk. Esto requiere registrar cada uno de sus dominios como satélites en el dashboard principal de Clerk y configurar sus respectivas variables de entorno de satélite.
- **Impacto:** Permite al middleware y SDK de Clerk de cada aplicación procesar adecuadamente las redirecciones con tickets y mantener una sesión unificada en todos los subdominios y dominios externos del proyecto.
