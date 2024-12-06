import { getCollection, getEntry } from "astro:content";
import { type Lang, supportedLangs } from "@/utils/i18n";
import { generateOgImageForPost } from "@/utils/og";
import { classifyByLangs } from "@/utils/post";
import type { APIRoute } from "astro";

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  const classified = classifyByLangs(posts);

  const paths = [];
  for (const lang of supportedLangs) {
    for (const slug of classified.keys()) {
      const entry = await getEntry("posts", `${lang}/${slug}`);
      paths.push({
        params: { lang: lang as Lang, slug },
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
    for (const possibleLang of supportedLangs) {
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
