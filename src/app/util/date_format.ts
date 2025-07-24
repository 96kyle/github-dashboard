import { format, toZonedTime } from "date-fns-tz";

const timeZone = "Asia/Seoul";

export const formatKorean = (date: string | Date, form: string): string => {
  const koreaTime = toZonedTime(date, timeZone);

  return format(koreaTime, form);
};
