export interface Product {
  id: string;
  userId: string;
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
  size?: string[];
  
  /** Personalización / Inscripción */
  player?: string;
  number?: number;
}

export interface ProductFilters {
  search?: string;
  userId?: string;
  minPrice?: number;
  maxPrice?: number;
}
