import { toZonedTime, format } from "date-fns-tz";

export const ConvertUTCToLocalDateTime = (utcDate: string): string => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const zonedDate = toZonedTime(utcDate, timeZone);

  console.log("INPUT:", utcDate);
  console.log("TIMEZONE:", timeZone);
  console.log("LOCAL:", zonedDate.toString());
  return format(zonedDate, "dd.MM.yyyy HH:mm", { timeZone });
};

export const ConvertDateTimeToDateOnly = (utcDate: string): string => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const zonedDate = toZonedTime(utcDate, timeZone);
  return format(zonedDate, "dd.MM.yyyy", { timeZone });
};

export const ConvertDateTimeToTimeOnly = (utcDate: string): string => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const zonedDate = toZonedTime(utcDate, timeZone);
  return format(zonedDate, "HH:mm", { timeZone });
};

export const FormatDateOnly = (date: string): string => {
  return format(date, "dd.MM.yyyy");
};

export const FormatDateOnlyToBackendFormat = (date: string): string => {
  return format(date, "yyyy-MM-dd");
};
