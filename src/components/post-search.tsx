"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { PostMeta } from "@/lib/post-shared";
import { PostRow } from "./post-row";

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getLocationTag() {
  return new URLSearchParams(window.location.search).get("tag") ?? "";
}

function getServerTag() {
  return "";
}

export function PostSearch({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const locationTag = useSyncExternalStore(
    subscribeToLocation,
    getLocationTag,
    getServerTag,
  );
  const activeTag = locationTag;
  const tags = useMemo(
    () => [...new Set(posts.flatMap((post) => post.tags))].sort(),
    [posts],
  );
  const filtered = posts.filter((post) => {
    const searchable =
      `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase();
    return (
      searchable.includes(query.trim().toLowerCase()) &&
      (!activeTag || post.tags.includes(activeTag))
    );
  });
  const selectTag = (tag: string) => {
    const basePath = window.location.pathname === "/" ? "/" : "/blog/";
    const url = tag
      ? `${basePath}?tag=${encodeURIComponent(tag)}`
      : basePath;
    window.history.replaceState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (posts.length === 0) {
    return (
      <section className="post-list container" aria-live="polite">
        <p className="empty-state">새 글을 준비하고 있습니다.</p>
      </section>
    );
  }

  return (
    <>
      <section className="filters container" aria-label="글 검색 및 필터">
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">글 검색</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="제목, 설명, 태그 검색"
            autoComplete="off"
          />
        </label>
        <div className="tag-filters" aria-label="태그 필터">
          <SlidersHorizontal size={16} aria-hidden="true" />
          <button
            className={!activeTag ? "is-active" : undefined}
            type="button"
            onClick={() => selectTag("")}
          >
            전체
          </button>
          {tags.map((tag) => (
            <button
              className={activeTag === tag ? "is-active" : undefined}
              type="button"
              key={tag}
              onClick={() => selectTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      <section className="post-list container" aria-live="polite">
        <p className="result-count">{filtered.length}개의 글</p>
        {filtered.map((post, index) => (
          <PostRow post={post} eager={index < 3} key={post.slug} />
        ))}
        {filtered.length === 0 && (
          <p className="empty-state">검색 조건에 맞는 글이 없습니다.</p>
        )}
      </section>
    </>
  );
}
