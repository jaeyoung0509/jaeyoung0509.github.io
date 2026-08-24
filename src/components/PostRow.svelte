<script lang="ts">
  import type { PostMeta } from "$lib/post-shared";

  let { post }: { post: PostMeta; eager?: boolean } = $props();

  const formattedDate = $derived(
    post.publishedAt.slice(0, 10).replace(/-/g, "."),
  );
</script>

<article class="post-row">
  <div class="post-row-date">
    <time dateTime={post.publishedAt}>{formattedDate}</time>
  </div>
  <div class="post-row-body">
    <h3 class="post-row-title">
      <a href={`/blog/${post.slug}/`}>
        {post.title}
      </a>
    </h3>
    <p class="post-row-desc">{post.description}</p>
    <div class="post-row-tags" aria-label="태그">
      {#each post.tags.slice(0, 3) as tag, idx (tag)}
        <span class="post-tag">{tag}</span>
        {#if idx < Math.min(post.tags.length, 3) - 1}
          <span class="tag-divider" aria-hidden="true">·</span>
        {/if}
      {/each}
    </div>
  </div>
</article>

