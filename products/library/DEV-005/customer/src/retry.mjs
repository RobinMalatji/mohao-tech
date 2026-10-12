export async function retry(task, options) {
  const attempts = options.attempts ?? 3;
  const baseMs = options.baseMs ?? 50;
  const capMs = options.capMs ?? 1000;
  const shouldRetry = options.shouldRetry ?? (() => true);
  const wait = options.wait ?? (async () => {});
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task(attempt);
    } catch (error) {
      lastError = error;
      if (attempt === attempts || !shouldRetry(error)) break;
      const delay = Math.min(capMs, baseMs * 2 ** (attempt - 1));
      await wait(delay, attempt);
    }
  }
  throw lastError;
}
