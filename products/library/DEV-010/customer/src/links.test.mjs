import assert from "node:assert/strict";
import test from "node:test";
import { markdownLinks } from "./links.mjs";

test("lists the labelled links and ignores plain text", () => {
  const links = markdownLinks("See [the guide](./guide.md) and https://example.com");
  assert.deepEqual(links, [{ label: "the guide", url: "./guide.md" }]);
});
