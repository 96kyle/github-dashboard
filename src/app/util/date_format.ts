import { format } from "date-fns-tz";

export const formatKorean = (date: string | Date, form: string): string => {
  return format(date, form, { timeZone: "Asia/Seoul" });
};
