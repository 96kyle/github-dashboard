import { format, toZonedTime } from "date-fns-tz";
import { ko } from "date-fns/locale";

export const formatKorean = (date: string | Date, form: string): string => {
  const kstDate = toZonedTime(date, "Asia/Seoul");
  return format(kstDate, form, { timeZone: "Asia/Seoul", locale: ko });
};
