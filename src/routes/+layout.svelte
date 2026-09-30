<script lang="ts">
  import "../app.css";
  import SiteHeader from "$components/SiteHeader.svelte";
  import SiteFooter from "$components/SiteFooter.svelte";
  import { siteConfig } from "$lib/site";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  let isStudio = $derived(page.url.pathname.startsWith("/studio"));
</script>

<svelte:head>
  <meta
    name="google-site-verification"
    content="4_EJGx3CPu_ZI9q17mFqA8EwkRvsdTDulXGoGymjo3s"
  />
  <meta property="og:site_name" content={siteConfig.name} />
</svelte:head>

{#if isStudio}
  {@render children()}
{:else}
  <SiteHeader />
  <main>
    {@render children()}
  </main>
  <SiteFooter />
{/if}


