# How to use Feature flag reader

*JavaScript source with node:test*

A flag is on only when the value is 'true' or '1'. Missing flags are off. This avoids treating the word 'false' as on. It does not call a hosted flag service.

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
