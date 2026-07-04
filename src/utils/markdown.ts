import { fromMarkdown } from "mdast-util-from-markdown";
import { toString as mdastToString } from "mdast-util-to-string";

import { MISC } from "../config";

function getFirstMoreMarkIndex(mdString: string) {
  const indexes = MISC.more.marks
    .map((mark) => mdString.indexOf(mark))
    .filter((index) => index >= 0);

  return indexes.length > 0 ? Math.min(...indexes) : -1;
}

function sliceAtFirstMoreMark(mdString: string) {
  const moreMarkIndex = getFirstMoreMarkIndex(mdString);
  return moreMarkIndex >= 0 ? mdString.slice(0, moreMarkIndex) : mdString;
}

export function getDescFromMdString(mdString: string | undefined) {
  if (!mdString) {
    return "";
  }

  const mdast = fromMarkdown(sliceAtFirstMoreMark(mdString));
  return mdastToString(mdast);
}
