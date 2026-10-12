import { createHmac, timingSafeEqual } from "node:crypto";

export function hmacMatches(body, secret, signatureHex) {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const left = Buffer.from(String(signatureHex));
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
