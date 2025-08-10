import type { APIRoute } from "astro";

import { getCollection } from "astro:content";
import { getSnapshots } from "@/utils/post";
import { type Lang, supportedLangs } from "@/utils/i18n";

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const rank = Number(params.rank);

  const posts = await getCollection("posts");
  const snapshots = await getSnapshots(posts, lang);

  return new Response(
    JSON.stringify(
      snapshots.map((snapshot, index) => ({ rank: index + 1, ...snapshot }))[
        rank - 1
      ]
    )
  );
};

export async function getStaticPaths() {
  const posts = await getCollection("posts");

  const paths: { params: { lang: Lang; rank: string } }[] = [];

  for (const lang of supportedLangs) {
    const snapshots = await getSnapshots(posts, lang);
    snapshots.forEach((_, index) => {
      paths.push({
        params: {
          lang,
          rank: String(index + 1),
        },
      });
    });
  }

  return paths;
}
