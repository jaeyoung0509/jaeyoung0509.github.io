import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";

const execAsync = promisify(exec);

const postsDirectory = path.join(process.cwd(), "content", "posts");
const imagesDirectory = path.join(process.cwd(), "static", "images", "posts");

export interface StudioPostData {
  id?: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  locale: "ko" | "en";
  featured: boolean;
  draft: boolean;
  cover?: string;
  coverAlt?: string;
  coverYoutubeId?: string;
  coverYoutubeTitle?: string;
  content: string;
}

export function generatePostId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `p_${timestamp}_${random}`;
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s가-힣-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ensureDevMode() {
  if (!dev) {
    throw error(404, "Studio is only available in development mode");
  }
}

export function getAllStudioPosts(): StudioPostData[] {
  ensureDevMode();
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  const posts: StudioPostData[] = [];

  for (const file of files) {
    try {
      const slug = file.replace(/\.(mdx|md)$/, "");
      const fullPath = path.join(postsDirectory, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(raw);

      posts.push({
        id: data.id ? String(data.id) : `p_${slug}`,
        slug,
        title: String(data.title || slug),
        description: String(data.description || ""),
        publishedAt: String(
          data.publishedAt || new Date().toISOString().slice(0, 10)
        ),
        updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        locale: data.locale === "en" ? "en" : "ko",
        featured: Boolean(data.featured),
        draft: Boolean(data.draft),
        cover: data.cover ? String(data.cover) : undefined,
        coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
        coverYoutubeId: data.coverYoutubeId
          ? String(data.coverYoutubeId)
          : undefined,
        coverYoutubeTitle: data.coverYoutubeTitle
          ? String(data.coverYoutubeTitle)
          : undefined,
        content,
      });
    } catch {
      // Skip corrupted file
    }
  }

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).valueOf() - new Date(a.publishedAt).valueOf()
  );
}

export function getStudioPost(slug: string): StudioPostData | null {
  ensureDevMode();
  const safeSlug = sanitizeSlug(slug);
  const mdxPath = path.join(postsDirectory, `${safeSlug}.mdx`);
  const mdPath = path.join(postsDirectory, `${safeSlug}.md`);

  let targetPath = fs.existsSync(mdxPath) ? mdxPath : null;
  if (!targetPath && fs.existsSync(mdPath)) {
    targetPath = mdPath;
  }

  if (!targetPath) return null;

  const raw = fs.readFileSync(targetPath, "utf8");
  const { data, content } = matter(raw);

  return {
    id: data.id ? String(data.id) : `p_${safeSlug}`,
    slug: safeSlug,
    title: String(data.title || safeSlug),
    description: String(data.description || ""),
    publishedAt: String(
      data.publishedAt || new Date().toISOString().slice(0, 10)
    ),
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    locale: data.locale === "en" ? "en" : "ko",
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    cover: data.cover ? String(data.cover) : undefined,
    coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
    coverYoutubeId: data.coverYoutubeId
      ? String(data.coverYoutubeId)
      : undefined,
    coverYoutubeTitle: data.coverYoutubeTitle
      ? String(data.coverYoutubeTitle)
      : undefined,
    content,
  };
}

export function saveStudioPost(
  post: StudioPostData,
  originalSlug?: string
): { success: boolean; slug: string; id: string; path: string } {
  ensureDevMode();
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  const id = post.id || generatePostId();
  let safeSlug = sanitizeSlug(post.slug || post.title || id);
  if (!safeSlug) {
    safeSlug = id;
  }

  // Handle rename/slug change
  if (originalSlug && originalSlug !== safeSlug) {
    const oldMdx = path.join(postsDirectory, `${sanitizeSlug(originalSlug)}.mdx`);
    const oldMd = path.join(postsDirectory, `${sanitizeSlug(originalSlug)}.md`);
    if (fs.existsSync(oldMdx)) fs.unlinkSync(oldMdx);
    if (fs.existsSync(oldMd)) fs.unlinkSync(oldMd);
  }

  const cleanDesc =
    post.description ||
    post.content
      .replace(/#+ /g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 140) ||
    post.title;

  const frontmatter: Record<string, any> = {
    id,
    title: post.title,
    description: cleanDesc,
    publishedAt: post.publishedAt || new Date().toISOString().slice(0, 10),
  };

  if (post.updatedAt) {
    frontmatter.updatedAt = post.updatedAt;
  }

  frontmatter.tags = post.tags || [];
  frontmatter.locale = post.locale || "ko";
  frontmatter.featured = Boolean(post.featured);
  frontmatter.draft = Boolean(post.draft);

  if (post.cover) frontmatter.cover = post.cover;
  if (post.coverAlt) frontmatter.coverAlt = post.coverAlt;
  if (post.coverYoutubeId) frontmatter.coverYoutubeId = post.coverYoutubeId;
  if (post.coverYoutubeTitle)
    frontmatter.coverYoutubeTitle = post.coverYoutubeTitle;

  const fileContent = matter.stringify(post.content || "", frontmatter);
  const targetFile = path.join(postsDirectory, `${safeSlug}.mdx`);

  fs.writeFileSync(targetFile, fileContent, "utf8");

  return {
    success: true,
    slug: safeSlug,
    id,
    path: targetFile,
  };
}

export function deleteStudioPost(slug: string): boolean {
  ensureDevMode();
  const safeSlug = sanitizeSlug(slug);
  const mdxPath = path.join(postsDirectory, `${safeSlug}.mdx`);
  const mdPath = path.join(postsDirectory, `${safeSlug}.md`);

  let deleted = false;
  if (fs.existsSync(mdxPath)) {
    fs.unlinkSync(mdxPath);
    deleted = true;
  }
  if (fs.existsSync(mdPath)) {
    fs.unlinkSync(mdPath);
    deleted = true;
  }

  return deleted;
}

export function saveUploadedImage(
  buffer: Buffer,
  originalFilename: string
): { url: string; filename: string } {
  ensureDevMode();
  if (!fs.existsSync(imagesDirectory)) {
    fs.mkdirSync(imagesDirectory, { recursive: true });
  }

  const ext = path.extname(originalFilename).toLowerCase() || ".png";
  const now = new Date();
  const datePrefix = now
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14); // YYYYMMDDHHmmss
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const filename = `${datePrefix}_${randomSuffix}${ext}`;
  const targetPath = path.join(imagesDirectory, filename);

  fs.writeFileSync(targetPath, buffer);

  return {
    url: `/images/posts/${filename}`,
    filename,
  };
}

export async function getGitStatus(): Promise<{
  branch: string;
  isClean: boolean;
  changes: string[];
}> {
  ensureDevMode();
  try {
    const { stdout: branch } = await execAsync("git branch --show-current");
    const { stdout: status } = await execAsync("git status --porcelain");
    const changes = status
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return {
      branch: branch.trim(),
      isClean: changes.length === 0,
      changes,
    };
  } catch (err: any) {
    return {
      branch: "unknown",
      isClean: true,
      changes: [String(err?.message || "Git check failed")],
    };
  }
}

export async function executeGitPush(commitMessage: string): Promise<{
  success: boolean;
  output: string;
}> {
  ensureDevMode();
  try {
    const safeMessage = commitMessage.replace(/"/g, '\\"');
    const { stdout: addOut } = await execAsync(
      "git add content/posts static/images"
    );
    const { stdout: commitOut } = await execAsync(
      `git commit -m "${safeMessage || "content: update blog posts"}"`
    );
    const { stdout: pushOut } = await execAsync("git push origin main");

    return {
      success: true,
      output: `${addOut}\n${commitOut}\n${pushOut}`.trim(),
    };
  } catch (err: any) {
    return {
      success: false,
      output: String(err?.stderr || err?.stdout || err?.message || "Git push failed"),
    };
  }
}

export type ImageGarbageReport = {
  filename: string;
  url: string;
  sizeBytes: number;
  sizeFormatted: string;
};

export function getUnusedImages(): ImageGarbageReport[] {
  ensureDevMode();
  if (!fs.existsSync(imagesDirectory)) {
    return [];
  }

  const allImageFiles = fs.readdirSync(imagesDirectory).filter((file) => {
    return /\.(png|jpe?g|webp|gif|svg)$/i.test(file);
  });

  const posts = getAllStudioPosts();
  const allPostTexts = posts
    .map((p) => `${p.content} ${p.cover || ""} ${p.description} ${p.slug}`)
    .join(" ");

  const unused: ImageGarbageReport[] = [];
  for (const filename of allImageFiles) {
    if (!allPostTexts.includes(filename)) {
      const fullPath = path.join(imagesDirectory, filename);
      const stat = fs.statSync(fullPath);
      const sizeBytes = stat.size;
      const sizeFormatted =
        sizeBytes > 1024 * 1024
          ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(sizeBytes / 1024)} KB`;

      unused.push({
        filename,
        url: `/images/posts/${filename}`,
        sizeBytes,
        sizeFormatted,
      });
    }
  }

  return unused;
}

export function deleteUnusedImages(filenames: string[]): {
  deleted: string[];
  failed: string[];
} {
  ensureDevMode();
  const deleted: string[] = [];
  const failed: string[] = [];

  for (const filename of filenames) {
    const cleanName = path.basename(filename);
    const fullPath = path.join(imagesDirectory, cleanName);
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        deleted.push(cleanName);
      }
    } catch {
      failed.push(cleanName);
    }
  }

  return { deleted, failed };
}

