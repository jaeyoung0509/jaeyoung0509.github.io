<script lang="ts">
  import { onMount } from "svelte";
  import { replaceState } from "$app/navigation";
  import { ArrowUpRight, ArrowDown, MapPin } from "lucide-svelte";
  import MermaidHandler from "$components/MermaidHandler.svelte";
  import ProjectEntry from "$components/portfolio/ProjectEntry.svelte";
  import OpenSourceEntry from "$components/portfolio/OpenSourceEntry.svelte";
  import { portfolioContent } from "$lib/portfolio-content";
  import { workProjects } from "$lib/work";
  import { siteConfig } from "$lib/site";

  let lang = $state<"en" | "ko">("ko");
  let expandedWork = $state<Record<string, boolean>>({
    paymonths: false,
    moonberg: false,
    alembic_dump: false,
    zenith: false,
  });

  function setLanguage(newLang: "en" | "ko") {
    lang = newLang;
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        if (newLang === "ko") {
          url.searchParams.delete("lang");
        } else {
          url.searchParams.set("lang", newLang);
        }
        replaceState(url, {});
      } catch {
        // Ignore URL errors in restricted environments
      }
    }
  }

  function toggleWork(slug: string) {
    expandedWork[slug] = !expandedWork[slug];
  }

  function reveal(node: HTMLElement, delay: number = 0) {
    if (typeof window === "undefined") return {};
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      node.classList.add("is-visible");
      return {};
    }
    node.classList.add("reveal");
    node.style.setProperty(
      "--reveal-delay",
      `${Math.min(Math.max(delay, 0), 400)}ms`,
    );
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add("is-visible");
              io?.disconnect();
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      io.observe(node);
    } else {
      node.classList.add("is-visible");
    }
    return {
      destroy() {
        io?.disconnect();
      },
    };
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const paramLang = urlParams.get("lang");
      if (paramLang === "ko" || paramLang === "en") {
        lang = paramLang;
      } else {
        lang = "ko";
      }

      // Check deep link hash
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && hash in expandedWork) {
        expandedWork[hash] = true;
      }
    }
  });

  const c = $derived(portfolioContent[lang]);
  const projects = $derived(workProjects[lang]);
</script>

<svelte:head>
  <title>{c.meta.title}</title>
  <meta name="description" content={c.meta.description} />
  <meta property="og:title" content={c.meta.title} />
  <meta property="og:description" content={c.meta.description} />
  <meta property="og:image" content={c.meta.ogImage} />
</svelte:head>

<div class="portfolio-container">
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-top-meta">
      <div class="hero-meta-left">
        <span class="hero-loc">
          <MapPin size={13} /> {c.hero.location}
        </span>
        <span class="hero-role-tag">{c.hero.role}</span>
      </div>

      <!-- Language Switcher -->
      <div class="lang-toggle-box" aria-label="언어 선택 / Language switcher">
        <button
          type="button"
          class="lang-btn"
          class:active={lang === "ko"}
          onclick={() => setLanguage("ko")}
        >
          KO
        </button>
        <span class="lang-divider">/</span>
        <button
          type="button"
          class="lang-btn"
          class:active={lang === "en"}
          onclick={() => setLanguage("en")}
        >
          EN
        </button>
      </div>
    </div>

    <h1 class="hero-display-name">{c.hero.name}</h1>

    <p class="hero-main-lead">
      {@html c.hero.headline.replace(/\n/g, "<br />")}
    </p>

    <p class="hero-sub-lead">
      {c.hero.subheadline}
    </p>

    <div class="hero-action-area">
      <a href="#work" class="btn-hero-primary">
        {c.hero.ctaWork} <ArrowDown size={14} />
      </a>
      <div class="hero-links-cluster">
        <a
          href={siteConfig.author.github}
          target="_blank"
          rel="noreferrer"
          class="hero-text-link"
        >
          GitHub <ArrowUpRight size={13} />
        </a>
        <span class="hero-link-sep" aria-hidden="true">·</span>
        <a
          href={siteConfig.author.linkedin}
          target="_blank"
          rel="noreferrer"
          class="hero-text-link"
        >
          LinkedIn <ArrowUpRight size={13} />
        </a>
      </div>
    </div>

    <div class="hero-tech-strip">
      <span class="tech-strip-label">Core /</span>
      <div class="tech-items-group">
        {#each c.hero.techStack as tech, idx (tech)}
          <span class="tech-item">{tech}</span>
          {#if idx < c.hero.techStack.length - 1}
            <span class="tech-divider" aria-hidden="true">·</span>
          {/if}
        {/each}
      </div>
    </div>
  </section>

  <!-- Focus / Approach Section -->
  <section class="portfolio-section section-approach" id="about">
    <div class="section-title-row" use:reveal={0}>
      <span class="section-eyebrow">{c.about.eyebrow}</span>
      <h2 class="section-heading-statement">{c.about.title}</h2>
    </div>

    <div class="about-statement-layout">
      <p class="about-lead-statement" use:reveal={80}>
        {c.about.paragraphs[0]}
      </p>
      <ol class="about-point-list">
        {#each c.about.paragraphs.slice(1) as paragraph, idx (idx)}
          <li class="about-point" use:reveal={140 + idx * 90}>
            <span class="about-point-num" aria-hidden="true"
              >{String(idx + 1).padStart(2, "0")}</span
            >
            <p class="about-sub-statement">{paragraph}</p>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <!-- Selected Work Section -->
  <section class="portfolio-section section-work" id="work">
    <div class="section-title-row" use:reveal={0}>
      <h2 class="section-heading-large">{c.workSection.title}</h2>
      <p class="section-heading-sub">{c.workSection.subtitle}</p>
    </div>

    <div class="work-showcase">
      {#each projects as project, pIdx (project.slug)}
        <div class="work-reveal" use:reveal={Math.min(pIdx, 3) * 70}>
          <ProjectEntry
            {project}
            isExpanded={expandedWork[project.slug] ?? false}
            onToggle={toggleWork}
            {lang}
            expandCTA={c.workSection.expandCTA}
            collapseCTA={c.workSection.collapseCTA}
          />
        </div>
      {/each}
    </div>
  </section>

  <!-- Open Source -->
  <section class="portfolio-section section-oss" id="oss">
    <div class="section-title-row" use:reveal={0}>
      <h2 class="section-heading-large">{c.oss.title}</h2>
      <p class="section-heading-sub">{c.oss.subtitle}</p>
    </div>

    <div class="oss-list">
      {#each c.oss.contributions as item, oIdx (item.name)}
        <div class="oss-reveal" use:reveal={Math.min(oIdx, 2) * 70}>
          <OpenSourceEntry {item} />
        </div>
      {/each}
    </div>
  </section>

  <!-- Experience Summary -->
  <section class="portfolio-section section-experience" id="experience">
    <div class="section-title-row" use:reveal={0}>
      <h2 class="section-heading-large">{c.experience.title}</h2>
    </div>

    <div class="exp-list" use:reveal={60}>
      <article class="exp-entry-compact">
        <div class="exp-header-row">
          <div>
            <h3 class="exp-company-name">{c.experience.company}</h3>
            <p class="exp-role-title">{c.experience.role}</p>
          </div>
          <span class="exp-period-tag">{c.experience.period}</span>
        </div>
        <span class="exp-domain-tag">{c.experience.domain}</span>
        <p class="exp-summary-text">{c.experience.summary}</p>
      </article>
    </div>
  </section>
</div>

<MermaidHandler />
