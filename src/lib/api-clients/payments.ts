export type ChargeRequest = {
  orderId: string;
  userId: string;
  amount: number;
  description: string;
};

export type ChargeResponse = {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  redirectUrl?: string;
};

export class PaymentsApiClient {
  private useMocks: boolean;
  private baseUrl: string;

  constructor() {
    this.useMocks = process.env.USE_MOCKS === "true";
    this.baseUrl = process.env.PAYMENTS_API_URL || "http://localhost:3002";
  }

  async createCharge(request: ChargeRequest): Promise<ChargeResponse> {
    if (this.useMocks) {
      // Simular latencia
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      return {
        id: `ch_${Math.random().toString(36).substring(7)}`,
        status: 'APPROVED',
        redirectUrl: `/orders/success?orderId=${request.orderId}`
      };
    }

    const response = await fetch(`${this.baseUrl}/api/charges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error('Payments API error');
    return response.json();
  }
}

export const paymentsApi = new PaymentsApiClient();
