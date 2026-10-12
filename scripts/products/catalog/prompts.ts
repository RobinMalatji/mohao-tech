import { csv, renderMarkdown, textFile } from "../render";
import { money, slugify, type ProductDefinition, type ProductMeta } from "../types";

const disclaimer = "These prompts draft text for you to edit. They do not check facts, quotes, or the law. Remove anything the model invented before you send it.";

type Prompt = { title: string; use: string; prompt: string; check: string };
type Pack = { number: number; name: string; summary: string; audience: string; tags: string[]; prices: [number, number, number, number]; prompts: Prompt[] };

function meta(pack: Pack): ProductMeta {
  return {
    id: `AI-${String(pack.number).padStart(3, "0")}`,
    slug: slugify(pack.name),
    name: pack.name,
    category: "prompts",
    categorySlug: "ai-prompt-packs",
    categoryLabel: "AI prompt packs",
    productType: "Prompt library in Markdown and CSV",
    audience: pack.audience,
    version: "1.0.0",
    licence: "personal",
    summary: pack.summary,
    description: `${pack.summary} Each prompt tells you what to paste, what to ask, and what to check before you use the answer.`,
    benefits: ["A full prompt, not a one-line topic", "A check so you do not ship an invented fact", "The same prompts in Markdown and CSV"],
    compatibility: ["Any chat model that accepts a pasted prompt", "A spreadsheet for the CSV", "No model subscription is included"],
    tags: pack.tags,
    prices: money(...pack.prices),
    disclaimer,
  };
}

function p(title: string, use: string, prompt: string, check: string): Prompt {
  return { title, use, prompt, check };
}

const packs: Pack[] = [
  {
    number: 1, name: "Customer interview synthesis", summary: "Turn anonymised interview notes into themes without inventing quotes.", audience: "Founders and researchers who have notes from real conversations.", tags: ["research", "interviews"], prices: [229, 18, 14, 16],
    prompts: [
      p("List observations", "After three or more interviews.", "I will paste anonymised notes. Separate what a person said from what I might infer. Do not add a quote that is not in the notes. Group repeated observations and name how many notes support each one.", "Every quote appears in the notes you pasted."),
      p("Contradictions", "When two customers disagree.", "List the disagreements. Do not resolve them. For each, say which note it came from and what decision would be premature.", "No disagreement is smoothed into a fake consensus."),
      p("Jobs to be done", "When you need the job, not a persona poster.", "From these notes, write the job the person was hiring the product to do, the struggling moment, and what they used instead. If the notes do not say it, write 'not in the notes'.", "You can point each line back to a note."),
      p("Follow-up questions", "Before the next interview.", "Write six questions that the current notes cannot answer. Do not write questions the notes already answered.", "Each question names the gap."),
      p("Recruiting screen", "When choosing who to interview next.", "Given this target decision, write a five-question screen that rejects people who have not done the job in the last six months. Do not ask for sensitive personal data.", "The screen does not ask for identity numbers or health information."),
      p("Decision memo", "When the team wants a recommendation.", "Draft a one-page memo: decision, evidence from the notes, what the notes do not prove, and the next interview that would change the decision. Do not recommend a feature the notes do not support.", "The memo has a 'not proved' section."),
    ],
  },
  {
    number: 2, name: "Blog editing prompts", summary: "Edit a draft for a specific reader without adding claims you did not write.", audience: "People who already have a draft and want it shorter and clearer.", tags: ["writing", "editing"], prices: [199, 15, 12, 14],
    prompts: [
      p("Reader test", "Before a line edit.", "Read this draft as the reader I name. List the sentences that assume knowledge the reader does not have. Do not rewrite yet.", "The list quotes the draft."),
      p("Cut a third", "When the draft is too long.", "Cut this draft by about a third. Do not add examples, statistics, or quotations. Keep the original claims.", "The shorter draft has no new facts."),
      p("Headline options", "When you need titles.", "Write eight headlines. Each must be true to the draft. Mark any headline that would overclaim.", "You reject the overclaims."),
      p("Specifics pass", "When the draft is vague.", "Replace vague nouns with the specific ones already in the draft. If a specific is missing, insert [missing specific] rather than inventing one.", "No invented numbers."),
      p("Opening", "When the first paragraph is a warm-up.", "Propose two openings that start at the first concrete point in the draft. Do not add a story.", "The opening is already in the draft."),
      p("Last check", "Before you publish.", "List factual claims in the draft that would need a source. Do not supply sources from memory.", "You verify each one yourself."),
    ],
  },
  {
    number: 3, name: "Support reply drafts", summary: "Draft calm replies for an online shop without promising a refund you have not approved.", audience: "Shop owners answering delivery and file questions.", tags: ["support"], prices: [189, 15, 12, 14],
    prompts: [
      p("Missing file", "A buyer cannot find the download.", "Draft a reply that asks for the order reference, explains where the library link is, and does not blame the buyer. Do not promise a new file until the order is confirmed.", "The reply asks for the reference."),
      p("Wrong file", "The buyer expected a different format.", "Draft a reply that restates the formats listed in the product and offers to check the order. Do not invent a format the product does not have.", "Formats match the product page."),
      p("Refund request", "Someone wants money back.", "Draft a reply that acknowledges the request and says a person will check the refund policy. Do not approve or refuse the refund.", "No refund is granted by the draft."),
      p("Angry tone", "The message is heated.", "Rewrite my reply so it is short and specific. Remove sarcasm. Keep the decision I already made.", "The decision is unchanged."),
      p("Known issue", "You have a real bug.", "Draft a reply that states the bug, the workaround I paste below, and that I will write again when it is fixed. Do not give a date I did not provide.", "No date was invented."),
      p("Not our product", "The question is about something else.", "Draft a reply that says we cannot see that account and points them back to the company they named. Do not guess their password process.", "No security steps were invented."),
    ],
  },
  {
    number: 4, name: "Job description prompts", summary: "Write a role description from the work, not from a pile of adjectives.", audience: "Hiring managers at small companies.", tags: ["hiring"], prices: [209, 16, 13, 15],
    prompts: [
      p("From the work", "You have a list of tasks.", "Turn this task list into a job description. Keep the tasks. Delete adjectives that do not change who would apply. Write the location and days on site only if I provided them.", "No invented salary or perk."),
      p("Must versus later", "The list is too long.", "Split the requirements into 'needed in the first month' and 'can be learned here'. Do not add requirements.", "Every line came from my list."),
      p("Inclusive pass", "Before you post.", "Point at lines that demand a degree, a tool, or a year-count that the tasks do not require. Do not rewrite the salary.", "You decide which lines to cut."),
      p("Application ask", "You want useful applications.", "Write the application instructions: three relevant projects, no photo, no identity number. Keep it under 120 words.", "The instructions do not ask for sensitive data."),
      p("Rejection note", "After a decision.", "Draft a short rejection that does not invent feedback. Thank them and state that we will not move forward.", "No fake praise of a specific skill."),
      p("Scorecard", "Before interviews.", "Turn the must-have tasks into six interview questions with what a good answer includes. Do not ask about family, health, or age.", "Questions stay on the work."),
    ],
  },
  {
    number: 5, name: "Code review prompts", summary: "Review a diff for behaviour, tests, and secrets without rewriting the whole file.", audience: "Developers reviewing a teammate's change.", tags: ["code"], prices: [249, 19, 15, 17],
    prompts: [
      p("Behaviour first", "You have a diff.", "List behaviour changes in this diff. Quote the lines. Do not style-nit. If you are unsure, say so.", "Each item quotes the diff."),
      p("Missing test", "Tests exist.", "Name a behaviour in the diff that the tests do not cover. Propose the assertion in words, not a whole new framework.", "The gap is real."),
      p("Secret scan", "Before merge.", "Point at anything that looks like a key, password, or connection string. Do not repeat the secret in full if you find one. Say the line number.", "You rotate anything real."),
      p("Failure path", "The happy path works.", "What happens when the input is empty, too large, or the downstream call throws? Answer only from the diff.", "You do not invent a catch that is not there."),
      p("Name the risk", "You need a review comment.", "Write one comment: the risk, the line, and the change you want. No introduction.", "The comment is specific."),
      p("Leave it", "You are tempted to redesign.", "List ideas that are not required for this change. Label them 'not for this diff'.", "The author can ignore that list."),
    ],
  },
  {
    number: 6, name: "Meeting summary prompts", summary: "Summarise notes into decisions, owners, and open questions.", audience: "People who take notes and need to send them the same day.", tags: ["meetings"], prices: [179, 14, 11, 13],
    prompts: [
      p("Decisions only", "The notes are messy.", "From these notes, list decisions. If a point was discussed but not decided, put it under 'not decided'. Do not add decisions.", "Not-decided is present when needed."),
      p("Owners", "People volunteered.", "Assign owners only where the notes name a person. Otherwise write 'owner not named'.", "No owner was guessed."),
      p("Short send", "You need the email.", "Write the follow-up email in under 150 words using only the decisions and owners list. No new topics.", "The email matches the list."),
      p("Risks mentioned", "Someone raised a worry.", "List worries that were said in the meeting. Do not solve them.", "Each worry is from the notes."),
      p("Agenda for next time", "The meeting ran out.", "Turn 'not decided' items into an agenda of five items or fewer.", "The agenda does not add new work."),
      p("Absent person", "Someone missed it.", "Write a five-line brief for the person who was absent. No jokes about them.", "The brief is usable without the transcript."),
    ],
  },
  {
    number: 7, name: "Requirement writing prompts", summary: "Turn a messy request into a requirement with a test.", audience: "Product people and founders writing work for a developer.", tags: ["requirements"], prices: [219, 17, 13, 15],
    prompts: [
      p("One sentence", "The request is a paragraph.", "Rewrite the request as: who, does what, so that. If the notes do not say why, write 'why not stated'.", "You did not invent the why."),
      p("Acceptance", "You need a test.", "Write acceptance checks a person can run without reading your mind. Use the inputs I provided.", "Each check is observable."),
      p("Out of scope", "The request is growing.", "List three nearby ideas that this requirement does not include.", "The developer can see the boundary."),
      p("Edge cases", "Before you build.", "List empty, duplicate, and permission failures for this requirement. Mark any you cannot answer as a question.", "Questions are not disguised as facts."),
      p("Plain words", "The draft is jargon.", "Replace jargon with the words a new teammate would use. Do not change the decision.", "The decision is the same."),
      p("Ready check", "Before it goes to a developer.", "Say what is still missing: data, design, copy, or a decision. Do not fill the gap yourself.", "Missing items stay missing."),
    ],
  },
  {
    number: 8, name: "Local business captions", summary: "Write captions for a shop that is open on a real day, with a real offer.", audience: "Shop owners posting about this week's products.", tags: ["social", "retail"], prices: [169, 13, 10, 12],
    prompts: [
      p("This week only", "You have a dated offer.", "Write three captions for the offer I paste. Include the date and the price I gave you. Do not add a discount.", "Price and date match my paste."),
      p("Sold out", "The item is gone.", "Write a caption that says it is sold out and names when it returns only if I told you. Do not tease a restock.", "No invented return date."),
      p("Hours", "The hours changed.", "Write one caption with the new hours and the old hours so people are not surprised. Use only the hours I paste.", "Both sets of hours are mine."),
      p("Behind the counter", "You want a process post.", "Write a caption about the step I describe. Do not claim a certification or an award.", "No award was added."),
      p("Quiet day", "You need a post and nothing is on sale.", "Write a caption that tells people what is available today. Do not invent urgency.", "There is no fake scarcity."),
      p("Reply to a comment", "A customer asked a question in public.", "Draft a reply that answers only what I know. If I do not know, the reply says we will check.", "The reply does not guess."),
    ],
  },
  {
    number: 9, name: "Training session prompts", summary: "Plan a short training session from an outcome and a time box.", audience: "People running a one-hour internal training.", tags: ["training"], prices: [199, 15, 12, 14],
    prompts: [
      p("Outcome", "You have a topic and a time.", "Write the outcome as something the learner can do at the end. If my topic is vague, ask what they must be able to do. Do not invent an accreditation.", "No certificate claim was added."),
      p("Timed plan", "You have 60 minutes.", "Split the hour into explanation, a worked example using my material, and practice. Include the minutes.", "The minutes add up."),
      p("Exercise", "They need to try it.", "Write one exercise they can finish in the room with the materials I listed. Do not require a tool I did not mention.", "The exercise uses my materials."),
      p("Check", "You need to know it landed.", "Write three questions that test the outcome, not attendance.", "A person who missed the point would fail them."),
      p("Handout", "You need one page.", "Turn the plan into a one-page handout. No stock advice that was not in the plan.", "The handout matches the plan."),
      p("What to drop", "You are over time.", "Tell me what to cut first if the group is slow. Do not cut the practice before the extra explanation.", "Practice stays."),
    ],
  },
  {
    number: 10, name: "Proposal drafting prompts", summary: "Draft a short proposal from notes without inflating the result.", audience: "Freelancers writing a fixed-price proposal.", tags: ["proposals"], prices: [229, 18, 14, 16],
    prompts: [
      p("Scope", "You have call notes.", "Write the scope as included and excluded. Use only the notes. Put unknowns under questions.", "Excluded is explicit."),
      p("Price block", "You have decided the price.", "Write the price section using the number, currency, and what it includes. Do not add a discount.", "The number is the one I typed."),
      p("Timeline", "You have a start and an end.", "Write the timeline with those dates and the dependency I named. Do not promise a date I did not give.", "Dates match."),
      p("Assumptions", "Things could change the price.", "List assumptions from my notes. If an assumption is broken, say the price is revisited. Do not invent a penalty.", "Assumptions come from the notes."),
      p("Plain summary", "The buyer is busy.", "Write a 120-word summary a buyer can forward. No adjectives about our passion.", "It can be forwarded as-is after you check it."),
      p("Redline", "They sent changes.", "Compare their edits to my original scope and list what changed the work. Do not accept the change for me.", "You decide."),
    ],
  },
  {
    number: 11, name: "SQL explanation prompts", summary: "Explain a query and point at risky changes without running it.", audience: "Analysts who need to understand a query before they edit it.", tags: ["sql"], prices: [219, 17, 13, 15],
    prompts: [
      p("What it returns", "You have a SELECT.", "Explain what this query returns, in order. Do not suggest a rewrite yet. If a column is ambiguous, say so.", "The explanation follows the query."),
      p("Filters", "You need the WHERE.", "List every filter and the rows it removes. Note filters that use functions on columns.", "Each filter is quoted."),
      p("Join risk", "There are joins.", "Say whether each join can multiply rows. Point at the keys. Do not claim the data is clean.", "You still check with a count."),
      p("Change review", "You want to edit it.", "I will paste the new query. List behavioural differences. Do not assume indexes exist.", "Differences are quoted."),
      p("Safer select", "You need fewer columns.", "Rewrite the select list to the columns I name. Do not change the filters.", "Filters are unchanged."),
      p("Comment", "Someone else will read it.", "Write a short comment that says the grain of the result. Do not comment every line.", "The comment matches the grain."),
    ],
  },
  {
    number: 12, name: "Interface copy prompts", summary: "Write button and error text that says what happens.", audience: "People designing a small product's interface.", tags: ["ux", "copy"], prices: [189, 15, 12, 14],
    prompts: [
      p("Button", "The action is known.", "Write the button label as a verb that names the result. Give two options. Do not use 'submit' unless I say the user understands it.", "The label names the result."),
      p("Empty state", "There is no data yet.", "Write the empty state: what is missing, and the action that creates the first one. Do not be cute.", "There is one action."),
      p("Error", "The save failed.", "Write the error. Include what the person can do next. Do not blame them. Do not mention a stack trace.", "The next step is possible."),
      p("Confirm", "The action deletes.", "Write the confirm title and body. Name the thing being deleted. Do not say 'are you sure?' alone.", "The thing is named."),
      p("Success", "It worked.", "Write the success message and where the person should look next.", "It does not claim an email was sent unless I said so."),
      p("Shorter", "The text overflows.", "Cut the string to the character count I give you. Do not change the meaning.", "The count is respected."),
    ],
  },
  {
    number: 13, name: "Sales follow-up prompts", summary: "Write follow-ups that refer to the last conversation.", audience: "People following up a proposal they already sent.", tags: ["sales"], prices: [199, 15, 12, 14],
    prompts: [
      p("After the call", "The call just ended.", "Write a follow-up that lists the two points they cared about, from my notes. Ask one question. Do not add a new offer.", "The points are from the notes."),
      p("No reply", "A week has passed.", "Write a short note that refers to the proposal date and asks if it is still a priority. Do not invent urgency.", "No fake deadline."),
      p("They asked for a discount", "You have not agreed.", "Write a reply that says you will look at scope before price. Do not offer a number.", "No discount was invented."),
      p("Not now", "They said next quarter.", "Write a note that accepts the timing and asks what should be true next quarter. Do not push a meeting this week.", "The timing is respected."),
      p("Wrong person", "They are not the buyer.", "Write a note that asks who decides and offers a one-page summary they can forward.", "You do not pressure them."),
      p("Won", "They said yes.", "Write the confirmation of price, start date, and the next action I provide. Do not add terms.", "Terms match what I pasted."),
    ],
  },
  {
    number: 14, name: "Plain-language policy prompts", summary: "Rewrite policy clauses into plain language without changing the meaning you mark.", audience: "Operators who need a plain version of a policy a lawyer still has to approve.", tags: ["policy", "plain language"], prices: [209, 16, 13, 15],
    prompts: [
      p("Plain clause", "You have one clause.", "Rewrite this clause in plain language. Then list any meaning you might have changed. Do not add rights.", "The change list is empty or you fix it."),
      p("Who it applies to", "The subject is unclear.", "Say who the clause binds, using only the nouns in the clause. If it is unclear, say unclear.", "You do not guess the party."),
      p("What the person must do", "You need the obligation.", "List the obligations as actions. If a sentence is not an obligation, leave it out and say so.", "Obligations are quoted."),
      p("Defined terms", "Words are capitalised.", "List defined terms and ask me for any definition that is not in the paste.", "Missing definitions stay missing."),
      p("Questions for counsel", "Before you publish.", "Write five questions a lawyer should answer. Do not answer them yourself.", "You send the questions."),
      p("Heading", "The clause needs a label.", "Write a heading a customer can scan. Do not make it friendlier than the clause.", "The heading is accurate."),
    ],
  },
  {
    number: 15, name: "Spreadsheet helper prompts", summary: "Explain or draft a formula from a description of the columns.", audience: "People who know the columns and want a formula they still test.", tags: ["spreadsheets"], prices: [179, 14, 11, 13],
    prompts: [
      p("Explain", "You have a formula.", "Explain this formula cell by cell. Say what it returns when a cell is blank.", "You test it with a blank."),
      p("Draft a sum", "You described the columns.", "Write a SUMIF or SUMIFS using the columns I named. Do not reference columns I did not name.", "The references match my letters."),
      p("Divide safely", "A total can be zero.", "Write the division so a zero denominator returns 0. Explain it.", "You test the zero."),
      p("What it will not do", "Before you trust it.", "List three situations where this formula is wrong.", "You recognise at least one."),
      p("Label the result", "The number needs a name.", "Name the result in words a colleague understands. Do not call it a KPI unless I did.", "The name matches the calculation."),
      p("Check values", "You have expected numbers.", "Compare these expected values to the formula's logic and say which input would have to change to match. Do not change my expected values silently.", "Mismatches are visible."),
    ],
  },
  {
    number: 16, name: "Research briefing prompts", summary: "Turn source notes into a brief that separates source from guess.", audience: "People preparing a brief from articles and interviews.", tags: ["research"], prices: [219, 17, 13, 15],
    prompts: [
      p("Source list", "You pasted notes.", "List the sources I actually pasted. Do not add famous studies from memory.", "Every source is in the paste."),
      p("Claims", "You need the findings.", "List claims and the source for each. If two sources disagree, show both.", "Disagreements stay."),
      p("Not established", "You are about to recommend.", "Write what these sources do not establish.", "The section is specific."),
      p("Brief", "You need one page.", "Write a brief: question, what the sources say, what they do not say, what I might do next. Do not add statistics.", "No new numbers."),
      p("Quote check", "You want a quotation.", "Use a quotation only if it appears in my paste. Otherwise paraphrase and say it is a paraphrase.", "Quotes are exact."),
      p("Audience cut", "A specific person will read it.", "Cut the brief for that reader. Remove background they do not need. Do not remove the disagreements.", "Disagreements remain."),
    ],
  },
  {
    number: 17, name: "Onboarding email prompts", summary: "Write the emails after someone buys or joins, using the steps you provide.", audience: "Operators with a real onboarding sequence to write.", tags: ["email", "onboarding"], prices: [199, 15, 12, 14],
    prompts: [
      p("First email", "They just joined.", "Write the first email. Include the steps I list and the support address I give. Do not welcome them for a page. Do not promise a call I did not offer.", "Steps match my list."),
      p("Stuck", "They have not finished step two.", "Write a short email that names step two and the likely blocker I described. One link.", "One link only."),
      p("Done", "They finished.", "Write the email that says what they can do next, from my list. Do not upsell a product I did not name.", "No extra product."),
      p("Subject lines", "You need subjects.", "Write six subject lines that state the action. No fake 're:'.", "Each subject is an action."),
      p("Plain text", "The mail should work without images.", "Rewrite the email as plain text. Keep the links visible.", "Links are visible."),
      p("Consent", "This is not a newsletter.", "Say whether this email is about the thing they just bought. If I am mixing in news, separate it and say it needs consent.", "Marketing is not hidden in the receipt."),
    ],
  },
  {
    number: 18, name: "Incident notes prompts", summary: "Turn messy incident notes into a timeline and a follow-up.", audience: "Small teams writing up an outage or a mistake.", tags: ["incidents"], prices: [209, 16, 13, 15],
    prompts: [
      p("Timeline", "You have chat fragments.", "Build a timeline with the times I wrote. Do not fill gaps with guesses. Mark gaps.", "Gaps are marked."),
      p("Impact", "You need the effect.", "Describe who was affected using only my notes. Do not estimate a number I did not give.", "No invented count."),
      p("What we know", "Facts and theories are mixed.", "Split the notes into facts and theories.", "Theories are labelled."),
      p("Follow-up", "You need actions.", "List follow-ups that my notes already imply. Do not assign a person I did not name.", "Owners are blank when unknown."),
      p("Customer note", "People were affected.", "Draft a short note that says what failed, what we did, and what we still do not know. No blame of a named person.", "Unknowns stay in."),
      p("Next time", "You want one change.", "Propose one change that would have made this incident easier to see. Label it a proposal.", "It is not written as if it already happened."),
    ],
  },
  {
    number: 19, name: "Hospitality copy prompts", summary: "Write menu and booking lines that match the food and the hours you provide.", audience: "Restaurants and guest houses writing their own words.", tags: ["hospitality"], prices: [189, 15, 12, 14],
    prompts: [
      p("Dish line", "You have a dish.", "Write a one-line description using only the ingredients and the method I list. Do not call it authentic or award-winning.", "No extra claim."),
      p("Allergen caution", "You are not sure.", "If I did not list allergens, write that guests must ask, rather than inventing 'allergen free'.", "No allergen was invented."),
      p("Booking confirmation", "A table is booked.", "Write the confirmation with the name, date, time, and party size I provide. Ask them to reply if the party size changes.", "Every detail matches."),
      p("Full", "You are fully booked.", "Write a reply that says full and offers the next time I provide. Do not offer a discount.", "No discount."),
      p("Specials board", "Three specials.", "Write the board. Include the price I set. If a special has no price, mark it missing rather than inventing one.", "Prices are mine."),
      p("Quiet description", "The about text is loud.", "Rewrite the about text so a neighbour would believe it. Remove claims I cannot point at.", "You can defend every line."),
    ],
  },
  {
    number: 20, name: "Study notes from a source", summary: "Make study notes that stay tied to the source you paste.", audience: "Students and trainees revising from a real text.", tags: ["study"], prices: [169, 13, 10, 12],
    prompts: [
      p("Questions", "You have a chapter.", "Write ten questions the chapter can answer. Do not write the answers yet.", "Each question is in the chapter."),
      p("Answers", "You are ready.", "Answer those questions from the chapter. If the chapter does not answer one, say so.", "Missing answers are marked."),
      p("Teach it", "You need to remember.", "Explain the idea as if to a classmate, using an example from the chapter. Do not import an example from another subject.", "The example is from the text."),
      p("Confusions", "You are stuck.", "List the terms the chapter uses that it does not define.", "You look those up in the course, not in a guess."),
      p("One-page sheet", "Before a test.", "Make a one-page sheet of definitions and steps from the chapter. No extra topics.", "A classmate can see it is this chapter."),
      p("Practice", "You need to try.", "Write five practice tasks at the same level as the chapter's examples. Mark them as practice, not as official questions.", "They are labelled practice."),
    ],
  },
];

export function promptProducts(): ProductDefinition[] {
  return packs.map((pack) => {
    const product = meta(pack);
    const markdown = renderMarkdown({
      title: pack.name,
      kicker: disclaimer,
      blocks: pack.prompts.flatMap((prompt) => [
        { kind: "h" as const, text: prompt.title },
        { kind: "p" as const, text: `Use when: ${prompt.use}` },
        { kind: "p" as const, text: prompt.prompt },
        { kind: "note" as const, text: `Check: ${prompt.check}` },
      ]),
    });
    const rows = [["Title", "Use when", "Prompt", "Check"], ...pack.prompts.map((prompt) => [prompt.title, prompt.use, prompt.prompt, prompt.check])];
    return {
      meta: product,
      checks: [],
      chart: [{ label: "Prompts", value: pack.prompts.length }],
      files: [
        { path: "prompts.md", body: textFile(markdown) },
        { path: "prompts.csv", body: textFile(csv(rows)) },
      ],
    };
  });
}
