# Donor receipts data dictionary

*Sample rows. Replace them with your export.*

Receipts by fund for a small nonprofit. Not a set of financial statements.

| Column | Meaning |
| --- | --- |
| Month | Calendar month in YYYY-MM. One row is one month and one name. |
| Name | The store, plan, team, or other label in this pack. |
| Receipts | The measure for that row. Do not mix currencies inside the column. |

## DAX

Create the table named Facts from the CSV, then paste these measures. They will fail if you rename the table or the columns.

- Total Receipts = SUM(Facts[Receipts]) — Adds every Receipts row.
- Receipts rows = COUNTROWS(Facts) — Counts the rows in the sample, which is one row per month and name.
- Average Receipts = DIVIDE(SUM(Facts[Receipts]), COUNTROWS(Facts)) — Average per row, not per day.

> The workbook and CSV are sample data for learning the model. A PBIX file is not included. Paste the DAX into Power BI Desktop after you load the CSV. This is not a financial audit.
