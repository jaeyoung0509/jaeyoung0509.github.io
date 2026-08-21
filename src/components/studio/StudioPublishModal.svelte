<script lang="ts">
  import { X, GitBranch, RefreshCw, Send, Check } from "lucide-svelte";
  import StudioCoverDropzone from "./StudioCoverDropzone.svelte";
  import type { StudioPostData } from "$lib/studio";

  let {
    post = $bindable(),
    isOpen = $bindable(),
    isPublishing = false,
    gitPush = $bindable(false),
    gitMessage = $bindable(""),
    publishResult = null,
    onUpload,
    onPublish,
  }: {
    post: StudioPostData;
    isOpen: boolean;
    isPublishing: boolean;
    gitPush: boolean;
    gitMessage: string;
    publishResult: { success: boolean; text: string } | null;
    onUpload: (file: File) => Promise<string | null>;
    onPublish: () => void;
  } = $props();

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s가-힣-]/gu, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
</script>

{#if isOpen}
  <div
    class="modal-backdrop"
    onclick={() => (isOpen = false)}
    role="presentation"
  >
    <div
      class="modal-card"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <header class="modal-header">
        <h2 id="modal-title">출간 설정</h2>
        <button
          type="button"
          class="icon-close-btn"
          onclick={() => (isOpen = false)}
          aria-label="닫기"
        >
          <X size={18} />
        </button>
      </header>

      <div class="modal-body">
        <div class="modal-grid">
          <!-- Left: Thumbnail / Cover -->
          <div class="modal-column">
            <span class="field-title">커버 이미지 (Thumbnail)</span>
            <StudioCoverDropzone
              bind:cover={post.cover}
              bind:coverAlt={post.coverAlt}
              bind:coverYoutubeId={post.coverYoutubeId}
              {onUpload}
            />

            <div class="input-field mt-3">
              <span class="field-label">대체 텍스트 (Alt)</span>
              <input
                type="text"
                class="form-input"
                placeholder="이미지 설명"
                bind:value={post.coverAlt}
              />
            </div>
          </div>

          <!-- Right: Metadata & Options -->
          <div class="modal-column">
            <!-- Description -->
            <div class="input-field">
              <span class="field-title">포스트 요약 (Description)</span>
              <textarea
                class="form-textarea"
                rows={3}
                placeholder="포스트의 핵심 요약을 입력하세요 (미입력 시 본문 앞부분 자동 추출)"
                bind:value={post.description}
              ></textarea>
            </div>

            <!-- URL Slug -->
            <div class="input-field">
              <div class="field-header">
                <span class="field-title">URL 슬러그</span>
                <button
                  type="button"
                  class="text-action-btn"
                  onclick={() => (post.slug = slugify(post.title))}
                >
                  제목에서 자동 생성
                </button>
              </div>
              <div class="slug-input-box">
                <span class="slug-domain">/blog/</span>
                <input
                  type="text"
                  class="slug-text-input"
                  placeholder="post-slug"
                  bind:value={post.slug}
                />
              </div>
            </div>

            <!-- Toggles -->
            <div class="toggle-group">
              <label class="checkbox-label">
                <input type="checkbox" bind:checked={post.draft} />
                <span>임시저장 상태로 보관 (Draft)</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" bind:checked={post.featured} />
                <span>추천 포스트 (Featured)</span>
              </label>
            </div>

            <!-- Meta: Date & Locale -->
            <div class="meta-inputs-row">
              <div class="input-field flex-1">
                <span class="field-label">발행일</span>
                <input
                  type="date"
                  class="form-input"
                  bind:value={post.publishedAt}
                />
              </div>
              <div class="input-field flex-1">
                <span class="field-label">언어</span>
                <select class="form-input" bind:value={post.locale}>
                  <option value="ko">한국어 (ko)</option>
                  <option value="en">English (en)</option>
                </select>
              </div>
            </div>

            <!-- Git Push Option -->
            <div class="git-box">
              <label class="checkbox-label font-medium">
                <input type="checkbox" bind:checked={gitPush} />
                <span>
                  <GitBranch size={13} class="inline-icon" /> 저장 후 GitHub에 즉시 커밋 & 푸시
                </span>
              </label>
              {#if gitPush}
                <input
                  type="text"
                  class="form-input mt-2"
                  placeholder="커밋 메시지 (예: content: publish new post)"
                  bind:value={gitMessage}
                />
              {/if}
            </div>

            {#if publishResult}
              <div
                class="result-banner {publishResult.success ? 'success' : 'error'}"
              >
                {publishResult.text}
              </div>
            {/if}
          </div>
        </div>
      </div>

      <footer class="modal-footer">
        <button
          type="button"
          class="btn-secondary"
          onclick={() => (isOpen = false)}
        >
          취소
        </button>
        <button
          type="button"
          class="btn-primary"
          onclick={onPublish}
          disabled={isPublishing}
        >
          {#if isPublishing}
            <RefreshCw size={14} class="animate-spin" /> 처리 중...
          {:else}
            <Send size={14} /> {post.draft ? "임시저장 완료" : "출간하기"}
          {/if}
        </button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 20, 18, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(3px);
  }

  .modal-card {
    background: var(--page);
    width: 800px;
    max-width: 95%;
    max-height: 90vh;
    border-radius: 4px;
    border: 1px solid var(--line);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: var(--ink);
    font-family: var(--font-body);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--line);
  }

  .modal-header h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  }

  .icon-close-btn {
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
  }

  .icon-close-btn:hover {
    color: var(--ink);
  }

  .modal-body {
    padding: 24px;
    overflow-y: auto;
  }

  .modal-grid {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
  }

  .modal-column {
    display: flex;
    flex-direction: column;
  }

  .field-title {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 6px;
  }

  .field-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    margin-bottom: 4px;
  }

  .input-field {
    margin-bottom: 14px;
  }

  .field-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .text-action-btn {
    border: none;
    background: transparent;
    color: var(--accent);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
  }

  .text-action-btn:hover {
    text-decoration: underline;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 8px 10px;
    font-size: 13px;
    border: 1px solid var(--line);
    border-radius: 3px;
    background: var(--page);
    color: var(--ink);
    outline: none;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color var(--dur-short) var(--ease-out);
  }

  .form-input:focus,
  .form-textarea:focus {
    border-color: var(--line-strong);
  }

  .form-textarea {
    resize: vertical;
    line-height: 1.5;
  }

  .slug-input-box {
    display: flex;
    align-items: center;
    border: 1px solid var(--line);
    border-radius: 3px;
    background: var(--surface);
    padding: 0 8px;
  }

  .slug-domain {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
  }

  .slug-text-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 8px 4px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--ink);
  }

  .toggle-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 14px;
  }

  .checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    cursor: pointer;
  }

  .meta-inputs-row {
    display: flex;
    gap: 10px;
  }

  .flex-1 {
    flex: 1;
  }

  .git-box {
    padding: 12px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 3px;
    margin-top: 6px;
  }

  .inline-icon {
    display: inline;
    vertical-align: -2px;
  }

  .result-banner {
    padding: 8px 12px;
    border-radius: 3px;
    font-size: 12px;
    font-family: var(--font-mono);
    margin-top: 10px;
  }

  .result-banner.success {
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    color: var(--accent-strong);
    border: 1px solid var(--accent);
  }

  .result-banner.error {
    background: color-mix(in srgb, #e74c3c 10%, transparent);
    color: #c0392b;
    border: 1px solid #e74c3c;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 24px;
    border-top: 1px solid var(--line);
    background: var(--surface);
  }

  .btn-secondary {
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid var(--line);
    background: var(--page);
    color: var(--ink);
    border-radius: 3px;
    cursor: pointer;
  }

  .btn-secondary:hover {
    background: var(--surface-strong);
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 18px;
    font-size: 13px;
    font-weight: 600;
    border: 1px solid var(--accent);
    background: var(--accent);
    color: #ffffff;
    border-radius: 3px;
    cursor: pointer;
    transition: background var(--dur-short) var(--ease-out);
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--accent-strong);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .mt-2 {
    margin-top: 8px;
  }

  .mt-3 {
    margin-top: 12px;
  }

  .font-medium {
    font-weight: 500;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 700px) {
    .modal-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
