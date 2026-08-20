<script lang="ts">
  import { onMount } from "svelte";

  const fullText = "jaeyoung lee";
  let displayedText = $state(fullText);
  let isClient = $state(false);

  const navigation = [
    { href: "/", label: "Writing" },
    { href: "/about/", label: "About" },
    {
      href: "https://github.com/jaeyoung0509",
      label: "GitHub ↗",
      isExternal: true,
    },
  ];

  let typingTimeout: ReturnType<typeof setTimeout> | null = null;

  function runTypingAnimation() {
    if (typingTimeout) clearTimeout(typingTimeout);
    displayedText = "";
    let index = 0;

    const typeNext = () => {
      if (index < fullText.length) {
        displayedText += fullText[index];
        index++;
        const nextChar = fullText[index - 1];
        const delay = 40 + Math.random() * 35 + (nextChar === " " ? 70 : 0);
        typingTimeout = setTimeout(typeNext, delay);
      }
    };

    typingTimeout = setTimeout(typeNext, 100);
  }

  onMount(() => {
    isClient = true;
    runTypingAnimation();
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  });
</script>

<header class="site-header">
  <div class="header-inner">
    <a
      class="brand"
      href="/"
      aria-label="jaeyoung lee 홈으로 이동"
    >
      <span class="brand-text-wrapper">
        <span class="brand-text-ghost" aria-hidden="true">{fullText}</span>
        <span class="brand-text-visible">
          {#if isClient}
            {displayedText}
          {:else}
            {fullText}
          {/if}
        </span>
      </span>
      <span class="brand-cursor" aria-hidden="true"></span>
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
