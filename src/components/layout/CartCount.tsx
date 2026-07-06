"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function CartCount() {
  const [count, setCount] = useState<number | null>(null);
  const pathname = usePathname();

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/cart/count");
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  // Actualizar cuando cambia la ruta (navegación)
  useEffect(() => {
    fetchCount();
  }, [pathname]);

  // Escuchar un evento personalizado para actualizaciones instantáneas
  useEffect(() => {
    window.addEventListener("cart-updated", fetchCount);
    return () => window.removeEventListener("cart-updated", fetchCount);
  }, []);

  return (
    <Link 
      href="/cart" 
      className="group p-2.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full transition-all relative"
    >
      <ShoppingCart className="h-6 w-6" />
      {count !== null && count > 0 ? (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in zoom-in duration-300">
          {count > 9 ? '9+' : count}
        </span>
      ) : count === 0 ? (
        <span className="absolute -top-1 -right-1 bg-gray-300 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
          0
        </span>
      ) : (
        /* Skeleton o placeholder mientras carga */
        <span className="absolute -top-1 -right-1 bg-gray-100 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-pulse" />
      )}
    </Link>
  );
}
