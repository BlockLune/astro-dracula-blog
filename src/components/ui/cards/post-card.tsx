import DateTag from "@/components/ui/tags/date-tag";
import LabelTag from "@/components/ui/tags/label-tag";
import type { Lang } from "@/utils/i18n";
import type { PostSnapshot } from "@/schemas/post";
import { motion, useReducedMotion } from "motion/react";

export default function PostCard({
  lang,
  snapshot,
  animate = false,
}: {
  lang: Lang;
  snapshot: PostSnapshot;
  animate?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const initialOpacity = shouldReduceMotion ? 1 : 0;
  const initialX = shouldReduceMotion ? 0 : 10;

  const component = (
    <a
      href={snapshot.href}
      className="card-hoverable p-8 text-pretty flex flex-col gap-4"
    >
      <h2 className="font-bold text-3xl text-dracula-pink">{snapshot.title}</h2>
      <div className="flex flex-wrap gap-2">
        <DateTag lang={lang} date={snapshot.date} />
        {snapshot.tags.sort().map((tag) => (
          <LabelTag lang={lang} label={tag} key={tag} />
        ))}
      </div>
      <p className="text-ellipsis break-all line-clamp-3">
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
