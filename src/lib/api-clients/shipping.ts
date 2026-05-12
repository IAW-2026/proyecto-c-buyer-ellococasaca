export type Shipment = {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  status: 'PREPARING' | 'SHIPPED' | 'DELIVERED';
  trackingCode: string;
  addressSnapshot: any;
};

export class ShippingApiClient {
  private useMocks: boolean;
  private baseUrl: string;

  constructor() {
    this.useMocks = process.env.USE_MOCKS === "true";
    this.baseUrl = process.env.SHIPPING_API_URL || "http://localhost:3003";
  }

  async getShipmentByOrderId(orderId: string): Promise<Shipment | null> {
    if (this.useMocks) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: "ship_1",
        orderId,
        buyerId: "user_1",
        sellerId: "seller_1",
        status: 'DELIVERED',
        trackingCode: "TRK123456789",
        addressSnapshot: {},
      };
    }

    const response = await fetch(`${this.baseUrl}/api/shipments/order/${orderId}`);
    if (!response.ok) return null;
    return response.json();
  }
}

export const shippingApi = new ShippingApiClient();
