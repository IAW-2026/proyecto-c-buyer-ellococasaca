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
      
      // Lógica determinista para simular diferentes estados basándose en el ID
      // Ahora más generosa con 'DELIVERED' para facilitar pruebas de reseñas
      const lastChar = orderId.charAt(orderId.length - 1).toUpperCase();
      let status: 'PREPARING' | 'SHIPPED' | 'DELIVERED' = 'DELIVERED';
      
      // 0-3: PREPARING, 4-7: SHIPPED, 8-9 and Letters: DELIVERED
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

    const response = await fetch(`${this.baseUrl}/api/shipments/order/${orderId}`);
    if (!response.ok) return null;
    return response.json();
  }
}

export const shippingApi = new ShippingApiClient();
