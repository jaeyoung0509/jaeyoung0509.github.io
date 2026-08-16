import { siteConfig } from "$lib/site";
import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = () => {
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
