export function flagEnabled(env, name) {
  const value = env[name];
  return value === "true" || value === "1";
}
