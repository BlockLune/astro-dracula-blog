import { type Lang, useTranslations } from "@/utils/i18n";
import BaseTag from "./base-tag";

export default function NotSupportedLangTag({ lang }: { lang: Lang }) {
  const t = useTranslations(lang);

  return (
    <BaseTag title={t("post.fallbackDescription")}>
      <span className="text-dracula-red-400">{t("post.fallbackLabel")}</span>
    </BaseTag>
  );
}
