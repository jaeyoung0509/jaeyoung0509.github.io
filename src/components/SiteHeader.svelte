<script lang="ts">
  import { dev } from "$app/environment";

  const navigation = [
    { href: "/", label: "Writing" },
    { href: "/about/", label: "About" },
    ...(dev ? [{ href: "/studio", label: "Studio", isExternal: false }] : []),
    {
      href: "https://github.com/jaeyoung0509",
      label: "GitHub ↗",
      isExternal: true,
    },
  ];
</script>

<header class="site-header">
  <div class="header-inner">
    <a
      class="brand"
      href="/"
      aria-label="jaeyoung lee 홈으로 이동"
    >
      <span class="brand-text">jaeyoung lee</span>
    </a>

    <nav class="header-nav" aria-label="주요 메뉴">
      {#each navigation as item (item.href)}
        <a
          href={item.href}
          target={item.isExternal ? "_blank" : undefined}
          rel={item.isExternal ? "noreferrer" : undefined}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </div>
</header>
