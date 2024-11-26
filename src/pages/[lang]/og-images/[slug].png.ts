import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { type Lang, ui } from "@/utils/i18n";
import { classifyByLangs } from "@/utils/post";
import { generateOgImageForPost } from "@/utils/og";

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
  let { post } = props;
  const { lang, slug } = params;

  if (!post) {
    for (const possibleLang of Object.keys(ui)) {
      const possiblePost = await getEntry("posts", `${possibleLang}/${slug}`);
      if (possiblePost) {
        post = possiblePost;
      }
    }
  }

  return new Response(await generateOgImageForPost(lang as Lang, post!), {
    headers: { "Content-Type": "image/png" },
  });
};
