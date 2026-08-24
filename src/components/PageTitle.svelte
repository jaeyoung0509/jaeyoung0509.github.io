<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title = "Writing",
    subtitle = "개발하면서 궁금했던 것들을 직접 확인하고 기록합니다.",
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
