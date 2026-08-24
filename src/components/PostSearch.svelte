<script lang="ts">
  import { Search, SlidersHorizontal } from "lucide-svelte";
  import type { PostMeta } from "$lib/post-shared";
  import PostRow from "./PostRow.svelte";
  import { onMount } from "svelte";

  let { posts }: { posts: PostMeta[] } = $props();

  let query = $state("");
  let activeTag = $state("");

  const tags = $derived(
    [...new Set(posts.flatMap((post) => post.tags))].sort(),
  );

  const filtered = $derived(
    posts.filter((post) => {
      const searchable =
        `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase();
      return (
        searchable.includes(query.trim().toLowerCase()) &&
        (!activeTag || post.tags.includes(activeTag))
      );
    }),
  );

  function syncTagFromUrl() {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    activeTag = urlParams.get("tag") ?? "";
  }

  function selectTag(tag: string) {
    if (typeof window === "undefined") return;
    activeTag = tag;
    const basePath = window.location.pathname === "/" ? "/" : "/blog/";
    const url = tag
      ? `${basePath}?tag=${encodeURIComponent(tag)}`
      : basePath;
    window.history.replaceState({}, "", url);
  }

  onMount(() => {
    syncTagFromUrl();
    window.addEventListener("popstate", syncTagFromUrl);
    return () => {
      window.removeEventListener("popstate", syncTagFromUrl);
    };
  });
</script>

{#if posts.length === 0}
  <section class="post-list container" aria-live="polite">
    <p class="empty-state">새 글을 준비하고 있습니다.</p>
  </section>
{:else}
  <section class="filters container" aria-label="글 검색 및 필터">
    <label class="search-field">
      <Search size={18} />
      <span class="sr-only">글 검색</span>
      <input
        type="search"
        bind:value={query}
        placeholder="제목, 설명, 태그 검색"
        autocomplete="off"
      />
    </label>
    <div class="tag-filters" aria-label="태그 필터">
      <SlidersHorizontal size={16} aria-hidden="true" />
      <button
        class={!activeTag ? "is-active" : undefined}
        type="button"
        onclick={() => selectTag("")}
      >
        전체
      </button>
      {#each tags as tag (tag)}
        <button
          class={activeTag === tag ? "is-active" : undefined}
          type="button"
          onclick={() => selectTag(tag)}
        >
          #{tag}
        </button>
      {/each}
    </div>
  </section>

  <section class="post-list container" aria-live="polite">
    <p class="result-count">{filtered.length}개의 글</p>
    {#each filtered as post, index (post.slug)}
      <PostRow {post} eager={index < 3} />
    {/each}
    {#if filtered.length === 0}
      <p class="empty-state">검색 조건에 맞는 글이 없습니다.</p>
    {/if}
  </section>
{/if}


