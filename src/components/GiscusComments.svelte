<script lang="ts">
  import { onMount } from "svelte";

  const repo =
    import.meta.env.PUBLIC_GISCUS_REPO ??
    import.meta.env.NEXT_PUBLIC_GISCUS_REPO ??
    import.meta.env.VITE_GISCUS_REPO;
  const repoId =
    import.meta.env.PUBLIC_GISCUS_REPO_ID ??
    import.meta.env.NEXT_PUBLIC_GISCUS_REPO_ID ??
    import.meta.env.VITE_GISCUS_REPO_ID;
  const category =
    import.meta.env.PUBLIC_GISCUS_CATEGORY ??
    import.meta.env.NEXT_PUBLIC_GISCUS_CATEGORY ??
    import.meta.env.VITE_GISCUS_CATEGORY;
  const categoryId =
    import.meta.env.PUBLIC_GISCUS_CATEGORY_ID ??
    import.meta.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ??
    import.meta.env.VITE_GISCUS_CATEGORY_ID;

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
