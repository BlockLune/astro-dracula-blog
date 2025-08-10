import { getCollection } from "astro:content";
import { SITE } from "@/config.ts";
import { AUTHOR } from "@/config.ts";
import type { Post } from "@/schemas/post";
import { defaultLang } from "@/utils/i18n";
import { getDescFromMdString } from "@/utils/markdown";
import { getLangFromId, getSlugFromId } from "@/utils/post";
import rss from "@astrojs/rss";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(context: any) {
  const posts = await getCollection("posts");
  return rss({
    title: SITE.title[defaultLang],
    description: SITE.description[defaultLang],
    site: context.site,
    items: posts.map((post: Post) => {
      const lang = getLangFromId(post.id);
      const slug = getSlugFromId(post.id);
      return {
        title: post.data.title,
        description: getDescFromMdString(post.body),
        author: AUTHOR.name,
        pubDate: post.data.date,
        link: `${lang}/posts/${slug}`,
        enclosure: {
          url: `${lang}/og-images/${slug}.png`,
          length: 0,
          type: "image/png",
        },
      };
    }),
    stylesheet: "/rss.xsl",
  });
}
