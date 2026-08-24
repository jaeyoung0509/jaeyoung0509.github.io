<script lang="ts">
  import type { PostMeta } from "$lib/post-shared";
  import PostRow from "./PostRow.svelte";

  let { posts }: { posts: PostMeta[] } = $props();
</script>

{#if posts.length === 0}
  <section class="post-list container" aria-live="polite">
    <p class="empty-state">새 글을 준비하고 있습니다.</p>
  </section>
{:else}
  <section class="post-list container" aria-label="글 목록">
    {#each posts as post, index (post.slug)}
      <PostRow {post} eager={index < 3} />
    {/each}
  </section>
{/if}

