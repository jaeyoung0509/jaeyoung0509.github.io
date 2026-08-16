<script lang="ts">
  import type { PostHeading } from "$lib/post-shared";

  let { headings }: { headings: PostHeading[] } = $props();

  let activeId = $state("");

  $effect(() => {
    if (!activeId && headings.length > 0) {
      activeId = headings[0].id;
    }
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
  <details open>
    <summary>이 글의 목차</summary>
    <nav aria-label="이 글의 목차">
      <ol>
        {#each headings as heading (heading.id)}
          <li class={`toc-depth-${heading.depth}`}>
            <a
              class={activeId === heading.id ? "is-active" : undefined}
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
