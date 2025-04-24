import Fuse from "fuse.js";
import PostCard from "@/components/ui/cards/post-card";
import type { PostSnapshot } from "@/schemas/post";
import { type Lang, useTranslations } from "@/utils/i18n";
import { useEffect, useMemo, useRef } from "react";
import SearchInput from "@/components/ui/search-input";
import { useSearchParams } from "@/hooks/use-search-params";

const fuseOptions = {
  keys: ["slug", "title", "description", "tags"],
};

export default function PostStack({
  lang,
  snapshots,
}: {
  lang: Lang;
  snapshots: PostSnapshot[];
}) {
  const t = useTranslations(lang);
  const { query, debouncedQuery, setQuery } = useSearchParams();
  const debouncedQueryRef = useRef(debouncedQuery);

  useEffect(() => {
    debouncedQueryRef.current = debouncedQuery;
  }, [debouncedQuery]);

  const searchResults = useMemo(() => {
    if (debouncedQuery === "") {
      return snapshots;
    }
    const fuse = new Fuse(snapshots, fuseOptions);
    return fuse
      .search(debouncedQuery)
      .map((result) => result.item)
      .slice(0, 5);
  }, [debouncedQuery, snapshots]);

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        lang={lang}
        query={query}
        onChange={setQuery}
        totalCount={snapshots.length}
        type="post"
      />

      {searchResults.length > 0 ? (
        <>
          {searchResults.map((snapshot) => (
            <PostCard
              lang={lang}
              snapshot={snapshot}
              animate={true}
              key={snapshot.slug}
            />
          ))}
        </>
      ) : (
        <p className="text-center">{t("search.noResults")}</p>
      )}
    </div>
  );
}
