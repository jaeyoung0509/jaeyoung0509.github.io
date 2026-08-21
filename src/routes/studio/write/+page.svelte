<script lang="ts">
  import { onMount, tick } from "svelte";
  import { page } from "$app/state";
  import {
    ArrowLeft,
    Save,
    Send,
    Eye,
    Columns,
    FileCode,
    Check,
    AlertCircle,
    X,
    RefreshCw,
    Clock,
  } from "lucide-svelte";
  import StudioCoverDropzone from "$components/studio/StudioCoverDropzone.svelte";
  import StudioToolbar from "$components/studio/StudioToolbar.svelte";
  import StudioPreview from "$components/studio/StudioPreview.svelte";
  import StudioPublishModal from "$components/studio/StudioPublishModal.svelte";
  import StudioUrlPasteModal from "$components/studio/StudioUrlPasteModal.svelte";
  import type { StudioPostData } from "$lib/studio";

  // Post State
  let post = $state<StudioPostData>({
    slug: "",
    title: "",
    description: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    tags: [],
    locale: "ko",
    featured: false,
    draft: false,
    cover: undefined,
    coverAlt: undefined,
    coverYoutubeId: undefined,
    coverYoutubeTitle: undefined,
    content: "",
  });

  let originalSlug = $state<string | null>(null);
  let newTagInput = $state("");
  let tagInputRef = $state<HTMLInputElement | null>(null);
  let textareaRef = $state<HTMLTextAreaElement | null>(null);
  let editorScrollRef = $state<HTMLElement | null>(null);
  let previewScrollRef = $state<HTMLElement | null>(null);
  let workspaceRef = $state<HTMLElement | null>(null);

  // Editor View State
  let viewMode = $state<"split" | "editor" | "preview">("split");
  let saveStatus = $state<"saved" | "saving" | "unsaved" | "error">("saved");
  let lastSavedAt = $state<string>("");
  let showPublishModal = $state(false);
  let isPublishing = $state(false);
  let gitPushOnSave = $state(false);
  let gitCommitMessage = $state("");
  let publishResult = $state<{ success: boolean; text: string } | null>(null);

  // Resizable Split Ratio State
  let splitRatio = $state(50);
  let isDraggingResizer = $state(false);

  // URL Paste Popover State
  let pasteUrlModal = $state<{
    isOpen: boolean;
    url: string;
    selectedText: string;
    start: number;
    end: number;
  }>({
    isOpen: false,
    url: "",
    selectedText: "",
    start: 0,
    end: 0,
  });

  let autoSaveTimer: NodeJS.Timeout | null = null;
  let isSyncingScroll = false;

  // Realtime Writing Metrics
  const writingStats = $derived.by(() => {
    const raw = post.content || "";
    const totalChars = raw.length;
    const charsNoSpaces = raw.replace(/\s/g, "").length;
    const koreanChars = (raw.match(/[\uac00-\ud7a3]/g) || []).length;
    const latinWords = (raw.match(/[a-zA-Z0-9_-]+/g) || []).length;
    const readMins = Math.max(1, Math.ceil(koreanChars / 450 + latinWords / 220));

    return {
      totalChars,
      charsNoSpaces,
      readMins,
    };
  });

  function startResizing(e: PointerEvent) {
    e.preventDefault();
    isDraggingResizer = true;
    window.addEventListener("pointermove", handleResizerMove);
    window.addEventListener("pointerup", stopResizing);
  }

  function handleResizerMove(e: PointerEvent) {
    if (!isDraggingResizer || !workspaceRef) return;
    const rect = workspaceRef.getBoundingClientRect();
    const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(20, Math.min(80, newRatio));
    requestAnimationFrame(() => {
      splitRatio = Math.round(clamped);
      try {
        localStorage.setItem("studio_split_ratio", String(splitRatio));
      } catch {}
    });
  }

  function stopResizing() {
    isDraggingResizer = false;
    window.removeEventListener("pointermove", handleResizerMove);
    window.removeEventListener("pointerup", stopResizing);
  }

  function resetResizer() {
    splitRatio = 50;
    try {
      localStorage.setItem("studio_split_ratio", "50");
    } catch {}
  }

  function handleUrlPasteSelect(type: "video" | "embed" | "link" | "text") {
    const { url, selectedText, start, end } = pasteUrlModal;
    pasteUrlModal.isOpen = false;

    let replacement = url;
    if (type === "video") {
      replacement = `\n${url}\n`;
    } else if (type === "embed") {
      replacement = `\n!embed(${url})\n`;
    } else if (type === "link") {
      const label = selectedText || url;
      replacement = `[${label}](${url})`;
    } else {
      replacement = url;
    }

    post.content =
      post.content.substring(0, start) +
      replacement +
      post.content.substring(end);

    triggerAutoSave();

    tick().then(() => {
      if (!textareaRef) return;
      textareaRef.focus();
      textareaRef.setSelectionRange(
        start + replacement.length,
        start + replacement.length,
      );
    });
  }

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s가-힣-]/gu, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function loadPostBySlug(slug: string) {
    try {
      const res = await fetch(`/api/studio/posts/${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        post = data.post;
        originalSlug = data.post.slug;
      }
    } catch (err) {
      console.error("Failed to load post:", err);
    }
  }

  function triggerAutoSave() {
    saveStatus = "unsaved";

    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      if (post.title.trim()) {
        savePost(true);
      }
    }, 1500);
  }

  async function savePost(isAutoSave = false): Promise<boolean> {
    if (!post.title.trim()) {
      if (!isAutoSave) alert("제목을 입력해주세요.");
      return false;
    }

    if (!post.id) {
      post.id = `p_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    }

    if (!post.slug) {
      post.slug = slugify(post.title) || post.id;
    }

    saveStatus = "saving";
    try {
      const res = await fetch("/api/studio/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post,
          originalSlug,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        originalSlug = data.slug;
        post.slug = data.slug;
        if (data.id) post.id = data.id;
        saveStatus = "saved";

        // Update URL query string seamlessly so refresh keeps editing this post
        if (typeof window !== "undefined" && !page.url.searchParams.get("slug")) {
          const newUrl = `${window.location.pathname}?slug=${encodeURIComponent(data.slug)}`;
          window.history.replaceState({}, "", newUrl);
        }

        const now = new Date();
        lastSavedAt = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        return true;
      } else {
        saveStatus = "error";
        return false;
      }
    } catch {
      saveStatus = "error";
      return false;
    }
  }

  async function handleFinalPublish() {
    isPublishing = true;
    publishResult = null;

    if (!post.description) {
      const cleanText = post.content
        .replace(/#+ /g, "")
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/\[.*?\]\(.*?\)/g, "$1")
        .replace(/[`*_~]/g, "")
        .replace(/\n+/g, " ")
        .trim();
      post.description = cleanText.slice(0, 140) || post.title;
    }

    const saved = await savePost(false);
    if (!saved) {
      isPublishing = false;
      publishResult = { success: false, text: "포스트 저장에 실패했습니다." };
      return;
    }

    if (gitPushOnSave) {
      try {
        const msg =
          gitCommitMessage ||
          `content: ${post.draft ? "draft" : "publish"} "${post.title}"`;
        const res = await fetch("/api/studio/git", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg }),
        });
        const data = await res.json();
        publishResult = {
          success: data.success,
          text: data.success
            ? "저장 및 GitHub 배포 완료!"
            : `저장 완료, Git Push 실패: ${data.output}`,
        };
      } catch (err: any) {
        publishResult = {
          success: false,
          text: `저장 완료, Git Push 에러: ${err.message}`,
        };
      }
    } else {
      publishResult = {
        success: true,
        text: "로컬 디스크 저장 완료!",
      };
    }

    isPublishing = false;
  }

  function handleTagKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = newTagInput.trim().replace(/^#/, "");
      if (val && !post.tags.includes(val)) {
        post.tags = [...post.tags, val];
        newTagInput = "";
        triggerAutoSave();
      }
    } else if (
      e.key === "Backspace" &&
      newTagInput === "" &&
      post.tags.length > 0
    ) {
      post.tags = post.tags.slice(0, -1);
      triggerAutoSave();
    }
  }

  function removeTag(tagToRemove: string) {
    post.tags = post.tags.filter((t) => t !== tagToRemove);
    triggerAutoSave();
  }

  async function uploadImageFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/studio/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
    return null;
  }

  async function handlePaste(e: ClipboardEvent) {
    const items = e.clipboardData?.items;

    // 1. Image upload paste
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (!file) continue;

          const placeholder = `\n![업로드 중...](${Date.now()})\n`;
          insertTextAtCursor(placeholder);

          const imageUrl = await uploadImageFile(file);
          if (imageUrl) {
            const finalMarkdown = `\n![${file.name.replace(/\.[^/.]+$/, "")}](${imageUrl})\n`;
            post.content = post.content.replace(placeholder, finalMarkdown);
            triggerAutoSave();
          } else {
            post.content = post.content.replace(
              placeholder,
              "\n> [이미지 업로드 실패]\n",
            );
          }
          return;
        }
      }
    }

    // 2. URL paste popover (Notion style)
    const pastedText = e.clipboardData?.getData("text/plain")?.trim();
    if (pastedText && /^https?:\/\/[^\s]+$/i.test(pastedText) && textareaRef) {
      e.preventDefault();
      const start = textareaRef.selectionStart;
      const end = textareaRef.selectionEnd;
      const selectedText = post.content.substring(start, end).trim();

      pasteUrlModal = {
        isOpen: true,
        url: pastedText,
        selectedText,
        start,
        end,
      };
    }
  }

  function insertTextAtCursor(prefix: string, suffix = "", defaultText = "") {
    if (!textareaRef) return;
    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selected = post.content.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    post.content =
      post.content.substring(0, start) +
      replacement +
      post.content.substring(end);

    triggerAutoSave();

    tick().then(() => {
      if (!textareaRef) return;
      textareaRef.focus();
      textareaRef.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length,
      );
    });
  }

  function handleTextareaKeyDown(e: KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      insertTextAtCursor("  ");
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      savePost(false);
    }
  }

  let activeScrollPane: "editor" | "preview" = "editor";

  function handleEditorScroll() {
    if (activeScrollPane !== "editor" || !editorScrollRef || !previewScrollRef || viewMode !== "split") return;

    const editorMax = editorScrollRef.scrollHeight - editorScrollRef.clientHeight;
    const previewMax = previewScrollRef.scrollHeight - previewScrollRef.clientHeight;
    if (editorMax <= 0 || previewMax <= 0) return;

    const ratio = editorScrollRef.scrollTop / editorMax;
    previewScrollRef.scrollTop = ratio * previewMax;
  }

  function handlePreviewScroll() {
    if (activeScrollPane !== "preview" || !editorScrollRef || !previewScrollRef || viewMode !== "split") return;

    const previewMax = previewScrollRef.scrollHeight - previewScrollRef.clientHeight;
    const editorMax = editorScrollRef.scrollHeight - editorScrollRef.clientHeight;
    if (previewMax <= 0 || editorMax <= 0) return;

    const ratio = previewScrollRef.scrollTop / previewMax;
    editorScrollRef.scrollTop = ratio * editorMax;
  }

  function autoResizeTextarea() {
    if (!textareaRef) return;
    textareaRef.style.height = "auto";
    textareaRef.style.height = Math.max(600, textareaRef.scrollHeight) + "px";
  }

  $effect(() => {
    if (post.content !== undefined) {
      tick().then(autoResizeTextarea);
    }
  });

  onMount(() => {
    try {
      const savedRatio = localStorage.getItem("studio_split_ratio");
      if (savedRatio) {
        const num = Number(savedRatio);
        if (num >= 20 && num <= 80) splitRatio = num;
      }
    } catch {}

    const slugParam = page.url.searchParams.get("slug");
    if (slugParam) {
      loadPostBySlug(slugParam);
    }
  });
</script>

<svelte:head>
  <title>{post.title ? `${post.title} — Studio` : "새 포스트 — Studio"}</title>
</svelte:head>

<div
  class="editor-workspace {isDraggingResizer ? 'is-resizing' : ''}"
  style="--split-ratio: {splitRatio}%;"
>
  <!-- Minimalist Top Navigation Header -->
  <header class="editor-top-nav">
    <div class="nav-section-left">
      <a href="/studio" class="nav-back-link" title="목록으로 이동">
        <ArrowLeft size={15} />
        <span>나가기</span>
      </a>
      <div class="nav-divider"></div>
      <div class="nav-save-status">
        {#if saveStatus === "saving"}
          <span class="status-text saving">
            <RefreshCw size={11} class="animate-spin" /> 저장 중
          </span>
        {:else if saveStatus === "saved"}
          <span class="status-text saved">
            <Check size={12} /> 저장됨 {lastSavedAt ? `(${lastSavedAt})` : ""}
          </span>
        {:else if saveStatus === "unsaved"}
          <span class="status-text unsaved">
            <AlertCircle size={11} /> 변경사항 있음
          </span>
        {:else}
          <span class="status-text error">
            <AlertCircle size={11} /> 저장 실패
          </span>
        {/if}
      </div>
    </div>

    <!-- Segmented View Mode Switcher -->
    <div class="nav-view-switcher">
      <button
        type="button"
        class="switcher-btn {viewMode === 'split' ? 'is-active' : ''}"
        onclick={() => (viewMode = 'split')}
      >
        <Columns size={14} />
        <span>분할</span>
      </button>
      <button
        type="button"
        class="switcher-btn {viewMode === 'editor' ? 'is-active' : ''}"
        onclick={() => (viewMode = 'editor')}
      >
        <FileCode size={14} />
        <span>에디터</span>
      </button>
      <button
        type="button"
        class="switcher-btn {viewMode === 'preview' ? 'is-active' : ''}"
        onclick={() => (viewMode = 'preview')}
      >
        <Eye size={14} />
        <span>미리보기</span>
      </button>
    </div>

    <!-- Action Buttons & Word Count Metrics -->
    <div class="nav-section-right">
      <div class="writing-stats-pill" title="실시간 글자 수 및 읽기 시간">
        <Clock size={12} />
        <span>{writingStats.totalChars.toLocaleString()}자 · 약 {writingStats.readMins}분</span>
      </div>

      <button
        type="button"
        class="btn-action secondary"
        onclick={() => savePost(false)}
        title="단축키 Cmd+S"
      >
        <Save size={14} />
        <span>임시저장</span>
      </button>
      <button
        type="button"
        class="btn-action primary"
        onclick={() => (showPublishModal = true)}
      >
        <Send size={14} />
        <span>출간하기</span>
      </button>
    </div>
  </header>

  <!-- Pinned Subheader Markdown Toolbar -->
  <StudioToolbar onInsert={insertTextAtCursor} />

  <!-- Workspace Grid -->
  <div
    class="workspace-body view-{viewMode}"
    bind:this={workspaceRef}
  >
    <!-- Left Writing Canvas -->
    <div
      class="editor-column"
      bind:this={editorScrollRef}
      onscroll={handleEditorScroll}
      onmouseenter={() => (activeScrollPane = "editor")}
      ontouchstart={() => (activeScrollPane = "editor")}
      onwheel={() => (activeScrollPane = "editor")}
      onpointerdown={() => (activeScrollPane = "editor")}
    >
      <div class="editor-inner">
        <!-- Drag & Drop Cover Section -->
        <div class="editor-cover-box">
          <StudioCoverDropzone
            bind:cover={post.cover}
            bind:coverAlt={post.coverAlt}
            bind:coverYoutubeId={post.coverYoutubeId}
            onUpload={uploadImageFile}
            onChanged={triggerAutoSave}
          />
        </div>

        <!-- Title Input -->
        <header class="editor-header">
          <input
            type="text"
            class="editor-title-input"
            placeholder="제목을 입력하세요"
            bind:value={post.title}
            oninput={triggerAutoSave}
          />

          <!-- Tags Input Line -->
          <div
            class="editor-meta-line"
            onclick={() => tagInputRef?.focus()}
            role="presentation"
          >
            <span class="editor-date">{post.publishedAt}</span>
            <span class="editor-dot">·</span>
            <span class="editor-locale">{post.locale.toUpperCase()}</span>
            <div class="editor-tags">
              {#each post.tags as tag (tag)}
                <span class="editor-tag-chip">
                  #{tag}
                  <button
                    type="button"
                    class="tag-delete-btn"
                    onclick={(e) => {
                      e.stopPropagation();
                      removeTag(tag);
                    }}
                    aria-label="태그 삭제"
                  >
                    <X size={10} />
                  </button>
                </span>
              {/each}
              <input
                type="text"
                class="editor-tag-input"
                placeholder="태그 입력..."
                bind:this={tagInputRef}
                bind:value={newTagInput}
                onkeydown={handleTagKeyDown}
              />
            </div>
          </div>
        </header>

        <div class="editor-divider"></div>

        <!-- Markdown Textarea -->
        <div class="editor-body-box">
          <textarea
            class="markdown-textarea"
            placeholder="내용을 작성하세요... (이미지 복사 붙여넣기 Cmd+V 지원)"
            bind:this={textareaRef}
            bind:value={post.content}
            oninput={triggerAutoSave}
            onpaste={handlePaste}
            onkeydown={handleTextareaKeyDown}
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Draggable Resizer Handle -->
    {#if viewMode === 'split'}
      <div
        class="resizer-handle {isDraggingResizer ? 'is-dragging' : ''}"
        onpointerdown={startResizing}
        ondblclick={resetResizer}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={splitRatio}
        title="드래그하여 크기 조절 (더블클릭 시 50:50 초기화)"
      >
        <div class="resizer-line"></div>
      </div>
    {/if}

    <!-- Right Live Preview -->
    <div class="preview-column">
      <StudioPreview
        title={post.title}
        description={post.description}
        publishedAt={post.publishedAt}
        locale={post.locale}
        tags={post.tags}
        cover={post.cover}
        coverAlt={post.coverAlt}
        coverYoutubeId={post.coverYoutubeId}
        content={post.content}
        bind:scrollRef={previewScrollRef}
        onScroll={handlePreviewScroll}
        onMouseEnter={() => (activeScrollPane = "preview")}
        onTouchStart={() => (activeScrollPane = "preview")}
        onWheel={() => (activeScrollPane = "preview")}
        onPointerDown={() => (activeScrollPane = "preview")}
      />
    </div>
  </div>

  <!-- Publish Modal -->
  <StudioPublishModal
    bind:post
    bind:isOpen={showPublishModal}
    isPublishing={isPublishing}
    bind:gitPush={gitPushOnSave}
    bind:gitMessage={gitCommitMessage}
    publishResult={publishResult}
    onUpload={uploadImageFile}
    onPublish={handleFinalPublish}
  />

  <!-- Notion-style URL Paste Option Popover -->
  <StudioUrlPasteModal
    bind:isOpen={pasteUrlModal.isOpen}
    url={pasteUrlModal.url}
    selectedText={pasteUrlModal.selectedText}
    onSelect={handleUrlPasteSelect}
  />
</div>

<style>
  .editor-workspace {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--page);
    color: var(--ink);
    font-family: var(--font-body);
    overflow: hidden;
  }

  .editor-workspace.is-resizing {
    user-select: none;
    cursor: col-resize;
  }

  /* Top Navigation */
  .editor-top-nav {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid var(--line);
    background: var(--page);
    flex-shrink: 0;
    z-index: 20;
  }

  .nav-section-left,
  .nav-section-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .nav-back-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 3px;
    transition: all var(--dur-short) var(--ease-out);
  }

  .nav-back-link:hover {
    color: var(--ink);
    background: var(--surface);
  }

  .nav-divider {
    width: 1px;
    height: 14px;
    background: var(--line);
  }

  .status-text {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-family: var(--font-mono);
  }

  .status-text.saved {
    color: var(--accent);
  }

  .status-text.saving {
    color: var(--muted);
  }

  .status-text.unsaved {
    color: #d35400;
  }

  .status-text.error {
    color: #c0392b;
  }

  /* Segmented Switcher */
  .nav-view-switcher {
    display: flex;
    align-items: center;
    background: var(--surface);
    padding: 2px;
    border-radius: 4px;
    border: 1px solid var(--line);
  }

  .switcher-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    border: none;
    background: transparent;
    color: var(--muted);
    border-radius: 3px;
    cursor: pointer;
    transition: all var(--dur-short) var(--ease-out);
  }

  .switcher-btn.is-active {
    background: var(--page);
    color: var(--ink);
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Writing Stats Pill */
  .writing-stats-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--muted);
    background: var(--surface);
    padding: 4px 8px;
    border-radius: 3px;
    border: 1px solid var(--line);
  }

  /* Buttons */
  .btn-action {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all var(--dur-short) var(--ease-out);
  }

  .btn-action.secondary {
    background: var(--surface);
    border-color: var(--line);
    color: var(--ink);
  }

  .btn-action.secondary:hover {
    background: var(--surface-strong);
  }

  .btn-action.primary {
    background: var(--accent);
    color: #ffffff;
  }

  .btn-action.primary:hover {
    background: var(--accent-strong);
  }

  /* Main Workspace */
  .workspace-body {
    flex: 1;
    display: grid;
    overflow: hidden;
    position: relative;
  }

  .workspace-body.view-split {
    grid-template-columns: calc(var(--split-ratio, 50%) - 4px) 8px calc(100% - var(--split-ratio, 50%) - 4px);
  }

  .workspace-body.view-editor {
    grid-template-columns: 1fr;
  }

  .workspace-body.view-editor .preview-column,
  .workspace-body.view-editor .resizer-handle {
    display: none;
  }

  .workspace-body.view-preview {
    grid-template-columns: 1fr;
  }

  .workspace-body.view-preview .editor-column,
  .workspace-body.view-preview .resizer-handle {
    display: none;
  }

  /* Resizer Handle */
  .resizer-handle {
    width: 8px;
    height: 100%;
    cursor: col-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    z-index: 10;
    user-select: none;
    touch-action: none;
  }

  .resizer-line {
    width: 1px;
    height: 100%;
    background: var(--line);
    transition: all var(--dur-short) var(--ease-out);
  }

  .resizer-handle:hover .resizer-line,
  .resizer-handle.is-dragging .resizer-line {
    width: 3px;
    background: var(--accent);
  }

  .editor-column {
    height: 100%;
    background: var(--page);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 32px 36px 140px;
    will-change: scroll-position;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  .preview-column {
    height: 100%;
    overflow: hidden;
  }

  .editor-inner {
    max-width: 720px;
    margin: 0 auto;
  }

  .editor-cover-box {
    margin-bottom: 20px;
  }

  .editor-header {
    margin-bottom: 0;
  }

  .editor-title-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 32px;
    font-weight: 750;
    color: var(--ink);
    background: transparent;
    padding: 0;
    line-height: 1.3;
    margin: 0 0 12px 0;
    min-height: 42px;
  }

  .editor-title-input::placeholder {
    color: var(--faint);
  }

  .editor-meta-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--muted);
    min-height: 28px;
    flex-wrap: wrap;
    cursor: text;
  }

  .editor-dot {
    color: var(--faint);
  }

  .editor-tags {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }

  .editor-tag-chip {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--accent);
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 2px 7px;
    border-radius: 3px;
  }

  .tag-delete-btn {
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }

  .tag-delete-btn:hover {
    color: #c0392b;
  }

  .editor-tag-input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--ink);
    min-width: 100px;
  }

  .editor-divider {
    height: 1px;
    background: var(--line);
    margin: 18px 0 24px;
  }

  .editor-body-box {
    min-height: 500px;
  }

  .markdown-textarea {
    width: 100%;
    min-height: 600px;
    border: none;
    outline: none;
    resize: none;
    padding: 0;
    font-family: var(--font-mono);
    font-size: 14.5px;
    line-height: 1.75;
    background: transparent;
    color: var(--ink);
    box-sizing: border-box;
    overflow: hidden;
    field-sizing: content;
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

  @media (max-width: 860px) {
    .workspace-body.view-split {
      grid-template-columns: 1fr;
    }
    .resizer-handle {
      display: none;
    }
  }
</style>
