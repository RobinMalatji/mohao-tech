# How to use Idempotency memory

*JavaScript source with node:test*

Stores one result per key in memory for a TTL. A second call with the same key does not run the task again. Use it to avoid duplicate fulfilment in a single process. A restart clears it, so a database is still required for production payments.

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
