"use client";

import mermaid from "mermaid";
import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
};

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

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;

    async function renderChart() {
      try {
        const { svg: renderedSvg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!disposed) setSvg(renderedSvg);
      } catch {
        if (!disposed) setFailed(true);
      }
    }

    void renderChart();
    return () => {
      disposed = true;
    };
  }, [chart, id]);

  if (failed) {
    return (
      <pre className="mermaid-fallback">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <figure className="mermaid-diagram" aria-label="워크플로 다이어그램">
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="mermaid-loading">다이어그램을 불러오는 중입니다.</div>
      )}
    </figure>
  );
}
