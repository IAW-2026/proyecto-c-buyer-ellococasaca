"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  total: number;
}

export function CheckoutButton({ total }: CheckoutButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 border border-transparent rounded-[32px] shadow-2xl shadow-blue-200 py-6 px-4 text-xl font-black uppercase italic tracking-widest text-white hover:bg-blue-700 transition-all flex items-center justify-center group disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          Procesando Pago...
          <Loader2 className="ml-3 h-6 w-6 animate-spin" />
        </>
      ) : (
        <>
          Confirmar y Pagar ${total.toLocaleString('es-AR')}
          <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
        </>
      )}
    </button>
  );
}
