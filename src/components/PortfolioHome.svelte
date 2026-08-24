<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import {
    ArrowUpRight,
    ArrowDown,
    MapPin,
    GitPullRequest,
    ChevronDown,
    Check,
  } from "lucide-svelte";
  import MermaidHandler from "$components/MermaidHandler.svelte";
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
        window.history.replaceState({}, "", url.toString());
      } catch {
        // Ignore URL errors in restricted environments
      }
    }
  }

  function disclosureDuration() {
    if (typeof window === "undefined") return 0;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 250;
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
      }
    }
  });

  const content = $derived({
    en: {
      meta: {
        title: "Jaeyoung Lee — Backend Software Engineer",
        description:
          "Portfolio of Jaeyoung Lee, a backend software engineer with 3.5+ years building and operating payment, credit, contract, and settlement systems.",
      },
      hero: {
        role: "Software Engineer",
        location: "Seoul, South Korea",
        name: "Jaeyoung Lee",
        headline: "I focus on backend systems with\ncomplex state and failure recovery.",
        subheadline:
          "Built and operated payment, credit evaluation, digital contracting, and merchant settlement backends for over 3.5 years. Outside work, I build small developer tools for repetitive friction and trace libraries and open source code to their implementation.",
        ctaWork: "Selected Work",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "Approach",
        title: "How I Work",
        p1: "In production, handling failures after the happy path has consistently been the most challenging and critical problem.",
        p2: "Whether duplicate inbound payment events, long-running data extraction jobs, or repetitive manual migration steps, I trace actual implementations when documentation is ambiguous and turn recurring recovery procedures into code and tools.",
      },
      work: {
        title: "Selected Work",
        subtitle:
          "Production systems I operated and developer tools I built.",
        expandCTA: "View details ↓",
        collapseCTA: "Close ↑",
        confidentialityNote:
          "*Implementation details and architecture topology are intentionally abstracted to protect proprietary company information.",
      },
      oss: {
        title: "Open Source",
        subtitle:
          "Issues identified through hands-on usage and upstream contributions.",
        contributions: [
          {
            name: "Temporal Python SDK",
            meta: "OpenAI Agents integration · PR #1741 · Merged",
            desc: "While exploring the Temporal OpenAI Agents integration, traced execution differences between FunctionTools and Activity-backed tools in SDK source, contributing clearer documentation and diagram explanations upstream (PR #1741, merged).",
            linkText: "PR #1741 ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
          },
          {
            name: "Google Genkit",
            meta: "Ollama Cloud Provider · PR #3813",
            desc: "Reported Go Ollama documentation API mismatches in Issue #3748. Implemented the Ollama Cloud OpenAI-compatible provider with model capability mappings, documentation, and tests (PR #3813).",
            links: [
              {
                label: "Issue #3748 ↗",
                href: "https://github.com/genkit-ai/genkit/issues/3748",
              },
              {
                label: "PR #3813 ↗",
                href: "https://github.com/genkit-ai/genkit/pull/3813",
              },
            ],
          },
          {
            name: "AWS Chalice",
            meta: "Lambda versioning / alias · Issue #2147 · PR #2173 Review",
            desc: "Discussed framework support for Python Lambda SnapStart in Issue #2147. Later reviewed PR #2173 (Lambda version/alias support), proposing pre-flight validation UX for alias constraints.",
            links: [
              {
                label: "Issue #2147 ↗",
                href: "https://github.com/aws/chalice/issues/2147",
              },
              {
                label: "PR #2173 Review ↗",
                href: "https://github.com/aws/chalice/pull/2173",
              },
            ],
          },
        ],
      },
      experience: {
        title: "Experience",
        company: "FinovusLab",
        role: "Software Engineer",
        period: "2022.04 – 2025.11",
        domain: "B2B BNPL · Payment / Credit / Contract / Settlement",
        summary:
          "Built and operated core payment, credit evaluation, digital contracting, and merchant settlement backends for a B2B BNPL platform. Handled post-payment async workflows, external partner integrations, duplicate event deduplication, and failure tracing.",
      },
    },
    ko: {
      meta: {
        title: "이재영 · Backend Software Engineer",
        description:
          "결제, 신용평가, 전자계약, 정산 백엔드와 비동기 금융 워크플로를 개발하고 운영해 온 소프트웨어 엔지니어 이재영의 포트폴리오.",
      },
      hero: {
        role: "소프트웨어 엔지니어",
        location: "대한민국 서울",
        name: "이재영",
        headline: "상태가 복잡하고 실패할 수 있는\n백엔드 시스템을 주로 다뤄왔습니다.",
        subheadline:
          "결제, 신용평가, 전자계약, 정산 백엔드를 3.5년 이상 개발하고 운영했습니다. 업무에서 반복되는 문제는 작은 도구로 만들어보고, 동작이 궁금한 부분은 라이브러리와 오픈소스 구현까지 확인하는 편입니다.",
        ctaWork: "주요 작업 보기",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "작업 방식",
        title: "어떻게 일하는가",
        p1: "업무에서는 정상적으로 동작하는 경우보다 실패한 뒤의 처리가 더 어려운 문제를 자주 만났습니다.",
        p2: "중복으로 들어오는 결제 이벤트, 오래 실행되는 데이터 수집 작업, 사람이 반복해서 확인하던 migration 작업 등이 그랬습니다. 문서만으로 동작이 명확하지 않을 때는 실제 구현을 확인하고, 반복되는 해결 과정은 코드나 도구로 옮겨 왔습니다.",
      },
      work: {
        title: "주요 작업",
        subtitle:
          "실무에서 경험한 시스템과 직접 만든 프로젝트를 정리했습니다.",
        expandCTA: "자세히 보기 ↓",
        collapseCTA: "닫기 ↑",
        confidentialityNote:
          "*회사 내부 구현과 운영 정보를 보호하기 위해 architecture와 세부 수치는 추상화했습니다.",
      },
      oss: {
        title: "오픈소스",
        subtitle:
          "사용하면서 발견한 문제를 정리하거나 직접 구현한 작업들입니다.",
        contributions: [
          {
            name: "Temporal Python SDK",
            meta: "OpenAI Agents integration · PR #1741 · Merged",
            desc: "Temporal OpenAI Agents integration을 사용하면서 FunctionTool과 Activity 기반 tool의 실행 위치가 다르다는 점을 SDK 구현에서 확인했습니다. 외부 I/O가 필요한 tool을 Activity로 분리하는 기준을 문서와 diagram에서 더 명확하게 설명하는 PR을 기여했습니다.",
            linkText: "PR #1741 ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
          },
          {
            name: "Google Genkit",
            meta: "Ollama Cloud Provider · PR #3813",
            desc: "Go Ollama 문서 예제의 API 불일치를 Issue #3748로 제보했습니다. 이후 Ollama Cloud의 OpenAI 호환 API를 연결하는 provider를 구현하고, model capability mapping과 문서 및 테스트를 함께 추가했습니다.",
            links: [
              {
                label: "Issue #3748 ↗",
                href: "https://github.com/genkit-ai/genkit/issues/3748",
              },
              {
                label: "PR #3813 ↗",
                href: "https://github.com/genkit-ai/genkit/pull/3813",
              },
            ],
          },
          {
            name: "AWS Chalice",
            meta: "Lambda versioning / alias · Issue #2147 · PR #2173 Review",
            desc: "Chalice에서 Python Lambda SnapStart를 사용할 때 필요한 framework 지원 여부를 Issue #2147에서 논의했습니다. 이후 Lambda version과 alias 지원을 추가하는 PR #2173을 검토하면서 alias 값을 배포 전에 검증하는 방법을 제안했습니다.",
            links: [
              {
                label: "Issue #2147 ↗",
                href: "https://github.com/aws/chalice/issues/2147",
              },
              {
                label: "PR #2173 Review ↗",
                href: "https://github.com/aws/chalice/pull/2173",
              },
            ],
          },
        ],
      },
      experience: {
        title: "경력",
        company: "FinovusLab",
        role: "Software Engineer",
        period: "2022.04 – 2025.11",
        domain: "B2B BNPL · Payment / Credit / Contract / Settlement",
        summary:
          "B2B BNPL 플랫폼에서 결제, 신용평가, 전자계약, 정산 백엔드를 개발하고 운영했습니다. 결제 이후 비동기 처리, 외부 금융 서비스 연동, 중복 이벤트 처리와 장애 추적 등을 경험했습니다.",
      },
    },
  });

  const c = $derived(content[lang]);
</script>

<svelte:head>
  <title>{c.meta.title}</title>
  <meta name="description" content={c.meta.description} />
  <meta property="og:title" content={c.meta.title} />
  <meta property="og:description" content={c.meta.description} />
  <meta
    property="og:image"
    content={`${siteConfig.url}/images/editorial-backend-desk.jpg`}
  />
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

  <!-- Approach Section -->
  <section class="portfolio-section section-approach" id="about">
    <div class="section-title-row">
      <span class="section-eyebrow">{c.about.eyebrow}</span>
      <h2 class="section-heading-statement">{c.about.title}</h2>
    </div>

    <div class="about-statement-layout">
      <p class="about-lead-statement">{c.about.p1}</p>
      <p class="about-sub-statement">{c.about.p2}</p>
    </div>
  </section>

  <!-- Selected Work Section -->
  <section class="portfolio-section section-work" id="work">
    <div class="section-title-row">
      <h2 class="section-heading-large">{c.work.title}</h2>
      <p class="section-heading-sub">{c.work.subtitle}</p>
    </div>

    <div class="work-showcase">
      <!-- 01. PAYMONTHS -->
      <article
        id="paymonths"
        class="work-item"
        class:is-expanded={expandedWork.paymonths}
      >
        <div class="work-num-col">
          <span class="work-large-num">01</span>
        </div>

        <div class="work-main-col">
          <div class="work-meta-top">
            <span class="work-domain-label">
              {lang === "ko"
                ? "B2B FinTech"
                : "B2B FinTech"}
            </span>
          </div>

          <h3 class="work-title">PAYMONTHS</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "B2B BNPL 서비스에서 결제, 신용평가, 전자계약, 정산 백엔드를 개발하고 운영했습니다."
              : "Built and operated payment, credit evaluation, digital contracting, and merchant settlement backends for a B2B BNPL service."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "Python과 AWS 기반 환경에서 결제 이후 업무 흐름, 외부 금융 서비스 연동, 상태 관리와 장애 대응을 주로 다뤘습니다."
              : "Handled post-payment event-driven workflows, financial partner integrations, state management, and failure recovery on Python and AWS."}
          </p>
          <p class="work-highlight-line">
            {lang === "ko"
              ? "여러 단계와 외부 시스템이 연결된 금융 업무의 상태와 규칙을 어떻게 관리할지 고민했습니다."
              : "Focused on managing multi-stage financial lifecycle states and business rules connected to external partners."}
          </p>

          <p class="work-stack-line" aria-label="Technology stack">
            <span>Python</span> <span aria-hidden="true">/</span>
            <span>FastAPI</span> <span aria-hidden="true">/</span>
            <span>AWS Lambda</span> <span aria-hidden="true">/</span>
            <span>EventBridge</span> <span aria-hidden="true">/</span>
            <span>SQS</span> <span aria-hidden="true">/</span>
            <span>PostgreSQL</span> <span aria-hidden="true">/</span>
            <span>DynamoDB</span>
          </p>

          <!-- Expanded Editorial Experience Study -->
          {#if expandedWork.paymonths}
            <div
              id="work-details-paymonths"
              class="work-deep-dive-panel"
              transition:slide={{ duration: disclosureDuration() }}
            >
              <!-- 1. Domain Language & DDD -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "복잡해지는 금융 업무를 코드로 어떻게 표현할 것인가"
                    : "Expressing Complex Financial Rules in Code"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "서비스가 성장하면서 결제, 계약, 정산을 둘러싼 상태와 업무 규칙도 함께 늘어났습니다. 개발자끼리 코드 구조를 맞추는 것만으로는 충분하지 않았습니다. PM, 운영 담당자와 개발자가 같은 업무 용어를 서로 다른 의미로 사용하는 경우가 있었고, 그 차이는 요구사항이나 예외 상황을 논의할 때 혼선으로 이어졌습니다. 주요 업무 용어와 상태의 의미를 함께 정리하고, 실제 코드의 도메인 모델에서도 같은 언어를 사용했습니다. DDD의 Ubiquitous Language를 실무에서 사용하게 된 배경도 여기에 있었습니다."
                    : "As transaction scale grew, business rules and lifecycle states across payment, contracting, and settlement expanded rapidly. Simply organizing code within engineering was not enough. PMs, operations, and engineers occasionally used identical business terms to mean different workflow states, creating confusion during edge-case discussions. We standardized core business terms and state transitions together and reflected the same ubiquitous language inside domain models."}
                </p>
              </div>

              <!-- 2. Hexagonal Architecture / Domain Isolation -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "업무 규칙과 인프라 변경을 가능한 한 분리했습니다"
                    : "Decoupling Business Rules from Infrastructure Changes"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "서비스는 AWS의 serverless 구성요소를 적극적으로 사용하고 있었지만, 결제와 계약 같은 핵심 업무 규칙까지 Lambda나 특정 외부 서비스 구현에 직접 의존하도록 만들고 싶지는 않았습니다. 도메인 로직과 외부 연동 영역의 경계를 나누고, 인프라 또는 외부 사업자 연동 방식이 바뀌었을 때 핵심 업무 규칙까지 함께 흔들리지 않도록 구조를 관리했습니다. 이 경험을 통해 Hexagonal Architecture를 단순한 코드 구조가 아니라 변경 이유가 다른 코드를 분리하기 위한 수단으로 이해하게 됐습니다."
                    : "While the platform leveraged AWS serverless components, we avoided coupling core financial domain logic directly to Lambda handlers or specific cloud primitives. By separating domain logic from external integration adapters, infrastructure and external provider changes did not affect core business rules. This reinforced Hexagonal Architecture as a practical means to decouple code with differing reasons to change."}
                </p>
              </div>

              <!-- 3. Async Pipelines & Failure Lessons -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "비동기 처리는 성능보다 실패 이후가 더 어려웠습니다"
                    : "Async Pipelines: Failure Recovery Over Raw Performance"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "결제 이후의 모든 업무가 같은 응답 시간과 장애 특성을 갖지는 않았습니다. 사용자 응답에 필요한 처리와 독립적으로 지연하거나 다시 실행할 수 있는 후속 업무를 구분하면서 이벤트 기반 처리를 사용했습니다. 운영하면서 특히 신경 쓴 것은 동일한 업무 이벤트가 다시 들어오는 경우, 외부 서비스가 일시적으로 실패하는 경우, 여러 단계 중 일부만 완료되는 경우, 작업 실패 후 어느 상태부터 다시 처리해야 하는지 판단해야 하는 경우였습니다. 이 과정에서 idempotency, ordering, retry, DLQ 같은 패턴을 실제 운영 문제와 연결해서 경험했습니다."
                    : "Post-payment tasks did not share identical latency requirements or failure profiles. We separated immediate user-facing authorizations from deferred or retryable background operations using event-driven pipelines. Key operational considerations included duplicate inbound events, temporary partner outages, partial multi-step completions, and determining recovery resume points. This provided practical experience with idempotency, ordering, retry strategies, and DLQ handling."}
                </p>
                <p class="cs-abstract-note">
                  {lang === "ko"
                    ? "*(구체적인 production topology와 내부 복구 절차는 회사 시스템에 해당하여 생략합니다.)*"
                    : "*(Specific production topology and internal recovery procedures are omitted to protect proprietary company systems.)*"}
                </p>
              </div>

              <!-- 4. Observability & Operability -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "운영할 수 있어야 시스템이 완성된다고 배웠습니다"
                    : "A System Is Only Complete When It Is Operable"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "비동기 처리가 늘어나면서 하나의 업무 흐름이 여러 실행 단위를 거치게 되었고, 장애가 발생했을 때 원인을 추적하는 일도 어려워졌습니다. 업무 단위의 식별자를 로그와 이벤트에 함께 남기고 structured logging, metrics, tracing을 이용해 하나의 금융 workflow를 연결해서 볼 수 있도록 개선했습니다. 운영팀과도 고객 lifecycle에서 반복적으로 확인하던 업무를 함께 정리해 알림과 상태 확인의 일부를 자동화했습니다."
                    : "As asynchronous components multiplied, single business workflows spanned multiple execution contexts, complicating root-cause analysis. We embedded business correlation IDs across logs and events, leveraging structured logging, metrics, and tracing to visualize end-to-end financial workflows. We also collaborated with operations to automate routine lifecycle notifications and verification checks."}
                </p>
              </div>

              <!-- 5. Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "이 경험 이후 달라진 점:" : "Key Takeaways & Retrospective:"}</strong>
                  {lang === "ko"
                    ? "처음에는 서비스를 기능 단위로 빠르게 분리하는 것이 중요하다고 생각했습니다. 하지만 여러 serverless component와 service를 운영하면서 분산 자체가 비용이라는 것도 경험했습니다. 지금 같은 시스템을 처음부터 설계한다면 우선 하나의 deployable unit 안에서 도메인 경계를 명확하게 나누고, 장애 격리나 독립적인 scaling이 실제로 필요한 지점이 확인됐을 때 서비스 분리를 검토할 것 같습니다."
                    : "Initially, rapid microservice decomposition seemed paramount. However, operating multiple distributed components demonstrated that distribution itself carries significant operational overhead. Today, I would start within a single deployable modular monolith with strict domain boundaries, evaluating service extraction only when fault isolation or independent scaling boundaries are proven."}
                </p>
              </div>

              <!-- Confidentiality Note -->
              <p class="cs-confidential-note">
                {c.work.confidentialityNote}
              </p>
            </div>
          {/if}
        </div>

        <div class="work-action-col">
          <button
            type="button"
            class="work-toggle-btn"
            class:is-active={expandedWork.paymonths}
            onclick={() => toggleWork("paymonths")}
            aria-expanded={expandedWork.paymonths}
            aria-controls="work-details-paymonths"
            aria-label={expandedWork.paymonths
              ? c.work.collapseCTA
              : c.work.expandCTA}
          >
            <span class="toggle-label">
              {expandedWork.paymonths
                ? c.work.collapseCTA
                : c.work.expandCTA}
            </span>
            <ChevronDown size={13} class="toggle-icon" />
          </button>
        </div>
      </article>

      <!-- 02. MOONBERG -->
      <article
        id="moonberg"
        class="work-item"
        class:is-expanded={expandedWork.moonberg}
      >
        <div class="work-num-col">
          <span class="work-large-num">02</span>
        </div>

        <div class="work-main-col">
          <div class="work-meta-top">
            <span class="work-domain-label">
              {lang === "ko"
                ? "Financial Data Automation"
                : "Financial Data Automation"}
            </span>
          </div>

          <h3 class="work-title">MOONBERG</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "회계법인의 Bloomberg 데이터 수집과 reconciliation 업무를 자동화하기 위해 만든 비동기 작업 시스템입니다."
              : "Asynchronous pipeline built to automate Bloomberg market data extraction and reconciliation for an accounting firm."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "Go API가 작업 상태를 관리하고 별도의 Python worker가 데이터 수집을 처리합니다."
              : "A Go API manages persistent job lifecycles while a separate Python worker executes data collection."}
          </p>
          <p class="work-highlight-line">
            {lang === "ko"
              ? "반복적인 데이터 수집과 reconciliation 수작업을 약 60~80% 줄였습니다."
              : "Reduced repetitive data collection and reconciliation tasks by ~60–80%."}
          </p>

          <p class="work-stack-line" aria-label="Technology stack">
            <span>Go</span> <span aria-hidden="true">/</span>
            <span>Python</span> <span aria-hidden="true">/</span>
            <span>PostgreSQL</span> <span aria-hidden="true">/</span>
            <span>PGMQ</span> <span aria-hidden="true">/</span>
            <span>Docker</span> <span aria-hidden="true">/</span>
            <span>Vue</span>
          </p>

          <!-- Expanded Editorial Case Study -->
          {#if expandedWork.moonberg}
            <div
              id="work-details-moonberg"
              class="work-deep-dive-panel"
              transition:slide={{ duration: disclosureDuration() }}
            >
              <!-- Context -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "배경: 요청 생명주기를 벗어난 데이터 수집"
                    : "Context: Extractions Outliving Request Lifecycles"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "Moonberg는 회계법인에서 사용하는 재무 데이터 워크플로로, Bloomberg 데이터를 수집하고 정규화합니다. 단일 수집 작업이 수 분씩 걸릴 수 있어 HTTP 요청 생명주기 밖에서 실행되는 비동기 아키텍처가 필요했습니다."
                    : "Moonberg is a financial data pipeline used by an accounting firm to extract, normalize, and structure Bloomberg market data. Because a single extraction job can take multiple minutes, it had to execute outside the HTTP request lifecycle."}
                </p>
              </div>

              <!-- Go API & PGMQ -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "Go API와 PGMQ 기반의 작업 영속화"
                    : "Go API & PGMQ Persistent Job State"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "Go API는 작업을 수신하자마자 즉시 작업 ID를 발급하고 응답합니다. 대기열 관리는 PostgreSQL 기반 큐인 PGMQ를 활용해 별도 큐 브로커 없이 단일 DB 내에서 작업 상태(queued → dispatched → running → succeeded/failed)를 영속화했습니다. 별도 Python worker가 작업을 가져가 무거운 수집을 처리하며, 수집 결과와 작업 상태를 분리 저장하여 클라이언트가 재접속해도 이전 결과를 즉시 조회할 수 있도록 설계했습니다."
                    : "The Go API immediately acknowledges requests and issues a job ID. We used PGMQ to persist queued work and lifecycle states (queued → dispatched → running → succeeded/failed) within PostgreSQL without introducing an external broker. A separate Python worker claims jobs and executes heavy extractions, persisting results and job states separately so clients can retrieve previous outcomes on reconnect."}
                </p>
              </div>

              <!-- Architecture Diagram -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko" ? "주요 처리 흐름 · Simplified" : "Core Workflow · Simplified"}
                </h4>
                <figure
                  class="mermaid-diagram"
                  data-chart={`flowchart TD
    Client[Client] -->|1. POST /jobs| GoAPI[Go API]
    GoAPI -->|2. Create queued job| DB[(PostgreSQL + PGMQ)]
    GoAPI -->|3. Return Job ID| Client
    DB -->|4. Claim queued job| Worker[Python Bloomberg Worker]
    Worker -->|5. Collect & normalize data| Bloomberg[Bloomberg Data Source]
    Worker -->|6. Persist result & state| DB
    Client -.->|7. Poll job state & result| GoAPI
    GoAPI -->|8. Query persistent state| DB`}
                >
                  <div class="mermaid-loading">
                    {lang === "ko"
                      ? "다이어그램 로딩 중..."
                      : "Rendering architecture diagram..."}
                  </div>
                </figure>
              </div>

              <!-- Failure Scenarios -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "실패 상황 대응 및 운영 결과"
                    : "Failure Resilience & Operational Impact"}
                </h4>
                <div class="cs-failure-group">
                  <div class="cs-failure-item">
                    <p class="cs-fail-q">
                      {lang === "ko"
                        ? "수집 도중 워커가 비정상 종료되거나 클라이언트 연결이 끊어지면?"
                        : "What if workers crash mid-collection or clients disconnect?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "장시간 실행되는 작업 특성상 워커 비정상 종료나 연결 끊김을 기본 전제로 다루었습니다. PGMQ의 가시성 타임아웃(Visibility Timeout)으로 중단된 작업을 감지하여 다시 대기열로 복구하고, 작업 상태와 결과 데이터를 분리 저장하여 클라이언트가 재접속 시 이전 결과를 바로 조회할 수 있게 했습니다."
                        : "Long-running pipelines treat worker crashes and disconnections as baseline conditions. PGMQ's visibility timeout automatically re-queues stalled tasks, while separate state and result storage lets clients retrieve previously completed results without re-running."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "규모가 더 커진다면:" : "Scaling Considerations:"}</strong>
                  {lang === "ko"
                    ? "작업 단계가 더 늘어나고 단계별 보상(compensation) 처리까지 필요해진다면, 그때는 PGMQ와 직접 관리하는 상태 테이블 대신 Temporal 같은 워크플로 엔진을 검토할 것 같습니다."
                    : "If workflow steps grow further and require multi-stage compensation handling, evaluating a dedicated workflow engine like Temporal would be a logical next step."}
                </p>
              </div>
            </div>
          {/if}
        </div>

        <div class="work-action-col">
          <button
            type="button"
            class="work-toggle-btn"
            class:is-active={expandedWork.moonberg}
            onclick={() => toggleWork("moonberg")}
            aria-expanded={expandedWork.moonberg}
            aria-controls="work-details-moonberg"
            aria-label={expandedWork.moonberg
              ? c.work.collapseCTA
              : c.work.expandCTA}
          >
            <span class="toggle-label">
              {expandedWork.moonberg
                ? c.work.collapseCTA
                : c.work.expandCTA}
            </span>
            <ChevronDown size={13} class="toggle-icon" />
          </button>
        </div>
      </article>

      <!-- 03. ALEMBIC-DUMP -->
      <article
        id="alembic-dump"
        class="work-item"
        class:is-expanded={expandedWork.alembic_dump}
      >
        <div class="work-num-col">
          <span class="work-large-num">03</span>
        </div>

        <div class="work-main-col">
          <div class="work-meta-top">
            <span class="work-domain-label">
              {lang === "ko"
                ? "Developer Tooling · Open Source"
                : "Developer Tooling · Open Source"}
            </span>
          </div>

          <h3 class="work-title">ALEMBIC DUMP</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "여러 개발 브랜치에서 반복되던 PostgreSQL schema 및 migration 검증 과정을 자동화하기 위해 만든 Python 도구입니다."
              : "Python developer tool built to automate repetitive PostgreSQL schema and migration verification workflows across branches."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "SSH tunnel, AWS Secrets Manager, PostgreSQL 연결과 데이터 masking을 하나의 작업 흐름으로 묶었습니다."
              : "Bundled SSH tunneling, AWS Secrets Manager access, PostgreSQL connections, and column-level masking into a single workflow."}
          </p>
          <p class="work-highlight-line">
            {lang === "ko"
              ? "마이그레이션 사전 검증에 걸리던 시간을 약 30분에서 2분 내외로 줄였습니다."
              : "Reduced migration pre-flight verification time from ~30 minutes to under 2 minutes."}
          </p>

          <p class="work-stack-line" aria-label="Technology stack">
            <span>Python</span> <span aria-hidden="true">/</span>
            <span>PostgreSQL</span> <span aria-hidden="true">/</span>
            <span>Alembic</span> <span aria-hidden="true">/</span>
            <span>SSH Tunnel</span> <span aria-hidden="true">/</span>
            <span>Data Masking</span> <span aria-hidden="true">/</span>
            <span>AWS Secrets Manager</span>
          </p>

          <!-- Expanded Editorial Case Study -->
          {#if expandedWork.alembic_dump}
            <div
              id="work-details-alembic-dump"
              class="work-deep-dive-panel"
              transition:slide={{ duration: disclosureDuration() }}
            >
              <!-- Context -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "배경: 반복 수작업을 도구로 전환한 이유"
                    : "Context: Replacing Manual Checklists with Automation"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "신규 기능 배포 전 마이그레이션 안전성을 검증하려면 고객 민감 정보를 노출하지 않으면서도 실제와 동일한 데이터 형상을 로컬에서 재현해야 했습니다. 사내 위키에 정리된 수동 체크리스트와 dump 절차는 번거로워 엔지니어들이 건너뛰기 쉬웠고, 이 반복적인 운영 마찰을 자동화하기 위해 오픈소스 라이브러리로 제작했습니다."
                    : "Verifying database migrations before deployment required reproducing representative schema and data shapes locally without exposing customer data. Static wiki checklists and manual dump steps caused high operational friction and were easily skipped under deadlines. alembic-dump turned this error-prone procedure into an automated, open-source Python library."}
                </p>
              </div>

              <!-- Python API Workflow & Proof -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "마이그레이션 사전 검증 자동화"
                    : "Automating Migration Pre-flight Checks"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "Alembic 리비전 정렬, SSH 터널링을 통한 원격 접근, AWS Secrets Manager 시크릿 조회, 컬럼별 마스킹 처리를 단일 파이썬 함수 호출로 연결했습니다."
                    : "Coordinates Alembic revision alignment, SSH tunneling, AWS Secrets Manager retrieval, and column-level masking inside a single Python function call."}
                </p>
                <div class="cs-code-box">
                  <pre><code># {lang === "ko"
  ? "원격 스테이징 DB 스키마/데이터를 로컬로 마스킹 덤프 & Alembic 동기화"
  : "Masked staging DB dump & Alembic revision sync"}
settings = AppSettings(
    source_secret="arn:aws:secretsmanager:...:staging-db",
    target_url="postgresql://localhost:5432/test_db",
    mask_config="./masking.yaml",
    ssh_tunnel="bastion.internal:22",
)
dump_and_load(settings, alembic_dir="./alembic")</code></pre>
                </div>
              </div>

              <!-- Failure Scenarios / Masking Rules -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "민감 정보 마스킹 및 적재"
                    : "Masking Rules & Sanitization"}
                </h4>
                <div class="cs-failure-group">
                  <div class="cs-failure-item">
                    <p class="cs-fail-q">
                      {lang === "ko"
                        ? "로컬 개발 환경에 민감한 실제 데이터가 그대로 적재되지 않는가?"
                        : "How do we prevent raw sensitive records from loading into local databases?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "Source DB에서 읽은 데이터에 설정된 masking rule을 적용한 뒤 target DB에 적재합니다. 이메일, 전화번호, 해시 등 컬럼별 마스킹 규칙을 적용한 데이터만 로컬 PostgreSQL에 반영되도록 구성했습니다."
                        : "Applies configured column-level masking rules (emails, phone numbers, hashes) to rows read from the source DB before writing them to the target DB."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "현재 아쉬운 점과 다음 계획:" : "Current Limitations & Next Steps:"}</strong>
                  {lang === "ko"
                    ? "사람이 매번 같은 절차를 따라야 하는 부분을 코드로 옮기면, 빠뜨릴 단계 자체를 줄일 수 있었습니다. 향후에는 GitHub Actions 등 CI 파이프라인에서 마이그레이션 적용을 사전에 검증할 수 있도록 확장하고 싶습니다."
                    : "Turning manual operational steps into code reduced missed migration checks. Future plans include expanding this into CI pipelines like GitHub Actions for automated pre-deployment schema verification."}
                </p>
              </div>
            </div>
          {/if}
        </div>

        <div class="work-action-col">
          <button
            type="button"
            class="work-toggle-btn"
            class:is-active={expandedWork.alembic_dump}
            onclick={() => toggleWork("alembic_dump")}
            aria-expanded={expandedWork.alembic_dump}
            aria-controls="work-details-alembic-dump"
            aria-label={expandedWork.alembic_dump
              ? c.work.collapseCTA
              : c.work.expandCTA}
          >
            <span class="toggle-label">
              {expandedWork.alembic_dump
                ? c.work.collapseCTA
                : c.work.expandCTA}
            </span>
            <ChevronDown size={13} class="toggle-icon" />
          </button>
        </div>
      </article>

      <!-- 04. ZENITH -->
      <article
        id="zenith"
        class="work-item"
        class:is-expanded={expandedWork.zenith}
      >
        <div class="work-num-col">
          <span class="work-large-num">04</span>
        </div>

        <div class="work-main-col">
          <div class="work-meta-top">
            <span class="work-domain-label">
              {lang === "ko"
                ? "macOS Developer Tool"
                : "macOS Developer Tool"}
            </span>
          </div>

          <h3 class="work-title">ZENITH</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "개발 도구가 남기는 캐시와 로컬 프로세스를 관리하기 위해 Rust와 Tauri로 만들고 있는 macOS 앱입니다."
              : "macOS application built with Rust and Tauri to manage development build caches and local processes safely."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "삭제 경로를 frontend에서 직접 결정하지 않고 Rust backend에서 검증하며, 삭제 전 preview와 보호 경로 검사를 거치도록 만들었습니다."
              : "Keeps deletion decisions strictly within the Rust backend rather than the frontend, enforcing pre-delete previews and protected path guards."}
          </p>

          <p class="work-stack-line" aria-label="Technology stack">
            <span>Rust</span> <span aria-hidden="true">/</span>
            <span>Tauri</span> <span aria-hidden="true">/</span>
            <span>Svelte 5</span> <span aria-hidden="true">/</span>
            <span>macOS</span>
          </p>

          <!-- Expanded Editorial Case Study -->
          {#if expandedWork.zenith}
            <div
              id="work-details-zenith"
              class="work-deep-dive-panel"
              transition:slide={{ duration: disclosureDuration() }}
            >
              <!-- Context -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "배경: 안전한 삭제 경계 설계"
                    : "Context: Designing Safety Boundaries"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "개발을 진행하다 보면 수십 기가바이트의 Cargo target/, node_modules, Docker 캐시가 시스템에 누적됩니다. 삭제 도구에서 가장 치명적인 실패는 사용자 소스 코드나 중요한 설정 파일의 오삭제이므로, 속도보다 '안전한 삭제 경계'를 최우선 원칙으로 설계했습니다."
                    : "Developers accumulate tens of gigabytes of hidden build artifacts (Cargo target/, node_modules, Docker caches) on macOS. Because accidental data loss is catastrophic, ZENITH was designed around explicit safety boundaries rather than naive bulk deletion."}
                </p>
              </div>

              <!-- Safety Model -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "삭제 권한을 Frontend에 두지 않기"
                    : "Keeping Deletion Authority in the Backend"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "Svelte UI는 삭제 경로나 cleanup 로직을 직접 다루지 않고, 현재 scan 결과에서 받은 item ID만 Rust 백엔드로 전달합니다. Rust의 SafetyPlanner가 signature scope와 risk tier(Safe / Rebuild / Manual)를 다시 검증한 뒤 one-shot delete plan을 생성합니다."
                    : "The Svelte UI never specifies deletion paths or strategies directly; it only sends opaque item IDs from the current scan back to Rust. Rust's SafetyPlanner re-validates signature scopes and risk tiers (Safe / Rebuild / Manual) to generate a one-shot delete plan."}
                </p>
                <ul class="cs-bullet-list">
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "사전에 등록된 빌드 아티팩트 signature scope 안에서만 cleanup candidate를 생성합니다."
                        : "Generates cleanup candidates strictly within registered build artifact signature scopes."}
                    </span>
                  </li>
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "삭제 직전 파일 시스템의 identity를 다시 확인하고, symlink와 중요 설정/소스코드가 포함된 protected path를 차단해 scan 이후 대상이 바뀐 경우 삭제를 중단합니다."
                        : "Re-verifies filesystem identity right before execution, blocking symlinks and protected paths to abort if targets changed after scanning."}
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Process Flow Diagram -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko" ? "스캔 및 삭제 프로세스" : "Scan & Safety Execution Flow"}
                </h4>
                <figure
                  class="mermaid-diagram"
                  data-chart={`flowchart LR
    UI[Svelte 5 UI] -->|Tauri IPC invoke| Core[Rust Core Engine]
    Core -->|spawn_blocking worker| FS[macOS File System]
    FS -->|Build Artifact Signatures| Core
    Core -->|Sizes & Safety Previews| UI
    UI -->|Confirm Clean| Core
    Core -->|Pre-delete Validation| FS`}
                >
                  <div class="mermaid-loading">
                    {lang === "ko"
                      ? "다이어그램 로딩 중..."
                      : "Rendering architecture diagram..."}
                  </div>
                </figure>
              </div>

              <!-- Failure Scenarios -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "대용량 탐색과 UI 반응성 유지"
                    : "Deep File Walks & UI Responsiveness"}
                </h4>
                <div class="cs-failure-group">
                  <div class="cs-failure-item">
                    <p class="cs-fail-q">
                      {lang === "ko"
                        ? "수십만 개의 디렉터리를 스캔할 때 UI가 멈추거나 중요한 소스 코드가 포함되면?"
                        : "What if deep scans lock up the UI or include active source repositories?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "스캔 작업은 UI 스레드 밖의 Rust 백그라운드 워커(spawn_blocking)에서 수행하고 진행률을 IPC로 스트리밍합니다. 또한 사용자 홈 디렉터리의 주요 프로젝트 루트는 protected path 규칙을 통해 임의 삭제를 차단합니다."
                        : "Scanning runs in a background Rust worker with progress streamed over Tauri IPC. Protected path rules prevent accidental deletion within active project roots."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "다음으로 풀고 싶은 문제:" : "Next Challenges:"}</strong>
                  {lang === "ko"
                    ? "현재는 검토된 TOML signature를 코드와 함께 배포하고 있습니다. 향후에는 safety boundary를 엄격하게 유지하면서도 사용자 정의 cleanup rule을 유연하게 확장할 수 있는 방식을 고민하고 있습니다."
                    : "Currently, verified TOML signatures are distributed with the application. Moving forward, I am exploring ways to allow custom cleanup rules while strictly maintaining the core safety boundaries."}
                </p>
              </div>
            </div>
          {/if}
        </div>

        <div class="work-action-col">
          <button
            type="button"
            class="work-toggle-btn"
            class:is-active={expandedWork.zenith}
            onclick={() => toggleWork("zenith")}
            aria-expanded={expandedWork.zenith}
            aria-controls="work-details-zenith"
            aria-label={expandedWork.zenith
              ? c.work.collapseCTA
              : c.work.expandCTA}
          >
            <span class="toggle-label">
              {expandedWork.zenith
                ? c.work.collapseCTA
                : c.work.expandCTA}
            </span>
            <ChevronDown size={13} class="toggle-icon" />
          </button>
        </div>
      </article>
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
        <article class="oss-entry">
          <div class="oss-card-top">
            <h4 class="oss-card-name">{item.name}</h4>
            <p class="oss-card-meta">{item.meta}</p>
          </div>

          <p class="oss-card-desc">{item.desc}</p>

          {#if item.links}
            <div class="oss-pr-links">
              {#each item.links as link (link.href)}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  class="oss-pr-link"
                >
                  <GitPullRequest size={14} /> {link.label}
                </a>
              {/each}
            </div>
          {:else if item.linkText && item.linkUrl}
            <a
              href={item.linkUrl}
              target="_blank"
              rel="noreferrer"
              class="oss-pr-link"
            >
              <GitPullRequest size={14} /> {item.linkText}
            </a>
          {/if}
        </article>
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
