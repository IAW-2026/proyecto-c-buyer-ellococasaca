export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  /**
   * CLUB: camiseta de un club (pertenece a una liga)
   * NATIONAL_TEAM: camiseta de una selección
   */
  kind: "CLUB" | "NATIONAL_TEAM";
  /** IDs estables para coordinar con Seller en Etapa 3 */
  leagueId?: string;
  teamId?: string;
  nationalTeamId?: string;

  /** Campos legacy (mientras migramos UI/mocks). */
  category?: string;
  team?: string;
  season: string;
  size: string[];
}

export interface ProductFilters {
  search?: string;
  kind?: "CLUB" | "NATIONAL_TEAM";
  leagueId?: string;
  teamId?: string;
  nationalTeamId?: string;

  /** Legacy: se va a deprecar cuando Seller exponga IDs */
  category?: string;
  team?: string;

  season?: string;
  sellerId?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
