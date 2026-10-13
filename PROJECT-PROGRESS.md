# MOHAO digital products project

Updated 12 October 2026 after the product generator completed.

## Decisions

- The product gallery is the site homepage at `/`. The Mohao Tech services pages stay at `/studio`, `/about`, `/services`, and `/contact`.
- Palette already in the site: warm grey `#f4f3ef`, ink `#0b0b0b`, orange `#ff6a1a`.
- Prices are stored per currency. They are not converted with an invented rate.
- Customer files live in `products/library/{id}/customer` and `{id}.zip`. `internal/` is not in the zip.
- Products stay `draft` after automated QA until a person approves them for sale.
- Design kits are SVG and HTML, not Canva files.
- Notion packs are Markdown and CSV, not hosted Notion templates.
- Analytics packs include DAX text and CSV, not a PBIX file.
- Private downloads must not be placed in `public/`.

## Phase 1

`pnpm products:generate` on 12 October 2026 built 200 products. `products/QA-REPORT.md` records 200 passed and 0 failed. Catalogue: `products/catalogue.csv`.

| Code | Category | Result |
| --- | --- | --- |
| FIN-001–020 | Personal finance workbooks | 20 passed |
| DSN-001–020 | SVG design kits | 20 passed |
| NOT-001–020 | Notion import packages | 20 passed |
| ANL-001–020 | Excel, CSV, and DAX packs | 20 passed |
| EBK-001–020 | Guides | 20 passed |
| AI-001–020 | Prompt packs | 20 passed |
| CV-001–020 | CV kits | 20 passed |
| ECM-001–020 | E-commerce kits | 20 passed |
| CRS-001–020 | Courses | 20 passed |
| DEV-001–020 | Developer modules, tests run | 20 passed |

Formula unit tests: `pnpm exec vitest run scripts/products/formula.test.ts`.

What the automated check does not do: it does not open every file in Microsoft Excel, Word, or Power BI Desktop, and it does not approve a product for sale.

## Phase 2

The homepage at `/` is a product gallery: categories in a side list, search, and a preview row for each category. `/shop` redirects there. It reads `products/library/*/internal/meta.json` and shows covers from a route that does not serve the zip. Each product page shows the product itself: workbook sheets, every design layout, the lesson or prompt list with the first piece open, or the sample CV. The downloadable files are not served. Category pages, product pages, search, currency (ZAR default), and a cart exist. The cart does not charge a card. Yoco, PayFast, Ozow, Apple Pay, Google Pay, and Samsung Pay are not connected. Products remain drafts. Order tables, customer accounts, and the admin catalogue are still to build. The services studio is at `/studio`.

## Not claimed

- No payment provider is connected.
- No product is published for sale.
- No native Canva, Notion, or PBIX deliverable exists.
