<script lang="ts">
  import ResponsiveImage from "./ResponsiveImage.svelte";
  import { ArrowUpRight } from "lucide-svelte";
  import type { PostMeta } from "$lib/post-shared";
  import { formatDate } from "$lib/post-shared";

  let { post, href, eager = false }: { post: PostMeta; href?: string; eager?: boolean } = $props();

  const coverImage = $derived(
    post.coverYoutubeId
      ? `https://i.ytimg.com/vi/${post.coverYoutubeId}/hqdefault.jpg`
      : post.cover ?? post.thumbnail ?? "/images/editorial-backend-desk.jpg",
  );
  const coverAlt = $derived(
    post.coverYoutubeId
      ? post.coverYoutubeTitle ?? post.title
      : post.cover
        ? post.coverAlt ?? post.title
        : post.thumbnailAlt ?? post.title,
  );
</script>

<article class="post-row">
  <a
    class="post-row-link"
    href={href ?? `/blog/${post.slug}/`}
    aria-label={`${post.title} 읽기`}
  >
    <div class="post-image">
      <ResponsiveImage
        src={coverImage}
        sizes="(max-width: 650px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 64px) / 2), 370px"
        alt={coverAlt}
        width="1200"
        height="750"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
    <div class="post-date">
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span>{post.readingMinutes}분</span>
    </div>
    <div class="post-copy">
      <div class="post-heading">
        <h2>{post.title}</h2>
        <ArrowUpRight size={18} strokeWidth={1.7} aria-hidden="true" />
      </div>
      <p>{post.description}</p>
      {#if post.tags.length > 0}
        <ul class="tag-list" aria-label="태그">
          {#each post.tags.slice(0, 4) as tag (tag)}
            <li class="tag">{tag}</li>
          {/each}
        </ul>
      {/if}
    </div>
  </a>
</article>
