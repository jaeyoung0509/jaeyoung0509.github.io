<script lang="ts">
  import { siteConfig } from "$lib/site";

  let {
    title,
    description,
    path = "/",
    image = "/images/editorial-backend-desk.jpg",
    type = "website",
    locale = "ko_KR",
  }: {
    title: string;
    description: string;
    path?: string;
    image?: string;
    type?: "website" | "article";
    locale?: "ko_KR" | "en_US";
  } = $props();

  const canonical = $derived(new URL(path, siteConfig.url).href);
  const imageUrl = $derived(new URL(image, siteConfig.url).href);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content={type} />
  <meta property="og:locale" content={locale} />
  <meta property="og:url" content={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={imageUrl} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={imageUrl} />
</svelte:head>
