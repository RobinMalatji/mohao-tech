function assertCents(value, label) {
  if (!Number.isInteger(value)) throw new Error(label + " must be integer cents.");
}

export function addCents(values) {
  return values.reduce((total, value) => {
    assertCents(value, "Value");
    return total + value;
  }, 0);
}

export function subtractCents(total, deduction) {
  assertCents(total, "Total");
  assertCents(deduction, "Deduction");
  if (deduction > total) throw new Error("Deduction is larger than the total.");
  return total - deduction;
}
