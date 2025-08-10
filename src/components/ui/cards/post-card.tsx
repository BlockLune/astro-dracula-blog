import DateTag from "@/components/ui/tags/date-tag";
import LabelTag from "@/components/ui/tags/label-tag";
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
  const shouldReduceMotion = false;
  const initialOpacity = shouldReduceMotion ? 1 : 0;
  const initialX = shouldReduceMotion ? 0 : 10;

  const component = (
    <a
      href={snapshot.href}
      className="flex card-hoverable flex-col gap-4 p-8 text-pretty"
    >
      <h2 className="text-3xl font-bold text-dracula-pink">{snapshot.title}</h2>
      <div className="flex flex-wrap gap-2">
        <DateTag lang={lang} date={snapshot.date} />
        {snapshot.tags.sort().map((tag) => (
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
      initial={{ opacity: initialOpacity, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      {component}
    </motion.div>
  ) : (
    component
  );
}
