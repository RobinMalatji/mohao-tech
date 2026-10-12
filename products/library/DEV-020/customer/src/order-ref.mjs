export function orderReference(date, randomBytes) {
  const day = date.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Buffer.from(randomBytes(4)).toString("hex").toUpperCase();
  return "MH-" + day + "-" + suffix;
}
