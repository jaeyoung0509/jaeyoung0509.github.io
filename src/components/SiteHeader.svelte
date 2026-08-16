<script lang="ts">
  const navigation = [
    { href: "/blog/", label: "blogs" },
    { href: "/about/", label: "about" },
  ];
</script>

<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="/" aria-label="홈">
      jaeyoung lee
    </a>

    <nav class="header-nav" aria-label="주요 메뉴">
      {#each navigation as item (item.href)}
        <a href={item.href}>
          {item.label}
        </a>
      {/each}
    </nav>
  </div>
</header>
