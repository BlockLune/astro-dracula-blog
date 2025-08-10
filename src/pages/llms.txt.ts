import { getCollection } from "astro:content";
import { SITE } from "@/config.ts";
import { AUTHOR } from "@/config.ts";
import type { Post } from "@/schemas/post";
import { defaultLang } from "@/utils/i18n";
import { getDescFromMdString } from "@/utils/markdown";
import { getLangFromId, getSlugFromId } from "@/utils/post";

function getLLMsTxt(
  title: string,
  description: string,
  site: string,
  posts: Post[]
) {
  return `
# ${title}

> ${description}

URL Source: ${site}
Author: ${AUTHOR.name}

## Posts

${posts
  .map((post) => {
    const lang = getLangFromId(post.id);
    const slug = getSlugFromId(post.id);
    const title = post.data.title;
    const desc = getDescFromMdString(post.body);
    const pubDate = post.data.date;
    const link = `${lang}/posts/${slug}`;
    const tags = post.data.tags;
    return `- [${title}](${link}): ${desc}\n  Published on ${pubDate}. Tags: ${tags.join(", ")}`;
  })
  .join("\n")}

## Thanks

Powered by 🚀 [Astro](https://astro.build/)& ❤️ [AstroDraculaBlog](https://github.com/BlockLune/astro-dracula-blog/)
`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(context: any) {
  const posts = await getCollection("posts");
  const llmsTxt = getLLMsTxt(
    SITE.title[defaultLang],
    SITE.description[defaultLang],
    context.site,
    posts
  );
  return new Response(llmsTxt);
}
