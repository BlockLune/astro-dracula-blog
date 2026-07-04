import type { APIRoute } from "astro";
import { generateOgImageForPost } from "@/utils/og";
import { getLangFromId, getSlugFromId } from "@/utils/post";
import { getCollection } from "astro:content";
import type { Lang } from "@/utils/i18n";

export async function getStaticPaths() {
  const posts = await getCollection("posts");

  return posts.map((post) => ({
    params: {
      lang: getLangFromId(post.id),
      slug: getSlugFromId(post.id),
    },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props, params }) => {
  const { post } = props;
  const { lang } = params;

  return new Response(
    new Uint8Array(await generateOgImageForPost(lang as Lang, post)),
    {
      headers: { "Content-Type": "image/png" },
    }
  );
};
