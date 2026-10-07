<script lang="ts">
  import type { PostHeading } from "$lib/post-shared";
  import { onMount } from "svelte";
  import { ChevronDown } from "lucide-svelte";

  let { headings }: { headings: PostHeading[] } = $props();

  let activeId = $derived(headings[0]?.id ?? "");
  let isDesktop = $state(false);
  let isOpen = $state(false);

  onMount(() => {
    const media = window.matchMedia("(min-width: 1051px)");
    const sync = () => { isDesktop = media.matches; isOpen = media.matches; };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  });

  $effect(() => {
    if (typeof window === "undefined" || headings.length === 0) return;

    let frameId = 0;

    const updateActiveHeading = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const readingPosition = 150;
        const current = headings
          .map((heading) => ({
            id: heading.id,
            top: document.getElementById(heading.id)?.getBoundingClientRect().top,
          }))
          .filter(
            (heading): heading is { id: string; top: number } =>
              heading.top !== undefined,
          )
          .filter((heading) => heading.top <= readingPosition)
          .at(-1);

        activeId = current?.id ?? headings[0]?.id ?? "";
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  });
</script>

<aside class="article-toc">
  <details open={isOpen} ontoggle={(event) => { isOpen = event.currentTarget.open; }}>
    <summary onclick={(event) => { if (isDesktop) event.preventDefault(); }}>
      <span>이 글의 목차 <span class="toc-count">· {headings.length}개 항목</span></span>
      <ChevronDown size={16} aria-hidden="true" />
    </summary>
    <nav aria-label="이 글의 목차">
      <ol>
        {#each headings as heading (heading.id)}
          <li class={`toc-depth-${heading.depth}`}>
            <a
              class={activeId === heading.id ? "is-active" : undefined}
              aria-current={activeId === heading.id ? "location" : undefined}
              href={`#${heading.id}`}
            >
              {heading.text}
            </a>
          </li>
        {/each}
      </ol>
    </nav>
  </details>
</aside>
