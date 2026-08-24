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
          "Backend engineer with 3.5+ years building and operating payment, credit, contract, and settlement backends. Portfolio covering architecture tradeoffs, failure scenarios, and open source contributions.",
      },
      hero: {
        role: "Software Engineer",
        location: "Seoul, South Korea",
        name: "Jaeyoung Lee",
        headline:
          "I understand complex state and partial failures,\nturning them into operable systems.",
        subheadline:
          "Backend engineer with 3.5+ years building and operating payment, credit, contract, and settlement backends. Outside work, I build developer tools for repetitive operational friction and trace open-source implementations to their source.",
        ctaWork: "Selected Work",
        techStack: ["Python", "Go", "PostgreSQL", "AWS", "Rust"],
      },
      about: {
        title: "Turning manual and failure-prone workflows into reliable systems.",
        p1: "The problems I keep returning to are similar: payment retries that could duplicate a payout, data collection jobs that outlive an HTTP request, or migration checks skipped because they take too long—workflows where failure recovery is harder than the happy path.",
        p2: "These issues are rarely solved by API specs alone. I trace where state actually persists through the implementation, and turn repeated fixes into clearer system boundaries or practical developer tools.",
      },
      work: {
        title: "Selected Engineering Work",
        subtitle:
          "Systems I built, the failure modes they had to handle, and what I would change now.",
        expandCTA: "Case study ↓",
        collapseCTA: "Close ↑",
        coreQuestionLabel: "Core Question",
      },
      oss: {
        title: "Open Source",
        subtitle:
          "Reading implementations, tracing failure boundaries, and contributing improvements upstream.",
        contributions: [
          {
            name: "Temporal Python SDK",
            subtitle: "OpenAI Agents Integration",
            linkText: "PR #1741 · Merged ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
            desc: "While exploring Temporal's OpenAI Agents integration, traced execution boundaries between Workflow-local deterministic tools and Activity-backed I/O tools, contributing documentation clarifications upstream.",
            status: "Merged",
            statusType: "merged",
          },
          {
            name: "Google Genkit",
            subtitle: "Ollama Cloud Provider Plugin",
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
            desc: "Reported broken Go Ollama documentation examples and authored the compat_oai/ollamacloud plugin for Ollama Cloud's OpenAI-compatible API with model capability mapping, documentation, and tests.",
            status: "Active",
            statusType: "active",
          },
          {
            name: "AWS Chalice",
            subtitle: "Lambda SnapStart Framework Discussion",
            linkText: "Issue #2147 ↗",
            linkUrl: "https://github.com/aws/chalice/issues/2147",
            desc: "Initiated framework discussion and configuration proposals for native AWS Lambda SnapStart support based on production deployment experience.",
            status: "Open",
            statusType: "active",
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
          "Built and operated core payment, contract signing, credit evaluation, and merchant settlement backends for a B2B BNPL platform. Designed asynchronous message pipelines, idempotency guards, and fault recovery mechanisms.",
      },
    },
    ko: {
      meta: {
        title: "이재영 · Backend Software Engineer",
        description:
          "결제, 신용평가, 전자계약, 정산 backend와 비동기 금융 workflow를 개발하고 운영해 온 소프트웨어 엔지니어 이재영의 포트폴리오.",
      },
      hero: {
        role: "소프트웨어 엔지니어",
        location: "대한민국 서울",
        name: "이재영",
        headline: "복잡한 상태와 실패를 이해하고,\n운영 가능한 시스템으로 만듭니다.",
        subheadline:
          "결제, 신용평가, 전자계약, 정산 backend를 3.5년 이상 개발하고 운영했습니다. 회사 밖에서는 반복되는 문제를 개발 도구로 만들고, 이해가 필요한 부분은 Open Source 구현까지 따라갑니다.",
        ctaWork: "주요 작업 보기",
        techStack: ["Python", "Go", "PostgreSQL", "AWS", "Rust"],
      },
      about: {
        title: "문서에서 멈추지 않고 구현까지 따라갑니다.",
        p1: "제가 자주 만난 문제는 비슷했습니다. 다시 들어온 결제 이벤트, HTTP 요청보다 오래 실행되는 데이터 수집, 사람이 반복해서 확인하던 migration 작업처럼 정상 경로보다 실패 이후가 더 어려운 문제들입니다.",
        p2: "이런 문제는 API 사용법만으로 해결되지 않을 때가 많았습니다. 상태가 어디에 남는지 실제 구현까지 따라가 보고, 반복되는 해결 방식은 코드나 도구로 옮기는 편입니다.",
      },
      work: {
        title: "주요 작업",
        subtitle:
          "실제 운영과 제작 과정에서 만난 문제, 선택한 구조, 그리고 지금 다시 만든다면 바꿀 점을 정리했습니다.",
        expandCTA: "Case study ↓",
        collapseCTA: "닫기 ↑",
        coreQuestionLabel: "핵심 질문",
      },
      oss: {
        title: "오픈소스",
        subtitle:
          "구현을 따라가며 문제를 확인하고, upstream에 기여한 작업들입니다.",
        contributions: [
          {
            name: "Temporal Python SDK",
            subtitle: "OpenAI Agents SDK 통합",
            linkText: "PR #1741 · Merged ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
            desc: "Temporal과 OpenAI Agents 통합 시 Workflow(결정론적 로컬 도구)와 Activity(비결정론적 I/O 도구) 간의 실행 경계 모호성을 SDK 소스코드 분석을 통해 밝혀내고 공식 문서 개선에 기여했습니다.",
            status: "Merged",
            statusType: "merged",
          },
          {
            name: "Google Genkit",
            subtitle: "Ollama Cloud Provider Plugin",
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
            desc: "Go Ollama 문서 예제 버그(DefineModel/ai.ModelInfo)를 제보하고, Ollama Cloud의 OpenAI 호환 API를 연동하는 compat_oai/ollamacloud 플러그인과 모델 기능 매핑·문서·테스트를 구현했습니다.",
            status: "Active",
            statusType: "active",
          },
          {
            name: "AWS Chalice",
            subtitle: "Lambda SnapStart 프레임워크 지원 논의",
            linkText: "Issue #2147 ↗",
            linkUrl: "https://github.com/aws/chalice/issues/2147",
            desc: "프로덕션 환경에서의 Lambda SnapStart 적용 경험을 바탕으로 프레임워크 차원의 SnapStart 배포 설정 지원 필요성을 논의하고 이슈를 제기했습니다.",
            status: "Open",
            statusType: "active",
          },
        ],
      },
      experience: {
        title: "경력",
        company: "FinovusLab",
        role: "소프트웨어 엔지니어 (Software Engineer)",
        period: "2022.04 – 2025.11",
        domain: "B2B BNPL · Payment / Credit / Contract / Settlement",
        summary:
          "B2B BNPL 핀테크 플랫폼에서 결제, 전자계약 체결, 신용평가, 정산 코어 백엔드 시스템을 설계하고 운영했습니다. 분산 환경의 비동기 메시지 파이프라인과 멱등성 처리, 장애 복구 체계를 구축했습니다.",
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

    <div class="hero-cta-row">
      <a href="#work" class="btn-hero-primary">
        {c.hero.ctaWork} <ArrowDown size={14} />
      </a>
      <a
        href={siteConfig.author.github}
        target="_blank"
        rel="noreferrer"
        class="btn-hero-secondary"
      >
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
          />
        </svg>
        GitHub <ArrowUpRight size={13} />
      </a>
      <a
        href={siteConfig.author.linkedin}
        target="_blank"
        rel="noreferrer"
        class="btn-hero-secondary"
      >
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
        LinkedIn <ArrowUpRight size={13} />
      </a>
    </div>

    <div class="hero-tech-strip">
      {#each c.hero.techStack as tech, idx (tech)}
        <span class="tech-item">{tech}</span>
        {#if idx < c.hero.techStack.length - 1}
          <span class="tech-divider">/</span>
        {/if}
      {/each}
    </div>
  </section>

  <!-- Section Divider -->
  <hr class="section-rule" />

  <!-- How I Work (About) Section -->
  <section class="portfolio-section" id="about">
    <div class="section-title-row">
      <h2 class="section-heading-large">{c.about.title}</h2>
    </div>

    <div class="about-split-layout">
      <p class="about-lead-paragraph">{c.about.p1}</p>
      <p class="about-body-paragraph">{c.about.p2}</p>
    </div>
  </section>

  <!-- Section Divider -->
  <hr class="section-rule" />

  <!-- Selected Work Section -->
  <section class="portfolio-section" id="work">
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
            <span class="work-domain-badge">B2B FinTech · Event-Driven</span>
          </div>

          <h3 class="work-title">PAYMONTHS</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "결제부터 정산까지 이어지는 금융 workflow의 상태와 부분 실패(Partial Failure)를 다룬 backend system."
              : "Backend system handling financial state and partial failure from payment to merchant settlement."}
          </p>

          <div class="work-core-question">
            <strong>{c.work.coreQuestionLabel}:</strong>
            <span>
              {lang === "ko"
                ? "외부 시스템 일부만 성공했을 때 내부 상태를 어떻게 안전하게 복구할 것인가?"
                : "How do you recover internal state safely when external partners experience partial failures?"}
            </span>
          </div>

          <p class="work-stack-line" aria-label="Technology stack">
            <span>Python</span> <span aria-hidden="true">/</span>
            <span>AWS Lambda</span> <span aria-hidden="true">/</span>
            <span>EventBridge</span> <span aria-hidden="true">/</span>
            <span>SQS FIFO</span> <span aria-hidden="true">/</span>
            <span>PostgreSQL</span> <span aria-hidden="true">/</span>
            <span>DynamoDB</span>
          </p>

          <!-- Expanded Editorial Case Study -->
          {#if expandedWork.paymonths}
            <div
              id="work-details-paymonths"
              class="work-deep-dive-panel"
              transition:slide={{ duration: disclosureDuration() }}
            >
              <!-- Context -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "배경: 금융 거래의 연결된 라이프사이클"
                    : "Context: Connected Financial Workflows"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "PAYMONTHS는 B2B BNPL(선구매 후지불) 서비스로, 결제 승인 이후 신용평가, 전자계약 체결, 판매자 정산, 사후 운영 라이프사이클이 얽혀 있는 시스템이었습니다. 서비스가 성장함에 따라 상태 모델과 비즈니스 규칙이 복잡해졌고, 각 단계마다 외부 파트너사 연동 실패에 대한 안전한 복구 전략이 요구되었습니다."
                    : "PAYMONTHS is a B2B BNPL platform coordinating checkout authorization, credit evaluation, digital contracting, merchant settlement, and post-transaction lifecycles. As transaction volume grew, failure handling across external partner APIs required strict state consistency."}
                </p>
              </div>

              <!-- Domain Language (DDD) -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "같은 단어, 다른 의미 (Ubiquitous Language)"
                    : "Same Words, Different Meanings (Ubiquitous Language)"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "기획, 운영, 백엔드 팀 간에 '결제 취소', '계약 철회', '정산 보류' 같은 표현이 각기 다른 시점과 법적/자금 이동 책임을 의미하여 상태 전이 규칙이 모호해지는 문제가 있었습니다. DDD의 Ubiquitous Language를 적용해 주요 도메인 상태와 전이 규칙을 일원화하고, 이를 데이터베이스 트랜잭션 경계와 상태 가드에 직접 반영했습니다."
                    : "Terms like 'Payment Cancellation', 'Contract Revocation', and 'Payout Hold' carried subtly different timing and legal implications across Product, Operations, and Backend. By establishing a shared Ubiquitous Language, we standardized state transition rules and enforced them strictly inside database transaction boundaries."}
                </p>
              </div>

              <!-- Sync vs Async Boundary -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "동기 처리 범위와 이벤트 분리"
                    : "Synchronous Scope vs. Event-Driven Workflow"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "초기에는 하나의 API 요청에서 모든 후속 업무를 처리하는 동기 체이닝 방식이 단순해 보였습니다. 하지만 전자계약(3~5초), 은행 VAN사 정산 등은 외부 의존성이 있어 레이턴시가 길고 장애 특성이 달랐습니다. 따라서 '결제 응답에 즉시 필요한 최소 처리(PAID 상태 영속화)'와 '비동기로 지연 가능한 후속 업무(계약, 정산)'를 분리하고, EventBridge와 SQS FIFO 큐를 통한 이벤트 기반 워크플로를 적용했습니다."
                    : "Initially, chaining every step synchronously inside one HTTP request seemed simple. However, downstream partner calls like digital contracting (3–5s latency) and bank payout VANs had high latency and intermittent outages that cascaded into checkout failures. We split the boundary: immediate payment auth and PAID state persistence remained synchronous, while downstream contracting and settlement were decoupled into an EventBridge and SQS FIFO workflow."}
                </p>
              </div>

              <!-- Architecture Diagram -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko" ? "아키텍처 흐름" : "Architecture Workflow"}
                </h4>
                <figure
                  class="mermaid-diagram"
                  data-chart={`flowchart TD
    Client[Client / PG Webhook] -->|1. Submit Payment| API[Payment API Lambda]
    API -->|2. Persist PAID State| DB[(PostgreSQL)]
    API -->|3. Emit Order Paid Event| EB[AWS EventBridge]
    
    EB -->|Rule: Contract Event| Q1[SQS FIFO: Contract Queue]
    EB -->|Rule: Settlement Event| Q2[SQS FIFO: Settlement Queue]
    
    Q1 -->|Ordered by order_id| CWorker[Contract Service Lambda]
    CWorker -->|E-Signature API| ExtContract[External Contract Gateway]
    CWorker -->|Emit Contract Signed| EB
    
    Q2 -->|Ordered by order_id| SWorker[Settlement Service Lambda]
    SWorker -->|Bank Transfer API| ExtBank[Bank VAN / Payment Gateway]
    
    Q1 -.->|Retries exhausted| DLQ1[Contract DLQ]
    Q2 -.->|Retries exhausted| DLQ2[Settlement DLQ]`}
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
                    ? "실제로 신경 쓴 실패 상황"
                    : "Handling Failure Scenarios"}
                </h4>
                <div class="cs-failure-group">
                  <div class="cs-failure-item">
                    <p class="cs-fail-q">
                      {lang === "ko"
                        ? "같은 결제 이벤트가 네트워크 재시도로 중복 도착하면?"
                        : "What if duplicate payment webhooks arrive due to network retries?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "SQS는 at-least-once 전달이 기본이므로 중복 도착 자체를 정상 조건으로 다루었습니다. 모든 이벤트에 idempotency_key를 부여하고, DB 트랜잭션 내 유니크 인덱스를 검증하여 이미 처리된 건은 추가 부작용 없이 즉시 성공 응답을 반환하도록 방어했습니다."
                        : "SQS provides at-least-once delivery, so duplicate arrivals are treated as a standard baseline condition. Every event carries a unique idempotency_key validated against database unique constraints inside transaction boundaries to safely ignore duplicates without double processing."}
                    </p>
                  </div>
                  <div class="cs-failure-item">
                    <p class="cs-fail-q">
                      {lang === "ko"
                        ? "외부 API는 성공했는데 내부 저장이 실패하거나 파트너사가 일시 장애라면?"
                        : "What if external partner APIs succeed but internal state persistence fails or encounters an outage?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "외부 상태와 내부 상태가 어긋나지 않도록 단계별 진행 상태를 독립적으로 기록합니다. 하위 작업은 SQS 지수 백오프로 재시도되며, 최대 재시도를 초과하면 DLQ로 격리하여 수작업 대사 비용을 최소화했습니다."
                        : "To prevent state divergence between external partners and internal databases, each workflow step logs intermediate states. Downstream tasks retry with exponential backoff and isolate to a DLQ when retries are exhausted."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "지금 다시 만든다면:" : "Retrospective:"}</strong>
                  {lang === "ko"
                    ? "당시에는 도메인 분리를 빠르게 추진하기 위해 여러 서버리스 마이크로서비스로 구성했지만, 지금 다시 시작한다면 모듈러 모놀리스(Modular Monolith)로 시작해 실제 장애 및 스케일링 경계가 확인된 뒤 서비스 추출을 검토할 것입니다."
                    : "While serverless microservices provided rapid early domain separation, if designing this today, I would start with a modular monolith and evaluate service extraction only after actual scaling and fault boundaries are clearly proven."}
                </p>
              </div>
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
              {expandedWork.paymonths ? c.work.collapseCTA : c.work.expandCTA}
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
            <span class="work-domain-badge">Financial Data · Async Architecture</span>
          </div>

          <h3 class="work-title">MOONBERG</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "Go API와 격리된 Python 워커가 조율하는 장시간 Bloomberg 데이터 수집 백엔드."
              : "Long-running Bloomberg data collection coordinated by a Go API and isolated Python workers."}
          </p>

          <div class="work-core-question">
            <strong>{c.work.coreQuestionLabel}:</strong>
            <span>
              {lang === "ko"
                ? "HTTP 요청보다 오래 실행되는 수집 작업을 어떻게 모델링했는가?"
                : "How do you model long-running data collection that outlives HTTP requests?"}
            </span>
          </div>

          <div class="work-highlight-result">
            <span class="result-bullet" aria-hidden="true">■</span>
            <span>
              {lang === "ko"
                ? "수작업 정합성 확인 업무 ~60–80% 감소"
                : "Reduced repetitive extraction & reconciliation by ~60–80%"}
            </span>
          </div>

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
                    ? "Go API는 작업을 수신하자마자 즉시 작업 ID를 발급하고 응답합니다. 대기열 관리는 PostgreSQL 기반 큐인 PGMQ를 활용해 별도 큐 브로커 없이 단일 DB 내에서 작업 상태(queued → dispatched → running → succeeded/failed)를 영속화했습니다. 격리된 Python 워커가 작업을 가져가 무거운 수집을 처리하며, 수집 결과와 작업 상태를 분리 저장하여 클라이언트가 재접속해도 이전 결과를 즉시 조회할 수 있도록 설계했습니다."
                    : "The Go API immediately acknowledges requests and issues a job ID. We used PGMQ (PostgreSQL-based queue) to persist queued work and lifecycle states (queued → dispatched → running → succeeded/failed) within PostgreSQL without introducing an external broker. Isolated Python workers claim jobs and execute heavy extractions. Results and job states remain persistent so clients can disconnect and retrieve results later."}
                </p>
              </div>

              <!-- Architecture Diagram -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko" ? "아키텍처 흐름" : "Architecture Workflow"}
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
                        ? "장기 실행 작업은 워커 크래시와 연결 끊김을 정상 조건으로 취급합니다. PGMQ의 가시성 타임아웃(Visibility Timeout)으로 중단된 작업을 감지하여 재시도하며, 동일한 문서/파라미터 수집 요청은 결과를 캐싱해 외부 데이터 소스 부하를 경감했습니다."
                        : "Long-running pipelines treat worker crashes and disconnections as baseline conditions. PGMQ's visibility timeout automatically re-queues stalled tasks, while result caching prevents redundant extractions for identical parameter sets."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "지금 다시 만든다면:" : "Retrospective:"}</strong>
                  {lang === "ko"
                    ? "작업 수명주기와 단계별 보상(compensation) 로직이 단순 PostgreSQL 큐와 상태 테이블을 넘어선다면, Temporal 같은 전용 워크플로 엔진(Durable Execution)을 도입해 재시도와 오케스트레이션을 선언적으로 관리할 것입니다."
                    : "If workflow lifecycles expand beyond a single durable PostgreSQL queue, I would evaluate a dedicated workflow engine like Temporal to manage step retries and compensations declaratively."}
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
              {expandedWork.moonberg ? c.work.collapseCTA : c.work.expandCTA}
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
            <span class="work-domain-badge">Developer Tooling · Open Source</span>
          </div>

          <h3 class="work-title">ALEMBIC-DUMP</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "스키마 동기화, 데이터베이스 dump/load, 안전한 데이터 마스킹을 위한 Python 도구."
              : "Python tooling for schema synchronization, database dump/load, and safe data masking."}
          </p>

          <div class="work-core-question">
            <strong>{c.work.coreQuestionLabel}:</strong>
            <span>
              {lang === "ko"
                ? "왜 위키 문서가 아니라 재사용 가능한 CLI 도구를 만들었는가?"
                : "Why build a reusable CLI tool instead of a static wiki checklist?"}
            </span>
          </div>

          <div class="work-highlight-result">
            <span class="result-bullet" aria-hidden="true">■</span>
            <span>
              {lang === "ko"
                ? "마이그레이션 사전 검증 절차 ~30분 → 2분 이내 단축"
                : "Migration pre-flight verification from ~30 min to under 2 min"}
            </span>
          </div>

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

              <!-- CLI Workflow & Proof -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "단일 명령으로 실행되는 검증 파이프라인"
                    : "Single-Command Pre-flight Workflow"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "Alembic 리비전 정렬, SSH 터널링을 통한 원격 접근, AWS Secrets Manager 시크릿 조회, 청크 단위 데이터 마스킹을 단일 CLI 명령으로 조율합니다."
                    : "Coordinates Alembic revision alignment, SSH tunneling, AWS Secrets Manager retrieval, and chunked in-flight data masking into a reproducible CLI workflow."}
                </p>
                <div class="cs-code-box">
                  <pre><code># {lang === "ko"
  ? "원격 스테이징 DB 스키마/데이터를 로컬로 마스킹 덤프 & Alembic 동기화"
  : "Masked staging DB dump & Alembic revision sync in one command"}
alembic-dump sync \
  --source-secret "arn:aws:secretsmanager:...:staging-db" \
  --target "postgresql://localhost:5432/test_db" \
  --mask-config ./masking.yaml \
  --ssh-tunnel bastion.internal:22</code></pre>
                </div>
              </div>

              <!-- Failure Scenarios -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "데이터 유출 방지 및 마스킹 검증"
                    : "Masking Integrity & Sanitization"}
                </h4>
                <div class="cs-failure-group">
                  <div class="cs-failure-item">
                    <p class="cs-fail-q">
                      {lang === "ko"
                        ? "민감한 원본 데이터가 로컬 덤프 파일이나 디스크에 남지 않는가?"
                        : "How do we prevent raw sensitive records from touching local disks?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "데이터를 전송받는 스트림 단계에서 청크 단위로 정규식 및 해시 마스킹을 적용합니다. 원본 민감 값은 로컬 디스크나 최종 DB에 도달하지 않으며, 오직 마스킹된 데이터만 로컬 PostgreSQL에 적재됩니다."
                        : "Data is masked in chunked streaming pipelines before hitting local storage. Raw sensitive values never reach disk, ensuring local databases replicate schema topology with sanitized values."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "배운 점 및 발전 방향:" : "Takeaway & Next Steps:"}</strong>
                  {lang === "ko"
                    ? "개발자 도구는 시스템 신뢰성의 연장선이며, 반복적인 운영 마찰을 자동화하면 인적 실수를 원천 차단할 수 있습니다. 향후에는 GitHub Actions와 연동하여 PR 생성 시 임시 DB 컨테이너에서 마이그레이션 락(Lock) 분석 결과를 자동 리포팅하도록 발전시킬 계획입니다."
                    : "Developer tooling is an extension of system reliability—automating operational friction eliminates human error at the root. Future plans include a GitHub Actions integration that spins up ephemeral database containers on PRs to analyze migration lock impacts automatically."}
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
            <span class="work-domain-badge">Developer Tooling · macOS</span>
          </div>

          <h3 class="work-title">ZENITH</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "Rust와 Tauri를 활용하여 개발 환경의 대용량 빌드 캐시를 빠르고 안전하게 정리하는 데스크톱 유틸리티."
              : "Rust + Tauri desktop application focused on safely scanning and cleaning development build caches on macOS."}
          </p>

          <div class="work-core-question">
            <strong>{c.work.coreQuestionLabel}:</strong>
            <span>
              {lang === "ko"
                ? "삭제 도구에서 성능보다 Safety(안전성)를 어떻게 우선했는가?"
                : "How did we prioritize safety over raw performance in a disk cleanup tool?"}
            </span>
          </div>

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
                    ? "3단계 안전 가드 모델 (3-Phase Safety Guard)"
                    : "3-Phase Safety Guard Model"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "단순 재귀 삭제(rm -rf)의 위험을 차단하기 위해 3단계 안전 검증 모델을 적용했습니다:"
                    : "To prevent accidental file loss, ZENITH implements a strict 3-phase safety pipeline:"}
                </p>
                <ul class="cs-bullet-list">
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "1. 시그니처 매칭: 사전에 등록된 빌드 아티팩트 패턴(Cargo.lock이 인접한 target/ 등)만 정확히 식별"
                        : "1. Signature Matching: Identifies only registered build artifact signatures (e.g. target/ adjacent to a valid Cargo.lock)"}
                    </span>
                  </li>
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "2. 사전 검사 (Dry-Run Preview): 삭제 전 용량, 파일 목록, 보호 경로(Protected Paths) 검증 결과를 UI에 투명하게 표시"
                        : "2. Dry-Run Preview: Displays calculated sizes, file trees, and protected path checks transparently before user confirmation"}
                    </span>
                  </li>
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "3. 삭제 직전 재검증: 실제 삭제 명령 직전 파일 시스템 대상을 다시 검증하여 심볼릭 링크나 사용자 코드 유실 방지"
                        : "3. Pre-Delete Validation: Re-verifies filesystem identity and inode paths immediately before execution to prevent symlink traversal or race conditions"}
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
                        ? "스캔 작업은 UI 스레드 밖의 Rust 백그라운드 워커(spawn_blocking)에서 수행하고 진행률을 IPC로 스트리밍합니다. 또한 사용자 홈 디렉터리의 주요 프로젝트 루트는 보호 경로(Protected Paths) 규칙을 통해 임의 삭제를 차단합니다."
                        : "Scanning runs in a background Rust worker with progress streamed over Tauri IPC to keep the Svelte UI responsive. Registered protected-path rules prevent unauthorized recursive directory operations."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "지금 다시 만든다면:" : "Retrospective:"}</strong>
                  {lang === "ko"
                    ? "개발자 도구는 안전성과 예측 가능성이 최우선이어야 하며, 작은 데이터 유실도 사용자의 신뢰를 완전히 무너뜨립니다. 향후에는 YAML/Lua 매니페스트를 통해 커뮤니티가 새로운 캐시 클리너 규칙을 안전하게 정의할 수 있는 플러그인 아키텍처를 도입할 예정입니다."
                    : "Developer tools must prioritize safety above all else—accidental data loss destroys user trust immediately. Future development will introduce a sandboxed plugin architecture (YAML/Lua manifests) allowing developers to define custom artifact cleaners safely."}
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
              {expandedWork.zenith ? c.work.collapseCTA : c.work.expandCTA}
            </span>
            <ChevronDown size={13} class="toggle-icon" />
          </button>
        </div>
      </article>
    </div>
  </section>

  <!-- Section Divider -->
  <hr class="section-rule" />

  <!-- Open Source -->
  <section class="portfolio-section" id="oss">
    <div class="section-title-row">
      <h2 class="section-heading-large">{c.oss.title}</h2>
      <p class="section-heading-sub">{c.oss.subtitle}</p>
    </div>

    <div class="oss-list">
      {#each c.oss.contributions as item (item.name)}
        <article class="oss-entry">
          <div class="oss-card-top">
            <div>
              <h4 class="oss-card-name">{item.name}</h4>
              <p class="oss-card-sub">{item.subtitle}</p>
            </div>
            <span class="oss-status">
              {#if item.statusType === "merged"}
                <Check size={13} aria-hidden="true" />
              {/if}
              {item.status}
            </span>
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

  <!-- Section Divider -->
  <hr class="section-rule" />

  <!-- Experience Summary -->
  <section class="portfolio-section" id="experience">
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
