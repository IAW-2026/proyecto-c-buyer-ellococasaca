import { Product } from "@/types/product";
import Link from "next/link";
import { getLeagueById, getTeamById } from "@/lib/catalog/leagues";
import { getNationalTeamById } from "@/lib/catalog/national-teams";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const isLowStock = product.stock > 0 && product.stock < 5;

  const leagueName = product.leagueId ? getLeagueById(product.leagueId)?.name : undefined;
  const teamName = product.teamId ? getTeamById(product.teamId)?.team.name ?? product.team : product.team;
  const nationalTeamName = product.nationalTeamId
    ? getNationalTeamById(product.nationalTeamId)?.name ?? product.team
    : product.team;
  const categoryLabel =
    product.kind === "NATIONAL_TEAM" ? "Selecciones" : product.kind === "CLUB" ? "Clubes" : product.category;
  const subtitle = product.kind === "NATIONAL_TEAM" ? nationalTeamName : teamName;

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-blue-100 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1">
      {/* Badge de Stock */}
      {isLowStock && (
        <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
          ¡Últimas unidades!
        </div>
      )}
      
      {!product.stock && (
        <div className="absolute top-4 left-4 z-10 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
          Agotado
        </div>
      )}

      <div className="aspect-[4/5] w-full overflow-hidden bg-slate-50 relative">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <div className="mb-4">
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mb-1">
            {categoryLabel} • {product.season}
          </p>
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            <Link href={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.title}
            </Link>
          </h3>
          <p className="mt-1.5 text-sm text-gray-500 font-medium">
            {subtitle}{leagueName ? ` • ${leagueName}` : ""}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Precio</span>
            <p className="text-2xl font-black text-gray-900 tracking-tight">
              ${product.price.toLocaleString('es-AR')}
            </p>
          </div>
          <div className={`h-2.5 w-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`} />
        </div>
      </div>
    </div>
  );
};
