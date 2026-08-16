import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/post-shared";

export function PostRow({
  post,
  eager = false,
}: {
  post: PostMeta;
  eager?: boolean;
}) {
  const coverImage = post.coverYoutubeId
    ? `https://i.ytimg.com/vi/${post.coverYoutubeId}/hqdefault.jpg`
    : (post.cover ?? "/images/editorial-backend-desk.jpg");

  return (
    <article className="post-row">
      <Link
        className="post-row-link"
        href={`/blog/${post.slug}/`}
        aria-label={`${post.title} 읽기`}
      >
        <div className="post-image">
          <Image
            src={coverImage}
            alt={post.coverYoutubeTitle ?? post.coverAlt ?? post.title}
            width={1800}
            height={1029}
            loading={eager ? "eager" : "lazy"}
          />
        </div>
        <div className="post-date">
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span>{post.readingMinutes}분</span>
        </div>
        <div className="post-copy">
          <div className="post-heading">
            <h3>{post.title}</h3>
            <ArrowUpRight size={18} strokeWidth={1.7} aria-hidden="true" />
          </div>
          <p>{post.description}</p>
          <ul className="tag-list" aria-label="태그">
            {post.tags.map((tag) => (
              <li className="tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}
