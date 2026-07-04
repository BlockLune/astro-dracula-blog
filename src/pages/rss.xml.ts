import { SITE } from "@/config.ts";
import { AUTHOR } from "@/config.ts";
import { defaultLang } from "@/utils/i18n";
import { getPostDescription, getPosts } from "@/utils/post-cache";
import { getLangFromId, getSlugFromId } from "@/utils/post";
import rss from "@astrojs/rss";

// oxlint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(context: any) {
  const posts = await getPosts();
  const items = await Promise.all(
    posts.map(async (post) => {
      const lang = getLangFromId(post.id);
      const slug = getSlugFromId(post.id);
      return {
        title: post.data.title,
        description: await getPostDescription(post),
        author: AUTHOR.name,
        pubDate: post.data.date,
        link: `${lang}/posts/${slug}`,
        enclosure: {
          url: `${lang}/og-images/${slug}.png`,
          length: 0,
          type: "image/png",
        },
      };
    })
  );

  return rss({
    title: SITE.title[defaultLang],
    description: SITE.description[defaultLang],
    site: context.site,
    items,
    stylesheet: "/rss.xsl",
  });
}
