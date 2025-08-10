import avatarImage from "@/assets/avatar.webp";
import type { Lang } from "@/utils/i18n";
import { AUTHOR, SOCIALS } from "@/config";
import { motion } from "motion/react";

export default function BusinessCard({ lang }: { lang: Lang }) {
  const shouldReduceMotion = false;
  const initialOpacity = shouldReduceMotion ? 1 : 0;
  const initialX = shouldReduceMotion ? 0 : 10;

  return (
    <motion.div
      initial={{ opacity: initialOpacity, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
      className="flex w-full flex-col items-center gap-12 card-static p-8 text-pretty sm:flex-row md:w-2/3"
    >
      <motion.img
        src={avatarImage.src}
        alt="avatar"
        className="h-32 w-32 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
      <div className="flex flex-col gap-4 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-dracula-pink">{AUTHOR.name}</h2>
        <p className="text-pretty">{AUTHOR.bio[lang]}</p>
        <p className="flex justify-center gap-4 sm:justify-start">
          {SOCIALS.map((social) => (
            <a
              className="text-dracula-cyan underline underline-offset-4 transition hover:text-dracula-purple"
              href={social.href}
              title={social.linkTitle}
              key={social.name}
            >
              {social.name}
            </a>
          ))}
        </p>
      </div>
    </motion.div>
  );
}
