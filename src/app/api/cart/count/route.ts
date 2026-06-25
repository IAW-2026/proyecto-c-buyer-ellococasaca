import { cartService } from "@/services/cart.service";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  let userId: string | null | undefined;
  try {
    const session = auth();
    userId = session?.userId;
  } catch (error) {
    console.error("Auth error in /api/cart/count:", error);
  }

  if (!userId) {
    return NextResponse.json({ count: 0 });
  }

  const cart = await cartService.getCart(userId);
  const count = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return NextResponse.json({ count });
}
