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
      return this.getMockShipment(orderId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/shipments?limit=50`, { next: { revalidate: 0 } });
      if (!response.ok) {
        console.warn(`Shipping API GET /api/shipments returned ${response.status}.`);
        return null;
      }
      
      const resData = await response.json();
      const shipments = resData.data || [];
      const found = shipments.find((s: any) => s.orderId === orderId);
      
      if (!found) {
        console.warn(`Shipping API: Shipment for orderId ${orderId} not found.`);
        return null;
      }
      
      return found;
    } catch (e) {
      console.warn("Failed to connect to Shipping API.", e);
      return null;
    }
  }

  async getAllShipments(): Promise<Shipment[]> {
    if (this.useMocks) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/shipments?limit=50`, { next: { revalidate: 0 } });
      if (!response.ok) {
        console.warn(`Shipping API GET /api/shipments returned ${response.status}.`);
        return [];
      }
      const resData = await response.json();
      return resData.data || [];
    } catch (e) {
      console.warn("Failed to connect to Shipping API in getAllShipments.", e);
      return [];
    }
  }

  private async getMockShipment(orderId: string): Promise<Shipment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lastChar = orderId.charAt(orderId.length - 1).toUpperCase();
    let status: 'PREPARING' | 'SHIPPED' | 'DELIVERED' = 'DELIVERED';
    
    if (['0', '1', '2', '3'].includes(lastChar)) status = 'PREPARING';
    else if (['4', '5', '6', '7'].includes(lastChar)) status = 'SHIPPED';

    return {
      id: `ship_${orderId}`,
      orderId,
      buyerId: "demo_user",
      sellerId: "user_1",
      status,
      trackingCode: `TRK-${orderId.substring(4, 10)}`,
      addressSnapshot: {
        street: "Av. Alem 1253",
        city: "Bahía Blanca",
        postalCode: "8000"
      },
    };
  }
}

export const shippingApi = new ShippingApiClient();

