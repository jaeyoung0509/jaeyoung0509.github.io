<script lang="ts">
  import { onDestroy } from "svelte";
  import { ListTree, X, Image as ImageIcon } from "lucide-svelte";

  import MermaidHandler from "$components/MermaidHandler.svelte";
  import CodeCopyEnhancer from "$components/CodeCopyEnhancer.svelte";
  import type { PostHeading } from "$lib/post-shared";
  import { errorMessage } from "$lib/errors";

  let {
    title,
    description,
    publishedAt,
    locale,
    tags,
    cover,
    coverAlt,
    coverYoutubeId,
    content,
    scrollRef = $bindable(),
    onScroll,
    onMouseEnter,
    onTouchStart,
    onWheel,
    onPointerDown,
  }: {
    title: string;
    description: string;
    publishedAt: string;
    locale: string;
    tags: string[];
    cover?: string;
    coverAlt?: string;
    coverYoutubeId?: string;
    content: string;
    scrollRef?: HTMLElement | null;
    onScroll?: () => void;
    onMouseEnter?: () => void;
    onTouchStart?: () => void;
    onWheel?: () => void;
    onPointerDown?: () => void;
  } = $props();

  const effectiveCover = $derived(
    coverYoutubeId ? `https://i.ytimg.com/vi/${coverYoutubeId}/hqdefault.jpg` : cover,
  );

  let html = $state("");
  let headings = $state<PostHeading[]>([]);
  let contentRoot = $state<HTMLElement | null>(null);
  let compileError = $state("");
  let showToc = $state(false);
  let isCompiling = $state(false);
  let debounceTimer: NodeJS.Timeout | null = null;
  let abortController: AbortController | null = null;

  async function compile(source: string) {
    abortController?.abort();
    const request = new AbortController();
    abortController = request;
    isCompiling = true;
    compileError = "";
    try {
      const response = await fetch("/api/studio/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: source }),
        signal: request.signal,
      });
      if (!response.ok) throw new Error("미리보기를 불러오지 못했습니다.");
      const result = await response.json();
      if (request.signal.aborted) return;
      html = result.html;
      headings = result.headings ?? [];
    } catch (error) {
      if (!request.signal.aborted) compileError = errorMessage(error);
    } finally {
      if (abortController === request) isCompiling = false;
    }
  }

  function scrollToHeading(id: string) {
    if (!scrollRef) return;
    const target = scrollRef.querySelector(`#${CSS.escape(id)}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  $effect(() => {
    const currentContent = content;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      compile(currentContent);
    }, 120);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      abortController?.abort();
    };
  });

  onDestroy(() => {
    if (abortController) abortController.abort();
    if (debounceTimer) clearTimeout(debounceTimer);
  });
</script>

<div
  role="region"
  aria-label="글 미리보기"
  class="studio-preview-pane"
  bind:this={scrollRef}
  onscroll={onScroll}
  onmouseenter={onMouseEnter}
  ontouchstart={onTouchStart}
  onwheel={onWheel}
  onpointerdown={onPointerDown}
>
  <!-- Floating TOC Button & Dropdown -->
  {#if headings.length > 0}
    <div class="preview-toc-anchor">
      <button
        type="button"
        class="toc-pill-btn {showToc ? 'is-active' : ''}"
        onclick={() => (showToc = !showToc)}
        aria-expanded={showToc}
        title="목차 보기"
      >
        <ListTree size={12} />
        <span>목차 ({headings.length})</span>
      </button>

      {#if showToc}
        <div class="toc-popover">
          <div class="toc-popover-header">
            <span>목차 (Table of Contents)</span>
            <button
              type="button"
              class="toc-close-btn"
              onclick={() => (showToc = false)}
              aria-label="목차 닫기"
            >
              <X size={12} />
            </button>
          </div>
          <ul class="toc-list">
            {#each headings as h (h.id)}
              <li class="toc-item depth-{h.depth}">
                <button
                  type="button"
                  class="toc-link"
                  onclick={() => {
                    scrollToHeading(h.id);
                    showToc = false;
                  }}
                >
                  {h.text}
                </button>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {/if}

  <div class="preview-inner">
    {#if effectiveCover}
      <div class="preview-cover-box">
        <img src={effectiveCover} alt={coverAlt || title} class="preview-cover-img" />
      </div>
    {:else}
      <div class="preview-no-cover-box" aria-hidden="true">
        <div class="no-cover-icon-wrap">
          <ImageIcon size={18} />
        </div>
        <div class="no-cover-text">
          <span class="primary-text">썸네일 없음 (No Thumbnail)</span>
          <span class="sub-text">배경 커버 이미지 없이 텍스트 헤더로 노출됩니다</span>
        </div>
      </div>
    {/if}

    <header class="preview-header">
      <h1 class="preview-title">{title || "제목을 입력하세요"}</h1>

      {#if description}<p class="preview-description">{description}</p>{/if}
      <div class="preview-meta-line">
        <span class="preview-date">{publishedAt}</span>
        <span class="preview-dot">·</span>
        <span class="preview-locale">{locale.toUpperCase()}</span>
        {#if tags && tags.length > 0}
          <div class="preview-tags">
            {#each tags as tag (tag)}
              <span class="preview-tag-badge">#{tag}</span>
            {/each}
          </div>
        {/if}
      </div>
    </header>

    <div class="preview-divider"></div>

    <p class="preview-compile-status" role="status">{compileError || (isCompiling ? "미리보기 업데이트 중…" : "")}</p>
    <div class="prose" bind:this={contentRoot}>
      {@html html || '<p class="empty-state-text">본문을 작성하면 실제 스타일의 미리보기가 실시간으로 렌더링됩니다.</p>'}
    </div>
  </div>
</div>

<MermaidHandler root={contentRoot} />
<CodeCopyEnhancer root={contentRoot} contentKey={html} />

<style>
  .studio-preview-pane {
    height: 100%;
    overflow-y: auto;
    background: var(--page);
    padding: 32px 36px 140px;
    box-sizing: border-box;
    position: relative;
    will-change: scroll-position;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  /* Floating TOC */
  .preview-toc-anchor {
    position: absolute;
    top: 16px;
    right: 24px;
    z-index: 15;
  }

  .toc-pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 44px;
    padding: 4px 10px;
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 600;
    color: var(--muted);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 2px;
    cursor: pointer;
    transition: color var(--dur-short), background-color var(--dur-short), border-color var(--dur-short) var(--ease-out);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .toc-pill-btn:hover,
  .toc-pill-btn.is-active {
    color: var(--ink);
    border-color: var(--accent);
    background: var(--page);
  }

  .toc-popover {
    position: absolute;
    top: 48px;
    right: 0;
    width: 240px;
    max-height: 360px;
    overflow-y: auto;
    background: var(--page);
    border: 1px solid var(--line);
    border-radius: 4px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    padding: 10px;
  }

  .toc-popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 700;
    font-family: var(--font-mono);
    color: var(--muted);
    padding-bottom: 6px;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--line);
  }

  .toc-close-btn {
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    padding: 8px;
    min-width: 44px;
    min-height: 44px;
  }

  .toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .toc-item {
    display: flex;
  }

  .toc-item.depth-3 {
    padding-left: 12px;
  }

  .toc-link {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    font-size: 12px;
    color: var(--muted);
    padding: 8px 6px;
    min-height: 44px;
    border-radius: 3px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color var(--dur-short), background-color var(--dur-short), border-color var(--dur-short) var(--ease-out);
  }

  .toc-link:hover {
    color: var(--accent);
    background: var(--surface);
  }

  /* Layout */
  .preview-inner {
    max-width: 720px;
    margin: 0 auto;
  }

  .preview-cover-box {
    width: 100%;
    height: 180px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 28px;
    background: var(--surface);
    border: 1px solid var(--line);
  }

  .preview-cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .preview-no-cover-box {
    width: 100%;
    height: 70px;
    border: 1px dashed var(--line);
    border-radius: 4px;
    background: var(--surface);
    padding: 16px 20px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-sizing: border-box;
    user-select: none;
  }

  .no-cover-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    background: var(--page);
    border: 1px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    flex-shrink: 0;
  }

  .no-cover-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .no-cover-text .primary-text {
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
  }

  .no-cover-text .sub-text {
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--faint);
  }

  .preview-header {
    margin-bottom: 0;
  }

  .preview-title {
    font-size: 32px;
    font-weight: 750;
    line-height: 1.3;
    margin: 0 0 12px 0;
    color: var(--ink);
    min-height: 42px;
  }

  .preview-meta-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--muted);
    min-height: 28px;
    flex-wrap: wrap;
  }

  .preview-dot {
    color: var(--faint);
  }

  .preview-tags {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }

  .preview-tag-badge {
    color: var(--accent);
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 2px 7px;
    border-radius: 3px;
    font-size: 11px;
  }

  .preview-divider {
    height: 1px;
    background: var(--line);
    margin: 18px 0 24px;
  }

  .empty-state-text {
    color: var(--faint);
    padding: 40px 0;
  }
  .preview-description { margin: 0 0 16px; color: var(--muted); line-height: 1.75; }
  .preview-compile-status { min-height: 20px; margin: 0 0 12px; color: var(--muted); font-size: 12px; }
  @media (max-width: 760px) { .studio-preview-pane { padding: 64px 20px 100px; } }
</style>
