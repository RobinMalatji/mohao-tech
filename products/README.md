# MOHAO product library

10 digital products, one in each category. Each product is a folder of real files plus a customer zip. The other generated products were removed from this library on 19 October 2026.

Regenerate everything with:

```bash
pnpm products:generate
```

The command writes:

- `products/library/{ID}/customer/` — files a buyer is allowed to receive
- `products/library/{ID}/{ID}.zip` — those files only
- `products/library/{ID}/internal/` — QA notes, not inside the zip
- `products/catalogue.csv` and `products/catalogue.xlsx`
- `products/QA-REPORT.md`

## Categories

| Code | Count | What the buyer gets |
| --- | --- | --- |
| FIN-001 | 1 | Excel workbook with formulas, plus a guide |
| DSN-001 | 1 | SVG layouts and an HTML preview. Not a Canva file |
| NOT-001 | 1 | Markdown pages and CSV databases. Not a Notion link |
| ANL-001 | 1 | Excel summary, CSV, data dictionary, and DAX text. Not a PBIX file |
| EBK-001 | 1 | A guide as PDF, DOCX, and Markdown |
| AI-001 | 1 | Prompt library as Markdown and CSV |
| CV-001 | 1 | A sample CV in DOCX and a finishing guide |
| ECM-001 | 1 | Shop kit: copy, drafts, or a workbook |
| CRS-001 | 1 | Lessons, slides, and a worksheet |
| DEV-001 | 1 | JavaScript module with `node --test` |

## Status

Automated QA on 12 October 2026 passed for the original 200 products. The shop library now keeps the first product in each category. Publication status is still `draft`. Passing the script does not put a product on sale. A person has to approve that.

Prices are explicit in ZAR, USD, GBP, and EUR. They are not converted from one exchange rate.

## Limits

- Open the Excel files in Excel to confirm Excel's own calculation. The generator checks formulas with MOHAO's evaluator and checks that those formulas were saved.
- Finance, tax, medical, and legal drafts are practical documents, not professional advice.
- Developer tests run during generation. They passed in that run.
- Sample people, businesses, and figures are fictional.
