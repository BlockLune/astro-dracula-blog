import type { CollectionEntry } from "astro:content";
import { z } from "astro/zod";

// From astro v5, the original `slug` is now `id`
// I use `slug` as a pure slug, which is the part after the first `/`
// the part before the first `/` is the language
export type Slug = string;

export const PostFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  categories: z.array(z.string()).optional(),
  abbrlink: z.string().optional(),
  date: z.date(),
  updated: z.date().optional(),
  license: z.string().optional(),
  licenseLink: z.string().optional(),
  ogImageUrl: z.string().optional(),
});

export const PostSnapshotSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  slug: z.string(),
  href: z.string(),
  date: z.string(),
  requestedLang: z.string(),
  actualLang: z.string(),
  isFallback: z.boolean(),
  availableLangs: z.array(z.string()),
});

export const RankedPostSnapshotSchema = PostSnapshotSchema.extend({
  rank: z.number(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;
export type PostSnapshot = z.infer<typeof PostSnapshotSchema>;
export type RankedPostSnapshot = z.infer<typeof RankedPostSnapshotSchema>;
export type Post = CollectionEntry<"posts">;
