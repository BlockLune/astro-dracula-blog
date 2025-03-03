import Fuse from "fuse.js";
import PostCard from "@/components/ui/cards/post-card";
import type { PostSnapshot } from "@/schemas/post";
import { type Lang, useTranslations } from "@/utils/i18n";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const numberOfPosts = snapshots.length;
  const { query, debouncedQuery, setQuery } = useSearchParams();

  const [visiblePostsCount, setVisiblePostsCount] = useState(5);
  const visiblePostsLengthRef = useRef(visiblePostsCount);
  const debouncedQueryRef = useRef(debouncedQuery);

  useEffect(() => {
    debouncedQueryRef.current = debouncedQuery;
  }, [debouncedQuery]);

  const visiblePosts = useMemo(() => {
    if (debouncedQuery === "") {
      return snapshots.slice(0, visiblePostsCount);
    }
    const fuse = new Fuse(snapshots, fuseOptions);
    return fuse
      .search(debouncedQuery)
      .map((result) => result.item)
      .slice(0, 5);
  }, [debouncedQuery, snapshots, visiblePostsCount]);

  useEffect(() => {
    visiblePostsLengthRef.current = visiblePosts.length;
  }, [visiblePosts.length]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          debouncedQueryRef.current === "" &&
          visiblePostsLengthRef.current < numberOfPosts
        ) {
          setVisiblePostsCount((prev) => prev + 5);
        }
      },
      { threshold: 1.0 }
    );

    const currentSentinel = sentinelRef.current;
    currentSentinel && observer.observe(currentSentinel);

    return () => {
      currentSentinel && observer.unobserve(currentSentinel);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        lang={lang}
        query={query}
        onChange={setQuery}
        totalCount={numberOfPosts}
        type="post"
      />

      {visiblePosts.length > 0 ? (
        <>
          {visiblePosts.map((snapshot) => (
            <PostCard
              lang={lang}
              snapshot={snapshot}
              animate={true}
              key={snapshot.slug}
            />
          ))}

          {debouncedQuery === "" &&
            visiblePosts.length < numberOfPosts && (
              <div
                ref={sentinelRef}
                className="h-2 w-full"
                aria-label="Load more trigger"
              />
            )}
        </>
      ) : (
        <p className="text-center">{t("search.noResults")}</p>
      )}
    </div>
  );
}
