import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isValidInternalRequest } from "@/utils/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isValidInternalRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
