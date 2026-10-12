import { renderDocx, renderPdf, renderMarkdown, textFile } from "../render";
import { money, slugify, type Doc, type ProductDefinition, type ProductMeta } from "../types";

const disclaimer = "This is a practical guide, not professional advice. Laws, tax, platforms, and prices change. Check the current rules before you act.";

type Book = {
  number: number;
  name: string;
  summary: string;
  audience: string;
  tags: string[];
  prices: [number, number, number, number];
  sections: { heading: string; paragraphs: string[]; points?: string[] }[];
};

function meta(book: Book): ProductMeta {
  return {
    id: `EBK-${String(book.number).padStart(3, "0")}`,
    slug: slugify(book.name),
    name: book.name,
    category: "ebooks",
    categorySlug: "guides",
    categoryLabel: "Guides",
    productType: "PDF guide with Markdown and DOCX",
    audience: book.audience,
    version: "1.0.0",
    licence: "personal",
    summary: book.summary,
    description: book.summary,
    benefits: ["A complete method you can follow this week", "A checklist inside the guide", "The same text as PDF, Word, and Markdown"],
    compatibility: ["Any PDF reader", "Microsoft Word or Google Docs for the DOCX", "A text editor for the Markdown"],
    tags: book.tags,
    prices: money(...book.prices),
    disclaimer,
  };
}

function doc(book: Book): Doc {
  return {
    title: book.name,
    kicker: book.summary,
    blocks: book.sections.flatMap((section) => [
      { kind: "h" as const, text: section.heading },
      ...section.paragraphs.map((text) => ({ kind: "p" as const, text })),
      ...(section.points ? [{ kind: "ul" as const, items: section.points }] : []),
    ]),
  };
}

const books: Book[] = [
  { number: 1, name: "Open a sole prop folder", summary: "Set up the records a one-person business in South Africa needs before the first invoice.", audience: "Someone about to invoice under their own name.", tags: ["business", "records"], prices: [189, 15, 12, 14], sections: [
    { heading: "What this guide will not do", paragraphs: ["It will not register a company for you and it will not tell you whether a sole prop or a company is better. That depends on liability, tax, and the contracts you want to sign. A practitioner should answer that."], points: ["Keep a separate bank account for the work.", "Save every invoice number, even the cancelled ones.", "Put the tax year, March to February, on the folder."] },
    { heading: "The folder", paragraphs: ["Create five folders: invoices, expenses, bank exports, tax certificates, and contracts. Name files with the date first, then the person, then the type. INV-014 is easier to find later than 'final final'."], points: ["Export the bank statement monthly as CSV and PDF.", "Photograph a till slip the day you get it.", "Do not mix household groceries into the expense folder."] },
    { heading: "The first invoice", paragraphs: ["An invoice needs your name, the client's name, a date, a number, what you did, the amount, and the bank details. If you are VAT registered, the invoice has extra rules. If you are not, do not add VAT."], points: ["Start at a number you will not reuse.", "Write the work in the client's words.", "Send a PDF, and keep the editable copy."] },
    { heading: "A monthly half hour", paragraphs: ["On the first Monday, export the bank, match it to invoices, and list what is still unpaid. That list is the business. The rest is noise."], points: ["Unpaid invoices are not spendable money.", "Write down a cost you keep forgetting.", "If you are unsure about a deduction, mark it and ask."] },
  ]},
  { number: 2, name: "Price a fixed service", summary: "Set a fixed price from the work and the costs, instead of copying a competitor.", audience: "Freelancers who still quote from a nervous hourly rate.", tags: ["pricing"], prices: [199, 16, 12, 14], sections: [
    { heading: "Name the thing being bought", paragraphs: ["A client does not buy eight hours. They buy a menu photographed, a contract reviewed, or a month of books closed. Write that sentence before you pick a number."], points: ["One sentence.", "What is included.", "What is not."] },
    { heading: "Cost the delivery", paragraphs: ["List the hours you actually spend, including email and revisions, then the tools and travel. Add the unpaid admin of being in business. If you skip admin, the price funds only the visible part."], points: ["Count a revision round.", "Count the proposal time.", "Count the software for the month."] },
    { heading: "Choose a number you can say", paragraphs: ["Round to a number you can say out loud. If the cost says R4,320, a price of R4,500 is easier and still covers you. If the client needs it cheaper, remove work. Do not silently keep the work and drop the price."], points: ["Write the price in the proposal.", "Write what happens if the scope grows.", "Do not discount in the first conversation."] },
    { heading: "Review after three sales", paragraphs: ["After three of the same offer, compare the hours you planned with the hours you used. Change the scope or the price. Do not change both and then wonder which one was wrong."], points: ["Keep the timesheet for the three.", "Note the revision that always happens.", "Update the proposal, not only the next quote."] },
  ]},
  { number: 3, name: "Client onboarding checklist", summary: "Start a project with the files, the decision maker, and the definition of done.", audience: "Studios and freelancers who lose a week at the start of every job.", tags: ["clients", "onboarding"], prices: [179, 14, 11, 13], sections: [
    { heading: "Before kickoff", paragraphs: ["Do not start because the deposit 'is on the way'. Start when the deposit is visible and the signed scope is in the folder."], points: ["Deposit received.", "Scope file named and dated.", "One person who can approve."] },
    { heading: "The questions", paragraphs: ["Ask who approves, how fast they can reply, and which files already exist. A brand project without the logo files is not ready. Write the answers into the project note, not into chat."], points: ["Approver and backup.", "Reply time they can keep.", "Files they will send, with a date."] },
    { heading: "The first week", paragraphs: ["Send a one-page plan: what you will show, when, and what you need from them before that date. If they miss the date, the plan moves. Do not absorb the slip and still promise Friday."], points: ["One review date.", "The file you need before it.", "What 'approved' means."] },
    { heading: "Close the kickoff", paragraphs: ["End the first call by reading back the decision, the date, and the owner. Send that in writing the same day."], points: ["Three lines.", "No new scope.", "A calendar hold."] },
  ]},
  { number: 4, name: "One-page business plan", summary: "Write a plan that fits on one page: who pays, for what, and what it costs you.", audience: "Someone testing a small offer before they build a brand system.", tags: ["planning"], prices: [169, 13, 10, 12], sections: [
    { heading: "The page", paragraphs: ["Use six headings: customer, problem, offer, price, cost to deliver, and how they will hear about it. If a heading takes more than four lines, you are writing a pitch, not a plan."], points: ["Name a real kind of customer.", "Name the price.", "Name one channel you will actually use."] },
    { heading: "The test", paragraphs: ["The plan is a hypothesis. The test is ten conversations or ten offers, not a new logo. Write down what would make you stop."], points: ["A number of conversations.", "A date.", "A stop rule."] },
    { heading: "Money", paragraphs: ["Write the cost to deliver one sale and the number of sales that pay your minimum month. If that number is fantasy, the offer is fantasy. Change the offer before you print business cards."], points: ["Cost per sale.", "Sales needed.", "Month you are aiming at."] },
    { heading: "What to leave out", paragraphs: ["Leave out vision statements, market size copied from a report you did not read, and a five-year headcount. They do not change this month's work."], points: ["No stock market-size paragraph.", "No org chart.", "No slogan workshop."] },
  ]},
  { number: 5, name: "Remote team rituals", summary: "A small set of rituals for a team that does not sit together.", audience: "Leads of teams of three to ten people working across cities.", tags: ["teams", "remote"], prices: [189, 15, 12, 14], sections: [
    { heading: "The minimum", paragraphs: ["A remote team needs a place where decisions are written, a weekly time where blockers are named, and a way to know who is off. More meetings than that are usually fear."], points: ["One written decision log.", "One weekly meeting with an agenda.", "A shared leave note."] },
    { heading: "The weekly", paragraphs: ["Forty minutes. Each person names one thing that is stuck and the help they want. The lead writes the decision before the call ends. Status theatre, where everyone recites tasks, is cut."], points: ["Stuck, not a status list.", "Help requested.", "Decision written."] },
    { heading: "Writing", paragraphs: ["If it matters next week, it does not live only in a call. A decision without a sentence in the log did not happen. People who were absent read the log, they do not get a second meeting."], points: ["The log is the record.", "Calls are for disagreement.", "Absentees read."] },
    { heading: "Stop doing", paragraphs: ["Cancel a meeting that has not produced a decision in three weeks. Shorten the daily if it exists. Protect a block of quiet hours and say so on the calendar."], points: ["Cancel one standing meeting.", "Publish quiet hours.", "Review the ritual set quarterly."] },
  ]},
  { number: 6, name: "Customer interview guide", summary: "Run five interviews that ask about past behaviour, not opinions about your idea.", audience: "Founders who have not yet sold the thing they want to build.", tags: ["research"], prices: [199, 16, 12, 14], sections: [
    { heading: "Who to talk to", paragraphs: ["Talk to people who have done the job in the last six months. Friends who like you will be kind. Kind is not evidence."], points: ["A screen question about the last time.", "No pitching in the first interview.", "Five people, not fifty."] },
    { heading: "The questions", paragraphs: ["Ask when they last hit the problem, what they did, what it cost, and what they tried before. Ask them to walk through the last time, not the usual time."], points: ["Last time, not usually.", "What they paid or spent.", "What they tried instead."] },
    { heading: "During the call", paragraphs: ["Write their words. Do not translate into your feature while they are talking. If you do not understand, ask them to say it again. Do not fill the silence with your idea."], points: ["Notes in their words.", "Silence is allowed.", "No demo."] },
    { heading: "After five", paragraphs: ["List what repeated and what contradicted. Do not average people into a persona. A contradiction is a reason to talk to a sixth person, not a reason to pick the answer you prefer."], points: ["Repeats.", "Contradictions.", "One decision the notes support."] },
  ]},
  { number: 7, name: "Landing page copy sheet", summary: "Write a one-page offer: who it is for, what they get, and what it costs.", audience: "People selling one digital product or one service on a single page.", tags: ["copy"], prices: [179, 14, 11, 13], sections: [
    { heading: "The order of the page", paragraphs: ["Start with the customer and the result. Then what is included. Then the price. Then how they get it. A story about your journey can wait until someone has asked."], points: ["Result in the first screen.", "Included, as a list.", "Price visible."] },
    { heading: "Proof", paragraphs: ["Use a proof you have: a number of customers, a named client who agreed, or a sample of the file. Do not invent a review. If you have no proof yet, show the work."], points: ["No invented reviews.", "Show a page of the product.", "Name the format."] },
    { heading: "Objections", paragraphs: ["Answer the two questions buyers actually ask: what if it does not fit, and how do I get the file. Link to the refund policy you really have, not a policy you wish you had."], points: ["Formats.", "The real refund rule.", "A support address."] },
    { heading: "Cut", paragraphs: ["Read the page aloud. Delete a sentence that could sit on any other product. If the page still makes sense, it was too generic to keep."], points: ["Delete one generic sentence.", "Read it aloud.", "Ask someone who is the customer."] },
  ]},
  { number: 8, name: "Welcome email sequence", summary: "Three emails after someone joins a list or buys a small product.", audience: "Operators who have a list and send one email that tries to do everything.", tags: ["email"], prices: [169, 13, 10, 12], sections: [
    { heading: "Email one", paragraphs: ["Send the thing they asked for, and one next step. If they bought a file, the next step is how to open it. If they joined a list, the next step is the guide you promised. Do not add a second offer."], points: ["The promised thing.", "One next step.", "A human reply address."] },
    { heading: "Email two", paragraphs: ["A few days later, answer the question people ask after they start. For a budget workbook, that question is which number to replace first. Teach that. Do not announce a new product."], points: ["One question.", "A short answer.", "No new offer."] },
    { heading: "Email three", paragraphs: ["Ask if it was useful, and tell them how to reply. A reply is more valuable than a click on a slogan. If you want to sell something else, that is a different email with its own consent."], points: ["Ask one question.", "Separate any sales mail.", "Honour unsubscribe."] },
    { heading: "What not to automate yet", paragraphs: ["Do not build a twelve-email machine before ten people have read email one. Write the three, send them, and change the sentence people did not understand."], points: ["Ten real readers.", "Edit the confusing sentence.", "Then consider a fourth email."] },
  ]},
  { number: 9, name: "Bookkeeping for a creator", summary: "A monthly record of income, costs, and what you still owe yourself.", audience: "Creators selling a few digital products or commissions.", tags: ["bookkeeping"], prices: [189, 15, 12, 14], sections: [
    { heading: "Separate the money", paragraphs: ["Use a separate account. Transfer a wage to yourself on a date, instead of spending from the business account when you are tired. The wage can be small. The habit matters."], points: ["Separate account.", "A transfer date.", "Keep the personal spending out."] },
    { heading: "The three lists", paragraphs: ["Income that has arrived. Invoices that have not. Costs of making the work. A sale that is not in the bank is not income yet in this simple system."], points: ["Paid income.", "Unpaid invoices.", "Costs with receipts."] },
    { heading: "Monthly close", paragraphs: ["Match the bank export to the lists. The unexplained lines are the work. Write what they were while you remember. Future you will not."], points: ["Export on the first.", "Mark unexplained lines.", "File the receipts."] },
    { heading: "When to get help", paragraphs: ["Get help when you register for VAT, hire someone, or cannot explain the bank. This guide is the habit before that, not a replacement for an accountant."], points: ["VAT is a different set of rules.", "Payroll is a different set of rules.", "Ask before you guess a deduction."] },
  ]},
  { number: 10, name: "Choose a small tech stack", summary: "Pick tools for a small product without collecting a platform for every job.", audience: "Founders about to build a simple web product.", tags: ["software"], prices: [199, 16, 12, 14], sections: [
    { heading: "The jobs", paragraphs: ["List the jobs: page, accounts, data, payments, email, files. A tool can cover more than one. A job with no tool is a gap. A tool with no job is a subscription you will forget."], points: ["Write the jobs.", "Write the tool for each.", "Cross out a tool with no job."] },
    { heading: "Boring on purpose", paragraphs: ["Choose a database, a framework, and a host you can hire for. Novelty is expensive when you are the only developer. Write down what you already know how to run."], points: ["One database.", "One host.", "A person you could hire who knows it."] },
    { heading: "Payments and files", paragraphs: ["Do not store cards. Use a provider. Do not put private downloads in a public folder. Those two decisions cause more pain than the colour of the dashboard."], points: ["A payment provider.", "Private file storage.", "No card numbers in your database."] },
    { heading: "A review date", paragraphs: ["Write a date in six months to ask whether each tool earned its place. Until then, do not add another because a talk was exciting."], points: ["Six-month review.", "No new tool without a job.", "Write the cost next to the tool."] },
  ]},
  { number: 11, name: "Accessibility basics for a small site", summary: "A practical pass over a small website: headings, contrast, forms, and keyboard use.", audience: "People shipping a small site who are not accessibility specialists.", tags: ["accessibility"], prices: [189, 15, 12, 14], sections: [
    { heading: "Headings and names", paragraphs: ["The page title and the first heading should say where the person is. Buttons should say what they do. 'Click here' does not. Images that carry meaning need a text alternative. Decorative images do not."], points: ["One clear page title.", "Buttons named as actions.", "Text alternatives for meaningful images."] },
    { heading: "Colour", paragraphs: ["Do not use colour as the only signal. A red error also needs words. Check the contrast of body text on the background. Pale grey on cream fails people, including you in sunlight."], points: ["Errors in words.", "Body text dark enough.", "Links visible without relying on colour alone."] },
    { heading: "Keyboard", paragraphs: ["Tab through the page. You should see where you are, reach every control, and not get trapped. A menu that only opens on hover fails this test."], points: ["Visible focus.", "Every control reachable.", "Escape closes a dialog."] },
    { heading: "Forms", paragraphs: ["Every field has a label that is connected to it, not only a placeholder. Errors say which field and how to fix it. Required fields are marked in text."], points: ["Labels, not only placeholders.", "Specific errors.", "Required marked in text."] },
  ]},
  { number: 12, name: "Freelance negotiation scripts", summary: "Sentences for scope, price, and a late invoice.", audience: "Freelancers who go blank when a client pushes.", tags: ["negotiation"], prices: [179, 14, 11, 13], sections: [
    { heading: "When they ask for more", paragraphs: ["'I can add that. It is outside the current price, so I will send a small extra before I start.' Then stop talking. Do not apologise for the boundary."], points: ["Name that it is extra.", "Do not start the extra yet.", "Send the number in writing."] },
    { heading: "When they want it cheaper", paragraphs: ["'I can reduce the price by removing the second revision and the extra page.' Offer a smaller scope. Do not invent a discount with the same scope unless you have a reason you can say."], points: ["Remove work.", "Say what was removed.", "Keep the written scope."] },
    { heading: "When the invoice is late", paragraphs: ["'Invoice 16 for R7,200 was due on 2 October. Please confirm the payment date this week.' Send it to the person who can pay. Be specific. Do not write a story about your rent."], points: ["Number, amount, date.", "One request.", "A follow-up date."] },
    { heading: "When you should walk", paragraphs: ["If they refuse a written scope, refuse a deposit, or ask you to copy someone else's work, the script is a no. A polite no is a complete sentence."], points: ["Written scope or no.", "Deposit or no.", "No copied work."] },
  ]},
  { number: 13, name: "Time blocking for operators", summary: "Put the week's real work on a calendar before the week fills with chat.", audience: "Owners who end the week surprised by what they did not do.", tags: ["time"], prices: [159, 12, 10, 11], sections: [
    { heading: "Three kinds of time", paragraphs: ["Delivery, sales, and admin. If you do not block them, delivery eats the week and invoices go out late. Block them before you accept another meeting."], points: ["One delivery block.", "One sales block.", "One admin block."] },
    { heading: "How long", paragraphs: ["Start with ninety minutes. A four-hour fantasy block will be broken and then you will say the method failed. Protect the ninety minutes as a meeting with yourself."], points: ["Ninety minutes.", "A name on the block.", "Notifications off."] },
    { heading: "Meetings", paragraphs: ["Cluster meetings on two days if you can. A thirty-minute meeting in the middle of a delivery block costs the whole block. Say so when you decline."], points: ["Cluster them.", "Decline one this week.", "Give a reason."] },
    { heading: "Friday look", paragraphs: ["On Friday, look at the blocks you missed. Do not scold yourself. Move the work or drop it. A block you miss every week is a lie. Delete it."], points: ["Which block was a lie.", "Move or delete.", "One change for next week."] },
  ]},
  { number: 14, name: "A simple referral ask", summary: "Ask customers for a referral without a gimmick.", audience: "Service businesses with happy customers and no system for asking.", tags: ["referrals"], prices: [159, 12, 10, 11], sections: [
    { heading: "Who to ask", paragraphs: ["Ask someone who has finished a job and said it went well. Do not ask in the middle of a revision. Do not ask everyone. Ask the people you would be proud to clone."], points: ["Job finished.", "They were pleased.", "You would like another client like them."] },
    { heading: "The ask", paragraphs: ["'If you know another bakery that needs this, I would like an introduction. I will treat them as well as I treated you.' Name the kind of business. A vague 'anyone' gets no one."], points: ["Name the kind of customer.", "Offer to make the introduction easy.", "Do not offer a bribe you cannot explain."] },
    { heading: "Make it easy", paragraphs: ["Send a two-line description they can forward. Do not attach a ten-page deck. Tell them you will follow up yourself so they are not responsible for the sale."], points: ["Two lines.", "They are not the salesperson.", "You do the follow-up."] },
    { heading: "Thank them", paragraphs: ["When a referral arrives, thank the person whether or not it becomes work. Tell them the outcome if the new client agrees. Do not vanish."], points: ["Thank them the same week.", "Share the outcome if you may.", "Keep a list so you notice who refers."] },
  ]},
  { number: 15, name: "Design a productised service", summary: "Turn custom work into one offer with a fixed scope and a name.", audience: "Freelancers who keep reinventing the project.", tags: ["services"], prices: [199, 16, 12, 14], sections: [
    { heading: "Pick the repeated job", paragraphs: ["Look at the last ten projects. Find the slice you did every time. That slice is the candidate. The custom edges stay custom, or they stay out."], points: ["Last ten projects.", "The repeated slice.", "The edges you will refuse."] },
    { heading: "Name and boundary", paragraphs: ["Give it a plain name. Write what is included in a list a buyer can count. Write the time it takes you. If you cannot count the list, it is not productised yet."], points: ["A name.", "A counted list.", "A duration."] },
    { heading: "The first buyers", paragraphs: ["Offer it to three past clients before you build a brand around it. Their questions are the sales page. Do not hide it behind a waitlist."], points: ["Three past clients.", "Write down their questions.", "Change the list, not the logo."] },
    { heading: "Keep it still", paragraphs: ["Do not add a feature every time one buyer asks. Write the request down. Review the offer monthly. Stability is the product."], points: ["A request list.", "A monthly review.", "No silent scope growth."] },
  ]},
  { number: 16, name: "Hire a first contractor", summary: "Brief, pay, and review a contractor without pretending they are staff.", audience: "Owners hiring help for the first time.", tags: ["hiring"], prices: [189, 15, 12, 14], sections: [
    { heading: "The brief", paragraphs: ["Write the outcome, the files they will receive, the date, and how you will judge the work. A brief that says 'make it pop' is a dispute waiting."], points: ["Outcome.", "Files and access.", "Date and the definition of done."] },
    { heading: "The trial", paragraphs: ["Start with a paid piece of work that is real but small. An unpaid test is a bad signal and a bad sample. Pay the trial even if you do not continue."], points: ["Paid.", "Small.", "Real work."] },
    { heading: "Access", paragraphs: ["Give access to the files they need, not to every account you own. Remove access when the job ends. Do not share a password by chat if you can avoid it."], points: ["Least access.", "Remove it after.", "No shared password in chat."] },
    { heading: "The review", paragraphs: ["When the work arrives, compare it to the brief. Ask for the change that the brief supports. A new idea is a new brief, not a free revision."], points: ["Compare to the brief.", "One revision if you agreed one.", "New ideas are new work."] },
  ]},
  { number: 17, name: "Backup habits for a small business", summary: "Keep a copy of the files and the records that would hurt to lose.", audience: "Owners whose business lives in one laptop.", tags: ["backups"], prices: [169, 13, 10, 12], sections: [
    { heading: "What to copy", paragraphs: ["Customer files, invoices, the site, and the password manager export process your tool recommends. A laptop is not a backup. A folder on the same laptop is not a backup."], points: ["Invoices.", "Client files.", "The site or the product files."] },
    { heading: "Where", paragraphs: ["One copy in a cloud drive and one copy on a drive that is not always plugged in. Test that you can open a file from the copy. An untested backup is a rumour."], points: ["Two places.", "One of them offline.", "Open a file from the copy."] },
    { heading: "How often", paragraphs: ["Invoices and client work: weekly. A product you are editing: daily while you edit. Put the reminder on the calendar you already use."], points: ["Weekly for records.", "Daily while editing.", "A calendar reminder."] },
    { heading: "If the laptop dies", paragraphs: ["Write, on paper or in the password manager, how to reach the backup and the domain registrar. If only you know, the business stops when you are unavailable."], points: ["Who else can get in.", "Where the backup is.", "The registrar and the host."] },
  ]},
  { number: 18, name: "A brand voice page", summary: "One page that tells a writer what you sound like, with examples.", audience: "Small businesses who have more than one person writing.", tags: ["brand"], prices: [159, 12, 10, 11], sections: [
    { heading: "Three lines", paragraphs: ["Write who you are talking to, what you will not claim, and one sentence that sounds like you. If you cannot read that sentence aloud, it is an advertisement, not a voice."], points: ["The reader.", "Claims you refuse.", "One true sentence."] },
    { heading: "Examples", paragraphs: ["Give a before and after. Before: 'We leverage cutting-edge solutions.' After: 'We build the booking page and the email that follows.' The after is the voice. Collect five of these from real work."], points: ["Five befores and afters.", "Taken from real sentences.", "No word list of fifty adjectives."] },
    { heading: "Words you avoid", paragraphs: ["List the words that make you sound like someone else. For many small firms that list includes 'passionate', 'world-class', and 'synergy'. Add the ones your customers do not say."], points: ["A short avoid list.", "Words your customers do use.", "No thesaurus exercise."] },
    { heading: "Use it", paragraphs: ["Put the page where the next email will be written. Review one email a month against it. A voice document nobody opens is decoration."], points: ["Next to the writing.", "One email a month.", "Update an example when you find a better one."] },
  ]},
  { number: 19, name: "Run a paid workshop", summary: "Plan, price, and deliver a half-day workshop to a small group.", audience: "Practitioners turning a skill into a paid session.", tags: ["workshops"], prices: [199, 16, 12, 14], sections: [
    { heading: "The promise", paragraphs: ["Write what the person will make by the end. A half day that 'explores' a topic is a talk. A workshop produces a draft, a sheet, or a decision."], points: ["A thing they leave with.", "The skill required to start.", "The number of people."] },
    { heading: "The room", paragraphs: ["Eight to sixteen people is enough for a first paid session. More than that and you cannot see the work. Online or in a room, plan how they will show you the draft."], points: ["A cap.", "A way to see the work.", "Breaks in the plan."] },
    { heading: "Price and cancel", paragraphs: ["Price it so that eight people pay for your day, including preparation. Write the cancel date. If you do not reach the minimum, you cancel on that date and refund. Do not slide the date in secret."], points: ["A minimum.", "A cancel date.", "A refund rule."] },
    { heading: "After", paragraphs: ["Send the files the same day. Ask one question: what will you use first? Their answers are the next session, or the reason not to run one."], points: ["Files the same day.", "One question.", "Write down the answers."] },
  ]},
  { number: 20, name: "Quarterly review for a small firm", summary: "Look at the last quarter's sales, delivery, and cash without a strategy offsite.", audience: "Owners of a small firm who have the numbers and avoid looking at them.", tags: ["review"], prices: [189, 15, 12, 14], sections: [
    { heading: "The numbers you need", paragraphs: ["Invoices issued, invoices paid, costs, and the work that slipped. If you cannot get those four, the review is a conversation about feelings. Get the numbers first."], points: ["Issued.", "Paid.", "Costs.", "Slipped work."] },
    { heading: "What repeated", paragraphs: ["Which offer sold, which client type paid late, and which job always overran. One example is a story. Three examples are a pattern."], points: ["The offer that sold.", "The late payer pattern.", "The overrun."] },
    { heading: "One change", paragraphs: ["Pick one change for the next quarter. A price, a scope boundary, or a client you will not take again. Write it as a sentence you can check in ninety days."], points: ["One change.", "A sentence.", "A date to check."] },
    { heading: "What you will not do", paragraphs: ["You will not rewrite the brand, hire three people, and launch a course in the same quarter because the review felt ambitious. Ambition without a number is a mood."], points: ["Write the not-doing list.", "Share it with the person who would otherwise start the extra project.", "Look again in ninety days."] },
  ]},
];

export async function ebookProducts(): Promise<ProductDefinition[]> {
  const products: ProductDefinition[] = [];
  for (const book of books) {
    const product = meta(book);
    const guide = doc(book);
    products.push({
      meta: product,
      checks: [],
      chart: [{ label: "Sections", value: book.sections.length }],
      files: [
        { path: "guide.md", body: textFile(renderMarkdown(guide)) },
        { path: "guide.pdf", body: await renderPdf(guide, product) },
        { path: "guide.docx", body: await renderDocx(guide, product) },
      ],
    });
  }
  return products;
}
