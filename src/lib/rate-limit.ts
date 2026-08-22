type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterMs: number;
};

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterMs: windowMs };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterMs: existing.resetAt - now,
    };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: limit - existing.count,
    retryAfterMs: existing.resetAt - now,
  };
}

export function resetRateLimit(key?: string) {
  if (key) {
    buckets.delete(key);
    return;
  }
  buckets.clear();
}
