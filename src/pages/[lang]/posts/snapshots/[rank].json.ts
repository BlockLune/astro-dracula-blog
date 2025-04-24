import type { APIRoute } from "astro";

import { getCollection } from "astro:content";
import { getSnapshots } from "@/utils/post";
import { type Lang, supportedLangs } from "@/utils/i18n";

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const rank = params.rank;

  const posts = await getCollection("posts");
  const snapshots = await getSnapshots(posts, lang);

  return new Response(
    JSON.stringify(
      snapshots
        .map((snapshot, index) => ({ rank: index + 1, ...snapshot }))
        .find((snapshot) => snapshot.rank === Number(rank)),
    ),
  );
};

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return supportedLangs.flatMap((lang) =>
    posts.map((_, index) => ({
      params: {
        lang,
        rank: String(index + 1),
      },
    })),
  );
}
