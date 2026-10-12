import { renderDocx, renderPdf, renderMarkdown, textFile } from "../render";
import { money, slugify, type Doc, type ProductDefinition, type ProductMeta } from "../types";

const disclaimer = "The employment history in this file is fictional sample text. Replace every line before you send it. This kit does not guarantee interviews.";

type Role = {
  number: number;
  name: string;
  summary: string;
  audience: string;
  target: string;
  profile: string;
  roles: { title: string; org: string; dates: string; bullets: string[] }[];
  skills: string[];
  proof: string[];
};

function meta(role: Role): ProductMeta {
  return {
    id: `CV-${String(role.number).padStart(3, "0")}`,
    slug: slugify(role.name),
    name: role.name,
    category: "cv",
    categorySlug: "cv-kits",
    categoryLabel: "CV kits",
    productType: "DOCX CV, PDF guide, and Markdown",
    audience: role.audience,
    version: "1.0.0",
    licence: "personal",
    summary: role.summary,
    description: `${role.summary} The sample person is fictional. The guide tells you which lines to replace and what evidence to keep.`,
    benefits: ["A CV structure aimed at one kind of role", "Sample bullets that show evidence, which you replace", "A checklist for the send"],
    compatibility: ["Microsoft Word or Google Docs", "Any PDF reader for the guide"],
    tags: ["cv", role.target],
    prices: money(189, 15, 12, 14),
    disclaimer,
  };
}

const roles: Role[] = [
  { number: 1, name: "Software engineer CV kit", summary: "A one-page structure for an engineer who ships features, with sample bullets you replace.", audience: "Software engineers applying to product teams.", target: "engineer", profile: "Engineer who has shipped a booking flow and a payment reconciliation job.", roles: [
    { title: "Software engineer", org: "Sample Studio", dates: "2023-2026", bullets: ["Shipped the booking confirmation email and cut duplicate bookings from 14 a week to 2.", "Added tests around the refund total so a partial refund could not exceed the order."] },
    { title: "Junior engineer", org: "Sample Agency", dates: "2021-2023", bullets: ["Rebuilt the contact form so failed sends were logged instead of lost."] },
  ], skills: ["TypeScript", "SQL", "Tests"], proof: ["Link a repository or a description of a system you can talk about.", "Do not list a tool you have not used in the last two years."] },
  { number: 2, name: "Graduate CV kit", summary: "A graduate CV that leads with projects and vacation work, not an empty career summary.", audience: "New graduates in South Africa applying for a first role.", target: "graduate", profile: "A graduate with one vacation job and two university projects.", roles: [
    { title: "Vacation analyst", org: "Sample retailer", dates: "Nov 2025-Jan 2026", bullets: ["Reconciled three store tills for the December week and wrote the two differences down."] },
    { title: "Final-year project", org: "Sample university", dates: "2025", bullets: ["Built a stock-count sheet for a student market and tested it on two Saturdays."] },
  ], skills: ["Spreadsheets", "Writing", "The degree name"], proof: ["Name the degree, the institution, and the year.", "A project with a result beats a list of modules."] },
  { number: 3, name: "Career-change CV kit", summary: "A CV that explains the move without apologising for the old career.", audience: "People moving into operations or coordination from another field.", target: "career change", profile: "A teacher moving into customer operations.", roles: [
    { title: "Grade lead", org: "Sample school", dates: "2018-2026", bullets: ["Ran the weekly parent communication for 90 families and kept the record of who had replied.", "Built the exam-week timetable so two venues were not double-booked."] },
  ], skills: ["Scheduling", "Written updates", "Calm follow-up"], proof: ["Translate the old work into the new job's tasks.", "Put the target role in the heading, not a vague 'seeking opportunities'."] },
  { number: 4, name: "Operations manager CV kit", summary: "A CV for someone who runs the week: handovers, suppliers, and numbers.", audience: "Operations managers.", target: "operations", profile: "An operations manager for a 12-person service firm.", roles: [
    { title: "Operations manager", org: "Sample firm", dates: "2022-2026", bullets: ["Introduced a Friday cash check. Unpaid invoices older than 30 days fell from 18 to 7 over two quarters.", "Wrote the contractor brief so access ended when the job ended."] },
  ], skills: ["Cash tracking", "Supplier follow-up", "Hiring briefs"], proof: ["Use a before and after you can defend.", "Do not claim a team size you did not have."] },
  { number: 5, name: "Studio coordinator CV kit", summary: "A CV for coordinating shoots, clients, and files.", audience: "Coordinators in photo, film, or design studios.", target: "coordinator", profile: "A coordinator who keeps the call sheet and the invoice.", roles: [
    { title: "Studio coordinator", org: "Northlight sample", dates: "2023-2026", bullets: ["Ran the call sheet for 40 shoot days and cut the 'where is the location' message by sending it the night before.", "Matched invoices to shot lists so a reshoot was billed as a reshoot."] },
  ], skills: ["Call sheets", "Invoicing", "Client email"], proof: ["Name the volume: days, clients, or files.", "Keep the design credits honest."] },
  { number: 6, name: "Retail supervisor CV kit", summary: "A CV for a shop supervisor: rota, cash, and the floor.", audience: "Supervisors applying to larger stores.", target: "retail", profile: "A supervisor of a six-person shop floor.", roles: [
    { title: "Supervisor", org: "Sample home store", dates: "2021-2026", bullets: ["Wrote the Sunday close so the float matched. Variances over R50 dropped to rare.", "Built the Saturday rota around the delivery window instead of around preference."] },
  ], skills: ["Float checks", "Rotas", "Complaints"], proof: ["Cash figures only if you can explain them.", "Name the team size."] },
  { number: 7, name: "Teacher CV kit", summary: "A teaching CV that names the class, the subject, and one change you made.", audience: "Teachers applying for a new post.", target: "teacher", profile: "A high-school teacher of business studies.", roles: [
    { title: "Business studies teacher", org: "Sample high school", dates: "2019-2026", bullets: ["Taught grades 10 to 12. Replaced the unmarked group project with a one-page plan that every learner submitted.", "Ran the grade's parent evening notes so absentees got the same three points."] },
  ], skills: ["Business studies", "Assessment", "Parent communication"], proof: ["Do not claim results you cannot show a head of department.", "Name the grades."] },
  { number: 8, name: "Clinic administrator CV kit", summary: "A CV for front-desk administration. No patient stories.", audience: "Administrators in clinics or practices.", target: "administration", profile: "A clinic administrator handling bookings and invoices.", roles: [
    { title: "Clinic administrator", org: "Sample rooms", dates: "2020-2026", bullets: ["Moved reminders to the morning before. Missed sessions fell from about 8 a week to about 3.", "Separated the invoice list from the clinical notes so the bookkeeper did not see notes."] },
  ], skills: ["Bookings", "Invoicing", "Confidential files"], proof: ["Do not include patient names or conditions.", "Numbers of sessions are fine if they are true."] },
  { number: 9, name: "Sales CV kit", summary: "A sales CV with quota only if you state the period and the number.", audience: "Business-to-business salespeople.", target: "sales", profile: "A salesperson selling retainers to small firms.", roles: [
    { title: "Account executive", org: "Sample agency", dates: "2022-2026", bullets: ["Closed 14 retainers in the 2025 financial year against a target of 12. Average fee R8,000 a month.", "Wrote the follow-up so a proposal older than 10 days had a date or was closed."] },
  ], skills: ["Proposals", "Follow-up", "Retainers"], proof: ["If you quote a target, quote the period.", "Do not invent a percentage."] },
  { number: 10, name: "Data analyst CV kit", summary: "A CV that names the decision the analysis changed.", audience: "Analysts applying with spreadsheet and SQL work.", target: "analyst", profile: "An analyst in a retailer.", roles: [
    { title: "Analyst", org: "Sample retail group", dates: "2022-2026", bullets: ["Showed that the Woodstock refunds were a sizing issue, not a courier issue. The buyer changed the size guide.", "Documented the sales extract so a new analyst could rebuild the monthly total."] },
  ], skills: ["SQL", "Spreadsheets", "Written findings"], proof: ["Name the decision, not the tool.", "Do not attach confidential data."] },
  { number: 11, name: "Cover letter set", summary: "Five short letter shapes: application, referral, follow-up, after a task, and a no-thanks to an offer.", audience: "Applicants who freeze at the letter.", target: "letters", profile: "Letters for an operations application. The facts are samples.", roles: [
    { title: "Application letter", org: "Sample", dates: "Send with the CV", bullets: ["Name the role and where you saw it.", "One proof from the CV.", "Ask for the next step."] },
    { title: "Referral letter", org: "Sample", dates: "When someone introduced you", bullets: ["Name the person who introduced you.", "Say you have written to them.", "Do not make them responsible for the hire."] },
  ], skills: ["Short paragraphs", "One proof", "A clear ask"], proof: ["Half a page is enough.", "Do not repeat the whole CV."] },
  { number: 12, name: "LinkedIn about worksheet", summary: "A worksheet for the About section: who you help, proof, and what you want next.", audience: "People rewriting a profile that currently lists adjectives.", target: "profile", profile: "An about section for a bookkeeper serving cafes.", roles: [
    { title: "About draft", org: "Sample", dates: "Now", bullets: ["I close the month for independent cafes.", "Last year I moved three of them from a shoebox of slips to a monthly export.", "I am looking for two more cafes in Cape Town."] },
  ], skills: ["One reader", "One proof", "One ask"], proof: ["If you cannot prove the sentence, cut it.", "Do not keyword-stuff."] },
  { number: 13, name: "Interview story bank", summary: "A bank of STAR stories: situation, task, action, result.", audience: "Candidates preparing for behavioural interviews.", target: "interviews", profile: "Stories for an operations interview.", roles: [
    { title: "A late invoice process", org: "Sample firm", dates: "2025", bullets: ["Situation: invoices older than 45 days.", "Action: a Friday list and one owner.", "Result: the count fell. You must insert your real count."] },
    { title: "A missed handover", org: "Sample firm", dates: "2024", bullets: ["Situation: a contractor still had access.", "Action: an end date on the brief.", "Result: access was removed the day the invoice was paid."] },
  ], skills: ["Situation", "Action", "Result"], proof: ["Write the result you can say out loud.", "A story without a result is an anecdote."] },
  { number: 14, name: "Salary research worksheet", summary: "A worksheet for gathering ranges before you talk about pay. It does not contain a salary survey.", audience: "Candidates preparing a pay conversation.", target: "salary", profile: "A method, not a number.", roles: [
    { title: "Sources to collect", org: "Your notes", dates: "Before the conversation", bullets: ["Three public adverts for the same role and city, with the date you saw them.", "One conversation with a recruiter, written as a range if they gave one.", "Your minimum monthly cost, from your own budget, not from a forum."] },
  ], skills: ["Advert date", "City", "Your floor"], proof: ["Do not invent a market rate.", "Write the number you will not go below and why."] },
  { number: 15, name: "Reference tracker", summary: "Track who may be a reference, what they can speak to, and whether you have asked.", audience: "Applicants who need two or three references.", target: "references", profile: "A tracker, not the reference letter itself.", roles: [
    { title: "How to ask", org: "Sample", dates: "Before you list them", bullets: ["Ask before you write their name.", "Tell them the role.", "Tell them which piece of work you hope they will describe."] },
  ], skills: ["Asked", "Role", "Which work"], proof: ["A person who has not agreed is not a reference.", "Do not include their personal phone in a file you might forward by mistake. Ask how they want to be contacted."] },
  { number: 16, name: "Thirty-day search plan", summary: "A 30-day plan: roles, conversations, and a weekly review.", audience: "People searching alongside a job or studies.", target: "search plan", profile: "Thirty days, not a mood board.", roles: [
    { title: "Weekly shape", org: "Your calendar", dates: "Four weeks", bullets: ["Ten targeted applications, not fifty clicks.", "Two conversations with people who do the work.", "Friday: which source produced a reply."] },
  ], skills: ["A list", "A weekly review", "A stop-doing"], proof: ["Count replies, not applications alone.", "Drop a source that produces nothing after two weeks."] },
  { number: 17, name: "Portfolio case-study page", summary: "A one-page case study: problem, what you did, what changed.", audience: "Designers and analysts who need a written case, not only images.", target: "portfolio", profile: "A sample case about a bakery website.", roles: [
    { title: "North Station sample", org: "Fictional", dates: "2025", bullets: ["Problem: orders arrived by phone during service.", "Work: a one-page menu and an order form.", "Change: write your real change. The sample does not invent a percentage."] },
  ], skills: ["Problem", "Your work", "Change"], proof: ["Get permission before you name the client.", "If you cannot name them, describe the category."] },
  { number: 18, name: "Freelance proposal and CV", summary: "A short CV plus a one-page proposal structure for a freelance pitch.", audience: "Freelancers who are asked for a CV and a price in the same email.", target: "freelance", profile: "A designer pitching a fixed menu-page project.", roles: [
    { title: "Relevant work", org: "Sample", dates: "2024-2026", bullets: ["Three hospitality clients. One named only if you may.", "A fixed price for a one-page menu site, in the proposal, not hidden."] },
  ], skills: ["Relevant work only", "A price", "A boundary"], proof: ["The CV is half a page.", "The proposal names what is not included."] },
  { number: 19, name: "Internship application kit", summary: "An internship CV and the email that asks for a specific team.", audience: "Students applying for internships.", target: "internship", profile: "A student asking a studio for a winter internship.", roles: [
    { title: "What to show", org: "University and one job", dates: "Now", bullets: ["One project with your part named.", "The months you can work.", "The team you want, not 'any opportunity'."] },
  ], skills: ["Dates you can work", "A project", "A team"], proof: ["Say if it is a requirement of your course.", "Do not offer to work unpaid if you cannot afford to. Say the question plainly."] },
  { number: 20, name: "Return-to-work CV kit", summary: "A CV for someone returning after a break, with the break stated once and the recent proof stated clearly.", audience: "People returning to paid work after caregiving, study, or illness.", target: "return to work", profile: "A coordinator returning after three years.", roles: [
    { title: "Coordinator", org: "Sample nonprofit", dates: "2016-2022", bullets: ["Ran the volunteer rota for weekend markets.", "The break, 2022-2025, is one line: caregiving. No further detail unless you want to give it."] },
    { title: "Recent proof", org: "A short contract", dates: "2026", bullets: ["A six-week contract updating a donor spreadsheet. Name what you updated."] },
  ], skills: ["The old skill", "The recent proof", "The role you want"], proof: ["You do not owe a medical story.", "A recent small piece of work is enough to show currency."] },
];

function cvDocument(role: Role): Doc {
  return {
    title: role.name.replace(" kit", ""),
    kicker: "Sample content. Replace every fact before you send this.",
    blocks: [
      { kind: "p", text: role.profile },
      { kind: "h", text: "Experience" },
      ...role.roles.flatMap((job) => [
        { kind: "h" as const, text: `${job.title} · ${job.org} · ${job.dates}` },
        { kind: "ul" as const, items: job.bullets },
      ]),
      { kind: "h", text: "Skills to tailor" },
      { kind: "ul", items: role.skills },
      { kind: "note", text: disclaimer },
    ],
  };
}

function guide(role: Role): Doc {
  return {
    title: `How to finish the ${role.name}`,
    blocks: [
      { kind: "p", text: role.summary },
      { kind: "h", text: "Replace the sample" },
      { kind: "ol", items: ["Put your name and city in the heading. A full street address is unnecessary.", "Replace each role with yours. Keep the shape: action and result.", "Delete a skill you cannot discuss for five minutes.", ...role.proof] },
      { kind: "h", text: "Before you send" },
      { kind: "ul", items: ["The file name is YourName-Role.pdf.", "A person who does not know you can see the target role in the first three lines.", "You can defend every number in an interview."] },
      { kind: "note", text: disclaimer },
    ],
  };
}

export async function cvProducts(): Promise<ProductDefinition[]> {
  const products: ProductDefinition[] = [];
  for (const role of roles) {
    const product = meta(role);
    const cv = cvDocument(role);
    const how = guide(role);
    products.push({
      meta: product,
      checks: [],
      chart: [{ label: "Roles", value: role.roles.length }, { label: "Proof", value: role.proof.length }],
      files: [
        { path: "sample-cv.docx", body: await renderDocx(cv, product) },
        { path: "sample-cv.md", body: textFile(renderMarkdown(cv)) },
        { path: "how-to-finish.pdf", body: await renderPdf(how, product) },
        { path: "how-to-finish.md", body: textFile(renderMarkdown(how)) },
      ],
    });
  }
  return products;
}
