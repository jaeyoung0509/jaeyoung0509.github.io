<script lang="ts">
  import { dev } from "$app/environment";
  import { page } from "$app/state";
  import { siteConfig } from "$lib/site";

  const navigation = [
    { href: "/", label: "Writing" },
    { href: "/about/", label: "About" },
    ...(dev ? [{ href: "/studio", label: "Studio", isExternal: false }] : []),
    {
      href: siteConfig.author.github,
      label: "GitHub ↗",
      isExternal: true,
    },
  ];
  function isCurrent(href: string) {
    const pathname = page.url.pathname;
    return href === "/" ? pathname === "/" || pathname.startsWith("/blog/") : pathname.startsWith(href);
  }
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
          aria-current={!item.isExternal && isCurrent(item.href) ? "page" : undefined}
          target={item.isExternal ? "_blank" : undefined}
          rel={item.isExternal ? "noreferrer" : undefined}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </div>
</header>
