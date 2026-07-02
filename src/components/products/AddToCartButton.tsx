"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { addToCartAction } from "@/lib/actions/cart";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
}

export const AddToCartButton = ({ productId, disabled }: AddToCartButtonProps) => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAdd = async () => {
    setIsPending(true);
    try {
      await addToCartAction(productId);
      // Disparar evento global para que el header actualice el contador al instante
      window.dispatchEvent(new Event("cart-updated"));

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={disabled || isPending}
      className={`w-full border-none rounded-2xl py-5 px-8 flex items-center justify-center text-sm font-black uppercase tracking-widest text-white transition-all shadow-xl hover:shadow-2xl active:scale-[0.96] ${
        isSuccess 
          ? "bg-emerald-500 shadow-emerald-200" 
          : "bg-blue-600 shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400"
      }`}
    >
      {isPending ? (
        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-3" />
      ) : isSuccess ? (
        <Check className="w-6 h-6 mr-3 stroke-[3px]" />
      ) : (
        <ShoppingCart className="w-5 h-5 mr-3 stroke-[3px]" />
      )}
      {isSuccess ? "¡Agregado!" : isPending ? "Procesando..." : "Agregar al carrito"}
    </button>
  );
};
