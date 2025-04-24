import type { APIRoute } from "astro";

import { getCollection } from "astro:content";
import { getSnapshots } from "@/utils/post";
import { type Lang, supportedLangs } from "@/utils/i18n";

export const GET: APIRoute = async ({ params, request }) => {
  const lang = params.lang as Lang;

  const posts = await getCollection("posts");
  const snapshots = await getSnapshots(posts, lang);

  return new Response(
    JSON.stringify(
      snapshots.map((snapshot, index) => ({ id: index + 1, ...snapshot })),
    ),
  );
};

export async function getStaticPaths() {
  return supportedLangs.map((lang) => ({ params: { lang } }));
}
