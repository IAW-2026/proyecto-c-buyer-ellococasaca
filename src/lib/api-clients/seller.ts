import { Product, ProductFilters } from "@/types/product";

// Datos de prueba (Mocks) para la Etapa 2
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    userId: "user_1",
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
    userId: "user_1",
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
    userId: "user_2",
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
    userId: "user_3",
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
    userId: "user_1",
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
    userId: "user_2",
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
    userId: "user_3",
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
    userId: "user_1",
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
    userId: "user_2",
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
    userId: "user_3",
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
    userId: "user_1",
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
    userId: "user_3",
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

      if (filters?.userId) {
        products = products.filter((p) => p.userId === filters.userId);
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
        name: id === "user_1" ? "Juan Pérez" : id === "user_2" ? "Martín Palermo" : "Lionel Messi",
        description: "Vendedor particular con excelente reputación en la plataforma.",
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
