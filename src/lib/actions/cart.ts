"use server";

import { cartService } from "@/services/cart.service";
import { orderService } from "@/services/order.service";
import { sellerApi } from "@/lib/api-clients/seller";
import { paymentsApi } from "@/lib/api-clients/payments";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function addToCartAction(productId: string) {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("Debes iniciar sesión para agregar productos al carrito");
  }

  const product = await sellerApi.getProductById(productId);
  if (!product) throw new Error("Producto no encontrado");
  if (product.stock <= 0) throw new Error("Producto sin stock");

  await cartService.addItem(userId, product);
  
  revalidatePath("/cart");
  revalidatePath(`/products/${productId}`);
}

export async function removeFromCartAction(itemId: string) {
  await cartService.removeItem(itemId);
  revalidatePath("/cart");
}

export async function updateCartItemQuantityAction(itemId: string, productId: string, newQuantity: number) {
  if (newQuantity <= 0) {
    await cartService.removeItem(itemId);
  } else {
    const product = await sellerApi.getProductById(productId);
    if (!product) throw new Error("Producto no encontrado");
    
    if (newQuantity > product.stock) {
      throw new Error(`Solo quedan ${product.stock} unidades disponibles`);
    }

    await cartService.updateQuantity(itemId, newQuantity);
  }
  
  revalidatePath("/cart");
}

export async function checkoutAction() {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const cart = await cartService.getCart(userId);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  const total = cart.items.reduce((sum, item) => sum + item.priceAtAdded * item.quantity, 0);

  // 1. Crear Orden Shadow local
  const order = await orderService.createOrder(userId, total);

  // 2. Solicitar Pago a Payments App
  const charge = await paymentsApi.createCharge({
    orderId: order.externalOrderId,
    userId,
    amount: total,
    description: `Compra en El Loco Casaca - ${cart.items.length} productos`,
  });

  // 3. Si el pago es exitoso (o simulado), desactivar carrito
  if (charge.status === 'APPROVED') {
    await cartService.deactivateCart(cart.id);
    await orderService.updateOrderStatus(order.id, 'APPROVED');
  }

  if (charge.redirectUrl) {
    redirect(charge.redirectUrl);
  }

  return { success: true, orderId: order.id };
}
