import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { compileMarkdown } from "$lib/markdown";
import { ensureDevMode } from "$lib/studio";

export const prerender = false;

export const POST: RequestHandler = async ({ request }) => {
  ensureDevMode();
  try {
    const { content } = await request.json();
    const markdownSource = typeof content === "string" ? content : "";
    const compiled = await compileMarkdown(markdownSource);
    return json(compiled);
  } catch (err: any) {
    throw error(500, err.message || "Failed to compile markdown preview");
  }
};
