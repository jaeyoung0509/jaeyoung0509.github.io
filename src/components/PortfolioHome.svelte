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
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "Approach",
        title: "Turning manual and failure-prone workflows into reliable systems.",
        p1: "I focus on systems where failure recovery is harder than the happy path—long-running workflows, async pipelines, and operational edge cases.",
        p2: "Rather than stopping at API specs, I trace where state actually persists and how systems behave under real failure conditions.",
      },
      work: {
        title: "Selected Engineering Work",
        subtitle:
          "Systems I built, the failure modes they had to handle, and what I would change now.",
        expandCTA: "View details ↓",
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
            subtitle: "OpenAI Agents SDK Integration & Tool Boundaries Documentation",
            linkText: "PR #1741 · Merged ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
            desc: "While exploring the Temporal OpenAI Agents integration, traced execution differences between user-defined FunctionTools and Activity-backed tools in the SDK source, contributing documentation and diagram clarifications upstream (PR #1741, merged).",
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
            subtitle: "Lambda versioning / alias support & SnapStart discussions",
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
            desc: "Explored Python Lambda SnapStart deployment paths in Chalice, raising Issue #2147 to discuss native support. Later reviewed PR #2173 (Lambda version/alias support), proposing pre-flight validation UX for alias naming constraints.",
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
          "Built and operated core payment, contract signing, credit evaluation, and merchant settlement backends for a B2B BNPL platform. Focused on post-payment asynchronous pipelines, financial partner integrations, idempotency guards, and fault recovery.",
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
        headline: "복잡한 상태와 실패를 이해하고,\n운영 가능한 시스템으로 만듭니다.",
        subheadline:
          "결제, 신용평가, 전자계약, 정산 백엔드를 3.5년 이상 개발하고 운영했습니다. 회사 밖에서는 반복되는 문제를 개발 도구로 만들고, 이해가 필요한 부분은 오픈소스 구현까지 따라갑니다.",
        ctaWork: "주요 작업 보기",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "작업 방식",
        title: "문서에서 멈추지 않고 구현까지 따라갑니다.",
        p1: "반복되는 운영 문제와 긴 수명주기 작업, 실패 이후가 더 어려운 비동기 시스템을 주로 다뤘습니다.",
        p2: "API 사용법에 머무르지 않고 상태가 실제로 어디에 남는지, 구현 수준에서 어떻게 동작하는지 끝까지 확인하는 편입니다.",
      },
      work: {
        title: "주요 작업",
        subtitle:
          "실제 운영과 제작 과정에서 만난 문제, 선택한 구조, 그리고 지금 다시 만든다면 바꿀 점을 정리했습니다.",
        expandCTA: "자세히 보기 ↓",
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
            subtitle: "OpenAI Agents SDK 통합 문서 및 실행 경계 정리",
            linkText: "PR #1741 · Merged ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
            desc: "Temporal OpenAI Agents integration을 사용하면서 user-defined FunctionTool과 Activity backed tool의 실행 위치가 다르다는 점을 SDK 구현에서 확인했습니다. 외부 I/O가 필요한 tool을 Activity로 분리해야 하는 기준을 문서와 diagram에 명확히 하는 PR(#1741)을 기여해 merged되었습니다.",
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
            subtitle: "Lambda versioning / alias support · SnapStart 관련 논의",
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
            desc: "Chalice에서 Python Lambda SnapStart를 적용할 수 있는 배포 경로를 검토하며 native 지원 여부를 Issue #2147로 문의했습니다. 이후 Lambda version/alias 지원을 추가하는 PR #2173을 검토하며 alias 값의 사전 validation UX를 제안했습니다.",
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
          "B2B BNPL 플랫폼에서 결제, 신용평가, 전자계약, 정산 백엔드를 개발하고 운영했습니다. 결제 이후 비동기 처리와 외부 금융 서비스 연동, 중복 이벤트 처리와 장애 추적을 주로 다뤘습니다.",
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
            <span class="work-domain-badge">B2B FinTech · Event-Driven</span>
          </div>

          <h3 class="work-title">PAYMONTHS</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "결제부터 정산까지 이어지는 금융 워크플로의 상태와 부분 실패(Partial Failure)를 다룬 백엔드 시스템."
              : "Backend system handling financial state and partial failure from payment to merchant settlement."}
          </p>

          <div class="work-focus-pill">
            <span class="focus-label">{lang === "ko" ? "핵심 과제" : "Core Focus"}</span>
            <span class="focus-text">
              {lang === "ko"
                ? "외부 시스템 부분 실패 시 내부 상태 안전 복구"
                : "Safe internal state recovery upon external partial failures"}
            </span>
          </div>

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
                    ? "같은 업무 용어, 다른 이해"
                    : "Shared Domain Terms, Different Understandings"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "기획, 운영, 개발이 같은 업무 용어를 서로 다른 단계나 상태를 가리키는 데 사용하는 경우가 있었습니다. 예를 들어 '결제 취소', '계약 철회', '정산 보류'가 어떤 상태를 의미하는지 팀마다 이해가 달라 요구사항과 예외 상황을 논의할 때 혼선이 생겼습니다. 주요 용어와 상태 전이 기준을 함께 맞추고, 도메인 모델과 상태 변경 로직에도 동일한 상태 전이 규칙을 반영했습니다. 이를 DDD의 Ubiquitous Language로 관리했습니다."
                    : "Product, Operations, and Engineering occasionally used the same business terms to describe different workflow stages. Terms like 'Payment Cancellation', 'Contract Revocation', and 'Payout Hold' caused confusion during exception handling discussions. We standardized core terms and state transition rules together, aligning domain models and update logic with a shared Ubiquitous Language."}
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
                    ? "초기에는 하나의 API 요청에서 모든 후속 업무를 처리하는 동기 체이닝 방식이 단순해 보였습니다. 하지만 전자계약과 정산 API는 외부 금융사 및 결제 파트너 시스템에 의존해 응답 지연과 일시 장애가 발생할 수 있었습니다. 따라서 결제 승인 응답에 필요한 최소한의 처리(PAID 상태 영속화)만 즉시 처리하고, 전자계약 체결과 판매자 정산은 EventBridge와 SQS FIFO를 통한 비동기 워크플로로 분리했습니다."
                    : "Initially, chaining every step synchronously inside one HTTP request seemed simple. However, downstream partner calls like digital contracting and bank payout APIs had higher latency and occasional outages. We split the boundary: immediate payment auth and PAID state persistence remained synchronous, while downstream contracting and settlement were decoupled into an EventBridge and SQS FIFO workflow."}
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
                        : "What if duplicate payment events arrive due to network retries?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "Consumer가 같은 이벤트를 다시 받을 수 있다고 가정하고 중복 처리를 방어했습니다. 이벤트의 멱등성 키에 유일성 제약을 두고, 동일 이벤트가 다시 들어와도 상태 변경이나 외부 호출이 중복되지 않도록 방어했습니다."
                        : "Assuming consumers may receive duplicate events, we enforced database unique constraints on idempotency keys to prevent duplicate state mutations or redundant external calls."}
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
                        ? "외부 호출과 내부 상태가 어긋날 수 있는 경우를 별도 실패 시나리오로 관리하고, 처리 단계와 외부 요청 정보를 남겨 운영자가 상태를 확인하고 재처리할 수 있게 했습니다. 일시적 장애는 재시도하고, 반복적으로 실패한 메시지는 DLQ로 격리했습니다."
                        : "We managed edge cases where external calls and internal records could diverge as dedicated failure scenarios, recording execution stages and transaction metadata so operators could inspect and reprocess them safely. Temporary failures retried automatically, while persistently failing messages were routed to a DLQ."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "지금 다시 만든다면:" : "Retrospective:"}</strong>
                  {lang === "ko"
                    ? "당시에는 도메인 분리를 빠르게 추진하기 위해 여러 서버리스 마이크로서비스로 구성했지만, 지금 다시 시작한다면 모듈러 모놀리스(Modular Monolith)로 시작해 실제 장애 및 스케일링 경계가 확인된 뒤 서비스 추출을 검토할 것 같습니다."
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
              ? "Go API와 별도 Python worker가 조율하는 장시간 Bloomberg 데이터 수집 백엔드."
              : "Long-running Bloomberg data collection coordinated by a Go API and a separate Python worker."}
          </p>

          <div class="work-focus-pill">
            <span class="focus-label">{lang === "ko" ? "운영 성과" : "Impact"}</span>
            <span class="focus-text">
              {lang === "ko"
                ? "반복적인 데이터 수집 및 reconciliation 수작업 약 60~80% 감소"
                : "Reduced repetitive data extraction & reconciliation tasks by ~60–80%"}
            </span>
          </div>

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

          <div class="work-focus-pill">
            <span class="focus-label">{lang === "ko" ? "사전 검증" : "Verification"}</span>
            <span class="focus-text">
              {lang === "ko"
                ? "마이그레이션 사전 검증 절차 ~30분 → 2분 이내 단축"
                : "Migration pre-flight verification from ~30 min to under 2 min"}
            </span>
          </div>

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
            <span class="work-domain-badge">Developer Tooling · macOS</span>
          </div>

          <h3 class="work-title">ZENITH</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "Rust와 Tauri를 활용하여 개발 환경의 대용량 빌드 캐시를 빠르고 안전하게 정리하는 데스크톱 유틸리티."
              : "Rust + Tauri desktop application focused on safely scanning and cleaning development build caches on macOS."}
          </p>

          <div class="work-focus-pill">
            <span class="focus-label">{lang === "ko" ? "안전 설계" : "Safety"}</span>
            <span class="focus-text">
              {lang === "ko"
                ? "Frontend 삭제 권한 배제 & Rust SafetyPlanner 검증"
                : "No frontend delete authority & Rust SafetyPlanner verification"}
            </span>
          </div>

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
              {expandedWork.zenith ? c.work.collapseCTA : c.work.expandCTA}
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
            <div>
              <h4 class="oss-card-name">{item.name}</h4>
              <p class="oss-card-sub">{item.subtitle}</p>
            </div>
            <span class="oss-status-pill status-{item.statusType}">
              <span class="status-dot"></span>
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
