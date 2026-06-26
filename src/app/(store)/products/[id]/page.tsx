import { sellerApi } from "@/lib/api-clients/seller";
import { feedbackApi } from "@/lib/api-clients/feedback";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Star, MessageSquare, Send } from "lucide-react";
import { ProductActions } from "@/components/products/ProductActions";
import { getLeagueById, getTeamById } from "@/lib/catalog/leagues";
import { getNationalTeamById } from "@/lib/catalog/national-teams";
import { auth } from "@clerk/nextjs/server";
import { submitReviewAction } from "@/lib/actions/feedback";

interface ProductPageProps {
  params: {
    id: string;
  };
  searchParams: {
    orderId?: string;
    error?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params, searchParams }: ProductPageProps) {
  const { userId } = auth();
  
  const [product, reviews, rating] = await Promise.all([
    sellerApi.getProductById(params.id),
    feedbackApi.getProductReviews(params.id),
    feedbackApi.getProductRating(params.id),
  ]);

  if (!product) {
    notFound();
  }

  const seller = await sellerApi.getSellerById(product.sellerId);

  // Chequeo de producto entregado para habilitar reseña
  let canReview = false;
  let currentOrderId = searchParams.orderId || "mock_order_123";

  if (userId) {
    const eligibility = await feedbackApi.checkReviewEligibility(params.id);
    canReview = eligibility.canReview;
    if (eligibility.orderId) {
      currentOrderId = eligibility.orderId;
    }
  }

  const leagueName = product.leagueId ? getLeagueById(product.leagueId)?.name : undefined;
  const teamName = product.teamId ? getTeamById(product.teamId)?.team.name ?? product.team : product.team;
  const nationalTeamName = product.nationalTeamId
    ? getNationalTeamById(product.nationalTeamId)?.name ?? product.team
    : product.team;
  const categoryLabel =
    product.kind === "NATIONAL_TEAM" ? "Selecciones" : product.kind === "CLUB" ? "Clubes" : product.category;
  const subtitle = product.kind === "NATIONAL_TEAM" ? nationalTeamName : teamName;

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
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-blue-900/5 border border-gray-100">
          {/* Imagen del producto */}
          <div className="aspect-[4/5] w-full overflow-hidden rounded-[32px] bg-slate-50 relative group">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>

          {/* Información del producto */}
          <div className="mt-10 lg:mt-0">
            <div className="flex flex-col">
              <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4">
                {categoryLabel} • {product.season}
              </span>
              
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-[0.9] uppercase italic">
                  {product.title}
                </h1>
                
                {rating && (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-yellow-400 px-3 py-1 rounded-full shadow-lg shadow-yellow-200">
                      <Star className="w-4 h-4 text-white fill-current" />
                      <span className="text-sm font-black text-white">{rating.averageRating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                      {rating.totalReviews} reseñas
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-6 mb-8 mt-6">
                <p className="text-4xl font-black text-gray-900 tracking-tight">
                  ${product.price.toLocaleString('es-AR')}
                </p>
                <div className="h-8 w-px bg-gray-100" />
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  product.stock > 0 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Descripción</h3>
                <p className="text-lg text-gray-600 leading-relaxed italic font-medium">
                  "{product.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-50">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Equipo</h3>
                  <p className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                    {subtitle ?? "-"}
                    {leagueName ? ` • ${leagueName}` : ""}
                  </p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Temporada</h3>
                  <p className="text-xl font-bold text-gray-900 uppercase tracking-tight">{product.season}</p>
                </div>
                {product.player && (
                  <div className="col-span-2 pt-4 border-t border-gray-50/50">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Inscripción Especial</h3>
                    <p className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
                      {product.player} <span className="text-blue-600">#{product.number}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Información del Vendedor */}
              {seller && (
                <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Vendido por</h4>
                      <p className="text-lg font-bold text-gray-900 uppercase tracking-tight italic">{seller.name}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/profile/seller/${seller.id}`}
                    className="bg-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    Ver Perfil
                  </Link>
                </div>
              )}

              <ProductActions productId={product.id} sizes={product.size ?? []} stock={product.stock} />
            </div>

            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-center gap-3 py-4 px-6 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Compra 100% Protegida
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Reseñas */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">
              Opiniones de otros <span className="text-blue-600">Casacas</span>
            </h2>
          </div>

          {searchParams.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 font-semibold text-sm">
              <span>⚠️ No se pudo enviar la opinión:</span>
              <span className="font-normal">
                {searchParams.error === 'feedback_api_error' 
                  ? 'Hubo un problema de conexión con el servicio de opiniones. Por favor, reintente más tarde o comprueba si ya has calificado este pedido.' 
                  : decodeURIComponent(searchParams.error)}
              </span>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Formulario de Reseña (Si puede reseñar) */}
            {canReview && (
              <div className="bg-blue-600 p-8 rounded-[32px] shadow-xl shadow-blue-200 text-white">
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">Tu opinión importa</h3>
                <form action={submitReviewAction} className="space-y-4">
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="sellerId" value={product.sellerId} />
                  <input type="hidden" name="orderId" value={currentOrderId} />
                  
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Puntaje Producto</label>
                    <select name="ratingProduct" className="w-full bg-blue-700 border-none rounded-xl mt-1 font-bold">
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Estrellas</option>)}
                    </select>
                  </div>


                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-70">Comentario</label>
                    <textarea 
                      name="comment" 
                      rows={3}
                      className="w-full bg-blue-700 border-none rounded-xl mt-1 font-medium placeholder:text-blue-300"
                      placeholder="¿Qué te pareció la casaca?"
                    ></textarea>
                  </div>

                  <button className="w-full bg-white text-blue-600 font-black uppercase tracking-widest py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Enviar Reseña
                  </button>
                </form>
              </div>
            )}

            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[64px] -mr-8 -mt-8 transition-all group-hover:scale-110" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.ratingProduct ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-lg text-gray-700 font-medium italic mb-6 leading-relaxed">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-tight text-gray-900">Usuario Verificado</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString('es-AR')}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              !canReview && (
                <div className="col-span-2 text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                  <p className="text-xl font-bold text-gray-400 uppercase tracking-tight italic">
                    Este producto todavía no tiene reseñas. ¡Sé el primero en comprarlo!
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
