<script lang="ts">
  import { ArrowUpRight } from "lucide-svelte";
  import type { PostMeta } from "$lib/post-shared";
  import { formatIndexDate } from "$lib/post-shared";

  let { post }: { post: PostMeta } = $props();
</script>

<article class="post-index-row">
  <a
    class="post-index-link"
    href={`/blog/${post.slug}/`}
    aria-label={`${post.title} 읽기`}
  >
    <p class="post-index-meta">
      <time dateTime={post.publishedAt}>{formatIndexDate(post.publishedAt)}</time>
      <span aria-hidden="true">·</span>
      <span>{post.readingMinutes}분 읽기</span>
    </p>
    <div class="post-index-heading">
      <h3>{post.title}</h3>
      <ArrowUpRight size={17} strokeWidth={1.7} aria-hidden="true" />
    </div>
    <p class="post-index-desc">{post.description}</p>
    {#if post.tags.length > 0}
      <ul class="tag-list" aria-label="태그">
        {#each post.tags.slice(0, 4) as tag (tag)}
          <li class="tag">{tag}</li>
        {/each}
      </ul>
    {/if}
  </a>
</article>
