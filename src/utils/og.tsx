// https://github.com/satnaing/astro-paper/blob/2f82febff4d1af582106be0cc3d618da2d08f600/src/utils/og-templates/post.tsx
// https://github.com/satnaing/astro-paper/blob/2f82febff4d1af582106be0cc3d618da2d08f600/src/utils/generateOgImages.tsx

import { AUTHOR, SITE } from "@/config";
import type { Post } from "@/schemas/post";
import type { Lang } from "@/utils/i18n";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import loadGoogleFonts, { type FontOptions } from "./load-google-font";

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

function limitText(text: string, length: number) {
  if (text.length <= length) return text;
  const truncated = text.slice(0, length);
  const isAscii = /^[\x00-\x7F]*$/.test(truncated); // Check if the text is ASCII
  if (!isAscii) return `${truncated} "..."`;

  const lastSpaceIndex = truncated.lastIndexOf(" ");
  return lastSpaceIndex === -1
    ? `${truncated} "..."`
    : `${truncated.slice(0, lastSpaceIndex)} ...`;
}

export async function generateOgImageForPost(lang: Lang, post: Post) {
  const svg = await satori(
    <div
      style={{
        width: 1200,
        height: 630,
        background: "#282A36",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 1100,
          height: 530,
          background: "#44475A33",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "90%",
            height: "90%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              color: "#FF79C6",
              fontSize: 72,
              fontWeight: "bold",
              maxHeight: "70%",
              overflow: "hidden",
            }}
          >
            {limitText(post.data.title, 60)}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "8px",
              fontSize: 28,
            }}
          >
            <span
              style={{
                color: "#8BE9FD",
              }}
            >
              <span
                style={{
                  marginRight: 10,
                }}
              >
                by
              </span>
              <span
                style={{
                  overflow: "hidden",
                  fontWeight: "bold",
                }}
              >
                {AUTHOR.name}
              </span>
            </span>
            <span
              style={{
                color: "#F8F8F2",
                overflow: "hidden",
                fontWeight: "bold",
              }}
            >
              {SITE.title[lang]}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: (await loadGoogleFonts(
        post.data.title + SITE.title[lang] + "by" + AUTHOR.name + "."
      )) as FontOptions[],
    }
  );
  return svgBufferToPngBuffer(svg);
}
