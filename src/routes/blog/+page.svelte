<script lang="ts">
  import PageTitle from "$components/PageTitle.svelte";
  import PostSearch from "$components/PostSearch.svelte";
  import { siteConfig } from "$lib/site";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Writing · Jaeyoung Lee</title>
  <meta
    name="description"
    content="결제·워크플로·Go·Temporal — 운영하며 부딪힌 것을 재현하고 기록합니다."
  />
  <link rel="canonical" href={`${siteConfig.url}/blog/`} />
</svelte:head>

<PageTitle />
<PostSearch posts={data.posts} />

