import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/cart(.*)',
  '/orders(.*)',
  '/profile(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  console.log(`[Middleware Request] Pathname: ${req.nextUrl.pathname}`);
  const session = auth();
  const { userId, sessionClaims } = session;

  if (userId) {
    // 0. Si el usuario intenta acceder a rutas de autenticación o cierre de sesión, permitimos el flujo normal
    const isAuthRoute = req.nextUrl.pathname.startsWith('/sign-in') || 
                        req.nextUrl.pathname.startsWith('/sign-up') || 
                        req.nextUrl.pathname.startsWith('/sign-out') ||
                        req.nextUrl.pathname.startsWith('/logout') ||
                        req.nextUrl.pathname.startsWith('/redirecting');
    if (isAuthRoute) {
      return NextResponse.next();
    }

    // Intentamos obtener el rol de Clerk JWT Claims (en metadata o publicMetadata)
    const publicMetadata = (sessionClaims?.publicMetadata || sessionClaims?.metadata || {}) as any;
    let roleClaim = publicMetadata.role || sessionClaims?.role;

    console.log(`[Middleware Check] User: ${userId}`);
    console.log(`- Detected Role Claim in JWT:`, roleClaim);

    // Fallback: si no está en el token JWT, consultamos a la API de Clerk directamente
    if (!roleClaim) {
      try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const client = clerkClient();
        const user = await client.users.getUser(userId);
        const userMetadata = user.publicMetadata as any;
        roleClaim = userMetadata?.role;
        console.log(`- Fallback Clerk API Detected Role:`, roleClaim);
      } catch (err) {
        console.error("Failed to fetch user from Clerk API fallback:", err);
      }
    }

    // Normalizamos el rol a un array de strings para manejar tanto rol único como múltiples
    const roles: string[] = Array.isArray(roleClaim)
      ? roleClaim.map(r => String(r).toLowerCase())
      : roleClaim
        ? [String(roleClaim).toLowerCase()]
        : [];

    const isSeller = roles.includes("seller");
    const isAdmin = roles.includes("admin");
    const isModerator = roles.includes("moderator");
    const isShipping = roles.includes("shipping");
    const isBuyer = roles.includes("buyer") || roles.length === 0; // Por defecto es buyer si no tiene rol

    // 1. Redirecciones basadas en rol (Proxy) - Solo para navegación de páginas, no APIs
    const isApiRequest = req.nextUrl.pathname.startsWith('/api/') || req.nextUrl.pathname.startsWith('/_next/');
    if (!isApiRequest) {
      if (isSeller) {
        const sellerUrl = process.env.SELLER_APP_URL || process.env.SELLER_API_URL || "https://proyecto-c-seller-ellococasaca.vercel.app";
        console.log(`[Middleware Redirect] Redirecting seller to intermediary page`);
        const redirectUrl = new URL(`/redirecting`, req.url);
        redirectUrl.searchParams.set("role", "seller");
        redirectUrl.searchParams.set("to", sellerUrl);
        return NextResponse.redirect(redirectUrl);
      }

      if (isAdmin) {
        const adminUrl = process.env.CONTROL_PLANE_APP_URL || "https://etapa-3-control-plane-ellococasaca.vercel.app";
        console.log(`[Middleware Redirect] Redirecting admin to intermediary page`);
        const redirectUrl = new URL(`/redirecting`, req.url);
        redirectUrl.searchParams.set("role", "admin");
        redirectUrl.searchParams.set("to", adminUrl);
        return NextResponse.redirect(redirectUrl);
      }

      if (isModerator) {
        const feedbackUrl = process.env.FEEDBACK_APP_URL || process.env.FEEDBACK_API_URL || "https://proyecto-web-feedback-ellococasaca.vercel.app";
        console.log(`[Middleware Redirect] Redirecting moderator to intermediary page`);
        const redirectUrl = new URL(`/redirecting`, req.url);
        redirectUrl.searchParams.set("role", "moderator");
        redirectUrl.searchParams.set("to", feedbackUrl);
        return NextResponse.redirect(redirectUrl);
      }

      if (isShipping) {
        const shippingUrl = process.env.SHIPPING_APP_URL || process.env.SHIPPING_API_URL || "https://proyecto-c-shipping2-ellococasaca.vercel.app";
        console.log(`[Middleware Redirect] Redirecting shipping to intermediary page`);
        const redirectUrl = new URL(`/redirecting`, req.url);
        redirectUrl.searchParams.set("role", "shipping");
        redirectUrl.searchParams.set("to", shippingUrl);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // 2. Proteger la Buyer App: si intenta acceder a rutas protegidas y no es buyer, denegar acceso
    if (isProtectedRoute(req) && !isBuyer) {
      return new NextResponse("Acceso no autorizado: se requiere rol de comprador (buyer).", { status: 403 });
    }
  }

  // 3. Flujo normal de protección para rutas protegidas del Buyer
  if (isProtectedRoute(req)) {
    session.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
