<script lang="ts">
  import type { Snippet } from "svelte";
  let { children }: { children?: Snippet } = $props();
</script>

<header class="page-header container">
  <h1>{#if children}{@render children()}{:else}Blog{/if}</h1>
</header>
