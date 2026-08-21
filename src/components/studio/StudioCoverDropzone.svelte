<script lang="ts">
  import { Image, Upload, RefreshCw, Trash2 } from "lucide-svelte";

  let {
    cover = $bindable(),
    coverAlt = $bindable(),
    coverYoutubeId = $bindable(),
    onUpload,
    onChanged,
  }: {
    cover: string | undefined;
    coverAlt?: string;
    coverYoutubeId?: string;
    onUpload: (file: File) => Promise<string | null>;
    onChanged?: () => void;
  } = $props();

  let isDragging = $state(false);
  let isUploading = $state(false);
  let fileInputRef = $state<HTMLInputElement | null>(null);

  const effectiveCover = $derived(
    cover || (coverYoutubeId ? `https://i.ytimg.com/vi/${coverYoutubeId}/hqdefault.jpg` : undefined),
  );

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;

    isUploading = true;
    try {
      const url = await onUpload(file);
      if (url) {
        cover = url;
        coverYoutubeId = undefined;
        if (!coverAlt) {
          coverAlt = file.name.replace(/\.[^/.]+$/, "");
        }
        onChanged?.();
      }
    } finally {
      isUploading = false;
      if (fileInputRef) fileInputRef.value = "";
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    handleFiles(e.dataTransfer?.files || null);
  }

  function handleRemove() {
    cover = undefined;
    coverYoutubeId = undefined;
    onChanged?.();
  }
</script>

<div class="cover-dropzone-wrapper">
  {#if effectiveCover}
    <div class="cover-preview-card">
      <img src={effectiveCover} alt={coverAlt || "Cover"} class="cover-image" />
      <div class="cover-overlay">
        <label class="overlay-btn" title="커버 이미지 변경">
          <RefreshCw size={13} class={isUploading ? "animate-spin" : ""} />
          <span>{isUploading ? "업로드 중..." : "변경"}</span>
          <input
            type="file"
            accept="image/*"
            class="hidden-input"
            bind:this={fileInputRef}
            onchange={(e) => handleFiles((e.target as HTMLInputElement).files)}
          />
        </label>
        <button
          type="button"
          class="overlay-btn danger"
          onclick={handleRemove}
          title="커버 이미지 삭제"
        >
          <Trash2 size={13} />
          <span>삭제</span>
        </button>
      </div>
    </div>
  {:else}
    <div
      class="dropzone-area {isDragging ? 'is-dragging' : ''}"
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
      role="region"
      aria-label="커버 이미지 업로드 영역"
    >
      <label class="dropzone-label">
        <div class="icon-wrap">
          {#if isUploading}
            <RefreshCw size={18} class="animate-spin" />
          {:else}
            <Upload size={18} />
          {/if}
        </div>
        <div class="dropzone-text">
          <span class="primary-text">
            {isUploading ? "이미지 업로드 중..." : "커버 이미지 드래그 앤 드롭 또는 파일 선택"}
          </span>
          <span class="sub-text">PNG, JPG, WEBP, GIF (최대 10MB)</span>
        </div>
        <input
          type="file"
          accept="image/*"
          class="hidden-input"
          bind:this={fileInputRef}
          onchange={(e) => handleFiles((e.target as HTMLInputElement).files)}
        />
      </label>
    </div>
  {/if}
</div>

<style>
  .cover-dropzone-wrapper {
    width: 100%;
    margin-bottom: 8px;
  }

  .dropzone-area {
    border: 1px dashed var(--line-strong);
    border-radius: 4px;
    background: var(--surface);
    transition: all var(--dur-short) var(--ease-out);
    padding: 16px 20px;
  }

  .dropzone-area:hover,
  .dropzone-area.is-dragging {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 4%, var(--surface));
  }

  .dropzone-label {
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
  }

  .icon-wrap {
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

  .dropzone-area:hover .icon-wrap,
  .dropzone-area.is-dragging .icon-wrap {
    color: var(--accent);
    border-color: var(--accent);
  }

  .dropzone-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .primary-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }

  .sub-text {
    font-size: 11px;
    color: var(--muted);
    font-family: var(--font-mono);
  }

  .cover-preview-card {
    position: relative;
    width: 100%;
    height: 180px;
    border-radius: 4px;
    overflow: hidden;
    background: var(--surface);
    border: 1px solid var(--line);
  }

  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .cover-overlay {
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
    gap: 6px;
  }

  .overlay-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 3px;
    background: rgba(15, 20, 18, 0.85);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: background var(--dur-short) var(--ease-out);
  }

  .overlay-btn:hover {
    background: rgba(15, 20, 18, 1);
  }

  .overlay-btn.danger:hover {
    background: #b03a2e;
  }

  .hidden-input {
    display: none;
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
</style>
