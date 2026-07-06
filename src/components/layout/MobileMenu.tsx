"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Shirt, Receipt, ShoppingBag, LogOut, ChevronRight } from "lucide-react";
import { LoadingLink } from "@/components/ui/LoadingLink";
import { SignedIn, SignedOut, SignInButton, useClerk } from "@clerk/nextjs";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  // Asegurar que el portal se renderice únicamente en el cliente (evitar problemas de SSR)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevenir scroll en la página de fondo cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const menuItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/products", label: "Catálogo", icon: Shirt },
  ];

  return (
    <div className="md:hidden">
      {/* Botón de hamburguesa */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2.5 bg-gray-50 text-gray-700 hover:text-blue-600 rounded-xl transition-all border border-gray-100 flex items-center justify-center active:scale-95"
        aria-label="Abrir menú de navegación"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop y Drawer renderizados en la raíz del body mediante React Portal */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop animado con desenfoque */}
          <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel del Drawer */}
          <div className="relative w-80 max-w-[85vw] bg-white h-[100dvh] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            {/* Header del menú */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <span className="text-lg font-black text-gray-900 tracking-tight uppercase italic">
                Menú <span className="text-blue-600 not-italic">Navegación</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Enlaces de navegación */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
              <p className="px-3 text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Secciones</p>
              
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <LoadingLink
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all group ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600 transition-colors"}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100 text-blue-600" : "text-gray-400"}`} />
                  </LoadingLink>
                );
              })}

              <SignedIn>
                <LoadingLink
                  href="/orders"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all group ${
                    pathname === "/orders"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Receipt className={`h-5 w-5 ${pathname === "/orders" ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600 transition-colors"}`} />
                    <span>Mis Pedidos</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${pathname === "/orders" ? "opacity-100 text-blue-600" : "text-gray-400"}`} />
                </LoadingLink>
              </SignedIn>

              <div className="h-px bg-gray-100 my-6" />

              <p className="px-3 text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Compra</p>
              <LoadingLink
                href="/cart"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all group ${
                  pathname === "/cart"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <ShoppingBag className={`h-5 w-5 ${pathname === "/cart" ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600 transition-colors"}`} />
                  <span>Carrito de Compras</span>
                </div>
                <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${pathname === "/cart" ? "opacity-100 text-blue-600" : "text-gray-400"}`} />
              </LoadingLink>
            </div>

            {/* Footer / Autenticación */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-200">
                    Ingresar
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ redirectUrl: "/" });
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-red-100 text-red-500 py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-red-50 active:scale-95 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </SignedIn>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
