import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getStudioPost, ensureDevMode } from "$lib/studio";

export const prerender = false;

export const GET: RequestHandler = async ({ params }) => {
  ensureDevMode();
  const { slug } = params;
  if (!slug) throw error(400, "Missing slug parameter");

  const post = getStudioPost(slug);
  if (!post) throw error(404, `Post not found: ${slug}`);

  return json({ post });
};
