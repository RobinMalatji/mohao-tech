import { csv, renderDocx, renderMarkdown, renderPdf, textFile } from "../render";
import { money, slugify, type Doc, type ProductDefinition, type ProductMeta } from "../types";
import { grid, workbookProduct } from "./workbook";

const legal = "This is a working draft for a South African online shop. It is not legal advice. Have a lawyer read it before you publish it as your policy.";

type Kit = {
  number: number;
  name: string;
  summary: string;
  audience: string;
  tags: string[];
  prices: [number, number, number, number];
  kind: "doc" | "sheet";
  sections: { heading: string; paragraphs: string[]; points?: string[] }[];
};

function base(kit: Kit, type: string): ProductMeta {
  return {
    id: `ECM-${String(kit.number).padStart(3, "0")}`,
    slug: slugify(kit.name),
    name: kit.name,
    category: "ecommerce",
    categorySlug: "ecommerce-kits",
    categoryLabel: "E-commerce kits",
    productType: type,
    audience: kit.audience,
    version: "1.0.0",
    licence: "commercial-single",
    summary: kit.summary,
    description: kit.summary,
    benefits: ["A finished sample you edit", "The boundary of what the file does not decide", "A checklist before you publish"],
    compatibility: ["Word or Docs for DOCX", "Excel for workbooks", "A text editor for Markdown and CSV"],
    tags: kit.tags,
    prices: money(...kit.prices),
    disclaimer: legal,
  };
}

const kits: Kit[] = [
  { number: 1, name: "Product listing copy sheet", summary: "A sheet for writing a listing: name, one result, materials, price, and the question buyers ask.", audience: "Shops writing their own listings.", tags: ["listings"], prices: [219, 17, 13, 15], kind: "doc", sections: [
    { heading: "One listing", paragraphs: ["Write the product name as the buyer searches for it. Then one sentence on the result. Then the material or format, the price, and the care or the file type."], points: ["Name.", "Result.", "Format or material.", "Price.", "The question you are tired of answering."] },
    { heading: "Sample", paragraphs: ["Name: Field notes for foremen. Result: a pocket book for site instructions. Format: 64 pages, soft cover. Price: R220. Question: it is not waterproof."] },
  ]},
  { number: 2, name: "Collection planning board", summary: "Group products into collections a shopper can understand.", audience: "Shops with more than ten products.", tags: ["collections"], prices: [199, 16, 12, 14], kind: "doc", sections: [
    { heading: "A collection is a decision", paragraphs: ["A collection answers 'which of these is for me?'. 'All products' is not a collection. The sample shop uses Starter, Workshop, and Archive."], points: ["Starter: under R250 and usable today.", "Workshop: a kit with a live session.", "Archive: older editions, price reduced, labelled as older."] },
  ]},
  { number: 3, name: "Returns draft for digital goods", summary: "A draft refund position for digital files, marked as needing a lawyer.", audience: "Sellers of digital products.", tags: ["returns", "policy"], prices: [249, 20, 16, 18], kind: "doc", sections: [
    { heading: "Draft position", paragraphs: ["The sample position: if the file will not open and we cannot fix it within 7 days, we refund. If the buyer changed their mind after downloading, we do not refund. This may not match the law that applies to you. A lawyer has to say."], points: ["Define a fault.", "Define a change of mind.", "Say how to ask.", "Say how long a decision takes."] },
    { heading: "Do not publish yet", paragraphs: ["Replace the sample days with the rule you are willing to run, then have it reviewed. The Electronic Communications and Transactions Act and the Consumer Protection Act are part of that review. This file does not interpret them."] },
  ]},
  { number: 4, name: "Abandoned cart email copy", summary: "Two emails for a buyer who left before paying. They do not invent a discount.", audience: "Shops that can send a cart reminder.", tags: ["email"], prices: [189, 15, 12, 14], kind: "doc", sections: [
    { heading: "Email one, two hours later", paragraphs: ["Subject: Your files are still in the cart. Body: name the product, the price, and the link. No discount."] },
    { heading: "Email two, the next day", paragraphs: ["Subject: A question about the cart. Body: ask if the format was unclear. Offer to answer. Still no discount unless you have a real, dated offer."] },
  ]},
  { number: 5, name: "Product photo shot list", summary: "A shot list for a physical product: front, detail, scale, and the flaw.", audience: "Makers photographing goods.", tags: ["photography"], prices: [169, 13, 10, 12], kind: "doc", sections: [
    { heading: "The four frames", paragraphs: ["Front on a plain background. A detail of the material. The object next to a hand or a coin so scale is honest. The flaw, if there is one, rather than hiding it and answering emails later."], points: ["Front.", "Detail.", "Scale.", "Flaw or variation."] },
  ]},
  { number: 6, name: "Size chart template", summary: "A size chart that states how you measured.", audience: "Clothing sellers.", tags: ["sizes"], prices: [179, 14, 11, 13], kind: "sheet", sections: [
    { heading: "Measure the garment", paragraphs: ["The sample chart is garment measurements in centimetres, not body measurements. Say that on the chart. A buyer who expects body measurements will order the wrong size if you stay silent."] },
  ]},
  { number: 7, name: "Supplier comparison", summary: "Compare three suppliers on price, lead time, and the minimum order.", audience: "Shops choosing a maker.", tags: ["suppliers"], prices: [229, 18, 14, 16], kind: "sheet", sections: [
    { heading: "Same unit", paragraphs: ["Compare the price per finished unit, the lead time in days, and the minimum order. A cheaper unit with a 12-week lead is not cheaper if you miss the season."] },
  ]},
  { number: 8, name: "Reorder point calculator", summary: "A reorder point from weekly sales and the lead time you type in.", audience: "Shops with repeating stock.", tags: ["inventory"], prices: [249, 20, 16, 18], kind: "sheet", sections: [
    { heading: "The formula", paragraphs: ["Reorder when stock equals weekly sales times lead time in weeks, plus a buffer you choose. The sample sells 12 units a week, waits 3 weeks, and keeps 1 week of buffer."] },
  ]},
  { number: 9, name: "Launch week checklist", summary: "The week you put a product on sale: page, price, file, email, and a friend who tries to buy.", audience: "First-time digital sellers.", tags: ["launch"], prices: [199, 16, 12, 14], kind: "doc", sections: [
    { heading: "The week", paragraphs: ["Monday: the file opens on a second computer. Wednesday: the price matches in every currency you list. Friday: someone who did not build the page completes a test order in test mode, if your provider has one."], points: ["File opens.", "Prices match.", "Test order.", "Support address works."] },
  ]},
  { number: 10, name: "Review request sequence", summary: "Ask for a review after a buyer has had time to open the file.", audience: "Sellers who want reviews they did not invent.", tags: ["reviews"], prices: [169, 13, 10, 12], kind: "doc", sections: [
    { heading: "When", paragraphs: ["Wait until they could have used it. For a template, four days. Ask one question: what was missing? Publish a review only if they agree, and do not edit the meaning."] },
  ]},
  { number: 11, name: "Wholesale line sheet", summary: "A line sheet with wholesale price, retail suggestion, and minimum.", audience: "Makers talking to shops.", tags: ["wholesale"], prices: [229, 18, 14, 16], kind: "doc", sections: [
    { heading: "The line", paragraphs: ["Each row is a product, a wholesale price, a suggested retail, and the minimum units. Suggested retail is a suggestion. The shop sets its own price. Say that."] },
  ]},
  { number: 12, name: "Packaging insert copy", summary: "The card inside the parcel: care, the reorder link, and how to reach you.", audience: "Physical product sellers.", tags: ["packaging"], prices: [159, 12, 10, 11], kind: "doc", sections: [
    { heading: "The card", paragraphs: ["Three lines. How to care for it. Where to write if it arrived damaged. A thanks without a paragraph about the founder's journey."] },
  ]},
  { number: 13, name: "Discount calendar", summary: "A year of planned discounts so a sale is a decision, not a panic.", audience: "Shops that discount too often.", tags: ["discounts"], prices: [189, 15, 12, 14], kind: "sheet", sections: [
    { heading: "Four moments", paragraphs: ["The sample plans two public sales and two member-only windows. Every other week is full price. If you add a fifth, remove one."] },
  ]},
  { number: 14, name: "Customer photo brief", summary: "A brief for customers who send photos of your product.", audience: "Shops asking buyers for photos.", tags: ["photos"], prices: [169, 13, 10, 12], kind: "doc", sections: [
    { heading: "The brief", paragraphs: ["Ask for a photo in daylight, the product visible, and written permission to repost. Do not require them to show their face. Say where you will post it and for how long."] },
  ]},
  { number: 15, name: "Marketplace listing notes", summary: "Notes for preparing a listing on a South African marketplace, without pretending to be the marketplace's own template.", audience: "Sellers considering Takealot or a similar marketplace.", tags: ["marketplace"], prices: [209, 16, 13, 15], kind: "doc", sections: [
    { heading: "What you still have to read", paragraphs: ["Each marketplace has its own category rules, fees, and image sizes. This kit is a preparation list: barcode or identifier, stock, who pays returns, and the image crop. It is not Takealot's official template and it does not include their fees."] },
  ]},
  { number: 16, name: "Shipping rate sheet", summary: "A rate sheet from weight bands you type, for courier quotes you have actually received.", audience: "Shops setting delivery prices.", tags: ["shipping"], prices: [219, 17, 13, 15], kind: "sheet", sections: [
    { heading: "Use a quote", paragraphs: ["Type the quote you were given for each weight band and zone. The sheet adds the packing fee you choose. It does not look up a live courier rate."] },
  ]},
  { number: 17, name: "Bundle planner", summary: "Price a bundle from the items and a discount that still covers cost.", audience: "Shops building a kit.", tags: ["bundles"], prices: [229, 18, 14, 16], kind: "sheet", sections: [
    { heading: "Cost first", paragraphs: ["Add the cost of each item, then the discount. If the bundle price is below cost, the sheet shows a negative margin so you see it before launch."] },
  ]},
  { number: 18, name: "Product FAQ builder", summary: "Eight questions a digital-product page should answer.", audience: "Sellers whose pages create email.", tags: ["faq"], prices: [159, 12, 10, 11], kind: "doc", sections: [
    { heading: "The questions", paragraphs: ["What is the file? Which software opens it? Is it a Canva link? May I use it for clients? May I resell it? How do I download it again? What is the refund rule? Who do I write to?"], points: ["Answer from the product you actually made.", "If the answer is no, say no."] },
  ]},
  { number: 19, name: "One-page brand rules for a shop", summary: "Colours, type, and the claims you will not make.", audience: "Small shops with more than one person posting.", tags: ["brand"], prices: [179, 14, 11, 13], kind: "doc", sections: [
    { heading: "The page", paragraphs: ["Write the background colour, the ink colour, the accent, and three claims you will not make, such as 'handmade' when it is not, or 'limited' when you will reprint."] },
  ]},
  { number: 20, name: "After-purchase emails", summary: "The receipt email and the how-to-open email.", audience: "Digital sellers.", tags: ["email", "delivery"], prices: [199, 16, 12, 14], kind: "doc", sections: [
    { heading: "Receipt", paragraphs: ["Order reference, what they bought, the amount, the currency, and where to get the file. Do not say the file is attached if it is a link."] },
    { heading: "How to open", paragraphs: ["One email that names the software. For a CSV, say to open it in a spreadsheet. For an SVG, say to upload it, and say it is not a Canva link if it is not."] },
  ]},
];

export async function ecommerceProducts(): Promise<ProductDefinition[]> {
  const products: ProductDefinition[] = [];
  for (const kit of kits) {
    const type = kit.kind === "sheet" ? "Excel workbook and PDF guide" : "DOCX and PDF shop kit";
    const product = base(kit, type);
    const guide: Doc = {
      title: kit.name,
      kicker: legal,
      blocks: kit.sections.flatMap((section) => [
        { kind: "h" as const, text: section.heading },
        ...section.paragraphs.map((text) => ({ kind: "p" as const, text })),
        ...(section.points ? [{ kind: "ul" as const, items: section.points }] : []),
      ]),
    };
    if (kit.kind === "sheet" && kit.number === 8) {
      products.push(await workbookProduct({
        meta: product,
        filename: "reorder-point",
        sheets: [grid("Stock", [32, 16, 36], ["text", "number", "text"], [
          ["Input", "Value", "Note"],
          ["Weekly sales", 12, "Units"],
          ["Lead time in weeks", 3, "From order to arrival"],
          ["Buffer in weeks", 1, "Extra cover"],
          ["Reorder point", "=B2*(B3+B4)", "Weekly sales times lead time plus buffer"],
        ])],
        checks: [{ sheet: "Stock", cell: "B5", expected: 48 }],
        guide,
        chart: [{ label: "Sales", value: 12 }, { label: "Point", value: 48 }],
      }));
      continue;
    }
    if (kit.kind === "sheet" && kit.number === 16) {
      products.push(await workbookProduct({
        meta: product,
        filename: "shipping-rates",
        sheets: [grid("Rates", [24, 16, 16, 16, 28], ["text", "number", "zar", "zar", "text"], [
          ["Band", "Max kg", "Quote", "Packing", "Customer pays"],
          ["Local small", 2, 75, 15, "=C2+D2"],
          ["Local large", 5, 120, 15, "=C3+D3"],
          ["Inland", 2, 110, 15, "=C4+D4"],
        ])],
        checks: [
          { sheet: "Rates", cell: "E2", expected: 90 },
          { sheet: "Rates", cell: "E3", expected: 135 },
          { sheet: "Rates", cell: "E4", expected: 125 },
        ],
        guide,
        chart: [{ label: "Local", value: 90 }, { label: "Large", value: 135 }, { label: "Inland", value: 125 }],
      }));
      continue;
    }
    if (kit.kind === "sheet" && kit.number === 17) {
      products.push(await workbookProduct({
        meta: product,
        filename: "bundle",
        sheets: [grid("Bundle", [28, 16, 36], ["text", "zar", "text"], [
          ["Item", "Cost", "Note"],
          ["Guide", 40, "Print cost"],
          ["Workbook", 0, "Digital, no print"],
          ["Mailer", 12, "Packaging"],
          ["Discount", 15, "Amount off the retail sum"],
          ["Retail before discount", 180, "What the items sell for separately"],
          ["Bundle price", "=B6-B5", "Retail minus discount"],
          ["Cost", "=SUM(B2:B4)", "Cost of the contents and mailer"],
          ["Margin", "=B7-B8", "Negative means you lose money"],
        ])],
        checks: [
          { sheet: "Bundle", cell: "B7", expected: 165 },
          { sheet: "Bundle", cell: "B8", expected: 52 },
          { sheet: "Bundle", cell: "B9", expected: 113 },
        ],
        guide,
        chart: [{ label: "Price", value: 165 }, { label: "Cost", value: 52 }],
      }));
      continue;
    }
    if (kit.kind === "sheet") {
      const rows = kit.number === 6
        ? [["Size", "Chest cm", "Length cm"], ["S", "48", "68"], ["M", "52", "70"], ["L", "56", "72"]]
        : kit.number === 7
          ? [["Supplier", "Unit", "Lead days", "Minimum"], ["Mill A", "42", "21", "50"], ["Mill B", "39", "60", "200"], ["Studio", "55", "14", "10"]]
          : [["Window", "Who", "Discount"], ["March", "Public", "10%"], ["June", "Members", "15%"], ["November", "Public", "10%"], ["December", "Members", "Free shipping"]];
      products.push({
        meta: product,
        checks: [],
        chart: [{ label: "Rows", value: rows.length - 1 }],
        files: [
          { path: "template.csv", body: textFile(csv(rows)) },
          { path: "guide.md", body: textFile(renderMarkdown(guide)) },
          { path: "guide.pdf", body: await renderPdf(guide, product) },
          { path: "guide.docx", body: await renderDocx(guide, product) },
        ],
      });
      continue;
    }
    products.push({
      meta: product,
      checks: [],
      chart: [{ label: "Sections", value: kit.sections.length }],
      files: [
        { path: "kit.md", body: textFile(renderMarkdown(guide)) },
        { path: "kit.pdf", body: await renderPdf(guide, product) },
        { path: "kit.docx", body: await renderDocx(guide, product) },
      ],
    });
  }
  return products;
}
