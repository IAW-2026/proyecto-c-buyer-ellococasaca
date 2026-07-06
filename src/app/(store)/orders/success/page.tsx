import Link from "next/link";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const orderId = (
    typeof searchParams.orderId === "string" ? searchParams.orderId :
    typeof searchParams.order_id === "string" ? searchParams.order_id :
    typeof searchParams.external_reference === "string" ? searchParams.external_reference :
    undefined
  );

  const paymentId = typeof searchParams.payment_id === "string" ? searchParams.payment_id : undefined;

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/50 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-emerald-900/5 border border-gray-100 text-center relative z-10">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 mb-8 animate-bounce">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-2 leading-none">
            ¡Gracias por <span className="text-emerald-600 not-italic">tu compra</span>!
          </h2>
          <p className="text-emerald-700 bg-emerald-50/80 px-4 py-2 rounded-full inline-block text-xs font-black uppercase tracking-wider mb-6 border border-emerald-100">
            ¡Pago Confirmado!
          </p>
          <p className="text-gray-500 font-medium italic">
            Tu pedido ha sido registrado con éxito y ya está en preparación.
          </p>
        </div>

        {orderId ? (
          <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 text-left">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Número de Orden</span>
              <span className="text-sm font-bold text-gray-900 font-mono select-all bg-white px-3 py-1 rounded-xl border border-gray-100 shadow-sm">{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</span>
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                Confirmado
              </span>
            </div>
            {paymentId && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID de Transacción</span>
                <span className="text-xs font-semibold text-gray-500 font-mono">{paymentId}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-bold">Estado del Pago</span>
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                Aprobado
              </span>
            </div>
            {paymentId && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID de Transacción</span>
                <span className="text-xs font-semibold text-gray-500 font-mono">{paymentId}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <Link
            href="/orders"
            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
          >
            <Package className="mr-2 h-5 w-5" />
            Ver mis pedidos
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center px-8 py-4 border-2 border-gray-100 text-sm font-black uppercase tracking-widest rounded-2xl text-gray-900 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all"
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
