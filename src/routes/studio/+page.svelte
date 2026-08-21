<script lang="ts">
  import { onMount } from "svelte";
  import {
    Plus,
    Search,
    Edit3,
    Trash2,
    GitBranch,
    Eye,
    ArrowLeft,
    RefreshCw,
    UploadCloud,
    Check,
    AlertCircle,
    X,
    HardDrive,
    Sparkles,
  } from "lucide-svelte";
  import type { StudioPostData, ImageGarbageReport } from "$lib/studio";

  let posts = $state<StudioPostData[]>([]);
  let loading = $state(true);
  let searchQuery = $state("");
  let selectedLocale = $state<"all" | "ko" | "en">("all");
  let selectedStatus = $state<"all" | "published" | "draft">("all");

  let gitStatus = $state<{
    branch: string;
    isClean: boolean;
    changes: string[];
  }>({
    branch: "main",
    isClean: true,
    changes: [],
  });
  let gitPushing = $state(false);
  let gitPushMessage = $state("");
  let gitPushResult = $state<{ success: boolean; text: string } | null>(null);

  let deleteConfirmSlug = $state<string | null>(null);

  // Asset Garbage Collection State
  let unusedImages = $state<ImageGarbageReport[]>([]);
  let scanningImages = $state(false);
  let showImageCleanerModal = $state(false);
  let cleaningImages = $state(false);

  async function loadData() {
    loading = true;
    try {
      const [postsRes, gitRes] = await Promise.all([
        fetch("/api/studio/posts"),
        fetch("/api/studio/git"),
      ]);

      if (postsRes.ok) {
        const data = await postsRes.json();
        posts = data.posts || [];
      }

      if (gitRes.ok) {
        gitStatus = await gitRes.json();
      }
    } catch (err) {
      console.error("Failed to load studio data:", err);
    } finally {
      loading = false;
    }
  }

  async function checkUnusedImages() {
    scanningImages = true;
    try {
      const res = await fetch("/api/studio/images");
      if (res.ok) {
        const data = await res.json();
        unusedImages = data.unused || [];
        showImageCleanerModal = true;
      }
    } catch {
      alert("이미지 검사 중 오류가 발생했습니다.");
    } finally {
      scanningImages = false;
    }
  }

  async function handleDeleteUnusedImages() {
    if (unusedImages.length === 0) return;
    cleaningImages = true;
    try {
      const res = await fetch("/api/studio/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filenames: unusedImages.map((img) => img.filename) }),
      });
      if (res.ok) {
        unusedImages = [];
        showImageCleanerModal = false;
        alert("미사용 이미지가 모두 안전하게 정리되었습니다.");
      }
    } catch {
      alert("정리 중 오류가 발생했습니다.");
    } finally {
      cleaningImages = false;
    }
  }

  async function handleDelete(slug: string) {
    if (!slug) return;
    try {
      const res = await fetch("/api/studio/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        posts = posts.filter((p) => p.slug !== slug);
        deleteConfirmSlug = null;
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  }

  async function handleGitPush() {
    gitPushing = true;
    gitPushResult = null;
    try {
      const res = await fetch("/api/studio/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: gitPushMessage || "content: update posts",
        }),
      });
      const data = await res.json();
      gitPushResult = {
        success: data.success,
        text: data.output || (data.success ? "배포 푸시 완료" : "푸시 실패"),
      };
      if (data.success) {
        const gitRes = await fetch("/api/studio/git");
        if (gitRes.ok) gitStatus = await gitRes.json();
      }
    } catch (err: any) {
      gitPushResult = { success: false, text: err.message || "Git Push 실패" };
    } finally {
      gitPushing = false;
    }
  }

  onMount(() => {
    loadData();
  });

  const filteredPosts = $derived(
    posts.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocale =
        selectedLocale === "all" || p.locale === selectedLocale;

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "published" && !p.draft) ||
        (selectedStatus === "draft" && p.draft);

      return matchesSearch && matchesLocale && matchesStatus;
    })
  );

  const stats = $derived({
    total: posts.length,
    published: posts.filter((p) => !p.draft).length,
    drafts: posts.filter((p) => p.draft).length,
    tags: Array.from(new Set(posts.flatMap((p) => p.tags))).length,
  });
</script>

<svelte:head>
  <title>Studio — Content Manager</title>
</svelte:head>

<div class="studio-dashboard">
  <!-- Minimal Header -->
  <header class="dashboard-header">
    <div class="header-left">
      <a href="/" class="link-back" title="블로그 홈">
        <ArrowLeft size={15} />
        <span>블로그 홈</span>
      </a>
      <div class="header-divider"></div>
      <h1 class="header-title">Studio</h1>
      <span class="env-tag">Dev</span>
    </div>

    <div class="header-right">
      <button
        type="button"
        class="btn-icon"
        onclick={loadData}
        title="새로고침"
      >
        <RefreshCw size={14} class={loading ? "animate-spin" : ""} />
      </button>

      <button
        type="button"
        class="btn-secondary"
        onclick={checkUnusedImages}
        title="미사용 이미지 검사 및 정리"
      >
        <HardDrive size={13} />
        <span>{scanningImages ? "검사 중..." : "에셋 정리"}</span>
      </button>

      <a href="/studio/write" class="btn-create">
        <Plus size={15} />
        <span>새 포스트</span>
      </a>
    </div>
  </header>

  <main class="dashboard-content">
    <!-- Stats Row -->
    <div class="stats-strip">
      <div class="stat-item">
        <span class="stat-num">{stats.total}</span>
        <span class="stat-name">전체 글</span>
      </div>
      <div class="stat-sep"></div>
      <div class="stat-item">
        <span class="stat-num">{stats.published}</span>
        <span class="stat-name">발행됨</span>
      </div>
      <div class="stat-sep"></div>
      <div class="stat-item">
        <span class="stat-num">{stats.drafts}</span>
        <span class="stat-name">임시저장</span>
      </div>
      <div class="stat-sep"></div>
      <div class="stat-item">
        <span class="stat-num">{stats.tags}</span>
        <span class="stat-name">태그</span>
      </div>
    </div>

    <!-- Git Sync Bar -->
    <div class="git-bar">
      <div class="git-status-info">
        <GitBranch size={14} class="git-icon" />
        <span class="git-branch-name">{gitStatus.branch}</span>
        <span class="sep-dot">·</span>
        {#if gitStatus.isClean}
          <span class="git-status-clean">
            <Check size={12} /> 최신 상태
          </span>
        {:else}
          <span class="git-status-dirty">
            <AlertCircle size={12} /> {gitStatus.changes.length}개 변경됨
          </span>
        {/if}
      </div>

      <div class="git-form">
        <input
          type="text"
          class="git-commit-input"
          placeholder="커밋 메시지 (선택)"
          bind:value={gitPushMessage}
        />
        <button
          type="button"
          class="btn-git-push"
          onclick={handleGitPush}
          disabled={gitPushing}
        >
          <UploadCloud size={14} />
          <span>{gitPushing ? "푸시 중..." : "GitHub 푸시"}</span>
        </button>
      </div>
    </div>

    {#if gitPushResult}
      <div
        class="git-result-banner {gitPushResult.success ? 'success' : 'error'}"
      >
        <pre>{gitPushResult.text}</pre>
      </div>
    {/if}

    <!-- Search & Filters -->
    <div class="filter-row">
      <div class="search-input-wrap">
        <Search size={14} class="search-icon" />
        <input
          type="text"
          placeholder="제목, 내용, 태그 검색..."
          bind:value={searchQuery}
        />
        {#if searchQuery}
          <button
            type="button"
            class="clear-search-btn"
            onclick={() => (searchQuery = "")}
          >
            <X size={13} />
          </button>
        {/if}
      </div>

      <div class="filter-dropdowns">
        <select bind:value={selectedStatus} class="dropdown-select">
          <option value="all">모든 상태</option>
          <option value="published">발행됨만</option>
          <option value="draft">임시저장만</option>
        </select>

        <select bind:value={selectedLocale} class="dropdown-select">
          <option value="all">모든 언어</option>
          <option value="ko">한국어 (KO)</option>
          <option value="en">English (EN)</option>
        </select>
      </div>
    </div>

    <!-- Posts List -->
    {#if loading}
      <div class="state-message">
        <RefreshCw size={20} class="animate-spin" />
        <span>목록을 불러오는 중...</span>
      </div>
    {:else if filteredPosts.length === 0}
      <div class="state-message">
        <p>작성된 포스트가 없습니다.</p>
        <a href="/studio/write" class="btn-create mt-3">
          <Plus size={14} />
          <span>새 포스트 작성</span>
        </a>
      </div>
    {:else}
      <div class="posts-table">
        {#each filteredPosts as post (post.slug)}
          <div class="post-row {post.draft ? 'is-draft' : ''}">
            {#if post.cover}
              <div class="post-cover-thumb">
                <img src={post.cover} alt={post.title} />
              </div>
            {/if}

            <div class="post-info">
              <div class="post-meta-line">
                <span class="meta-date">{post.publishedAt}</span>
                <span class="sep-dot">·</span>
                <span class="meta-locale">{post.locale.toUpperCase()}</span>
                <span class="sep-dot">·</span>
                {#if post.draft}
                  <span class="status-pill draft">임시저장</span>
                {:else}
                  <span class="status-pill published">발행됨</span>
                {/if}
              </div>

              <h2 class="post-heading">
                <a href={`/studio/write?slug=${post.slug}`}>
                  {post.title}
                </a>
              </h2>

              <p class="post-excerpt">{post.description || "요약 없음"}</p>

              {#if post.tags.length > 0}
                <div class="post-tag-list">
                  {#each post.tags as tag (tag)}
                    <span class="tag-label">#{tag}</span>
                  {/each}
                </div>
              {/if}
            </div>

            <div class="post-row-actions">
              <a
                href={`/studio/write?slug=${post.slug}`}
                class="btn-row-action edit"
                title="수정"
              >
                <Edit3 size={13} />
                <span>수정</span>
              </a>

              {#if !post.draft}
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  class="btn-row-action"
                  title="블로그 보기"
                >
                  <Eye size={13} />
                </a>
              {/if}

              <button
                type="button"
                class="btn-row-action danger"
                onclick={() => (deleteConfirmSlug = post.slug)}
                title="삭제"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>

  <!-- Delete Confirm Modal -->
  {#if deleteConfirmSlug}
    <div
      class="modal-backdrop"
      onclick={() => (deleteConfirmSlug = null)}
      role="presentation"
    >
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        class="confirm-card"
        onclick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
      >
        <h3>포스트 삭제</h3>
        <p>
          <strong>{deleteConfirmSlug}.mdx</strong> 파일을 로컬 디스크에서 삭제하시겠습니까?
        </p>
        <div class="confirm-actions">
          <button
            type="button"
            class="btn-secondary-action"
            onclick={() => (deleteConfirmSlug = null)}
          >
            취소
          </button>
          <button
            type="button"
            class="btn-danger-action"
            onclick={() => handleDelete(deleteConfirmSlug!)}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Asset Garbage Collection Modal -->
  {#if showImageCleanerModal}
    <div
      class="modal-backdrop"
      onclick={() => (showImageCleanerModal = false)}
      role="presentation"
    >
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div
        class="cleaner-card"
        onclick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
      >
        <header class="cleaner-header">
          <h3>미사용 이미지 에셋 정리</h3>
          <button
            type="button"
            class="icon-close"
            onclick={() => (showImageCleanerModal = false)}
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </header>

        <div class="cleaner-body">
          {#if unusedImages.length === 0}
            <div class="clean-empty-state">
              <Check size={28} class="clean-check-icon" />
              <p class="clean-empty-title">모든 이미지가 포스트에서 정상 사용 중입니다.</p>
              <span class="clean-empty-desc">정리할 미사용 파일이 없습니다.</span>
            </div>
          {:else}
            <p class="cleaner-desc">
              어떤 포스트의 본문이나 커버에서도 참조되지 않는 미사용 이미지 <strong>{unusedImages.length}개</strong>가 발견되었습니다:
            </p>
            <div class="image-waste-list">
              {#each unusedImages as img (img.filename)}
                <div class="image-waste-item">
                  <div class="waste-thumb">
                    <img src={img.url} alt={img.filename} />
                  </div>
                  <div class="waste-info">
                    <span class="waste-name">{img.filename}</span>
                    <span class="waste-size">{img.sizeFormatted}</span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <footer class="cleaner-footer">
          <button
            type="button"
            class="btn-secondary-action"
            onclick={() => (showImageCleanerModal = false)}
          >
            닫기
          </button>
          {#if unusedImages.length > 0}
            <button
              type="button"
              class="btn-danger-action"
              onclick={handleDeleteUnusedImages}
              disabled={cleaningImages}
            >
              <Trash2 size={13} />
              <span>{cleaningImages ? "정리 중..." : `미사용 이미지 (${unusedImages.length}개) 일괄 삭제`}</span>
            </button>
          {/if}
        </footer>
      </div>
    </div>
  {/if}
</div>

<style>
  .studio-dashboard {
    min-height: 100vh;
    background: var(--page);
    color: var(--ink);
    font-family: var(--font-body);
  }

  /* Header */
  .dashboard-header {
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    border-bottom: 1px solid var(--line);
    background: var(--page);
    position: sticky;
    top: 0;
    z-index: 20;
  }

  .header-left,
  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .link-back {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: var(--muted);
    text-decoration: none;
    padding: 4px 8px;
    border-radius: 3px;
    transition: all var(--dur-short) var(--ease-out);
  }

  .link-back:hover {
    color: var(--ink);
    background: var(--surface);
  }

  .header-divider {
    width: 1px;
    height: 14px;
    background: var(--line);
  }

  .header-title {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
  }

  .env-tag {
    font-size: 10px;
    font-family: var(--font-mono);
    padding: 2px 6px;
    border-radius: 2px;
    background: var(--surface);
    color: var(--muted);
    border: 1px solid var(--line);
  }

  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--line);
    background: var(--page);
    border-radius: 3px;
    color: var(--muted);
    cursor: pointer;
  }

  .btn-icon:hover {
    color: var(--ink);
    border-color: var(--line-strong);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 3px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink);
    cursor: pointer;
    transition: all var(--dur-short) var(--ease-out);
  }

  .btn-secondary:hover {
    background: var(--surface-strong);
  }

  .btn-create {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--accent);
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 3px;
    text-decoration: none;
    transition: background var(--dur-short) var(--ease-out);
  }

  .btn-create:hover {
    background: var(--accent-strong);
    color: #ffffff;
  }

  /* Content */
  .dashboard-content {
    max-width: 960px;
    margin: 0 auto;
    padding: 28px 24px 80px;
  }

  /* Stats Strip */
  .stats-strip {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 16px 20px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .stat-item {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .stat-num {
    font-size: 18px;
    font-weight: 750;
    color: var(--ink);
    font-family: var(--font-mono);
  }

  .stat-name {
    font-size: 12px;
    color: var(--muted);
  }

  .stat-sep {
    width: 1px;
    height: 14px;
    background: var(--line-strong);
  }

  /* Git Bar */
  .git-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding: 12px 18px;
    border: 1px solid var(--line);
    border-radius: 4px;
    background: var(--page);
    margin-bottom: 20px;
  }

  .git-status-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
  }

  .git-icon {
    color: var(--muted);
  }

  .git-branch-name {
    font-family: var(--font-mono);
    font-weight: 600;
  }

  .sep-dot {
    color: var(--faint);
  }

  .git-status-clean {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    color: var(--accent);
    font-weight: 500;
  }

  .git-status-dirty {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    color: #d35400;
    font-weight: 500;
  }

  .git-form {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .git-commit-input {
    padding: 5px 10px;
    font-size: 12px;
    border: 1px solid var(--line);
    border-radius: 3px;
    background: var(--surface);
    color: var(--ink);
    min-width: 200px;
    outline: none;
  }

  .btn-git-push {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink);
    border-radius: 3px;
    cursor: pointer;
    transition: all var(--dur-short) var(--ease-out);
  }

  .btn-git-push:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
  }

  .git-result-banner {
    padding: 10px 14px;
    border-radius: 3px;
    font-size: 11px;
    font-family: var(--font-mono);
    margin-bottom: 20px;
  }

  .git-result-banner.success {
    background: color-mix(in srgb, var(--accent) 8%, transparent);
    border: 1px solid var(--accent);
    color: var(--accent-strong);
  }

  .git-result-banner.error {
    background: color-mix(in srgb, #e74c3c 8%, transparent);
    border: 1px solid #e74c3c;
    color: #c0392b;
  }

  /* Filters */
  .filter-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .search-input-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    padding: 7px 12px;
    background: var(--page);
    border: 1px solid var(--line);
    border-radius: 3px;
  }

  .search-icon {
    color: var(--muted);
  }

  .search-input-wrap input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: var(--ink);
  }

  .clear-search-btn {
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    padding: 0;
    display: flex;
  }

  .filter-dropdowns {
    display: flex;
    gap: 8px;
  }

  .dropdown-select {
    padding: 7px 10px;
    border: 1px solid var(--line);
    border-radius: 3px;
    background: var(--page);
    color: var(--ink);
    font-size: 12px;
    outline: none;
    cursor: pointer;
  }

  /* Posts Table */
  .posts-table {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--line);
    border-radius: 4px;
    overflow: hidden;
  }

  .post-row {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 16px 20px;
    background: var(--page);
    border-bottom: 1px solid var(--line);
    transition: background var(--dur-short) var(--ease-out);
  }

  .post-row:last-child {
    border-bottom: none;
  }

  .post-row:hover {
    background: var(--surface);
  }

  .post-row.is-draft {
    border-left: 2px solid #e67e22;
  }

  .post-cover-thumb {
    width: 72px;
    height: 48px;
    border-radius: 3px;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--surface);
    border: 1px solid var(--line);
  }

  .post-cover-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .post-info {
    flex: 1;
    min-width: 0;
  }

  .post-meta-line {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--muted);
    font-family: var(--font-mono);
    margin-bottom: 3px;
  }

  .status-pill {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 600;
    letter-spacing: 0.02em;
    display: inline-flex;
    align-items: center;
  }

  .status-pill.published {
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: var(--accent-strong);
    border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
  }

  .status-pill.draft {
    background: color-mix(in srgb, #e67e22 12%, transparent);
    color: #d35400;
    border: 1px solid color-mix(in srgb, #e67e22 25%, transparent);
  }

  .post-heading {
    margin: 2px 0 6px 0;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.4;
    word-break: keep-all;
    overflow-wrap: break-word;
  }

  .post-heading a {
    color: var(--ink);
    text-decoration: none;
  }

  .post-heading a:hover {
    color: var(--accent);
  }

  .post-excerpt {
    margin: 0 0 6px 0;
    font-size: 12px;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  .post-tag-list {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .tag-label {
    font-size: 11px;
    color: var(--muted);
    font-family: var(--font-mono);
  }

  .post-row-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .btn-row-action {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    padding: 5px 10px;
    border-radius: 3px;
    border: 1px solid var(--line);
    background: var(--page);
    color: var(--ink);
    text-decoration: none;
    cursor: pointer;
    transition: all var(--dur-short) var(--ease-out);
  }

  .btn-row-action:hover {
    background: var(--surface-strong);
    border-color: var(--line-strong);
  }

  .btn-row-action.edit {
    background: var(--surface);
    font-weight: 600;
  }

  .btn-row-action.danger {
    color: #c0392b;
  }

  .btn-row-action.danger:hover {
    background: #c0392b;
    color: #ffffff;
    border-color: #c0392b;
  }

  .state-message {
    padding: 60px 24px;
    text-align: center;
    color: var(--muted);
    border: 1px solid var(--line);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 13px;
  }

  /* Modals */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 20, 18, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    backdrop-filter: blur(2px);
  }

  .confirm-card {
    background: var(--page);
    padding: 24px;
    border-radius: 4px;
    border: 1px solid var(--line);
    max-width: 380px;
    width: 90%;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .confirm-card h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 700;
  }

  .confirm-card p {
    font-size: 13px;
    color: var(--muted);
    margin: 0 0 20px 0;
  }

  .confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .cleaner-card {
    background: var(--page);
    width: 520px;
    max-width: 92%;
    max-height: 80vh;
    border-radius: 4px;
    border: 1px solid var(--line);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .cleaner-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--line);
    background: var(--surface);
  }

  .cleaner-header h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
  }

  .icon-close {
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    padding: 2px;
  }

  .cleaner-body {
    padding: 20px;
    overflow-y: auto;
  }

  .clean-empty-state {
    text-align: center;
    padding: 30px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .clean-check-icon {
    color: var(--accent);
    margin-bottom: 6px;
  }

  .clean-empty-title {
    margin: 0;
    font-weight: 600;
    font-size: 14px;
    color: var(--ink);
  }

  .clean-empty-desc {
    font-size: 12px;
    color: var(--muted);
  }

  .cleaner-desc {
    margin: 0 0 14px 0;
    font-size: 13px;
    color: var(--ink);
  }

  .image-waste-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 260px;
    overflow-y: auto;
    border: 1px solid var(--line);
    border-radius: 3px;
    padding: 8px;
    background: var(--surface);
  }

  .image-waste-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px;
    border-radius: 3px;
    background: var(--page);
    border: 1px solid var(--line);
  }

  .waste-thumb {
    width: 48px;
    height: 36px;
    border-radius: 2px;
    overflow: hidden;
    background: var(--surface);
    flex-shrink: 0;
  }

  .waste-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .waste-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
  }

  .waste-name {
    font-size: 12px;
    font-family: var(--font-mono);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .waste-size {
    font-size: 11px;
    color: var(--muted);
    font-family: var(--font-mono);
  }

  .cleaner-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 20px;
    border-top: 1px solid var(--line);
    background: var(--surface);
  }

  .btn-secondary-action {
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid var(--line);
    background: var(--page);
    color: var(--ink);
    border-radius: 3px;
    cursor: pointer;
  }

  .btn-danger-action {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid #c0392b;
    background: #c0392b;
    color: #ffffff;
    border-radius: 3px;
    cursor: pointer;
  }

  .btn-danger-action:hover:not(:disabled) {
    background: #a93226;
  }

  .mt-3 {
    margin-top: 12px;
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
