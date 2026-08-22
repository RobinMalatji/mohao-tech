import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder";
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function resolvePrismaCli() {
  try {
    return require.resolve("prisma/build/index.js");
  } catch {
    const fallback = path.join(root, "node_modules", "prisma", "build", "index.js");
    if (existsSync(fallback)) return fallback;
    throw new Error("Unable to resolve the Prisma CLI.");
  }
}

const result = spawnSync(process.execPath, [resolvePrismaCli(), "generate"], {
  stdio: "inherit",
  env: process.env,
  cwd: root,
});

process.exit(result.status ?? 1);
