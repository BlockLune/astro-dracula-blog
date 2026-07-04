import type { APIRoute } from "astro";

import { supportedLangs } from "@/utils/i18n";
import { getRankedSnapshotsForLang } from "@/utils/post-cache";

export const GET: APIRoute = async ({ props }) => {
  return new Response(JSON.stringify(props.snapshots));
};

export async function getStaticPaths() {
  return Promise.all(
    supportedLangs.map(async (lang) => ({
      params: { lang },
      props: { snapshots: await getRankedSnapshotsForLang(lang) },
    }))
  );
}
