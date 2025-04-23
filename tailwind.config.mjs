import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        code: ["Fira Code", ...defaultTheme.fontFamily.mono],
      },
      typography: () => ({
        dracula: {
          css: {
            "--tw-prose-body": "var(--color-dracula-light)",
            "--tw-prose-headings": "var(--color-dracula-pink)",
            "--tw-prose-lead": "var(--color-dracula-pink)",
            "--tw-prose-links": "var(--color-dracula-cyan)",
            "--tw-prose-bold": "var(--color-dracula-purple)",
            "--tw-prose-counters": "var(--color-dracula-pink)",
            "--tw-prose-bullets": "var(--color-dracula-pink)",
            "--tw-prose-hr": "var(--color-dracula-pink)",
            "--tw-prose-quotes": "var(--color-dracula-light)",
            "--tw-prose-quote-borders": "var(--color-dracula-pink)",
            "--tw-prose-captions": "var(--color-dracula-pink)",
            "--tw-prose-code": "var(--color-dracula-purple)",
            "--tw-prose-th-borders": "var(--color-dracula-purple)",
            "--tw-prose-td-borders": "var(--color-dracula-purple)",
          },
        },
      }),
    },
  },
};
