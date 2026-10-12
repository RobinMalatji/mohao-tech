export function bucketKey(isoDate, grain) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) throw new Error("Date is not valid.");
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  if (grain === "month") return year + "-" + month;
  if (grain === "day") return year + "-" + month + "-" + day;
  if (grain === "week") {
    const utc = new Date(Date.UTC(year, date.getUTCMonth(), date.getUTCDate()));
    const weekday = utc.getUTCDay() || 7;
    utc.setUTCDate(utc.getUTCDate() - weekday + 1);
    const weekMonth = String(utc.getUTCMonth() + 1).padStart(2, "0");
    const weekDay = String(utc.getUTCDate()).padStart(2, "0");
    return utc.getUTCFullYear() + "-" + weekMonth + "-" + weekDay;
  }
  throw new Error("Grain must be day, week, or month.");
}
