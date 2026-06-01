"use client";

import { useEffect } from "react";

export function CartRefreshTrigger() {
  useEffect(() => {
    // Disparar evento para que el header se entere que el carrito cambió
    window.dispatchEvent(new Event("cart-updated"));
  }, []);

  return null;
}
