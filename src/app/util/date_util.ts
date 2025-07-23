// date_util.ts
import { endOfMonth as dfEndOfMonth, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TZ = "Asia/Seoul";

export function startOfMonthUTC(date: string | Date): Date {
  const d = new Date(date);
  const formatted = format(
    new Date(d.getFullYear(), d.getMonth(), 1),
    "yyyy-MM-dd 00:00:00"
  );
  return toZonedTime(formatted, TZ);
}

export function endOfMonthUTC(date: string | Date): Date {
  const d = new Date(date);
  const endDate = dfEndOfMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  const formatted = format(endDate, "yyyy-MM-dd 23:59:59");
  return toZonedTime(formatted, TZ);
}
