# Signed download token

*DEV-004 · version 1.0.0*

Create and check an HMAC token with an expiry.

Builds a token from a JSON payload, an expiry, and a secret. Verification uses a timing-safe compare and rejects expired tokens. This is a teaching implementation for your own download links, not a complete file-storage system.

## Files in this package

- package.json
- src/token.mjs
- src/token.test.mjs
- LICENCE.md
- USAGE.md
- preview/cover.svg
- preview/cover.png
- manifest.json

## Product details

| Field | Value |
| --- | --- |
| Product code | DEV-004 |
| Version | 1.0.0 |
| Category | Developer products |
| Type | JavaScript source with node:test |
| Licence | developer-project |

> These are small source files for you to read, test, and adapt. They are not a hosted service and they are not a security audit.
