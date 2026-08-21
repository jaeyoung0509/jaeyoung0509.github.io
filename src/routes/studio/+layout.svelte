<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <title>Studio — Content Manager</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="studio-root">
  {@render children()}
</div>

<style>
  :global(html),
  :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
    background: var(--page);
    color: var(--ink);
  }

  .studio-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
