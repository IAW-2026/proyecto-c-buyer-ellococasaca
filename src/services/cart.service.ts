import { Product } from "@/types/product";
import prisma from "@/lib/prisma";

export class CartService {
  async getOrCreateCart(userId: string) {
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
  }

  async addItem(userId: string, product: Product, quantity: number = 1, size?: string) {
    const cart = await this.getOrCreateCart(userId);

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
  }

  async removeItem(itemId: string) {
    return await prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async updateQuantity(itemId: string, quantity: number) {
    return await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async deactivateCart(cartId: string) {
    return await prisma.cart.update({
      where: { id: cartId },
      data: { isActive: false },
    });
  }

  async getCart(userId: string) {
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

  async getCartById(cartId: string) {
    return await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });
  }
}

export const cartService = new CartService();
