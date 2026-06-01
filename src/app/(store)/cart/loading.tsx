import { ShoppingCart, Loader2 } from "lucide-react";

export default function CartLoading() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="bg-blue-600 p-6 rounded-[32px] shadow-2xl shadow-blue-200 animate-pulse">
          <ShoppingCart className="h-12 w-12 text-white" />
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          <span className="text-sm font-black uppercase tracking-widest text-gray-400">Preparando tu carrito...</span>
        </div>
      </div>
    </div>
  );
}
