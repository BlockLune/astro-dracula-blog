import { readFile } from "node:fs/promises";
import type { FontStyle, FontWeight } from "satori";
import boldFontPath from "../assets/fonts/NotoSansCJKsc-Bold.otf?filepath";
import regularFontPath from "../assets/fonts/NotoSansCJKsc-Regular.otf?filepath";

export type FontOptions = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight | undefined;
  style: FontStyle | undefined;
};

const fontConfigs = [
  {
    name: "Noto Sans SC",
    path: regularFontPath,
    weight: 400,
    style: "normal",
  },
  {
    name: "Noto Sans SC",
    path: boldFontPath,
    weight: 700,
    style: "normal",
  },
] as const;

const fontDataPromises = new Map<string, Promise<ArrayBuffer>>();

async function readFontAsArrayBuffer(path: string): Promise<ArrayBuffer> {
  const buffer = await readFile(path);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
}

function loadFontData(path: string): Promise<ArrayBuffer> {
  let promise = fontDataPromises.get(path);
  if (!promise) {
    promise = readFontAsArrayBuffer(path);
    fontDataPromises.set(path, promise);
  }
  return promise;
}

export default async function loadLocalFonts(): Promise<FontOptions[]> {
  return Promise.all(
    fontConfigs.map(async ({ name, path, weight, style }) => ({
      name,
      data: await loadFontData(path),
      weight,
      style,
    }))
  );
}
