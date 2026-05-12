"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  Search,
  X,
  Trophy,
  Flag,
  CircleSlash,
  ChevronDown,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { LEAGUES, getTeamsByLeagueId } from "@/lib/catalog/leagues";
import { NATIONAL_TEAMS } from "@/lib/catalog/national-teams";
import Link from "next/link";

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for immediate UI feedback
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const debouncedSearch = useDebounce(search, 400);
  const debouncedMinPrice = useDebounce(minPrice, 600);
  const debouncedMaxPrice = useDebounce(maxPrice, 600);

  const kind = searchParams.get("kind") as "CLUB" | "NATIONAL_TEAM" | null;
  const leagueId = searchParams.get("leagueId") ?? "";
  const teamId = searchParams.get("teamId") ?? "";
  const nationalTeamId = searchParams.get("nationalTeamId") ?? "";
  const inStock = searchParams.get("inStock") === "true";
  const season = searchParams.get("season") ?? "";

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Sync debounced values to URL
  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("search") ?? "")) {
      updateFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedMinPrice !== (searchParams.get("minPrice") ?? "")) {
      updateFilters({ minPrice: debouncedMinPrice });
    }
  }, [debouncedMinPrice]);

  useEffect(() => {
    if (debouncedMaxPrice !== (searchParams.get("maxPrice") ?? "")) {
      updateFilters({ maxPrice: debouncedMaxPrice });
    }
  }, [debouncedMaxPrice]);

  const handleKindChange = (newKind: "CLUB" | "NATIONAL_TEAM" | null) => {
    updateFilters({
      kind: newKind,
      leagueId: null,
      teamId: null,
      nationalTeamId: null,
    });
  };

  const handleLeagueChange = (newLeagueId: string) => {
    updateFilters({
      leagueId: newLeagueId,
      teamId: null,
    });
  };

  const activeFiltersCount = Array.from(searchParams.keys()).length;

  return (
    <div className="space-y-6 mb-12">
      {/* Main Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por equipo, liga, jugador..."
          className="w-full pl-12 pr-12 py-5 rounded-3xl border-2 border-transparent bg-white shadow-xl shadow-blue-900/5 focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-lg font-medium placeholder:text-gray-400"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-50">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleKindChange(null)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                !kind
                  ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => handleKindChange("CLUB")}
              className={`px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                kind === "CLUB"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Trophy className="h-4 w-4" />
              Clubes
            </button>
            <button
              onClick={() => handleKindChange("NATIONAL_TEAM")}
              className={`px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                kind === "NATIONAL_TEAM"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Flag className="h-4 w-4" />
              Selecciones
            </button>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) =>
                    updateFilters({ inStock: e.target.checked ? "true" : null })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    inStock ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    inStock ? "translate-x-6" : ""
                  }`}
                />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">
                En Stock
              </span>
            </label>

            {activeFiltersCount > 0 && (
              <Link
                href="/products"
                className="text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl"
              >
                <X className="h-3 w-3" />
                Limpiar
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Dependent Selects */}
          {kind === "NATIONAL_TEAM" ? (
            <div className="space-y-3 lg:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                Selección Nacional
              </label>
              <div className="relative">
                <select
                  value={nationalTeamId}
                  onChange={(e) =>
                    updateFilters({ nationalTeamId: e.target.value })
                  }
                  className="w-full appearance-none px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 font-bold text-gray-700 transition-all"
                >
                  <option value="">Todas las selecciones</option>
                  {NATIONAL_TEAMS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                  Liga
                </label>
                <div className="relative">
                  <select
                    value={leagueId}
                    onChange={(e) => handleLeagueChange(e.target.value)}
                    className="w-full appearance-none px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 font-bold text-gray-700 transition-all"
                  >
                    <option value="">Todas las ligas</option>
                    {LEAGUES.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                  Equipo
                </label>
                <div className="relative">
                  <select
                    value={teamId}
                    onChange={(e) => updateFilters({ teamId: e.target.value })}
                    disabled={!leagueId}
                    className="w-full appearance-none px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 font-bold text-gray-700 transition-all disabled:opacity-40"
                  >
                    <option value="">
                      {leagueId ? "Todos los equipos" : "Elegí liga"}
                    </option>
                    {getTeamsByLeagueId(leagueId).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
              Temporada
            </label>
            <input
              type="text"
              value={season}
              onChange={(e) => updateFilters({ season: e.target.value })}
              placeholder="Ej: 2024"
              className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 font-bold text-gray-700 transition-all placeholder:text-gray-300 placeholder:font-medium"
            />
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
              Precio Mín
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                $
              </span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 font-bold text-gray-700 transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
              Precio Máx
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                $
              </span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Máx"
                className="w-full pl-10 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 font-bold text-gray-700 transition-all"
              />
            </div>
          </div>
        </div>

        {isPending && (
          <div className="mt-6 flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-[10px] animate-pulse">
            <CircleSlash className="h-3 w-3 animate-spin" />
            Actualizando catálogo...
          </div>
        )}
      </div>
    </div>
  );
}
