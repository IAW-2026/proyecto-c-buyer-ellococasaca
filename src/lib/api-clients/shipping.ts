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
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.SHIPPING_API_URL || "http://localhost:3003";
  }

  async getShipmentByOrderId(orderId: string): Promise<Shipment | null> {
    try {
      const headers: Record<string, string> = {};
      if (process.env.INTER_SERVICE_SECRET) {
        headers["x-inter-service-secret"] = process.env.INTER_SERVICE_SECRET;
      }

      const response = await fetch(`${this.baseUrl}/api/shipments/by-order/${orderId}`, { 
        headers,
        next: { revalidate: 0 } 
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.data) {
          return resData.data;
        }
      } else {
        console.warn(`Shipping API GET /api/shipments/by-order/${orderId} returned ${response.status}. Trying fallback...`);
      }
      
      // Fallback: search in general list
      const fallbackResponse = await fetch(`${this.baseUrl}/api/shipments?limit=50`, { 
        headers,
        next: { revalidate: 0 } 
      });
      if (!fallbackResponse.ok) {
        console.warn(`Shipping API fallback GET /api/shipments returned ${fallbackResponse.status}.`);
        return null;
      }
      
      const resData = await fallbackResponse.json();
      const shipments = resData.data || [];
      const found = shipments.find((s: any) => s.orderId === orderId);
      
      if (!found) {
        console.warn(`Shipping API: Shipment for orderId ${orderId} not found in fallback.`);
        return null;
      }
      
      return found;
    } catch (e) {
      console.warn("Failed to connect to Shipping API in getShipmentByOrderId.", e);
      return null;
    }
  }

  async getAllShipments(): Promise<Shipment[]> {
    try {
      const headers: Record<string, string> = {};
      if (process.env.INTER_SERVICE_SECRET) {
        headers["x-inter-service-secret"] = process.env.INTER_SERVICE_SECRET;
      }

      const response = await fetch(`${this.baseUrl}/api/shipments?limit=50`, { 
        headers,
        next: { revalidate: 0 } 
      });
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

  async getShipmentById(shipmentId: string): Promise<Shipment | null> {
    try {
      const headers: Record<string, string> = {};
      if (process.env.INTER_SERVICE_SECRET) {
        headers["x-inter-service-secret"] = process.env.INTER_SERVICE_SECRET;
      }

      let resolvedId = shipmentId;
      let trackingCode = `TRK-${shipmentId.substring(0, 8).toUpperCase()}`;
      
      try {
        const listRes = await fetch(`${this.baseUrl}/api/shipments?limit=100`, { 
          headers,
          next: { revalidate: 0 } 
        });
        if (listRes.ok) {
          const listData = await listRes.json();
          const shipments = listData.data || [];
          const found = shipments.find((s: any) => s.id === shipmentId || s.trackingCode === shipmentId);
          if (found) {
            resolvedId = found.id;
            if (found.trackingCode) {
              trackingCode = found.trackingCode;
            }
          }
        }
      } catch (listErr) {
        console.warn("Failed to fetch all shipments list for trackingCode fallback:", listErr);
      }

      const response = await fetch(`${this.baseUrl}/api/shipments/${resolvedId}/tracking`, { 
        headers,
        next: { revalidate: 0 } 
      });
      if (!response.ok) {
        console.warn(`Shipping API GET /api/shipments/${resolvedId}/tracking returned ${response.status}.`);
        return null;
      }
      
      const data = await response.json();

      return {
        id: data.shipmentId || resolvedId,
        orderId: data.orderId,
        buyerId: data.buyerId || "",
        sellerId: data.sellerId || "",
        status: data.currentStatus || 'PREPARING',
        trackingCode: trackingCode,
        addressSnapshot: data.addressSnapshot || null,
        history: data.history || [],
      } as any;
    } catch (e) {
      console.warn("Failed to connect to Shipping API in getShipmentById.", e);
      return null;
    }
  }
}

export const shippingApi = new ShippingApiClient();

