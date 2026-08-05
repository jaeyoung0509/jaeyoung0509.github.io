import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import type { PostHeading, PostMeta } from "./post-shared";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export type { PostMeta } from "./post-shared";

export type Post = PostMeta & {
  content: string;
  headings: PostHeading[];
};

function extractHeadings(content: string): PostHeading[] {
  const slugger = new GithubSlugger();

  return content
    .split("\n")
    .flatMap((line): PostHeading[] => {
      const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
      if (!match) return [];

      const text = match[2]
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[`*_~]/g, "")
        .replace(/<[^>]+>/g, "")
        .trim();

      return [
        {
          depth: match[1].length as 2 | 3,
          id: slugger.slug(text),
          text,
        },
      ];
    });
}

function calculateReadingMinutes(content: string) {
  const koreanCharacters = (content.match(/[가-힣]/g) ?? []).length;
  const latinWords = (
    content.replace(/[가-힣]/g, " ").match(/\b[\w'-]+\b/g) ?? []
  ).length;

  return Math.max(1, Math.ceil(koreanCharacters / 450 + latinWords / 220));
}

function toPost(slug: string): Post {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);

  if (!data.title || !data.description || !data.publishedAt) {
    throw new Error(`Required frontmatter is missing: ${filePath}`);
  }

  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    publishedAt: String(data.publishedAt),
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
    readingMinutes: calculateReadingMinutes(content),
    headings: extractHeadings(content),
    content,
  };
}

export function getAllPosts(locale: "ko" | "en" = "ko"): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => toPost(file.replace(/\.mdx$/, "")))
    .filter((post) => !post.draft && post.locale === locale)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).valueOf() -
        new Date(a.publishedAt).valueOf(),
    );
}

export function getPost(slug: string): Post | undefined {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const post = toPost(slug);
  return post.draft ? undefined : post;
}
