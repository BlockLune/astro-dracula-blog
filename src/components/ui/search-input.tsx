import { type Lang, useTranslations } from "@/utils/i18n";
import { useEffect } from "react";
import { useSearchParams } from "@/hooks/use-search-params";

export default function SearchInput({
  lang,
  query,
  onChange,
  totalCount,
  type,
}: {
  lang: Lang;
  query: string;
  onChange: (value: string) => void;
  totalCount: number;
  type: "post" | "tag";
}) {
  const t = useTranslations(lang);

  return (
    <div className="flex flex-col">
      <label className="sr-only" htmlFor="search">
        Search
      </label>
      <input
        id="search"
        type="text"
        placeholder={
          t("search.placeholder.firstPart") +
          totalCount +
          t(`search.placeholder.secondPart.${type}`)
        }
        className="card-input"
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
