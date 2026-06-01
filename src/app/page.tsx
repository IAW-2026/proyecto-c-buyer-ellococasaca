import { sellerApi } from "@/lib/api-clients/seller";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const products = await sellerApi.getProducts();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/20 via-emerald-500 to-emerald-500/20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Nueva Colección 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 uppercase italic leading-[0.85]">
              Vestí tu <br />
              <span className="text-blue-600 not-italic">Pasión</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl font-medium">
              Explorá nuestra selección exclusiva de camisetas retro y actuales para los verdaderos locos por la casaca.
            </p>
            <div className="mt-12 flex flex-wrap gap-5">
              <Link 
                href="/products"
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95 flex items-center gap-3"
              >
                Ver Colección
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 uppercase">
              Camisetas Destacadas
            </h2>
            <div className="h-1.5 w-20 bg-blue-600 mt-2 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No se encontraron camisetas.</p>
          </div>
        )}
      </main>
    </div>
  );
}
