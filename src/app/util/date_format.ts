import { format, toZonedTime } from "date-fns-tz";

export const formatKorean = (date: string | Date, form: string): string => {
  const kstDate = toZonedTime(new Date(date), "Asia/Seoul");
  return format(kstDate, form, { timeZone: "Asia/Seoul" });
};
