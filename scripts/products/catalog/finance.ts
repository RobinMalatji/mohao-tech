import { workbookProduct, grid } from "./workbook";
import { money, slugify, type ProductDefinition, type ProductMeta } from "../types";
import type { Doc } from "../types";

const disclaimer =
  "This workbook organises figures you type in. It is not financial, credit, insurance, or tax advice. Rates, fees, and laws change. A qualified adviser should review decisions that affect debt, tax, medical cover, or retirement.";

function meta(
  number: number,
  name: string,
  summary: string,
  description: string,
  audience: string,
  benefits: string[],
  tags: string[],
  prices: [number, number, number, number],
): ProductMeta {
  const id = `FIN-${String(number).padStart(3, "0")}`;
  return {
    id,
    slug: slugify(name),
    name,
    category: "finance",
    categorySlug: "personal-finance",
    categoryLabel: "Personal finance",
    productType: "Excel workbook with PDF guide",
    audience,
    version: "1.0.0",
    licence: "personal",
    summary,
    description,
    benefits,
    compatibility: [
      "Microsoft Excel for Microsoft 365 or Excel 2021 and later",
      "Formulas also open in Google Sheets; confirm PMT, FV, and NPER after import",
      "PDF guide opens in any PDF reader",
      "DOCX guide opens in Microsoft Word or Google Docs",
    ],
    tags,
    prices: money(...prices),
    disclaimer,
  };
}

function guide(title: string, intro: string, method: string[], example: string[], routine: string[]): Doc {
  return {
    title,
    kicker: "Replace the sample figures before you rely on the result.",
    blocks: [
      { kind: "p", text: intro },
      { kind: "h", text: "How to use the workbook" },
      { kind: "ol", items: method },
      { kind: "h", text: "Worked example" },
      { kind: "p", text: example[0] },
      { kind: "ul", items: example.slice(1) },
      { kind: "h", text: "A practical routine" },
      { kind: "ul", items: routine },
      { kind: "note", text: disclaimer },
    ],
  };
}

export async function financeProducts(): Promise<ProductDefinition[]> {
  const products: ProductDefinition[] = [];

  products.push(await workbookProduct({
    meta: meta(1, "Household monthly budget", "A rand budget that separates take-home pay, committed costs, and what is left to save.", "Plan one household month from net pay. The workbook totals income, totals each cost you list, and shows the surplus and two ratios: savings and housing.", "Households in South Africa who want a monthly plan in rand, including households with one main salary and a smaller second income.", ["See surplus after the costs you actually listed", "Check whether housing is taking more than you intended", "Keep a written note next to every figure"], ["budget", "household", "rand"], [249, 19, 15, 17]),
    filename: "household-monthly-budget",
    chart: [{ label: "Income", value: 35000 }, { label: "Costs", value: 28099 }, { label: "Left", value: 6901 }],
    sheets: [
      grid("Inputs", [28, 16, 54], ["text", "zar", "text"], [
        ["Item", "Amount", "Note"],
        ["Take-home pay", 32500, "Net pay after deductions for the main earner"],
        ["Second income", 2500, "A Saturday market stall in this sample"],
        ["Other income", 0, "Grants, maintenance, or rental income"],
      ]),
      grid("Expenses", [28, 16, 54], ["text", "zar", "text"], [
        ["Category", "Amount", "Note"],
        ["Rent", 9500, "Sample flat in Johannesburg, excluding electricity"],
        ["Groceries", 4200, "Food and cleaning for two adults"],
        ["Transport", 2800, "Fuel and one minibus taxi commute"],
        ["Electricity", 1100, "Prepaid units for a one-bedroom flat"],
        ["Medical aid", 3200, "Sample contribution, not a quote"],
        ["Mobile data", 499, "One contract"],
        ["School costs", 1500, "Lunch and stationery, not fees"],
        ["Debt payments", 2000, "Minimums already committed this month"],
        ["Giving", 500, "Family support and a stokvel contribution"],
        ["Personal", 1800, "Clothing, hair, and small cash"],
        ["Buffer", 1000, "Left unassigned on purpose"],
      ]),
      grid("Summary", [28, 16, 54], ["text", "number", "text"], [
        ["Metric", "Amount", "What it means"],
        ["Total income", "=Inputs!B2+Inputs!B3+Inputs!B4", "All net money expected this month"],
        ["Total expenses", "=SUM(Expenses!B2:B12)", "Every cost line, including the buffer"],
        ["Surplus", "=B2-B3", "Positive means the plan fits; negative means it does not"],
        ["Savings rate", "=IF(B2=0,0,B4/B2)", "Surplus divided by income"],
        ["Housing ratio", "=IF(B2=0,0,Expenses!B2/B2)", "Rent divided by income"],
      ]),
    ],
    checks: [
      { sheet: "Summary", cell: "B2", expected: 35000 },
      { sheet: "Summary", cell: "B3", expected: 28099 },
      { sheet: "Summary", cell: "B4", expected: 6901 },
      { sheet: "Summary", cell: "B5", expected: 6901 / 35000, tolerance: 0.000001 },
      { sheet: "Summary", cell: "B6", expected: 9500 / 35000, tolerance: 0.000001 },
    ],
    guide: guide(
      "Household monthly budget",
      "Use this when payday arrives and the month still feels vague. The sample is a two-adult household with R32,500 net pay and R2,500 from a Saturday stall. Nothing in the sample is a recommendation.",
      ["Type your own net pay in Inputs. Use the amount that reaches the bank, not the gross salary.", "Replace every expense with the amount you expect to pay this month. Delete a row's amount if it does not apply, but do not delete the formula rows on Summary.", "Read Summary before you move money. Surplus is income minus the costs you listed.", "If surplus is negative, reduce a cost or the buffer before you promise a savings transfer."],
      ["The sample income is R35,000. Listed costs are R28,099, so the plan shows R6,901 left.", "Rent of R9,500 is 27.1% of income in the sample.", "The buffer is listed as a cost so it is not spent by accident.", "Medical aid in the sample is an example contribution, not a product suggestion."],
      ["On payday, update Inputs and the debt line first.", "On the 15th, replace estimates with what you have actually spent on groceries, transport, and electricity.", "At month end, write one sentence in the note column about what surprised you."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(2, "Debt payoff comparison", "Compare minimum payments with a snowball order and an avalanche order for three debts.", "See this month's interest and a months-to-clear estimate for each debt if you keep paying the current minimum. A second estimate shows the effect of putting one extra amount onto the highest-rate debt.", "People with two or three consumer debts who want a payment order before they call a credit provider.", ["See interest building this month on each balance", "Estimate months left at the current minimum", "See the shorter estimate when extra money goes to the highest rate"], ["debt", "interest", "payoff"], [299, 22, 18, 20]),
    filename: "debt-payoff-comparison",
    chart: [{ label: "Store", value: 8500 }, { label: "Loan", value: 28000 }, { label: "Family", value: 4000 }],
    sheets: [
      grid("Inputs", [34, 16, 50], ["text", "zar", "text"], [
        ["Item", "Amount", "Note"],
        ["Extra payment", 1500, "Money you can add after every minimum is paid"],
      ]),
      grid("Debts", [24, 16, 14, 16, 40], ["text", "zar", "percent", "zar", "text"], [
        ["Debt", "Balance", "Annual rate", "Minimum", "Note"],
        ["Store card", 8500, 0.22, 450, "Highest rate in the sample"],
        ["Personal loan", 28000, 0.175, 980, "Fixed sample rate"],
        ["Family loan", 4000, 0, 400, "No interest, still a real promise"],
      ]),
      grid("Calc", [34, 16, 42], ["text", "number", "text"], [
        ["Metric", "Value", "Note"],
        ["Store interest this month", "=Debts!B2*Debts!C2/12", "Balance times monthly rate"],
        ["Loan interest this month", "=Debts!B3*Debts!C3/12", "Balance times monthly rate"],
        ["Family interest this month", "=Debts!B4*Debts!C4/12", "Zero when the rate is zero"],
        ["Store months at minimum", "=NPER(Debts!C2/12,-Debts!D2,Debts!B2)", "Assumes the minimum stays constant"],
        ["Loan months at minimum", "=NPER(Debts!C3/12,-Debts!D3,Debts!B3)", "Assumes the minimum stays constant"],
        ["Family months at minimum", "=NPER(Debts!C4/12,-Debts!D4,Debts!B4)", "Rate is zero, so this is balance divided by payment"],
        ["Store months with extra", "=NPER(Debts!C2/12,-(Debts!D2+Inputs!B2),Debts!B2)", "Avalanche: the extra follows the highest rate"],
      ]),
    ],
    checks: [
      { sheet: "Calc", cell: "B2", expected: 8500 * 0.22 / 12, tolerance: 0.01 },
      { sheet: "Calc", cell: "B3", expected: 28000 * 0.175 / 12, tolerance: 0.01 },
      { sheet: "Calc", cell: "B4", expected: 0 },
      { sheet: "Calc", cell: "B5", expected: 23.399238746, tolerance: 0.01 },
      { sheet: "Calc", cell: "B6", expected: 37.228608003, tolerance: 0.01 },
      { sheet: "Calc", cell: "B7", expected: 10, tolerance: 0.001 },
      { sheet: "Calc", cell: "B8", expected: 4.584538861, tolerance: 0.01 },
    ],
    guide: guide(
      "Debt payoff comparison",
      "This workbook does not restructure debt and it does not contact a credit provider. It shows the cost of keeping three sample balances, and what changes if R1,500 extra goes onto the store card because that card has the highest rate.",
      ["List each debt's current balance, annual interest rate, and required minimum.", "Put only money you can pay after the minimums into Extra payment.", "Read Calc. Months at minimum assume the payment never changes and no new spending is added.", "The avalanche row puts the extra onto the store card. If you prefer the smallest balance first, add the extra to the family loan yourself and replace the last formula's debt references."],
      ["Store card interest in the sample is R155.83 this month.", "The personal loan interest is R408.33 this month.", "At R450 a month the store card estimate is about 23.4 months.", "Putting the extra R1,500 on that card shortens the estimate to about 4.6 months. That is not a settlement quote."],
      ["Once a month, replace balances with the statement balance.", "If a provider changes the minimum or the rate, change that cell before you trust the months figure.", "If you miss a payment, stop using the estimate and read the statement."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(3, "Emergency fund planner", "Turn one month of essential costs into a three-month target and a monthly contribution.", "List the costs you would still pay if income stopped. The workbook multiplies that essential total by the number of months you choose, then estimates how many months the contribution will take.", "Households building a first cash reserve for rent, food, transport, and medical aid.", ["Separate essential costs from costs you could pause", "Set a month target without guessing a lump sum", "See how long the current contribution takes"], ["emergency fund", "savings"], [199, 15, 12, 14]),
    filename: "emergency-fund-planner",
    chart: [{ label: "Month", value: 16800 }, { label: "Target", value: 50400 }, { label: "Saved", value: 8000 }],
    sheets: [
      grid("Essentials", [28, 16, 46], ["text", "zar", "text"], [
        ["Cost", "Monthly", "Could you pause it?"],
        ["Rent", 9500, "No"],
        ["Groceries", 3500, "Only partly"],
        ["Transport to work", 1800, "No"],
        ["Medical aid", 2000, "No, in this sample"],
        ["Prepaid electricity", 800, "No"],
        ["Mobile", 200, "Reduce, do not cut contact"],
      ]),
      grid("Plan", [36, 16, 40], ["text", "number", "text"], [
        ["Item", "Value", "Note"],
        ["Months of cover", 3, "Three months is the sample target"],
        ["Already saved", 8000, "Cash you can reach within a day"],
        ["Monthly contribution", 2000, "Transfer the day after payday"],
        ["Essential total", "=SUM(Essentials!B2:B7)", "Costs you chose not to pause"],
        ["Target", "=B5*B2", "Essential total times months"],
        ["Still to save", "=MAX(0,B6-B3)", "Target minus cash already saved"],
        ["Months to target", "=IF(B4=0,0,B7/B4)", "Still to save divided by the contribution"],
      ]),
    ],
    checks: [
      { sheet: "Plan", cell: "B5", expected: 17800 },
      { sheet: "Plan", cell: "B6", expected: 53400 },
      { sheet: "Plan", cell: "B7", expected: 45400 },
      { sheet: "Plan", cell: "B8", expected: 22.7, tolerance: 0.001 },
    ],
    guide: guide(
      "Emergency fund planner",
      "An emergency fund is cash for a shock, not a holiday account. The sample essential month is rent, a reduced grocery bill, work transport, medical aid, electricity, and a small mobile cost. Discretionary spending is left out on purpose.",
      ["Delete any essential you would not keep paying, or set it to zero.", "Choose the number of months. Three is the sample. One month is a valid first target if three is out of reach.", "Enter cash you can withdraw quickly. A 32-day notice account is not the same as money available today.", "Read Months to target. If it is longer than you can accept, raise the contribution or lower the month count. Do not invent a higher income."],
      ["Sample essentials total R17,800 a month.", "Three months is a R53,400 target.", "R8,000 is already saved, so R45,400 remains.", "At R2,000 a month the estimate is 22.7 months."],
      ["Keep the fund in an account you do not use for groceries.", "After you use it, the next budget's job is to refill it.", "Review the essential list when rent or medical aid changes."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(4, "Tax season document checklist", "Track the documents a South African individual return usually asks you to find.", "Tick what you have, what is missing, and what does not apply. The workbook counts each status. It does not calculate tax and it does not submit a return.", "Salaried people and sole proprietors preparing documents before they file, or before they meet a tax practitioner.", ["See how many documents are still missing", "Keep the source of each document next to the line", "Avoid starting a return with a half-finished folder"], ["tax documents", "SARS", "checklist"], [179, 14, 11, 13]),
    filename: "tax-document-checklist",
    chart: [{ label: "Have", value: 4 }, { label: "Missing", value: 3 }, { label: "N/A", value: 2 }],
    sheets: [
      grid("Documents", [36, 14, 42], ["text", "text", "text"], [
        ["Document", "Status", "Where it comes from"],
        ["IRP5 or IT3(a)", "Have", "Employer payroll"],
        ["Medical aid certificate", "Have", "Scheme tax certificate"],
        ["Retirement annuity certificate", "Missing", "Fund administrator"],
        ["Travel logbook", "Missing", "Only if you claim business travel"],
        ["Section 18A donation receipt", "N/A", "Only if you donated to an approved organisation"],
        ["Rental income statement", "N/A", "Only if you earned rental income"],
        ["Interest certificate", "Have", "Bank IT3(b)"],
        ["Medical out-of-pocket list", "Missing", "Your own invoices, not the scheme certificate"],
        ["Bank account details", "Have", "For refund or payment"],
      ]),
      grid("Count", [28, 14, 40], ["text", "integer", "text"], [
        ["Status", "Count", "Note"],
        ["Have", '=COUNTIF(Documents!B2:B10,"Have")', "Ready to file with"],
        ["Missing", '=COUNTIF(Documents!B2:B10,"Missing")', "Still to request"],
        ["Not applicable", '=COUNTIF(Documents!B2:B10,"N/A")', "Recorded so you do not keep hunting"],
      ]),
    ],
    checks: [
      { sheet: "Count", cell: "B2", expected: 4 },
      { sheet: "Count", cell: "B3", expected: 3 },
      { sheet: "Count", cell: "B4", expected: 2 },
    ],
    guide: guide(
      "Tax season document checklist",
      "The South African tax year for individuals runs from 1 March to the end of February. This checklist is a folder plan for that year. It does not tell you whether you must file, what you can deduct, or what you will owe. Those answers depend on your return and, where needed, a registered tax practitioner.",
      ["Change Status to Have, Missing, or N/A. Use those exact words because the counts look for them.", "Write where the document comes from so you know who to ask.", "Add rows for income this sample does not include, such as freelance invoices. Copy the status words exactly.", "Stop when Missing is zero or you have written why a missing item does not apply."],
      ["The sample already has the IRP5, medical aid certificate, interest certificate, and bank details.", "Three items are missing: the retirement annuity certificate, the travel log, and out-of-pocket medical invoices.", "Donations and rental income are marked N/A in the sample."],
      ["Request missing certificates two weeks before you intend to file.", "Save PDFs with the tax year in the file name.", "Do not email identity documents to an address you have not verified."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(5, "Paycheque split planner", "Divide one net pay across bills, savings, spending, and giving, and check that the split is 100%.", "Enter net pay and the percentage you want in each job. The workbook converts percentages to rand and warns you when the percentages do not add up.", "Anyone who wants a payday rule before the money is spent.", ["Turn percentages into rand on payday", "See immediately if the split is short of or over 100%", "Keep giving and saving as planned amounts, not leftovers"], ["payday", "allocation"], [189, 15, 12, 14]),
    filename: "paycheque-split",
    chart: [{ label: "Bills", value: 55 }, { label: "Save", value: 20 }, { label: "Spend", value: 20 }, { label: "Give", value: 5 }],
    sheets: [
      grid("Split", [24, 14, 16, 40], ["text", "percent", "zar", "text"], [
        ["Job", "Share", "Rand", "Note"],
        ["Net pay", 1, 28500, "Cell C2 is the amount that reached the bank"],
        ["Bills", 0.55, "=C$2*B3", "Rent, food, transport, debt minimums"],
        ["Savings", 0.2, "=C$2*B4", "Emergency fund and goals"],
        ["Spending", 0.2, "=C$2*B5", "Money you may spend without a meeting"],
        ["Giving", 0.05, "=C$2*B6", "Family support or a faith contribution"],
        ["Share check", "=SUM(B3:B6)", "=SUM(C3:C6)", "Shares should equal 100% and rand should equal net pay"],
      ]),
    ],
    checks: [
      { sheet: "Split", cell: "C3", expected: 15675 },
      { sheet: "Split", cell: "C4", expected: 5700 },
      { sheet: "Split", cell: "C5", expected: 5700 },
      { sheet: "Split", cell: "C6", expected: 1425 },
      { sheet: "Split", cell: "B7", expected: 1, tolerance: 0.0001 },
      { sheet: "Split", cell: "C7", expected: 28500 },
    ],
    guide: guide(
      "Paycheque split planner",
      "A split is a rule you set before the month starts. The sample sends 55% of R28,500 to bills, 20% to savings, 20% to spending, and 5% to giving. Change the shares. The check row must equal 100%.",
      ["Put net pay in C2.", "Edit the four shares in column B. They are percentages, so 20% is 0.2.", "Look at row 7. If the share check is not 1, the plan is incomplete.", "Transfer the rand amounts the morning after payday, starting with bills and savings."],
      ["Bills are R15,675 in the sample.", "Savings and spending are R5,700 each.", "Giving is R1,425.", "The four shares add to 100% and the rand adds back to R28,500."],
      ["If a debit order is larger than the bills amount, fix the share before payday.", "Do not use the spending amount to cover a bill you forgot.", "Rewrite the split when your net pay changes."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(6, "Four-week grocery tracker", "Price a repeating grocery list and see the cost per person across four weeks.", "Enter the aisle, the usual quantity, and the price you last paid. The workbook extends one shop across four weeks and divides the month by the number of people eating.", "Households who want a food number before they set the rest of the budget.", ["Build a list from prices you have actually paid", "See a four-week cost without retyping the list", "Divide the basket by the number of people"], ["groceries", "food"], [169, 13, 10, 12]),
    filename: "four-week-grocery-tracker",
    chart: [{ label: "Staples", value: 486 }, { label: "Protein", value: 620 }, { label: "Produce", value: 280 }],
    sheets: [
      grid("List", [22, 14, 14, 16, 28], ["text", "number", "zar", "zar", "text"], [
        ["Item", "Qty", "Unit price", "Line", "Aisle"],
        ["Maize meal 5kg", 1, 79, "=B2*C2", "Staples"],
        ["Rice 2kg", 1, 42, "=B3*C3", "Staples"],
        ["Brown bread", 4, 16, "=B4*C4", "Staples"],
        ["Eggs 18", 1, 62, "=B5*C5", "Protein"],
        ["Chicken portions", 2, 89, "=B6*C6", "Protein"],
        ["Pilchards", 4, 22, "=B7*C7", "Protein"],
        ["Milk 2L", 4, 32, "=B8*C8", "Dairy"],
        ["Vegetables", 1, 180, "=B9*C9", "Produce"],
        ["Fruit", 1, 100, "=B10*C10", "Produce"],
        ["Cleaning", 1, 95, "=B11*C11", "Household"],
      ]),
      grid("Month", [32, 16, 36], ["text", "number", "text"], [
        ["Metric", "Value", "Note"],
        ["People eating", 3, "Adults and children who eat from this shop"],
        ["One shop", "=SUM(List!D2:D11)", "The list once"],
        ["Four weeks", "=B3*4", "Assumes the list repeats"],
        ["Per person per week", "=IF(B2=0,0,B3/B2)", "One shop divided by people"],
        ["Per person per month", "=IF(B2=0,0,B4/B2)", "Four weeks divided by people"],
      ]),
    ],
    checks: [
      { sheet: "List", cell: "D2", expected: 79 },
      { sheet: "List", cell: "D4", expected: 64 },
      { sheet: "List", cell: "D6", expected: 178 },
      { sheet: "Month", cell: "B3", expected: 79 + 42 + 64 + 62 + 178 + 88 + 128 + 180 + 100 + 95 },
      { sheet: "Month", cell: "B4", expected: (79 + 42 + 64 + 62 + 178 + 88 + 128 + 180 + 100 + 95) * 4 },
    ],
    guide: guide(
      "Four-week grocery tracker",
      "This is a price list, not a meal plan and not nutrition advice. The sample shop feeds three people and repeats four times. Bread, milk, and tins are counted in the quantities shown.",
      ["Replace unit prices with the price on your last till slip.", "Change quantities before you change the month formulas.", "Set People eating to the number who regularly eat from this shop.", "Use Four weeks as the grocery line in the household budget."],
      ["Maize meal is R79, four loaves are R64, and two packs of chicken are R178.", "The sample one-shop total is R1,016.", "Four weeks is R4,064.", "For three people that is about R338.67 each per week."],
      ["Update prices when a staple jumps, not every single trip.", "Keep cleaning on the list so it is not a surprise.", "If you shop twice a week, do not also multiply by four and by two."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(7, "Vehicle finance comparison", "Compare two vehicle offers using price, deposit, rate, and term.", "Each offer becomes a monthly repayment estimate with the PMT formula. The workbook also shows the repayments over the full term and the extra you would pay above the amount financed. Balloon payments are not included.", "Buyers comparing two finance offers before they sign.", ["Put both offers on the same page", "See a monthly estimate from the rate and term", "See the total repayments, not only the monthly figure"], ["vehicle", "finance", "PMT"], [279, 21, 17, 19]),
    filename: "vehicle-finance-comparison",
    chart: [{ label: "Offer A", value: 3299.53 }, { label: "Offer B", value: 3707.51 }],
    sheets: [
      grid("Offers", [28, 18, 18, 36], ["text", "number", "number", "text"], [
        ["Input", "Offer A", "Offer B", "Note"],
        ["Cash price", 189900, 194900, "Advertised price before extras"],
        ["Deposit", 20000, 20000, "Cash you pay up front"],
        ["Amount financed", "=B2-B3", "=C2-C3", "Price minus deposit"],
        ["Annual rate", 0.1175, 0.099, "Sample interest rates, not quotes"],
        ["Term in months", 72, 60, "Offer A is six years, offer B is five"],
        ["Monthly repayment", "=ABS(PMT(B5/12,B6,B4))", "=ABS(PMT(C5/12,C6,C4))", "Estimate only"],
        ["Repayments over term", "=B7*B6", "=C7*C6", "Monthly amount times months"],
        ["Cost of finance", "=B8-B4", "=C8-C4", "Repayments minus amount financed"],
      ]),
    ],
    checks: [
      { sheet: "Offers", cell: "B4", expected: 169900 },
      { sheet: "Offers", cell: "C4", expected: 174900 },
      { sheet: "Offers", cell: "B7", expected: 3299.53106, tolerance: 0.02 },
      { sheet: "Offers", cell: "C7", expected: 3707.508178, tolerance: 0.02 },
    ],
    guide: guide(
      "Vehicle finance comparison",
      "A lower monthly figure can still cost more if the term is longer. Offer A finances R169,900 at 11.75% over 72 months. Offer B finances R174,900 at 9.9% over 60 months. Fees, balloon payments, insurance, and residual values are not in this model.",
      ["Replace price, deposit, rate, and term with the figures on each offer.", "Leave the formula rows alone.", "Compare monthly repayment and cost of finance together.", "Ask the provider for the total cost of credit before you sign. This sheet is not that disclosure."],
      ["Offer A monthly estimate is R3,299.53.", "Offer B monthly estimate is R3,707.51.", "Offer B is higher each month because the term is shorter and the amount financed is higher.", "The cost of finance row is the extra you pay above the amount financed, before fees."],
      ["Get the rate in writing.", "Add insurance and fuel outside this workbook before you decide you can afford the car.", "If there is a balloon, do not use this sheet unchanged."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(8, "Rent and ownership cost comparison", "Compare one year of rent with one year of ownership costs you type in.", "The sheet does not guess a bond. You enter the repayment a lender actually quoted, plus levies, rates, insurance, and maintenance. It then compares that year with rent and rent increases.", "Renters who have a written bond quote and want a one-year cost comparison.", ["Use a quoted repayment instead of an invented bond", "Add levies, rates, and maintenance", "See the gap for one year, not a lifetime prediction"], ["rent", "housing"], [229, 18, 14, 16]),
    filename: "rent-and-ownership-costs",
    chart: [{ label: "Rent", value: 114000 }, { label: "Own", value: 156000 }],
    sheets: [
      grid("Year", [36, 16, 40], ["text", "zar", "text"], [
        ["Cost", "Amount", "Note"],
        ["Monthly rent", 9500, "Current lease"],
        ["Expected annual increase", 0.08, "Sample, stored as 0.08"],
        ["Annual rent", "=B2*12", "Before the increase"],
        ["Rent after one increase", "=B4*(1+B3)", "Applied once, at the next renewal"],
        ["Quoted bond repayment", 8200, "From a written quote, monthly"],
        ["Levies", 1500, "Monthly"],
        ["Municipal rates", 900, "Monthly"],
        ["Building insurance", 450, "Monthly"],
        ["Maintenance reserve", 800, "Monthly amount you choose to set aside"],
        ["Annual ownership", "=(B6+B7+B8+B9+B10)*12", "Does not include transfer costs"],
        ["Ownership minus next rent", "=B11-B5", "Positive means ownership costs more this year"],
      ]),
    ],
    checks: [
      { sheet: "Year", cell: "B4", expected: 114000 },
      { sheet: "Year", cell: "B5", expected: 123120 },
      { sheet: "Year", cell: "B11", expected: (8200 + 1500 + 900 + 450 + 800) * 12 },
      { sheet: "Year", cell: "B12", expected: 142200 - 123120 },
    ],
    guide: guide(
      "Rent and ownership cost comparison",
      "This is a one-year cash comparison. It ignores transfer duty, bond registration, estate agent commission, and any change in the property's price. Those can dominate a short stay. The sample rent is R9,500 and the quoted repayment is R8,200, but levies and maintenance pull ownership above rent.",
      ["Use the repayment from a quote, not a number you hope for.", "Enter monthly levies, rates, insurance, and a maintenance reserve.", "Read Ownership minus next rent. A positive number means the ownership year costs more than the next rental year.", "Decide separately how long you expect to stay. This sheet cannot answer that."],
      ["Annual rent before the increase is R114,000.", "After an 8% increase it is R123,120.", "Ownership in the sample is R11,850 a month, or R142,200 a year.", "The gap is R19,080 for the year."],
      ["Ask for the levy statement and the rates account, not only the selling price.", "Keep a maintenance reserve even in a new building.", "Recalculate when the quote expires."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(9, "Event budget variance", "Set a planned amount for each event cost and record what you actually pay.", "Variance is actual minus plan. The workbook totals both columns and shows which lines ran over. It is built for a 40-person family celebration, and the categories can be renamed.", "Anyone planning a wedding, funeral, graduation, or family celebration with a fixed cash amount.", ["See the overrun on each line", "Keep vendors and notes beside the number", "Protect a contingency instead of spending it first"], ["event", "wedding", "budget"], [219, 17, 13, 15]),
    filename: "event-budget-variance",
    chart: [{ label: "Plan", value: 45000 }, { label: "Actual", value: 46850 }],
    sheets: [
      grid("Event", [24, 16, 16, 16, 30], ["text", "zar", "zar", "zar", "text"], [
        ["Line", "Plan", "Actual", "Variance", "Note"],
        ["Venue", 18000, 18000, "=C2-B2", "Community hall, paid"],
        ["Food", 12000, 13500, "=C3-B3", "Forty plates, price increased"],
        ["Drinks", 3000, 2800, "=C4-B4", "Under plan"],
        ["Photos", 4000, 4500, "=C5-B5", "Extra hour"],
        ["Decor", 2500, 2500, "=C6-B6", "On plan"],
        ["Contingency", 5500, 5550, "=C7-B7", "Used for the food gap and a small extra"],
        ["Total", "=SUM(B2:B7)", "=SUM(C2:C7)", "=C8-B8", "Variance above zero means over plan"],
      ]),
    ],
    checks: [
      { sheet: "Event", cell: "D3", expected: 1500 },
      { sheet: "Event", cell: "D4", expected: -200 },
      { sheet: "Event", cell: "B8", expected: 45000 },
      { sheet: "Event", cell: "C8", expected: 46850 },
      { sheet: "Event", cell: "D8", expected: 1850 },
    ],
    guide: guide(
      "Event budget variance",
      "The sample is a 40-person celebration with a R45,000 plan. Food came in R1,500 over. Drinks came in R200 under. The contingency covered part of the food gap and the event still finished R1,850 over the original plan.",
      ["Write the plan before you pay deposits.", "Enter actuals only when money has left the account.", "Read the variance column. Positive is over plan.", "If contingency is spent, stop adding lines until you cut something else."],
      ["Venue, decor, and most of the contingency landed on plan.", "Food is the line that moved.", "The total plan is R45,000 and the total actual is R46,850."],
      ["Put deposits in Actual as soon as they are paid.", "Ask for a revised quote in writing when a guest count changes.", "Do not hide an overrun by changing the original plan."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(10, "Freelance invoice ledger", "Track invoices, what has been paid, and what is still outstanding.", "Each row is one invoice. Status must be Paid or Outstanding. The summary uses SUMIF so a paid invoice does not remain in the cash you are waiting for. A small expense list shows profit after costs.", "Freelancers and sole proprietors invoicing in rand.", ["Separate paid cash from invoices you have only sent", "See profit after the costs of the work", "Keep the client and invoice number on the same row"], ["freelance", "invoices"], [259, 20, 16, 18]),
    filename: "freelance-invoice-ledger",
    chart: [{ label: "Paid", value: 18500 }, { label: "Waiting", value: 7200 }],
    sheets: [
      grid("Invoices", [16, 22, 14, 16, 28], ["text", "text", "zar", "text", "text"], [
        ["Number", "Client", "Amount", "Status", "Work"],
        ["INV-014", "North Station Cafe", 4500, "Paid", "Menu photography"],
        ["INV-015", "Khumalo Legal", 14000, "Paid", "One-page site update"],
        ["INV-016", "Harbour Studio", 7200, "Outstanding", "Brand sheet, sent 2 October"],
        ["INV-017", "North Station Cafe", 0, "Paid", "Cancelled reshoot, kept for the record"],
      ]),
      grid("Costs", [28, 14, 36], ["text", "zar", "text"], [
        ["Cost", "Amount", "Note"],
        ["Software", 350, "Editing app for the month"],
        ["Travel", 280, "Two client visits"],
        ["Data", 199, "Extra mobile data"],
      ]),
      grid("Summary", [28, 16, 36], ["text", "zar", "text"], [
        ["Metric", "Amount", "Note"],
        ["Invoiced", "=SUM(Invoices!C2:C5)", "Includes the zero cancelled row"],
        ["Paid", '=SUMIF(Invoices!D2:D5,"Paid",Invoices!C2:C5)', "Cash received"],
        ["Outstanding", '=SUMIF(Invoices!D2:D5,"Outstanding",Invoices!C2:C5)', "Still to collect"],
        ["Costs", "=SUM(Costs!B2:B4)", "Costs of doing the work"],
        ["Profit on paid work", "=B3-B5", "Does not treat unpaid invoices as profit"],
      ]),
    ],
    checks: [
      { sheet: "Summary", cell: "B2", expected: 25700 },
      { sheet: "Summary", cell: "B3", expected: 18500 },
      { sheet: "Summary", cell: "B4", expected: 7200 },
      { sheet: "Summary", cell: "B5", expected: 829 },
      { sheet: "Summary", cell: "B6", expected: 17671 },
    ],
    guide: guide(
      "Freelance invoice ledger",
      "Profit in this workbook means paid invoices minus costs. Harbour Studio still owes R7,200, and that amount stays out of profit until the status changes to Paid. The cancelled reshoot is a zero row so the invoice number is not reused by mistake.",
      ["Add one row per invoice. Do not overwrite an old invoice.", "Use the status words Paid or Outstanding exactly.", "Enter costs in the month they were paid.", "Read Profit on paid work before you decide what you can take as drawings."],
      ["Paid invoices are R4,500 and R14,000.", "Outstanding is R7,200.", "Costs are R829.", "Profit on paid work is R17,671."],
      ["Send a reminder when an invoice passes the date you agreed.", "Change status only when the deposit is in the bank.", "Keep this ledger even if you also use accounting software, until the software is the habit."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(11, "Student month planner", "Split a bursary, family allowance, and part-time wage across a campus month.", "The workbook totals money in, subtracts fixed campus costs, and divides what remains by four weeks. It is a spending plan, not a bursary application.", "University and college students managing a monthly allowance in rand.", ["See the week amount after rent and transport", "Keep textbooks separate from food", "Notice when a part-time wage is doing too much work"], ["student", "allowance"], [149, 12, 9, 11]),
    filename: "student-month-planner",
    chart: [{ label: "In", value: 6400 }, { label: "Fixed", value: 4200 }, { label: "Week", value: 550 }],
    sheets: [
      grid("Money", [28, 16, 40], ["text", "zar", "text"], [
        ["Source", "Amount", "Note"],
        ["Family allowance", 2500, "Paid on the 1st"],
        ["Bursary stipend", 3000, "Sample living stipend, not a specific fund"],
        ["Part-time wage", 900, "Saturday shift after tax"],
        ["Total in", "=SUM(B2:B4)", "Everything available this month"],
      ]),
      grid("Fixed", [28, 16, 40], ["text", "zar", "text"], [
        ["Cost", "Amount", "Note"],
        ["Residence or rent", 2800, "Sample shared room"],
        ["Transport", 600, "Campus bus and one taxi home"],
        ["Airtime and data", 350, "Needed for coursework"],
        ["Textbooks sinking fund", 450, "Saved even in months with no book to buy"],
        ["Fixed total", "=SUM(B2:B5)", "Leaves food and personal for the week figure"],
      ]),
      grid("Week", [32, 16, 36], ["text", "number", "text"], [
        ["Metric", "Value", "Note"],
        ["Left after fixed costs", "=Money!B5-Fixed!B6", "Food, toiletries, and going out"],
        ["Weekly amount", "=B2/4", "Four campus weeks"],
      ]),
    ],
    checks: [
      { sheet: "Money", cell: "B5", expected: 6400 },
      { sheet: "Fixed", cell: "B6", expected: 4200 },
      { sheet: "Week", cell: "B2", expected: 2200 },
      { sheet: "Week", cell: "B3", expected: 550 },
    ],
    guide: guide(
      "Student month planner",
      "The sample student receives R2,500 from family, R3,000 as a living stipend, and R900 from a Saturday job. Residence, transport, data, and a textbook fund take R4,200. R2,200 is left, which is R550 a week.",
      ["Enter only money you are sure will arrive.", "Put residence and transport in Fixed before you decide on weekend spending.", "Keep the textbook line even when you are not buying a book this month.", "Use the weekly amount as the cash or card limit for food and personal costs."],
      ["Money in is R6,400.", "Fixed costs are R4,200.", "R550 a week is the sample limit after those costs."],
      ["If the Saturday shift is cancelled, set the wage to zero and read the week amount again.", "Do not use the textbook fund for a night out and promise to replace it later unless you actually transfer it back.", "Rewrite the plan when the stipend date moves."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(12, "Retirement contribution sketch", "Project a savings balance from a contribution and an assumed return you type in.", "The future value uses the rate you enter. It is an illustration, not a forecast and not a retirement-fund quote. Fees, tax, and inflation are not modelled.", "People who want to see how a monthly contribution and an assumed rate interact before they speak to a fund or adviser.", ["See the balance an assumed rate produces", "Change the rate without hiding that it is an assumption", "Keep the current savings separate from new contributions"], ["retirement", "savings", "FV"], [259, 20, 16, 18]),
    filename: "retirement-contribution-sketch",
    chart: [{ label: "Now", value: 20000 }, { label: "Sketch", value: 1329616 }],
    sheets: [
      grid("Sketch", [36, 18, 42], ["text", "number", "text"], [
        ["Input", "Value", "Note"],
        ["Current savings", 20000, "Amount already invested"],
        ["Monthly contribution", 1500, "Paid at the end of each month in this model"],
        ["Years", 25, "Sample horizon"],
        ["Assumed annual return", 0.07, "You chose this assumption. It is not a prediction"],
        ["Illustrated balance", "=FV(B5/12,B4*12,-B3,-B2)", "Future value of current savings plus contributions"],
        ["Contributions paid in", "=B3*B4*12", "Ignores growth"],
      ]),
    ],
    checks: [
      { sheet: "Sketch", cell: "B6", expected: 1329615.9037, tolerance: 1 },
      { sheet: "Sketch", cell: "B7", expected: 450000 },
    ],
    guide: guide(
      "Retirement contribution sketch",
      "The sample starts with R20,000, adds R1,500 a month, and assumes 7% a year for 25 years. The illustrated balance is about R1,329,616. The cash you would have paid in is R450,000. The gap is growth under that assumption. If the assumption is wrong, the balance is wrong.",
      ["Enter savings you have today and the contribution you can keep paying.", "Type the return as a decimal. Seven percent is 0.07.", "Read the illustrated balance and the contributions row together.", "Take the printout to a fund or adviser. Do not treat it as their quote."],
      ["Contributions over 25 years are R450,000 before growth.", "At a 7% assumption the sketch is about R1.33 million.", "A lower assumption will produce a lower sketch. Change B5 and look again."],
      ["Review the contribution when your pay changes.", "Subtract fees in your head or ask the provider for a net illustration.", "This sheet does not know your retirement age, tax, or inflation."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(13, "Net worth snapshot", "List what you own and what you owe, then subtract.", "Assets are split into cash you can reach and other assets. Liabilities are listed one by one. Net worth is assets minus liabilities. The workbook does not value a business or a property for you.", "Individuals who want one page of assets and debts.", ["Separate cash from assets that would take time to sell", "List each debt instead of one vague total", "Update the snapshot without rebuilding the sheet"], ["net worth", "assets"], [199, 15, 12, 14]),
    filename: "net-worth-snapshot",
    chart: [{ label: "Assets", value: 86500 }, { label: "Debts", value: 36500 }, { label: "Net", value: 50000 }],
    sheets: [
      grid("Assets", [28, 16, 28], ["text", "zar", "text"], [
        ["Asset", "Amount", "Kind"],
        ["Cheque account", 6500, "Cash"],
        ["Savings account", 8000, "Cash"],
        ["Vehicle", 70000, "Other"],
        ["Furniture", 2000, "Other"],
      ]),
      grid("Debts", [28, 16, 36], ["text", "zar", "text"], [
        ["Debt", "Balance", "Note"],
        ["Store card", 8500, "Statement balance"],
        ["Personal loan", 28000, "Settlement would differ"],
      ]),
      grid("Snapshot", [28, 16, 36], ["text", "zar", "text"], [
        ["Metric", "Amount", "Note"],
        ["Cash assets", '=SUMIF(Assets!C2:C5,"Cash",Assets!B2:B5)', "Reachable soon"],
        ["Other assets", '=SUMIF(Assets!C2:C5,"Other",Assets!B2:B5)', "Not the same as cash"],
        ["Total assets", "=SUM(Assets!B2:B5)", "Cash plus other"],
        ["Total debts", "=SUM(Debts!B2:B3)", "Balances, not instalments"],
        ["Net worth", "=B4-B5", "Assets minus debts"],
      ]),
    ],
    checks: [
      { sheet: "Snapshot", cell: "B2", expected: 14500 },
      { sheet: "Snapshot", cell: "B3", expected: 72000 },
      { sheet: "Snapshot", cell: "B4", expected: 86500 },
      { sheet: "Snapshot", cell: "B5", expected: 36500 },
      { sheet: "Snapshot", cell: "B6", expected: 50000 },
    ],
    guide: guide(
      "Net worth snapshot",
      "The sample person has R14,500 in cash, a vehicle they value at R70,000, and R2,000 of furniture. Debts are R36,500. Net worth is R50,000. The vehicle value is the owner's estimate, not a dealer offer.",
      ["Use cash balances from the banking app on the day you fill this in.", "For a vehicle or furniture, use a conservative amount you could accept, and say so in the note.", "Use statement balances for debts.", "Read cash assets separately from net worth. A positive net worth can still be short of cash."],
      ["Cash is R14,500.", "Other assets are R72,000.", "Debts are R36,500.", "Net worth is R50,000."],
      ["Update this on the first of the month.", "Do not add the same asset twice because two people share it. Agree the share and enter only your share.", "A retirement fund can be added as its own row with kind Other if you know the latest statement value."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(14, "Subscription audit", "List recurring charges, mark what you will cancel, and total the annual saving.", "Every row is a subscription or membership. Decision must be Keep or Cancel. Annual cost is monthly times 12. The summary adds the cancel rows.", "Anyone who wants to see streaming, apps, gym fees, and box deliveries in one list.", ["Turn monthly charges into an annual number", "Mark a decision instead of vaguely meaning to cancel", "See the saving only from rows you marked Cancel"], ["subscriptions", "audit"], [169, 13, 10, 12]),
    filename: "subscription-audit",
    chart: [{ label: "Keep", value: 499 }, { label: "Cancel", value: 438 }],
    sheets: [
      grid("Subs", [24, 14, 16, 14, 28], ["text", "zar", "zar", "text", "text"], [
        ["Name", "Monthly", "Annual", "Decision", "Last used"],
        ["Music app", 69, "=B2*12", "Keep", "Yesterday"],
        ["Video streaming", 159, "=B3*12", "Cancel", "Six weeks ago"],
        ["Cloud storage", 40, "=B4*12", "Keep", "This week"],
        ["Gym", 249, "=B5*12", "Cancel", "March"],
        ["News", 30, "=B6*12", "Cancel", "Not since joining"],
      ]),
      grid("Audit", [28, 16, 36], ["text", "zar", "text"], [
        ["Metric", "Amount", "Note"],
        ["Monthly keep", '=SUMIF(Subs!D2:D6,"Keep",Subs!B2:B6)', "Charges you decided to leave"],
        ["Monthly cancel", '=SUMIF(Subs!D2:D6,"Cancel",Subs!B2:B6)', "Charges you still have to cancel"],
        ["Annual saving if cancelled", "=B3*12", "Only after you actually cancel"],
      ]),
    ],
    checks: [
      { sheet: "Subs", cell: "C5", expected: 2988 },
      { sheet: "Audit", cell: "B2", expected: 109 },
      { sheet: "Audit", cell: "B3", expected: 438 },
      { sheet: "Audit", cell: "B4", expected: 5256 },
    ],
    guide: guide(
      "Subscription audit",
      "The sample keeps music at R69 and cloud storage at R40. It marks video, gym, and news for cancellation. Those three cost R438 a month, or R5,256 a year, but only after the cancellation is confirmed.",
      ["Export a month of bank transactions and add every repeating charge.", "Use Keep or Cancel exactly.", "Cancel with the provider, then change the monthly amount to zero only when a later statement proves it stopped.", "The annual saving stays on the sheet until then so you do not count it early."],
      ["Keep is R109 a month.", "Cancel is R438 a month.", "The gym alone is R2,988 a year in the sample."],
      ["Do this twice a year.", "Shared family plans need one owner. Write that name in the note.", "Free trials belong on the list on the day they start."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(15, "Travel budget planner", "Build a trip cost from nights, daily food, transport, and a contingency percentage.", "The sample is four nights in Cape Town for two adults travelling from Johannesburg. You can change every driver. Contingency is a percentage of the subtotal, not a guess typed at the end.", "People pricing a short trip before they book.", ["See the trip total and the cost per person", "Keep a contingency that scales with the trip", "Separate booked costs from daily spending"], ["travel", "holiday"], [189, 15, 12, 14]),
    filename: "travel-budget-planner",
    chart: [{ label: "Stay", value: 6400 }, { label: "Food", value: 2400 }, { label: "Flights", value: 3600 }],
    sheets: [
      grid("Trip", [32, 16, 40], ["text", "number", "text"], [
        ["Input", "Value", "Note"],
        ["Travellers", 2, "People sharing this budget"],
        ["Nights", 4, "Accommodation nights"],
        ["Nightly stay", 1600, "Room rate for the whole room"],
        ["Food per person per day", 300, "Sample, not a restaurant guide"],
        ["Flights or fuel", 3600, "Return transport for everyone"],
        ["Activities", 1200, "One booked outing"],
        ["Contingency share", 0.1, "Ten percent of the subtotal"],
        ["Stay total", "=B3*B4", "Nights times nightly rate"],
        ["Food total", "=B2*(B3+1)*B5", "Days are nights plus one"],
        ["Subtotal", "=B9+B10+B6+B7", "Before contingency"],
        ["Contingency", "=B11*B8", "Reserved, not spent"],
        ["Trip total", "=B11+B12", "Subtotal plus contingency"],
        ["Per person", "=IF(B2=0,0,B13/B2)", "Trip total divided by travellers"],
      ]),
    ],
    checks: [
      { sheet: "Trip", cell: "B9", expected: 6400 },
      { sheet: "Trip", cell: "B10", expected: 3000 },
      { sheet: "Trip", cell: "B11", expected: 14200 },
      { sheet: "Trip", cell: "B12", expected: 1420 },
      { sheet: "Trip", cell: "B13", expected: 15620 },
      { sheet: "Trip", cell: "B14", expected: 7810 },
    ],
    guide: guide(
      "Travel budget planner",
      "Four nights at R1,600 a night is R6,400 for the room. Two people eating at R300 a day for five days is R3,000. Flights are R3,600 and one activity is R1,200. Ten percent contingency makes the sample trip R15,620, or R7,810 each.",
      ["Enter the room rate, not a rate per person, unless you are booking beds separately. If you do, change the stay formula.", "Food uses nights plus one so the travel days are included.", "Set contingency before you book, and do not spend it on an upgrade.", "Divide by travellers only if they are sharing these costs."],
      ["Stay is R6,400.", "Food is R3,000, not R2,400, because the sample counts five days.", "Contingency is R1,420.", "The trip total is R15,620."],
      ["When you book, replace the estimate with the receipt.", "If a person drops out, change Travellers and reread the per-person line.", "Keep contingency until you are home."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(16, "Side-hustle profit calculator", "Subtract materials, fees, and delivery from sales, then divide profit by hours.", "The sample is a weekend baked-goods table. Profit is sales minus costs. The hourly figure uses the hours you type, including shopping and delivery, not only the stall time.", "People testing a small cash business on weekends.", ["See profit after platform fees and materials", "Include delivery and packaging", "Turn profit into an hourly figure"], ["side hustle", "pricing"], [199, 16, 12, 14]),
    filename: "side-hustle-profit",
    chart: [{ label: "Sales", value: 4800 }, { label: "Costs", value: 2310 }, { label: "Profit", value: 2490 }],
    sheets: [
      grid("Stall", [32, 16, 40], ["text", "number", "text"], [
        ["Item", "Value", "Note"],
        ["Units sold", 40, "Boxes of rusks in the sample"],
        ["Price each", 120, "Selling price"],
        ["Sales", "=B2*B3", "Units times price"],
        ["Materials", 1400, "Flour, butter, sugar, packaging"],
        ["Platform or stall fee", 0.1, "Ten percent of sales"],
        ["Fee amount", "=B4*B6", "Sales times the fee"],
        ["Delivery", 280, "Two drop-offs"],
        ["Hours", 14, "Baking, packing, stall, and delivery"],
        ["Total costs", "=B5+B7+B8", "Materials, fees, and delivery"],
        ["Profit", "=B4-B10", "Sales minus costs"],
        ["Profit per hour", "=IF(B9=0,0,B11/B9)", "Profit divided by all hours"],
      ]),
    ],
    checks: [
      { sheet: "Stall", cell: "B4", expected: 4800 },
      { sheet: "Stall", cell: "B7", expected: 480 },
      { sheet: "Stall", cell: "B10", expected: 2160 },
      { sheet: "Stall", cell: "B11", expected: 2640 },
      { sheet: "Stall", cell: "B12", expected: 2640 / 14, tolerance: 0.01 },
    ],
    guide: guide(
      "Side-hustle profit calculator",
      "Forty boxes at R120 is R4,800 of sales. Materials are R1,400, the 10% stall fee is R480, and delivery is R280. Profit is R2,640. Fourteen hours include baking and delivery, so the sample is R188.57 an hour before tax.",
      ["Count hours from the moment you shop, not only the time at the table.", "Enter the fee as a decimal. Ten percent is 0.1.", "Include packaging in materials.", "If profit per hour is below what you need, change the price or the hours and read the row again. The sheet will not tell you the 'right' price."],
      ["Sales are R4,800.", "Costs are R2,160.", "Profit is R2,640.", "The hourly figure is profit divided by 14."],
      ["Do this after every trading weekend while the receipts are still in the car.", "Set aside money for ingredients before you spend the profit.", "Tax on trading income is not calculated here."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(17, "Family pocket-money planner", "Set a monthly amount per child and see the household total for the year.", "Each child has an amount and a note about what it is expected to cover. The workbook totals the month and the year. It does not decide what a child should be paid.", "Parents or caregivers who want the household cost of pocket money to be explicit.", ["See the year cost before you promise an increase", "Write what the money is meant to cover", "Keep each child on a separate row"], ["family", "pocket money"], [149, 12, 9, 11]),
    filename: "family-pocket-money",
    chart: [{ label: "Month", value: 450 }, { label: "Year", value: 5400 }],
    sheets: [
      grid("Children", [20, 12, 16, 16, 32], ["text", "integer", "zar", "zar", "text"], [
        ["Child", "Age", "Monthly", "Annual", "Meant to cover"],
        ["Amina", 14, 250, "=C2*12", "Transport top-up and a school outing"],
        ["Leo", 11, 120, "=C3*12", "Tuck and one activity"],
        ["Sam", 8, 80, "=C4*12", "Tuck only"],
      ]),
      grid("Household", [28, 16, 36], ["text", "zar", "text"], [
        ["Metric", "Amount", "Note"],
        ["Monthly total", "=SUM(Children!C2:C4)", "All children"],
        ["Annual total", "=SUM(Children!D2:D4)", "Monthly total times 12"],
      ]),
    ],
    checks: [
      { sheet: "Children", cell: "D2", expected: 3000 },
      { sheet: "Household", cell: "B2", expected: 450 },
      { sheet: "Household", cell: "B3", expected: 5400 },
    ],
    guide: guide(
      "Family pocket-money planner",
      "The sample household pays R250, R120, and R80 a month. That is R450 a month and R5,400 a year. The notes say what each amount is for, so an increase has a reason.",
      ["Add or remove a child by editing rows, then extend the SUM ranges if you add a fifth child.", "Write what the money covers. If airtime is included, do not also refund airtime.", "Read the annual total before you agree to a new amount.", "Pay it on the same day each month."],
      ["Amina's year is R3,000.", "The household month is R450.", "The household year is R5,400."],
      ["Review in January and at the start of a new school year.", "If a grandparent also gives money, write that outside this total so you do not double count.", "This sheet is not advice about parenting."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(18, "Healthcare cost tracker", "Add medical aid, gap cover, and out-of-pocket costs for one year.", "The workbook annualises monthly premiums and adds invoices you pay yourself. It does not compare schemes and it does not tell you what to claim.", "Households who want one total for healthcare cash costs.", ["See premiums and invoices in one year", "Keep pharmacy, dental, and optical separate", "Avoid treating a premium as the whole cost"], ["healthcare", "medical aid"], [189, 15, 12, 14]),
    filename: "healthcare-cost-tracker",
    chart: [{ label: "Aid", value: 38400 }, { label: "Gap", value: 5400 }, { label: "Invoices", value: 2360 }],
    sheets: [
      grid("Cover", [28, 16, 40], ["text", "zar", "text"], [
        ["Item", "Monthly", "Note"],
        ["Medical aid", 3200, "Sample contribution"],
        ["Gap cover", 450, "Sample premium"],
      ]),
      grid("Invoices", [28, 16, 36], ["text", "zar", "text"], [
        ["Invoice", "You paid", "Note"],
        ["Pharmacy", 860, "Not refunded in this sample"],
        ["Dentist", 1200, "Amount after the scheme payment"],
        ["Optometrist", 300, "Lenses excess"],
      ]),
      grid("Year", [32, 16, 40], ["text", "zar", "text"], [
        ["Metric", "Amount", "Note"],
        ["Annual medical aid", "=Cover!B2*12", "Premiums only"],
        ["Annual gap cover", "=Cover!B3*12", "Premiums only"],
        ["Invoices you paid", "=SUM(Invoices!B2:B4)", "Cash after any scheme payment"],
        ["Cash healthcare total", "=B2+B3+B4", "Premiums plus invoices"],
      ]),
    ],
    checks: [
      { sheet: "Year", cell: "B2", expected: 38400 },
      { sheet: "Year", cell: "B3", expected: 5400 },
      { sheet: "Year", cell: "B4", expected: 2360 },
      { sheet: "Year", cell: "B5", expected: 46160 },
    ],
    guide: guide(
      "Healthcare cost tracker",
      "The sample pays R3,200 a month for medical aid and R450 for gap cover, plus R2,360 of invoices. The year is R46,160. This is not a comparison of medical schemes and it is not medical advice.",
      ["Enter the contribution that leaves your bank, including any dependants on the same debit.", "Enter only the portion of an invoice you paid. Do not enter the full provider bill if the scheme paid part of it.", "Add rows for other invoices and extend the SUM if you pass row 4.", "Use the year total in your household budget as a reality check, not as a tax deduction."],
      ["Medical aid premiums are R38,400.", "Gap cover premiums are R5,400.", "Invoices are R2,360.", "The cash total is R46,160."],
      ["Update invoices in the month you pay them.", "Keep scheme certificates for tax season in the document checklist, not in this total.", "Ask the scheme or a broker about benefits. This sheet does not know them."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(19, "Savings goal planner", "Work out the monthly amount for several goals from the target, the saved balance, and the months left.", "Each goal has its own row. Monthly required is the gap divided by the months you enter. The workbook sums those monthly amounts so you can see whether payday can carry all of them.", "People saving for more than one goal at the same time.", ["See the monthly amount per goal", "Add the goals before you promise all of them", "Keep a saved balance so you do not start from zero by mistake"], ["goals", "savings"], [179, 14, 11, 13]),
    filename: "savings-goal-planner",
    chart: [{ label: "Laptop", value: 700 }, { label: "Move", value: 1500 }, { label: "Course", value: 400 }],
    sheets: [
      grid("Goals", [20, 14, 14, 12, 16, 24], ["text", "zar", "zar", "integer", "zar", "text"], [
        ["Goal", "Target", "Saved", "Months", "Monthly", "Note"],
        ["Laptop", 14000, 2800, 16, "=IF(D2=0,0,(B2-C2)/D2)", "Study laptop"],
        ["Moving costs", 18000, 0, 12, "=IF(D3=0,0,(B3-C3)/D3)", "Deposit and a small van"],
        ["Short course", 4800, 800, 10, "=IF(D4=0,0,(B4-C4)/D4)", "Evening course fee"],
      ]),
      grid("Payday", [28, 16, 36], ["text", "zar", "text"], [
        ["Metric", "Amount", "Note"],
        ["Monthly goals", "=SUM(Goals!E2:E4)", "What payday must transfer"],
        ["Still to fund", "=SUM(Goals!B2:B4)-SUM(Goals!C2:C4)", "Targets minus balances"],
      ]),
    ],
    checks: [
      { sheet: "Goals", cell: "E2", expected: (14000 - 2800) / 16 },
      { sheet: "Goals", cell: "E3", expected: 1500 },
      { sheet: "Goals", cell: "E4", expected: 400 },
      { sheet: "Payday", cell: "B2", expected: 700 + 1500 + 400 },
      { sheet: "Payday", cell: "B3", expected: 14000 + 18000 + 4800 - 2800 - 800 },
    ],
    guide: guide(
      "Savings goal planner",
      "The laptop needs R11,200 more over 16 months, which is R700 a month. Moving costs need R1,500 a month. The course needs R400 a month. Together that is R2,600 from payday, and R33,200 is still unfunded.",
      ["Enter the full target, what you have already saved, and the months you are willing to take.", "Do not set months to zero. The formula returns zero so it does not divide by zero, and that is a signal to pick a date.", "Read Monthly goals before you open another goal.", "If payday cannot carry the total, extend a month count or pause a goal. Do not leave all three pretending they will happen."],
      ["Laptop monthly is R700.", "Moving monthly is R1,500.", "Course monthly is R400.", "The unfunded gap is R33,200."],
      ["Transfer the monthly goals on payday into separate envelopes or accounts.", "When you buy the item, set the target equal to saved so the monthly amount becomes zero.", "Do not include the emergency fund here. That has its own planner."],
    ),
  }));

  products.push(await workbookProduct({
    meta: meta(20, "Annual money review", "Look back at twelve months of surplus and set a single figure for next year.", "Each month has income, costs, and a surplus formula. The review shows the total, the average, the best month, and the worst month. Next year's monthly target is something you type, and the sheet shows the gap against the average.", "Households doing a once-a-year review of their own records.", ["See which month actually carried the year", "Use your own monthly figures, not a generic average", "Set next year's target beside the evidence"], ["annual review", "surplus"], [229, 18, 14, 16]),
    filename: "annual-money-review",
    chart: [{ label: "Best", value: 4200 }, { label: "Worst", value: -800 }, { label: "Average", value: 1850 }],
    sheets: [
      grid("Months", [16, 14, 14, 14], ["text", "zar", "zar", "zar"], [
        ["Month", "Income", "Costs", "Surplus"],
        ["Jan", 28000, 25000, "=B2-C2"],
        ["Feb", 28000, 28800, "=B3-C3"],
        ["Mar", 30000, 27000, "=B4-C4"],
        ["Apr", 30000, 26000, "=B5-C5"],
        ["May", 30000, 31000, "=B6-C6"],
        ["Jun", 32000, 29000, "=B7-C7"],
        ["Jul", 32000, 30000, "=B8-C8"],
        ["Aug", 32000, 27800, "=B9-C9"],
        ["Sep", 32000, 29500, "=B10-C10"],
        ["Oct", 34000, 31000, "=B11-C11"],
        ["Nov", 34000, 33000, "=B12-C12"],
        ["Dec", 36000, 34000, "=B13-C13"],
      ]),
      grid("Review", [32, 16, 40], ["text", "number", "text"], [
        ["Metric", "Value", "Note"],
        ["Year surplus", "=SUM(Months!D2:D13)", "Income minus costs across the year"],
        ["Average month", "=B2/12", "Year surplus divided by 12"],
        ["Best month", "=MAX(Months!D2:D13)", "Highest surplus"],
        ["Worst month", "=MIN(Months!D2:D13)", "Lowest surplus, which can be negative"],
        ["Next year monthly target", 2500, "A number you choose"],
        ["Target minus average", "=B6-B3", "Positive means the target is above the year you just had"],
      ]),
    ],
    checks: [
      { sheet: "Months", cell: "D2", expected: 3000 },
      { sheet: "Months", cell: "D3", expected: -800 },
      { sheet: "Review", cell: "B2", expected: 3000 - 800 + 3000 + 4000 - 1000 + 3000 + 2000 + 4200 + 2500 + 3000 + 1000 + 2000 },
      { sheet: "Review", cell: "B4", expected: 4200 },
      { sheet: "Review", cell: "B5", expected: -1000 },
    ],
    guide: guide(
      "Annual money review",
      "The sample year is not a smooth salary story. February and May go negative. August is the best month at R4,200. The review asks you to type next year's monthly target and see whether it is above the average you actually achieved.",
      ["Replace each month with figures from your statements. Surplus is a formula, so edit income and costs only.", "Read the worst month before you set a target.", "Type next year's target in the review sheet.", "If the target is far above the average, name the cost that will change. The sheet will not find it for you."],
      ["January surplus is R3,000. February is -R800 and May is -R1,000.", "The best sample month is R4,200 and the worst is -R1,000.", "The year surplus is the sum of the twelve formula cells.", "The sample target of R2,500 is compared with the average."],
      ["Do this once, with the statements in front of you.", "Keep the negative months visible.", "Use the household budget workbook for the months ahead. This one is the look back."],
    ),
  }));

  return products;
}
