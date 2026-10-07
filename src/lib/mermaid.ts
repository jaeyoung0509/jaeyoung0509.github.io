import type { Mermaid } from "mermaid";

let engine: Promise<Mermaid> | undefined;
let renderQueue = Promise.resolve();

function getEngine() {
  engine ??= import("mermaid").then(({ default: mermaid }) => {
    const style = getComputedStyle(document.documentElement);
    const color = (name: string) => style.getPropertyValue(name).trim();
    mermaid.initialize({
      startOnLoad: false, securityLevel: "strict", theme: "base",
      themeVariables: {
        fontFamily: style.getPropertyValue("--font-body").trim(), fontSize: "14px",
        primaryColor: color("--page"), primaryTextColor: color("--ink"),
        primaryBorderColor: color("--accent"), lineColor: color("--muted"),
        secondaryColor: color("--surface"), secondaryTextColor: color("--ink"),
        secondaryBorderColor: color("--line-strong"),
        tertiaryColor: color("--surface"), tertiaryTextColor: color("--muted"),
        edgeLabelBackground: color("--page"), clusterBkg: color("--surface"),
        clusterBorder: color("--line-strong"), titleColor: color("--accent"),
      },
    });
    return mermaid;
  }).catch(error => { engine = undefined; throw error; });
  return engine;
}

export function observeMermaid(root: HTMLElement) {
  let disposed = false;
  const pending = new WeakSet<HTMLElement>();
  const showFallback = (figure: HTMLElement, chart: string) => {
    const pre = document.createElement("pre");
    pre.className = "mermaid-fallback";
    const code = document.createElement("code");
    code.textContent = chart;
    pre.append(code);
    figure.replaceChildren(pre);
  };
  function render(figure: HTMLElement) {
    if (pending.has(figure) || figure.dataset.rendered) return;
    const chart = figure.dataset.chart;
    if (!chart) return;
    pending.add(figure);
    renderQueue = renderQueue.then(async () => {
      if (disposed || !figure.isConnected) return;
      try {
        const mermaid = await getEngine();
        const { svg } = await mermaid.render(`diagram-${crypto.randomUUID()}`, chart);
        if (!disposed && figure.isConnected) figure.innerHTML = svg;
      } catch {
        if (!disposed && figure.isConnected) showFallback(figure, chart);
      }
      if (!disposed) figure.dataset.rendered = "true";
    });
  }
  const intersection = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      intersection?.unobserve(entry.target);
      render(entry.target as HTMLElement);
    }
  }, { rootMargin: "300px" });
  const watched = new WeakSet<HTMLElement>();
  function scan() {
    for (const figure of root.querySelectorAll<HTMLElement>("figure.mermaid-diagram[data-chart]:not([data-rendered])")) {
      if (watched.has(figure)) continue;
      watched.add(figure);
      if (intersection) intersection.observe(figure);
      else render(figure);
    }
  }
  const mutations = new MutationObserver(scan);
  mutations.observe(root, { childList: true, subtree: true });
  scan();
  return () => { disposed = true; intersection?.disconnect(); mutations.disconnect(); };
}
