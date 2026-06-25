import prisma from "@/lib/prisma";
import { sellerApi } from "@/lib/api-clients/seller";

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

    try {
      return await prisma.orderShadow.create({
        data: {
          externalOrderId,
          userId,
          cartId,
          status: "PENDING",
          totalAmount,
        },
      });
    } catch (e) {
      console.error("Database error in createOrder, falling back to mock:", e);
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
  }

  async updateOrderStatus(orderId: string, status: string) {
    if (!isDbAvailable || orderId.startsWith('mock_')) return null;

    try {
      return await prisma.orderShadow.update({
        where: { id: orderId },
        data: { status },
      });
    } catch (e) {
      console.error("Database error in updateOrderStatus:", e);
      return null;
    }
  }

  async getOrdersByUser(userId: string) {
    let localOrders: any[] = [];
    if (isDbAvailable) {
      try {
        localOrders = await prisma.orderShadow.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
      } catch (dbError) {
        console.error("Database error in getOrdersByUser, continuing without local orders:", dbError);
      }
    }

    try {
      // Pedimos las compras/órdenes al Seller App según se acordó
      const sellerOrders = await sellerApi.getOrdersByBuyer(userId);
      if (sellerOrders && sellerOrders.length > 0) {
        // Combinamos las órdenes del seller con las de la base local
        const merged = [...localOrders];
        for (const so of sellerOrders) {
          const extId = so.externalOrderId || so.id;
          const localOrder = merged.find(lo => lo.externalOrderId === extId);
          if (localOrder) {
            // Si ya existe localmente, actualizamos el estado y el tracking con lo del Seller
            if (localOrder.status !== so.status) {
              localOrder.status = so.status || localOrder.status;
              
              // Actualizamos en segundo plano la base de datos local
              if (isDbAvailable && !localOrder.id.startsWith('mock_')) {
                prisma.orderShadow.update({
                  where: { id: localOrder.id },
                  data: { status: so.status },
                }).catch(e => console.error("Error background updating order status from seller:", e));
              }
            }
            if (so.trackingId) {
              localOrder.trackingId = so.trackingId;
            }
          } else {
            merged.push({
              id: so.id || `seller_${Math.random().toString(36).substring(7)}`,
              externalOrderId: extId,
              userId: so.buyerId || userId,
              cartId: so.cartId || null,
              status: so.status || 'PAID',
              totalAmount: so.totalAmount || so.amount || 0,
              trackingId: so.trackingId || null,
              createdAt: so.createdAt ? new Date(so.createdAt) : new Date(),
            });
          }
        }
        return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (e) {
      console.warn("Error fetching or merging orders from Seller API:", e);
    }

    return localOrders;
  }

  async getOrderById(orderId: string) {
    let order: any = null;

    if (isDbAvailable && !orderId.startsWith('mock_')) {
      try {
        order = await prisma.orderShadow.findUnique({
          where: { id: orderId },
        });
      } catch (e) {
        console.error("Database error in getOrderById:", e);
      }
    }

    if (!order) {
      // Si es un mock o no está en la base local, intentamos buscarlo en las órdenes del Seller
      try {
        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = auth();
        if (userId) {
          const sellerOrders = await sellerApi.getOrdersByBuyer(userId);
          const match = sellerOrders.find((so: any) => (so.id === orderId || so.externalOrderId === orderId || `mock_${so.id}` === orderId));
          if (match) {
            return {
              id: orderId,
              externalOrderId: match.externalOrderId || match.id,
              userId,
              cartId: match.cartId || null,
              status: match.status || 'PAID',
              totalAmount: match.totalAmount || match.amount || 0,
              trackingId: match.trackingId || null,
              createdAt: match.createdAt ? new Date(match.createdAt) : new Date(),
            };
          }
        }
      } catch (e) {
        console.warn("Failed to find order by ID in Seller App fallback:", e);
      }
      return null;
    }

    // Sincronizar el estado con el Seller App en tiempo real
    try {
      const sellerOrders = await sellerApi.getOrdersByBuyer(order.userId);
      const match = sellerOrders.find((so: any) => (so.externalOrderId || so.id) === order.externalOrderId);
      if (match) {
        if (order.status !== match.status) {
          order.status = match.status || order.status;
          
          // Actualizamos en segundo plano la base de datos local
          if (isDbAvailable && !orderId.startsWith('mock_')) {
            prisma.orderShadow.update({
              where: { id: orderId },
              data: { status: match.status },
            }).catch(e => console.error("Error background updating shadow order status:", e));
          }
        }
        if (match.trackingId) {
          order.trackingId = match.trackingId;
        }
      }
    } catch (e) {
      console.warn("Failed to sync single order status from Seller API:", e);
    }

    return order;
  }
}

export const orderService = new OrderService();
