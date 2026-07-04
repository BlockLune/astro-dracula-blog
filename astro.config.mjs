import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { SITE } from "./src/config.ts";
import { defineConfig } from "astro/config";

import { satteri } from "@astrojs/markdown-satteri";
import satteriCallouts from "satteri-callouts";
import satteriExternalLinks from "satteri-external-links";
import { katex as satteriKatex } from "@nullpinter/satteri-katex";

// See https://yfi.moe/post/import-font-as-buffer-in-vite
function fileSystemPath() {
  return {
    name: "vite-plugin-file-system-path",
    transform(_code, id) {
      if (!id.endsWith("?filepath")) return null;

      return {
        code: `export default ${JSON.stringify(id.slice(0, -9))}`,
        map: null,
      };
    },
  };
}

export default defineConfig({
  site: SITE.url,
  markdown: {
    processor: satteri({
      features: {
        math: true,
        smartPunctuation: false,
      },
      mdastPlugins: [satteriKatex({ output: "mathml" })],
      hastPlugins: [
        satteriCallouts(),
        satteriExternalLinks({
          target: "_blank",
          rel: ["noopener", "noreferrer"],
        }),
      ],
    }),
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
  },
  integrations: [react(), sitemap()],
  output: "static",
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    plugins: [fileSystemPath(), tailwindcss()],
  },
});
