import { replaceState } from "$app/navigation";
import { createDraft, generatePostId, sanitizeSlug, type PostContent, type PostSaveIntent } from "../post-shared";
import { errorMessage } from "../errors";

export class EditorSession {
  post = $state<PostContent>(createDraft());
  status = $state<"saved" | "saving" | "unsaved" | "error">("saved");
  lastSavedAt = $state("");
  error = $state("");
  loading = $state(false);
  dirty = $state(false);
  originalSlug: string | undefined;
  private revision = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private queue = Promise.resolve(false);
  private disposed = false;

  async load(slug: string) {
    this.loading = true;
    try {
      const response = await fetch(`/api/studio/posts/${encodeURIComponent(slug)}`);
      if (!response.ok) throw new Error("글을 불러오지 못했습니다. 목록에서 다시 열어주세요.");
      const { post } = await response.json();
      if (this.disposed) return;
      this.post = post;
      this.originalSlug = post.slug;
      this.status = "saved";
    } catch (error) {
      this.error = errorMessage(error);
      this.status = "error";
    } finally { this.loading = false; }
  }

  changed() {
    this.revision++;
    this.dirty = true;
    this.status = "unsaved";
    this.error = "";
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { if (this.post.title.trim()) void this.save(true); }, 1500);
  }

  save(automatic = false, intent: PostSaveIntent = "save", draft?: boolean): Promise<boolean> {
    clearTimeout(this.timer);
    if (this.loading || !this.post.title.trim()) {
      if (!automatic) { this.error = "제목을 입력해주세요."; this.status = "error"; }
      return Promise.resolve(false);
    }
    this.post.id ||= generatePostId();
    this.post.slug ||= sanitizeSlug(this.post.title) || this.post.id;
    const snapshot = $state.snapshot(this.post);
    if (draft !== undefined) snapshot.draft = draft;
    const revision = this.revision;
    this.queue = this.queue.then(async () => {
      this.status = "saving";
      try {
        const response = await fetch("/api/studio/posts", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post: snapshot, originalSlug: this.originalSlug, intent }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.body?.message ?? result.message ?? "저장에 실패했습니다.");
        this.originalSlug = result.slug;
        this.post.id = result.id;
        this.post.draft = result.draft;
        if (revision === this.revision) {
          this.post.slug = result.slug;
          this.status = "saved";
          this.dirty = false;
        } else this.status = "unsaved";
        this.error = "";
        this.lastSavedAt = new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(Date.now());
        if (!this.disposed) {
          const url = new URL(window.location.href);
          url.searchParams.set("slug", result.slug);
          replaceState(url, {});
        }
        return true;
      } catch (error) {
        this.error = errorMessage(error, "저장에 실패했습니다.");
        this.status = "error";
        this.dirty = true;
        return false;
      }
    });
    return this.queue;
  }

  async upload(file: File): Promise<string | null> {
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/studio/upload", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "이미지 업로드에 실패했습니다.");
      return result.url;
    } catch (error) {
      this.error = errorMessage(error);
      return null;
    }
  }

  dispose() { this.disposed = true; clearTimeout(this.timer); }
}
