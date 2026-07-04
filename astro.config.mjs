import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import { rehypeGithubAlerts } from "rehype-github-alerts";

import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import { SITE } from "./src/config.ts";
import { remarkDescPlugin } from "./src/utils/markdown.ts";

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

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDescPlugin, remarkMath],
      rehypePlugins: [
        [rehypeExternalLinks, { target: "_blank" }],
        rehypeGithubAlerts,
        rehypeMathjax,
      ],
      smartypants: false,
    }),
    shikiConfig: {
      theme: "dracula",
      wrap: true,
      langAlias: {
        C: "c",
        zshrc: "zsh",
      },
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
