# Webhook HMAC check

*DEV-015 · version 1.0.0*

Compare a hex HMAC signature with the raw request body.

Computes HMAC-SHA256 over the exact body string and compares it in constant time when the lengths match. You pass the header secret. This is a generic check, not the signature scheme of a specific payment provider.

## Files in this package

- package.json
- src/hmac.mjs
- src/hmac.test.mjs
- LICENCE.md
- USAGE.md
- preview/cover.svg
- preview/cover.png
- manifest.json

## Product details

| Field | Value |
| --- | --- |
| Product code | DEV-015 |
| Version | 1.0.0 |
| Category | Developer products |
| Type | JavaScript source with node:test |
| Licence | developer-project |

> These are small source files for you to read, test, and adapt. They are not a hosted service and they are not a security audit.
