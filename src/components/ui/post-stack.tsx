import Fuse from "fuse.js";
import PostCard from "@/components/ui/cards/post-card";
import type { PostSnapshot } from "@/schemas/post";
import { type Lang, useTranslations } from "@/utils/i18n";
import { useDebounce } from "use-debounce";
import { useEffect, useMemo, useRef, useState } from "react";

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


  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const debouncedQueryRef = useRef(debouncedQuery);
  useEffect(() => {
    debouncedQueryRef.current = debouncedQuery;
  }, [debouncedQuery]);


  const [visiblePostsCount, setVisiblePostsCount] = useState(5);
  const visiblePostsLengthRef = useRef(visiblePostsCount);
  const visiblePosts = useMemo(() => {
    if (debouncedQuery === "") {
      return snapshots.slice(0, visiblePostsCount);
    }
    const fuse = new Fuse(snapshots, fuseOptions);
    return fuse
      .search(debouncedQuery)
      .map((result) => result.item)
      .slice(0, 5); // Limit search results to 5
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
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      observer.disconnect();
    };
  }, []);

  function handleOnSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <label className="sr-only" htmlFor="search">
          Search
        </label>
        <input
          id="search"
          type="text"
          placeholder={
            t("search.placeholder.firstPart") +
            numberOfPosts +
            t("search.placeholder.secondPart.post")
          }
          className="card-input"
          value={query}
          onChange={handleOnSearch}
        />
      </div>

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
