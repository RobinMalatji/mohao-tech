import assert from "node:assert/strict";
import test from "node:test";
import { slugify } from "./slug.mjs";

test("keeps the word and for an ampersand", () => {
  assert.equal(slugify("Cash & Carry"), "cash-and-carry");
});

test("removes accents and edge hyphens", () => {
  assert.equal(slugify("  Café menu  "), "cafe-menu");
});
