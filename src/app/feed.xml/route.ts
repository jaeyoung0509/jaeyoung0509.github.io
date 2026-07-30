import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const items = getAllPosts()
    .map(
      (post) => `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${siteConfig.url}/blog/${post.slug}/</link>
          <guid>${siteConfig.url}/blog/${post.slug}/</guid>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
          <description>${escapeXml(post.description)}</description>
        </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(siteConfig.name)}</title>
        <link>${siteConfig.url}</link>
        <description>${escapeXml(siteConfig.description)}</description>
        <language>ko-KR</language>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
