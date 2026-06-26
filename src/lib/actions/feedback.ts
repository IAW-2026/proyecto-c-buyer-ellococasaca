"use server";

import { feedbackApi } from "@/lib/api-clients/feedback";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function submitReviewAction(formData: FormData) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const productId = formData.get("productId") as string;
  const orderId = formData.get("orderId") as string;
  const sellerId = formData.get("sellerId") as string;
  const ratingProduct = parseInt(formData.get("ratingProduct") as string);
  const comment = formData.get("comment") as string;

  let isError = false;
  try {
    await feedbackApi.createReview({
      productId,
      orderId,
      buyerId: userId,
      sellerId,
      ratingProduct,
      ratingSeller: ratingProduct, // Fallback as feedback app infers it from product rating
      comment,
    });
  } catch (error: any) {
    console.error("Failed to submit review via feedbackApi:", error);
    isError = true;
  }

  if (isError) {
    redirect(`/products/${productId}?error=feedback_api_error`);
  } else {
    revalidatePath(`/products/${productId}`);
  }
}
