# Pipeline weighted value data dictionary

*Sample rows. Replace them with your export.*

Open opportunity value by stage. Weighting is not applied because the stage odds were not measured.

| Column | Meaning |
| --- | --- |
| Month | Calendar month in YYYY-MM. One row is one month and one name. |
| Name | The store, plan, team, or other label in this pack. |
| Value | The measure for that row. Do not mix currencies inside the column. |

## DAX

Create the table named Facts from the CSV, then paste these measures. They will fail if you rename the table or the columns.

- Total Value = SUM(Facts[Value]) — Adds every Value row.
- Value rows = COUNTROWS(Facts) — Counts the rows in the sample, which is one row per month and name.
- Average Value = DIVIDE(SUM(Facts[Value]), COUNTROWS(Facts)) — Average per row, not per day.

> The workbook and CSV are sample data for learning the model. A PBIX file is not included. Paste the DAX into Power BI Desktop after you load the CSV. This is not a financial audit.
