import { getCollection } from "astro:content";
import { getSnapshots } from "@/utils/post";
import { type Lang, supportedLangs } from "@/utils/i18n";

export const GET = async ({ params, request }) => {
  const lang = params.lang as Lang;
  const id = params.id;

  const posts = await getCollection("posts");
  const snapshots = await getSnapshots(posts, lang);

  return new Response(
    JSON.stringify(
      snapshots
        .map((snapshot, index) => ({ id: index + 1, ...snapshot }))
        .find((snapshot) => snapshot.id === Number(id)),
    ),
  );
};

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return supportedLangs.flatMap((lang) =>
    posts.map((post, index) => ({
      params: {
        lang,
        id: String(index + 1),
      },
    })),
  );
}
