"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

function RedirectContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  useEffect(() => {
    if (url) {
      window.location.replace(url);
    }
  }, [url]);

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 text-center">
      <div>
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 mb-8 animate-pulse">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
          Redirigiendo a <span className="text-blue-600">Payments</span>
        </h2>
        <p className="text-gray-500 font-medium italic mb-6">
          Te estamos conectando de forma segura con la pasarela de pagos para completar tu compra.
        </p>
      </div>

      <div className="pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        Conexión Encriptada SSL
      </div>
    </div>
  );
}

export default function CheckoutRedirectPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 text-center">
          <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
        </div>
      }>
        <RedirectContent />
      </Suspense>
    </div>
  );
}
