type MarkdownNode = {
  type: string;
  lang?: string | null;
  value?: string;
  children?: MarkdownNode[];
};

function replaceMermaidBlocks(node: MarkdownNode): void {
  if (!node.children) return;

  node.children = node.children.flatMap((child) => {
    if (child.type === "code" && child.lang === "mermaid") {
      return [
        {
          type: "mdxJsxFlowElement",
          name: "MermaidDiagram",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "chart",
              value: child.value ?? "",
            },
          ],
          children: [],
        },
      ];
    }

    replaceMermaidBlocks(child);
    return [child];
  });
}

export function remarkMermaid() {
  return (tree: MarkdownNode) => {
    replaceMermaidBlocks(tree);
  };
}
