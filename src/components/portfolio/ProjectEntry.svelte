<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { ChevronDown } from "lucide-svelte";
  import type { WorkProject } from "$lib/work";
  import ProjectDetail from "./ProjectDetail.svelte";

  let {
    project,
    isExpanded,
    onToggle,
    lang,
    expandCTA,
    collapseCTA,
  }: {
    project: WorkProject;
    isExpanded: boolean;
    onToggle: (slug: string) => void;
    lang: "ko" | "en";
    expandCTA: string;
    collapseCTA: string;
  } = $props();

  let reducedMotion = $state(true);
  onMount(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { reducedMotion = preference.matches; };
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  });
</script>

<article id={project.slug} class="work-item" class:is-expanded={isExpanded}>
  <div class="work-num-col">
    <span class="work-large-num">{project.number}</span>
  </div>

  <div class="work-main-col">
    <div class="work-meta-top">
      <span class="work-domain-label">{project.domain}</span>
    </div>

    <div class="work-heading-row">
      <h3 class="work-title">{project.title}</h3>
      <div class="work-action-col">
        <button
          type="button"
          class="work-toggle-btn"
          class:is-active={isExpanded}
          onclick={() => onToggle(project.slug)}
          aria-expanded={isExpanded}
          aria-controls={`work-details-${project.slug}`}
          aria-label={`${project.title}: ${isExpanded ? collapseCTA : expandCTA}`}
        >
          <span class="toggle-label">
            {(isExpanded ? collapseCTA : expandCTA).replace(/[↓↑]\s*$/, "").trim()}
          </span>
          <ChevronDown size={13} class="toggle-icon" />
        </button>
      </div>
    </div>
    <p class="work-premise">{project.premise}</p>

    <dl class="work-psr-group">
      <div class="work-psr-row">
        <dt class="work-psr-label">{lang === "ko" ? "배경" : "Problem"}</dt>
        <dd class="work-psr-content">{project.problem}</dd>
      </div>

      <div class="work-psr-row">
        <dt class="work-psr-label">{lang === "ko" ? "작업" : "Solution"}</dt>
        <dd class="work-psr-content">{project.solution}</dd>
      </div>

      <div class="work-psr-row">
        <dt class="work-psr-label">{lang === "ko" ? "변경 내용" : "Result"}</dt>
        <dd class="work-psr-content">
          <ul class="result-metric-list">
            {#each project.results as result (result.metric)}
              <li class="result-metric-row">
                <span class="result-metric-value">
                  {#if result.metric.includes("→")}
                    {@const parts = result.metric.split("→")}
                    {parts[0].trim()}
                    <span class="metric-arrow" aria-hidden="true">→</span>
                    {parts.slice(1).join("→").trim()}
                  {:else}
                    {result.metric}
                  {/if}
                </span>
                {#if result.label}
                  <span class="result-metric-label">{result.label}</span>
                {/if}
              </li>
            {/each}
          </ul>
        </dd>
      </div>
    </dl>

    <p class="work-stack-line" aria-label="Technology stack">
      {#each project.stack as tech, idx (tech)}
        <span>{tech}</span>
        {#if idx < project.stack.length - 1}
          <span aria-hidden="true">/</span>
        {/if}
      {/each}
    </p>

    {#if isExpanded}
      <div in:fly={{ y: reducedMotion ? 0 : 10, duration: reducedMotion ? 0 : 240 }}>
        <ProjectDetail {project} {lang} />
      </div>
    {/if}
  </div>

</article>
