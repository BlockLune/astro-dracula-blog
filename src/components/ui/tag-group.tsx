import Fuse from "fuse.js";
import LabelTag from "@/components/ui/tags/label-tag";
import SearchInput from "@/components/ui/search-input";
import { useTranslations, type Lang } from "@/utils/i18n";
import { useSearchParams } from "@/hooks/use-search-params";

export default function TagGroup({
  lang,
  tagMap,
}: {
  lang: Lang;
  tagMap: Map<string, number>;
}) {
  const t = useTranslations(lang);
  const { query, debouncedQuery, setQuery } = useSearchParams();
  const numberOfTags = tagMap.size;

  let results: string[] = [];
  if (debouncedQuery !== "") {
    const fuse = new Fuse(Array.from(tagMap.keys()));
    results = fuse.search(debouncedQuery).map((result) => result.item);
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        lang={lang}
        query={query}
        onChange={setQuery}
        totalCount={numberOfTags}
        type="tag"
      />

      <div className="flex flex-wrap gap-2">
        {debouncedQuery === "" ? (
          Array.from(tagMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => (
              <LabelTag
                lang={lang}
                label={tag}
                count={count}
                type="link"
                key={tag}
                animate={true}
              />
            ))
        ) : results.length > 0 ? (
          results.map((tag) => (
            <LabelTag
              lang={lang}
              label={tag}
              count={tagMap.get(tag)}
              type="link"
              key={tag}
              animate={true}
            />
          ))
        ) : (
          <p className="text-center">{t("search.noResults")}</p>
        )}
      </div>
    </div>
  );
}
