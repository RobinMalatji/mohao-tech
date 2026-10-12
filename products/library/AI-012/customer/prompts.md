# Interface copy prompts

*These prompts draft text for you to edit. They do not check facts, quotes, or the law. Remove anything the model invented before you send it.*

## Button

Use when: The action is known.

Write the button label as a verb that names the result. Give two options. Do not use 'submit' unless I say the user understands it.

> Check: The label names the result.

## Empty state

Use when: There is no data yet.

Write the empty state: what is missing, and the action that creates the first one. Do not be cute.

> Check: There is one action.

## Error

Use when: The save failed.

Write the error. Include what the person can do next. Do not blame them. Do not mention a stack trace.

> Check: The next step is possible.

## Confirm

Use when: The action deletes.

Write the confirm title and body. Name the thing being deleted. Do not say 'are you sure?' alone.

> Check: The thing is named.

## Success

Use when: It worked.

Write the success message and where the person should look next.

> Check: It does not claim an email was sent unless I said so.

## Shorter

Use when: The text overflows.

Cut the string to the character count I give you. Do not change the meaning.

> Check: The count is respected.
