export function missingEnvKeys(exampleText, env) {
  const required = [];
  for (const line of String(exampleText).split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const name = trimmed.split("=")[0].trim();
    if (name) required.push(name);
  }
  return required.filter((key) => env[key] == null || String(env[key]).length === 0);
}
