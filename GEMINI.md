
# Project Instructions: El Loco Casaca - Buyer App

Este archivo contiene las directrices fundamentales para el desarrollo de la Buyer App. Estas instrucciones son de cumplimiento obligatorio para asegurar la calidad y coherencia del sistema.

## 🏗 Arquitectura y Patrones
- **Clean Code & SOLID:** El código debe ser autodescriptivo. Evitar funciones de más de 20 líneas. Aplicar Inyección de Dependencias para facilitar el testing.
- **Pattern: Repository / Service:**
  - `Services`: Lógica de negocio pura.
  - `Repositories` (o `Prisma Clients` especializados): Acceso a datos.
  - `API Clients`: Abstracción de llamadas externas (Seller, Payments, Shipping). Durante la Etapa 2, estos devolverán mocks.
- **Next.js App Router:** Utilizar Server Components por defecto. Client Components solo para interactividad necesaria.

## 🔐 Autenticación y Usuarios (Clerk)
- **Single Source of Truth:** Clerk es el dueño de la identidad.
- **Sincronización:** Cada app mantiene una tabla `Users` local sincronizada vía **Webhooks**.
- **Identificador Único:** El `clerk_id` es la Primary Key global. Nunca usar IDs autoincrementales propios para identificar usuarios entre servicios.
- **Seguridad:** Validar el JWT en cada request al API.

## 🛠 Estándares de Código
- **TypeScript:** Tipado estricto. Prohibido el uso de `any`.
- **Componentes:** Seguir el patrón de "Atomic Design" simplificado (ui, layout, features).
- **Manejo de Estados:** Preferir estados locales y URL params sobre estados globales complejos.

## 📝 Documentación y Aprendizaje
- Cada feature debe venir con un breve comentario sobre el "por qué" de su diseño.
- Las decisiones de diseño que afecten la integración con otras apps deben ser documentadas en `docs/decisiones-tecnicas.md`.
