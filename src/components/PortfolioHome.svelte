<script lang="ts">
  import { onMount, tick } from "svelte";
  import { replaceState } from "$app/navigation";
  import { ArrowUpRight, ArrowDown, MapPin } from "lucide-svelte";
  import MermaidHandler from "$components/MermaidHandler.svelte";
  import ProjectEntry from "$components/portfolio/ProjectEntry.svelte";
  import OpenSourceEntry from "$components/portfolio/OpenSourceEntry.svelte";
  import { portfolioContent } from "$lib/portfolio-content";
  import { workProjects } from "$lib/work";
  import { siteConfig } from "$lib/site";
  import Seo from "$components/Seo.svelte";

  let activeSection = $state("about");
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
        tick().then(() => document.getElementById(hash)?.scrollIntoView({ behavior: "instant", block: "start" }));
      }
    }
    const sections = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeSection = entry.target.id;
      }
    }, { rootMargin: "-10% 0px -60% 0px" });
    document.querySelectorAll(".portfolio-section[id]").forEach(section => sections.observe(section));
    return () => sections.disconnect();
  });

  const c = $derived(portfolioContent[lang]);
  const projects = $derived(workProjects[lang]);
</script>

<Seo
  title={c.meta.title}
  description={c.meta.description}
  image={c.meta.ogImage}
  path="/about/"
  locale={lang === "ko" ? "ko_KR" : "en_US"}
/>

<div class="portfolio-container" lang={lang}>
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
          aria-pressed={lang === "ko"}
          onclick={() => setLanguage("ko")}
        >
          KO
        </button>
        <span class="lang-divider">/</span>
        <button
          type="button"
          class="lang-btn"
          class:active={lang === "en"}
          aria-pressed={lang === "en"}
          onclick={() => setLanguage("en")}
        >
          EN
        </button>
      </div>
    </div>

    <div class="hero-intro-grid">
      <div class="hero-identity">
        <h1 class="hero-display-name">{c.hero.name}</h1>

        <p class="hero-main-lead">
          {@html c.hero.headline.replace(/\n/g, "<br />")}
        </p>
      </div>
      <div class="hero-note">
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
      </div>
    </div>

    <div class="hero-tech-strip">
      <span class="tech-strip-label">{lang === "ko" ? "주로 쓰는 도구" : "Usually working with"}</span>
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

  <nav class="portfolio-nav" aria-label={lang === "ko" ? "소개 페이지 목차" : "About page sections"}>
    {#each [
      { id: "about", label: lang === "ko" ? "소개" : "Intro" },
      { id: "work", label: lang === "ko" ? "프로젝트" : "Projects" },
      { id: "oss", label: lang === "ko" ? "오픈소스" : "Open source" },
      { id: "experience", label: lang === "ko" ? "경력" : "Experience" },
    ] as section (section.id)}
      <a href={`#${section.id}`} class:is-current={activeSection === section.id}
        aria-current={activeSection === section.id ? "location" : undefined}>{section.label}</a>
    {/each}
  </nav>

  <!-- Focus / Approach Section -->
  <section class="portfolio-section section-approach" id="about">
    <div class="section-title-row">
      <h2 class="section-heading-large">{c.about.title}</h2>
    </div>

    <div class="about-statement-layout">
      {#each c.about.paragraphs as paragraph (paragraph)}
        <p class="about-sub-statement">{paragraph}</p>
      {/each}
    </div>
  </section>

  <!-- Selected Work Section -->
  <section class="portfolio-section section-work" id="work">
    <div class="section-title-row">
      <h2 class="section-heading-large">{c.workSection.title}</h2>
      <p class="section-heading-sub">{c.workSection.subtitle}</p>
    </div>

    <div class="work-showcase">
      {#each projects as project (project.slug)}
        <div class="work-reveal">
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
    <div class="section-title-row">
      <h2 class="section-heading-large">{c.oss.title}</h2>
      <p class="section-heading-sub">{c.oss.subtitle}</p>
    </div>

    <div class="oss-list">
      {#each c.oss.contributions as item (item.name)}
        <div class="oss-reveal">
          <OpenSourceEntry {item} />
        </div>
      {/each}
    </div>
  </section>

  <!-- Experience Summary -->
  <section class="portfolio-section section-experience" id="experience">
    <div class="section-title-row">
      <h2 class="section-heading-large">{c.experience.title}</h2>
    </div>

    <div class="exp-list">
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
