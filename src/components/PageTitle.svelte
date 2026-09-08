<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title = "Writing",
    subtitle = "",
    children,
  }: {
    title?: string;
    subtitle?: string;
    children?: Snippet;
  } = $props();
</script>

<header class="page-header container">
  <h1 class="page-title">{#if children}{@render children()}{:else}{title}{/if}</h1>
  {#if subtitle}
    <p class="page-subtitle">{subtitle}</p>
  {/if}
</header>
