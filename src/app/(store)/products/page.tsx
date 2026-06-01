import { sellerApi } from "@/lib/api-clients/seller";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { ProductFilters } from "@/components/products/ProductFilters";

type SearchParams = Record<string, string | string[] | undefined>;

function asString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function asNumber(value: string | string[] | undefined): number | undefined {
  const s = asString(value);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function asBoolean(value: string | string[] | undefined): boolean | undefined {
  const s = asString(value);
  if (!s) return undefined;
  if (s === "true") return true;
  if (s === "false") return false;
  return undefined;
}

function asKind(
  value: string | string[] | undefined,
): "CLUB" | "NATIONAL_TEAM" | undefined {
  const s = asString(value);
  if (s === "CLUB" || s === "NATIONAL_TEAM") return s;
  return undefined;
}

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const kind = asKind(searchParams.kind);
  const onlyInStock = asBoolean(searchParams.inStock) === true;

  const filters = {
    search: asString(searchParams.search),
    kind,
    leagueId: asString(searchParams.leagueId),
    teamId: asString(searchParams.teamId),
    nationalTeamId: asString(searchParams.nationalTeamId),
    season: asString(searchParams.season),
    inStock: onlyInStock ? true : undefined,
    minPrice: asNumber(searchParams.minPrice),
    maxPrice: asNumber(searchParams.maxPrice),
  };

  const products = await sellerApi.getProducts(filters);

  return (
    <div className="bg-white min-h-screen pb-20">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-blue-600"></span>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.3em]">
                Marketplace Oficial
              </p>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 uppercase italic leading-[0.8]">
              Catálogo <br />
              <span className="text-blue-600 not-italic">Completo</span>
            </h1>
            <p className="mt-6 text-gray-500 font-medium max-w-md text-lg leading-relaxed">
              Explorá la colección más completa de camisetas retro y actuales.
            </p>
          </div>

          <Link
            href="/"
            className="group inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gray-50 text-sm font-black uppercase tracking-widest text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Volver al Inicio
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductFilters />

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Resultados</h2>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">
              {products.length} productos encontrados
            </span>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="max-w-xs mx-auto">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">
                No hay coincidencias
              </h3>
              <p className="text-gray-500 font-medium mb-8">
                No pudimos encontrar camisetas con los filtros seleccionados. Probá limpiando los filtros.
              </p>
              <Link
                href="/products"
                className="inline-flex px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Ver todo el catálogo
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
