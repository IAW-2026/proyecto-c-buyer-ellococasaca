import { auth } from "@clerk/nextjs/server";

export type Review = {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  ratingProduct: number;
  ratingSeller: number;
  comment: string;
  createdAt: string;
};

export type RatingsCache = {
  targetId: string;
  averageRating: number;
  totalReviews: number;
};

export class FeedbackApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.FEEDBACK_API_URL || "http://localhost:3004";
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const headers: Record<string, string> = {};
      if (process.env.INTER_SERVICE_SECRET) {
        headers["x-inter-service-secret"] = process.env.INTER_SERVICE_SECRET;
      }

      const response = await fetch(`${this.baseUrl}/api/reviews/product/${productId}?limit=100`, { 
        headers,
        next: { revalidate: 0 } 
      });
      if (!response.ok) return [];
      
      const data = await response.json();
      const reviewsList = Array.isArray(data) ? data : (data.reviews || []);
      
      return reviewsList.map((r: any) => ({
        id: r.reviewId || r.id || '',
        orderId: r.orderId || '',
        buyerId: r.buyerId || '',
        sellerId: r.sellerId || '',
        productId: r.productId || productId,
        ratingProduct: typeof r.rating === 'number' ? r.rating : (typeof r.productRating === 'number' ? r.productRating : (r.ratingProduct || 5)),
        ratingSeller: typeof r.sellerRating === 'number' ? r.sellerRating : (typeof r.ratingSeller === 'number' ? r.ratingSeller : 5),
        comment: r.comment || '',
        createdAt: r.createdAt || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn(`Failed to fetch product reviews for ${productId}:`, e);
      return [];
    }
  }

  async getProductRating(productId: string): Promise<RatingsCache | null> {
    try {
      const headers: Record<string, string> = {};
      if (process.env.INTER_SERVICE_SECRET) {
        headers["x-inter-service-secret"] = process.env.INTER_SERVICE_SECRET;
      }

      const response = await fetch(`${this.baseUrl}/api/product-ratings/${productId}`, { 
        headers,
        next: { revalidate: 0 } 
      });
      if (!response.ok) return null;
      
      const data = await response.json();
      return {
        targetId: productId,
        averageRating: typeof data.averageRating === 'number' ? data.averageRating : (data.rating || 0),
        totalReviews: typeof data.totalReviews === 'number' ? data.totalReviews : (data.count || 0),
      };
    } catch (e) {
      console.warn(`Failed to fetch product rating for ${productId}:`, e);
      return null;
    }
  }

  async getSellerReviews(sellerId: string): Promise<Review[]> {
    try {
      const headers: Record<string, string> = {};
      if (process.env.INTER_SERVICE_SECRET) {
        headers["x-inter-service-secret"] = process.env.INTER_SERVICE_SECRET;
      }

      const response = await fetch(`${this.baseUrl}/api/reviews/seller/${sellerId}?limit=100`, { 
        headers,
        next: { revalidate: 0 } 
      });
      if (!response.ok) return [];
      
      const data = await response.json();
      const reviewsList = Array.isArray(data) ? data : (data.reviews || []);
      
      return reviewsList.map((r: any) => ({
        id: r.reviewId || r.id || '',
        orderId: r.orderId || '',
        buyerId: r.buyerId || '',
        sellerId: r.sellerId || sellerId,
        productId: r.productId || '',
        ratingProduct: typeof r.ratingProduct === 'number' ? r.ratingProduct : (typeof r.rating === 'number' ? r.rating : 5),
        ratingSeller: typeof r.sellerRating === 'number' ? r.sellerRating : (typeof r.ratingSeller === 'number' ? r.ratingSeller : 5),
        comment: r.comment || '',
        createdAt: r.createdAt || new Date().toISOString(),
      }));
    } catch (e) {
      console.warn(`Failed to fetch seller reviews for ${sellerId}:`, e);
      return [];
    }
  }

  async getSellerRating(sellerId: string): Promise<RatingsCache | null> {
    try {
      const headers: Record<string, string> = {};
      if (process.env.INTER_SERVICE_SECRET) {
        headers["x-inter-service-secret"] = process.env.INTER_SERVICE_SECRET;
      }

      const response = await fetch(`${this.baseUrl}/api/seller-ratings/${sellerId}`, { 
        headers,
        next: { revalidate: 0 } 
      });
      if (!response.ok) return null;
      
      const data = await response.json();
      return {
        targetId: sellerId,
        averageRating: typeof data.averageRating === 'number' ? data.averageRating : (data.rating || 0),
        totalReviews: typeof data.totalReviews === 'number' ? data.totalReviews : (data.count || 0),
      };
    } catch (e) {
      console.warn(`Failed to fetch seller rating for ${sellerId}:`, e);
      return null;
    }
  }

  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    let token = null;
    try {
      token = await auth().getToken();
    } catch (e) {
      console.warn("Failed to get Clerk token inside createReview:", e);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (process.env.INTER_SERVICE_SECRET) {
      headers['x-inter-service-secret'] = process.env.INTER_SERVICE_SECRET;
    }

    const payload = {
      buyerId: review.buyerId,
      orderId: review.orderId,
      productId: review.productId,
      sellerId: review.sellerId,
      productRating: review.ratingProduct,
      sellerRating: review.ratingSeller,
      comment: review.comment,
    };

    const response = await fetch(`${this.baseUrl}/api/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Feedback API error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorData.msg || errorMessage;
      } catch (_) {
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch (_) {}
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return {
      id: data.id || data.reviewId || `rev_${Math.random().toString(36).substring(7)}`,
      orderId: review.orderId,
      buyerId: review.buyerId,
      sellerId: review.sellerId,
      productId: review.productId,
      ratingProduct: review.ratingProduct,
      ratingSeller: review.ratingSeller,
      comment: review.comment,
      createdAt: data.createdAt || new Date().toISOString(),
    };
  }

  async checkReviewEligibility(productId: string): Promise<{ canReview: boolean; orderId?: string }> {
    let token = null;
    try {
      token = await auth().getToken();
    } catch (e) {
      console.warn("Failed to get Clerk token inside checkReviewEligibility:", e);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (process.env.INTER_SERVICE_SECRET) {
      headers['x-inter-service-secret'] = process.env.INTER_SERVICE_SECRET;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/buyer/purchases/eligible/${productId}`, {
        headers,
        next: { revalidate: 0 }
      });
      if (!response.ok) return { canReview: false };
      const data = await response.json();
      
      const eligibleOrder = data.orders?.find((o: any) => o.canReview);
      return {
        canReview: !!data.canReview,
        orderId: eligibleOrder?.orderId || undefined
      };
    } catch (e) {
      console.warn(`Failed to check review eligibility for product ${productId}:`, e);
      return { canReview: false };
    }
  }
}

export const feedbackApi = new FeedbackApiClient();


