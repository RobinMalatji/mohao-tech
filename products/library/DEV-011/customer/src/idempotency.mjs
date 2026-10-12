export function createMemoryIdempotency(ttlMs, now = () => Date.now()) {
  const entries = new Map();
  return {
    async run(key, task) {
      const current = entries.get(key);
      if (current && current.expires > now()) return current.value;
      const value = await task();
      entries.set(key, { value, expires: now() + ttlMs });
      return value;
    },
  };
}
