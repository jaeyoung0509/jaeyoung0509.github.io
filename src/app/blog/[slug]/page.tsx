import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
} from "lucide-react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CodeCopyEnhancer } from "@/components/code-copy-enhancer";
import { GiscusComments } from "@/components/giscus-comments";
import { getAllPosts, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/post-shared";
import { siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getAllPosts();

  // Static export requires at least one parameter for a dynamic route.
  return posts.length > 0
    ? posts.map((post) => ({ slug: post.slug }))
    : [{ slug: "__empty__" }];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const image = post.cover ?? "/images/editorial-backend-desk.jpg";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}/`,
    },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url: `/blog/${post.slug}/`,
      title: post.title,
      description: post.description,
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : undefined,
      tags: post.tags,
      images: [
        {
          url: image,
          width: 1800,
          height: 1029,
          alt: post.coverAlt ?? post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [
            rehypePrettyCode,
            {
              theme: "github-dark-dimmed",
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });

  const image = post.cover ?? "/images/editorial-backend-desk.jpg";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(
      post.updatedAt ?? post.publishedAt,
    ).toISOString(),
    inLanguage: "ko-KR",
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.github,
    },
    image: new URL(image, siteConfig.url).toString(),
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}/`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="article-header">
          <div className="article-header-inner">
            <Link className="back-link" href="/blog/">
              <ArrowLeft size={15} /> 전체 글
            </Link>
            <h1>{post.title}</h1>
            <p className="description">{post.description}</p>
            <div className="article-meta">
              <span>
                <CalendarDays size={15} />
                {formatDate(post.publishedAt)}
              </span>
              <span>
                <Clock3 size={15} />
                {post.readingMinutes}분 읽기
              </span>
              {post.updatedAt && (
                <span>수정 {formatDate(post.updatedAt)}</span>
              )}
            </div>
            <ul className="tag-list">
              {post.tags.map((tag) => (
                <li className="tag" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {post.cover && (
          <figure className="article-cover">
            <Image
              src={post.cover}
              alt={post.coverAlt ?? ""}
              width={1800}
              height={1029}
              priority
            />
            {post.coverAlt && <figcaption>{post.coverAlt}</figcaption>}
          </figure>
        )}

        <div className="article-grid">
          {post.headings.length > 0 && (
            <aside className="article-toc">
              <details open>
                <summary>이 글의 목차</summary>
                <nav aria-label="이 글의 목차">
                  <ol>
                    {post.headings.map((heading) => (
                      <li
                        className={`toc-depth-${heading.depth}`}
                        key={heading.id}
                      >
                        <a href={`#${heading.id}`}>{heading.text}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </details>
            </aside>
          )}
          <div className="prose">{content}</div>
        </div>
      </article>
      <CodeCopyEnhancer />
      <GiscusComments />
    </>
  );
}
