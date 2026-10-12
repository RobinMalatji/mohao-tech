function escapeCell(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

export function objectsToCsv(rows, columns) {
  const header = columns.join(",");
  const body = rows.map((row) => columns.map((column) => escapeCell(row[column])).join(","));
  return [header, ...body].join("\n");
}
