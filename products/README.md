# MOHAO product library

200 digital products, 20 in each category. Each product is a folder of real files plus a customer zip.

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
| FIN | 20 | Excel workbooks with formulas, plus a guide |
| DSN | 20 | SVG layouts and an HTML preview. Not a Canva file |
| NOT | 20 | Markdown pages and CSV databases. Not a Notion link |
| ANL | 20 | Excel summary, CSV, data dictionary, and DAX text. Not a PBIX file |
| EBK | 20 | A guide as PDF, DOCX, and Markdown |
| AI | 20 | Prompt libraries as Markdown and CSV |
| CV | 20 | A sample CV in DOCX and a finishing guide |
| ECM | 20 | Shop kits: copy, drafts, or workbooks |
| CRS | 20 | Lessons, slides, and a worksheet |
| DEV | 20 | JavaScript modules with `node --test` |

## Status

Automated QA on 12 October 2026 passed for all 200 products. Publication status in the catalogue is still `draft`. Passing the script does not put a product on sale. A person has to approve that.

Prices are explicit in ZAR, USD, GBP, and EUR. They are not converted from one exchange rate.

## Limits

- Open the Excel files in Excel to confirm Excel's own calculation. The generator checks formulas with MOHAO's evaluator and checks that those formulas were saved.
- Finance, tax, medical, and legal drafts are practical documents, not professional advice.
- Developer tests run during generation. They passed in that run.
- Sample people, businesses, and figures are fictional.
