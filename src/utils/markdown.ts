import { fromMarkdown } from "mdast-util-from-markdown";
import { toString as mdastToString } from "mdast-util-to-string";

export function getDescFromMdString(mdString: string | undefined) {
  if (!mdString) {
    return "";
  }
  const mdast = fromMarkdown(mdString);
  const desc = mdastToString(mdast);
  const pos = desc.indexOf("<!--more-->");
  return desc.slice(0, pos);
}

export function remarkDescPlugin() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any, { data }: any) => {
    const textOnPage = mdastToString(tree);
    data.astro.frontmatter.desc = getDescFromMdString(textOnPage);
  };
}
