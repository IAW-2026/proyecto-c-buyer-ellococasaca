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
