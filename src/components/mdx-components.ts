import { LinkPreview } from "@/components/link-preview";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { YouTubeEmbed } from "@/components/youtube-embed";

/** Components available to every post under content/posts/*.mdx. */
export const mdxComponents = {
  LinkPreview,
  MermaidDiagram,
  YouTube: YouTubeEmbed,
  YouTubeEmbed,
};
