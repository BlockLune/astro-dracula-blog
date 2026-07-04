import type { APIRoute } from "astro";

import { supportedLangs } from "@/utils/i18n";
import { getRankedSnapshotsForLang } from "@/utils/post-cache";

export const GET: APIRoute = async ({ props }) => {
  return new Response(JSON.stringify(props.snapshot));
};

export async function getStaticPaths() {
  const paths = await Promise.all(
    supportedLangs.map(async (lang) => {
      const snapshots = await getRankedSnapshotsForLang(lang);
      return snapshots.map((snapshot) => ({
        params: {
          lang,
          rank: String(snapshot.rank),
        },
        props: { snapshot },
      }));
    })
  );

  return paths.flat();
}
