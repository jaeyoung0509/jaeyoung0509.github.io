<script lang="ts">
  import { tick, onDestroy } from "svelte";
  import { ListTree, X, Image as ImageIcon } from "lucide-svelte";

  let {
    title,
    description,
    publishedAt,
    locale,
    tags,
    cover,
    coverAlt,
    content,
    scrollRef = $bindable(),
  }: {
    title: string;
    description: string;
    publishedAt: string;
    locale: string;
    tags: string[];
    cover?: string;
    coverAlt?: string;
    content: string;
    scrollRef?: HTMLElement | null;
  } = $props();

  let html = $state("");
  let headings = $state<{ depth: number; id: string; text: string }[]>([]);
  let showToc = $state(false);
  let isCompiling = $state(false);
  let debounceTimer: NodeJS.Timeout | null = null;
  let abortController: AbortController | null = null;

  async function compile(source: string) {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    isCompiling = true;
    try {
      const res = await fetch("/api/studio/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: source }),
        signal: abortController.signal,
      });

      if (res.ok) {
        const data = await res.json();
        html = data.html;
        headings = data.headings || [];
        await tick();
        await renderMermaid();
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Preview compile failed:", err);
      }
    } finally {
      isCompiling = false;
    }
  }

  function scrollToHeading(id: string) {
    if (!scrollRef) return;
    const target = scrollRef.querySelector(`#${CSS.escape(id)}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function renderMermaid() {
    if (typeof window === "undefined" || !scrollRef) return;
    const diagrams = scrollRef.querySelectorAll(".mermaid-diagram");
    if (diagrams.length === 0) return;

    try {
      const mermaidModule = await import("mermaid");
      const mermaid = mermaidModule.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "var(--font-mono)",
      });

      diagrams.forEach(async (el, idx) => {
        const chart = el.getAttribute("data-chart");
        if (chart && !el.querySelector("svg")) {
          try {
            const id = `mermaid-preview-${Date.now()}-${idx}`;
            const { svg } = await mermaid.render(id, chart);
            el.innerHTML = svg;
          } catch (e) {
            el.innerHTML = `<pre class="mermaid-error">${chart}</pre>`;
          }
        }
      });
    } catch {
      // Ignore fallback
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
    };
  });

  onDestroy(() => {
    if (abortController) abortController.abort();
    if (debounceTimer) clearTimeout(debounceTimer);
  });
</script>

<div class="studio-preview-pane" bind:this={scrollRef}>
  <!-- Floating TOC Button & Dropdown -->
  {#if headings.length > 0}
    <div class="preview-toc-anchor">
      <button
        type="button"
        class="toc-pill-btn {showToc ? 'is-active' : ''}"
        onclick={() => (showToc = !showToc)}
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
    {#if cover}
      <div class="preview-cover-box">
        <img src={cover} alt={coverAlt || title} class="preview-cover-img" />
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

    <div class="prose">
      {@html html || '<p class="empty-state-text">본문을 작성하면 실제 스타일의 미리보기가 실시간으로 렌더링됩니다.</p>'}
    </div>
  </div>
</div>

<style>
  .studio-preview-pane {
    height: 100%;
    overflow-y: auto;
    background: var(--page);
    padding: 32px 36px 140px;
    box-sizing: border-box;
    position: relative;
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
    padding: 4px 10px;
    font-size: 11px;
    font-family: var(--font-mono);
    font-weight: 600;
    color: var(--muted);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 20px;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: all var(--dur-short) var(--ease-out);
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
    top: 32px;
    right: 0;
    width: 240px;
    max-height: 360px;
    overflow-y: auto;
    background: var(--page);
    border: 1px solid var(--line);
    border-radius: 4px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    padding: 10px;
    animation: tocFadeIn 0.15s ease-out;
  }

  @keyframes tocFadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
    padding: 2px;
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
    padding: 4px 6px;
    border-radius: 3px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all var(--dur-short) var(--ease-out);
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
    font-style: italic;
  }
</style>
