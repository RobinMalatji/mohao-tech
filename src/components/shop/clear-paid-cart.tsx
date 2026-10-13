"use client";

import { useEffect } from "react";
import { clearCartAfterPayment } from "@/actions/checkout";

export function ClearPaidCart({ orderId }: { orderId: string }) {
  useEffect(() => {
    void clearCartAfterPayment(orderId);
  }, [orderId]);

  return null;
}
