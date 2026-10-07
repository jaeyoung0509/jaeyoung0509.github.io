import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { generatePostId, normalizePost, postFrontmatter, sanitizeSlug, type PostContent, type PostSaveIntent } from "../post-shared.ts";

export class PostFileError extends Error {
  status: number;
  constructor(message: string, status = 409) {
    super(message);
    this.status = status;
  }
}

export function findPostFile(directory: string, slug: string): string | undefined {
  const safeSlug = sanitizeSlug(slug);
  if (!safeSlug) return;
  return ["mdx", "md"].map(ext => path.join(directory, `${safeSlug}.${ext}`))
    .find(file => fs.existsSync(file) && fs.statSync(file).isFile());
}

export function readPostFile(file: string): PostContent {
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return normalizePost(data, path.basename(file).replace(/\.(mdx|md)$/, ""), content);
}

export function listPostFiles(directory: string): PostContent[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(file => /\.(mdx|md)$/.test(file))
    .map(file => readPostFile(path.join(directory, file)))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function savePostFile(directory: string, input: PostContent, originalSlug?: string, intent: PostSaveIntent = "save") {
  if (!input || typeof input.title !== "string" || !input.title.trim() || typeof input.content !== "string") {
    throw new PostFileError("제목과 본문을 확인해주세요.", 400);
  }
  if ((input.slug !== undefined && typeof input.slug !== "string") || (originalSlug !== undefined && typeof originalSlug !== "string")) {
    throw new PostFileError("올바른 URL 슬러그를 입력해주세요.", 400);
  }
  const slug = sanitizeSlug(input.slug || input.title);
  if (!slug) throw new PostFileError("올바른 URL 슬러그를 입력해주세요.", 400);
  const source = originalSlug ? findPostFile(directory, originalSlug) : undefined;
  if (originalSlug && !source) throw new PostFileError("기존 글을 찾을 수 없습니다. 목록을 새로고침해주세요.");
  const target = path.join(directory, `${slug}.mdx`);
  const destination = findPostFile(directory, slug);
  const existing = source ? readPostFile(source) : destination ? readPostFile(destination) : undefined;
  if (destination && destination !== source && (!input.id || readPostFile(destination).id !== input.id)) {
    throw new PostFileError("이미 사용 중인 슬러그입니다. 다른 주소를 입력해주세요.");
  }
  if (existing && input.id !== existing.id) {
    throw new PostFileError("다른 글을 덮어쓸 수 없습니다. 목록에서 글을 다시 열어주세요.");
  }
  const post = normalizePost({ ...input, id: existing?.id ?? input.id ?? generatePostId() }, slug, input.content);
  post.draft = intent === "publish" ? input.draft === true : existing?.draft ?? true;
  fs.mkdirSync(directory, { recursive: true });
  const temporary = path.join(directory, `.${slug}.${crypto.randomUUID()}.tmp`);
  try {
    const fd = fs.openSync(temporary, "wx");
    try {
      fs.writeFileSync(fd, matter.stringify(post.content, postFrontmatter(post)), "utf8");
      fs.fsyncSync(fd);
    } finally { fs.closeSync(fd); }
    if (destination === target) {
      fs.renameSync(temporary, target);
    } else {
      // An exclusive hard link prevents a concurrent save from overwriting a new destination.
      fs.linkSync(temporary, target);
      fs.unlinkSync(temporary);
    }
    if (source && source !== target) fs.unlinkSync(source);
    if (!source && destination && destination !== target) fs.unlinkSync(destination);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "EEXIST") {
      throw new PostFileError("이미 사용 중인 슬러그입니다. 다른 주소를 입력해주세요.");
    }
    throw error;
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
  return { success: true, slug, id: post.id!, draft: post.draft, path: target };
}
