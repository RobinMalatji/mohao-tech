import { contactSheet, renderArtboard, type Artboard } from "../design-svg";
import { renderPdf, textFile } from "../render";
import { renderMarkdown } from "../render";
import { money, slugify, type Doc, type ProductDefinition, type ProductMeta } from "../types";

const disclaimer = "Sample names and offers in these designs are fictional. Replace them before you publish. This package is not a native Canva file.";

type Kit = {
  number: number;
  name: string;
  summary: string;
  description: string;
  audience: string;
  tags: string[];
  prices: [number, number, number, number];
  boards: Artboard[];
  steps: string[];
};

function meta(kit: Kit): ProductMeta {
  return {
    id: `DSN-${String(kit.number).padStart(3, "0")}`,
    slug: slugify(kit.name),
    name: kit.name,
    category: "design",
    categorySlug: "design-templates",
    categoryLabel: "Design templates",
    productType: "SVG design kit with HTML preview",
    audience: kit.audience,
    version: "1.0.0",
    licence: "commercial-single",
    summary: kit.summary,
    description: kit.description,
    benefits: ["Finished sample layouts you can edit", "Pixel sizes written on the preview page", "Colours and type set in the SVG, not in a screenshot"],
    compatibility: [
      "SVG files upload into Canva, Figma, Illustrator, and Inkscape",
      "Preview HTML opens in a current browser",
      "This package does not include a .canva file or a Canva link",
    ],
    tags: kit.tags,
    prices: money(...kit.prices),
    disclaimer,
  };
}

const kits: Kit[] = [
  {
    number: 1,
    name: "Consultant discovery carousel",
    summary: "Three square slides for a consultant explaining a paid discovery session.",
    description: "A three-slide Instagram carousel for an independent consultant. The sample copy belongs to a fictional operations consultant, Naledi Mokoena, and walks a buyer from the problem to the session price.",
    audience: "Independent consultants who sell a fixed discovery session rather than an open-ended hourly pitch.",
    tags: ["instagram", "consulting", "carousel"],
    prices: [249, 19, 15, 17],
    steps: ["Duplicate the three SVGs and replace Naledi's name.", "Keep one idea on each slide: the mess, the session, the price.", "Export PNG from your editor if a channel rejects SVG."],
    boards: [
      { file: "slide-01-problem.svg", width: 1080, height: 1080, layout: "square", eyebrow: "Slide 01", title: "Your week is full of repeated decisions", lines: ["Naledi maps the five decisions your team keeps reopening."], footer: "Mokoena Operations", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
      { file: "slide-02-session.svg", width: 1080, height: 1080, layout: "square", eyebrow: "Slide 02", title: "A two-hour discovery, not a retainer pitch", lines: ["You leave with a written list of what to stop, keep, and assign."], footer: "Cape Town and remote", bg: "#0b0b0b", ink: "#f4f3ef", accent: "#ff6a1a", muted: "#d9d6ce" },
      { file: "slide-03-price.svg", width: 1080, height: 1080, layout: "square", eyebrow: "Slide 03", title: "R4,500 for the session", lines: ["Fixed price. One founder and one operator in the room."], footer: "Book via the link in the bio", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
  {
    number: 2,
    name: "Founder LinkedIn banner",
    summary: "A wide banner stating what a founder builds and who it is for.",
    description: "A 1584 by 396 banner for a fictional founder, Sam Patel, who builds booking tools for independent clinics. The line is specific enough to replace with your own offer.",
    audience: "Founders who need a banner that says what they sell, not only their name.",
    tags: ["linkedin", "banner", "founder"],
    prices: [179, 14, 11, 13],
    steps: ["Replace the product and the city.", "Check the banner at LinkedIn's display size after upload.", "Do not put a paragraph on this size."],
    boards: [
      { file: "linkedin-banner.svg", width: 1584, height: 396, layout: "banner", eyebrow: "Patel Studio", title: "Booking tools for clinics that still use WhatsApp", lines: ["Johannesburg. One product. No marketplace pitch."], footer: "sampatel.studio", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
  {
    number: 3,
    name: "Saturday kitchen menu",
    summary: "A printed-style menu board for a weekend kitchen with four dishes and prices in rand.",
    description: "A portrait menu for Harbour Smoke, a fictional Saturday kitchen. Four dishes, one drink, and a note about the last order. Prices are sample rand amounts.",
    audience: "Small kitchens, market stalls, and pop-up chefs who rewrite a short menu each week.",
    tags: ["menu", "food", "print"],
    prices: [219, 17, 13, 15],
    steps: ["Change dish names and prices each week.", "Keep the last-order line. Customers miss it when it is only spoken.", "Print from the SVG or export a PDF in your editor."],
    boards: [
      { file: "saturday-menu.svg", width: 1080, height: 1520, layout: "menu", eyebrow: "Harbour Smoke · Saturday", title: "Wood fire until 2pm", lines: ["Brisket roll R85", "Smoked mielies R25", "Charred cabbage R70", "Last plates at 1.40pm"], footer: "Salt River market, stall 12", bg: "#f7f1e8", ink: "#1c140f", accent: "#c4552a", muted: "#6b5346" },
    ],
  },
  {
    number: 4,
    name: "Interview podcast cover",
    summary: "A square cover for an interview show, with a guest line and episode number.",
    description: "Cover art for a fictional show, Desk Notes, episode 18 with guest Ayesha Khan on hiring a first contractor. The layout leaves a clear area for the guest name.",
    audience: "Interview podcast hosts who need a repeatable cover, not a new illustration every week.",
    tags: ["podcast", "cover"],
    prices: [199, 15, 12, 14],
    steps: ["Keep the show name in the same place every episode.", "Replace the guest and the episode number.", "Export a 3000 pixel PNG if your host asks for a larger file."],
    boards: [
      { file: "podcast-cover.svg", width: 1400, height: 1400, layout: "square", eyebrow: "Desk Notes · EP 18", title: "Ayesha Khan on the first contractor", lines: ["What to write down before you hire help."], footer: "A show about running a small studio", bg: "#111111", ink: "#f4f3ef", accent: "#ff6a1a", muted: "#c8c4bc" },
    ],
  },
  {
    number: 5,
    name: "Listing card for a flat",
    summary: "A square listing card with rent, bedrooms, and the one detail that matters.",
    description: "A listing card for a fictional two-bedroom flat in Observatory, Cape Town. The card leads with rent and the fact that the desk fits under the window. It is not a property advertisement you can publish as-is.",
    audience: "Independent agents and landlords who post a few listings a month and want a consistent card.",
    tags: ["property", "listing"],
    prices: [229, 18, 14, 16],
    steps: ["Replace the suburb, rent, and the single detail.", "Do not add more than one claim about the flat.", "Pair the card with your own photograph. This SVG is the type layout, not a photo of a home."],
    boards: [
      { file: "listing-card.svg", width: 1080, height: 1080, layout: "square", eyebrow: "Observatory · 2 bed", title: "R14,500 a month", lines: ["Desk under the street window. Available 1 November."], footer: "Viewing Saturday 10:30", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#0b0b0b", muted: "#5f5e58" },
    ],
  },
  {
    number: 6,
    name: "Workshop certificate",
    summary: "A landscape certificate for a one-day workshop, with the participant line left editable.",
    description: "A certificate for a fictional workshop, Writing a one-page brief, run by MOHAO's sample instructor line. The participant name is set as 'Participant name' so you can replace that one line.",
    audience: "Trainers who issue a simple certificate after a workshop and do not need a credential platform.",
    tags: ["certificate", "workshop"],
    prices: [189, 15, 12, 14],
    steps: ["Replace the participant name for each person, or overlay it in your editor.", "Change the date and the city.", "This certificate does not verify attendance. Say that if someone asks."],
    boards: [
      { file: "certificate.svg", width: 1600, height: 1100, layout: "certificate", eyebrow: "Certificate of attendance", title: "Participant name", lines: ["Completed Writing a one-page brief", "12 October 2026 · Johannesburg"], footer: "Sample instructor: Lerato Dlamini", bg: "#fbfaf7", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
  {
    number: 7,
    name: "YouTube thumbnail pair",
    summary: "Two thumbnails: one for a tutorial and one for a mistake to avoid.",
    description: "Two 1280 by 720 thumbnails for a fictional channel, Sheet Club, about spreadsheets for operators. One promises a cash-flow layout. The other names a common mistake. No faces are included, so you are not stuck with a stock person.",
    audience: "Tutorial channels that need readable thumbnails without a photo shoot.",
    tags: ["youtube", "thumbnail"],
    prices: [219, 17, 13, 15],
    steps: ["Keep the title under four short lines.", "Use the orange bar for the video that is a warning, and the light background for the how-to.", "Test the type at 320 pixels wide."],
    boards: [
      { file: "thumbnail-howto.svg", width: 1280, height: 720, layout: "thumbnail", eyebrow: "Sheet Club", title: "A cash-flow sheet in 20 minutes", lines: ["For a one-person shop"], footer: "Tutorial", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
      { file: "thumbnail-mistake.svg", width: 1280, height: 720, layout: "thumbnail", eyebrow: "Sheet Club", title: "Stop merging the cells", lines: ["Your totals will break"], footer: "Fix", bg: "#0b0b0b", ink: "#f4f3ef", accent: "#ff6a1a", muted: "#d9d6ce" },
    ],
  },
  {
    number: 8,
    name: "Studio price list",
    summary: "A price card for three fixed studio offers.",
    description: "A square price list for Northlight, a fictional photo studio. Three offers: a product set, a founder portrait, and a half-day. Prices are samples in rand.",
    audience: "Studios that sell fixed packages and are tired of answering 'what does it cost?' in DMs.",
    tags: ["price list", "studio"],
    prices: [199, 15, 12, 14],
    steps: ["Replace the three offers and the prices.", "Remove an offer rather than shrinking the type to fit a fourth.", "Put the booking rule in the footer."],
    boards: [
      { file: "price-list.svg", width: 1080, height: 1350, layout: "menu", eyebrow: "Northlight · 2026", title: "Three ways to book", lines: ["Product set R3,200", "Founder portrait R1,800", "Half-day R7,500", "Weekday mornings only"], footer: "Reply with the package name", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
  {
    number: 9,
    name: "Night-market poster",
    summary: "A story-sized poster for a Thursday night market with the hours and the entrance.",
    description: "A 1080 by 1920 story poster for the fictional Braamfontein Night Market. It states the date, the hours, and which gate to use. It does not list every stall.",
    audience: "Market organisers who need one poster that answers when and where.",
    tags: ["poster", "event", "story"],
    prices: [189, 15, 12, 14],
    steps: ["Change the date every time the market moves.", "Keep the gate instruction. People arrive at the wrong corner.", "Export a story PNG and a printed A3 from the same SVG."],
    boards: [
      { file: "night-market-story.svg", width: 1080, height: 1920, layout: "story", eyebrow: "Thursday 16 October", title: "Night market on Juta", lines: ["5pm to 10pm", "Use the Juta Street gate", "Cash and card at the food stalls"], footer: "Braamfontein", bg: "#141414", ink: "#f4f3ef", accent: "#ff6a1a", muted: "#c8c4bc" },
    ],
  },
  {
    number: 10,
    name: "Donation appeal card",
    summary: "A square appeal that names the amount and what it pays for.",
    description: "A donation card for a fictional library fund, Open Shelf. R350 buys a set of readers for one classroom. The card does not claim tax deductibility.",
    audience: "Small nonprofits writing a specific ask instead of a general 'support us' graphic.",
    tags: ["nonprofit", "donation"],
    prices: [179, 14, 11, 13],
    steps: ["Name the amount and the thing it buys.", "Remove any tax claim unless your organisation has written advice that it is true.", "Put the payment route in the caption, not crammed into the card."],
    boards: [
      { file: "donation-card.svg", width: 1080, height: 1080, layout: "square", eyebrow: "Open Shelf", title: "R350 fills one classroom box", lines: ["Twenty readers, one class, this term."], footer: "Sample appeal, not a tax receipt", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
  {
    number: 11,
    name: "Product launch announcement",
    summary: "A square announcement for a dated product release.",
    description: "Launch art for a fictional notebook, Field Notes for Foremen, releasing 3 November. The design is the announcement, not a mockup of the notebook.",
    audience: "Small product businesses announcing a date, not a vague coming-soon graphic.",
    tags: ["launch", "announcement"],
    prices: [199, 15, 12, 14],
    steps: ["Change the product name and the date.", "If the date slips, change the file. Do not post the old SVG.", "Pair it with a photograph of the real product when you have one."],
    boards: [
      { file: "launch-square.svg", width: 1080, height: 1080, layout: "square", eyebrow: "3 November", title: "Field notes for foremen", lines: ["A pocket book for site instructions. First print, 500 copies."], footer: "Orders open at 9am SAST", bg: "#efeae2", ink: "#1a1a1a", accent: "#ff6a1a", muted: "#5c564e" },
    ],
  },
  {
    number: 12,
    name: "Client quote cards",
    summary: "Two quote cards with the words a client actually might say, kept short.",
    description: "Two testimonial layouts for a fictional bookkeeper, Miles & Co. The quotes are written as samples. Replace them with words a real client has approved in writing.",
    audience: "Service businesses who have permission to quote a client and need a clean card.",
    tags: ["testimonial", "quote"],
    prices: [189, 15, 12, 14],
    steps: ["Do not publish a quote you do not have permission to use.", "Keep the quote under 30 words.", "Name the person the way they asked to be named."],
    boards: [
      { file: "quote-invoice.svg", width: 1080, height: 1080, layout: "square", eyebrow: "Client note", title: "I can see who still owes me", lines: ["Thandi N. · bakery owner"], footer: "Sample quote, replace before use", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
      { file: "quote-month.svg", width: 1080, height: 1080, layout: "square", eyebrow: "Client note", title: "Month-end takes a morning now", lines: ["Pieter V. · workshop"], footer: "Sample quote, replace before use", bg: "#0b0b0b", ink: "#f4f3ef", accent: "#ff6a1a", muted: "#d9d6ce" },
    ],
  },
  {
    number: 13,
    name: "Sale badge set",
    summary: "Three badges for a real sale rule: percent off, last pairs, and members only.",
    description: "Three small badges a clothing shop can place on a product image. The sample shop is Loom Room. Each badge states a different rule so they are not three versions of the same sticker.",
    audience: "Shops that need a few honest sale marks, not a sheet of empty starbursts.",
    tags: ["badge", "retail", "sale"],
    prices: [149, 12, 9, 11],
    steps: ["Use the badge that matches the actual rule.", "Remove the badge when the sale ends.", "Do not stack all three on one product."],
    boards: [
      { file: "badge-percent.svg", width: 800, height: 800, layout: "square", eyebrow: "Loom Room", title: "20% off coats", lines: ["This weekend"], footer: "In store", bg: "#ff6a1a", ink: "#0b0b0b", accent: "#0b0b0b", muted: "#1a1a1a" },
      { file: "badge-last.svg", width: 800, height: 800, layout: "square", eyebrow: "Loom Room", title: "Last three sizes", lines: ["Not restocking"], footer: "Check the label", bg: "#0b0b0b", ink: "#f4f3ef", accent: "#ff6a1a", muted: "#d9d6ce" },
      { file: "badge-members.svg", width: 800, height: 800, layout: "square", eyebrow: "Loom Room", title: "Members from Thursday", lines: ["Public on Saturday"], footer: "Mailing list", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
  {
    number: 14,
    name: "Case-study cover",
    summary: "A cover slide for a one-page case study with the result in the title.",
    description: "A 1920 by 1080 cover for a fictional case study: a bakery site that cut the phone orders. The result is in the title so the slide is not only a logo.",
    audience: "Studios writing case studies who want the outcome visible before the process.",
    tags: ["case study", "portfolio"],
    prices: [209, 16, 13, 15],
    steps: ["Lead with the result you can evidence.", "Put the client name in the eyebrow only if you may name them.", "Follow this cover with your own pages. The kit is the cover, not the whole case study."],
    boards: [
      { file: "case-study-cover.svg", width: 1920, height: 1080, layout: "banner", eyebrow: "Case study · North Station Cafe", title: "Phone orders down, form orders up", lines: ["A one-page menu site. Eight weeks after launch."], footer: "Sample result for the layout", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
  {
    number: 15,
    name: "Email header bar",
    summary: "A short header for a newsletter with the issue number and the single topic.",
    description: "A 1200 by 400 header for Issue 12 of a fictional letter, Monday Dispatch, about raising prices. It is an image, not an email template.",
    audience: "Writers who send a plain email and want one designed header image.",
    tags: ["email", "newsletter"],
    prices: [159, 12, 10, 11],
    steps: ["Change the issue number and the topic.", "Keep the image under a few hundred kilobytes when you export PNG.", "Do not put the unsubscribe link inside the image."],
    boards: [
      { file: "email-header.svg", width: 1200, height: 400, layout: "banner", eyebrow: "Monday Dispatch · Issue 12", title: "How to raise a price", lines: ["A letter for freelancers"], footer: "Sample header", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
  {
    number: 16,
    name: "Class schedule story",
    summary: "A story listing three class times for one week.",
    description: "A schedule for a fictional strength gym, Yard Strength. Three sessions, with the level written next to the time. It is for one week, so the dates are part of the design.",
    audience: "Gyms and studios posting the week's timetable to Instagram stories.",
    tags: ["fitness", "schedule", "story"],
    prices: [179, 14, 11, 13],
    steps: ["Replace the week dates every Sunday.", "Mark the level so a beginner does not book the heavy session.", "Remove a class that is full rather than writing 'maybe'."],
    boards: [
      { file: "class-schedule.svg", width: 1080, height: 1920, layout: "story", eyebrow: "13 to 17 October", title: "This week at Yard", lines: ["Mon 6am  ·  Beginner", "Wed 6pm  ·  Strength", "Sat 8am  ·  Open gym"], footer: "Book before 8pm the night before", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
  {
    number: 17,
    name: "Wedding invitation suite",
    summary: "An invitation and a separate RSVP card with a real reply date.",
    description: "Two cards for a fictional wedding, Leila and James, on 4 April 2027 in Stellenbosch. The RSVP card has its own date so guests are not guessing.",
    audience: "Couples or stationers who want a type-led invitation they can edit, not a floral illustration.",
    tags: ["wedding", "invitation"],
    prices: [279, 22, 17, 19],
    steps: ["Replace the names, place, and both dates.", "Keep the RSVP date earlier than the wedding.", "Print with a bleed added in your editor. The SVG is the design area."],
    boards: [
      { file: "invitation.svg", width: 1080, height: 1520, layout: "menu", eyebrow: "Stellenbosch", title: "Leila and James", lines: ["Sunday 4 April 2027", "Three o'clock", "The long barn"], footer: "Dinner follows", bg: "#f7f4ef", ink: "#221c16", accent: "#8c4a32", muted: "#6d645b" },
      { file: "rsvp.svg", width: 1080, height: 1080, layout: "square", eyebrow: "Please reply", title: "By 4 March", lines: ["One line for names. One line for dinner."], footer: "Reply to the address on the envelope", bg: "#f7f4ef", ink: "#221c16", accent: "#8c4a32", muted: "#6d645b" },
    ],
  },
  {
    number: 18,
    name: "Cafe loyalty card",
    summary: "A ten-stamp card with the reward written on it.",
    description: "A loyalty card for fictional Compass Coffee. Ten stamps, and the tenth coffee is the reward. The terms are one line: one stamp per visit, not per cup in the same order.",
    audience: "Cafes that want a printable card instead of an app.",
    tags: ["cafe", "loyalty"],
    prices: [149, 12, 9, 11],
    steps: ["Change the reward if you are not giving a coffee.", "Print on card and cut. The SVG includes ten empty circles as the stamp row in the line text.", "Tell staff the one-stamp rule so the card matches the counter."],
    boards: [
      { file: "loyalty-card.svg", width: 1600, height: 900, layout: "banner", eyebrow: "Compass Coffee", title: "The tenth coffee is ours", lines: ["One stamp per visit. Not one stamp per cup."], footer: "Sample card", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
  {
    number: 19,
    name: "Job-open story",
    summary: "A hiring story that names the role, the city, and the close date.",
    description: "A story for a fictional studio hiring a junior designer in Durban. Applications close on a date. There is no 'competitive salary' line, because that says nothing.",
    audience: "Small teams hiring one role and posting it themselves.",
    tags: ["hiring", "story"],
    prices: [169, 13, 10, 12],
    steps: ["Name the role, the city, and the close date.", "Put the apply path in the caption.", "Take the story down when the date passes."],
    boards: [
      { file: "job-story.svg", width: 1080, height: 1920, layout: "story", eyebrow: "Durban · closes 31 October", title: "Junior designer", lines: ["Two years of client work or a strong portfolio.", "On site three days a week."], footer: "Apply with three projects", bg: "#0b0b0b", ink: "#f4f3ef", accent: "#ff6a1a", muted: "#d9d6ce" },
    ],
  },
  {
    number: 20,
    name: "Webinar registration card",
    summary: "A square card with the webinar time in South African time and the one thing attendees leave with.",
    description: "A registration card for a fictional webinar on writing a project brief, 21 October 2026 at 18:00 SAST. The promise is a one-page brief template, which you would attach separately.",
    audience: "Trainers promoting a single live session with a specific takeaway.",
    tags: ["webinar", "registration"],
    prices: [189, 15, 12, 14],
    steps: ["Write the time with the zone.", "State the takeaway in one line.", "Update or remove the card if you change the time."],
    boards: [
      { file: "webinar-card.svg", width: 1080, height: 1080, layout: "square", eyebrow: "21 October · 18:00 SAST", title: "Write the brief before the meeting", lines: ["A 45-minute session. You leave with a one-page structure."], footer: "Sample session", bg: "#f4f3ef", ink: "#0b0b0b", accent: "#ff6a1a", muted: "#5f5e58" },
    ],
  },
];

function specDoc(kit: Kit): Doc {
  return {
    title: kit.name,
    kicker: "SVG files you can upload. Not a native Canva template.",
    blocks: [
      { kind: "p", text: kit.description },
      { kind: "h", text: "Files and sizes" },
      { kind: "table", headers: ["File", "Pixels"], rows: kit.boards.map((board) => [board.file, `${board.width} x ${board.height}`]) },
      { kind: "h", text: "How to edit" },
      { kind: "ol", items: kit.steps },
      { kind: "h", text: "Canva, Figma, and print" },
      { kind: "p", text: "Create a design at the pixel size in the table, then upload the SVG. In Canva this is an upload, not a brand template from Canva's library. In Figma, place the SVG and edit the text layers. For print, add bleed in the editor. The SVG is the design area." },
      { kind: "note", text: disclaimer },
    ],
  };
}

export async function designProducts(): Promise<ProductDefinition[]> {
  const products: ProductDefinition[] = [];
  for (const kit of kits) {
    const productMeta = meta(kit);
    const boards: Artboard[] = kit.boards.map((board) => ({ ...board }));
    const doc = specDoc(kit);
    const files = [
      ...boards.map((board) => ({ path: `designs/${board.file}`, body: textFile(renderArtboard(board)) })),
      { path: "designs/preview.html", body: textFile(contactSheet(kit.name, boards)) },
      { path: "designs/palette.json", body: textFile(JSON.stringify({
        background: boards[0].bg,
        ink: boards[0].ink,
        accent: boards[0].accent,
        muted: boards[0].muted,
        typeface: "Arial, Helvetica, sans-serif",
      }, null, 2)) },
      { path: "design-spec.md", body: textFile(renderMarkdown(doc)) },
      { path: "design-spec.pdf", body: await renderPdf(doc, productMeta) },
    ];
    products.push({
      meta: productMeta,
      files,
      checks: [],
      chart: boards.slice(0, 4).map((board, index) => ({ label: `Art ${index + 1}`, value: board.width })),
    });
  }
  return products;
}
