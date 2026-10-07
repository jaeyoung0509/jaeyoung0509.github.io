export type EditorView = "split" | "editor" | "preview";

export class SplitLayout {
  ratio = $state(50);
  dragging = $state(false);
  activePane: "editor" | "preview" = "editor";
  private frame = 0;
  private getWorkspace: () => HTMLElement | null;

  constructor(getWorkspace: () => HTMLElement | null) { this.getWorkspace = getWorkspace; }

  restore() {
    try {
      const value = Number(localStorage.getItem("studio_split_ratio") ?? 50);
      if (Number.isFinite(value)) this.ratio = Math.max(20, Math.min(80, value));
    } catch { /* Storage can be unavailable in private browsing. */ }
  }

  setRatio(value: number) {
    this.ratio = Math.round(Math.max(20, Math.min(80, value)));
    try { localStorage.setItem("studio_split_ratio", String(this.ratio)); } catch { /* Optional preference. */ }
  }

  start = (event: PointerEvent) => {
    event.preventDefault();
    this.dragging = true;
    window.addEventListener("pointermove", this.move);
    window.addEventListener("pointerup", this.stop);
    window.addEventListener("pointercancel", this.stop);
  };

  private move = (event: PointerEvent) => {
    const workspace = this.getWorkspace();
    if (!this.dragging || !workspace) return;
    const bounds = workspace.getBoundingClientRect();
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.setRatio((event.clientX - bounds.left) / bounds.width * 100));
  };

  stop = () => {
    this.dragging = false;
    if (typeof window === "undefined") return;
    window.removeEventListener("pointermove", this.move);
    window.removeEventListener("pointerup", this.stop);
    window.removeEventListener("pointercancel", this.stop);
    cancelAnimationFrame(this.frame);
  };

  keyboard = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      this.setRatio(this.ratio + (event.key === "ArrowRight" ? 5 : -5));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault(); this.setRatio(event.key === "Home" ? 20 : 80);
    }
  };

  syncScroll(from: "editor" | "preview", editor: HTMLElement | null, preview: HTMLElement | null, mode: EditorView) {
    if (this.activePane !== from || !editor || !preview || mode !== "split") return;
    const [source, target] = from === "editor" ? [editor, preview] : [preview, editor];
    const maximum = source.scrollHeight - source.clientHeight;
    if (maximum > 0) target.scrollTop = source.scrollTop / maximum * (target.scrollHeight - target.clientHeight);
  }
}
