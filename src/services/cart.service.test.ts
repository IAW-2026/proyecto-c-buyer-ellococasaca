import { CartService } from "./cart.service";
import { Product } from "@/types/product";

// Mock de Prisma para evitar errores si no está configurado
jest.mock("@/lib/prisma", () => ({
  cart: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  cartItem: {
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

describe("CartService", () => {
  let cartService: CartService;
  const mockUserId = "user_123";
  const mockProduct: Product = {
    id: "prod_1",
    sellerId: "seller_1",
    title: "Camiseta Test",
    description: "Test",
    price: 1000,
    stock: 10,
    imageUrl: "test.jpg",
    kind: "CLUB",
    category: "Clubes",
    team: "Test Team",
    season: "2024",
    size: ["M"],
  };

  beforeEach(() => {
    cartService = new CartService();
  });

  it("should add an item to the cart with snapshotting", async () => {
    const item = await cartService.addItem(mockUserId, mockProduct, 2);
    
    expect(item).toBeDefined();
    expect(item?.productId).toBe(mockProduct.id);
    expect(item?.priceAtAdded).toBe(mockProduct.price);
    expect(item?.productName).toBe(mockProduct.title);
    expect(item?.quantity).toBe(2);
  });

  it("should calculate the total correctly (simulated via getCart)", async () => {
    await cartService.addItem(mockUserId, mockProduct, 2);
    const cart = await cartService.getCart(mockUserId);
    
    const total = cart?.items.reduce((sum, item) => sum + (item.priceAtAdded * item.quantity), 0);
    expect(total).toBe(2000);
  });

  it("should update item quantity", async () => {
    const item = await cartService.addItem(mockUserId, mockProduct, 1);
    const updated = await cartService.updateQuantity(item!.id, 5);
    
    expect(updated?.quantity).toBe(5);
  });
});
