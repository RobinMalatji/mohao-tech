# Safe download filename

*DEV-008 · version 1.0.0*

Reject path pieces and control characters in a file name.

Returns a single file name or throws. It blocks slashes, backslashes, parent segments, null bytes, and Windows reserved names. Use it before you join a name onto a storage directory.

## Files in this package

- package.json
- src/filename.mjs
- src/filename.test.mjs
- LICENCE.md
- USAGE.md
- preview/cover.svg
- preview/cover.png
- manifest.json

## Product details

| Field | Value |
| --- | --- |
| Product code | DEV-008 |
| Version | 1.0.0 |
| Category | Developer products |
| Type | JavaScript source with node:test |
| Licence | developer-project |

> These are small source files for you to read, test, and adapt. They are not a hosted service and they are not a security audit.
