export function createWindowLimiter(limit, windowMs, now = () => Date.now()) {
  const hits = new Map();
  return {
    check(key) {
      const time = now();
      const recent = (hits.get(key) ?? []).filter((stamp) => time - stamp < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return { allowed: false, retryAt: recent[0] + windowMs };
      }
      recent.push(time);
      hits.set(key, recent);
      return { allowed: true, remaining: limit - recent.length };
    },
  };
}
