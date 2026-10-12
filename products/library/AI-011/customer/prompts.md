# SQL explanation prompts

*These prompts draft text for you to edit. They do not check facts, quotes, or the law. Remove anything the model invented before you send it.*

## What it returns

Use when: You have a SELECT.

Explain what this query returns, in order. Do not suggest a rewrite yet. If a column is ambiguous, say so.

> Check: The explanation follows the query.

## Filters

Use when: You need the WHERE.

List every filter and the rows it removes. Note filters that use functions on columns.

> Check: Each filter is quoted.

## Join risk

Use when: There are joins.

Say whether each join can multiply rows. Point at the keys. Do not claim the data is clean.

> Check: You still check with a count.

## Change review

Use when: You want to edit it.

I will paste the new query. List behavioural differences. Do not assume indexes exist.

> Check: Differences are quoted.

## Safer select

Use when: You need fewer columns.

Rewrite the select list to the columns I name. Do not change the filters.

> Check: Filters are unchanged.

## Comment

Use when: Someone else will read it.

Write a short comment that says the grain of the result. Do not comment every line.

> Check: The comment matches the grain.
