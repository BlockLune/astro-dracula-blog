/**
 * Create a new post in the content directory
 *
 * Usage: pnpm new [options] <post-title>
 *
 * Options:
 *   -l, --lang <en|zh>   Set the language (default: en)
 *   -d, --draft          Create a draft post (default: false)
 *   -m, --mdx            Use MDX format (default: false)
 *   -h, --help           Show this help message
 *
 * Example:
 *   pnpm new "Hello World"
 *   pnpm new -l zh "你好，世界"
 */

import fs from "node:fs";
import path from "node:path";
import slugify from "slugify";
import minimist from "minimist";
import process from "node:process";

function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getPostSlug(postTitle) {
  let slug = slugify(postTitle).toLocaleLowerCase();
  if (slug === "") {
    slug = "untitled";
  }
  return slug;
}

const HELP_INFO = `Usage: pnpm new [options] <post-title>

Options:
  -l, --lang <en|zh>   Set the language (default: en)
  -d, --draft          Create a draft post (default: false)
  -m, --mdx            Use MDX format (default: false)
  -h, --help           Show this help message

Example:
  pnpm new "Hello World"
  pnpm new -l zh "你好，世界"
`;
const TARGET_DIR = "./src/content/";

const args = minimist(process.argv.slice(2), {
  string: ["lang"],
  boolean: ["draft", "mdx", "help"],
  default: {
    lang: "en",
    draft: false,
    mdx: false,
  },
  alias: {
    l: "lang",
    d: "draft",
    m: "mdx",
    h: "help",
  },
});

if (args.help) {
  console.log(HELP_INFO);
  process.exit(0);
}

let postTitle = args._.join(" "); // Join the rest of the arguments
if (!postTitle || postTitle.trim() === "") {
  postTitle = "Untitled";
}
console.log("Creating new post:", postTitle);

const fileExtension = args.mdx ? ".mdx" : ".md";
const fileName = getPostSlug(postTitle) + fileExtension;
const fileTypeDir = args.draft ? "drafts" : "posts";
const fileLangDir = args.lang;
const fullPath = path.join(TARGET_DIR, fileTypeDir, fileLangDir, fileName);

console.log("Full path:", fullPath);
if (fs.existsSync(fullPath)) {
  console.error(`ERROR: File ${fullPath} already exists`);
  process.exit(1);
}

const content = `---
title: ${postTitle}
tags:
 - tag1
 - tag2
 - tag3
date: ${getDate()}
---

Write your description here.

<!--more-->

Write your content here.
`;

fs.writeFileSync(fullPath, content);
console.log(`Post "${postTitle}" created`);
