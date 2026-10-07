<script lang="ts">
  import { onMount } from "svelte";
  import { Search, X } from "lucide-svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import type { PostMeta } from "$lib/post-shared";
  import { postHref } from "$lib/post-navigation";
  import PostRow from "./PostRow.svelte";

  let { posts }: { posts: PostMeta[] } = $props();
  let showAllTags = $state(false);
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
  const listUrl = $derived(hydrated ? page.url : new URL(page.url.pathname, page.url.origin));
  const query = $derived(hydrated ? page.url.searchParams.get("q") ?? "" : "");
  const activeTag = $derived(hydrated ? page.url.searchParams.get("tag") ?? "" : "");
  const searchTerm = $derived(query.trim().toLowerCase());
  const tags = $derived.by(() => {
    const counts: Record<string, number> = Object.create(null);
    for (const post of posts) for (const tag of post.tags) counts[tag] = (counts[tag] ?? 0) + 1;
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  });
  const visibleTags = $derived(showAllTags ? tags : tags.filter((tag, index) => index < 6 || tag === activeTag));
  const filtered = $derived(posts.filter(post =>
    `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase().includes(searchTerm)
      && (!activeTag || post.tags.includes(activeTag))
  ));

  function updateFilters(values: Record<string, string>) {
    const url = new URL(page.url);
    for (const [key, value] of Object.entries(values)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    void goto(url, { replaceState: true, keepFocus: true, noScroll: true, state: page.state });
  }
</script>

{#if posts.length === 0}
  <section class="post-list container" aria-live="polite">
    <p class="empty-state">새 글을 준비하고 있습니다.</p>
  </section>
{:else}
  <section class="filters container" aria-label="글 검색 및 필터">
    <label class="search-field">
      <Search size={18} aria-hidden="true" />
      <span class="sr-only">글 검색</span>
      <input type="search" value={query} oninput={(event) => updateFilters({ q: event.currentTarget.value })}
        placeholder="제목, 설명, 태그 검색" autocomplete="off" />
    </label>
    <div class="tag-filters" id="writing-tags" aria-label="태그 필터">
      <button class={!activeTag ? "is-active" : undefined} type="button"
        aria-pressed={!activeTag} onclick={() => updateFilters({ tag: "" })}>전체</button>
      {#each visibleTags as tag (tag)}
        <button class={activeTag === tag ? "is-active" : undefined} type="button"
          aria-pressed={activeTag === tag} onclick={() => updateFilters({ tag })}>#{tag}</button>
      {/each}
      {#if tags.length > 6}
        <button class="tag-disclosure" type="button" aria-expanded={showAllTags}
          aria-controls="writing-tags" onclick={() => (showAllTags = !showAllTags)}>
          {showAllTags ? "접기" : "더 보기"}
        </button>
      {/if}
    </div>
  </section>

  <section class="post-list container" aria-label="검색 결과">
    <div class="results-header">
      <p class="result-count" role="status">{filtered.length}개의 글</p>
      {#if query || activeTag}
        <button class="reset-filters" type="button" onclick={() => updateFilters({ q: "", tag: "" })}>
          <X size={14} aria-hidden="true" /> 조건 초기화
        </button>
      {/if}
    </div>
    {#each filtered as post, index (post.slug)}
      <PostRow {post} href={postHref(post.slug, listUrl)} eager={index < 3} />
    {/each}
    {#if filtered.length === 0}
      <p class="empty-state">검색 조건에 맞는 글이 없습니다. 검색어나 태그를 바꿔보세요.</p>
    {/if}
  </section>
{/if}
