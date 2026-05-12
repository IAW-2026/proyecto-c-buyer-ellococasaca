import { Product, ProductFilters } from "@/types/product";

// Datos de prueba (Mocks) para la Etapa 2
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    sellerId: "seller_1",
    title: "Camiseta Argentina 3 Estrellas - Titular",
    description: "La camiseta oficial del campeón del mundo con las tres estrellas bordadas. Tecnología AEROREADY.",
    price: 85000,
    stock: 10,
    imageUrl: "https://placehold.co/400x500?text=Argentina+Titular",
  kind: "NATIONAL_TEAM",
  nationalTeamId: "argentina",
  category: "Selecciones",
  team: "Argentina",
    season: "2022",
    size: ["S", "M", "L", "XL"]
  },
  {
    id: "2",
    sellerId: "seller_1",
    title: "Camiseta Real Madrid - Local",
    description: "La clásica blanca del Madrid. Temporada 2023/24. Versión estadio.",
    price: 75000,
    stock: 5,
    imageUrl: "https://placehold.co/400x500?text=Real+Madrid+Local",
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
    sellerId: "seller_2",
    title: "Camiseta Boca Juniors - Alternativa",
    description: "Camiseta alternativa amarilla de Boca Juniors. Inspirada en la historia del club.",
    price: 70000,
    stock: 15,
    imageUrl: "https://placehold.co/400x500?text=Boca+Alternativa",
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
    sellerId: "seller_3",
    title: "Camiseta Manchester City - Titular",
    description: "Edición especial del triplete. Azul celeste clásico.",
    price: 90000,
    stock: 3,
    imageUrl: "https://placehold.co/400x500?text=Man+City+Titular",
  kind: "CLUB",
  leagueId: "premier-league",
  teamId: "manchester-city",
  category: "Clubes",
  team: "Manchester City",
    season: "2022/23",
    size: ["L", "XL"]
  },
  {
    id: "5",
    sellerId: "seller_1",
    title: "Camiseta Liverpool - Local",
    description: "Jersey tradicional rojo del Liverpool FC.",
    price: 80000,
    stock: 8,
    imageUrl: "https://placehold.co/400x500?text=Liverpool+Local",
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
    sellerId: "seller_2",
    title: "Camiseta Arsenal - Alternativa",
    description: "Jersey blanco alternativo del Arsenal.",
    price: 72000,
    stock: 6,
    imageUrl: "https://placehold.co/400x500?text=Arsenal+Alternativa",
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
    sellerId: "seller_3",
    title: "Camiseta Barcelona - Local",
    description: "Jersey azulgrana clásico del Barcelona.",
    price: 85000,
    stock: 4,
    imageUrl: "https://placehold.co/400x500?text=Barcelona+Local",
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
    sellerId: "seller_1",
    title: "Camiseta Atlético Madrid - Alternativa",
    description: "Jersey rojo y blanco alternativo del Atlético.",
    price: 78000,
    stock: 7,
    imageUrl: "https://placehold.co/400x500?text=Atletico+Alternativa",
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
    sellerId: "seller_2",
    title: "Camiseta River Plate - Local",
    description: "Jersey blanco con banda roja del club más grande de Argentina.",
    price: 68000,
    stock: 12,
    imageUrl: "https://placehold.co/400x500?text=River+Local",
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
    sellerId: "seller_3",
    title: "Camiseta Racing Club - Local",
    description: "Jersey celeste con banda blanca del Racing Club.",
    price: 65000,
    stock: 0,
    imageUrl: "https://placehold.co/400x500?text=Racing+Local",
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
    sellerId: "seller_1",
    title: "Camiseta Brasil - Titular",
    description: "Jersey amarilla del pentacampeón mundial.",
    price: 88000,
    stock: 5,
    imageUrl: "https://placehold.co/400x500?text=Brasil+Titular",
    kind: "NATIONAL_TEAM",
    nationalTeamId: "brasil",
    category: "Selecciones",
    team: "Brasil",
    season: "2023",
    size: ["S", "M", "L", "XL"]
  },
  {
    id: "12",
    sellerId: "seller_2",
    title: "Camiseta Uruguay - Titular",
    description: "Jersey blanca de la histórica selección de Uruguay.",
    price: 82000,
    stock: 2,
    imageUrl: "https://placehold.co/400x500?text=Uruguay+Titular",
    kind: "NATIONAL_TEAM",
    nationalTeamId: "uruguay",
    category: "Selecciones",
    team: "Uruguay",
    season: "2023",
    size: ["L", "XL"]
  }
];

export class SellerApiClient {
  private useMocks: boolean;

  constructor() {
    this.useMocks = process.env.USE_MOCKS === "true";
  }

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    if (this.useMocks) {
      // Simular latencia de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

  // Aquí iría la llamada real a la API de Seller en la Etapa 3
  // Si no se define SELLER_API_URL, construimos una URL absoluta apuntando
  // al host local durante desarrollo para que `fetch` en el servidor no falle
  // al recibir rutas relativas.
  const defaultPort = process.env.PORT ?? "3001";
  const baseUrl = process.env.SELLER_API_URL ?? `http://localhost:${defaultPort}`;
  const response = await fetch(`${baseUrl}/api/products`);
  if (!response.ok) throw new Error(`Seller API error: ${response.status} ${response.statusText}`);
  return response.json();
  }

  async getProductById(id: string): Promise<Product | null> {
    if (this.useMocks) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_PRODUCTS.find(p => p.id === id) || null;
    }

    const defaultPort = process.env.PORT ?? "3001";
    const baseUrl = process.env.SELLER_API_URL ?? `http://localhost:${defaultPort}`;
    const response = await fetch(`${baseUrl}/api/products/${id}`);
    if (!response.ok) return null;
    return response.json();
  }

  async getSellerById(id: string) {
    if (this.useMocks) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        id,
        name: id === "seller_1" ? "Camisetas Retro Arg" : id === "seller_2" ? "Boca Shop Oficial" : "La Casa del Hincha",
        description: "Especialistas en camisetas históricas y de colección con más de 10 años en el rubro.",
        isVerified: true,
      };
    }

    const defaultPort = process.env.PORT ?? "3001";
    const baseUrl = process.env.SELLER_API_URL ?? `http://localhost:${defaultPort}`;
    const response = await fetch(`${baseUrl}/api/sellers/${id}`);
    if (!response.ok) return null;
    return response.json();
  }
}

export const sellerApi = new SellerApiClient();
