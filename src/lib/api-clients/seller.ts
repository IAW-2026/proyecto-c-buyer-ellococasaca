import { Product, ProductFilters } from "@/types/product";
import { getTeamById } from "@/lib/catalog/leagues";

function slugify(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export class SellerApiClient {
  constructor() {}

  private mapProduct(p: any): Product {
    let imageUrl = p.imageUrl || "";
    if (!imageUrl && p.ProductImage && p.ProductImage.length > 0) {
      imageUrl = p.ProductImage[0].url || p.ProductImage[0].imageUrl || "";
    }
    
    let sizeArray: string[] = [];
    if (typeof p.size === "string") {
      sizeArray = p.size.split(/\s*,\s*|\s+/).filter(Boolean);
    } else if (Array.isArray(p.size)) {
      sizeArray = p.size;
    }

    const kind = p.categoryId === "SELECCION" ? "NATIONAL_TEAM" : "CLUB";
    const teamNormalized = p.team ? slugify(p.team) : undefined;
    const teamId = p.teamId || (kind === "CLUB" ? teamNormalized : undefined);
    const nationalTeamId = p.nationalTeamId || (kind === "NATIONAL_TEAM" ? teamNormalized : undefined);

    let leagueId = p.leagueId;
    if (!leagueId && teamId) {
      const match = getTeamById(teamId);
      if (match) {
        leagueId = match.league.id;
      }
    }

    return {
      id: String(p.id),
      sellerId: p.sellerId || "",
      title: p.title || "",
      description: p.description || "",
      price: typeof p.price === "number" ? p.price : parseFloat(p.price || 0),
      stock: typeof p.stock === "number" ? p.stock : parseInt(p.stock || 0),
      imageUrl,
      kind,
      leagueId,
      teamId,
      nationalTeamId,
      category: p.categoryId || p.category || "",
      team: p.team || "",
      season: p.season || "",
      size: sizeArray.length > 0 ? sizeArray : undefined,
      player: p.player || undefined,
      number: p.number || undefined,
    };
  }

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      const defaultPort = process.env.PORT ?? "3001";
      const baseUrl = process.env.SELLER_API_URL ?? `http://localhost:${defaultPort}`;
      
      const url = new URL(`${baseUrl}/api/products`);
      if (filters) {
        if (filters.search) url.searchParams.append("search", filters.search);
        if (filters.kind) {
          const apiKind = filters.kind === "NATIONAL_TEAM" ? "SELECCION" : filters.kind;
          url.searchParams.append("kind", apiKind);
        }
        if (filters.leagueId) url.searchParams.append("leagueId", filters.leagueId);
        if (filters.teamId) url.searchParams.append("teamId", filters.teamId);
        if (filters.nationalTeamId) url.searchParams.append("nationalTeamId", filters.nationalTeamId);
        if (filters.category) url.searchParams.append("category", filters.category);
        if (filters.team) url.searchParams.append("team", filters.team);
        if (filters.season) url.searchParams.append("season", filters.season);
        if (filters.sellerId) url.searchParams.append("sellerId", filters.sellerId);
        if (typeof filters.inStock === "boolean") url.searchParams.append("inStock", String(filters.inStock));
        if (typeof filters.minPrice === "number") url.searchParams.append("minPrice", String(filters.minPrice));
        if (typeof filters.maxPrice === "number") url.searchParams.append("maxPrice", String(filters.maxPrice));
      }

      const headers: Record<string, string> = {};
      if (process.env.INTER_SERVICE_SECRET) {
        headers["x-inter-service-secret"] = process.env.INTER_SERVICE_SECRET;
      }

      const response = await fetch(url.toString(), { 
        headers,
        next: { revalidate: 0 } 
      });
      if (!response.ok) throw new Error(`Seller API error: ${response.status} ${response.statusText}`);
      const data = await response.json();
      let products = Array.isArray(data) ? data.map(p => this.mapProduct(p)) : [];

      // Fallback local filtering for fields not handled by the database
      if (filters) {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          products = products.filter(p => 
            p.title.toLowerCase().includes(searchLower) || 
            (p.team ?? "").toLowerCase().includes(searchLower) ||
            (p.description ?? "").toLowerCase().includes(searchLower) ||
            (p.player ?? "").toLowerCase().includes(searchLower)
          );
        }

        if (filters.kind) {
          products = products.filter(p => p.kind === filters.kind);
        }

        if (filters.leagueId) {
          products = products.filter(p => p.leagueId === filters.leagueId);
        }

        if (filters.teamId) {
          products = products.filter(p => p.teamId === filters.teamId);
        }

        if (filters.nationalTeamId) {
          products = products.filter(p => p.nationalTeamId === filters.nationalTeamId);
        }

        if (filters.category) {
          products = products.filter(p => p.category === filters.category);
        }

        if (filters.team) {
          products = products.filter(p => p.team === filters.team);
        }

        if (filters.season) {
          const seasonLower = filters.season.toLowerCase();
          products = products.filter(p => p.season.toLowerCase().includes(seasonLower));
        }

        if (filters.sellerId) {
          products = products.filter(p => p.sellerId === filters.sellerId);
        }

        if (typeof filters.inStock === "boolean") {
          products = products.filter(p => (filters.inStock ? p.stock > 0 : p.stock === 0));
        }

        if (typeof filters.minPrice === "number") {
          products = products.filter(p => p.price >= filters.minPrice!);
        }

        if (typeof filters.maxPrice === "number") {
          products = products.filter(p => p.price <= filters.maxPrice!);
        }
      }

      return products;
    } catch (e) {
      console.warn("Seller API is unavailable.", e);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const defaultPort = process.env.PORT ?? "3001";
      const baseUrl = process.env.SELLER_API_URL ?? `http://localhost:${defaultPort}`;
      const headers: Record<string, string> = {};
      if (process.env.INTER_SERVICE_SECRET) {
        headers["x-inter-service-secret"] = process.env.INTER_SERVICE_SECRET;
      }

      const response = await fetch(`${baseUrl}/api/products/${id}`, { 
        headers,
        next: { revalidate: 0 } 
      });
      if (!response.ok) throw new Error(`Product fetch failed with status ${response.status}`);
      const data = await response.json();
      return data ? this.mapProduct(data) : null;
    } catch (e) {
      console.warn(`Product ID ${id} fetch from Seller API failed.`, e);
      return null;
    }
  }

  async getSellerById(id: string) {
    try {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const user = await clerkClient.users.getUser(id);
      return {
        id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || `Vendedor (${id.substring(0, 8)})`,
        description: (user.publicMetadata?.description as string) || "Vendedor particular registrado en El Loco Casaca.",
        isVerified: !!user.publicMetadata?.isVerified,
      };
    } catch (clerkError) {
      console.warn(`Failed to fetch seller ${id} from Clerk API:`, clerkError);
      return {
        id,
        name: `Vendedor (${id.substring(0, 8)})`,
        description: "Vendedor particular registrado en El Loco Casaca.",
        isVerified: false,
      };
    }
  }

  async getOrdersByBuyer(buyerId: string): Promise<any[]> {
    try {
      const defaultPort = process.env.PORT ?? "3001";
      const baseUrl = process.env.SELLER_API_URL ?? `http://localhost:${defaultPort}`;
      
      const headers: Record<string, string> = {};
      if (process.env.INTER_SERVICE_SECRET) {
        headers["x-inter-service-secret"] = process.env.INTER_SERVICE_SECRET;
      }

      const response = await fetch(`${baseUrl}/api/orders?buyerId=${buyerId}`, { 
        headers,
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(3000)
      });
      if (!response.ok) {
        const altResponse = await fetch(`${baseUrl}/api/orders/buyer/${buyerId}`, { 
          headers,
          next: { revalidate: 0 },
          signal: AbortSignal.timeout(3000)
        });
        if (!altResponse.ok) throw new Error(`Orders fetch returned status ${response.status}`);
        return await altResponse.json();
      }
      return await response.json();
    } catch (e) {
      console.warn(`Failed to fetch orders for buyer ${buyerId} from Seller App:`, e);
      return [];
    }
  }
}

export const sellerApi = new SellerApiClient();
