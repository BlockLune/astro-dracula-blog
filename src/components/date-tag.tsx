import { MISC } from "../config";

export default function DateTag({ date, type }: { date: string, type?: "published" | "updated" }) {
  const now = new Date();
  const target = new Date(date);
  const diffInMilliseconds: number = now.getTime() - target.getTime();
  const diffInDays = Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));

  const color =
    diffInDays > MISC.dateTag.daysToBeGreen
      ? "text-dracula-orange"
      : "text-dracula-green";

  const formattedDate = new Date(date).toISOString().slice(0, 10);

  /**
   * If type is given, it will display the type and the date.
   * The published type label is green, updated is orange.
   *
   * Otherwise, it will only display the date.
   * If the date is more than 7 days ago, it will be orange, otherwise green.
   */
  return (
    <div className="flex items-center">
      {
        type ? (
          <code className="inline-block bg-dracula-dark/30 px-2 py-1">
            <span
              className={
                type === "published"
                  ? "text-dracula-orange"
                  : "text-dracula-green"
              }
            >
              <span className="capitalize">{type}</span> at
            </span>
            &nbsp;
            <span>{formattedDate}</span>
          </code>
        ) : (
          <code className={`inline-block bg-dracula-dark/30 px-2 py-1 ${color}`}>
            {formattedDate}
          </code>
        )
      }
    </div>
  );
}
