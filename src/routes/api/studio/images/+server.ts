import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  ensureDevMode,
  getUnusedImages,
  deleteUnusedImages,
} from "$lib/studio";

export const prerender = false;

export const GET: RequestHandler = async () => {
  ensureDevMode();
  const unused = getUnusedImages();
  return json({ unused });
};

export const DELETE: RequestHandler = async ({ request }) => {
  ensureDevMode();
  const body = await request.json();
  const filenames = Array.isArray(body.filenames) ? body.filenames : [];
  const result = deleteUnusedImages(filenames);
  return json(result);
};
