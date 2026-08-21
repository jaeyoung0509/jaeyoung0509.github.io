import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  getAllStudioPosts,
  saveStudioPost,
  deleteStudioPost,
  ensureDevMode,
} from "$lib/studio";

export const prerender = false;

export const GET: RequestHandler = async () => {
  ensureDevMode();
  const posts = getAllStudioPosts();
  return json({ posts });
};

export const POST: RequestHandler = async ({ request }) => {
  ensureDevMode();
  try {
    const body = await request.json();
    const { post, originalSlug } = body;
    if (!post) {
      throw error(400, "Missing post data");
    }

    const result = saveStudioPost(post, originalSlug);
    return json(result);
  } catch (err: any) {
    throw error(err.status || 500, err.message || "Failed to save post");
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  ensureDevMode();
  try {
    const { slug } = await request.json();
    if (!slug) throw error(400, "Missing slug");

    const deleted = deleteStudioPost(slug);
    return json({ success: deleted });
  } catch (err: any) {
    throw error(500, err.message || "Failed to delete post");
  }
};
