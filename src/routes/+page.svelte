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
    content="백엔드 시스템, 비동기 워크플로, Go, Temporal, 개발자 도구를 직접 실험하며 기록합니다."
  />
  <link rel="canonical" href={siteConfig.url} />
</svelte:head>

<PageTitle />
<PostSearch posts={data.posts} />

