import type { MarkdownHeading } from "astro";
import { getCollection, render } from "astro:content";

import type { Lang } from "@/utils/i18n";
import { getDescFromMdString } from "@/utils/markdown";
import { getSnapshots, getUniqueLowerCaseTagMap } from "@/utils/post";
import type { Post, PostSnapshot, RankedPostSnapshot } from "@/schemas/post";

type RenderedPost = Awaited<ReturnType<typeof render>>;

const rankedSnapshotsByLang = new Map<Lang, Promise<RankedPostSnapshot[]>>();
const rankedSnapshotsByLangAndTag = new Map<
  string,
  Promise<RankedPostSnapshot[]>
>();
const postDescriptions = new Map<string, Promise<string>>();
const postRenderResults = new Map<string, Promise<RenderedPost>>();
const tagMapsByLang = new Map<Lang, Promise<Map<string, number>>>();

let postsPromise: Promise<Post[]> | undefined;

function getOrCreatePromise<K, V>(
  cache: Map<K, Promise<V>>,
  key: K,
  create: () => Promise<V>
) {
  const cached = cache.get(key);
  if (cached) return cached;

  const promise = create().catch((error) => {
    cache.delete(key);
    throw error;
  });
  cache.set(key, promise);
  return promise;
}

function rankSnapshots(snapshots: PostSnapshot[]): RankedPostSnapshot[] {
  return snapshots.map((snapshot, index) => ({
    rank: index + 1,
    ...snapshot,
  }));
}

export function getPosts() {
  if (!postsPromise) {
    postsPromise = getCollection("posts").catch((error) => {
      postsPromise = undefined;
      throw error;
    });
  }

  return postsPromise;
}

export function getPostDescription(post: Post) {
  return getOrCreatePromise(postDescriptions, post.id, async () =>
    getDescFromMdString(post.body)
  );
}

export function getRenderedPost(post: Post) {
  return getOrCreatePromise(postRenderResults, post.id, () => render(post));
}

export async function getPostHeadings(post: Post): Promise<MarkdownHeading[]> {
  const { headings } = await getRenderedPost(post);
  return headings;
}

export function getRankedSnapshotsForLang(lang: Lang) {
  return getOrCreatePromise(rankedSnapshotsByLang, lang, async () => {
    const posts = await getPosts();
    const snapshots = await getSnapshots(posts, lang, getPostDescription);
    return rankSnapshots(snapshots);
  });
}

export function getRankedSnapshotsForTag(lang: Lang, tag: string) {
  const key = `${lang}\0${tag}`;

  return getOrCreatePromise(rankedSnapshotsByLangAndTag, key, async () => {
    const posts = await getPosts();
    const filteredPosts = posts.filter((post) =>
      getUniqueLowerCaseTagMap(post.data.tags).has(tag)
    );
    const snapshots = await getSnapshots(
      filteredPosts,
      lang,
      getPostDescription
    );
    return rankSnapshots(snapshots);
  });
}

export function getTagMapForLang(lang: Lang) {
  return getOrCreatePromise(tagMapsByLang, lang, async () => {
    const snapshots = await getRankedSnapshotsForLang(lang);
    return getUniqueLowerCaseTagMap(
      snapshots.flatMap((snapshot) => snapshot.tags)
    );
  });
}
