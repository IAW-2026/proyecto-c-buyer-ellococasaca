# El Loco Casaca - Buyer App 👕⚽

Bienvenido a la **Buyer App** de "El Loco Casaca", el marketplace definitivo para amantes de las camisetas de fútbol. Esta aplicación permite a los usuarios buscar, comprar y seguir sus pedidos de forma sencilla y segura.

## 🚀 Tecnologías
- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Auth:** Clerk (Identidad Centralizada)
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Estilos:** Tailwind CSS

## 🏗️ Arquitectura
La aplicación sigue principios de **Clean Code** y **SOLID**. Las decisiones arquitectónicas están documentadas en [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md).

Puntos clave:
- **Snapshotting de precios:** Los precios se congelan al añadir al carrito.
- **Identidad:** Sincronización con Clerk vía Webhooks.
- **Aislamiento (Etapa 2):** Consumo de APIs externas mediante Mocks.

## 🛠️ Configuración Local
1. Clonar el repositorio.
2. Instalar dependencias: `npm install`.
3. Configurar variables de entorno en `.env.local` (ver `.env.example`).
4. Levantar base de datos y correr migraciones: `npx prisma migrate dev`.
5. Iniciar servidor: `npm run dev`.

## 📂 Estructura de Carpetas
Ver [`GEMINI.md`](GEMINI.md) para detalles sobre la organización del código y mandatos del proyecto.
