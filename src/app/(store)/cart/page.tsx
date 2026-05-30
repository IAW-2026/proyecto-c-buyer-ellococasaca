import { cartService } from "@/services/cart.service";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from "lucide-react";
import { removeFromCartAction, updateCartItemQuantityAction } from "@/lib/actions/cart";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CartRefreshTrigger } from "@/components/cart/CartRefreshTrigger";

export default async function CartPage({
  searchParams,
}: {
  searchParams: { error?: string; orderId?: string };
}) {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const cart = await cartService.getCart(userId);

  const total = cart?.items.reduce((sum, item) => sum + item.priceAtAdded * item.quantity, 0) || 0;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <CartRefreshTrigger />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {searchParams.error === 'payment_rejected' && (
          <div className="mb-8 bg-red-50 border-2 border-red-100 p-6 rounded-[32px] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-red-500 p-2 rounded-xl">
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-red-900">Pago Rechazado</h3>
              <p className="text-sm text-red-600 font-medium italic">
                Hubo un problema al procesar tu pago para la orden <span className="font-mono font-bold">{searchParams.orderId}</span>. Por favor, intentá con otro método.
              </p>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Tu Carrito</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">Tu carrito está vacío</h2>
            <p className="mt-2 text-sm text-gray-500">¿Buscás algo especial? Revisá nuestro catálogo.</p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Ir a la tienda
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-7">
              <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {cart.items.map((item) => {
                  const removeAction = removeFromCartAction.bind(null, item.id);
                  const decreaseAction = updateCartItemQuantityAction.bind(null, item.id, item.productId, item.quantity - 1);
                  const increaseAction = updateCartItemQuantityAction.bind(null, item.id, item.productId, item.quantity + 1);

                  return (
                    <li key={item.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link href={`/products/${item.productId}`} className="font-bold text-gray-700 hover:text-gray-800">
                                  {item.productName}
                                </Link>
                              </h3>
                            </div>
                            
                            <div className="mt-4 flex items-center gap-3">
                              <form action={decreaseAction}>
                                <button className="p-1 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                                  <Minus className="h-4 w-4 text-gray-600" />
                                </button>
                              </form>
                              
                              <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                              
                              <form action={increaseAction}>
                                <button className="p-1 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                                  <Plus className="h-4 w-4 text-gray-600" />
                                </button>
                              </form>
                            </div>

                            <p className="mt-3 text-sm font-medium text-gray-900">
                              ${(item.priceAtAdded * item.quantity).toLocaleString('es-AR')}
                            </p>
                            <p className="mt-0.5 text-[10px] text-blue-600 font-semibold italic">
                              ${item.priceAtAdded.toLocaleString('es-AR')} c/u (congelado)
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <div className="absolute top-0 right-0">
                              <form action={removeAction}>
                                <button
                                  type="submit"
                                  className="-m-2 inline-flex p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <span className="sr-only">Eliminar</span>
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Resumen del pedido */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-2xl bg-white px-4 py-6 shadow-sm border border-gray-100 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2 id="summary-heading" className="text-lg font-bold text-gray-900">
                Resumen del pedido
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">${total.toLocaleString('es-AR')}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Envío</span>
                  </dt>
                  <dd className="text-sm font-medium text-green-600">¡GRATIS!</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-bold text-gray-900">Total</dt>
                  <dd className="text-base font-bold text-gray-900">${total.toLocaleString('es-AR')}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 border border-transparent rounded-xl shadow-sm py-3 px-4 text-base font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center justify-center group"
                >
                  Continuar al pago
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="mt-4 text-center">
                 <p className="text-xs text-gray-500 italic">
                   Los precios se mantienen congelados por 24 horas.
                 </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
