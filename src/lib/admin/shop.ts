import type { OrderStatus, Prisma } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/db";

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Waiting for payment",
  PAID: "Paid",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export type ShopOrder = Prisma.OrderGetPayload<{ include: { items: true } }>;

export type ShopOrderSnapshot = {
  available: boolean;
  counts: Record<OrderStatus, number>;
  paidCents: number;
  orders: ShopOrder[];
};

const emptyCounts: Record<OrderStatus, number> = {
  PENDING: 0,
  PAID: 0,
  FAILED: 0,
  CANCELLED: 0,
};

export function emptyShopOrders(): ShopOrderSnapshot {
  return {
    available: false,
    counts: { ...emptyCounts },
    paidCents: 0,
    orders: [],
  };
}

export function summariseOrderRows(
  rows: {
    status: OrderStatus;
    currency: string;
    count: number;
    amountCents: number | null;
  }[],
) {
  const counts = { ...emptyCounts };
  let paidCents = 0;

  for (const row of rows) {
    counts[row.status] += row.count;
    if (row.status === "PAID" && row.currency === "ZAR") {
      paidCents += row.amountCents ?? 0;
    }
  }

  return { counts, paidCents };
}

export async function loadShopOrders(limit: number): Promise<ShopOrderSnapshot> {
  if (!isDatabaseConfigured()) return emptyShopOrders();

  try {
    const [grouped, orders] = await Promise.all([
      prisma.order.groupBy({
        by: ["status", "currency"],
        _count: { _all: true },
        _sum: { amountCents: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
        take: limit,
      }),
    ]);

    const { counts, paidCents } = summariseOrderRows(
      grouped.map((row) => ({
        status: row.status,
        currency: row.currency,
        count: row._count._all,
        amountCents: row._sum.amountCents,
      })),
    );

    return { available: true, counts, paidCents, orders };
  } catch (error) {
    console.error("Shop orders could not be loaded", error);
    return emptyShopOrders();
  }
}

export async function getShopOrder(id: string) {
  if (!isDatabaseConfigured()) return null;

  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}
