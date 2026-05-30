import { cartService } from "@/services/cart.service";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkoutAction } from "@/lib/actions/cart";
import { MapPin, CreditCard, ShieldCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";

export default async function CheckoutPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  const cart = await cartService.getCart(userId);
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const total = cart.items.reduce((sum, item) => sum + item.priceAtAdded * item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/cart" 
          className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors group"
        >
          <div className="bg-white p-2 rounded-lg mr-3 shadow-sm group-hover:shadow-md transition-all">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Volver al carrito
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Formulario de Checkout */}
          <div className="flex-1 space-y-8">
            <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-blue-900/5 border border-gray-100">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">
                  Datos de <span className="text-blue-600">Envío</span>
                </h2>
              </div>

              <form action={checkoutAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nombre Completo</label>
                    <input 
                      type="text" 
                      defaultValue={`${user.firstName} ${user.lastName}`}
                      className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Ej: Juan Pérez"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email de Contacto</label>
                    <input 
                      type="email" 
                      defaultValue={user.emailAddresses[0].emailAddress}
                      className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="ejemplo@mail.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Dirección de Entrega</label>
                  <input 
                    name="address"
                    type="text" 
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Calle, Número, Depto, Ciudad"
                    required
                  />
                </div>

                <div className="pt-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">
                      Método de <span className="text-blue-600">Pago</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <label className="relative flex flex-col p-8 bg-blue-50 border-2 border-blue-600 rounded-[32px] cursor-pointer group shadow-xl shadow-blue-100/50">
                      <input type="radio" name="payment" value="mp" defaultChecked className="sr-only" />
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                           <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="h-6 w-6 rounded-full border-4 border-blue-600 bg-white ring-4 ring-blue-100" />
                      </div>
                      <span className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Mercado Pago</span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-2 italic">Opción única habilitada para esta etapa</span>
                      <p className="mt-4 text-sm text-gray-500 font-medium italic leading-relaxed">
                        Serás redirigido a la plataforma segura de Mercado Pago para completar tu transacción.
                      </p>
                    </label>
                  </div>
                </div>

                <div className="pt-12">
                  <CheckoutButton total={total} />
                  <p className="text-center mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Transacción encriptada y segura
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Resumen Lateral */}
          <div className="lg:w-96">
            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 sticky top-32">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-900 mb-6">Resumen</h3>
              
              <div className="space-y-4 mb-8">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                      <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black uppercase italic tracking-tighter text-gray-900 truncate">{item.productName}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Cant: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-gray-900">${(item.priceAtAdded * item.quantity).toLocaleString('es-AR')}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-green-600">
                  <span>Envío</span>
                  <span className="uppercase font-black">Gratis</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-gray-900 italic tracking-tighter pt-2">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
