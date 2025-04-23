// @ts-check
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
import { rehypeGithubAlerts } from "rehype-github-alerts";

import icon from "astro-icon";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import { SITE } from "./src/config.ts";
import { remarkDescPlugin } from "./src/utils/markdown.ts";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  markdown: {
    shikiConfig: {
      theme: "dracula",
      wrap: true,
      langAlias: {
        C: "c",
        zshrc: "zsh",
      },
    },
    remarkPlugins: [remarkDescPlugin, remarkMath],
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank" }],
      rehypeGithubAlerts,
      rehypeMathjax,
    ],
    smartypants: false,
  },
  integrations: [react(), sitemap(), tailwind(), partytown(), icon()],
  output: "static",
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
