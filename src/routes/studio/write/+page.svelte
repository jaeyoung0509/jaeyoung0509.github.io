<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { page } from "$app/state";
  import { beforeNavigate, goto } from "$app/navigation";
  import { ArrowLeft, Save, Send, Eye, Columns, FileCode, Check, AlertCircle, X, RefreshCw, Clock } from "lucide-svelte";
  import StudioCoverDropzone from "$components/studio/StudioCoverDropzone.svelte";
  import StudioToolbar from "$components/studio/StudioToolbar.svelte";
  import StudioPreview from "$components/studio/StudioPreview.svelte";
  import StudioPublishModal from "$components/studio/StudioPublishModal.svelte";
  import StudioUrlPasteModal from "$components/studio/StudioUrlPasteModal.svelte";
  import { EditorSession } from "$lib/studio/editor-session.svelte";
  import { SplitLayout, type EditorView } from "$lib/studio/split-layout.svelte";
  import { insertAtSelection, pastedUrl, type PasteKind } from "$lib/studio/editor-input";
  import { createDescription, getWritingStats } from "$lib/post-shared";
  import { errorMessage } from "$lib/errors";
  import "../../../styles/studio-editor.css";

  const session = new EditorSession();
  const post = $derived(session.post);
  let newTagInput = $state("");
  let tagInputRef = $state<HTMLInputElement | null>(null);
  let textareaRef = $state<HTMLTextAreaElement | null>(null);
  let editorScrollRef = $state<HTMLElement | null>(null);
  let previewScrollRef = $state<HTMLElement | null>(null);
  let workspaceRef = $state<HTMLElement | null>(null);
  const split = new SplitLayout(() => workspaceRef);
  let viewMode = $state<EditorView>("split");
  let showPublishModal = $state(false);
  let isPublishing = $state(false);
  let gitPushOnSave = $state(false);
  let gitCommitMessage = $state("");
  let publishResult = $state<{ success: boolean; text: string } | null>(null);
  let pasteUrlModal = $state({ isOpen: false, url: "", selectedText: "", start: 0, end: 0 });
  const writingStats = $derived(getWritingStats(post.content));

  const triggerAutoSave = () => session.changed();
  const uploadImageFile = (file: File) => session.upload(file);

  async function selectCursor(start: number, end = start) {
    await tick();
    textareaRef?.focus();
    textareaRef?.setSelectionRange(start, end);
  }

  function insertTextAtCursor(prefix: string, suffix = "", defaultText = "") {
    if (!textareaRef) return;
    const result = insertAtSelection(post.content, textareaRef.selectionStart, textareaRef.selectionEnd, prefix, suffix, defaultText);
    post.content = result.content;
    triggerAutoSave();
    void selectCursor(result.start, result.end);
  }

  function handleUrlPasteSelect(kind: PasteKind) {
    const { url, selectedText, start, end } = pasteUrlModal;
    pasteUrlModal.isOpen = false;
    const replacement = pastedUrl(kind, url, selectedText);
    post.content = post.content.slice(0, start) + replacement + post.content.slice(end);
    triggerAutoSave();
    void selectCursor(start + replacement.length);
  }

  async function handlePaste(event: ClipboardEvent) {
    for (const item of event.clipboardData?.items ?? []) {
      if (!item.type.startsWith("image/")) continue;
      const file = item.getAsFile();
      if (!file) continue;
      event.preventDefault();
      const placeholder = `\n![업로드 중...](${crypto.randomUUID()})\n`;
      insertTextAtCursor(placeholder);
      const url = await uploadImageFile(file);
      post.content = post.content.replace(placeholder, url ? `\n![${file.name.replace(/\.[^/.]+$/, "")}](${url})\n` : "\n> 이미지 업로드에 실패했습니다.\n");
      triggerAutoSave();
      return;
    }
    const url = event.clipboardData?.getData("text/plain")?.trim();
    if (url && /^https?:\/\/[^\s]+$/i.test(url) && textareaRef) {
      event.preventDefault();
      const start = textareaRef.selectionStart;
      const end = textareaRef.selectionEnd;
      pasteUrlModal = { isOpen: true, url, selectedText: post.content.slice(start, end).trim(), start, end };
    }
  }

  function handleTagKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const tag = newTagInput.trim().replace(/^#/, "");
      if (tag && !post.tags.includes(tag)) { post.tags.push(tag); newTagInput = ""; triggerAutoSave(); }
    } else if (event.key === "Backspace" && !newTagInput && post.tags.length) {
      post.tags.pop(); triggerAutoSave();
    }
  }

  function removeTag(tag: string) { post.tags = post.tags.filter(value => value !== tag); triggerAutoSave(); }
  function handleTextareaKeyDown(event: KeyboardEvent) {
    if (event.key === "Tab") { event.preventDefault(); insertTextAtCursor("  "); }
    else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") { event.preventDefault(); void session.save(); }
  }

  async function handleFinalPublish(asDraft = false) {
    isPublishing = true;
    publishResult = null;
    post.description ||= createDescription(post.content, post.title);
    const saved = await session.save(false, "publish", asDraft);
    if (!saved) { isPublishing = false; publishResult = { success: false, text: session.error }; return; }
    try {
      if (gitPushOnSave) {
        const response = await fetch("/api/studio/git", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: gitCommitMessage || `content: ${asDraft ? "draft" : "publish"} ${post.title}` }),
        });
        const result = await response.json();
        publishResult = { success: result.success, text: result.success ? "저장 및 GitHub 푸시 완료" : `저장 완료, 푸시 실패: ${result.output}` };
      } else publishResult = { success: true, text: asDraft ? "초안을 로컬에 저장했습니다." : "발행 상태로 로컬에 저장했습니다." };
    } catch (error) { publishResult = { success: false, text: `저장 완료, 푸시 실패: ${errorMessage(error)}` }; }
    finally { isPublishing = false; }
  }

  function handleEditorScroll() { split.syncScroll("editor", editorScrollRef, previewScrollRef, viewMode); }
  function handlePreviewScroll() { split.syncScroll("preview", editorScrollRef, previewScrollRef, viewMode); }

  $effect(() => {
    void post.content;
    tick().then(() => { if (textareaRef) { textareaRef.style.height = "auto"; textareaRef.style.height = `${Math.max(600, textareaRef.scrollHeight)}px`; } });
  });

  beforeNavigate(({ cancel, to, type }) => {
    if (!session.dirty && session.status !== "saving") return;
    if (type === "leave") { cancel(); return; }
    if (to && post.title.trim()) {
      cancel();
      void session.save(true).then(saved => { if (saved) void goto(to.url); });
    } else if (!window.confirm("저장하지 않은 변경사항을 버리고 나갈까요?")) cancel();
  });

  onMount(() => {
    split.restore();
    const slug = page.url.searchParams.get("slug");
    if (slug) void session.load(slug);
    const media = window.matchMedia("(max-width: 860px)");
    const sync = () => { if (media.matches && viewMode === "split") viewMode = "editor"; };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  });
  onDestroy(() => { session.dispose(); split.stop(); });
</script>

<svelte:head>
  <title>{post.title ? `${post.title} — Studio` : "새 포스트 — Studio"}</title>
</svelte:head>

<div
  class="editor-workspace {split.dragging ? 'is-resizing' : ''}"
  style="--split-ratio: {split.ratio}%;"
>
  <!-- Minimalist Top Navigation Header -->
  <header class="editor-top-nav">
    <div class="nav-section-left">
      <a href="/studio" class="nav-back-link" title="목록으로 이동">
        <ArrowLeft size={15} />
        <span>나가기</span>
      </a>
      <div class="nav-divider"></div>
      <div class="nav-save-status" role="status">
        {#if session.status === "saving"}
          <span class="status-text saving">
            <RefreshCw size={11} class="animate-spin" /> 저장 중
          </span>
        {:else if session.status === "saved"}
          <span class="status-text saved">
            <Check size={12} /> 저장됨 {session.lastSavedAt ? `(${session.lastSavedAt})` : ""}
          </span>
        {:else if session.status === "unsaved"}
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
        class="switcher-btn split-mode {viewMode === 'split' ? 'is-active' : ''}"
        aria-pressed={viewMode === 'split'}
        onclick={() => (viewMode = 'split')}
      >
        <Columns size={14} />
        <span>분할</span>
      </button>
      <button
        type="button"
        class="switcher-btn {viewMode === 'editor' ? 'is-active' : ''}"
        aria-pressed={viewMode === 'editor'}
        onclick={() => (viewMode = 'editor')}
      >
        <FileCode size={14} />
        <span>에디터</span>
      </button>
      <button
        type="button"
        class="switcher-btn {viewMode === 'preview' ? 'is-active' : ''}"
        aria-pressed={viewMode === 'preview'}
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
        onclick={() => session.save()}
        title="단축키 Cmd+S"
      >
        <Save size={14} />
        <span>{post.draft ? "임시저장" : "저장"}</span>
      </button>
      <button
        type="button"
        class="btn-action primary"
        onclick={() => { publishResult = null; showPublishModal = true; }}
      >
        <Send size={14} />
        <span>출간하기</span>
      </button>
    </div>
  </header>

  {#if session.error}<p class="editor-error" role="alert">{session.error}</p>{/if}

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
      role="region"
      aria-label="마크다운 편집"
      bind:this={editorScrollRef}
      onscroll={handleEditorScroll}
      onmouseenter={() => (split.activePane = "editor")}
      ontouchstart={() => (split.activePane = "editor")}
      onwheel={() => (split.activePane = "editor")}
      onpointerdown={() => (split.activePane = "editor")}
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
            aria-label="포스트 제목"
            disabled={session.loading}
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
                    aria-label={`${tag} 태그 삭제`}
                  >
                    <X size={10} />
                  </button>
                </span>
              {/each}
              <input
                type="text"
                class="editor-tag-input"
                placeholder="태그 입력..."
                aria-label="태그 입력"
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
            aria-label="마크다운 본문"
            disabled={session.loading}
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
        class="resizer-handle {split.dragging ? 'is-dragging' : ''}"
        onpointerdown={split.start}
        ondblclick={() => split.setRatio(50)}
        role="slider"
        tabindex="0"
        aria-label="에디터와 미리보기 너비 조절"
        aria-valuemin="20"
        aria-valuemax="80"
        onkeydown={split.keyboard}
        aria-orientation="horizontal"
        aria-valuenow={split.ratio}
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
        onMouseEnter={() => (split.activePane = "preview")}
        onTouchStart={() => (split.activePane = "preview")}
        onWheel={() => (split.activePane = "preview")}
        onPointerDown={() => (split.activePane = "preview")}
      />
    </div>
  </div>

  <!-- Publish Modal -->
  <StudioPublishModal
    bind:post={session.post}
    bind:isOpen={showPublishModal}
    isPublishing={isPublishing}
    bind:gitPush={gitPushOnSave}
    bind:gitMessage={gitCommitMessage}
    publishResult={publishResult}
    onUpload={uploadImageFile}
    onPublish={handleFinalPublish}
    onChanged={triggerAutoSave}
  />

  <!-- Notion-style URL Paste Option Popover -->
  <StudioUrlPasteModal
    bind:isOpen={pasteUrlModal.isOpen}
    url={pasteUrlModal.url}
    selectedText={pasteUrlModal.selectedText}
    onSelect={handleUrlPasteSelect}
  />
</div>
