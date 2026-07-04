import type { Post, PostSnapshot, Slug } from "@/schemas/post";
import { type Lang, defaultLang } from "@/utils/i18n";
import { getDescFromMdString } from "@/utils/markdown";

export const getLangFromId = (id: string): Lang => {
  const [lang] = id.split("/");
  return lang as Lang;
};

export const getSlugFromId = (id: string): Slug => {
  const separatorIndex = id.indexOf("/");
  return separatorIndex === -1 ? id : id.slice(separatorIndex + 1);
};

/**
 * Returns a map of which
 * - keys are pure slugs and
 * - values are posts with that pure slug
 */
export const classifyByLangs = (posts: Post[]) => {
  const map = new Map<Slug, Post[]>();
  for (const post of posts) {
    const slug = getSlugFromId(post.id);
    const postsWithSlug = map.get(slug);

    if (postsWithSlug) {
      postsWithSlug.push(post);
    } else {
      map.set(slug, [post]);
    }
  }
  return map;
};

export type ResolvedPost = {
  post: Post;
  requestedLang: Lang;
  actualLang: Lang;
  slug: Slug;
  isFallback: boolean;
  availableLangs: Lang[];
};

/**
 * Resolves one logical post for the requested language, in the order of:
 *
 * 1. The post with the requested language.
 * 2. The post with the default language.
 * 3. The first available post version.
 */
export const resolvePostForLang = (
  postsWithSameSlug: Post[],
  requestedLang: Lang
): ResolvedPost => {
  if (postsWithSameSlug.length === 0) {
    throw new Error("Cannot resolve post from an empty post list");
  }

  const findPostByLang = (lang: Lang) =>
    postsWithSameSlug.find((version) => getLangFromId(version.id) === lang);
  const post =
    findPostByLang(requestedLang) ??
    findPostByLang(defaultLang) ??
    postsWithSameSlug[0];
  const actualLang = getLangFromId(post.id);

  return {
    post,
    requestedLang,
    actualLang,
    slug: getSlugFromId(post.id),
    isFallback: actualLang !== requestedLang,
    availableLangs: postsWithSameSlug.map((version) =>
      getLangFromId(version.id)
    ),
  };
};

export const resolveUniquePostsByLang = (
  posts: Post[],
  requestedLang: Lang
): ResolvedPost[] => {
  const classified = classifyByLangs(posts);
  return Array.from(classified.values()).map((postsWithSameSlug) =>
    resolvePostForLang(postsWithSameSlug, requestedLang)
  );
};

/** Compatibility layer returning only resolved post entries. */
export const makeUniqueByLang = (posts: Post[], expectedLang: Lang) =>
  resolveUniquePostsByLang(posts, expectedLang).map(
    (resolved) => resolved.post
  );

/**
 * Gets the snapshots of posts. They are unique to languages, and sorted by date.
 */
type PostDescriptionGetter = (post: Post) => string | Promise<string>;

export const getSnapshots = async (
  posts: Post[],
  expectedLang: Lang,
  getPostDescription: PostDescriptionGetter = (post) =>
    getDescFromMdString(post.body)
): Promise<PostSnapshot[]> => {
  const resolvedPosts = resolveUniquePostsByLang(posts, expectedLang);
  const sorted = [...resolvedPosts].sort((a, b) => {
    const dateA = a.post.data.updated || a.post.data.date;
    const dateB = b.post.data.updated || b.post.data.date;
    return dateB.getTime() - dateA.getTime();
  });
  return Promise.all(
    sorted.map(async (resolved) => {
      const {
        post,
        requestedLang,
        actualLang,
        slug,
        isFallback,
        availableLangs,
      } = resolved;

      return {
        href: `/${requestedLang}/posts/${slug}`,
        title: post.data.title,
        date: getCloserFormattedDate(
          post.data.updated?.toISOString(),
          post.data.date.toISOString()
        )!,
        description: await getPostDescription(post),
        slug,
        tags: Array.from(getUniqueLowerCaseTagMap(post.data.tags).keys()),
        requestedLang,
        actualLang,
        isFallback,
        availableLangs,
      };
    })
  );
};

/**
 * Returns a Map of tags with their lowercase versions as keys and counts as values.
 * @param tags - An array of tags.
 * @returns A Map of tags with their lowercase versions as keys and counts as values.
 */
export const getUniqueLowerCaseTagMap = (
  tags: string[]
): Map<string, number> => {
  const tagCounts = new Map<string, number>();
  for (const tag of tags) {
    const lowercaseTag = tag.toLowerCase();
    tagCounts.set(lowercaseTag, (tagCounts.get(lowercaseTag) || 0) + 1);
  }
  return tagCounts;
};

/**
 * Returns the later of two date strings formatted as YYYY-MM-DD.
 */
export const getCloserFormattedDate = (
  dateStringA?: string,
  dateStringB?: string
) => {
  if (!dateStringA && !dateStringB) return undefined;
  if (!dateStringA) return dateStringB;
  if (!dateStringB) return dateStringA;

  const dateA = new Date(dateStringA);
  const dateB = new Date(dateStringB);
  const dateToReturn = dateA < dateB ? dateB : dateA;
  return dateToReturn.toISOString().slice(0, 10);
};
