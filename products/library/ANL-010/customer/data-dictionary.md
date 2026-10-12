# Cafe covers data dictionary

*Sample rows. Replace them with your export.*

Covers served by daypart.

| Column | Meaning |
| --- | --- |
| Month | Calendar month in YYYY-MM. One row is one month and one name. |
| Name | The store, plan, team, or other label in this pack. |
| Covers | The measure for that row. Do not mix currencies inside the column. |

## DAX

Create the table named Facts from the CSV, then paste these measures. They will fail if you rename the table or the columns.

- Total Covers = SUM(Facts[Covers]) — Adds every Covers row.
- Covers rows = COUNTROWS(Facts) — Counts the rows in the sample, which is one row per month and name.
- Average Covers = DIVIDE(SUM(Facts[Covers]), COUNTROWS(Facts)) — Average per row, not per day.

> The workbook and CSV are sample data for learning the model. A PBIX file is not included. Paste the DAX into Power BI Desktop after you load the CSV. This is not a financial audit.
