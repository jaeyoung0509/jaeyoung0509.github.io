<script lang="ts">
  import PageTitle from "$components/PageTitle.svelte";
  import PostSearch from "$components/PostSearch.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<PageTitle />
<PostSearch posts={data.posts} />
