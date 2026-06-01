import prisma from "@/lib/prisma";

const isDbAvailable = !!process.env.DATABASE_URL;

export class OrderService {
  async createOrder(userId: string, totalAmount: number, cartId?: string) {
    const externalOrderId = `ORD-${Math.random().toString(36).substring(7).toUpperCase()}`;

    if (!isDbAvailable) {
      console.warn("No DATABASE_URL found. Order will not be persisted.");
      return {
        id: `mock_${Math.random().toString(36).substring(7)}`,
        externalOrderId,
        userId,
        cartId,
        status: "PENDING",
        totalAmount,
        createdAt: new Date(),
      };
    }

    return await prisma.orderShadow.create({
      data: {
        externalOrderId,
        userId,
        cartId,
        status: "PENDING",
        totalAmount,
      },
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    if (!isDbAvailable) return null;

    return await prisma.orderShadow.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async getOrdersByUser(userId: string) {
    if (!isDbAvailable) return [];

    return await prisma.orderShadow.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(orderId: string) {
    if (!isDbAvailable) return null;

    return await prisma.orderShadow.findUnique({
      where: { id: orderId },
    });
  }
}

export const orderService = new OrderService();
