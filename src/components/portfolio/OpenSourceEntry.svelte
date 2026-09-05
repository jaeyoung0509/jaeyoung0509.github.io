<script lang="ts">
  import { GitPullRequest } from "lucide-svelte";
  import type { OssContribution } from "$lib/portfolio-content";

  let { item }: { item: OssContribution } = $props();
</script>

<article class="oss-entry">
  <div class="oss-card-top">
    <h4 class="oss-card-name">{item.name}</h4>
    <p class="oss-card-meta">{item.meta}</p>
  </div>

  <p class="oss-card-desc">{item.desc}</p>

  {#if item.links}
    <div class="oss-pr-links">
      {#each item.links as link (link.href)}
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          class="oss-pr-link"
        >
          <GitPullRequest size={14} /> {link.label}
        </a>
      {/each}
    </div>
  {:else if item.linkText && item.linkUrl}
    <a
      href={item.linkUrl}
      target="_blank"
      rel="noreferrer"
      class="oss-pr-link"
    >
      <GitPullRequest size={14} /> {item.linkText}
    </a>
  {/if}
</article>
