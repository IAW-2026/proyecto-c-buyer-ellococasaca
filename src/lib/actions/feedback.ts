"use server";

import { feedbackApi } from "@/lib/api-clients/feedback";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function submitReviewAction(formData: FormData) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const productId = formData.get("productId") as string;
  const orderId = formData.get("orderId") as string;
  const sellerId = formData.get("sellerId") as string;
  const ratingProduct = parseInt(formData.get("ratingProduct") as string);
  const ratingSeller = parseInt(formData.get("ratingSeller") as string);
  const comment = formData.get("comment") as string;

  await feedbackApi.createReview({
    productId,
    orderId,
    buyerId: userId,
    sellerId,
    ratingProduct,
    ratingSeller,
    comment,
  });

  revalidatePath(`/products/${productId}`);
}
