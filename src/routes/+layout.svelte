<script lang="ts">
  import "../app.css";
  import SiteHeader from "$components/SiteHeader.svelte";
  import SiteFooter from "$components/SiteFooter.svelte";
  import { siteConfig } from "$lib/site";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <title>{siteConfig.name}</title>
  <meta name="description" content={siteConfig.description} />
  <meta property="og:site_name" content={siteConfig.name} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:title" content={siteConfig.name} />
  <meta property="og:description" content={siteConfig.description} />
  <meta
    property="og:image"
    content={`${siteConfig.url}/images/editorial-backend-desk.jpg`}
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={siteConfig.name} />
  <meta name="twitter:description" content={siteConfig.description} />
  <meta
    name="twitter:image"
    content={`${siteConfig.url}/images/editorial-backend-desk.jpg`}
  />
</svelte:head>

<SiteHeader />
<main>
  {@render children()}
</main>
<SiteFooter />
