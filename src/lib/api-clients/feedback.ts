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

// Singleton pattern for the mock store to survive HMR in Next.js development
declare global {
  var __mock_reviews_store: Map<string, Review[]> | undefined;
}

const mockReviewsStore = globalThis.__mock_reviews_store ?? new Map<string, Review[]>();

if (process.env.NODE_ENV !== "production") {
  globalThis.__mock_reviews_store = mockReviewsStore;
}

// Initialize with some static data only if empty
if (mockReviewsStore.size === 0) {
  mockReviewsStore.set("1", [
    {
      id: "rev_1",
      orderId: "ORD-DEMO1",
      buyerId: "user_1",
      sellerId: "user_1",
      productId: "1",
      ratingProduct: 5,
      ratingSeller: 5,
      comment: "Excelente calidad, muy conforme.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "rev_2",
      orderId: "ORD-DEMO2",
      buyerId: "user_2",
      sellerId: "user_1",
      productId: "1",
      ratingProduct: 4,
      ratingSeller: 5,
      comment: "Llegó un poco tarde pero la camiseta está genial.",
      createdAt: new Date().toISOString(),
    }
  ]);
  
  // Agregar algunas para otros productos para que no se vea vacío
  mockReviewsStore.set("2", [
    {
      id: "rev_3",
      orderId: "ORD-DEMO3",
      buyerId: "user_3",
      sellerId: "user_1",
      productId: "2",
      ratingProduct: 5,
      ratingSeller: 5,
      comment: "Talle perfecto, tal cual la descripción.",
      createdAt: new Date().toISOString(),
    }
  ]);
}

export class FeedbackApiClient {
  private useMocks: boolean;
  private baseUrl: string;

  constructor() {
    this.useMocks = process.env.USE_MOCKS === "true";
    this.baseUrl = process.env.FEEDBACK_API_URL || "http://localhost:3004";
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    if (this.useMocks) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockReviewsStore.get(productId) || [];
    }

    const response = await fetch(`${this.baseUrl}/api/reviews/product/${productId}`);
    if (!response.ok) return [];
    return response.json();
  }

  async getProductRating(productId: string): Promise<RatingsCache | null> {
    if (this.useMocks) {
      const reviews = mockReviewsStore.get(productId) || [];
      if (reviews.length === 0) return { targetId: productId, averageRating: 0, totalReviews: 0 };
      
      const avg = reviews.reduce((sum, r) => sum + r.ratingProduct, 0) / reviews.length;
      return {
        targetId: productId,
        averageRating: Number(avg.toFixed(1)),
        totalReviews: reviews.length,
      };
    }

    const response = await fetch(`${this.baseUrl}/api/ratings/${productId}`);
    if (!response.ok) return null;
    return response.json();
  }

  async getSellerReviews(sellerId: string): Promise<Review[]> {
    if (this.useMocks) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const allReviews = Array.from(mockReviewsStore.values()).flat();
      return allReviews.filter(r => r.sellerId === sellerId);
    }

    const response = await fetch(`${this.baseUrl}/api/reviews/seller/${sellerId}`);
    if (!response.ok) return [];
    return response.json();
  }

  async getSellerRating(sellerId: string): Promise<RatingsCache | null> {
    if (this.useMocks) {
      const allReviews = Array.from(mockReviewsStore.values()).flat().filter(r => r.sellerId === sellerId);
      if (allReviews.length === 0) return { targetId: sellerId, averageRating: 5, totalReviews: 10 };
      
      const avg = allReviews.reduce((sum, r) => sum + r.ratingSeller, 0) / allReviews.length;
      return {
        targetId: sellerId,
        averageRating: Number(avg.toFixed(1)),
        totalReviews: 120 + allReviews.length,
      };
    }

    const response = await fetch(`${this.baseUrl}/api/ratings/seller/${sellerId}`);
    if (!response.ok) return null;
    return response.json();
  }

  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    if (this.useMocks) {
      const newReview: Review = {
        ...review,
        id: `rev_${Math.random().toString(36).substring(7)}`,
        createdAt: new Date().toISOString(),
      };
      
      const current = mockReviewsStore.get(review.productId) || [];
      // Evitar duplicados si por algún motivo se dispara la acción varias veces en el mismo tick
      if (!current.some(r => r.comment === review.comment && r.buyerId === review.buyerId)) {
        mockReviewsStore.set(review.productId, [newReview, ...current]);
      }
      
      return newReview;
    }

    const response = await fetch(`${this.baseUrl}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });

    if (!response.ok) throw new Error('Feedback API error');
    return response.json();
  }
}

export const feedbackApi = new FeedbackApiClient();
