"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useClerk();

  useEffect(() => {
    // Calls Clerk global sign-out to clear both localhost and central cookies, then forces a full page reload
    signOut().then(() => {
      window.location.replace("/");
    }).catch((err) => {
      console.error("Sign out failed, redirecting anyway:", err);
      window.location.replace("/");
    });
  }, [signOut]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 mb-8 animate-pulse">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
          Cerrando <span className="text-blue-600">Sesión</span>
        </h2>
        <p className="text-gray-500 font-medium italic">
          Borrando credenciales de forma segura...
        </p>
      </div>
    </div>
  );
}
