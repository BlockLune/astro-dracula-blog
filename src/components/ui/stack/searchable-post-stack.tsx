import Fuse from "fuse.js";
import PostCard from "@/components/ui/cards/post-card";
import type { PostSnapshot } from "@/schemas/post";
import { type Lang, useTranslations } from "@/utils/i18n";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";

const fuseOptions = {
  keys: ["slug", "title", "description", "tags"],
};

async function fetchPostSnapshots(lang: Lang): Promise<PostSnapshot[]> {
  const response = await fetch(`/${lang}/posts/snapshots/index.json`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch post snapshots. Status: ${response.status}`,
    );
  }
  const data = await response.json();
  return data as PostSnapshot[];
}

export default function SearchablePostStack({
  lang,
  totalPostCount,
}: {
  lang: Lang;
  totalPostCount: number;
}) {
  const t = useTranslations(lang);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [snapshots, setSnapshots] = useState<PostSnapshot[]>([]);

  useEffect(() => {
    fetchPostSnapshots(lang)
      .then((value) => {
        setSnapshots(value);
        console.log(snapshots);
      })
      .catch((error) => {
        console.error("Error fetching post snapshots:", error);
      });
  }, [lang]);

  let results: PostSnapshot[] = [];
  if (debouncedQuery === "") {
    results = snapshots;
  } else {
    const fuse = new Fuse(snapshots, fuseOptions);
    results = fuse
      .search(debouncedQuery)
      .map((result) => result.item)
      .slice(0, 5);
  }

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
            totalPostCount +
            t("search.placeholder.secondPart.post")
          }
          className="card-input"
          value={query}
          onChange={handleOnSearch}
        />
      </div>
      {results.length > 0 ? (
        results.map((snapshot) => (
          <PostCard
            lang={lang}
            snapshot={snapshot}
            animate={true}
            key={snapshot.slug}
          />
        ))
      ) : (
        <p className="text-center">{t("search.noResults")}</p>
      )}
    </div>
  );
}
