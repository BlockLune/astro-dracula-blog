import type { Lang } from "@/utils/i18n";
import { motion, useReducedMotion } from "motion/react";
import BaseTag from "./base-tag";

export default function LabelTag({
  lang,
  label,
  count = 1,
  type = "tag",
  large = false,
  animate = false,
}: {
  lang: Lang;
  label: string;
  count?: number;
  type?: "tag" | "link";
  large?: boolean;
  animate?: boolean;
}) {
  // const shouldReduceMotion = useReducedMotion();
  const shouldReduceMotion = false;
  const initialOpacity = shouldReduceMotion ? 1 : 0;
  const initialX = shouldReduceMotion ? 0 : 10;

  const text = count > 1 ? `${label} (${count})` : label;
  const tagComponent = (
    <BaseTag hoverable large={large}>
      <span className="text-dracula-purple">{text}</span>
    </BaseTag>
  );
  const linkTagOrNot =
    type === "link" ? (
      <a href={`/${lang}/tags/${label}`}>{tagComponent}</a>
    ) : (
      tagComponent
    );
  const animatedLinkTagOrNot = animate ? (
    <motion.div
      initial={{ opacity: initialOpacity, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      {linkTagOrNot}
    </motion.div>
  ) : (
    linkTagOrNot
  );
  return animatedLinkTagOrNot;
}
