<script lang="ts">
  import PageTitle from "$components/PageTitle.svelte";
  import PostSearch from "$components/PostSearch.svelte";
  import { siteConfig } from "$lib/site";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>글 | {siteConfig.name}</title>
  <meta
    name="description"
    content="백엔드 시스템, 이벤트 기반 설계, 운영 가시성과 개발 생산성에 관한 글입니다."
  />
  <link rel="canonical" href={`${siteConfig.url}/blog/`} />
</svelte:head>

<PageTitle />
<PostSearch posts={data.posts} />
