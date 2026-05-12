
import { Product } from "@/types/product";
import prisma from "@/lib/prisma";

type MockCartItem = {
  id: string;
  cartId: string;
  productId: string;
  productName: string;
  productImage: string;
  priceAtAdded: number;
  quantity: number;
};

type MockCart = {
  id: string;
  userId: string;
  isActive: boolean;
  items: MockCartItem[];
};

const shouldUseMocks = process.env.USE_MOCKS === "true" || !process.env.DATABASE_URL;

const mockCartsByUserId = new Map<string, MockCart>();
const mockCartItemsById = new Map<string, MockCartItem>();
let mockIdSeq = 1;

function nextMockId(prefix: string) {
  return `${prefix}_${mockIdSeq++}`;
}

function getOrCreateMockCart(userId: string): MockCart {
  const existing = mockCartsByUserId.get(userId);
  if (existing) return existing;
  const cart: MockCart = {
    id: nextMockId("cart"),
    userId,
    isActive: true,
    items: [],
  };
  mockCartsByUserId.set(userId, cart);
  return cart;
}

export class CartService {
  async getOrCreateCart(userId: string) {
    if (shouldUseMocks) {
      return getOrCreateMockCart(userId);
    }

    let cart = await prisma.cart.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          isActive: true,
        },
        include: {
          items: true,
        },
      });
    }

    return cart;
  }

  async addItem(userId: string, product: Product, quantity: number = 1) {
    const cart = await this.getOrCreateCart(userId);

    if (shouldUseMocks) {
      const item: MockCartItem = {
        id: nextMockId("item"),
        cartId: cart.id,
        productId: product.id,
        productName: product.title,
        productImage: product.imageUrl,
        priceAtAdded: product.price,
        quantity,
      };
      mockCartItemsById.set(item.id, item);

      const mockCart = cart as MockCart;
      mockCart.items.push(item);
      return item;
    }

    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        productName: product.title,
        productImage: product.imageUrl,
        priceAtAdded: product.price,
        quantity: quantity,
      },
    });
  }

  async removeItem(itemId: string) {
    if (shouldUseMocks) {
      const item = mockCartItemsById.get(itemId);
      if (!item) return;

      mockCartItemsById.delete(itemId);
      // Find the cart that contains this item and remove it
      for (const cart of mockCartsByUserId.values()) {
        if (cart.id === item.cartId) {
          cart.items = cart.items.filter((i) => i.id !== itemId);
          break;
        }
      }
      return;
    }

    return await prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async updateQuantity(itemId: string, quantity: number) {
    if (shouldUseMocks) {
      const item = mockCartItemsById.get(itemId);
      if (!item) return;
      item.quantity = quantity;
      return item;
    }

    return await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async deactivateCart(cartId: string) {
    if (shouldUseMocks) {
      for (const cart of mockCartsByUserId.values()) {
        if (cart.id === cartId) {
          cart.isActive = false;
          break;
        }
      }
      return;
    }

    return await prisma.cart.update({
      where: { id: cartId },
      data: { isActive: false },
    });
  }

  async getCart(userId: string) {
    if (shouldUseMocks) {
      return mockCartsByUserId.get(userId) ?? null;
    }

    return await prisma.cart.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        items: true,
      },
    });
  }
}

export const cartService = new CartService();
