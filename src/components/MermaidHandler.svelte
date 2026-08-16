<script lang="ts">
  $effect(() => {
    if (typeof window === "undefined") return;

    let disposed = false;

    async function renderMermaidDiagrams() {
      const figures = document.querySelectorAll<HTMLElement>(
        "figure.mermaid-diagram[data-chart]",
      );
      if (figures.length === 0) return;

      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            primaryColor: "#f6f8f7",
            primaryTextColor: "#1f2421",
            primaryBorderColor: "#176b51",
            lineColor: "#5f6762",
            secondaryColor: "#ecefed",
            tertiaryColor: "#ffffff",
            fontFamily:
              'Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
          },
        });

        for (let i = 0; i < figures.length; i++) {
          if (disposed) break;
          const fig = figures[i];
          const chart = fig.getAttribute("data-chart");
          if (!chart) continue;

          try {
            const id = `mermaid-svg-${i}-${Math.random().toString(36).slice(2, 8)}`;
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
      }
    }

    renderMermaidDiagrams();

    return () => {
      disposed = true;
    };
  });
</script>
