import { format } from "date-fns-tz";

export const formatKorean = (date: string, form: string): string => {
  return format(date, form, { timeZone: "Asia/Seoul" });
};
