<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";
  import type { PostMeta } from "$lib/post-shared";
  import { formatDate } from "$lib/post-shared";

  let { post, eager = false }: { post: PostMeta; eager?: boolean } = $props();

  const coverImage = $derived(
    post.coverYoutubeId
      ? `https://i.ytimg.com/vi/${post.coverYoutubeId}/hqdefault.jpg`
      : post.cover ?? "/images/editorial-backend-desk.jpg",
  );
</script>

<article class="post-row">
  <a
    class="post-row-link"
    href={`/blog/${post.slug}/`}
    aria-label={`${post.title} 읽기`}
  >
    <div class="post-image">
      <img
        src={coverImage}
        alt={post.coverYoutubeTitle ?? post.coverAlt ?? post.title}
        width="1800"
        height="1029"
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
        <h3>{post.title}</h3>
        <ArrowUpRight size={18} strokeWidth={1.7} aria-hidden="true" />
      </div>
      <p>{post.description}</p>
      <ul class="tag-list" aria-label="태그">
        {#each post.tags.slice(0, 3) as tag (tag)}
          <li class="tag">{tag}</li>
        {/each}
      </ul>
    </div>
  </a>
</article>


