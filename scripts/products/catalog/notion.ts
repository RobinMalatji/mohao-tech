import { csv, renderMarkdown, textFile } from "../render";
import { money, slugify, type Doc, type ProductDefinition, type ProductMeta } from "../types";

const disclaimer = "This is a Markdown and CSV package you import into Notion yourself. It is not a published Notion template and it does not include a Notion share link.";

type System = {
  number: number;
  name: string;
  summary: string;
  description: string;
  audience: string;
  tags: string[];
  prices: [number, number, number, number];
  pages: { file: string; title: string; lines: string[] }[];
  table: { file: string; headers: string[]; rows: string[][] };
};

function productMeta(system: System): ProductMeta {
  return {
    id: `NOT-${String(system.number).padStart(3, "0")}`,
    slug: slugify(system.name),
    name: system.name,
    category: "notion",
    categorySlug: "notion-systems",
    categoryLabel: "Notion systems",
    productType: "Markdown and CSV import package",
    audience: system.audience,
    version: "1.0.0",
    licence: "personal",
    summary: system.summary,
    description: system.description,
    benefits: ["Pages you can import as Markdown", "A CSV database with example rows you replace", "Import steps that do not pretend this is a hosted Notion link"],
    compatibility: ["Notion import for Markdown and CSV", "Any editor that opens .md and .csv", "Not a Notion template URL"],
    tags: system.tags,
    prices: money(...system.prices),
    disclaimer,
  };
}

const systems: System[] = [
  {
    number: 1,
    name: "Weekly operator desk",
    summary: "A Monday desk for a six-person company: decisions, blockers, and the one number that matters.",
    description: "Built for a fictional studio lead running a six-person team. The week page asks for one metric, three decisions, and the blockers that need a name next to them.",
    audience: "Operators of small teams who currently keep the week in a chat thread.",
    tags: ["operations", "weekly"],
    prices: [249, 19, 15, 17],
    pages: [
      { file: "monday.md", title: "Monday desk", lines: ["Write the week of 13 October as the sample.", "Metric: invoices sent, not hours worked.", "Decision: pause the new landing page until the two open client sites ship.", "Decision: move the Friday demo to 15:00 because the client is in London.", "Decision: hire a contractor for captions, not a full-time editor.", "Blocker: logo files from Harbour Studio, owner Sam."] },
      { file: "roles.md", title: "Who owns what", lines: ["Delivery: Lerato. Money: Sam. Sales: No one this month, so the lead does it.", "If a task has no owner it does not go on the board."] },
    ],
    table: { file: "open-loops.csv", headers: ["Item", "Owner", "Due", "Status"], rows: [
      ["Harbour logo files", "Sam", "2026-10-14", "Waiting"],
      ["October invoices", "Sam", "2026-10-15", "Doing"],
      ["Caption contractor brief", "Lerato", "2026-10-16", "Not started"],
      ["Client demo", "Lerato", "2026-10-17", "Booked"],
    ] },
  },
  {
    number: 2,
    name: "Semester study desk",
    summary: "A term plan that separates lectures, assignments, and the exam topics you cannot leave until June.",
    description: "A desk for a fictional second-year student taking three modules. It tracks due dates and the topics that are examined, not a motivational habit grid.",
    audience: "University students who need dates and topics more than a mood tracker.",
    tags: ["study", "semester"],
    prices: [179, 14, 11, 13],
    pages: [
      { file: "term.md", title: "This term", lines: ["Modules: Accounting 2, Commercial law, Information systems.", "Exam period in the sample starts 8 June 2027.", "Study hours are booked on the calendar, not wished for."] },
      { file: "weekly.md", title: "Week review", lines: ["Which assignment moved?", "Which topic did you practise, not only read?", "What will you drop if the week is full?"] },
    ],
    table: { file: "assignments.csv", headers: ["Module", "Task", "Due", "Status"], rows: [
      ["Accounting 2", "Ratio set 3", "2026-10-20", "Started"],
      ["Commercial law", "Case note", "2026-10-27", "Not started"],
      ["Information systems", "Process diagram", "2026-11-03", "Brief read"],
      ["Accounting 2", "Past paper 2024", "2026-11-10", "Not started"],
    ] },
  },
  {
    number: 3,
    name: "Bakery content calendar",
    summary: "A month of posts for a bakery, tied to what is actually on the counter.",
    description: "North Station Cafe's sample month. Posts are allowed only when they match a product that will be for sale that day. A post with no product is left off the calendar.",
    audience: "Cafe and bakery owners planning posts around production, not around trends.",
    tags: ["content", "bakery"],
    prices: [199, 15, 12, 14],
    pages: [
      { file: "rules.md", title: "Posting rules", lines: ["Do not announce a special that the baker has not confirmed.", "One photo from the counter beats a stock bun.", "Saturday posts go out at 8am, before the rush, not after it."] },
    ],
    table: { file: "october-posts.csv", headers: ["Date", "Product", "Channel", "Status"], rows: [
      ["2026-10-14", "Seed loaf", "Instagram", "Shot"],
      ["2026-10-16", "Friday pie", "WhatsApp status", "Copy written"],
      ["2026-10-18", "Saturday cinnamon", "Instagram", "Waiting on baker"],
      ["2026-10-21", "Soup and roll", "Instagram", "Idea only"],
    ] },
  },
  {
    number: 4,
    name: "Freelance client pipeline",
    summary: "A pipeline from enquiry to paid, with the next action on every open job.",
    description: "Five stages: new, scoping, proposal, active, waiting for payment. The sample is a designer with four live conversations. A row without a next action is incomplete.",
    audience: "Freelancers who lose track of who they owe a reply.",
    tags: ["freelance", "pipeline"],
    prices: [229, 18, 14, 16],
    pages: [
      { file: "stages.md", title: "Stage rules", lines: ["New: you have not replied with a time.", "Scoping: you are still learning the job.", "Proposal: a price and a date have been sent.", "Active: work has started.", "Waiting: the invoice is out."] },
    ],
    table: { file: "clients.csv", headers: ["Client", "Stage", "Next action", "Amount"], rows: [
      ["Harbour Studio", "Proposal", "Follow up Thursday", "R7200"],
      ["Khumalo Legal", "Active", "Send the second page", "R14000"],
      ["North Station Cafe", "Waiting", "Check the bank Friday", "R4500"],
      ["Yard Strength", "New", "Reply with two times", "Unknown"],
    ] },
  },
  {
    number: 5,
    name: "Household running list",
    summary: "Bills, repairs, and the person who said they would do it.",
    description: "A household list for a fictional shared flat. It is not a chore scoreboard. It records the bill, the due day, and the repair that has been mentioned twice.",
    audience: "Shared households who need one list instead of three chat threads.",
    tags: ["household"],
    prices: [169, 13, 10, 12],
    pages: [
      { file: "rules.md", title: "How the list works", lines: ["Bills have a due day of the month.", "Repairs have a person. If nobody is named, it is not assigned.", "Groceries stay in the grocery workbook, not here."] },
    ],
    table: { file: "home.csv", headers: ["Item", "Kind", "Owner", "Due"], rows: [
      ["Fibre", "Bill", "Amina", "Day 1"],
      ["Electricity", "Bill", "Leo", "When the units hit 20"],
      ["Bathroom tap", "Repair", "Leo", "2026-10-18"],
      ["Gate remote", "Repair", "Unassigned", "No date"],
    ] },
  },
  {
    number: 6,
    name: "Role search tracker",
    summary: "Track applications with the source, the stage, and the follow-up date.",
    description: "A job search database for one person looking for operations roles. It records where the role was found so you can see which source is working. It is not a CV.",
    audience: "Job seekers applying to more than a handful of roles.",
    tags: ["job search"],
    prices: [189, 15, 12, 14],
    pages: [
      { file: "stages.md", title: "Stages", lines: ["Saved, applied, screen, task, interview, offer, closed.", "Closed includes rejections. Keep them so you do not apply twice.", "Follow-up date is blank only when you are waiting on a dated interview."] },
    ],
    table: { file: "roles.csv", headers: ["Company", "Role", "Source", "Stage", "Follow up"], rows: [
      ["Field Goods", "Ops lead", "Company site", "Applied", "2026-10-20"],
      ["Northlight", "Studio manager", "Referral", "Screen", "2026-10-16"],
      ["Yard Strength", "Coordinator", "Instagram", "Saved", ""],
      ["Open Shelf", "Programme assistant", "Company site", "Closed", ""],
    ] },
  },
  {
    number: 7,
    name: "Reading notes desk",
    summary: "Notes that keep the claim, the page, and what you will do with it.",
    description: "A reading system for operators, not a star rating. Each note has a claim, where it is in the book, and whether it changes a decision.",
    audience: "People who finish books and cannot find the page later.",
    tags: ["reading", "notes"],
    prices: [159, 12, 10, 11],
    pages: [
      { file: "how.md", title: "What to write", lines: ["Claim in one sentence.", "Page or chapter.", "Decision: ignore, try, or already doing."] },
    ],
    table: { file: "notes.csv", headers: ["Source", "Claim", "Place", "Decision"], rows: [
      ["The E-Myth revisited", "Work on the business is a system, not a mood", "Chapter 3", "Try"],
      ["A guide to the business of writing", "Price the outcome, not the hour, when the outcome is clear", "Page 41", "Already doing"],
      ["Company of One", "A bigger team is not the only version of success", "Chapter 1", "Ignore for now"],
    ] },
  },
  {
    number: 8,
    name: "Small launch checklist",
    summary: "A launch list for a digital product that is not a startup theatre board.",
    description: "Checks for a sample launch of a workbook: file, price, licence, email, and the page. Each item has an owner and a done state.",
    audience: "Solo makers shipping one digital file.",
    tags: ["launch"],
    prices: [199, 15, 12, 14],
    pages: [
      { file: "definition.md", title: "Done means", lines: ["The file opens.", "The price is the same in the page and the checkout.", "The email has the right link.", "A friend who did not build it can tell what they are buying."] },
    ],
    table: { file: "checks.csv", headers: ["Check", "Owner", "State"], rows: [
      ["Sample numbers replaced in the public screenshot", "You", "Open"],
      ["Price matches the four currencies", "You", "Open"],
      ["Licence file is inside the zip", "You", "Done"],
      ["Download tested after a sample payment", "You", "Open"],
    ] },
  },
  {
    number: 9,
    name: "Decision meeting notes",
    summary: "Meeting notes that end with a decision, an owner, and a date.",
    description: "A note format for a fictional agency's client calls. If there is no decision, the note says 'no decision' instead of a vague summary.",
    audience: "Small teams whose meeting notes do not say what changed.",
    tags: ["meetings"],
    prices: [179, 14, 11, 13],
    pages: [
      { file: "format.md", title: "Note format", lines: ["Context in three lines.", "Decision, or the words no decision.", "Owner and date.", "What was explicitly not decided."] },
    ],
    table: { file: "meetings.csv", headers: ["Date", "Meeting", "Decision", "Owner"], rows: [
      ["2026-10-13", "Harbour homepage", "Ship the menu page first", "Lerato"],
      ["2026-10-13", "Harbour homepage", "No decision on photography", "Sam"],
      ["2026-10-09", "Yard timetable", "Use the story template for one week", "Pieter"],
    ] },
  },
  {
    number: 10,
    name: "Pottery class register",
    summary: "A class list with payment status and the shelf number, not a customer essay.",
    description: "For a fictional studio, Clay Hour. Each seat has a person, a Wednesday or Saturday class, whether they have paid, and which shelf holds their work.",
    audience: "Teachers running a small in-person class.",
    tags: ["classes", "register"],
    prices: [169, 13, 10, 12],
    pages: [
      { file: "rules.md", title: "Register rules", lines: ["Paid means the transfer has arrived.", "A shelf number is blank until the piece exists.", "Do not store identity numbers in this list."] },
    ],
    table: { file: "register.csv", headers: ["Name", "Class", "Paid", "Shelf"], rows: [
      ["Ayesha Khan", "Wednesday", "Yes", "14"],
      ["Johan Botha", "Wednesday", "No", ""],
      ["Leila September", "Saturday", "Yes", "3"],
      ["Sam Patel", "Saturday", "Yes", ""],
    ] },
  },
  {
    number: 11,
    name: "Cafe opening SOP",
    summary: "Opening steps for a cafe, with the person and the proof that it happened.",
    description: "Opening list for Compass Coffee. Each step has a proof: a photo is not required, a tick and a time is. The sample includes the till float and the first filter coffee.",
    audience: "Cafe owners writing the open so a new person can do it.",
    tags: ["sop", "cafe"],
    prices: [209, 16, 13, 15],
    pages: [
      { file: "open.md", title: "Open", lines: ["Float is R800 in the sample.", "First coffee is a test, not a sale.", "If the fridge is above the noted temperature, do not guess. Write it down and call the owner."] },
    ],
    table: { file: "steps.csv", headers: ["Step", "Proof", "Owner"], rows: [
      ["Count the float", "Amount written", "Opener"],
      ["Start the filter", "Time written", "Opener"],
      ["Check the fridge", "Temperature written", "Opener"],
      ["Put the board out", "Board matches today's food", "Opener"],
    ] },
  },
  {
    number: 12,
    name: "Wedding planning board",
    summary: "Vendors, deposits, and the date the quote expires.",
    description: "A planning board for the fictional Leila and James wedding. It tracks vendors and deposit dates. It is not the invitation design.",
    audience: "Couples or planners keeping vendor decisions in one place.",
    tags: ["wedding", "planning"],
    prices: [229, 18, 14, 16],
    pages: [
      { file: "rules.md", title: "Vendor rules", lines: ["A quote without an expiry date is incomplete.", "Deposit paid is a date, not a feeling.", "Guest list count lives in one cell so the caterer and the venue use the same number."] },
    ],
    table: { file: "vendors.csv", headers: ["Vendor", "Quote", "Expires", "Deposit"], rows: [
      ["Long barn", "R18000", "2026-11-01", "Paid 2026-09-02"],
      ["Photographer", "R12000", "2026-10-30", "Not paid"],
      ["Caterer", "R24000", "2026-10-20", "Not paid"],
      ["Flowers", "R4500", "2026-12-01", "Not paid"],
    ] },
  },
  {
    number: 13,
    name: "Photographer client book",
    summary: "A small CRM: how you met, what they booked, and when to write again.",
    description: "For a fictional photographer at Northlight. It stores the relationship and the next note, not a copy of their identity document.",
    audience: "Photographers with repeat clients and referrals.",
    tags: ["crm", "photo"],
    prices: [199, 15, 12, 14],
    pages: [
      { file: "fields.md", title: "Fields to keep", lines: ["Source: referral, search, or repeat.", "Last job and next note.", "Do not paste identity numbers or card numbers into the note."] },
    ],
    table: { file: "people.csv", headers: ["Name", "Source", "Last job", "Next note"], rows: [
      ["North Station Cafe", "Repeat", "Menu photos", "Ask about December"],
      ["Leila September", "Referral", "Portrait", "Send three selects"],
      ["Yard Strength", "Search", "None yet", "Reply to the enquiry"],
    ] },
  },
  {
    number: 14,
    name: "Lesson building desk",
    summary: "A desk for building one short course: outcome, lesson, exercise, and the file the learner gets.",
    description: "Used to plan a fictional four-lesson course on writing a project brief. Each lesson has an exercise and a file. If there is no exercise, the lesson is not ready.",
    audience: "Trainers turning a workshop into a short course.",
    tags: ["course", "lessons"],
    prices: [209, 16, 13, 15],
    pages: [
      { file: "outcome.md", title: "Course outcome", lines: ["After four lessons the learner can write a one-page brief with a decision, a constraint, and an owner.", "That sentence is the test of every lesson. If a lesson does not serve it, cut the lesson."] },
    ],
    table: { file: "lessons.csv", headers: ["Lesson", "Exercise", "File", "Ready"], rows: [
      ["Name the decision", "Write the decision in one line", "brief-template.md", "Yes"],
      ["Name the constraint", "List money, time, and people", "constraint-sheet.csv", "Yes"],
      ["Name the owner", "Assign one name", "brief-template.md", "No"],
      ["Cut the rest", "Delete a paragraph", "before-after.md", "No"],
    ] },
  },
  {
    number: 15,
    name: "Solo app issue list",
    summary: "Bugs and requests for one app, with severity and the version you saw it in.",
    description: "An issue list for a fictional booking app. Severity is broken, wrong, or wish. A wish is not scheduled just because it was loud.",
    audience: "Solo developers keeping issues outside the code comments.",
    tags: ["issues", "software"],
    prices: [179, 14, 11, 13],
    pages: [
      { file: "severity.md", title: "Severity", lines: ["Broken: a booked person cannot complete the job.", "Wrong: the result is misleading but there is a workaround.", "Wish: a request. It waits."] },
    ],
    table: { file: "issues.csv", headers: ["Title", "Severity", "Version", "State"], rows: [
      ["Reminder sends twice", "Broken", "1.3.0", "Open"],
      ["Timezone shows UTC", "Wrong", "1.3.0", "Open"],
      ["Dark mode", "Wish", "1.3.0", "Parked"],
      ["Cancel from the email", "Wish", "1.2.0", "Parked"],
    ] },
  },
  {
    number: 16,
    name: "Week of meals",
    summary: "Four dinners and the shop that belongs to them.",
    description: "A meal plan for a fictional household of three. It is four dinners, not a nutrition plan. The shop list is derived from those dinners so you do not buy a fifth cuisine.",
    audience: "Households who want fewer evening decisions.",
    tags: ["meals"],
    prices: [149, 12, 9, 11],
    pages: [
      { file: "rules.md", title: "Rules", lines: ["Plan four dinners. Leave room for leftovers and one unplanned night.", "This is not medical or nutrition advice.", "If an ingredient is not in a dinner, it is not on the list."] },
    ],
    table: { file: "dinners.csv", headers: ["Day", "Dinner", "Uses"], rows: [
      ["Monday", "Chicken and rice", "Chicken, rice, onion"],
      ["Tuesday", "Leftover chicken rolls", "Bread, leftover chicken"],
      ["Wednesday", "Lentil soup", "Lentils, carrot, stock"],
      ["Thursday", "Eggs and vegetables", "Eggs, the remaining vegetables"],
    ] },
  },
  {
    number: 17,
    name: "City trip itinerary",
    summary: "A four-day Cape Town trip with bookings separated from ideas.",
    description: "An itinerary for two people. Booked items have a confirmation reference in the sample. Ideas do not, so you can tell what is real.",
    audience: "Travellers who mix bookings and maybes and then forget which is which.",
    tags: ["travel"],
    prices: [169, 13, 10, 12],
    pages: [
      { file: "rules.md", title: "Booked or idea", lines: ["Booked rows have a reference.", "Idea rows have no time you must keep.", "Do not put passport numbers in the note."] },
    ],
    table: { file: "days.csv", headers: ["Day", "Item", "State", "Reference"], rows: [
      ["Friday", "Flight", "Booked", "SA1234"],
      ["Friday", "Room", "Booked", "NSC-2291"],
      ["Saturday", "Company's Garden walk", "Idea", ""],
      ["Sunday", "Return flight", "Booked", "SA4321"],
    ] },
  },
  {
    number: 18,
    name: "Agency quarterly objectives",
    summary: "Three objectives for a four-person agency, each with a measure.",
    description: "A quarterly page for a fictional agency. An objective without a measure is sent back. The sample quarter is October to December 2026.",
    audience: "Small agencies setting a quarter without a heavy framework.",
    tags: ["goals", "agency"],
    prices: [219, 17, 13, 15],
    pages: [
      { file: "rules.md", title: "A measure is required", lines: ["Ship four client sites is a measure. Be more strategic is not.", "Each objective has one owner.", "If you have more than three, you have a wish list."] },
    ],
    table: { file: "objectives.csv", headers: ["Objective", "Measure", "Owner", "State"], rows: [
      ["Finish the two open sites", "Both live", "Lerato", "At risk"],
      ["Collect October invoices", "All paid by 31 October", "Sam", "On track"],
      ["Write two case studies", "Published with client permission", "Sam", "Not started"],
    ] },
  },
  {
    number: 19,
    name: "Market stall stock count",
    summary: "What you packed, what you sold, and what came home.",
    description: "A count sheet for Harbour Smoke's Saturday stall. Packed minus sold minus waste should equal what came home. The sample shows a gap so you can see how the check works.",
    audience: "Market traders who guess the day's sales from memory.",
    tags: ["stock", "market"],
    prices: [189, 15, 12, 14],
    pages: [
      { file: "count.md", title: "The check", lines: ["Count at pack and again at home.", "Waste is food you cannot sell tomorrow.", "A gap means a count is wrong or something walked away. Write the gap. Do not hide it."] },
    ],
    table: { file: "stock.csv", headers: ["Item", "Packed", "Sold", "Waste", "Home"], rows: [
      ["Brisket roll", "40", "36", "1", "3"],
      ["Mielies", "30", "22", "0", "8"],
      ["Cabbage plate", "20", "11", "2", "6"],
    ] },
  },
  {
    number: 20,
    name: "Neighbourhood newsletter desk",
    summary: "An issue plan with a writer, a word count, and a deadline before print day.",
    description: "For a fictional letter, Block Notes, printed monthly. Each item has a writer and a maximum word count so the issue fits four pages.",
    audience: "Volunteer editors of a small newsletter.",
    tags: ["editorial", "newsletter"],
    prices: [179, 14, 11, 13],
    pages: [
      { file: "issue.md", title: "Issue 6", lines: ["Print day is 30 October 2026.", "Copy deadline is 23 October.", "If a piece misses the word count, it is cut, not squeezed."] },
    ],
    table: { file: "pieces.csv", headers: ["Piece", "Writer", "Words", "Deadline"], rows: [
      ["Market hours", "Amina", "120", "2026-10-20"],
      ["Library hours change", "Johan", "80", "2026-10-21"],
      ["New clinic bus", "Leila", "150", "2026-10-22"],
      ["Letter from the editor", "Amina", "200", "2026-10-23"],
    ] },
  },
];

function importDoc(system: System): Doc {
  return {
    title: `Import ${system.name}`,
    kicker: disclaimer,
    blocks: [
      { kind: "p", text: system.description },
      { kind: "h", text: "Import into Notion" },
      { kind: "ol", items: [
        "In Notion, choose Import, then Markdown & CSV.",
        "Import the Markdown pages in the pages folder.",
        `Import ${system.table.file} and check that the column names match the header row.`,
        "Replace the sample rows before you rely on the board.",
        "There is no Notion link in this package. If a seller sends you only a link, that is a different product.",
      ] },
      { kind: "h", text: "Sample database" },
      { kind: "table", headers: system.table.headers, rows: system.table.rows },
    ],
  };
}

export function notionProducts(): ProductDefinition[] {
  return systems.map((system) => {
    const product = productMeta(system);
    const doc = importDoc(system);
    const pageFiles = system.pages.map((page) => ({
      path: `pages/${page.file}`,
      body: textFile(renderMarkdown({ title: page.title, blocks: page.lines.map((line) => ({ kind: "p", text: line })) })),
    }));
    return {
      meta: product,
      checks: [],
      chart: [{ label: "Rows", value: system.table.rows.length }, { label: "Pages", value: system.pages.length }],
      files: [
        ...pageFiles,
        { path: `databases/${system.table.file}`, body: textFile(csv([system.table.headers, ...system.table.rows])) },
        { path: "import-guide.md", body: textFile(renderMarkdown(doc)) },
      ],
    };
  });
}
