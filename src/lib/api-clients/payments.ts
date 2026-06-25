import { auth } from "@clerk/nextjs/server";

export type ShippingAddress = {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

export type ChargeRequest = {
  orderId: string;
  chargeId?: string;
  buyerId: string;
  sellerId: string;
  productIds: string[];
  shippingAddress: ShippingAddress;
  amount?: number;
  description?: string;
};

export type ChargeResponse = {
  id?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  redirectUrl?: string;
  url?: string;
};

export class PaymentsApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.PAYMENTS_API_URL || "http://localhost:3002";
  }

  async createCharge(request: ChargeRequest): Promise<ChargeResponse> {
    let token = null;
    try {
      token = await auth().getToken();
    } catch (e) {
      console.warn("Failed to get Clerk token inside PaymentsApiClient.createCharge:", e);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = {
      order_id: request.orderId,
      charge_id: request.chargeId,
      buyer_id: request.buyerId,
      seller_id: request.sellerId,
      product_ids: request.productIds,
      products_id: request.productIds,
      shipping_address: request.shippingAddress,
      amount: request.amount,
      description: request.description,
    };

    console.log("Payments API request payload:", JSON.stringify(payload, null, 2));
    const response = await fetch(`${this.baseUrl}/api/charge`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let bodyText = "";
      try {
        bodyText = await response.text();
      } catch (_) {}
      console.error(`Payments API error: status=${response.status}, body=${bodyText}`);
      throw new Error(`Payments API error: ${response.status} - ${bodyText}`);
    }
    const data = await response.json();
    console.log("Payments API response:", JSON.stringify(data, null, 2));
    return data;
  }
}

export const paymentsApi = new PaymentsApiClient();

