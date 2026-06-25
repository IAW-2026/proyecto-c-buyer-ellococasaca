import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    const updatedOrder = await prisma.orderShadow.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error(`Error updating order ${params.id}:`, error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
