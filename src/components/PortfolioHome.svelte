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
          "Built and operated payment, credit evaluation, digital contracting, and merchant settlement backends for over 3.5 years. Outside work, I build small developer tools for repetitive friction and trace libraries and open source code to their implementation.",
        ctaWork: "Selected Work",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "Approach",
        title: "Understanding Problems & Aligning Context with the Team",
        p1: "In production, handling failure recovery rather than the happy path has consistently been the most critical problem. Managing duplicate payment events, long-running data collection, or repetitive migration workflows taught me the importance of knowing exactly where and how to resume execution after failures.",
        p2: "When documentation is ambiguous, I trace actual implementations and turn recurring recovery procedures into code and tools.",
        p3: "At the same time, rather than rushing to solo conclusions, I align on context and constraints with PMs, operations, and fellow engineers. When opinions diverge, I map out the costs and operational impacts of each option, and once a direction is decided, I execute fully aligned with the team's consensus.",
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
        headline: "복잡한 상태와 실패를 다루는\n백엔드 시스템을 만들고 운영해왔습니다.",
        subheadline:
          "결제, 신용평가, 전자계약, 정산 백엔드를 3.5년 이상 개발하고 운영했습니다. 반복되는 문제는 작은 도구로 만들고, 동작이 궁금한 부분은 라이브러리와 오픈소스 구현까지 확인합니다.",
        ctaWork: "주요 작업 보기",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "작업 방식",
        title: "문제를 이해하고, 팀과 맥락을 맞춥니다.",
        p1: "정상 경로보다 실패 이후가 더 어려운 문제를 자주 다뤘습니다. 중복 결제 이벤트, 오래 실행되는 데이터 수집, 반복적인 migration 작업처럼 한 번 실패했을 때 상태를 어디서부터 다시 이어갈지가 중요한 문제들이었습니다.",
        p2: "문서만으로 동작이 명확하지 않으면 실제 구현까지 확인하고, 반복되는 해결 과정은 코드나 도구로 옮깁니다.",
        p3: "동시에 혼자 빠르게 결론을 내리기보다 PM, 운영 담당자, 동료 개발자와 문제의 맥락과 제약을 먼저 맞추려고 합니다. 의견이 다를 때는 각 선택지의 비용과 영향을 정리해 논의하고, 방향이 정해지면 그 결정을 기준으로 실행합니다.",
      },
      work: {
        title: "주요 작업",
        subtitle:
          "실무에서 경험한 시스템과 직접 만든 프로젝트를 정리했습니다.",
        expandCTA: "자세히 보기 ↓",
        collapseCTA: "닫기 ↑",
        confidentialityNote:
          "*회사 내부 구현과 운영 정보를 보호하기 위해 아키텍처와 세부 수치는 일부 추상화했습니다.",
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
                    ? "핵심 상태와 후속 업무의 경계"
                    : "Separating Core State from Follow-up Work"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "초기 FastAPI/Elastic Beanstalk MVP에 신용평가, 계약, 정산, 알림과 파트너 연동이 붙으면서 외부 시스템의 지연과 실패가 핵심 요청 경로로 전파되기 시작했습니다. 결제 승인과 한도 변경처럼 함께 반영돼야 하는 상태는 동기 트랜잭션으로 유지하고, 독립적으로 재시도할 수 있는 후속 업무만 Lambda, EventBridge와 SQS로 분리했습니다."
                    : "As credit assessment, contracting, settlement, notifications, and partner integrations grew around the initial FastAPI MVP, external failures began reaching the core request path. I kept approval and credit-limit changes in the synchronous transaction and moved only independently retryable follow-up work to Lambda, EventBridge, and SQS."}
                </p>
              </div>

              <!-- 2. Hexagonal Architecture / Domain Isolation -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "결제 승인과 한도 변경을 함께 반영"
                    : "Committing Approval and Credit-limit Changes Together"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "동일 고객의 결제 승인과 한도 변경이 겹치는 구간에는 DynamoDB 조건부 쓰기 기반 락을 적용했습니다. 한도 차감, 승인 데이터 생성, 취소 시 한도 복원은 TransactWriteItems로 묶고 핵심 상태가 커밋된 뒤에만 후속 이벤트를 발행했습니다. 여러 산업군 파트너사의 계약, 한도와 정산 요구는 공통 규칙과 파트너별 정책으로 나눠 도메인 모델과 연동 인터페이스에 반영했습니다."
                    : "I used DynamoDB conditional writes to serialize overlapping approval and credit-limit updates for the same customer. Credit deduction, approval creation, and cancellation recovery were grouped with TransactWriteItems, and follow-up events were published only after the core state committed."}
                </p>
              </div>

              <!-- 3. Async Pipelines & Failure Lessons -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "신용평가 자동화와 점검 시간 복구"
                    : "Automating Credit Assessment Across Maintenance Windows"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "담당자가 자료를 확인하며 수일 걸리던 사업자 신용평가를 외부 SaaS 연동으로 자동화해 정상 시간대에는 신청 후 10분 이내 처리되도록 했습니다. 작업 상태와 다음 실행 시각을 DynamoDB에 저장하고, 조건부 쓰기로 lease를 얻은 작업만 queue에 전달했습니다. 정부24·홈택스 등 외부 서비스 점검 중에는 다음 실행 시각을 점검 종료 이후로 옮겨 사용자가 다시 신청하지 않아도 기존 작업이 이어지게 했습니다."
                    : "Automated a manual credit-assessment process from several days to under 10 minutes during normal service hours. Job state and the next run time were persisted in DynamoDB; during government-service maintenance, the next run moved beyond the maintenance window so the original request could resume without user resubmission."}
                </p>
                <p class="cs-abstract-note">
                  {lang === "ko"
                    ? "*(구체적인 실제 운영 구조와 내부 복구 절차는 회사 자산에 해당하여 생략합니다.)*"
                    : "*(Specific production topology and internal recovery procedures are omitted to protect proprietary company systems.)*"}
                </p>
              </div>

              <!-- 4. Observability & Operability -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "반복 업무를 공통 도구로 전환"
                    : "Turning Repeated Operations into Shared Tools"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "다차원 검색과 정산 리포팅이 필요한 데이터를 Aurora PostgreSQL에 투영하고, 반복되던 백오피스 검색 조건을 SQLAlchemy 기반 QueryCriteria로 표준화해 신규 조회 API 개발 시간을 통상 2~3일에서 3~4시간으로 줄였습니다. 고객·결제 상태에 따라 발송 대상과 데이터를 미리 저장하는 흐름도 만들어 주 15~20시간 걸리던 납부 안내 대상 추출과 발송을 자동화했습니다."
                    : "I projected reporting data into Aurora PostgreSQL and standardized recurring back-office filters with a SQLAlchemy QueryCriteria, cutting a typical query API from 2–3 days to 3–4 hours. I also automated payment-notice targeting and delivery that had taken 15–20 hours each week."}
                </p>
              </div>

              <!-- 5. Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "회고:" : "Retrospective:"}</strong>
                  {lang === "ko"
                    ? "운영하면서 배포 단위가 늘수록 로컬 재현과 분산 추적 비용도 커진다는 점을 배웠습니다. 다시 설계한다면 모듈 경계가 분명한 적은 수의 배포 단위로 시작하고, 신용정보 수집이나 외부 webhook처럼 장애 격리와 독립 재시도가 필요한 업무부터 점진적으로 분리할 것입니다."
                    : "More deployment units increased the cost of local reproduction and distributed tracing. I would now start with fewer deployable units and extract work only when fault isolation or independent retries justify the boundary."}
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
                    ? "왜 queue가 필요했는가"
                    : "Why the Work Needed a Queue"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "감사 증빙을 위해 Bloomberg Terminal 조회 화면을 요청 건별로 남겨야 했고, 사용할 수 있는 단말기는 한 대였습니다. 감사 시즌에는 별도 인력이 필요할 만큼 요청이 몰렸으며 한 작업에도 수 분이 걸렸습니다. 요청을 잃지 않고 단일 단말기에서 순서대로 처리하기 위해 HTTP 요청과 실제 실행을 분리했습니다."
                    : "Audit evidence required a captured Bloomberg Terminal result for each request, but only one terminal was available. During audit season, requests accumulated faster than they could be handled, so HTTP intake was separated from sequential execution on the terminal."}
                </p>
              </div>

              <!-- Go API & PGMQ -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "단일 단말기에서 순차 처리"
                    : "Sequential Execution on One Terminal"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "Go API는 요청을 받으면 Job ID를 발급하고 PostgreSQL 기반 큐인 PGMQ에 작업을 저장했습니다. Python worker는 queued → dispatched → running → succeeded/failed 상태를 따라 한 번에 하나씩 실행했습니다. 작업 상태와 결과는 따로 저장해 클라이언트가 재접속해도 완료된 산출물을 다시 조회할 수 있게 했습니다."
                    : "The Go API returned a job ID and persisted work in PGMQ. A Python worker processed one job at a time through queued, dispatched, running, and terminal states. State and output were stored separately so completed evidence remained available after reconnects."}
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
                    ? "사용자 개입과 실패를 어떻게 다뤘는가"
                    : "Handling User Intervention and Failures"}
                </h4>
                <div class="cs-failure-group">
                  <div class="cs-failure-item">
                    <p class="cs-fail-q">
                      {lang === "ko"
                        ? "매크로 실행 중 사용자가 개입하거나 워커가 중단되면?"
                        : "What if a user intervenes or the worker stops mid-run?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "사용자 개입이나 단말기의 다른 작업으로 결과 데이터가 섞일 수 있는 상황을 고려했습니다. PGMQ의 가시성 타임아웃으로 중단된 작업을 다시 처리할 수 있게 하고, 실행 상태와 결과 데이터를 분리해 재시도와 산출물 검증을 독립적으로 수행했습니다."
                        : "User interaction or unrelated terminal work could contaminate the result. PGMQ visibility timeouts made interrupted jobs retryable, while separate state and output storage kept retries independent from evidence validation."}
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
                    ? "협업 중 어떤 문제가 반복됐는가"
                    : "The Problem Repeated Across Parallel Branches"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "하나의 기능을 여러 서비스와 개발자가 나눠 개발하면서 병렬 브랜치의 migration 순서와 각자 로컬 DB 상태가 달라졌고, 통합 시 데이터가 깨지는 문제가 반복됐습니다. 단순한 sample data로는 실제 데이터 타입과 cardinality에 따라 달라지는 query까지 확인하기 어려워, 배포 전에 실제에 가까운 형상으로 검증할 수 있는 도구를 만들었습니다."
                    : "When one feature spanned several services and developers, migration order and local database state diverged across branches and broke during integration. The tool creates a representative local shape for checks that simple sample data could not cover."}
                </p>
              </div>

              <!-- Python API Workflow & Proof -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "단일 명령이 무엇을 대신했는가"
                    : "Replacing the Manual Pre-flight Checklist"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "SSH tunnel 연결, AWS Secrets Manager 인증 정보 조회, PostgreSQL SSL 연결, 필요한 데이터 처리와 Alembic migration 상태 확인을 한 번의 실행 흐름으로 묶었습니다. 기존 수동 체크리스트를 줄여 약 10분 걸리던 사전 검증을 1분 내외로 단축했습니다."
                    : "One workflow replaced manual SSH tunneling, Secrets Manager lookup, PostgreSQL SSL setup, data preparation, and Alembic-state checks. Pre-flight verification fell from about 10 minutes to around 1 minute."}
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
                        ? "로컬 개발 환경에 실제 민감 데이터가 그대로 적재되는 문제를 어떻게 방지하는가?"
                        : "How do we prevent raw sensitive records from loading into local databases?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "Source DB에서 읽은 데이터에 사전 정의된 컬럼별 마스킹 규칙을 적용한 뒤 Target DB에 적재합니다. 이를 통해 민감 정보를 그대로 복제하지 않고도 데이터 타입과 형상을 고려한 로컬 검증 환경을 구성했습니다."
                        : "Configured column-level masking is applied before source rows are written to the target database, enabling representative local checks without copying raw sensitive values."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective / Next Steps -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "현재 범위:" : "Current scope:"}</strong>
                  {lang === "ko"
                    ? "현재 공개 저장소에서 확인 가능한 범위는 PostgreSQL과 Alembic 중심입니다. 구현되지 않은 지원 계획보다 현재 사용법과 검증 흐름을 문서화하는 데 집중하고 있습니다."
                    : "The public implementation currently focuses on PostgreSQL and Alembic. Documentation prioritizes the working verification flow over unimplemented database support."}
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
              ? "캐시 정리, Docker 데이터, 로컬 AI 모델과 장시간 실행되는 개발 프로세스 관리가 여러 도구에 흩어져 있었습니다. 각각의 유료 도구를 구독하지 않고 하나의 로컬 앱에서 관리해 다른 개발자와도 공유하고자 2026년에 Zenith를 시작했습니다."
              : "Started Zenith in 2026 to bring build caches, Docker data, local AI models, and long-running development processes into one local app instead of several paid tools."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "Rust 백엔드가 삭제 후보와 보호 경로를 다시 검증하고, Svelte UI는 경로 대신 현재 스캔에서 발급된 ID만 전달하도록 구성했습니다. 삭제 전 Preview, 위험도 분류, 포트 점유 프로세스 확인과 선택 종료를 지원합니다."
              : "The Rust backend re-validates deletion candidates and protected paths, while the Svelte UI sends only IDs from the current scan. It supports previews, risk tiers, and selective termination of processes occupying local ports."}
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
                    ? "삭제 대상 검증"
                    : "Validating Deletion Targets"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "빌드 과정에서 수십 기가바이트의 Cargo target/, node_modules, Docker 캐시가 시스템에 누적됩니다. 삭제 도구에서 가장 치명적인 문제는 사용자 소스 코드나 중요 설정 파일의 오삭제이므로, 속도보다 엄격한 '안전 삭제 경계(Safety Boundary)'를 최우선 원칙으로 설계했습니다."
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
                    ? "Svelte UI는 삭제 경로나 정리 로직을 직접 다루지 않고, 스캔 결과의 Opaque Item ID만 Rust 백엔드로 전달합니다. Rust의 SafetyPlanner가 Signature Scope와 Risk Tier(Safe / Rebuild / Manual)를 재검증한 뒤 안전한 원샷 삭제 계획(One-shot Delete Plan)을 생성합니다."
                    : "The Svelte UI never specifies deletion paths or strategies directly; it only sends opaque item IDs from the current scan back to Rust. Rust's SafetyPlanner re-validates signature scopes and risk tiers (Safe / Rebuild / Manual) to generate a one-shot delete plan."}
                </p>
                <ul class="cs-bullet-list">
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "사전에 정의된 빌드 아티팩트 Signature Scope 내에서만 Cleanup Candidate를 생성합니다."
                        : "Generates cleanup candidates strictly within registered build artifact signature scopes."}
                    </span>
                  </li>
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "삭제 직전 파일 시스템 Identity를 재검증하고, 심볼릭 링크(Symlink)와 소스 코드·키체인 등 Protected Path를 차단하여 스캔 이후 대상이 변경되었을 경우 즉시 삭제를 중단합니다."
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
                        ? "수십만 개의 디렉터리를 딥스캔할 때 UI 멈춤이나 소스 코드 오삭제를 어떻게 방지하는가?"
                        : "What if deep scans lock up the UI or include active source repositories?"}
                    </p>
                    <p class="cs-fail-a">
                      {lang === "ko"
                        ? "스캔은 UI 스레드와 분리된 Rust 백그라운드 워커에서 수행하고 진행률을 Tauri IPC로 전달합니다. 보호 경로 규칙과 삭제 직전 파일 시스템 identity 재검증으로, 스캔 이후 대상이 달라졌을 때 삭제를 중단합니다."
                        : "Scanning runs in a background Rust worker with progress streamed over Tauri IPC. Protected path rules prevent accidental deletion within active project roots."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "회고:" : "Retrospective:"}</strong>
                  {lang === "ko"
                    ? "현재는 macOS에서 동작하는 기능과 삭제 전 재검증에 집중하고 있습니다. 지원 범위를 넓히기 전에 실제 사용 화면과 설치 방법, 현재 지원 기능을 먼저 명확히 문서화하려고 합니다."
                    : "The current focus is the working macOS flow and pre-delete validation. Before expanding platform support, I am documenting installation, current capabilities, and the app's actual behavior."}
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
