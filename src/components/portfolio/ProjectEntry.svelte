<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { ChevronDown } from "lucide-svelte";
  import type { WorkProject } from "$lib/work";
  import ProjectDetail from "./ProjectDetail.svelte";
  import ResponsiveImage from "$components/ResponsiveImage.svelte";

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

    <div class="project-summary">
      <p>{project.problem}</p>
      <p>{project.solution}</p>
    </div>

    <ul class="project-outcomes" aria-label={lang === "ko" ? "구현한 기능" : "Implemented features"}>
      {#each project.results as result (result.metric)}
        <li>
          <strong>{result.metric}</strong>
          {#if result.label}<span> — {result.label}</span>{/if}
        </li>
      {/each}
    </ul>

    {#if project.slug === "zenith"}
      <figure class="project-screen">
        <ResponsiveImage src="/images/zenith-dashboard.png"
          alt={lang === "ko" ? "Zenith에서 개발 산출물과 캐시의 용량을 확인하는 스토리지 화면" : "Zenith storage dashboard showing developer build artifacts and caches"}
          sizes="(max-width: 760px) calc(100vw - 28px), 720px"
          loading="lazy" decoding="async" width="2144" height="1544" />
        <figcaption>{lang === "ko" ? "직접 쓰면서 고치고 있는 Zenith의 스토리지 화면." : "The Zenith storage screen I use and keep improving."}</figcaption>
      </figure>
    {/if}

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
