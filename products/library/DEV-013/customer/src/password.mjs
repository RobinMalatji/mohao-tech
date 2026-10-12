const common = new Set(["password1234", "changeme123", "qwertyuiop12"]);

export function passwordProblems(password) {
  const value = String(password);
  const problems = [];
  if (value.length < 12) problems.push("Use at least 12 characters.");
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) problems.push("Use both letters and numbers.");
  if (common.has(value.toLowerCase())) problems.push("Choose a password that is not in the short common list.");
  return problems;
}
