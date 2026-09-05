<script lang="ts">
  import { ChevronDown } from "lucide-svelte";
  import { slide } from "svelte/transition";
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

  function disclosureDuration() {
    if (typeof window === "undefined") return 0;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 250;
  }
</script>

<article id={project.slug} class="work-item" class:is-expanded={isExpanded}>
  <div class="work-num-col">
    <span class="work-large-num">{project.number}</span>
  </div>

  <div class="work-main-col">
    <div class="work-meta-top">
      <span class="work-domain-label">{project.domain}</span>
    </div>

    <h3 class="work-title">{project.title}</h3>
    <p class="work-premise">{project.premise}</p>

    <dl class="work-psr-group">
      <div class="work-psr-row">
        <dt class="work-psr-label">Problem</dt>
        <dd class="work-psr-content">{project.problem}</dd>
      </div>

      <div class="work-psr-row">
        <dt class="work-psr-label">Solution</dt>
        <dd class="work-psr-content">{project.solution}</dd>
      </div>

      <div class="work-psr-row">
        <dt class="work-psr-label">Result</dt>
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
      <div transition:slide={{ duration: disclosureDuration() }}>
        <ProjectDetail {project} {lang} />
      </div>
    {/if}
  </div>

  <div class="work-action-col">
    <button
      type="button"
      class="work-toggle-btn"
      class:is-active={isExpanded}
      onclick={() => onToggle(project.slug)}
      aria-expanded={isExpanded}
      aria-controls={`work-details-${project.slug}`}
      aria-label={isExpanded ? collapseCTA : expandCTA}
    >
      <span class="toggle-label">
        {isExpanded ? collapseCTA : expandCTA}
      </span>
      <ChevronDown size={13} class="toggle-icon" />
    </button>
  </div>
</article>
