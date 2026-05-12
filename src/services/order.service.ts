import prisma from "@/lib/prisma";

const shouldUseMocks = process.env.USE_MOCKS === "true" || !process.env.DATABASE_URL;

export type MockOrder = {
  id: string;
  externalOrderId: string;
  userId: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
};

const mockOrders = new Map<string, MockOrder>();

export class OrderService {
  async createOrder(userId: string, totalAmount: number) {
    const externalOrderId = `ORD-${Math.random().toString(36).substring(7).toUpperCase()}`;

    if (shouldUseMocks) {
      const order: MockOrder = {
        id: `local_${Math.random().toString(36).substring(7)}`,
        externalOrderId,
        userId,
        status: "PENDING",
        totalAmount,
        createdAt: new Date(),
      };
      mockOrders.set(order.id, order);
      return order;
    }

    return await prisma.orderShadow.create({
      data: {
        externalOrderId,
        userId,
        status: "PENDING",
        totalAmount,
      },
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    if (shouldUseMocks) {
      const order = mockOrders.get(orderId);
      if (order) order.status = status;
      return order;
    }

    return await prisma.orderShadow.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async getOrdersByUser(userId: string) {
    if (shouldUseMocks) {
      return Array.from(mockOrders.values())
        .filter(o => o.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return await prisma.orderShadow.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(orderId: string) {
    if (shouldUseMocks) {
      return mockOrders.get(orderId) || null;
    }

    return await prisma.orderShadow.findUnique({
      where: { id: orderId },
    });
  }
}

export const orderService = new OrderService();
