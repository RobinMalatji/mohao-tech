# Spreadsheet helper prompts

*These prompts draft text for you to edit. They do not check facts, quotes, or the law. Remove anything the model invented before you send it.*

## Explain

Use when: You have a formula.

Explain this formula cell by cell. Say what it returns when a cell is blank.

> Check: You test it with a blank.

## Draft a sum

Use when: You described the columns.

Write a SUMIF or SUMIFS using the columns I named. Do not reference columns I did not name.

> Check: The references match my letters.

## Divide safely

Use when: A total can be zero.

Write the division so a zero denominator returns 0. Explain it.

> Check: You test the zero.

## What it will not do

Use when: Before you trust it.

List three situations where this formula is wrong.

> Check: You recognise at least one.

## Label the result

Use when: The number needs a name.

Name the result in words a colleague understands. Do not call it a KPI unless I did.

> Check: The name matches the calculation.

## Check values

Use when: You have expected numbers.

Compare these expected values to the formula's logic and say which input would have to change to match. Do not change my expected values silently.

> Check: Mismatches are visible.
