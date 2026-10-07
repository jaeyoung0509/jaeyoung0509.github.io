import { errorMessage, errorStatus } from "$lib/errors";
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getGitStatus, executeGitPush, ensureDevMode } from "$lib/server/studio";

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
  } catch (err) {
    throw error(errorStatus(err), errorMessage(err, "Git command failed"));
  }
};
