import { useState, useCallback, useEffect } from "react";

import PostCard from "@/components/ui/cards/post-card";
import { type Lang, useTranslations } from "@/utils/i18n";
import type { PostSnapshot } from "@/schemas/post";

const POSTS_INCREMENT = 10;

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

export default function DynamicPostStack({
  lang,
  initialSnapshots,
  totalPostCount,
}: {
  lang: Lang;
  initialSnapshots: PostSnapshot[];
  totalPostCount: number;
}) {
  const t = useTranslations(lang);

  const [visiblePosts, setVisiblePosts] =
    useState<PostSnapshot[]>(initialSnapshots);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMorePosts, setHasMorePosts] = useState(
    initialSnapshots.length < totalPostCount,
  );

  useEffect(() => {
    setHasMorePosts(visiblePosts.length < totalPostCount);
  }, [visiblePosts.length, totalPostCount]);

  const loadMorePosts = useCallback(async () => {
    if (!hasMorePosts || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const currentPostCount = visiblePosts.length;
    const remainingPosts = totalPostCount - currentPostCount;
    const countToFetch = Math.min(POSTS_INCREMENT, remainingPosts);

    if (countToFetch <= 0) {
      setIsLoading(false);
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
        setVisiblePosts((prevPosts) => [...prevPosts, ...newPosts]);
      } else if (results.some((r) => r.status === "rejected")) {
        setError(t("errorLoadingPosts"));
      } else {
      }
    } catch (err) {
      console.error("Error loading more posts:", err);
      setError(t("errorLoadingPosts"));
    } finally {
      setIsLoading(false);
    }
  }, [visiblePosts.length, totalPostCount, lang, t, hasMorePosts, isLoading]);

  return (
    <div className="flex flex-col gap-4">
      {visiblePosts.map((snapshot) => (
        <PostCard
          lang={lang}
          snapshot={snapshot}
          animate={true}
          key={snapshot.slug}
        />
      ))}

      {error && (
        <div className="p-4 text-center text-dracula-red-600 bg-dracula-red-100 border border-dracula-red-300">
          {error}
        </div>
      )}

      {hasMorePosts && (
        <button
          className="card-hoverable p-8 text-pretty text-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={loadMorePosts}
          disabled={isLoading}
        >
          {isLoading ? t("loading") : t("loadMore")}
        </button>
      )}

      {/* Show a message when no more posts are available and not loading */}
      {!hasMorePosts && !isLoading && visiblePosts.length > 0 && (
        <p className="p-4 text-center text-gray-500">{t("noMorePosts")}</p>
      )}

      {/* Optional: Handle the case where there were no initial posts and none could be loaded */}
      {!hasMorePosts && !isLoading && visiblePosts.length === 0 && !error && (
        <p className="p-4 text-center text-gray-500">{t("noPostsFound")}</p>
      )}
    </div>
  );
}
