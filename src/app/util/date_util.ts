import { endOfMonth, parse, format } from "date-fns";
import { toDate } from "date-fns-tz";

const TIMEZONE = "Asia/Seoul";

function parseSeoulToUTC(dateStr: string): Date {
  const parsed = parse(dateStr, "yyyy-MM-dd HH:mm:ss", new Date());
  return toDate(parsed, { timeZone: TIMEZONE });
}

export function startOfMonthUTC(date: Date | string): Date {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = d.getMonth();
  const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-01 00:00:00`;
  return parseSeoulToUTC(dateStr);
}

export function endOfMonthUTC(date: Date | string): Date {
  const d = new Date(date);
  const endDate = endOfMonth(d);
  const dateStr = `${format(endDate, "yyyy-MM-dd")} 23:59:59`;
  return parseSeoulToUTC(dateStr);
}
