<script lang="ts">
  import PortfolioHome from "$components/PortfolioHome.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<PortfolioHome posts={data.posts} />
