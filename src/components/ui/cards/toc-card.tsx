import clsx from "clsx";
import type { MarkdownHeading } from "astro";
import { MISC } from "@/config";
import { type Lang, useTranslations } from "@/utils/i18n";
import { useEffect, useState, useRef } from "react";

export default function TocCard({
  headings,
  lang,
}: {
  headings: MarkdownHeading[];
  lang: Lang;
}) {
  const t = useTranslations(lang);
  const filtered = headings.filter(
    (heading) => heading.depth > 1 && heading.depth < 4
  );
  const [activeId, setActiveId] = useState<string>("");
  const tocRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-20% 0px -35% 0px",
    });

    for (const heading of filtered) {
      const element = document.getElementById(heading.slug);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [filtered]);

  // auto scroll to active element
  useEffect(() => {
    if (activeId && tocRef.current) {
      const activeElement = tocRef.current.querySelector(
        `a[href="#${activeId}"]`
      )?.parentElement;
      if (activeElement) {
        const container = tocRef.current;
        const elementTop = activeElement.offsetTop;
        const containerHeight = container.clientHeight;

        const targetScroll = elementTop - containerHeight / 2;

        container.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

  if (filtered.length <= MISC.toc.minHeadings) return null;

  return (
    <div className="flex flex-col gap-4 bg-dracula-dark/20 p-8">
      <h2 className="text-2xl font-bold">{t("toc")}</h2>
      <ul ref={tocRef} className="max-h-96 space-y-2 overflow-y-auto">
        {filtered.map((heading) => (
          <li
            key={heading.slug}
            style={{ marginLeft: `${heading.depth - 2}rem` }}
          >
            <a
              href={`#${heading.slug}`}
              className={clsx(
                "ghost-link-underline",
                activeId === heading.slug && "text-dracula-pink"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
