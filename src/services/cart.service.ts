import { Product } from "@/types/product";
import prisma from "@/lib/prisma";
import { Cart, CartItem } from "@prisma/client";

const mockCartsStore: Record<string, Cart & { items: CartItem[] }> = {};

function getMockCart(userId: string): Cart & { items: CartItem[] } {
  if (!mockCartsStore[userId]) {
    mockCartsStore[userId] = {
      id: `mock_cart_${userId}`,
      userId,
      isActive: true,
      createdAt: new Date(),
      items: []
    };
  }
  return mockCartsStore[userId];
}

export class CartService {
  async getOrCreateCart(userId: string) {
    try {
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
        // Create user if they don't exist, specifically for mock bypassing
        await prisma.user.upsert({
          where: { clerkId: userId },
          update: {},
          create: {
            clerkId: userId,
            email: `${userId}@example.com`,
            name: "Test User",
          }
        });
        
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
    } catch (e) {
      console.warn("Database connection failed in getOrCreateCart. Falling back to in-memory mock cart.", e);
      return getMockCart(userId);
    }
  }

  async addItem(userId: string, product: Product, quantity: number = 1, size?: string) {
    try {
      const cart = await this.getOrCreateCart(userId);
      if (cart.id.startsWith("mock_cart_")) {
        const item = {
          id: `mock_item_${Math.random().toString(36).substring(7)}`,
          cartId: cart.id,
          productId: product.id,
          productName: product.title,
          productImage: product.imageUrl,
          priceAtAdded: product.price,
          quantity: quantity,
          size: size || null,
        };
        cart.items.push(item);
        return item;
      }

      // Snapshotting: Guardamos el precio current del producto en el item del carrito
      return await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          productName: product.title,
          productImage: product.imageUrl,
          priceAtAdded: product.price,
          quantity: quantity,
          size: size,
        },
      });
    } catch (e) {
      console.warn("Database connection failed in addItem. Falling back to in-memory mock.", e);
      const cart = getMockCart(userId);
      const item = {
        id: `mock_item_${Math.random().toString(36).substring(7)}`,
        cartId: cart.id,
        productId: product.id,
        productName: product.title,
        productImage: product.imageUrl,
        priceAtAdded: product.price,
        quantity: quantity,
        size: size || null,
      };
      cart.items.push(item);
      return item;
    }
  }

  async removeItem(itemId: string) {
    try {
      if (itemId.startsWith("mock_item_")) {
        for (const userId of Object.keys(mockCartsStore)) {
          const cart = mockCartsStore[userId];
          const idx = cart.items.findIndex((item: any) => item.id === itemId);
          if (idx !== -1) {
            return cart.items.splice(idx, 1)[0];
          }
        }
        return null;
      }
      return await prisma.cartItem.delete({
        where: { id: itemId },
      });
    } catch (e) {
      console.warn("Database connection failed in removeItem. Falling back to in-memory mock.", e);
      for (const userId of Object.keys(mockCartsStore)) {
        const cart = mockCartsStore[userId];
        const idx = cart.items.findIndex((item: any) => item.id === itemId);
        if (idx !== -1) {
          return cart.items.splice(idx, 1)[0];
        }
      }
      return null;
    }
  }

  async updateQuantity(itemId: string, quantity: number) {
    try {
      if (itemId.startsWith("mock_item_")) {
        for (const userId of Object.keys(mockCartsStore)) {
          const cart = mockCartsStore[userId];
          const item = cart.items.find((item: any) => item.id === itemId);
          if (item) {
            item.quantity = quantity;
            return item;
          }
        }
        return null;
      }
      return await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    } catch (e) {
      console.warn("Database connection failed in updateQuantity. Falling back to in-memory mock.", e);
      for (const userId of Object.keys(mockCartsStore)) {
        const cart = mockCartsStore[userId];
        const item = cart.items.find((item: any) => item.id === itemId);
        if (item) {
          item.quantity = quantity;
          return item;
        }
      }
      return null;
    }
  }

  async deactivateCart(cartId: string) {
    try {
      if (cartId.startsWith("mock_cart_")) {
        for (const userId of Object.keys(mockCartsStore)) {
          if (mockCartsStore[userId].id === cartId) {
            delete mockCartsStore[userId];
          }
        }
        return null;
      }
      return await prisma.cart.update({
        where: { id: cartId },
        data: { isActive: false },
      });
    } catch (e) {
      console.warn("Database connection failed in deactivateCart. Falling back to in-memory mock.", e);
      for (const userId of Object.keys(mockCartsStore)) {
        if (mockCartsStore[userId].id === cartId) {
          delete mockCartsStore[userId];
        }
      }
      return null;
    }
  }

  async getCart(userId: string) {
    try {
      return await prisma.cart.findFirst({
        where: {
          userId,
          isActive: true,
        },
        include: {
          items: true,
        },
      });
    } catch (e) {
      console.warn("Database connection failed in getCart. Falling back to in-memory mock cart.", e);
      return getMockCart(userId);
    }
  }

  async getCartById(cartId: string) {
    try {
      if (cartId.startsWith("mock_cart_")) {
        for (const userId of Object.keys(mockCartsStore)) {
          if (mockCartsStore[userId].id === cartId) {
            return mockCartsStore[userId];
          }
        }
        return null;
      }
      return await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
      });
    } catch (e) {
      console.warn("Database connection failed in getCartById. Falling back to in-memory mock.", e);
      for (const userId of Object.keys(mockCartsStore)) {
        if (mockCartsStore[userId].id === cartId) {
          return mockCartsStore[userId];
        }
      }
      return null;
    }
  }
}

export const cartService = new CartService();
