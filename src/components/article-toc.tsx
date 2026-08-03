"use client";

import { useEffect, useState } from "react";
import type { PostHeading } from "@/lib/post-shared";

type ArticleTocProps = {
  headings: PostHeading[];
};

export function ArticleToc({ headings }: ArticleTocProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    let frameId = 0;

    const updateActiveHeading = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const readingPosition = 150;
        const current = headings
          .map((heading) => ({
            id: heading.id,
            top: document.getElementById(heading.id)?.getBoundingClientRect().top,
          }))
          .filter((heading): heading is { id: string; top: number } => heading.top !== undefined)
          .filter((heading) => heading.top <= readingPosition)
          .at(-1);

        setActiveId(current?.id ?? headings[0]?.id);
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [headings]);

  return (
    <aside className="article-toc">
      <details open>
        <summary>이 글의 목차</summary>
        <nav aria-label="이 글의 목차">
          <ol>
            {headings.map((heading) => (
              <li className={`toc-depth-${heading.depth}`} key={heading.id}>
                <a
                  className={activeId === heading.id ? "is-active" : undefined}
                  href={`#${heading.id}`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>
    </aside>
  );
}
