import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Shirt } from "lucide-react";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import CartCount from "@/components/layout/CartCount";
import { LoadingLink } from "@/components/ui/LoadingLink";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "El Loco Casaca | Tu Marketplace de Camisetas",
  description: "La selección más completa de camisetas de fútbol retro y actuales. Comprá con seguridad en El Loco Casaca.",
  keywords: ["camisetas de futbol", "camisetas retro", "comprar camisetas", "el loco casaca"],
  authors: [{ name: "El Loco Casaca Team" }],
  openGraph: {
    title: "El Loco Casaca | Tu Marketplace de Camisetas",
    description: "La selección más completa de camisetas de fútbol retro y actuales.",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" className={inter.variable}>
        <body className={inter.className}>
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-20 items-center">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center gap-2.5 group" aria-label="Volver al inicio">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-blue-200 shadow-lg">
                      <Shirt className="h-6 w-6 text-white group-hover:scale-110 transition-transform" aria-hidden="true" />
                    </div>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                      El Loco <span className="text-blue-600 not-italic">Casaca</span>
                    </span>
                  </Link>
                </div>
                
                <div className="flex items-center gap-6">
                  <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-500">
                    <LoadingLink href="/" className="hover:text-blue-600 transition-colors">Inicio</LoadingLink>
                    <LoadingLink href="/products" className="hover:text-blue-600 transition-colors">Catálogo</LoadingLink>
                    <SignedIn>
                      <LoadingLink href="/orders" className="hover:text-blue-600 transition-colors">Mis Pedidos</LoadingLink>
                    </SignedIn>
                  </nav>
                  
                  <div className="flex items-center gap-4 border-l pl-6 border-gray-100">
                    <CartCount />

                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
                          Ingresar
                        </button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "h-10 w-10 rounded-xl"
                          }
                        }}
                      />
                    </SignedIn>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
