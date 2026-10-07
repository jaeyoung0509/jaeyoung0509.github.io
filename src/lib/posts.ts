import fs from "node:fs";
import path from "node:path";
import type { PostHeading, PostMeta } from "./post-shared";
import { findPostFile, listPostFiles, readPostFile } from "./server/post-files";
import { calculateReadingMinutes } from "./post-shared";
import { compileMarkdown } from "./markdown";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export type { PostHeading, PostMeta } from "./post-shared";

export type Post = PostMeta & {
  content: string;
  headings: PostHeading[];
  html?: string;
};

export function getAllPosts(locale: "ko" | "en" = "ko"): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  return listPostFiles(postsDirectory)
    .filter(post => !post.draft && post.locale === locale)
    .map(({ content, ...meta }) => ({ ...meta, readingMinutes: calculateReadingMinutes(content) }));
}

export async function getPost(
  slug: string,
): Promise<(Post & { html: string }) | undefined> {
  const filePath = findPostFile(postsDirectory, slug);
  if (!filePath) return undefined;
  const content = readPostFile(filePath);
  if (content.draft) return undefined;
  const post = { ...content, readingMinutes: calculateReadingMinutes(content.content) };
  const { html, headings } = await compileMarkdown(post.content);

  return {
    ...post,
    headings,
    html,
  };
}
