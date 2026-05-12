# Configuración de Autenticación Centralizada (Clerk)

Este documento detalla cómo gestionar la identidad y la sesión de usuario en el ecosistema de 5 aplicaciones de **El Loco Casaca**.

## 🔐 Single Source of Truth (SSoT)
Clerk es el único dueño de la identidad. Ninguna aplicación debe gestionar contraseñas o datos sensibles de login. El `clerk_id` es el identificador universal que vincula a un usuario entre todos los servicios (Buyer, Seller, Payments, Shipping, Feedback).

## 🚀 Variables de Entorno Compartidas
Para que la sesión sea válida en todas las aplicaciones y el usuario no tenga que loguearse de nuevo al cambiar de app, las siguientes variables **DEBEN ser idénticas** en todos los archivos `.env` del proyecto:

```env
# Clerk API Keys (Deben ser las mismas en las 5 apps)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## 🔄 Sincronización vía Webhooks
Cada aplicación que necesite persistir datos básicos del usuario (como nombre o email para reportes locales) debe implementar un webhook que escuche los eventos de Clerk:

1.  **Evento:** `user.created` o `user.updated`.
2.  **Validación:** Usar `CLERK_WEBHOOK_SECRET` (específico para cada endpoint de webhook configurado en el dashboard de Clerk).
3.  **Acción:** Realizar un `upsert` en la tabla `User` local usando el `clerk_id` como clave primaria.

## 🛡️ Middleware y Protección de Rutas
Cada app es responsable de proteger sus propias rutas sensibles utilizando el `clerkMiddleware`. 

- **Buyer App:** Protege `/cart`, `/orders`, `/profile`.
- **Seller App:** Protege `/dashboard`, `/inventory`, `/settings`.

## 🎨 Consistencia de UI
Se recomienda configurar el componente `<ClerkProvider>` en el `layout.tsx` raíz de cada app con un tema consistente para que la experiencia de usuario sea fluida al navegar entre los diferentes dominios del marketplace.
