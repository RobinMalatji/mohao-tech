import { describe, expect, it } from "vitest";
import { evaluateCell, type WorkbookInput } from "./formula";

function workbook(): WorkbookInput {
  return {
    Inputs: [
      ["Label", "Value"],
      ["Pay", 32500],
      ["Side", 2500],
      ["Rate", 0.175],
      ["Years", 5],
      ["Principal", 100000],
    ],
    Expenses: [
      ["Item", "Amount", "Keep"],
      ["Rent", 9500, "Yes"],
      ["Food", 4200, "Yes"],
      ["Hobby", 600, "No"],
    ],
    Summary: [
      ["Income", "=Inputs!B2+Inputs!B3"],
      ["Costs", "=SUM(Expenses!B2:B4)"],
      ["Kept", '=SUMIF(Expenses!C2:C4,"Yes",Expenses!B2:B4)'],
      ["Surplus", "=B1-B2"],
      ["Rate", "=IF(B1=0,0,B4/B1)"],
      ["Payment", "=PMT(0.05/12,60,100000)"],
      ["Loan", "=PMT(Inputs!B4/12,Inputs!B5*12,Inputs!B6)"],
      ["Future", "=FV(0.08/12,12*10,-2000,-5000)"],
      ["Rounded", "=ROUND(B4,2)"],
    ],
  };
}

describe("workbook formulas", () => {
  const sheets = workbook();

  it("adds cells across sheets", () => {
    expect(evaluateCell(sheets, "Summary", "B1")).toBe(35000);
  });

  it("sums a column", () => {
    expect(evaluateCell(sheets, "Summary", "B2")).toBe(14300);
  });

  it("sums rows that match a label", () => {
    expect(evaluateCell(sheets, "Summary", "B3")).toBe(13700);
  });

  it("calculates a surplus and a ratio", () => {
    expect(evaluateCell(sheets, "Summary", "B4")).toBe(20700);
    expect(evaluateCell(sheets, "Summary", "B5")).toBeCloseTo(20700 / 35000, 8);
  });

  it("matches Excel PMT for a fixed-rate loan", () => {
    expect(evaluateCell(sheets, "Summary", "B6")).toBeCloseTo(-1887.12, 2);
    expect(evaluateCell(sheets, "Summary", "B7")).toBeCloseTo(-2512.22, 2);
  });

  it("matches Excel FV for monthly contributions", () => {
    const future = evaluateCell(sheets, "Summary", "B8");
    expect(typeof future).toBe("number");
    expect(future as number).toBeGreaterThan(350000);
    expect(future as number).toBeLessThan(380000);
  });

  it("counts matching labels and finds the extreme surplus", () => {
    expect(evaluateCell({
      Documents: [
        ["Status"],
        ["Have"],
        ["Missing"],
        ["Have"],
      ],
      Count: [['=COUNTIF(Documents!A2:A4,"Have")'], ["=MAX(Documents!A2:A4)"]],
    }, "Count", "A1")).toBe(2);
  });

  it("estimates a shorter payoff when the extra payment is included", () => {
    expect(evaluateCell({
      Sheet: [["=NPER(0.22/12,-(450+1500),8500)"]],
    }, "Sheet", "A1")).toBeCloseTo(4.5845, 3);
  });

  it("rounds half away from zero", () => {
    expect(evaluateCell({ Sheet: [["=ROUND(-1.5,0)"]] }, "Sheet", "A1")).toBe(-2);
  });
});
