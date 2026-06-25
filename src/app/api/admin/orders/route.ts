import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await prisma.orderShadow.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: orders });
  } catch (error) {
    console.error("Error listing admin ordersShadow:", error);
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}
