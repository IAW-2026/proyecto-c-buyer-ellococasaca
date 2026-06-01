"use client";

import { useState } from "react";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import { addToCartAction } from "@/lib/actions/cart";

interface ProductActionsProps {
  productId: string;
  sizes: string[];
  stock: number;
}

export const ProductActions = ({ productId, sizes, stock }: ProductActionsProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (sizes.length > 0 && !selectedSize) {
      setError("Por favor, seleccioná un talle");
      return;
    }

    setError(null);
    setIsPending(true);
    try {
      await addToCartAction(productId, selectedSize || undefined);
      // Disparar evento para actualizar el contador del header
      window.dispatchEvent(new Event("cart-updated"));
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Hubo un error al agregar al carrito");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Selector de Talles */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
          Talles disponibles {selectedSize && <span className="text-blue-600 ml-2">— Seleccionado: {selectedSize}</span>}
        </h3>
        <div className="flex flex-wrap gap-3">
          {sizes.map((s) => (
            <button 
              key={s} 
              onClick={() => {
                setSelectedSize(s);
                setError(null);
              }}
              className={`h-14 w-14 flex items-center justify-center border-2 rounded-2xl text-sm font-black transition-all active:scale-90 ${
                selectedSize === s 
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "border-gray-100 text-gray-900 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Botón de Acción */}
      <div className="mt-12">
        <button
          onClick={handleAdd}
          disabled={stock === 0 || isPending}
          className={`w-full border-none rounded-2xl py-5 px-8 flex items-center justify-center text-sm font-black uppercase tracking-widest text-white transition-all shadow-xl hover:shadow-2xl active:scale-[0.96] ${
            isSuccess 
              ? "bg-emerald-500 shadow-emerald-200" 
              : "bg-blue-600 shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400"
          }`}
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
          ) : isSuccess ? (
            <Check className="w-6 h-6 mr-3 stroke-[3px]" />
          ) : (
            <ShoppingCart className="w-5 h-5 mr-3 stroke-[3px]" />
          )}
          {isSuccess ? "¡Agregado!" : isPending ? "Procesando..." : stock === 0 ? "Sin Stock" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
};
