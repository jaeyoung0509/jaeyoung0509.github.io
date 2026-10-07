import { errorMessage, errorStatus } from "$lib/errors";
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  getAllStudioPosts,
  saveStudioPost,
  deleteStudioPost,
  ensureDevMode,
} from "$lib/server/studio";

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
    const { post, originalSlug, intent } = body;
    if (!post) {
      throw error(400, "Missing post data");
    }

    const result = saveStudioPost(post, originalSlug, intent === "publish" ? "publish" : "save");
    return json(result);
  } catch (err) {
    throw error(errorStatus(err), errorMessage(err, "Failed to save post"));
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  ensureDevMode();
  try {
    const { slug } = await request.json();
    if (!slug) throw error(400, "Missing slug");

    const deleted = deleteStudioPost(slug);
    return json({ success: deleted });
  } catch (err) {
    throw error(errorStatus(err), errorMessage(err, "Failed to delete post"));
  }
};
