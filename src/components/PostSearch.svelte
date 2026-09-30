<script lang="ts">
  import { Search } from "lucide-svelte";
  import type { PostMeta } from "$lib/post-shared";
  import PostRow from "./PostRow.svelte";
  import { onMount } from "svelte";

  let { posts }: { posts: PostMeta[] } = $props();

  let query = $state("");
  let activeTag = $state("");
  let showAllTags = $state(false);

  const tags = $derived(
    [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) =>
      posts.filter((post) => post.tags.includes(b)).length -
      posts.filter((post) => post.tags.includes(a)).length || a.localeCompare(b),
    ),
  );
  const visibleTags = $derived(
    showAllTags ? tags : tags.filter((tag, index) => index < 6 || tag === activeTag),
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
    const basePath = "/";
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
    <div class="tag-filters" id="writing-tags" aria-label="태그 필터">
      <button
        class={!activeTag ? "is-active" : undefined}
        type="button"
        aria-pressed={!activeTag}
        onclick={() => selectTag("")}
      >
        전체
      </button>
      {#each visibleTags as tag (tag)}
        <button
          class={activeTag === tag ? "is-active" : undefined}
          type="button"
          aria-pressed={activeTag === tag}
          onclick={() => selectTag(tag)}
        >
          #{tag}
        </button>
      {/each}
      {#if tags.length > 6}
        <button
          class="tag-disclosure"
          type="button"
          aria-expanded={showAllTags}
          aria-controls="writing-tags"
          onclick={() => (showAllTags = !showAllTags)}
        >
          {showAllTags ? "접기" : "더 보기"}
        </button>
      {/if}
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

