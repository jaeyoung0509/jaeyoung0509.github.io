export type PasteKind = "video" | "embed" | "link" | "text";

export function insertAtSelection(content: string, start: number, end: number, prefix: string, suffix = "", defaultText = "") {
  const selected = content.slice(start, end) || defaultText;
  return {
    content: content.slice(0, start) + prefix + selected + suffix + content.slice(end),
    start: start + prefix.length, end: start + prefix.length + selected.length,
  };
}

export function pastedUrl(kind: PasteKind, url: string, selectedText: string) {
  if (kind === "video") return `\n${url}\n`;
  if (kind === "embed") return `\n!embed(${url})\n`;
  if (kind === "link") return `[${selectedText || url}](${url})`;
  return url;
}
