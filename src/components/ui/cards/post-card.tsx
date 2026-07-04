import DateTag from "@/components/ui/tags/date-tag";
import LabelTag from "@/components/ui/tags/label-tag";
import NotSupportedLangTag from "@/components/ui/tags/not-supported-lang-tag";
import type { Lang } from "@/utils/i18n";
import type { PostSnapshot } from "@/schemas/post";
import { motion } from "motion/react";

export default function PostCard({
  lang,
  snapshot,
  animate = false,
}: {
  lang: Lang;
  snapshot: PostSnapshot;
  animate?: boolean;
}) {
  const sortedTags = [...snapshot.tags].sort();

  const card = (
    <a
      href={snapshot.href}
      className="flex card-hoverable flex-col gap-4 p-8 text-pretty"
    >
      <h2 className="text-3xl font-bold text-dracula-pink">{snapshot.title}</h2>
      <div className="flex flex-wrap gap-2">
        <DateTag lang={lang} date={snapshot.date} />
        {snapshot.isFallback && <NotSupportedLangTag lang={lang} />}
        {sortedTags.map((tag) => (
          <LabelTag lang={lang} label={tag} key={tag} />
        ))}
      </div>
      <p className="line-clamp-3 break-all text-ellipsis">
        {snapshot.description}
      </p>
    </a>
  );
  return animate ? (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      {card}
    </motion.div>
  ) : (
    card
  );
}
