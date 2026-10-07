export type PostMeta = {
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
  thumbnail?: string;
  thumbnailAlt?: string;
  coverAlt?: string;
  coverYoutubeId?: string;
  coverYoutubeTitle?: string;
  readingMinutes: number;
  coverPosition?: string;
};

export type PostContent = Omit<PostMeta, "readingMinutes"> & { content: string };
export type StudioPostData = PostContent;
export type PostSaveIntent = "save" | "publish";

export function sanitizeSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^\w\s가-힣-]/gu, "")
    .replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export function generatePostId(): string {
  return `p_${crypto.randomUUID()}`;
}

export function createDraft(): PostContent {
  return {
    slug: "", title: "", description: "", publishedAt: localDate(),
    tags: [], locale: "ko", featured: false, draft: true, content: "",
  };
}

export function localDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Seoul",
  }).format(new Date());
}

export function createDescription(content: string, title = ""): string {
  return content.replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, "").replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ").trim().slice(0, 140) || title;
}

export function calculateReadingMinutes(content: string): number {
  const korean = (content.match(/[가-힣]/g) ?? []).length;
  const words = (content.replace(/[가-힣]/g, " ").match(/\b[\w'-]+\b/g) ?? []).length;
  return Math.max(1, Math.ceil(korean / 450 + words / 220));
}

export function getWritingStats(content: string) {
  return {
    totalChars: content.length,
    charsNoSpaces: content.replace(/\s/g, "").length,
    readMins: calculateReadingMinutes(content),
  };
}

const mediaKeys = ["cover", "coverAlt", "thumbnail", "thumbnailAlt", "coverYoutubeId", "coverYoutubeTitle", "coverPosition"] as const;

export class PostValidationError extends Error {
  readonly status = 400;
}

function normalizeDate(value: unknown): string {
  const date = value instanceof Date && Number.isFinite(value.getTime())
    ? value.toISOString().slice(0, 10) : String(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
    throw new PostValidationError("올바른 발행일을 입력해주세요.");
  }
  return date;
}

export function normalizePost(data: Record<string, unknown>, slug: string, content: string): PostContent {
  const title = String(data.title ?? slug).trim();
  const publishedAt = normalizeDate(data.publishedAt ?? localDate());
  const post: PostContent = {
    id: data.id ? String(data.id) : `p_${slug}`,
    slug, title, content,
    description: String(data.description || createDescription(content, title)),
    publishedAt,
    updatedAt: data.updatedAt ? normalizeDate(data.updatedAt) : undefined,
    tags: Array.isArray(data.tags) ? [...new Set(data.tags.map(String).map(tag => tag.trim()).filter(Boolean))] : [],
    locale: data.locale === "en" ? "en" : "ko",
    featured: data.featured === true,
    draft: data.draft === true,
  };
  for (const key of mediaKeys) if (data[key]) post[key] = String(data[key]);
  return post;
}

export function postFrontmatter(post: PostContent): Record<string, unknown> {
  const { slug: _slug, content: _content, ...fields } = post;
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
}

export type PostHeading = {
  depth: 2 | 3;
  id: string;
  text: string;
};

export function formatDate(date: string, locale: "ko" | "en" = "ko") {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date(date));
}
