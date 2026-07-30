"use client";

import Giscus from "@giscus/react";

type GiscusRepo = `${string}/${string}`;

export function GiscusComments() {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO as GiscusRepo | undefined;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repo || !repoId || !category || !categoryId) return null;

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title">댓글</h2>
      <Giscus
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="ko"
        loading="lazy"
      />
    </section>
  );
}
