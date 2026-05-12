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
  private useMocks: boolean;
  private baseUrl: string;

  constructor() {
    this.useMocks = process.env.USE_MOCKS === "true";
    this.baseUrl = process.env.FEEDBACK_API_URL || "http://localhost:3004";
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    if (this.useMocks) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: "rev_1",
          orderId: "ord_1",
          buyerId: "user_1",
          sellerId: "seller_1",
          productId,
          ratingProduct: 5,
          ratingSeller: 5,
          comment: "Excelente calidad, muy conforme.",
          createdAt: new Date().toISOString(),
        },
        {
          id: "rev_2",
          orderId: "ord_2",
          buyerId: "user_2",
          sellerId: "seller_1",
          productId,
          ratingProduct: 4,
          ratingSeller: 5,
          comment: "Llegó un poco tarde pero la camiseta está genial.",
          createdAt: new Date().toISOString(),
        }
      ];
    }

    const response = await fetch(`${this.baseUrl}/api/reviews/product/${productId}`);
    if (!response.ok) return [];
    return response.json();
  }

  async getProductRating(productId: string): Promise<RatingsCache | null> {
    if (this.useMocks) {
      return {
        targetId: productId,
        averageRating: 4.5,
        totalReviews: 2,
      };
    }

    const response = await fetch(`${this.baseUrl}/api/ratings/${productId}`);
    if (!response.ok) return null;
    return response.json();
  }

  async getSellerReviews(sellerId: string): Promise<Review[]> {
    if (this.useMocks) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        {
          id: "rev_s1",
          orderId: "ord_s1",
          buyerId: "user_s1",
          sellerId,
          productId: "1",
          ratingProduct: 5,
          ratingSeller: 5,
          comment: "Vendedor muy atento y rápido.",
          createdAt: new Date().toISOString(),
        }
      ];
    }

    const response = await fetch(`${this.baseUrl}/api/reviews/seller/${sellerId}`);
    if (!response.ok) return [];
    return response.json();
  }

  async getSellerRating(sellerId: string): Promise<RatingsCache | null> {
    if (this.useMocks) {
      return {
        targetId: sellerId,
        averageRating: 4.8,
        totalReviews: 120,
      };
    }

    const response = await fetch(`${this.baseUrl}/api/ratings/seller/${sellerId}`);
    if (!response.ok) return null;
    return response.json();
  }

  async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    if (this.useMocks) {
      return {
        ...review,
        id: `rev_${Math.random().toString(36).substring(7)}`,
        createdAt: new Date().toISOString(),
      };
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
