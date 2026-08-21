import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getGitStatus, executeGitPush, ensureDevMode } from "$lib/studio";

export const prerender = false;

export const GET: RequestHandler = async () => {
  ensureDevMode();
  const status = await getGitStatus();
  return json(status);
};

export const POST: RequestHandler = async ({ request }) => {
  ensureDevMode();
  try {
    const { message } = await request.json();
    const result = await executeGitPush(message || "content: update post");
    return json(result);
  } catch (err: any) {
    throw error(500, err.message || "Git command failed");
  }
};
