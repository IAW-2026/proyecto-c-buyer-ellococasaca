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

// Datos de prueba (Mocks) para la Etapa 2
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    sellerId: "user_1",
    title: "Camiseta Argentina 3 Estrellas - Titular",
    description: "La camiseta oficial del campeón del mundo con las tres estrellas bordadas. Tecnología AEROREADY.",
    price: 85000,
    stock: 10,
    imageUrl: "/images/products/argentina-2022.jpg",
    kind: "NATIONAL_TEAM",
    nationalTeamId: "argentina",
    category: "Selecciones",
    team: "Argentina",
    season: "2022",
    size: ["S", "M", "L", "XL"],
    player: "Messi",
    number: 10
  },
  {
    id: "2",
    sellerId: "user_1",
    title: "Camiseta Real Madrid - Local",
    description: "La clásica blanca del Madrid. Temporada 2023/24. Versión estadio.",
    price: 75000,
    stock: 5,
    imageUrl: "/images/products/madrid-2023.jpg",
    kind: "CLUB",
    leagueId: "laliga",
    teamId: "real-madrid",
    category: "Clubes",
    team: "Real Madrid",
    season: "2023/24",
    size: ["M", "L"]
  },
  {
    id: "3",
    sellerId: "user_2",
    title: "Camiseta Boca Juniors - Alternativa",
    description: "Camiseta alternativa amarilla de Boca Juniors. Inspirada en la historia del club.",
    price: 70000,
    stock: 15,
    imageUrl: "/images/products/boca-2023.jpg",
    kind: "CLUB",
    leagueId: "liga-profesional-ar",
    teamId: "boca-juniors",
    category: "Clubes",
    team: "Boca Juniors",
    season: "2023",
    size: ["S", "M", "L"]
  },
  {
    id: "4",
    sellerId: "user_3",
    title: "Camiseta Manchester City - Titular",
    description: "Edición especial del triplete. Azul celeste clásico.",
    price: 90000,
    stock: 3,
    imageUrl: "/images/products/city-2022.jpg",
    kind: "CLUB",
    leagueId: "premier-league",
    teamId: "manchester-city",
    category: "Clubes",
    team: "Manchester City",
    season: "2022/23",
    size: ["L", "XL"],
    player: "Haaland",
    number: 9
  },
  {
    id: "5",
    sellerId: "user_1",
    title: "Camiseta Liverpool - Local",
    description: "Jersey tradicional rojo del Liverpool FC.",
    price: 80000,
    stock: 8,
    imageUrl: "/images/products/liverpool-2023.jpg",
    kind: "CLUB",
    leagueId: "premier-league",
    teamId: "liverpool",
    category: "Clubes",
    team: "Liverpool",
    season: "2023/24",
    size: ["S", "M", "L", "XL"]
  },
  {
    id: "6",
    sellerId: "user_2",
    title: "Camiseta Arsenal - Alternativa",
    description: "Jersey blanco alternativo del Arsenal.",
    price: 72000,
    stock: 6,
    imageUrl: "/images/products/arsenal-2023.jpg",
    kind: "CLUB",
    leagueId: "premier-league",
    teamId: "arsenal",
    category: "Clubes",
    team: "Arsenal",
    season: "2023/24",
    size: ["M", "L", "XL"]
  },
  {
    id: "7",
    sellerId: "user_3",
    title: "Camiseta Barcelona - Local",
    description: "Jersey azulgrana clásico del Barcelona.",
    price: 85000,
    stock: 4,
    imageUrl: "/images/products/barcelona-2023.jpg",
    kind: "CLUB",
    leagueId: "laliga",
    teamId: "barcelona",
    category: "Clubes",
    team: "Barcelona",
    season: "2023/24",
    size: ["L"]
  },
  {
    id: "8",
    sellerId: "user_1",
    title: "Camiseta Atlético Madrid - Alternativa",
    description: "Jersey azul y blanco alternativo del Atlético.",
    price: 78000,
    stock: 7,
    imageUrl: "/images/products/atletico-2023.jpg",
    kind: "CLUB",
    leagueId: "laliga",
    teamId: "atletico-madrid",
    category: "Clubes",
    team: "Atlético Madrid",
    season: "2023/24",
    size: ["S", "M", "L"]
  },
  {
    id: "9",
    sellerId: "user_2",
    title: "Camiseta River Plate - Local",
    description: "Jersey blanco con banda roja del club más grande de Argentina.",
    price: 68000,
    stock: 12,
    imageUrl: "/images/products/river-2024.jpg",
    kind: "CLUB",
    leagueId: "liga-profesional-arg",
    teamId: "river-plate",
    category: "Clubes",
    team: "River Plate",
    season: "2024",
    size: ["S", "M", "L", "XL"]
  },
  {
    id: "10",
    sellerId: "user_3",
    title: "Camiseta Racing Club - Local",
    description: "Jersey celeste con banda blanca del Racing Club.",
    price: 65000,
    stock: 0,
    imageUrl: "/images/products/racing-2024.webp",
    kind: "CLUB",
    leagueId: "liga-profesional-arg",
    teamId: "racing",
    category: "Clubes",
    team: "Racing Club",
    season: "2024",
    size: ["M", "L"]
  },
  {
    id: "11",
    sellerId: "user_1",
    title: "Camiseta Brasil - Titular",
    description: "Jersey amarilla del pentacampeón mundial.",
    price: 88000,
    stock: 5,
    imageUrl: "/images/products/brasil-2023.jpg",
    kind: "NATIONAL_TEAM",
    nationalTeamId: "brasil",
    category: "Selecciones",
    team: "Brasil",
    season: "2023",
    size: ["S", "M", "L", "XL"]
  },
  {
    id: "12",
    sellerId: "user_3",
    title: "Camiseta Napoli Retro - Maradona",
    description: "Edición histórica del Napoli de los 80. La gloria de Diego.",
    price: 120000,
    stock: 2,
    imageUrl: "/images/products/napoli-maradona.jpg",
    kind: "CLUB",
    leagueId: "serie-a",
    teamId: "napoli",
    category: "Retro",
    team: "Napoli",
    season: "1987",
    size: ["M", "L", "XL"],
    player: "Maradona",
    number: 10
  }
];

export class SellerApiClient {
  private useMocks: boolean;

  constructor() {
    this.useMocks = process.env.USE_MOCKS === "true";
  }

  private async getMockProducts(filters?: ProductFilters): Promise<Product[]> {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let products = [...MOCK_PRODUCTS];

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        (p.team ?? "").toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.kind) {
      products = products.filter((p) => p.kind === filters.kind);
    }

    if (filters?.leagueId) {
      products = products.filter((p) => p.leagueId === filters.leagueId);
    }

    if (filters?.teamId) {
      products = products.filter((p) => p.teamId === filters.teamId);
    }

    if (filters?.nationalTeamId) {
      products = products.filter((p) => p.nationalTeamId === filters.nationalTeamId);
    }

    // Legacy (mientras migramos):
    if (filters?.category) {
      products = products.filter((p) => p.category === filters.category);
    }

    if (filters?.team) {
      products = products.filter((p) => p.team === filters.team);
    }

    if (filters?.season) {
      products = products.filter((p) => p.season === filters.season);
    }

    if (filters?.sellerId) {
      products = products.filter((p) => p.sellerId === filters.sellerId);
    }

    if (typeof filters?.inStock === "boolean") {
      products = products.filter((p) => (filters.inStock ? p.stock > 0 : p.stock === 0));
    }

    if (typeof filters?.minPrice === "number") {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }

    if (typeof filters?.maxPrice === "number") {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }

    return products;
  }

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
    if (this.useMocks) {
      return this.getMockProducts(filters);
    }

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

      const response = await fetch(url.toString(), { next: { revalidate: 0 } });
      if (!response.ok) throw new Error(`Seller API error: ${response.status} ${response.statusText}`);
      const data = await response.json();
      let products = Array.isArray(data) ? data.map(p => this.mapProduct(p)) : [];

      // Fallback local filtering for fields not handled by the database (like text search, season, prices, etc.)
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
      console.warn("Seller API is unavailable. Falling back to mocks.", e);
      return this.getMockProducts(filters);
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    if (this.useMocks) {
      return this.getMockProductById(id);
    }

    try {
      const defaultPort = process.env.PORT ?? "3001";
      const baseUrl = process.env.SELLER_API_URL ?? `http://localhost:${defaultPort}`;
      const response = await fetch(`${baseUrl}/api/products/${id}`, { next: { revalidate: 0 } });
      if (!response.ok) throw new Error(`Product fetch failed with status ${response.status}`);
      const data = await response.json();
      return data ? this.mapProduct(data) : null;
    } catch (e) {
      console.warn(`Product ID ${id} fetch from Seller API failed. Falling back to mocks.`, e);
      return this.getMockProductById(id);
    }
  }

  private async getMockProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }

  async getSellerById(id: string) {
    // Intentamos recuperar los datos del vendedor directamente desde Clerk,
    // ya que Clerk es el Single Source of Truth para la identidad de usuario (ADR 001).
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
      console.warn(`Failed to fetch seller ${id} from Clerk API, falling back to local mock:`, clerkError);
      return this.getMockSellerById(id);
    }
  }

  private async getMockSellerById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      id,
      name: id === "user_1" ? "Juan Pérez" : id === "user_2" ? "Martín Palermo" : `Vendedor Particular (${id.substring(0, 6)})`,
      description: "Vendedor particular con excelente reputación en la plataforma.",
      isVerified: true,
    };
  }

  async getOrdersByBuyer(buyerId: string): Promise<any[]> {
    if (this.useMocks) {
      return [];
    }

    try {
      const defaultPort = process.env.PORT ?? "3001";
      const baseUrl = process.env.SELLER_API_URL ?? `http://localhost:${defaultPort}`;
      const response = await fetch(`${baseUrl}/api/orders?buyerId=${buyerId}`, { next: { revalidate: 0 } });
      if (!response.ok) {
        const altResponse = await fetch(`${baseUrl}/api/orders/buyer/${buyerId}`, { next: { revalidate: 0 } });
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
