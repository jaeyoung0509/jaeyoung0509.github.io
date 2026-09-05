<script lang="ts">
  import { Check } from "lucide-svelte";
  import type { WorkProject } from "$lib/work";

  let { project, lang }: { project: WorkProject; lang: "ko" | "en" } = $props();
</script>

<div id={`work-details-${project.slug}`} class="work-deep-dive-panel">
  {#if project.chapters}
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
  {/if}

  {#if project.mermaidDiagram}
    <div class="cs-block">
      <h4 class="cs-heading">
        {lang === "ko" ? "아키텍처 및 작업 흐름" : "Architecture & Job Flow"}
      </h4>
      <figure class="mermaid-diagram" data-chart={project.mermaidDiagram}>
        <div class="mermaid-loading">
          {lang === "ko"
            ? "다이어그램 로딩 중..."
            : "Rendering architecture diagram..."}
        </div>
      </figure>
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
