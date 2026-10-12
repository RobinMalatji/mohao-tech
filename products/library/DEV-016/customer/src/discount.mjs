export function applyDiscount(subtotalCents, discount) {
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0) throw new Error("Subtotal must be zero or a positive integer.");
  if (discount.type === "percent") {
    if (!Number.isInteger(discount.basisPoints) || discount.basisPoints < 0 || discount.basisPoints > 10000) {
      throw new Error("Percent must be between 0 and 10000 basis points.");
    }
    const reduction = Math.round((subtotalCents * discount.basisPoints) / 10000);
    return { reduction, total: subtotalCents - reduction };
  }
  if (discount.type === "fixed") {
    if (!Number.isInteger(discount.cents) || discount.cents < 0 || discount.cents > subtotalCents) {
      throw new Error("Fixed discount must fit inside the subtotal.");
    }
    return { reduction: discount.cents, total: subtotalCents - discount.cents };
  }
  throw new Error("Discount type must be percent or fixed.");
}
