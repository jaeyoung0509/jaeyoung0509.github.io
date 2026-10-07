<script lang="ts">
  import { onMount } from "svelte";

  import * as publicEnvironment from "$env/static/public";
  const config: Record<string, string> = publicEnvironment;
  const repo = config.PUBLIC_GISCUS_REPO;
  const repoId = config.PUBLIC_GISCUS_REPO_ID;
  const category = config.PUBLIC_GISCUS_CATEGORY;
  const categoryId = config.PUBLIC_GISCUS_CATEGORY_ID;

  const isConfigured = Boolean(repo && repoId && category && categoryId);

  let containerEl: HTMLElement | null = $state(null);

  onMount(() => {
    if (!isConfigured || !containerEl) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo!);
    script.setAttribute("data-repo-id", repoId!);
    script.setAttribute("data-category", category!);
    script.setAttribute("data-category-id", categoryId!);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    containerEl.appendChild(script);
  });
</script>

{#if isConfigured}
  <section class="comments" aria-labelledby="comments-title" bind:this={containerEl}>
    <h2 id="comments-title">댓글</h2>
  </section>
{/if}
