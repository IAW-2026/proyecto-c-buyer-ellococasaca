import { orderService } from "@/services/order.service";
import { shippingApi } from "@/lib/api-clients/shipping";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, Truck, CheckCircle2, MapPin, Calendar, CreditCard } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const order = await orderService.getOrderById(params.id);

  if (!order || order.userId !== userId) {
    notFound();
  }

  const shipment = await shippingApi.getShipmentByOrderId(order.id);

  const steps = [
    { label: 'Procesando', status: 'PENDING', icon: Package, done: true },
    { label: 'En camino', status: 'SHIPPED', icon: Truck, done: shipment?.status === 'SHIPPED' || shipment?.status === 'DELIVERED' },
    { label: 'Entregado', status: 'DELIVERED', icon: CheckCircle2, done: shipment?.status === 'DELIVERED' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/orders" 
          className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors group"
        >
          <div className="bg-white p-2 rounded-lg mr-3 shadow-sm group-hover:shadow-md transition-all">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Volver a mis pedidos
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          {/* Header de la Orden */}
          <div className="bg-blue-600 p-8 lg:p-12 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-70">ID de Orden</span>
                  <span className="text-sm font-bold font-mono bg-blue-700 px-3 py-1 rounded-lg">{order.externalOrderId}</span>
                </div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                  Detalles del <span className="text-blue-200">Pedido</span>
                </h1>
              </div>
              <div className="text-left md:text-right">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70 block mb-1">Total Pagado</span>
                <span className="text-4xl font-black italic tracking-tighter">${order.totalAmount.toLocaleString('es-AR')}</span>
              </div>
            </div>
          </div>

          {/* Línea de Tiempo de Tracking */}
          <div className="p-8 lg:p-12 border-b border-gray-50">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">
                Seguimiento en <span className="text-blue-600">tiempo real</span>
              </h2>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-1000" 
                style={{ width: shipment?.status === 'DELIVERED' ? '100%' : shipment?.status === 'SHIPPED' ? '50%' : '0%' }}
              />
              
              <div className="relative flex justify-between">
                {steps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                      step.done ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-gray-300 border-2 border-gray-100'
                    }`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className={`mt-4 text-[10px] font-black uppercase tracking-widest ${
                      step.done ? 'text-blue-600' : 'text-gray-300'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {shipment?.trackingCode && (
              <div className="mt-12 bg-gray-50 p-6 rounded-[32px] border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">Código de seguimiento</span>
                    <span className="text-lg font-bold text-gray-900 font-mono">{shipment.trackingCode}</span>
                  </div>
                </div>
                <button className="bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                  Copiar Código
                </button>
              </div>
            )}
          </div>

          {/* Información Adicional */}
          <div className="p-8 lg:p-12 grid md:grid-cols-2 gap-12 bg-gray-50/30">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Dirección de Envío</h3>
                  <p className="text-lg font-bold text-gray-900 italic uppercase tracking-tight">
                    Av. Alem 1253, 4to B<br />
                    Bahía Blanca, Buenos Aires
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Método de Pago</h3>
                  <p className="text-lg font-bold text-gray-900 italic uppercase tracking-tight">
                    Tarjeta de Crédito • **** 4589
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Fecha del Pedido</h3>
                  <p className="text-lg font-bold text-gray-900 italic uppercase tracking-tight">
                    {new Date(order.createdAt).toLocaleDateString('es-AR', { dateStyle: 'long' })}
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Nota del Vendedor</p>
                <p className="text-sm font-medium text-blue-900 italic">
                  "Tu pedido está siendo preparado con el mayor cuidado. ¡Gracias por confiar en El Loco Casaca!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
