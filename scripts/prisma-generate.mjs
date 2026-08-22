import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder";
}

const require = createRequire(import.meta.url);
const prismaCli = require.resolve("prisma/build/index.js");

const result = spawnSync(process.execPath, [prismaCli, "generate"], {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
