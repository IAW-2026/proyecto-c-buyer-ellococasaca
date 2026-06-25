"use server";

import { cartService } from "@/services/cart.service";
import { orderService } from "@/services/order.service";
import { sellerApi } from "@/lib/api-clients/seller";
import { paymentsApi, ChargeResponse } from "@/lib/api-clients/payments";
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

  if (!userId) {
    redirect("/sign-in");
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

function parseShippingAddress(addressStr: string) {
  const parts = addressStr.split(/\s*,\s*/);
  return {
    street: parts[0] || addressStr || "Calle Sin Nombre 123",
    city: parts[1] || "Bahia Blanca",
    province: parts[2] || "Buenos Aires",
    postalCode: parts[3] || "8000",
    country: parts[4] || "Argentina",
  };
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
    throw new Error("Unauthorized");
  }

  const address = formData.get("address") as string;
  const paymentMethod = formData.get("payment") as string;

  const parsedAddress = parseShippingAddress(address);

  const cart = await cartService.getCart(userId);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  // Fetch product details to group items by sellerId
  const itemsWithSellers = await Promise.all(
    cart.items.map(async (item) => {
      const product = await sellerApi.getProductById(item.productId);
      if (!product) {
        throw new Error(`Producto ${item.productName} no encontrado`);
      }
      return {
        item,
        sellerId: product.sellerId,
      };
    })
  );

  // Group by sellerId
  const groupsBySeller: Record<string, typeof itemsWithSellers> = {};
  for (const itemWithSeller of itemsWithSellers) {
    const sId = itemWithSeller.sellerId;
    if (!groupsBySeller[sId]) {
      groupsBySeller[sId] = [];
    }
    groupsBySeller[sId].push(itemWithSeller);
  }

  const sellerIds = Object.keys(groupsBySeller);
  const results: { order: any; charge: ChargeResponse }[] = [];

  for (const sellerId of sellerIds) {
    const groupItems = groupsBySeller[sellerId];
    const groupTotal = groupItems.reduce((sum, gi) => sum + gi.item.priceAtAdded * gi.item.quantity, 0);
    const productIds = groupItems.map(gi => gi.item.productId);

    // 1. Crear Orden Shadow local para este vendedor
    const order = await orderService.createOrder(userId, groupTotal, cart.id);

    // 2. Solicitar Pago a Payments App para este vendedor
    try {
      const charge = await paymentsApi.createCharge({
        orderId: order.externalOrderId,
        chargeId: `ch_${Math.random().toString(36).substring(7)}`,
        buyerId: userId,
        sellerId,
        productIds,
        shippingAddress: parsedAddress,
        amount: groupTotal,
        description: `Compra en El Loco Casaca - Vendedor: ${sellerId} - ${groupItems.length} productos. Envío a: ${address}`,
      });
      results.push({ order, charge });
    } catch (error) {
      console.error(`Failed to create charge for order ${order.externalOrderId}:`, error);
      results.push({
        order,
        charge: { id: '', status: 'REJECTED', redirectUrl: undefined }
      });
    }
  }

  // 3. Actualizar estados de órdenes según resultados de cobros
  let atLeastOneApproved = false;
  let firstRedirectUrl: string | undefined = undefined;
  let firstRejectedOrderId: string | undefined = undefined;

  for (const res of results) {
    const redirectUrl = res.charge.redirectUrl || res.charge.url;

    if (res.charge.status === 'APPROVED') {
      atLeastOneApproved = true;
      await orderService.updateOrderStatus(res.order.id, 'PAID');
    } else if (redirectUrl) {
      // El cobro requiere redirección al gateway de pago (estado PENDING inicial se mantiene)
      if (!firstRedirectUrl) {
        const paymentsUrl = process.env.PAYMENTS_API_URL || "https://proyecto-c-payments2-ellococasaca.vercel.app";
        firstRedirectUrl = redirectUrl.startsWith('http') ? redirectUrl : `${paymentsUrl}${redirectUrl}`;
      }
    } else {
      await orderService.updateOrderStatus(res.order.id, 'REJECTED');
      if (!firstRejectedOrderId) {
        firstRejectedOrderId = res.order.externalOrderId;
      }
    }
  }

  // 4. Si al menos un pago fue aprobado (o redirigido exitosamente), desactivar carrito
  if (atLeastOneApproved || firstRedirectUrl) {
    await cartService.deactivateCart(cart.id);
  }

  if (firstRedirectUrl) {
    redirect(`/checkout/redirect?url=${encodeURIComponent(firstRedirectUrl)}`);
  }

  revalidatePath("/", "layout");
  revalidatePath("/orders");

  if (atLeastOneApproved) {
    redirect("/orders");
  } else {
    redirect(`/cart?error=payment_rejected&orderId=${firstRejectedOrderId || 'unknown'}`);
  }
}
