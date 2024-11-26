import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { type Lang, ui } from "@/utils/i18n";
import { classifyByLangs } from "@/utils/post";
import { generateOgImageForPost } from "@/utils/og";

export const prerender = false;

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  const classified = classifyByLangs(posts);

  const paths = [];
  for (const lang of Object.keys(ui)) {
    for (const pureSlug of classified.keys()) {
      const entry = await getEntry("posts", `${lang}/${pureSlug}`);
      paths.push({
        params: { lang: lang as Lang, slug: pureSlug },
        props: { post: entry },
      });
    }
  }
  return paths;
}

export const GET: APIRoute = async ({ props, params }) => {
  const { post } = props;
  const { lang, slug } = params;

  if (!post) {
    for (const possibleLang of Object.keys(ui)) {
      if (await getEntry("posts", `${possibleLang}/${slug}`)) {
        return new Response(null, {
          status: 302,
          headers: { Location: `/${possibleLang}/og-images/${slug}.png` },
        });
      }
    }
    return new Response("Not Found", { status: 404 });
  }
  return new Response(await generateOgImageForPost(lang as Lang, post!), {
    headers: { "Content-Type": "image/png" },
  });
}
