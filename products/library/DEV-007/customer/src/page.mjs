export function pageWindow(page, pageSize, maxPageSize = 50) {
  const current = Number(page);
  const size = Number(pageSize);
  if (!Number.isInteger(current) || current < 1) throw new Error("Page must be an integer starting at 1.");
  if (!Number.isInteger(size) || size < 1) throw new Error("Page size must be a positive integer.");
  const limit = Math.min(size, maxPageSize);
  return { page: current, limit, offset: (current - 1) * limit };
}
