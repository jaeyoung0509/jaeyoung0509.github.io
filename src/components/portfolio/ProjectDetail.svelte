<script lang="ts">
  import { Check } from "lucide-svelte";
  import type { WorkProject } from "$lib/work";

  let { project, lang }: { project: WorkProject; lang: "ko" | "en" } = $props();
</script>

<div id={`work-details-${project.slug}`} class="work-deep-dive-panel" class:has-diagram={!!project.mermaidDiagram}>
  {#if project.chapters}
    <div class="case-study-notes">
      {#each project.chapters as chapter (chapter.heading)}
        <div class="cs-block">
          <h4 class="cs-heading">{chapter.heading}</h4>
          <p class="cs-prose">{chapter.prose}</p>
          {#if chapter.bullets && chapter.bullets.length > 0}
            <ul class="cs-bullet-list">
              {#each chapter.bullets as bullet (bullet)}
                <li>
                  <Check size={14} class="check-accent" />
                  <span>{bullet}</span>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  {#if project.mermaidDiagram}
    <div class="cs-block case-study-diagram">
      <h4 class="cs-heading">
        {lang === "ko" ? "요청이 처리되는 순서" : "How a request runs"}
      </h4>
      <p class="diagram-hint">
        {lang === "ko" ? "한 대의 단말기에서 worker가 큐의 작업을 하나씩 처리합니다." : "One terminal worker processes queued jobs in sequence."}
      </p>
      <p class="diagram-scroll-hint">{lang === "ko" ? "좌우로 스크롤해 전체 그림 보기" : "Scroll sideways to see the whole diagram"}</p>
      {#key project.mermaidDiagram}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users can scroll the diagram with arrow keys.) -->
        <figure class="mermaid-diagram" data-chart={project.mermaidDiagram}
          tabindex="0" aria-label={`${project.title} — ${lang === "ko" ? "아키텍처 및 작업 흐름" : "Architecture & Job Flow"}`}>
          <div class="mermaid-loading" role="status">
            {lang === "ko" ? "다이어그램 로딩 중…" : "Rendering architecture diagram…"}
          </div>
        </figure>
      {/key}
    </div>
  {/if}

  {#if project.failureModes && project.failureModes.length > 0}
    <div class="cs-failure-group">
      {#each project.failureModes as item (item.scenario)}
        <div class="cs-failure-item">
          <p class="cs-fail-q">{item.scenario}</p>
          <p class="cs-fail-a">{item.solution}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>
