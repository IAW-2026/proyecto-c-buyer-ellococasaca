import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ShoppingCart, Shirt } from "lucide-react";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "El Loco Casaca | Buyer App",
  description: "Tu marketplace de camisetas de fútbol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className={inter.className}>
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-20 items-center">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-blue-200 shadow-lg">
                      <Shirt className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                      El Loco <span className="text-blue-600 not-italic">Casaca</span>
                    </span>
                  </Link>
                </div>
                
                <div className="flex items-center gap-6">
                  <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-500">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
                    <Link href="/products" className="hover:text-blue-600 transition-colors">Catálogo</Link>
                  </nav>
                  
                  <div className="flex items-center gap-4 border-l pl-6 border-gray-100">
                    <Link 
                      href="/cart" 
                      className="group p-2.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full transition-all relative"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        0
                      </span>
                    </Link>

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
