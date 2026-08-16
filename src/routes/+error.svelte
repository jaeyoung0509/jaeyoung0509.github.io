<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import { page } from "$app/state";
</script>

<section class="not-found container">
  <span>{page.status || 404}</span>
  <h1>페이지를 찾을 수 없습니다</h1>
  <p>요청하신 페이지가 이동되었거나 삭제되었을 수 있습니다.</p>
  <a href="/">
    <ArrowLeft size={16} /> 홈으로 돌아가기
  </a>
</section>
