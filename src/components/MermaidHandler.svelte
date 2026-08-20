<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    let disposed = false;
    let isRendering = false;

    async function renderMermaidDiagrams() {
      if (isRendering || disposed) return;
      const figures = document.querySelectorAll<HTMLElement>(
        "figure.mermaid-diagram[data-chart]:not([data-rendered='true'])",
      );
      if (figures.length === 0) return;

      isRendering = true;

      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            fontFamily:
              'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
            fontSize: "13.5px",
            primaryColor: "#ffffff",
            primaryTextColor: "#1f2421",
            primaryBorderColor: "#176b51",
            lineColor: "#4f5a54",
            secondaryColor: "#f0f4f2",
            secondaryBorderColor: "#87908a",
            secondaryTextColor: "#1f2421",
            tertiaryColor: "#f8faf9",
            tertiaryBorderColor: "#d1d8d4",
            tertiaryTextColor: "#5f6762",
            edgeLabelBackground: "#ffffff",
            nodeBorder: "#176b51",
            clusterBkg: "#f4f7f5",
            clusterBorder: "#cad3cd",
            titleColor: "#176b51",
            mainBkg: "#ffffff",
            nodeTextColor: "#1f2421",
          },
        });

        for (let i = 0; i < figures.length; i++) {
          if (disposed) break;
          const fig = figures[i];
          if (fig.getAttribute("data-rendered") === "true") continue;

          const chart = fig.getAttribute("data-chart");
          if (!chart) continue;

          fig.setAttribute("data-rendered", "true");

          try {
            const id = `mermaid-svg-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`;
            const { svg } = await mermaid.render(id, chart);
            if (!disposed && fig) {
              fig.innerHTML = `<div>${svg}</div>`;
            }
          } catch {
            if (!disposed && fig) {
              fig.innerHTML = `<pre class="mermaid-fallback"><code>${chart}</code></pre>`;
            }
          }
        }
      } catch {
        // dynamic import failed or canceled
      } finally {
        isRendering = false;
        const remaining = document.querySelectorAll<HTMLElement>(
          "figure.mermaid-diagram[data-chart]:not([data-rendered='true'])",
        );
        if (remaining.length > 0 && !disposed) {
          setTimeout(renderMermaidDiagrams, 50);
        }
      }
    }

    renderMermaidDiagrams();

    const observer = new MutationObserver(() => {
      const pending = document.querySelectorAll<HTMLElement>(
        "figure.mermaid-diagram[data-chart]:not([data-rendered='true'])",
      );
      if (pending.length > 0) {
        renderMermaidDiagrams();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      disposed = true;
      observer.disconnect();
    };
  });
</script>
