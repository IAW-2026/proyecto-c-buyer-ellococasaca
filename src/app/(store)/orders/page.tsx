import { orderService } from "@/services/order.service";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Package, Clock, CheckCircle2, Truck } from "lucide-react";

export default async function OrdersPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await orderService.getOrdersByUser(userId);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">
            Mis <span className="text-blue-600">Pedidos</span>
          </h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Link 
                key={order.id} 
                href={`/orders/${order.id}`}
                className="block bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${
                      order.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 
                      order.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {order.status === 'PAID' ? <CheckCircle2 className="w-8 h-8" /> : 
                       order.status === 'PENDING' ? <Clock className="w-8 h-8" /> : <Package className="w-8 h-8" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID de Orden</span>
                        <span className="text-sm font-bold text-gray-900 font-mono">{order.externalOrderId}</span>
                      </div>
                      <p className="text-xl font-black text-gray-900 uppercase italic tracking-tight">
                        Total: ${order.totalAmount.toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Estado</span>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                        order.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-gray-50 text-gray-400 border border-gray-200'
                      }`}>
                        {order.status === 'PAID' ? 'Pagado' : 
                         order.status === 'PENDING' ? 'Pendiente' : order.status}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Realizado el {new Date(order.createdAt).toLocaleDateString('es-AR')}</span>
                  <span className="flex items-center gap-2">
                    <Truck className="w-3 h-3" />
                    Envío a domicilio
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-xl font-bold text-gray-400 uppercase tracking-tight italic">
              Aún no tienes pedidos. ¡Es hora de comprar tu primera casaca!
            </p>
            <Link 
              href="/" 
              className="inline-block mt-8 bg-blue-600 text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors"
            >
              Ir al catálogo
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
