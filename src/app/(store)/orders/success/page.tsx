import Link from "next/link";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  if (!searchParams.orderId) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 mb-8">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">
            ¡Pago <span className="text-emerald-600">Exitoso</span>!
          </h2>
          <p className="text-gray-500 font-medium italic">
            Tu pedido ha sido confirmado y ya está en preparación.
          </p>
        </div>

        <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Número de Orden</span>
            <span className="text-sm font-bold text-gray-900 font-mono">{searchParams.orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</span>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              Confirmado
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/orders"
            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            <Package className="mr-2 h-5 w-5" />
            Ver mis pedidos
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center px-8 py-4 border-2 border-gray-100 text-sm font-black uppercase tracking-widest rounded-2xl text-gray-900 bg-white hover:bg-gray-50 transition-all"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Seguir comprando
          </Link>
        </div>

        <div className="pt-6 border-t border-gray-50">
          <p className="text-xs text-gray-400 font-medium italic">
            Te enviamos un mail con todos los detalles de tu compra.
          </p>
        </div>
      </div>
    </div>
  );
}
