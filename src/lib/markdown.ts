import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { createHighlighter, type Highlighter } from "shiki";
import type { PostHeading } from "./post-shared";

let highlighterPromise: Promise<Highlighter> | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark-dimmed"],
      langs: [
        "go",
        "python",
        "sh",
        "bash",
        "zsh",
        "javascript",
        "typescript",
        "json",
        "yaml",
        "html",
        "css",
        "diff",
        "text",
        "markdown",
        "mermaid",
        "make",
        "makefile",
        "just",
        "justfile",
        "rust",
      ],
    });
  }
  return highlighterPromise;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const regex = /([a-zA-Z0-9_-]+)=(?:["']([^"']*)["']|{([^}]*)}|([^\s>]+))/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    const key = match[1];
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    attrs[key] = value.trim();
  }
  return attrs;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
  );
  return match ? match[1] : null;
}

function renderYouTubeEmbed(
  videoId: string,
  title = "YouTube Video",
  caption = "",
): string {
  return `\n\n<figure class="youtube-embed"><div class="youtube-embed-frame"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" title="${escapeHtml(title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>\n\n`;
}

function renderLinkCard(
  href: string,
  title = "",
  description = "",
  site = "",
): string {
  let hostname = "";
  try {
    hostname = new URL(href).hostname;
  } catch {
    hostname = href;
  }
  const siteLabel = site || hostname.replace(/^www\./, "");
  const iconLetter = siteLabel.slice(0, 1).toUpperCase();
  const cardTitle = title || siteLabel;

  return `\n\n<a class="link-preview" href="${escapeHtml(href)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(cardTitle)} 새 탭에서 열기"><span class="link-preview-site"><span aria-hidden="true">${escapeHtml(iconLetter)}</span>${escapeHtml(siteLabel)}</span><strong>${escapeHtml(cardTitle)}</strong>${description ? `<span class="link-preview-description">${escapeHtml(description)}</span>` : ""}<span class="link-preview-url">${escapeHtml(hostname)}<svg class="lucide-arrow-up-right" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg></span></a>\n\n`;
}

function transformCustomTags(content: string): string {
  // 1. Preserve code blocks so URLs inside code are untouched
  const codeBlocks: string[] = [];
  let transformed = content.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // 2. Transform legacy <YouTube ... /> and <YouTubeEmbed ... />
  transformed = transformed.replace(
    /<(?:YouTube|YouTubeEmbed)\s+([^>]*?)\/?>/gs,
    (_, attrString) => {
      const attrs = parseAttributes(attrString);
      return renderYouTubeEmbed(
        attrs.videoId || "",
        attrs.title || "YouTube Video",
        attrs.caption || "",
      );
    },
  );

  // 3. Transform legacy <LinkPreview ... />
  transformed = transformed.replace(
    /<LinkPreview\s+([^>]*?)\/?>/gs,
    (_, attrString) => {
      const attrs = parseAttributes(attrString);
      return renderLinkCard(
        attrs.href || "",
        attrs.title || "",
        attrs.description || "",
        attrs.site || "",
      );
    },
  );

  // 4. Transform !embed(url) or !card(url) or !preview(url)
  // Example: !embed(https://docs.temporal.io) "문서 제목" "문서 설명"
  transformed = transformed.replace(
    /!(?:embed|card|preview)\((https?:\/\/[^\s\)]+)\)(?:\s+["']([^"']*)["'])?(?:\s+["']([^"']*)["'])?/g,
    (_, url, title, description) => {
      const ytId = extractYouTubeId(url);
      if (ytId) {
        return renderYouTubeEmbed(
          ytId,
          title || "YouTube Video",
          description || "",
        );
      }
      return renderLinkCard(url, title || "", description || "");
    },
  );

  // 5. Auto-embed standalone bare YouTube URLs on their own line
  // Example: https://www.youtube.com/watch?v=k8cnVCMYmNc
  // or https://youtu.be/k8cnVCMYmNc "영상 제목"
  transformed = transformed.replace(
    /(?:^|\n)\s*(https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}[^\s]*)(?:\s+["']([^"']*)["'])?\s*(?=\n|$)/g,
    (_, url, caption) => {
      const ytId = extractYouTubeId(url);
      if (ytId) {
        return renderYouTubeEmbed(
          ytId,
          caption || "YouTube Video",
          caption || "",
        );
      }
      return _;
    },
  );

  // 6. Restore code blocks
  transformed = transformed.replace(/__CODE_BLOCK_(\d+)__/g, (_, idx) => {
    return codeBlocks[Number(idx)];
  });

  return transformed;
}

function getNodeText(node: any): string {
  if (!node) return "";
  if (node.type === "text") return node.value;
  if (node.children) return node.children.map(getNodeText).join("");
  return "";
}

export type CompiledMarkdown = {
  html: string;
  headings: PostHeading[];
};

export async function compileMarkdown(source: string): Promise<CompiledMarkdown> {
  const highlighter = await getHighlighter();
  const preprocessed = transformCustomTags(source);
  const headings: PostHeading[] = [];

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => (tree) => {
      visit(tree, "code", (node: any) => {
        if (node.lang === "mermaid") {
          node.type = "html";
          node.value = `<figure class="mermaid-diagram" aria-label="워크플로 다이어그램" data-chart="${escapeHtml(
            node.value,
          )}"><div class="mermaid-loading">다이어그램을 불러오는 중입니다.</div></figure>`;
        } else {
          try {
            const lang = node.lang || "text";
            const html = highlighter.codeToHtml(node.value, {
              lang: highlighter.getLoadedLanguages().includes(lang)
                ? lang
                : "text",
              theme: "github-dark-dimmed",
            });
            node.type = "html";
            node.value = html;
          } catch {
            // fallback
          }
        }
      });
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(() => (tree) => {
      visit(tree, "element", (node: any) => {
        if (node.tagName === "h2" || node.tagName === "h3") {
          const depth = (node.tagName === "h2" ? 2 : 3) as 2 | 3;
          const id = node.properties?.id ? String(node.properties.id) : "";
          const text = getNodeText(node).trim();
          if (id && text) {
            headings.push({ depth, id, text });
          }
        }
      });
    })
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const result = await processor.process(preprocessed);
  return {
    html: String(result),
    headings,
  };
}
