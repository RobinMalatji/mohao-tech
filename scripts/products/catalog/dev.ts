import { money, slugify, type ProductDefinition, type ProductMeta } from "../types";
import { textFile } from "../render";

const disclaimer = "These are small source files for you to read, test, and adapt. They are not a hosted service and they are not a security audit.";

function meta(number: number, name: string, summary: string, description: string, tags: string[], prices: [number, number, number, number]): ProductMeta {
  return {
    id: `DEV-${String(number).padStart(3, "0")}`,
    slug: slugify(name),
    name,
    category: "developer",
    categorySlug: "developer-products",
    categoryLabel: "Developer products",
    productType: "JavaScript source with node:test",
    audience: "Developers who want a small, readable module they can drop into a Node.js project and modify.",
    version: "1.0.0",
    licence: "developer-project",
    summary,
    description,
    benefits: ["Plain JavaScript, no install step beyond Node.js", "A test file you can run with node --test", "No network calls and no hidden services"],
    compatibility: ["Node.js 20 or later", "Run npm test or node --test from this folder"],
    tags,
    prices: money(...prices),
    disclaimer,
  };
}

function pack(number: number, name: string, summary: string, description: string, tags: string[], prices: [number, number, number, number], sourceName: string, source: string, test: string): ProductDefinition {
  const product = meta(number, name, summary, description, tags, prices);
  return {
    meta: product,
    nodeTest: true,
    checks: [],
    chart: [{ label: "Tests", value: 1 }, { label: "Files", value: 3 }],
    files: [
      { path: "package.json", body: textFile(`${JSON.stringify({ name: product.slug, private: true, type: "module", scripts: { test: "node --test" } }, null, 2)}\n`) },
      { path: `src/${sourceName}.mjs`, body: textFile(source) },
      { path: `src/${sourceName}.test.mjs`, body: textFile(test) },
    ],
  };
}

export function developerProducts(): ProductDefinition[] {
  return [
    pack(1, "CSV parser and writer", "Parse and write CSV, including commas and quotes inside a field.", "A small CSV parser for files you control. It handles quoted commas, escaped quotes, and CRLF line endings. It is not a full RFC 4180 implementation of every edge case, and the README in the module says so.", ["csv"], [229, 18, 14, 16], "csv",
      `export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const input = String(text);
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\\r") {
      cell += char;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

export function writeCsv(rows) {
  return rows.map((row) => row.map((value) => {
    const text = value == null ? "" : String(value);
    return /[",\\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
  }).join(",")).join("\\n");
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { parseCsv, writeCsv } from "./csv.mjs";

test("reads a quoted comma and an escaped quote", () => {
  const rows = parseCsv('a,"b,c","d""e"\\n');
  assert.deepEqual(rows, [["a", "b,c", 'd"e']]);
});

test("round-trips a field that contains a comma", () => {
  const csv = writeCsv([["Cape Town", "Salt River, 7925"]]);
  assert.deepEqual(parseCsv(csv), [["Cape Town", "Salt River, 7925"]]);
});
`),
    pack(2, "Slug builder", "Turn a title into a URL slug without dropping the meaning of an ampersand.", "Converts a product or article title into a lowercase slug. Ampersands become the word 'and'. Accented Latin letters are stripped of marks. The function does not call a network service.", ["slug", "url"], [149, 12, 9, 11], "slug",
      `export function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { slugify } from "./slug.mjs";

test("keeps the word and for an ampersand", () => {
  assert.equal(slugify("Cash & Carry"), "cash-and-carry");
});

test("removes accents and edge hyphens", () => {
  assert.equal(slugify("  Café menu  "), "cafe-menu");
});
`),
    pack(3, "Currency formatter", "Format integer cents as ZAR, USD, GBP, or EUR without converting between them.", "Formats an amount you already store in one currency. It refuses to invent an exchange rate. Amounts must be integer cents so 1999 is R19.99, not a float.", ["currency", "money"], [179, 14, 11, 13], "money",
      `const locales = { ZAR: "en-ZA", USD: "en-US", GBP: "en-GB", EUR: "en-IE" };

export function formatMoney(cents, currency) {
  if (!Number.isInteger(cents)) throw new Error("Amount must be integer cents.");
  const locale = locales[currency];
  if (!locale) throw new Error("Currency must be ZAR, USD, GBP, or EUR.");
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { formatMoney } from "./money.mjs";

test("formats rand from cents", () => {
  assert.match(formatMoney(1999, "ZAR"), /19[,.]99/);
});

test("rejects a float and an unknown currency", () => {
  assert.throws(() => formatMoney(19.99, "ZAR"));
  assert.throws(() => formatMoney(100, "JPY"));
});
`),
    pack(4, "Signed download token", "Create and check an HMAC token with an expiry.", "Builds a token from a JSON payload, an expiry, and a secret. Verification uses a timing-safe compare and rejects expired tokens. This is a teaching implementation for your own download links, not a complete file-storage system.", ["token", "hmac"], [299, 24, 18, 21], "token",
      `import { createHmac, timingSafeEqual } from "node:crypto";

export function signToken(payload, secret, ttlSeconds, now = Date.now()) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: now + ttlSeconds * 1000 })).toString("base64url");
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return body + "." + signature;
}

export function readToken(token, secret, now = Date.now()) {
  const parts = String(token).split(".");
  if (parts.length !== 2) return null;
  const [body, signature] = parts;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (typeof payload.exp !== "number" || payload.exp < now) return null;
  return payload;
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { readToken, signToken } from "./token.mjs";

test("accepts a fresh token and rejects a tampered one", () => {
  const token = signToken({ file: "FIN-001" }, "test-secret", 60, 1_000);
  assert.equal(readToken(token, "test-secret", 1_000).file, "FIN-001");
  assert.equal(readToken(token.slice(0, -1) + "x", "test-secret", 1_000), null);
});

test("rejects an expired token", () => {
  const token = signToken({ file: "FIN-001" }, "test-secret", 10, 1_000);
  assert.equal(readToken(token, "test-secret", 20_000), null);
});
`),
    pack(5, "Retry with backoff", "Retry an async function with a capped delay and a fixed number of attempts.", "Calls your function again when it throws, waiting longer each time, up to a cap. The delay function is injected so the test does not sleep. It does not decide which errors are safe to retry. You pass that predicate.", ["retry", "backoff"], [199, 16, 12, 14], "retry",
      `export async function retry(task, options) {
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
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { retry } from "./retry.mjs";

test("returns the value when a later attempt succeeds", async () => {
  const waits = [];
  let calls = 0;
  const value = await retry(async () => {
    calls += 1;
    if (calls < 3) throw new Error("not yet");
    return "ok";
  }, { attempts: 3, baseMs: 10, wait: async (delay) => waits.push(delay) });
  assert.equal(value, "ok");
  assert.deepEqual(waits, [10, 20]);
});

test("stops when the predicate rejects the error", async () => {
  await assert.rejects(() => retry(async () => {
    throw new Error("no");
  }, { attempts: 5, shouldRetry: () => false, wait: async () => { throw new Error("should not wait"); } }));
});
`),
    pack(6, "Fixed-window rate limit", "Count events in a time window and say when the next one is allowed.", "An in-memory counter for one process. It is useful in tests and small Node servers. It does not share state across servers, and it forgets everything when the process stops.", ["rate-limit"], [249, 19, 15, 17], "rate-limit",
      `export function createWindowLimiter(limit, windowMs, now = () => Date.now()) {
  const hits = new Map();
  return {
    check(key) {
      const time = now();
      const recent = (hits.get(key) ?? []).filter((stamp) => time - stamp < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return { allowed: false, retryAt: recent[0] + windowMs };
      }
      recent.push(time);
      hits.set(key, recent);
      return { allowed: true, remaining: limit - recent.length };
    },
  };
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { createWindowLimiter } from "./rate-limit.mjs";

test("blocks the fourth call inside the window", () => {
  let time = 1_000;
  const limiter = createWindowLimiter(3, 10_000, () => time);
  assert.equal(limiter.check("a").allowed, true);
  assert.equal(limiter.check("a").allowed, true);
  assert.equal(limiter.check("a").allowed, true);
  assert.equal(limiter.check("a").allowed, false);
  time = 12_000;
  assert.equal(limiter.check("a").allowed, true);
});
`),
    pack(7, "Offset pagination", "Turn a page number and page size into a safe offset and limit.", "Clamps the page size, rejects a page below 1, and returns the slice arguments for an array or a SQL offset. It does not run a query.", ["pagination"], [149, 12, 9, 11], "page",
      `export function pageWindow(page, pageSize, maxPageSize = 50) {
  const current = Number(page);
  const size = Number(pageSize);
  if (!Number.isInteger(current) || current < 1) throw new Error("Page must be an integer starting at 1.");
  if (!Number.isInteger(size) || size < 1) throw new Error("Page size must be a positive integer.");
  const limit = Math.min(size, maxPageSize);
  return { page: current, limit, offset: (current - 1) * limit };
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { pageWindow } from "./page.mjs";

test("calculates the offset for page 3", () => {
  assert.deepEqual(pageWindow(3, 20), { page: 3, limit: 20, offset: 40 });
});

test("caps the page size and rejects page zero", () => {
  assert.equal(pageWindow(1, 500).limit, 50);
  assert.throws(() => pageWindow(0, 10));
});
`),
    pack(8, "Safe download filename", "Reject path pieces and control characters in a file name.", "Returns a single file name or throws. It blocks slashes, backslashes, parent segments, null bytes, and Windows reserved names. Use it before you join a name onto a storage directory.", ["files", "security"], [199, 16, 12, 14], "filename",
      `const reserved = new Set(["CON", "PRN", "AUX", "NUL", "COM1", "LPT1"]);

export function safeFileName(input) {
  const name = String(input);
  if (name.length === 0 || name.length > 120) throw new Error("File name length is not allowed.");
  if (name.includes("/") || name.includes("\\\\") || name.includes("\\0") || name.includes("..")) {
    throw new Error("File name must not include a path.");
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._ -]*$/.test(name)) throw new Error("File name contains a character that is not allowed.");
  const stem = name.split(".")[0].toUpperCase();
  if (reserved.has(stem)) throw new Error("File name is reserved.");
  return name;
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { safeFileName } from "./filename.mjs";

test("keeps an ordinary product file name", () => {
  assert.equal(safeFileName("FIN-001.zip"), "FIN-001.zip");
});

test("rejects a parent path and a reserved name", () => {
  assert.throws(() => safeFileName("../secret.zip"));
  assert.throws(() => safeFileName("CON.txt"));
});
`),
    pack(9, "Env example checker", "Compare required keys in an example env file with the keys you actually have.", "Reads the KEY= lines from an example file and reports which ones are missing from an object you pass in. It does not print the values. Blank lines and comments are ignored.", ["env", "config"], [179, 14, 11, 13], "env-check",
      `export function missingEnvKeys(exampleText, env) {
  const required = [];
  for (const line of String(exampleText).split(/\\r?\\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const name = trimmed.split("=")[0].trim();
    if (name) required.push(name);
  }
  return required.filter((key) => env[key] == null || String(env[key]).length === 0);
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { missingEnvKeys } from "./env-check.mjs";

test("reports only the empty keys", () => {
  const example = "# comment\\nDATABASE_URL=\\nAUTH_SECRET=replace\\n";
  assert.deepEqual(missingEnvKeys(example, { DATABASE_URL: "postgres://local", AUTH_SECRET: "" }), ["AUTH_SECRET"]);
});
`),
    pack(10, "Markdown link list", "Extract links from Markdown without fetching them.", "Finds [label](url) links and bare angle links are not included. The result tells you the label and the URL so you can review them. It does not open the network.", ["markdown", "links"], [149, 12, 9, 11], "links",
      `export function markdownLinks(text) {
  const links = [];
  const pattern = /\\[([^\\]]+)\\]\\(([^)\\s]+)\\)/g;
  let match = pattern.exec(text);
  while (match) {
    links.push({ label: match[1], url: match[2] });
    match = pattern.exec(text);
  }
  return links;
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { markdownLinks } from "./links.mjs";

test("lists the labelled links and ignores plain text", () => {
  const links = markdownLinks("See [the guide](./guide.md) and https://example.com");
  assert.deepEqual(links, [{ label: "the guide", url: "./guide.md" }]);
});
`),
    pack(11, "Idempotency memory", "Remember the first result for a key and return it on the next call.", "Stores one result per key in memory for a TTL. A second call with the same key does not run the task again. Use it to avoid duplicate fulfilment in a single process. A restart clears it, so a database is still required for production payments.", ["idempotency"], [249, 19, 15, 17], "idempotency",
      `export function createMemoryIdempotency(ttlMs, now = () => Date.now()) {
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
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { createMemoryIdempotency } from "./idempotency.mjs";

test("runs the task once for a repeated key", async () => {
  let calls = 0;
  const store = createMemoryIdempotency(1000, () => 500);
  const first = await store.run("order-1", async () => {
    calls += 1;
    return { ok: true };
  });
  const second = await store.run("order-1", async () => {
    calls += 1;
    return { ok: false };
  });
  assert.equal(calls, 1);
  assert.deepEqual(second, first);
});
`),
    pack(12, "Audit event builder", "Build a consistent audit record with an actor, an action, and a subject.", "Returns a plain object you can insert into a log table. It requires an actor id, an action, and a subject. It does not write to a database.", ["audit"], [179, 14, 11, 13], "audit",
      `export function auditEvent(input, now = () => new Date("2026-10-12T12:00:00.000Z")) {
  if (!input.actorId || !input.action || !input.subjectType || !input.subjectId) {
    throw new Error("Audit events need an actor, an action, and a subject.");
  }
  return {
    at: now().toISOString(),
    actorId: String(input.actorId),
    action: String(input.action),
    subjectType: String(input.subjectType),
    subjectId: String(input.subjectId),
    reason: input.reason ? String(input.reason) : "",
  };
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { auditEvent } from "./audit.mjs";

test("builds a record and rejects a missing subject", () => {
  const event = auditEvent({ actorId: "admin-1", action: "archive-product", subjectType: "product", subjectId: "FIN-001", reason: "Replaced by version 1.1.0" });
  assert.equal(event.subjectId, "FIN-001");
  assert.throws(() => auditEvent({ actorId: "admin-1", action: "archive-product" }));
});
`),
    pack(13, "Password policy check", "Check length and variety without storing the password.", "Rejects passwords under 12 characters, passwords that are only letters, and a short list of common values. It returns the failures. It does not hash or transmit the password.", ["password"], [149, 12, 9, 11], "password",
      `const common = new Set(["password1234", "changeme123", "qwertyuiop12"]);

export function passwordProblems(password) {
  const value = String(password);
  const problems = [];
  if (value.length < 12) problems.push("Use at least 12 characters.");
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) problems.push("Use both letters and numbers.");
  if (common.has(value.toLowerCase())) problems.push("Choose a password that is not in the short common list.");
  return problems;
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { passwordProblems } from "./password.mjs";

test("accepts a long mixed password and rejects a short one", () => {
  assert.deepEqual(passwordProblems("river-lantern-42"), []);
  assert.ok(passwordProblems("short1").length > 0);
});
`),
    pack(14, "Minor-unit arithmetic", "Add and subtract money in integer cents.", "Adds line totals and subtracts a discount using integers. It throws if any input is not an integer or if the result would go below zero. It does not convert currencies.", ["money", "cents"], [199, 16, 12, 14], "cents",
      `function assertCents(value, label) {
  if (!Number.isInteger(value)) throw new Error(label + " must be integer cents.");
}

export function addCents(values) {
  return values.reduce((total, value) => {
    assertCents(value, "Value");
    return total + value;
  }, 0);
}

export function subtractCents(total, deduction) {
  assertCents(total, "Total");
  assertCents(deduction, "Deduction");
  if (deduction > total) throw new Error("Deduction is larger than the total.");
  return total - deduction;
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { addCents, subtractCents } from "./cents.mjs";

test("adds line items and rejects a discount that is too large", () => {
  assert.equal(addCents([24900, 14900]), 39800);
  assert.equal(subtractCents(39800, 5000), 34800);
  assert.throws(() => subtractCents(100, 101));
});
`),
    pack(15, "Webhook HMAC check", "Compare a hex HMAC signature with the raw request body.", "Computes HMAC-SHA256 over the exact body string and compares it in constant time when the lengths match. You pass the header secret. This is a generic check, not the signature scheme of a specific payment provider.", ["webhook", "hmac"], [249, 19, 15, 17], "hmac",
      `import { createHmac, timingSafeEqual } from "node:crypto";

export function hmacMatches(body, secret, signatureHex) {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const left = Buffer.from(String(signatureHex));
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
`,
      `import { createHmac } from "node:crypto";
import assert from "node:assert/strict";
import test from "node:test";
import { hmacMatches } from "./hmac.mjs";

test("accepts the hex digest of the same body", () => {
  const body = '{"id":"evt_1"}';
  const signature = createHmac("sha256", "whsec_test").update(body).digest("hex");
  assert.equal(hmacMatches(body, "whsec_test", signature), true);
  assert.equal(hmacMatches(body + " ", "whsec_test", signature), false);
});
`),
    pack(16, "Discount calculator", "Apply a percent or a fixed discount and refuse a negative total.", "Percent discounts use basis points so 1500 means 15.00 percent. Fixed discounts are integer cents in the same currency as the subtotal. The function does not look up a coupon code.", ["discount"], [199, 16, 12, 14], "discount",
      `export function applyDiscount(subtotalCents, discount) {
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0) throw new Error("Subtotal must be zero or a positive integer.");
  if (discount.type === "percent") {
    if (!Number.isInteger(discount.basisPoints) || discount.basisPoints < 0 || discount.basisPoints > 10000) {
      throw new Error("Percent must be between 0 and 10000 basis points.");
    }
    const reduction = Math.round((subtotalCents * discount.basisPoints) / 10000);
    return { reduction, total: subtotalCents - reduction };
  }
  if (discount.type === "fixed") {
    if (!Number.isInteger(discount.cents) || discount.cents < 0 || discount.cents > subtotalCents) {
      throw new Error("Fixed discount must fit inside the subtotal.");
    }
    return { reduction: discount.cents, total: subtotalCents - discount.cents };
  }
  throw new Error("Discount type must be percent or fixed.");
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { applyDiscount } from "./discount.mjs";

test("takes 15 percent and rejects a fixed discount that is too big", () => {
  assert.deepEqual(applyDiscount(20000, { type: "percent", basisPoints: 1500 }), { reduction: 3000, total: 17000 });
  assert.throws(() => applyDiscount(1000, { type: "fixed", cents: 1001 }));
});
`),
    pack(17, "Reporting date buckets", "Group ISO dates into day, week, or month keys.", "Uses UTC dates so a report does not change with the server's local zone. Week buckets start on Monday. It does not query a database.", ["dates", "reports"], [179, 14, 11, 13], "buckets",
      `export function bucketKey(isoDate, grain) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) throw new Error("Date is not valid.");
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  if (grain === "month") return year + "-" + month;
  if (grain === "day") return year + "-" + month + "-" + day;
  if (grain === "week") {
    const utc = new Date(Date.UTC(year, date.getUTCMonth(), date.getUTCDate()));
    const weekday = utc.getUTCDay() || 7;
    utc.setUTCDate(utc.getUTCDate() - weekday + 1);
    const weekMonth = String(utc.getUTCMonth() + 1).padStart(2, "0");
    const weekDay = String(utc.getUTCDate()).padStart(2, "0");
    return utc.getUTCFullYear() + "-" + weekMonth + "-" + weekDay;
  }
  throw new Error("Grain must be day, week, or month.");
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { bucketKey } from "./buckets.mjs";

test("puts a Wednesday into the Monday of that week", () => {
  assert.equal(bucketKey("2026-10-14T21:00:00.000Z", "week"), "2026-10-12");
  assert.equal(bucketKey("2026-10-14T21:00:00.000Z", "month"), "2026-10");
});
`),
    pack(18, "Feature flag reader", "Read on/off flags from an env-like object.", "A flag is on only when the value is 'true' or '1'. Missing flags are off. This avoids treating the word 'false' as on. It does not call a hosted flag service.", ["flags"], [149, 12, 9, 11], "flags",
      `export function flagEnabled(env, name) {
  const value = env[name];
  return value === "true" || value === "1";
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { flagEnabled } from "./flags.mjs";

test("treats only true and 1 as enabled", () => {
  assert.equal(flagEnabled({ SHOP_ENABLED: "true" }, "SHOP_ENABLED"), true);
  assert.equal(flagEnabled({ SHOP_ENABLED: "false" }, "SHOP_ENABLED"), false);
  assert.equal(flagEnabled({}, "SHOP_ENABLED"), false);
});
`),
    pack(19, "Object list to CSV", "Write an array of objects to CSV using a column list you choose.", "Columns you do not name are left out, so a customer export does not accidentally include a note field. Values are escaped with the same quoting rule as the CSV writer in this library's companion parser.", ["csv", "export"], [199, 16, 12, 14], "export-csv",
      `function escapeCell(value) {
  const text = value == null ? "" : String(value);
  return /[",\\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

export function objectsToCsv(rows, columns) {
  const header = columns.join(",");
  const body = rows.map((row) => columns.map((column) => escapeCell(row[column])).join(","));
  return [header, ...body].join("\\n");
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { objectsToCsv } from "./export-csv.mjs";

test("exports only the named columns", () => {
  const csv = objectsToCsv([{ id: "FIN-001", note: "keep private", name: "Budget" }], ["id", "name"]);
  assert.equal(csv.includes("keep private"), false);
  assert.equal(csv.split("\\n")[0], "id,name");
});
`),
    pack(20, "Public order reference", "Build a readable order reference that is not a guessable sequence.", "Combines a date with random bytes so support staff can read the day, without using 1001, 1002, 1003. The random source can be injected in tests. This does not create the order.", ["orders"], [179, 14, 11, 13], "order-ref",
      `export function orderReference(date, randomBytes) {
  const day = date.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Buffer.from(randomBytes(4)).toString("hex").toUpperCase();
  return "MH-" + day + "-" + suffix;
}
`,
      `import assert from "node:assert/strict";
import test from "node:test";
import { orderReference } from "./order-ref.mjs";

test("includes the date and the supplied bytes", () => {
  const reference = orderReference(new Date("2026-10-12T08:00:00.000Z"), () => Buffer.from([1, 2, 3, 4]));
  assert.equal(reference, "MH-20261012-01020304");
});
`),
  ];
}
