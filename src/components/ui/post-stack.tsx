import { useState, useCallback, useEffect, useRef } from "react";
import Fuse from "fuse.js";

import PostCard from "@/components/ui/cards/post-card";
import { type Lang, useTranslations } from "@/utils/i18n";
import type { PostSnapshot } from "@/schemas/post";
import SearchInput from "@/components/ui/search-input";
import { useSearchParams } from "@/hooks/use-search-params";

const POSTS_INCREMENT = 10;

const fuseOptions = {
  keys: ["slug", "title", "description", "tags"],
};

async function fetchPostSnapshotByRank(
  rank: number,
  lang: Lang,
): Promise<PostSnapshot> {
  const response = await fetch(`/${lang}/posts/snapshots/${rank}.json`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch post snapshot with rank ${rank}. Status: ${response.status}`,
    );
  }
  const data = await response.json();
  return data as PostSnapshot;
}

async function fetchAllPostSnapshots(lang: Lang): Promise<PostSnapshot[]> {
  const response = await fetch(`/${lang}/posts/snapshots/index.json`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch post snapshots. Status: ${response.status}`,
    );
  }
  const data = await response.json();
  return data as PostSnapshot[];
}

export default function PostStack({
  lang,
  initialSnapshots,
  totalPostCount,
}: {
  lang: Lang;
  initialSnapshots: PostSnapshot[];
  totalPostCount: number;
}) {
  const t = useTranslations(lang);
  const { query, debouncedQuery, setQuery } = useSearchParams();

  const [posts, setPosts] = useState<PostSnapshot[]>(initialSnapshots);
  const [allPostsForSearch, setAllPostsForSearch] = useState<PostSnapshot[]>(
    [],
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMorePosts, setHasMorePosts] = useState(
    initialSnapshots.length < totalPostCount,
  );
  const [searchResults, setSearchResults] = useState<PostSnapshot[]>([]);

  const hasLoadedAllPosts = useRef(false);

  // check if there are more posts to load
  useEffect(() => {
    setHasMorePosts(posts.length < totalPostCount);
  }, [posts.length, totalPostCount]);

  // fetch all post snapshots when the component mounts
  useEffect(() => {
    if (!hasLoadedAllPosts.current) {
      setIsLoadingSearch(true);
      fetchAllPostSnapshots(lang)
        .then((snapshots) => {
          setAllPostsForSearch(snapshots);
          setIsLoadingSearch(false);
          hasLoadedAllPosts.current = true;
        })
        .catch((err) => {
          console.error("Error fetching all post snapshots:", err);
          setError(t("errorLoadingSearchData"));
          setIsLoadingSearch(false);
        });
    }
  }, [lang, t]);

  // handle language change
  useEffect(() => {
    hasLoadedAllPosts.current = false;

    setPosts(initialSnapshots);
    setAllPostsForSearch([]);
    setSearchResults([]);
    setError(null);
  }, [lang, initialSnapshots]);

  // handle search input change
  useEffect(() => {
    if (!debouncedQuery || allPostsForSearch.length === 0) {
      setSearchResults([]);
      return;
    }

    const fuse = new Fuse(allPostsForSearch, fuseOptions);
    const results = fuse
      .search(debouncedQuery)
      .map((result) => result.item)
      .slice(0, 5);

    setSearchResults(results);
  }, [debouncedQuery, allPostsForSearch]);

  // function to load more posts
  const loadMorePosts = useCallback(async () => {
    // don't load more posts if
    // - there are no more posts
    // - already loading more posts
    // - in search mode
    if (!hasMorePosts || isLoadingMore || debouncedQuery) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    const currentPostCount = posts.length;
    const remainingPosts = totalPostCount - currentPostCount;
    const countToFetch = Math.min(POSTS_INCREMENT, remainingPosts);

    if (countToFetch <= 0) {
      setIsLoadingMore(false);
      setHasMorePosts(false);
      return;
    }

    const ranksToFetch = Array.from(
      { length: countToFetch },
      (_, i) => currentPostCount + i + 1,
    );

    try {
      const fetchPromises = ranksToFetch.map((rank) =>
        fetchPostSnapshotByRank(rank, lang),
      );
      const results = await Promise.allSettled(fetchPromises);

      const newPosts: PostSnapshot[] = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          newPosts.push(result.value);
        } else {
          console.error(
            `Error fetching post with rank ${ranksToFetch[index]}:`,
            result.reason,
          );
          setError(t("errorLoadingSomePosts"));
        }
      });

      if (newPosts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      } else if (results.some((r) => r.status === "rejected")) {
        setError(t("errorLoadingPosts"));
      }
    } catch (err) {
      console.error("Error loading more posts:", err);
      setError(t("errorLoadingPosts"));
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    posts.length,
    totalPostCount,
    lang,
    t,
    hasMorePosts,
    isLoadingMore,
    debouncedQuery,
  ]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
  };

  const isSearchMode = debouncedQuery.length > 0;
  const postsToDisplay = isSearchMode ? searchResults : posts;

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        lang={lang}
        query={query}
        onChange={handleSearchChange}
        totalCount={totalPostCount}
        type="post"
      />

      {isLoadingSearch && debouncedQuery && (
        <div className="p-4 text-center text-gray-500">{t("loading")}</div>
      )}

      {postsToDisplay.length > 0 ? (
        postsToDisplay.map((snapshot) => (
          <PostCard
            lang={lang}
            snapshot={snapshot}
            animate={true}
            key={snapshot.slug}
          />
        ))
      ) : (
        <p className="p-4 text-center text-gray-500">
          {isSearchMode ? t("search.noResults") : t("noPostsFound")}
        </p>
      )}

      {error && (
        <div className="p-4 text-center text-dracula-red-600 bg-dracula-red-100 border border-dracula-red-300">
          {error}
        </div>
      )}

      {!isSearchMode && hasMorePosts && (
        <button
          className="card-hoverable p-4 text-pretty text-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={loadMorePosts}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? t("loading") : t("loadMore")}
        </button>
      )}

      {!isSearchMode && !hasMorePosts && !isLoadingMore && posts.length > 0 && (
        <p className="p-4 text-center text-gray-500">{t("noMorePosts")}</p>
      )}
    </div>
  );
}
