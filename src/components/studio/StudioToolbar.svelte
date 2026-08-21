<script lang="ts">
  import {
    Heading1,
    Heading2,
    Heading3,
    Bold,
    Italic,
    Strikethrough,
    Quote,
    Code,
    FileCode,
    Link,
    Image,
    Sparkles,
    Video,
  } from "lucide-svelte";

  let {
    onInsert,
  }: {
    onInsert: (prefix: string, suffix?: string, defaultText?: string) => void;
  } = $props();
</script>

<div class="studio-toolbar">
  <div class="toolbar-inner">
    <div class="toolbar-group">
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("# ", "", "제목 1")}
        title="Heading 1"
      >
        <Heading1 size={14} />
      </button>
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("## ", "", "제목 2")}
        title="Heading 2"
      >
        <Heading2 size={14} />
      </button>
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("### ", "", "제목 3")}
        title="Heading 3"
      >
        <Heading3 size={14} />
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("**", "**", "굵게")}
        title="Bold (굵게)"
      >
        <Bold size={14} />
      </button>
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("*", "*", "기울임")}
        title="Italic (기울임)"
      >
        <Italic size={14} />
      </button>
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("~~", "~~", "취소선")}
        title="Strikethrough"
      >
        <Strikethrough size={14} />
      </button>
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("> ", "", "인용구")}
        title="Blockquote (인용구)"
      >
        <Quote size={14} />
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("`", "`", "코드")}
        title="Inline Code"
      >
        <Code size={14} />
      </button>
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("```typescript\n", "\n```", "// 코드 작성")}
        title="Code Block"
      >
        <FileCode size={14} />
      </button>
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("[", "](https://)", "링크 텍스트")}
        title="Link"
      >
        <Link size={14} />
      </button>
      <button
        type="button"
        class="tool-btn"
        onclick={() => onInsert("![대체 텍스트](", ")", "/images/posts/...")}
        title="Image Markdown"
      >
        <Image size={14} />
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <div class="toolbar-group">
      <button
        type="button"
        class="tool-btn text-tool-btn"
        onclick={() =>
          onInsert("```mermaid\nflowchart TD\n  A[시작] --> B[처리]\n  B --> C[완료]\n```\n")}
        title="Mermaid 다이어그램 삽입"
      >
        <Sparkles size={12} />
        <span>Mermaid</span>
      </button>
      <button
        type="button"
        class="tool-btn text-tool-btn"
        onclick={() =>
          onInsert("\nhttps://www.youtube.com/watch?v=VIDEO_ID\n")}
        title="YouTube 영상 임베드"
      >
        <Video size={12} />
        <span>YouTube</span>
      </button>
      <button
        type="button"
        class="tool-btn text-tool-btn"
        onclick={() =>
          onInsert("\n!embed(https://example.com)\n")}
        title="링크 카드 임베드"
      >
        <Link size={12} />
        <span>Embed</span>
      </button>
    </div>
  </div>
</div>

<style>
  .studio-toolbar {
    height: 38px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid var(--line);
    background: var(--surface);
    flex-shrink: 0;
    z-index: 10;
  }

  .toolbar-inner {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .toolbar-group {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .toolbar-divider {
    width: 1px;
    height: 14px;
    background: var(--line-strong);
    margin: 0 6px;
  }

  .tool-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: none;
    background: transparent;
    color: var(--muted);
    border-radius: 3px;
    cursor: pointer;
    transition: all var(--dur-short) var(--ease-out);
  }

  .tool-btn:hover {
    background: var(--surface-strong);
    color: var(--ink);
  }

  .text-tool-btn {
    width: auto;
    gap: 4px;
    padding: 0 6px;
    font-size: 11px;
    font-weight: 600;
    font-family: var(--font-mono);
    color: var(--ink);
  }

  .text-tool-btn:hover {
    color: var(--accent);
  }
</style>
