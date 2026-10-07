import fs from "node:fs";
import path from "node:path";
import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";
import { findPostFile, listPostFiles, readPostFile, savePostFile } from "./post-files";
import { gitRunner, pushContent, readGitStatus } from "./git";
import type { PostSaveIntent, StudioPostData } from "../post-shared";
import type { ImageGarbageReport } from "../studio";

const directory = path.join(process.cwd(), "content", "posts");
const imagesDirectory = path.join(process.cwd(), "static", "images", "posts");
const runGit = gitRunner(process.cwd());

export function ensureDevMode() {
  if (!dev) error(404, "Studio is only available in development mode");
}

export function getAllStudioPosts(): StudioPostData[] {
  ensureDevMode();
  return listPostFiles(directory);
}

export function getStudioPost(slug: string): StudioPostData | null {
  ensureDevMode();
  const file = findPostFile(directory, slug);
  return file ? readPostFile(file) : null;
}

export function saveStudioPost(post: StudioPostData, originalSlug?: string, intent: PostSaveIntent = "save") {
  ensureDevMode();
  return savePostFile(directory, post, originalSlug, intent);
}

export function deleteStudioPost(slug: string): boolean {
  ensureDevMode();
  const file = findPostFile(directory, slug);
  if (!file) return false;
  fs.unlinkSync(file);
  return true;
}

export function saveUploadedImage(buffer: Buffer, originalFilename: string) {
  ensureDevMode();
  const ext = path.extname(originalFilename).toLowerCase();
  if (!/\.(png|jpe?g|webp|gif|avif|svg)$/.test(ext)) error(400, "지원하지 않는 이미지 형식입니다.");
  if (buffer.length > 10 * 1024 * 1024) error(413, "10MB 이하의 이미지를 선택해주세요.");
  fs.mkdirSync(imagesDirectory, { recursive: true });
  const filename = `${Date.now()}_${crypto.randomUUID().slice(0, 8)}${ext}`;
  fs.writeFileSync(path.join(imagesDirectory, filename), buffer, { flag: "wx" });
  return { url: `/images/posts/${filename}`, filename };
}

export async function getGitStatus() {
  ensureDevMode();
  return readGitStatus(runGit);
}

export async function executeGitPush(message: string) {
  ensureDevMode();
  return pushContent(message, runGit);
}

export function getUnusedImages(): ImageGarbageReport[] {
  ensureDevMode();
  if (!fs.existsSync(imagesDirectory)) return [];
  const references = getAllStudioPosts().map(post =>
    `${post.content} ${post.cover ?? ""} ${post.thumbnail ?? ""}`
  ).join("\n");
  return fs.readdirSync(imagesDirectory)
    .filter(file => /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(file) && !references.includes(file))
    .map(filename => {
      const sizeBytes = fs.statSync(path.join(imagesDirectory, filename)).size;
      return {
        filename, url: `/images/posts/${filename}`, sizeBytes,
        sizeFormatted: sizeBytes > 1024 * 1024 ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(sizeBytes / 1024)} KB`,
      };
    });
}

export function deleteUnusedImages(filenames: string[]) {
  ensureDevMode();
  const unused = new Set(getUnusedImages().map(image => image.filename));
  const deleted: string[] = [];
  const failed: string[] = [];
  for (const filename of filenames) {
    if (typeof filename !== "string" || filename !== path.basename(filename) || !unused.has(filename)) {
      failed.push(filename);
      continue;
    }
    try { fs.unlinkSync(path.join(imagesDirectory, filename)); deleted.push(filename); }
    catch { failed.push(filename); }
  }
  return { deleted, failed };
}
