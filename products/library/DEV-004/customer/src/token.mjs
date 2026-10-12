import { createHmac, timingSafeEqual } from "node:crypto";

export function signToken(payload, secret, ttlSeconds, now = Date.now()) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: now + ttlSeconds * 1000 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return body + "." + signature;
}

export function readToken(token, secret, now = Date.now()) {
  const parts = String(token).split(".");
  if (parts.length !== 2) return null;
  const [body, signature] = parts;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (typeof payload.exp !== "number" || payload.exp < now) return null;
  return payload;
}
