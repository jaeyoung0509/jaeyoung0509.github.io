import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { saveUploadedImage, ensureDevMode } from "$lib/studio";

export const prerender = false;

export const POST: RequestHandler = async ({ request }) => {
  ensureDevMode();
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) throw error(400, "No file provided in form data");

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = saveUploadedImage(buffer, file.name || "image.png");
      return json(result);
    } else {
      const body = await request.json();
      const { base64, filename } = body;
      if (!base64) throw error(400, "No base64 data provided");

      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const base64Data = matches ? matches[2] : base64;
      const buffer = Buffer.from(base64Data, "base64");
      const result = saveUploadedImage(buffer, filename || "pasted_image.png");
      return json(result);
    }
  } catch (err: any) {
    throw error(500, err.message || "Failed to upload image");
  }
};
