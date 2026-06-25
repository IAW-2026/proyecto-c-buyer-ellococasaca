"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ShieldCheck, Store, MessageSquare, Truck, ArrowRight, LogOut, Pause, Play, Loader2 } from "lucide-react";

function RedirectingContent() {
  const searchParams = useSearchParams();

  const role = searchParams.get("role") || "usuario";
  const to = searchParams.get("to") || "/";

  const [countdown, setCountdown] = useState(4);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    if (countdown <= 0) {
      window.location.replace(to);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, to, isPaused]);

  // Determine role styling and names
  const isRoleAdmin = role === "admin";
  const isRoleSeller = role === "seller";
  const isRoleModerator = role === "moderator";
  const isRoleShipping = role === "shipping";
  
  const roleName = isRoleAdmin 
    ? "Administrador" 
    : isRoleSeller 
      ? "Vendedor" 
      : isRoleModerator
        ? "Moderador"
        : isRoleShipping
          ? "Repartidor / Envío (Shipping)"
          : role;

  const targetName = isRoleAdmin 
    ? "Control Plane" 
    : isRoleSeller 
      ? "Panel del Vendedor" 
      : isRoleModerator
        ? "Panel de Feedback"
        : isRoleShipping
          ? "Panel de Envíos (Shipping)"
          : "Panel de Destino";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/80 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 p-8 sm:p-10 text-center relative z-10">
        {/* Role Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-3xl bg-blue-50 mb-8 border border-blue-100 shadow-sm">
          {isRoleAdmin ? (
            <ShieldCheck className="h-10 w-10 text-blue-600 animate-pulse" />
          ) : isRoleSeller ? (
            <Store className="h-10 w-10 text-blue-600 animate-pulse" />
          ) : isRoleModerator ? (
            <MessageSquare className="h-10 w-10 text-blue-600 animate-pulse" />
          ) : isRoleShipping ? (
            <Truck className="h-10 w-10 text-blue-600 animate-pulse" />
          ) : (
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4 leading-none">
          Redirección de <span className="text-blue-600 not-italic">Rol</span>
        </h1>

        {/* Description */}
        <div className="space-y-4 mb-8">
          <p className="text-gray-600 font-medium leading-relaxed">
            Hola, detectamos que iniciaste sesión como <strong className="text-blue-700 bg-blue-50/50 px-2 py-0.5 rounded-md font-bold">{roleName}</strong>.
          </p>
          <p className="text-sm text-gray-500 font-medium">
            Serás redirigido automáticamente a la aplicación de <strong className="text-gray-700">{targetName}</strong>:
          </p>
          
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-3 text-xs font-semibold text-gray-500 break-all select-all flex items-center justify-center gap-2">
            <span>{to}</span>
          </div>
        </div>

        {/* Circular Progress & Countdown */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative flex items-center justify-center h-24 w-24 mb-3">
            {/* Background ring */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="#F3F4F6"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Animated progress ring */}
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="#2563EB"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="238.76"
                strokeDashoffset={isPaused ? 0 : 238.76 - (238.76 * (countdown / 4))}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="text-3xl font-black text-blue-600 italic tracking-tighter">
              {countdown}s
            </span>
          </div>

          {/* Pause / Resume control */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
            aria-label={isPaused ? "Reanudar redirección" : "Pausar redirección"}
          >
            {isPaused ? (
              <>
                <Play className="h-3.5 w-3.5" /> Reanudar
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5" /> Pausar
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.replace(to)}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Ir ahora
            <ArrowRight className="h-5 w-5" />
          </button>

          <Link
            href="/logout"
            className="w-full border-2 border-red-100 text-red-500 hover:bg-red-50/50 hover:border-red-200 py-4 px-6 rounded-2xl font-bold uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RedirectingPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-700">Cargando redirección...</h2>
          </div>
        </div>
      }
    >
      <RedirectingContent />
    </Suspense>
  );
}
