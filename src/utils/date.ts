import { MISC } from "@/config";
import type { Lang } from "./i18n";

export function getDiffInDays(
  date1: number | string | Date,
  date2: number | string | Date
) {
  const diffInMilliseconds =
    new Date(date1).getTime() - new Date(date2).getTime();
  const diffInDays = Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return Math.abs(diffInDays);
}

const localeMap: Record<Lang, string> = {
  en: "en-US",
  zh: "zh-CN",
  id: "id-ID",
};

export function getFormattedDate(date: number | string | Date, lang?: Lang) {
  if (!lang) {
    return new Date(date).toISOString().slice(0, 10);
  }

  const locale = localeMap[lang] || "en-US";
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function getColor(diffInDays: number) {
  if (diffInDays <= MISC.dateTag.daysToBeGreen) {
    return "green";
  }
  if (diffInDays > MISC.dateTag.daysToBeRed) {
    return "red";
  }
  return "orange";
}
