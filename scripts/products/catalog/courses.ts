import { renderMarkdown, renderPdf, renderSlides, textFile } from "../render";
import { money, slugify, type Doc, type ProductDefinition, type ProductMeta } from "../types";

const disclaimer = "This is a self-study pack: lessons, slides, and exercises. It is not an accredited qualification and it does not include a tutor.";

type Course = {
  number: number;
  name: string;
  summary: string;
  audience: string;
  tags: string[];
  lessons: { title: string; teach: string; exercise: string }[];
};

const courses: Course[] = [
  c(1, "Spreadsheet habits", "Four lessons on labels, one formula row, and a check total.", "People who already type numbers into a grid.", ["spreadsheets"], [
    ["Label the unit", "Write the unit in the header: rand, hours, or units. A naked number is not a record.", "Add units to a sheet you already use."],
    ["One formula", "Type the input. Let a formula do the total. Do not type the total yourself.", "Replace one typed total with SUM."],
    ["A check", "A check cell compares the formula with a number you calculated by hand once.", "Add a check and break it on purpose, then fix it."],
    ["A note", "The cell note says where the number came from.", "Add a note to the three inputs someone else would question."],
  ]),
  c(2, "Clearer business email", "Write shorter emails that ask for one thing.", "People whose emails get half answers.", ["email"], [
    ["One ask", "The last line is the request. The rest is context.", "Rewrite yesterday's email so the ask is the last line."],
    ["The date", "If you need it by Friday, say Friday's date.", "Add a date to an open request."],
    ["No pile", "Three questions in one email get one answer. Send the most important.", "Split a piled email into the one you will send."],
    ["The subject", "The subject names the project and the ask.", "Rewrite five subjects from your sent mail."],
  ]),
  c(3, "SQL for operators", "Read a query: filters, joins, and the grain of the result.", "Operators who receive SQL and need to ask better questions.", ["sql"], [
    ["The grain", "Say what one row is before you read the filters.", "Write the grain of a query you were sent."],
    ["Filters", "List each filter in words.", "Translate a WHERE clause into sentences."],
    ["Joins", "A join can duplicate rows. Ask for a count before and after.", "Write the question you will ask the author."],
    ["A change", "Describe the change you want in words before anyone edits the query.", "Write a change request without writing the SQL."],
  ]),
  c(4, "Customer interviews", "Run an interview about the last time, not about your idea.", "Founders before they build.", ["research"], [
    ["Who", "Someone who did the job in the last six months.", "Write the screen question."],
    ["Last time", "Walk through the last occurrence.", "Write six questions that start with the last time."],
    ["Notes", "Write their words.", "Practise on a friend and mark where you pitched."],
    ["After", "Repeats and contradictions.", "Summarise two imaginary notes without inventing a quote. Use only what is written."],
  ]),
  c(5, "Web accessibility pass", "A pass you can do on your own small site.", "People shipping a small site.", ["accessibility"], [
    ["Headings", "The title says where you are.", "Rename one vague page title."],
    ["Contrast and colour", "Words, not colour alone, carry the error.", "Find one place colour is the only signal."],
    ["Keyboard", "Tab through the page.", "List the control you cannot reach."],
    ["Forms", "Labels connected to fields.", "Add a label that is not only a placeholder."],
  ]),
  c(6, "A month of budgeting", "Four lessons that match the household budget workbook.", "Households starting a monthly plan.", ["budget"], [
    ["Net pay", "Use the amount that arrives.", "Write last month's net pay."],
    ["The list", "List the costs you will actually pay.", "List ten."],
    ["The gap", "Income minus the list.", "Compute the gap by hand and with a formula."],
    ["The review", "What surprised you.", "Write one sentence at month end."],
  ]),
  c(7, "Slides that decide", "A short deck that ends in a decision.", "People who present to a small team.", ["slides"], [
    ["The decision", "The title is the decision you want.", "Write the title before the slides."],
    ["Evidence", "One slide, one piece of evidence.", "Cut a deck to five slides."],
    ["The ask", "The last slide is the ask and the date.", "Add the date."],
    ["Rehearse", "Read it aloud once.", "Time it. Cut if it runs over."],
  ]),
  c(8, "Git for a small team", "Commit, branch, and read a diff without a ceremony.", "Juniors joining a small codebase.", ["git"], [
    ["A commit", "One change, a sentence that says why.", "Write three commit messages for work you did this week."],
    ["A branch", "The branch is the work, not a personal notebook.", "Name a branch for a real change."],
    ["A diff", "Read what changed before you ask for review.", "List the behaviour, not the formatting."],
    ["Main", "Main stays deployable.", "Write the rule your team will use."],
  ]),
  c(9, "Prompting at work", "Paste your material and check the answer.", "People using a chat model for drafts.", ["prompts"], [
    ["Paste the source", "The model does not know your client.", "Paste a paragraph and ask for a shorter version with no new facts."],
    ["The check", "Every number must be yours.", "Mark one invented detail and remove it."],
    ["One job", "One prompt, one job.", "Split a prompt that asked for three things."],
    ["Sensitive data", "Do not paste secrets or customer identity numbers.", "Rewrite a prompt to remove a name it did not need."],
  ]),
  c(10, "Cash flow for a small shop", "Watch cash collected, not only sales.", "Shop owners.", ["cash"], [
    ["Collected", "A sale on account is not cash.", "Split last month into collected and still owed."],
    ["The big payments", "Rent, stock, and wages have dates.", "Put those dates on a calendar."],
    ["A tight week", "Name the week the cash is lowest.", "Find it in last quarter."],
    ["One change", "A deposit, a smaller order, or a later payment.", "Pick one and write the date."],
  ]),
  c(11, "A one-page site", "Structure a single page: result, included, price.", "People selling one offer.", ["websites"], [
    ["The first screen", "Who it is for and the result.", "Write the first screen in four lines."],
    ["Included", "A list.", "Write the list and one exclusion."],
    ["Price", "Visible.", "Put the price in the draft."],
    ["Proof", "Something true.", "Add proof or delete a claim."],
  ]),
  c(12, "Study weeks", "Plan a study week around deadlines, not around motivation.", "Students.", ["study"], [
    ["The deadlines", "List them.", "Write this month's dates."],
    ["The blocks", "Ninety minutes, a specific task.", "Book three."],
    ["The practice", "Do the problem, do not only reread.", "Pick one past question."],
    ["The review", "What you can do now that you could not on Monday.", "Write it in a sentence."],
  ]),
  c(13, "Cleaning data in a sheet", "Find blanks, duplicates, and mixed units.", "People who inherit a spreadsheet.", ["data"], [
    ["Blanks", "A blank may be zero or may be unknown. Decide.", "Mark ten blanks as zero or unknown."],
    ["Duplicates", "The same invoice twice doubles the total.", "Find one duplicate key."],
    ["Units", "Rand and cents in one column will lie.", "Separate one mixed column."],
    ["A total you trust", "After the clean, recompute.", "Write the old total and the new total."],
  ]),
  c(14, "Useful feedback", "Give feedback on the work, with the change you want.", "Leads and peers.", ["feedback"], [
    ["The work", "Quote the line or the screen.", "Pick one deliverable."],
    ["The change", "Say what to change.", "Write one change, not a list of tastes."],
    ["The reason", "Why it matters to the reader or the user.", "Add the reason in one line."],
    ["Stop", "Do not add a second theme.", "Delete the extra comment."],
  ]),
  c(15, "Start a freelance practice", "The first offer, the first invoice, the first folder.", "People leaving employment or starting beside it.", ["freelance"], [
    ["The offer", "One sentence and a price.", "Write it."],
    ["The folder", "Invoices, expenses, contracts.", "Create them."],
    ["The invoice", "Number, date, work, amount, bank.", "Draft invoice 001 with sample data labelled as sample."],
    ["The boundary", "What you will not do in the first month.", "Write three nos."],
  ]),
  c(16, "Reading a simple income statement", "Revenue, costs, and profit as words before ratios.", "Owners looking at a statement their bookkeeper sent.", ["finance"], [
    ["Revenue", "What was sold. Ask if it is invoiced or collected.", "Circle the word on your statement."],
    ["Costs", "What was spent to do the work, and what was overhead.", "Split one statement into those two in notes."],
    ["Profit", "Revenue minus those costs. It is not cash in the bank.", "Write the difference in a sentence."],
    ["A question", "One question for the bookkeeper.", "Send it."],
  ]),
  c(17, "Security habits", "Passwords, access, and backups for a small team.", "Owners who are not security teams.", ["security"], [
    ["Passwords", "A manager, unique passwords, and a shared vault for the business.", "Move one shared password out of a chat."],
    ["Access", "People get what they need. Leavers lose it the same day.", "List one leaver and confirm access is gone."],
    ["Backups", "Two copies, one tested.", "Open one file from the backup."],
    ["Phishing", "A surprise payment change is a phone call, not a reply.", "Write the rule on the wall or in the handbook."],
  ]),
  c(18, "Run a retrospective", "A one-hour look back that ends with one change.", "Teams who have meetings that only vent.", ["teams"], [
    ["Facts", "What happened, with dates.", "List five facts."],
    ["What to keep", "One practice that worked.", "Name it."],
    ["What to change", "One change, an owner, a date.", "Write it."],
    ["Stop", "Do not leave with ten actions.", "Cross out nine."],
  ]),
  c(19, "Repurpose a piece of work", "Turn one case, talk, or guide into three smaller pieces without inventing results.", "People who did the work once and want to use it again.", ["content"], [
    ["The source", "One real piece.", "Pick it."],
    ["The lesson", "One lesson a stranger can use.", "Write it in four lines."],
    ["The proof", "Only the result you can show.", "Delete a result you cannot show."],
    ["The offcuts", "A caption, a slide, a paragraph. Same facts.", "Make the three."],
  ]),
  c(20, "A personal knowledge desk", "Notes you can find: source, claim, and the decision.", "People with unread highlights.", ["notes"], [
    ["The claim", "One sentence.", "Write a claim from something you read this month."],
    ["The source", "Title and place.", "Add it."],
    ["The decision", "Ignore, try, or already doing.", "Mark it."],
    ["The retrieval", "A title you would search for.", "Rename the note."],
  ]),
];

function c(number: number, name: string, summary: string, audience: string, tags: string[], lessons: [string, string, string][]): Course {
  return {
    number,
    name,
    summary,
    audience,
    tags,
    lessons: lessons.map(([title, teach, exercise]) => ({ title, teach, exercise })),
  };
}

function meta(course: Course): ProductMeta {
  return {
    id: `CRS-${String(course.number).padStart(3, "0")}`,
    slug: slugify(course.name),
    name: course.name,
    category: "courses",
    categorySlug: "courses",
    categoryLabel: "Courses",
    productType: "Lessons, slides, and a worksheet",
    audience: course.audience,
    version: "1.0.0",
    licence: "personal",
    summary: course.summary,
    description: `${course.summary} Four short lessons, a slide file, and a worksheet. Study it on your own.`,
    benefits: ["Four lessons with an exercise each", "Slides you can present to yourself or a colleague", "A worksheet of the exercises"],
    compatibility: ["A text editor or Notion for the lessons", "PowerPoint, Keynote, or Google Slides for the PPTX", "A PDF reader for the worksheet"],
    tags: course.tags,
    prices: money(249, 19, 15, 17),
    disclaimer,
  };
}

export async function courseProducts(): Promise<ProductDefinition[]> {
  const products: ProductDefinition[] = [];
  for (const course of courses) {
    const product = meta(course);
    const worksheet: Doc = {
      title: `${course.name} worksheet`,
      kicker: disclaimer,
      blocks: course.lessons.map((lesson) => ({ kind: "h" as const, text: lesson.title })).flatMap((heading, index) => [
        heading,
        { kind: "p" as const, text: course.lessons[index].exercise },
      ]),
    };
    const lessonFiles = course.lessons.map((lesson, index) => ({
      path: `lessons/${String(index + 1).padStart(2, "0")}-${slugify(lesson.title)}.md`,
      body: textFile(renderMarkdown({
        title: lesson.title,
        blocks: [
          { kind: "p", text: lesson.teach },
          { kind: "h", text: "Exercise" },
          { kind: "p", text: lesson.exercise },
        ],
      })),
    }));
    products.push({
      meta: product,
      checks: [],
      chart: course.lessons.map((lesson, index) => ({ label: `L${index + 1}`, value: lesson.teach.length })),
      files: [
        ...lessonFiles,
        { path: "slides.pptx", body: await renderSlides(course.name, course.lessons.map((lesson) => ({ title: lesson.title, bullets: [lesson.teach, lesson.exercise] }))) },
        { path: "worksheet.pdf", body: await renderPdf(worksheet, product) },
        { path: "worksheet.md", body: textFile(renderMarkdown(worksheet)) },
      ],
    });
  }
  return products;
}
