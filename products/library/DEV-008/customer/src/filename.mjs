const reserved = new Set(["CON", "PRN", "AUX", "NUL", "COM1", "LPT1"]);

export function safeFileName(input) {
  const name = String(input);
  if (name.length === 0 || name.length > 120) throw new Error("File name length is not allowed.");
  if (name.includes("/") || name.includes("\\") || name.includes("\0") || name.includes("..")) {
    throw new Error("File name must not include a path.");
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._ -]*$/.test(name)) throw new Error("File name contains a character that is not allowed.");
  const stem = name.split(".")[0].toUpperCase();
  if (reserved.has(stem)) throw new Error("File name is reserved.");
  return name;
}
