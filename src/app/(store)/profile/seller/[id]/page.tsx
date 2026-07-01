import { sellerApi } from "@/lib/api-clients/seller";
import { feedbackApi } from "@/lib/api-clients/feedback";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, ShieldCheck, User, MessageSquare, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";

export const dynamic = "force-dynamic";

interface SellerProfilePageProps {
  params: {
    id: string;
  };
}

export default async function SellerProfilePage({ params }: SellerProfilePageProps) {
  const [seller, products, rating, reviews] = await Promise.all([
    sellerApi.getSellerById(params.id),
    sellerApi.getProducts({ sellerId: params.id }),
    feedbackApi.getSellerRating(params.id),
    feedbackApi.getSellerReviews(params.id),
  ]);

  if (!seller) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors group"
        >
          <div className="bg-white p-2 rounded-lg mr-3 shadow-sm group-hover:shadow-md transition-all">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Volver al catálogo
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera del Vendedor */}
        <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-blue-900/5 border border-gray-100 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-xl shadow-blue-200">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 uppercase italic">
                    {seller.name}
                  </h1>
                  {seller.isVerified && (
                    <div className="bg-emerald-50 p-1.5 rounded-full border border-emerald-100" title="Vendedor Verificado">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}
                </div>
                <p className="text-gray-500 font-medium max-w-xl italic">
                  "{seller.description}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-[32px] border border-gray-100">
              <div className="text-center px-6 border-r border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="text-3xl font-black text-gray-900">
                    {(rating?.averageRating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Reputación
                </span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-black text-gray-900">{rating?.totalReviews || 0}</span>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  Ventas totales
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Listado de Productos */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">
                Productos de <span className="text-blue-600">este vendedor</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Últimas Reseñas */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">
                Últimas <span className="text-blue-600">experiencias</span>
              </h2>
            </div>

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.ratingProduct ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 italic font-medium text-sm mb-4 leading-relaxed">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-[10px] font-black uppercase tracking-tight text-gray-400">
                        Comprador Verificado
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-[32px] border-2 border-dashed border-gray-100 text-center">
                  <p className="text-gray-400 font-bold italic uppercase tracking-tight">
                    Aún no hay reseñas para este vendedor
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}