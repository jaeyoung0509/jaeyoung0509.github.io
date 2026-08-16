import { getAllPosts } from "$lib/posts";
import { siteConfig } from "$lib/site";
import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = () => {
  const posts = getAllPosts();

  const staticUrls = [
    `<url><loc>${siteConfig.url}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${siteConfig.url}/blog/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${siteConfig.url}/about/</loc><changefreq>yearly</changefreq><priority>0.5</priority></url>`,
  ];

  const postUrls = posts.map(
    (post) =>
      `<url><loc>${siteConfig.url}/blog/${post.slug}/</loc><lastmod>${new Date(
        post.updatedAt ?? post.publishedAt,
      ).toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls.join("\n  ")}
  ${postUrls.join("\n  ")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
