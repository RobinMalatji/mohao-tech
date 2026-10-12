# How to use Webhook HMAC check

*JavaScript source with node:test*

Computes HMAC-SHA256 over the exact body string and compares it in constant time when the lengths match. You pass the header secret. This is a generic check, not the signature scheme of a specific payment provider.

## Who it is for

Developers who want a small, readable module they can drop into a Node.js project and modify.

## Compatibility

- Node.js 20 or later
- Run npm test or node --test from this folder

## Before you start

1. Read the README and this usage guide.
2. Open the main deliverable and replace every sample figure or sample sentence with your own.
3. Keep a copy of the original download before you edit it.
4. Check the licence before you share the edited file with anyone else.

## What you should see

- Plain JavaScript, no install step beyond Node.js
- A test file you can run with node --test
- No network calls and no hidden services
