import { errorMessage, errorStatus } from "$lib/errors";
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { compileMarkdown } from "$lib/markdown";
import { ensureDevMode } from "$lib/server/studio";

export const prerender = false;

export const POST: RequestHandler = async ({ request }) => {
  ensureDevMode();
  try {
    const { content } = await request.json();
    const markdownSource = typeof content === "string" ? content : "";
    const compiled = await compileMarkdown(markdownSource);
    return json(compiled);
  } catch (err) {
    throw error(errorStatus(err), errorMessage(err, "Failed to compile markdown preview"));
  }
};
