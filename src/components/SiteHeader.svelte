<script lang="ts">
  import { onMount } from "svelte";

  const fullText = "jaeyoung lee";
  let displayedText = $state(fullText);
  let isClient = $state(false);

  const navigation = [
    { href: "/blog/", label: "blogs" },
    { href: "/about/", label: "about" },
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
        const delay = 45 + Math.random() * 45 + (nextChar === " " ? 90 : 0);
        typingTimeout = setTimeout(typeNext, delay);
      }
    };

    typingTimeout = setTimeout(typeNext, 120);
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
      onmouseenter={() => {
        if (displayedText.length === fullText.length) {
          runTypingAnimation();
        }
      }}
    >
      <span class="brand-text">
        {#if isClient}
          {displayedText}
        {:else}
          {fullText}
        {/if}
      </span>
      <span class="brand-cursor" aria-hidden="true"></span>
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
