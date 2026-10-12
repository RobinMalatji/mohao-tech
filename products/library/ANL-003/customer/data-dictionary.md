# Inventory units on hand data dictionary

*Sample rows. Replace them with your export.*

Units on hand by category for a home-goods shop.

| Column | Meaning |
| --- | --- |
| Month | Calendar month in YYYY-MM. One row is one month and one name. |
| Name | The store, plan, team, or other label in this pack. |
| Units | The measure for that row. Do not mix currencies inside the column. |

## DAX

Create the table named Facts from the CSV, then paste these measures. They will fail if you rename the table or the columns.

- Total Units = SUM(Facts[Units]) — Adds every Units row.
- Units rows = COUNTROWS(Facts) — Counts the rows in the sample, which is one row per month and name.
- Average Units = DIVIDE(SUM(Facts[Units]), COUNTROWS(Facts)) — Average per row, not per day.

> The workbook and CSV are sample data for learning the model. A PBIX file is not included. Paste the DAX into Power BI Desktop after you load the CSV. This is not a financial audit.
