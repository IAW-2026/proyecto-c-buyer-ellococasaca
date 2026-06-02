# El Loco Casaca - Buyer App

Este repositorio contiene la **Buyer App** para el proyecto "El Loco Casaca", un marketplace de camisetas de fútbol desarrollado para la materia Ingeniería de Aplicaciones Web (2026).

## 🚀 Deploy

La aplicación se encuentra deployada y funcional en Vercel:
👉 **[Ver Aplicación en Producción](https://proyecto-c-buyer-ellococasaca-8d6im3796-mdiomedis-projects.vercel.app/)**

## Usuarios de Prueba (Etapa 2)

La aplicación utiliza Clerk para la autenticación y datos mockeados para simular la integración con los otros microservicios (Seller, Payments, Shipping, Feedback). 

Para evaluar la aplicación, podés registrarte creando una cuenta nueva, o utilizar esta cuenta de prueba

| Rol | Email | Contraseña | ¿Qué podés probar? |
| :--- | :--- | :--- | :--- |
| **Comprador** | `comprador@ellococasaca.com` | `TestPassword123!` | Navegar catálogo, agregar al carrito, simular checkout y ver historial de órdenes. |






## 📦 Funcionalidades Implementadas

Según los requisitos de la Etapa 2, esta aplicación incluye:
- [x] Catálogo completo de productos con filtros combinados (Liga, Equipo, Selección, Precio, Stock).
- [x] Detalle de producto con opciones de talle e integración visual de reseñas.
- [x] Carrito de compras con persistencia en Base de Datos y "Snapshotting" de precios.
- [x] Checkout simulado con integración a Payments App (Mock).
- [x] Historial de compras (Order Shadowing) y seguimiento simulado de envíos.
- [x] Webhooks de Clerk para mantener sincronizada la tabla local de usuarios.


   
