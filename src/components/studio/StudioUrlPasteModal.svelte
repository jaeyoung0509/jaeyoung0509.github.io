<script lang="ts">
  import { Video, Bookmark, Link, FileText, X } from "lucide-svelte";

  let {
    isOpen = $bindable(false),
    url = "",
    selectedText = "",
    onSelect,
  }: {
    isOpen: boolean;
    url: string;
    selectedText: string;
    onSelect: (type: "video" | "embed" | "link" | "text") => void;
  } = $props();

  const isYouTube = $derived(
    /(?:youtube\.com\/(?:watch|embed|shorts)|youtu\.be\/)/i.test(url),
  );

  function handleKeydown(e: KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      onSelect("text");
    } else if (e.key === "1") {
      e.preventDefault();
      onSelect(isYouTube ? "video" : "embed");
    } else if (e.key === "2") {
      e.preventDefault();
      onSelect(isYouTube ? "embed" : "link");
    } else if (e.key === "3") {
      e.preventDefault();
      onSelect(isYouTube ? "link" : "text");
    } else if (e.key === "4" && isYouTube) {
      e.preventDefault();
      onSelect("text");
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(isYouTube ? "video" : "embed");
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div
    class="paste-popover-backdrop"
    onclick={() => onSelect("text")}
    role="presentation"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="paste-popover-card"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <header class="popover-header">
        <span class="header-label">URL 붙여넣기 옵션</span>
        <span class="url-preview" title={url}>{url}</span>
        <button
          type="button"
          class="close-btn"
          onclick={() => onSelect("text")}
          aria-label="닫기"
        >
          <X size={14} />
        </button>
      </header>

      <div class="options-list">
        {#if isYouTube}
          <button
            type="button"
            class="option-item is-primary"
            onclick={() => onSelect("video")}
          >
            <div class="option-icon">
              <Video size={16} />
            </div>
            <div class="option-text">
              <span class="title">동영상 임베드 (YouTube Player)</span>
              <span class="desc">반응형 플레이어로 재생할 수 있도록 삽입합니다</span>
            </div>
            <span class="key-badge">1</span>
          </button>

          <button
            type="button"
            class="option-item"
            onclick={() => onSelect("embed")}
          >
            <div class="option-icon">
              <Bookmark size={16} />
            </div>
            <div class="option-text">
              <span class="title">북마크 카드 (!embed)</span>
              <span class="desc">제목과 요약이 포함된 링크 카드로 삽입합니다</span>
            </div>
            <span class="key-badge">2</span>
          </button>

          <button
            type="button"
            class="option-item"
            onclick={() => onSelect("link")}
          >
            <div class="option-icon">
              <Link size={16} />
            </div>
            <div class="option-text">
              <span class="title">
                {selectedText ? `선택 텍스트에 링크 적용 ("${selectedText}")` : "일반 링크 ([텍스트](URL))"}
              </span>
              <span class="desc">문맥 속 인라인 하이퍼링크로 삽입합니다</span>
            </div>
            <span class="key-badge">3</span>
          </button>

          <button
            type="button"
            class="option-item"
            onclick={() => onSelect("text")}
          >
            <div class="option-icon">
              <FileText size={16} />
            </div>
            <div class="option-text">
              <span class="title">텍스트로 붙여넣기</span>
              <span class="desc">주소 텍스트를 그대로 삽입합니다</span>
            </div>
            <span class="key-badge">4</span>
          </button>
        {:else}
          <button
            type="button"
            class="option-item is-primary"
            onclick={() => onSelect("embed")}
          >
            <div class="option-icon">
              <Bookmark size={16} />
            </div>
            <div class="option-text">
              <span class="title">북마크 카드 (!embed)</span>
              <span class="desc">제목과 요약이 포함된 리치 링크 카드로 삽입합니다</span>
            </div>
            <span class="key-badge">1</span>
          </button>

          <button
            type="button"
            class="option-item"
            onclick={() => onSelect("link")}
          >
            <div class="option-icon">
              <Link size={16} />
            </div>
            <div class="option-text">
              <span class="title">
                {selectedText ? `선택 텍스트에 링크 적용 ("${selectedText}")` : "일반 링크 ([링크](URL))"}
              </span>
              <span class="desc">문맥 속 인라인 하이퍼링크로 삽입합니다</span>
            </div>
            <span class="key-badge">2</span>
          </button>

          <button
            type="button"
            class="option-item"
            onclick={() => onSelect("text")}
          >
            <div class="option-icon">
              <FileText size={16} />
            </div>
            <div class="option-text">
              <span class="title">텍스트로 붙여넣기</span>
              <span class="desc">주소 텍스트를 그대로 삽입합니다</span>
            </div>
            <span class="key-badge">3</span>
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .paste-popover-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 20, 18, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(2px);
  }

  .paste-popover-card {
    background: var(--page);
    width: 460px;
    max-width: 92%;
    border-radius: 4px;
    border: 1px solid var(--line);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
    overflow: hidden;
    color: var(--ink);
    font-family: var(--font-body);
    animation: popoverFadeIn 0.15s ease-out;
  }

  @keyframes popoverFadeIn {
    from {
      opacity: 0;
      transform: scale(0.97) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 14px;
    background: var(--surface);
    border-bottom: 1px solid var(--line);
  }

  .header-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    flex-shrink: 0;
  }

  .url-preview {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 240px;
  }

  .close-btn {
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    padding: 2px;
    display: flex;
  }

  .close-btn:hover {
    color: var(--ink);
  }

  .options-list {
    display: flex;
    flex-direction: column;
    padding: 6px;
    gap: 2px;
  }

  .option-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 3px;
    border: 1px solid transparent;
    background: transparent;
    text-align: left;
    cursor: pointer;
    color: var(--ink);
    transition: all var(--dur-short) var(--ease-out);
  }

  .option-item:hover,
  .option-item.is-primary:hover {
    background: var(--surface);
    border-color: var(--line);
  }

  .option-icon {
    width: 32px;
    height: 32px;
    border-radius: 3px;
    background: var(--surface);
    border: 1px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    flex-shrink: 0;
  }

  .option-item:hover .option-icon {
    color: var(--accent);
    border-color: var(--accent);
  }

  .option-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .option-text .title {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }

  .option-text .desc {
    font-size: 11px;
    color: var(--muted);
  }

  .key-badge {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 2px 6px;
    border-radius: 3px;
  }
</style>
