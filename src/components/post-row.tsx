import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/post-shared";

export function PostRow({ post }: { post: PostMeta }) {
  return (
    <article className="post-row">
      <Link
        className="post-image"
        href={`/blog/${post.slug}/`}
        aria-label={`${post.title} 읽기`}
      >
        <Image
          src={post.cover ?? "/images/editorial-backend-desk.jpg"}
          alt={post.coverAlt ?? ""}
          width={1800}
          height={1029}
        />
      </Link>
      <div className="post-date">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span>{post.readingMinutes}분</span>
      </div>
      <div className="post-copy">
        <Link href={`/blog/${post.slug}/`}>
          <h3>{post.title}</h3>
          <ArrowUpRight size={18} strokeWidth={1.7} />
        </Link>
        <p>{post.description}</p>
        <ul className="tag-list" aria-label="태그">
          {post.tags.map((tag) => (
            <li className="tag" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
