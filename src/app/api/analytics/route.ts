import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Métricas de Compradores (Usuarios registrados vía Clerk en local)
    const totalBuyers = await prisma.user.count();
    const recentBuyers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { clerkId: true, email: true, name: true, createdAt: true },
    });

    // 2. Métricas de Carritos
    const totalCarts = await prisma.cart.count();
    const activeCartsCount = await prisma.cart.count({
      where: { isActive: true },
    });
    
    // Total de productos actualmente guardados en carritos activos
    const activeCartItems = await prisma.cartItem.aggregate({
      where: { cart: { isActive: true } },
      _sum: { quantity: true },
    });

    // 3. Métricas de Órdenes Shadow (Monto facturado y estados)
    const orders = await prisma.orderShadow.findMany({
      select: {
        status: true,
        totalAmount: true,
      }
    });

    const totalOrders = orders.length;
    let paidAmountVolume = 0;
    const byStatus = {
      PENDING: 0,
      PAID: 0,
      REJECTED: 0,
    };

    orders.forEach(o => {
      if (o.status === "PAID") {
        paidAmountVolume += o.totalAmount;
      }
      if (o.status in byStatus) {
        byStatus[o.status as keyof typeof byStatus]++;
      }
    });

    const recentOrders = await prisma.orderShadow.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      buyers: {
        total: totalBuyers,
        recent: recentBuyers,
      },
      carts: {
        total: totalCarts,
        active: activeCartsCount,
        totalItemsInActive: activeCartItems._sum.quantity || 0,
      },
      orders: {
        total: totalOrders,
        volume: paidAmountVolume,
        byStatus,
        recent: recentOrders,
      }
    });
  } catch (error) {
    console.error("Error generating analytics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
