import { MISC } from "@/config";

export function getDiffInDays(
  date1: number | string | Date,
  date2: number | string | Date
) {
  const diffInMilliseconds =
    new Date(date1).getTime() - new Date(date2).getTime();
  const diffInDays = Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return Math.abs(diffInDays);
}

export function getFormattedDate(date: number | string | Date) {
  return new Date(date).toISOString().slice(0, 10);
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
