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
        headline: "I build and operate backend systems that manage\ncomplex state and failure recovery.",
        subheadline:
          "Built and operated payment, credit evaluation, digital contracting, and merchant settlement backends for over 3.5 years. I build tools to remove everyday developer friction, and dive straight into library and open-source implementations whenever behavior feels ambiguous.",
        ctaWork: "Projects",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "Approach",
        title: "Understanding Problems & Aligning Context with the Team",
        p1: "In financial backends handling payments, credit, and settlement, engineering resilience after failures matters far more than the happy path. I have focused extensively on ensuring idempotency against duplicate webhooks and designing bulletproof state recovery so long-running data workflows can resume safely after unexpected interruptions.",
        p2: "When documentation is ambiguous, I trace actual library and framework implementations down to their source code, and I turn recurring developer friction into repeatable internal tools.",
        p3: "Rather than rushing to solo conclusions, I proactively align on problem context and system constraints with PMs, operations, and fellow engineers. When technical trade-offs arise, I map out the operational impacts of each choice to build consensus and execute cleanly.",
      },
      work: {
        title: "Projects",
        subtitle:
          "Production backend systems I operated and developer tools I built.",
        expandCTA: "View details ↓",
        collapseCTA: "Close ↑",
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
        headline: "복잡한 상태와 실패를 다루는\n백엔드 시스템을 만들고 운영해왔습니다.",
        subheadline:
          "결제, 신용평가, 전자계약, 정산 백엔드를 3.5년 이상 개발하고 운영했습니다. 반복되는 번거로움은 직접 도구를 만들어 해결하고, 내부 동작이 모호할 때는 라이브러리와 오픈소스 코드 밑단까지 파고들어 확인합니다.",
        ctaWork: "프로젝트 보기",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "일하는 방식",
        title: "문제를 이해하고, 팀과 맥락을 맞춥니다.",
        p1: "결제, 신용평가, 정산처럼 돈과 직결된 시스템에서는 성공 흐름(Happy path)보다 '실패했을 때 어떻게 복구할 것인가'가 엔지니어링의 본질이었습니다. 중복 웹훅 인입 시 결제가 두 번 처리되지 않도록 멱등성을 보장하고, 장시간 소요되는 데이터 수집이나 마이그레이션이 끊겨도 안전하게 이어갈 수 있도록 상태 복구 설계를 깊이 고민해 왔습니다.",
        p2: "문서에 적힌 스펙만 믿기보다 오픈소스와 라이브러리의 내부 구현을 직접 뜯어보며 동작을 확인하고, 팀 내에서 반복되는 마찰과 비효율은 도구로 만들어 해결하는 것을 좋아합니다.",
        p3: "동시에 혼자 빠르게 결론을 내리기보다 기획자, 운영 담당자, 동료 개발자와 문제의 맥락과 제약을 먼저 맞추려고 합니다. 의견이 다를 때는 각 선택지의 비용과 영향을 정리해 논의하고, 방향이 정해지면 그 결정을 기준으로 실행합니다.",
      },
      work: {
        title: "주요 프로젝트",
        subtitle:
          "현업에서 설계하고 운영한 백엔드 시스템과 직접 만든 오픈소스 프로젝트입니다.",
        expandCTA: "자세히 보기 ↓",
        collapseCTA: "닫기 ↑",
      },
      oss: {
        title: "오픈소스",
        subtitle:
          "사용하면서 발견한 문제를 정리하거나 직접 구현한 작업들입니다.",
        contributions: [
          {
            name: "Temporal Python SDK",
            meta: "OpenAI Agents integration · PR #1741 · Merged",
            desc: "Temporal OpenAI Agents integration을 사용하며 FunctionTool과 Activity 기반 Tool의 실행 위치가 다르다는 점을 SDK 소스 코드에서 확인했습니다. 동작 구조를 명확히 설명하는 다이어그램과 문서를 보완해 PR #1741(Merged)을 기여했습니다.",
            linkText: "PR #1741 ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
          },
          {
            name: "Google Genkit",
            meta: "Ollama Cloud Provider · PR #3813",
            desc: "Go Ollama 공식 문서 예제의 API 불일치를 Issue #3748로 리포트했습니다. 이후 Ollama Cloud의 OpenAI 호환 Provider를 구현하고, model capability mapping과 문서 및 테스트를 함께 추가했습니다.",
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
            desc: "Chalice에서 Python Lambda SnapStart를 사용할 때 필요한 프레임워크 지원 여부를 Issue #2147에서 논의했습니다. 이후 Lambda version 및 alias 지원을 추가하는 PR #2173을 리뷰하며 alias 값을 배포 전에 사전 검증하는 방식을 제안했습니다.",
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
          "B2B BNPL 플랫폼에서 결제, 신용평가, 전자계약, 정산 백엔드를 개발하고 운영했습니다. 결제 이후 이벤트 기반 비동기 워크플로, 외부 금융 서비스 연동, 중복 이벤트 처리 및 분산 환경의 장애 추적을 담당했습니다.",
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

  <!-- Focus / Approach Section -->
  <section class="portfolio-section section-approach" id="about">
    <div class="section-title-row">
      <span class="section-eyebrow">{c.about.eyebrow}</span>
      <h2 class="section-heading-statement">{c.about.title}</h2>
    </div>

    <div class="about-statement-layout">
      <p class="about-lead-statement">{c.about.p1}</p>
      <p class="about-sub-statement">{c.about.p2}</p>
      <p class="about-sub-statement">{c.about.p3}</p>
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
              ? "개인사업자와 법인사업자를 위한 B2B BNPL 플랫폼에서 결제, 신용평가, 전자계약, 정산과 팩토링 후속 처리를 개발하고 운영했습니다."
              : "Built and operated a B2B BNPL platform for sole proprietors and corporations across payments, credit assessment, contracting, and settlement."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "외부 시스템의 지연과 실패가 결제 요청 경로로 전파되지 않도록, 결제 승인과 한도 변경은 동기로 유지하고 독립 재시도가 가능한 후속 업무만 Lambda, EventBridge와 SQS로 분리했습니다."
              : "Kept payment approval and credit-limit changes synchronous, while moving independently retryable work to Lambda, EventBridge, and SQS."}
          </p>
          <p class="work-highlight-line">
            {lang === "ko"
              ? "수일 걸리던 신용평가를 정상 시간대 10분 이내로 자동화하고, 주 15~20시간 걸리던 납부 안내 업무를 자동화했습니다."
              : "Automated credit assessments from several days to under 10 minutes during normal service hours, and eliminated 15–20 hours of weekly manual payment-notice work."}
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
                    ? "트랜잭션 격리: 결제 승인과 비동기 후속 처리의 분리"
                    : "Transaction Isolation: Decoupling Core Approvals from Async Workflows"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "초기 FastAPI/Elastic Beanstalk 기반 모놀리식 MVP에 신용평가, 전자계약, 정산, 알림 및 파트너사 연동이 계속 추가되면서, 외부 API 지연이나 일시적 장애가 결제 승인 요청 경로까지 번지는 문제가 생겼습니다. 결제 승인과 한도 변경처럼 한 호흡에 완결되어야 하는 핵심 상태는 동기 DB 트랜잭션으로 단단히 묶고, 독립적인 재시도가 가능한 후속 업무는 Lambda, EventBridge, SQS 기반의 이벤트 기반 비동기 워크플로로 격리했습니다."
                    : "As credit assessment, contracting, settlement, notifications, and partner integrations accumulated around the initial FastAPI MVP, external delays began spilling into the core checkout path. I isolated critical states that must commit atomically—such as approval and credit-limit updates—within synchronous transactions, while offloading independently retryable tasks to an event-driven architecture using Lambda, EventBridge, and SQS."}
                </p>
              </div>

              <!-- 2. Hexagonal Architecture / Domain Isolation -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "동시성 제어: 한도 차감과 승인 트랜잭션의 원자성 보장"
                    : "Concurrency Control: Atomic Limit Deduction & Approval"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "동일 고객의 중복 결제 요청이나 한도 조회가 겹치는 동시성 이슈를 방어하기 위해 DynamoDB 조건부 쓰기(Conditional Writes) 기반 락을 적용했습니다. 한도 차감, 승인 레코드 생성, 취소 시 한도 복원 흐름을 TransactWriteItems로 묶어 완벽한 원자성을 보장하고, 핵심 상태가 DB에 커밋된 직후에만 후속 이벤트를 발행하도록 설계했습니다. 아울러 다양한 산업군 파트너사의 정산 요구사항은 공통 규칙과 파트너별 정책으로 분리해 도메인 모델에 반영했습니다."
                    : "To guard against duplicate checkout requests and overlapping limit inquiries for the same customer, I used DynamoDB conditional writes as distributed locks. Limit deductions, approval record creation, and rollback restorations were bundled into TransactWriteItems to guarantee atomicity, publishing follow-up domain events only after state was committed. Partner-specific terms were decoupled into reusable policies within the domain model."}
                </p>
              </div>

              <!-- 3. Async Pipelines & Failure Lessons -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "장애 복구: 외부 관공서 점검 시간을 고려한 분산 리스(Lease) 스케줄링"
                    : "Fault Tolerance: Resilient Lease Scheduling Across Government Maintenance Windows"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "담당자가 서류를 수작업으로 대조하며 수일씩 걸리던 사업자 신용평가를 외부 SaaS 연동으로 자동화해, 정상 시간대에는 신청 후 10분 이내로 처리를 완료하도록 구축했습니다. 특히 홈택스나 정부24 같은 외부 기관의 정기 점검 중단에 대응하기 위해, 작업 상태와 재시도 시각을 DynamoDB에 기록하고 조건부 쓰기로 리스(Lease)를 얻은 워커만 작업을 가져가도록 했습니다. 점검 시간이 감지되면 다음 실행 시각을 점검 종료 이후로 옮겨, 사용자가 재신청하지 않아도 시스템이 스스로 멈췄다 이어지는 복구 흐름을 만들었습니다."
                    : "Automated a manual business credit review process from multiple days down to under 10 minutes during standard operating hours. To gracefully handle regular downtime from external government portals (such as Hometax and Gov24), job states and scheduled retry timestamps were tracked in DynamoDB using conditional-write leases. When an external maintenance window was detected, next-run timestamps automatically shifted past the outage, allowing in-flight jobs to resume without user re-entry."}
                </p>
              </div>

              <!-- 4. Observability & Operability -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "운영 효율화: 다차원 검색 조건 표준화 및 납부 안내 자동화"
                    : "Operational DX: Standardizing Dynamic Queries & Automating Billing Notices"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "복잡한 정산 리포팅과 다차원 조회를 원활히 지원하기 위해 데이터를 Aurora PostgreSQL로 투영하고, 반복되던 백오피스 검색 조건을 SQLAlchemy 기반 QueryCriteria 패턴으로 표준화했습니다. 이를 통해 신규 조회 API 개발 기간을 2~3일에서 3~4시간으로 대폭 단축했습니다. 또한 고객과 결제 상태에 따라 발송 대상과 안내 데이터를 사전 산출하는 배치를 구축해, 매주 15~20시간씩 걸리던 수작업 납부 안내 추출과 발송을 완전히 자동화했습니다."
                    : "To support complex multidimensional reporting, read data was projected into Aurora PostgreSQL, and recurring back-office filters were standardized using a SQLAlchemy QueryCriteria pattern. This cut turnaround time for new query APIs from 2–3 days to 3–4 hours. I also built pipelines to pre-compute recipient targeting and payment payloads, completely eliminating 15–20 hours of repetitive weekly manual operations."}
                </p>
              </div>

              <!-- 5. Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "회고:" : "Retrospective:"}</strong>
                  {lang === "ko"
                    ? "운영하면서 배포 단위가 늘수록 로컬 재현과 분산 추적 비용도 커진다는 점을 배웠습니다. 다시 설계한다면 처음부터 과도하게 분산하기보다는 모듈 경계가 분명한 모놀리스로 시작하고, 신용평가 수집이나 외부 웹훅처럼 장애 격리와 독립 재시도가 확실히 요구되는 업무부터 점진적으로 분리할 것입니다."
                    : "Operating distributed components taught me that proliferation of deployable units dramatically increases local debugging and distributed tracing costs. If architecting from scratch, I would start with a well-modularized monolith and extract microservices only when strict failure isolation or independent retry boundaries truly demand it."}
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
              ? "감사 증빙을 위해 Bloomberg Terminal 조회 화면을 건별로 기록해야 했지만 사용할 수 있는 단말기는 한 대뿐이었습니다. 감사 시즌에 몰리는 요청을 순서대로 처리하고 실패 후 이어갈 수 있도록 비동기 작업 파이프라인을 만들었습니다."
              : "Built an asynchronous pipeline for audit evidence that had to be captured case by case from a single Bloomberg Terminal."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "Go API가 요청을 PGMQ에 저장하고 Python worker가 단일 단말기에서 순차 실행하도록 구성했습니다. 작업 상태와 결과를 분리해 사용자 개입이나 실패 이후에도 재시도와 결과 검증을 따로 수행할 수 있게 했습니다."
              : "The Go API persisted requests in PGMQ, and a Python worker executed them sequentially on the terminal. Job state and output were stored separately so retries and result validation could proceed independently."}
          </p>
          <p class="work-highlight-line">
            {lang === "ko"
              ? "반복적인 데이터 수집 및 대사 수작업을 약 60~80% 절감했습니다."
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
                    ? "배경: 단 1대의 단말기 병목과 수작업 증빙의 한계"
                    : "Background: The Single-Terminal Bottleneck in Audit Evidence Collection"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "회계 감사 증빙을 위해 Bloomberg Terminal의 조회 화면을 요청 건별로 캡처하고 대사해야 했지만, 라이선스 제약으로 사내에서 사용할 수 있는 단말기는 단 1대뿐이었습니다. 감사 시즌마다 요청이 한꺼번에 몰려 전담 인력이 밤샘 수작업을 해야 할 정도였고, 한 작업에도 수 분씩 소요되었습니다. 단 1대의 물리 장비에서 요청을 유실 없이 순서대로 소화하기 위해, 요청 접수(HTTP API)와 실제 단말기 실행 워커를 완전히 분리하는 비동기 큐잉 파이프라인을 구축했습니다."
                    : "Audit evidence required capturing and reconciling Bloomberg Terminal outputs for each financial query, but only a single terminal was available due to licensing constraints. During audit season, requests flooded in faster than manual workflows could manage, with single jobs taking minutes. To reliably process jobs sequentially without packet loss on one physical machine, I decoupled HTTP ingestion from physical execution into an asynchronous queue pipeline."}
                </p>
              </div>

              <!-- Go API & PGMQ -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "설계: Go API와 PGMQ 기반의 순차 실행 파이프라인"
                    : "Design: Sequential Execution Pipeline via Go API & PGMQ"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "경량성과 빠른 응답 속도를 위해 Go로 접수 API를 구축해 요청 즉시 추적용 Job ID를 발급하고, PostgreSQL 기반 메시지 큐인 PGMQ에 작업을 적재했습니다. 전용 단말기에서 구동되는 Python 워커는 queued → dispatched → running → succeeded/failed 상태를 엄격히 따르며 한 번에 하나씩 작업을 실행합니다. 특히 작업 진행 상태와 최종 수집 산출물(스크린샷, 정규화 데이터)의 저장을 분리해, 클라이언트 재접속 후에도 완료된 증빙 데이터를 안전하게 재조회할 수 있도록 구성했습니다."
                    : "Built a lightweight intake API in Go to issue immediate tracking Job IDs and enqueue work into PGMQ (Postgres Message Queue). A Python worker running on the dedicated terminal consumed jobs sequentially through strict state transitions: queued, dispatched, running, and succeeded/failed. State transitions and output artifacts were decoupled in storage, allowing clients to reliably fetch audit payloads even after connection drops."}
                </p>
              </div>

              <!-- Architecture Diagram -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko" ? "아키텍처 파이프라인" : "Architecture & Execution Pipeline"}
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
                    ? "예외 처리: 단말기 수동 개입 및 비정상 중단 대응"
                    : "Edge Cases: Handling Physical User Intervention & Process Aborts"}
                </h4>
                <div class="cs-failure-group">
                  <div class="cs-failure-item">
                    <p class="cs-fail-q">
                      {lang === "ko"
                        ? "단말기에서 데이터 수집 중 사용자가 개입하거나 프로세스가 중단되면?"
                        : "What if someone touches the terminal or the worker process stops mid-run?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "사람이 단말기를 직접 조작하거나 다른 작업이 끼어들어 데이터가 오염되는 상황을 항상 염두에 두었습니다. PGMQ의 가시성 타임아웃을 활용해 중간에 끊긴 작업은 큐로 되돌려 안전하게 재시도되도록 하고, 작업 상태와 수집 결과를 분리 저장해 재실행과 증빙 데이터 검증이 서로 꼬이지 않게 했습니다."
                        : "Because other team members might physically use the terminal, preventing data contamination was a primary constraint. PGMQ visibility timeouts safely requeue interrupted jobs for retry, while keeping execution states separate from collected evidence ensures retries and validations never collide."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "회고:" : "Retrospective:"}</strong>
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
              ? "여러 개발자가 하나의 기능을 여러 서비스와 브랜치에서 나눠 개발하면서 Alembic migration 순서와 DB 상태가 달라지는 문제가 반복됐습니다. 로컬 sample data만으로는 실제 데이터 타입과 cardinality에 영향을 받는 query까지 검증하기 어려웠습니다."
              : "Parallel work across services and branches repeatedly produced mismatched Alembic revision order and database state. Local sample data was not enough to validate queries affected by real data types and cardinality."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "실제에 가까운 schema와 데이터 형상을 로컬에 재현하고 migration 상태를 확인하는 과정을 단일 워크플로로 묶었습니다."
              : "Combined representative local schema and data setup with migration-state checks in one workflow."}
          </p>
          <p class="work-highlight-line">
            {lang === "ko"
              ? "마이그레이션 사전 검증에 걸리던 시간을 약 10분에서 1분 내외로 줄였습니다."
              : "Reduced migration pre-flight verification time from ~10 minutes to under 1 minute."}
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
                    ? "문제 정의: 병렬 브랜치 개발로 인한 마이그레이션 순서 충돌"
                    : "Problem: Diverging Migration Revisions Across Parallel Branches"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "여러 서비스와 기능을 여러 개발자가 병렬 브랜치에서 나눠 개발하면서, Alembic 마이그레이션 리비전 순서와 각자의 로컬 DB 스키마가 어긋나 배포 단계에서 데이터가 깨지는 장애가 반복됐습니다. 특히 단순 더미 데이터(sample data)만으로는 실제 데이터 타입의 제약이나 카디널리티에 영향을 받는 복잡한 쿼리 동작까지 사전에 잡아내기 어려웠습니다."
                    : "When multiple engineers worked on interconnected services across parallel Git branches, Alembic migration revision trees diverged and local database schemas fell out of sync, repeatedly breaking schema migrations during release. Furthermore, simplistic dummy data failed to surface realistic query failures caused by type mismatches and data cardinality."}
                </p>
              </div>

              <!-- Python API Workflow & Proof -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "해결: 사전 체크리스트를 1분 내 단일 워크플로로 자동화"
                    : "Solution: Consolidating Manual Pre-flight Checklists into a 1-Minute Run"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "베스천 호스트 SSH 터널링, AWS Secrets Manager 인증 정보 조회, SSL 보안 연결, 마스킹 파이프라인과 Alembic 최신 리비전 동기화까지—개발자가 일일이 수동으로 수행하던 복잡한 체크리스트를 단일 함수 및 CLI 워크플로로 묶었습니다. 이를 통해 마이그레이션 배포 전 사전 검증 시간을 약 10분에서 1분 내외로 단축했습니다."
                    : "Bastion SSH tunneling, AWS Secrets Manager authentication, SSL configuration, data masking, and Alembic revision checks—previously a fragile manual checklist—were consolidated into a single Python API and CLI workflow. This cut pre-flight migration verification from ~10 minutes down to under 1 minute."}
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
                    ? "보안성: 실데이터 유출 없는 컬럼 레벨 마스킹 적재"
                    : "Security: In-Memory Column-Level Masking Without Sensitive Leakage"}
                </h4>
                <div class="cs-failure-group">
                  <div class="cs-failure-item">
                    <p class="cs-fail-q">
                      {lang === "ko"
                        ? "로컬 개발 환경에 실제 민감 데이터가 그대로 유출되는 문제를 어떻게 차단했는가?"
                        : "How do we prevent raw sensitive staging records from leaking into local machines?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "원격 스테이징 DB에서 추출한 원본 데이터에 YAML 설정 기반의 컬럼별 마스킹 규칙을 인메모리에서 먼저 적용한 뒤 로컬 DB에 적재합니다. 민감 개인정보는 완전히 난수화하거나 마스킹 처리되지만, 실제 운영과 동일한 데이터 타입, 외래키 제약조건, 데이터 형상을 온전히 보존하여 완벽한 로컬 테스트 환경을 제공합니다."
                        : "Column-level masking rules configured in YAML are applied in-memory before source data touches the local database. While sensitive customer records are hashed or replaced, real data types, foreign-key constraints, and structural cardinalities remain intact, providing a representative local testing sandbox without security risks."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective / Next Steps -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "확장 방향:" : "Roadmap:"}</strong>
                  {lang === "ko"
                    ? "현재 안정화된 PostgreSQL 및 Alembic 환경을 기반으로, CLI 인터페이스 직관화와 설정 간소화 등 개발자 사용성(DX)을 지속해서 개선하고 있습니다. 나아가 로컬 경량 분석 및 테스트를 위한 DuckDB, 데이터 검증 및 변환을 위한 Pandas DataFrame, 그리고 범용 RDBMS인 MySQL 등 다양한 리소스와 데이터 소스를 유연하게 다룰 수 있도록 지원 범위를 확장하고 있습니다."
                    : "Building on the stable PostgreSQL and Alembic foundation, ongoing work focuses on streamlining developer experience (DX) through intuitive CLI workflows and simpler configuration. Moving forward, the architecture is expanding to support a broader set of data resources—including DuckDB for lightweight local analytics and testing, Pandas DataFrames for flexible data validation, and MySQL connectivity."}
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
              ? "빌드 캐시 정리, Docker 데이터 비우기, 로컬 AI 모델과 포트 점유 프로세스 관리가 여러 도구에 파편화되어 있었습니다. 여러 유료 툴을 전전하지 않고, 개발자에게 꼭 필요한 시스템 정리 기능을 하나의 가볍고 안전한 로컬 앱으로 모으고자 오픈소스로 개발했습니다."
              : "Managing build caches, Docker storage, local AI models, and lingering background processes often means juggling multiple disjointed utilities and paid tools. I built Zenith to unify these everyday developer cleanup tasks into a single, lightweight, and transparent local app."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "실수로 소스 코드가 지워지는 일이 없도록 Rust 백엔드가 보호 경로와 서명을 철저히 재검증하고, UI에는 실제 경로 대신 스캔 세션 ID만 전달해 오삭제 위험을 원천 차단했습니다. 삭제 전 미리보기와 포트 점유 프로세스 강제 종료도 함께 지원합니다."
              : "To prevent accidental deletion of source code or critical configs, the Rust backend rigorously re-validates signature scopes and protected paths, while the Svelte UI receives only opaque scan IDs. It supports dry-run previews, risk classifications, and selective termination of processes holding local ports."}
          </p>
          <p class="work-highlight-line">
            {lang === "ko"
              ? "엄격한 안전 경계(Safety Boundary)와 ID 기반 삭제 모델로 소스 코드 손상 위험 없이 수십 GB의 개발 아티팩트를 안전하게 정리합니다."
              : "Safely reclaims tens of gigabytes of disk space from build artifacts without risking active source code, using strict safety boundaries and ID-based execution."}
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
                    ? "안전 설계: 오삭제를 원천 방지하는 안전 경계(Safety Boundary)"
                    : "Safety Design: Zero-Data-Loss Safety Boundaries"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "로컬 개발 과정에서 수십 기가바이트의 Cargo target/, node_modules, Docker 캐시가 알게 모르게 디스크를 잠식합니다. 시스템 정리 도구에서 가장 치명적인 사고는 소스 코드나 키체인 같은 중요 파일의 오삭제이므로, 단순 대량 삭제보다 엄격한 '안전 삭제 경계(Safety Boundary)'를 최우선 원칙으로 설계했습니다."
                    : "Tens of gigabytes of hidden Cargo target/ directories, node_modules, and Docker caches accumulate across a developer's machine. Because accidental deletion of active source files or credentials is catastrophic, Zenith prioritizes bulletproof safety boundaries over naive bulk removal."}
                </p>
              </div>

              <!-- Safety Model -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "권한 격리: 프론트엔드의 경로 직접 참조 차단 및 백엔드 원샷 검증"
                    : "Authority Isolation: Shielding Raw Paths via Rust Backend Execution Plans"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "Svelte UI는 파일 경로나 정리 로직을 직접 다루지 않고, 현재 스캔 세션에서 발급된 불투명한 임시 Item ID만 Rust 백엔드로 전달합니다. Rust의 SafetyPlanner가 사전 등록된 서명 스코프와 리스크 분류(Safe / Rebuild / Manual)를 엄격히 재검증한 뒤 안전한 원샷 삭제 계획(One-shot Delete Plan)을 생성합니다."
                    : "The Svelte UI never references filesystem paths directly; it only transmits opaque item IDs from the active scan back to Rust. Rust's SafetyPlanner re-validates registered signature scopes and risk tiers (Safe / Rebuild / Manual) to generate a verifiable one-shot execution plan."}
                </p>
                <ul class="cs-bullet-list">
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "사전에 정의된 빌드 아티팩트 서명(Signature Scope) 내에서만 삭제 후보를 생성합니다."
                        : "Generates cleanup candidates strictly within pre-registered build artifact signature scopes."}
                    </span>
                  </li>
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "심볼릭 링크(Symlink)와 소스 코드 루트, 키체인 등 보호 경로를 완벽히 차단하고, 삭제 직전 파일 시스템 Identity(inode/metadata)를 재검증해 스캔 후 대상이 변경되었을 경우 즉시 실행을 중단합니다."
                        : "Re-verifies filesystem identity (inode/metadata) immediately before deletion, blocking symlinks and protected paths to abort if files changed post-scan."}
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Process Flow Diagram -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko" ? "스캔 및 안전 삭제 파이프라인" : "Scan & Verification Pipeline"}
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
                    ? "성능 및 안정성: 백그라운드 스트리밍과 실시간 상태 검증"
                    : "Performance & Reliability: Background Streaming & Identity Re-verification"}
                </h4>
                <div class="cs-failure-group">
                  <div class="cs-failure-item">
                    <p class="cs-fail-q">
                      {lang === "ko"
                        ? "수십만 개의 디렉터리를 딥스캔할 때 UI 멈춤이나 소스 코드 오삭제를 어떻게 방지했는가?"
                        : "How do we maintain UI responsiveness and prevent false deletions during deep scans across hundreds of thousands of directories?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "파일 탐색은 UI 메인 스레드와 분리된 Rust의 spawn_blocking 백그라운드 워커에서 비동기로 수행하고, 진행률과 집계 데이터는 Tauri IPC 이벤트로 스트리밍해 UI 프레임 드랍을 원천 차단했습니다. 또한 깃 루트, 키체인 같은 보호 경로 규칙과 삭제 직전 inode 기반 identity 재검증으로, 스캔 이후 대상이 달라졌을 때 즉시 삭제를 중단하도록 방어했습니다."
                        : "Deep scanning runs asynchronously in background Rust workers via spawn_blocking, streaming progress and size metrics over Tauri IPC to maintain seamless UI responsiveness. Strict protected-path rules combined with pre-execution inode re-verification instantly halt operations if file targets shift."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "회고:" : "Retrospective:"}</strong>
                  {lang === "ko"
                    ? "시스템 정리 도구는 화려한 기능보다 '실수로 지우지 않는다'는 신뢰가 핵심이라는 생각으로 안전 경계와 ID 기반 검증 구조를 가장 신경 썼습니다. 현재 macOS 환경에서 기본 동작을 단단히 다진 만큼, 향후 Windows/Linux 크로스 플랫폼 지원과 장시간 방치된 프로세스 자동 감지 기능으로 확장해 나갈 계획입니다."
                    : "For a system cleanup tool, the absolute certainty that it will never delete active work matters far more than a long feature list. Having proven the safety model on macOS, the next milestone is expanding cross-platform support to Windows and Linux, along with automated detection for long-running orphaned processes."}
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
