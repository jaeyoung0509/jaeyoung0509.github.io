<script lang="ts">
  import { Rss } from "lucide-svelte";
  const currentYear = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="footer-inner">
    <small>© {currentYear} Jaeyoung Lee</small>
    <div class="footer-links">
      <a href="/feed.xml">
        <Rss size={16} /> RSS
      </a>
    </div>
  </div>
</footer>
