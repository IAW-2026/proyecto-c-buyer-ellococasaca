"use server";

import { cartService } from "@/services/cart.service";
import { orderService } from "@/services/order.service";
import { sellerApi } from "@/lib/api-clients/seller";
import { paymentsApi } from "@/lib/api-clients/payments";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function addToCartAction(productId: string, size?: string) {
  let userId;
  try {
    const session = auth();
    userId = session?.userId;
  } catch (error) {
    console.error("Auth error in addToCartAction:", error);
  }

  // Bypass para Etapa 2 con mocks ("guest") si auth() falla o no devuelve userId.
  if (!userId) {
     if (process.env.USE_MOCKS === "true") {
       userId = "demo_user";
     } else {
       redirect("/sign-in");
     }
  }

  const product = await sellerApi.getProductById(productId);
  if (!product) throw new Error("Producto no encontrado");
  if (product.stock <= 0) throw new Error("Producto sin stock");

  await cartService.addItem(userId, product, 1, size);
  
  revalidatePath("/", "layout"); // Revalidar layout para actualizar contador
  revalidatePath("/cart");
  revalidatePath(`/products/${productId}`);
}

export async function removeFromCartAction(itemId: string) {
  await cartService.removeItem(itemId);
  revalidatePath("/", "layout");
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
  
  revalidatePath("/", "layout");
  revalidatePath("/cart");
}

export async function checkoutAction(formData: FormData) {
  let userId;
  try {
    const session = auth();
    userId = session?.userId;
  } catch (error) {
    console.error("Auth error in checkoutAction:", error);
  }

  if (!userId) {
     if (process.env.USE_MOCKS === "true") {
       userId = "demo_user";
     } else {
       throw new Error("Unauthorized");
     }
  }

  const address = formData.get("address") as string;
  const paymentMethod = formData.get("payment") as string;

  const cart = await cartService.getCart(userId);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  const total = cart.items.reduce((sum, item) => sum + item.priceAtAdded * item.quantity, 0);

  // 1. Crear Orden Shadow local vinculado al carrito actual
  const order = await orderService.createOrder(userId, total, cart.id);

  // 2. Solicitar Pago a Payments App
  const charge = await paymentsApi.createCharge({
    orderId: order.externalOrderId,
    userId,
    amount: total,
    description: `Compra en El Loco Casaca - ${cart.items.length} productos. Envío a: ${address}`,
  });

  // 3. Si el pago es exitoso (o simulado), desactivar carrito
  if (charge.status === 'APPROVED') {
    await cartService.deactivateCart(cart.id);
    await orderService.updateOrderStatus(order.id, 'PAID');
  } else {
    await orderService.updateOrderStatus(order.id, 'REJECTED');
    // Si el pago es rechazado, redirigimos a una página de error o de vuelta al carrito con mensaje
    redirect(`/cart?error=payment_rejected&orderId=${order.externalOrderId}`);
  }

  revalidatePath("/", "layout");
  revalidatePath("/orders");

  if (charge.redirectUrl) {
    redirect(charge.redirectUrl);
  } else {
    redirect("/orders");
  }
}
