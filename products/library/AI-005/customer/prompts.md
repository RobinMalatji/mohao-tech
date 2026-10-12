# Code review prompts

*These prompts draft text for you to edit. They do not check facts, quotes, or the law. Remove anything the model invented before you send it.*

## Behaviour first

Use when: You have a diff.

List behaviour changes in this diff. Quote the lines. Do not style-nit. If you are unsure, say so.

> Check: Each item quotes the diff.

## Missing test

Use when: Tests exist.

Name a behaviour in the diff that the tests do not cover. Propose the assertion in words, not a whole new framework.

> Check: The gap is real.

## Secret scan

Use when: Before merge.

Point at anything that looks like a key, password, or connection string. Do not repeat the secret in full if you find one. Say the line number.

> Check: You rotate anything real.

## Failure path

Use when: The happy path works.

What happens when the input is empty, too large, or the downstream call throws? Answer only from the diff.

> Check: You do not invent a catch that is not there.

## Name the risk

Use when: You need a review comment.

Write one comment: the risk, the line, and the change you want. No introduction.

> Check: The comment is specific.

## Leave it

Use when: You are tempted to redesign.

List ideas that are not required for this change. Label them 'not for this diff'.

> Check: The author can ignore that list.
