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
        role: "Backend Software Engineer",
        location: "Seoul, South Korea",
        name: "Jaeyoung Lee",
        headline: "I built and operated systems for payments, credit,\ncontracts, and settlement—where recovery matters when things go wrong.",
        subheadline:
          "For over 3.5 years, I built and operated backends for payments, credit assessment, digital contracts, and settlement. When documentation does not explain the behavior, I read the implementation. When the same friction keeps coming back, I build a tool for it.",
        ctaWork: "Projects",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "Approach",
        title: "If I do not understand it, I check. If it repeats, I reduce it.",
        p1: "Working on payments and credit assessment meant dealing with many external systems. I spent more time deciding where a failed job should resume than thinking about the once-through happy path. Duplicate events were processed only once, and long-running jobs saved intermediate state so they did not have to restart from the beginning.",
        p2: "When documentation alone does not explain the behavior, I read the library or framework implementation. If I encounter the same problem several times, I move the solution into code or a small tool so nobody has to remember the workaround next time.",
        p3: "I looked beyond the backend implementation and considered the screens and flows people actually used. I worked with designers, frontend engineers, PMs, and operations teammates, then applied what we learned from operational feedback and customer interviews to improve the product.",
      },
      work: {
        title: "Projects",
        subtitle:
          "Systems I operated at work, and tools I built because something kept getting in the way.",
        expandCTA: "View details ↓",
        collapseCTA: "Close ↑",
      },
      oss: {
        title: "Open Source",
        subtitle:
          "When a tool behaves oddly or falls short, I try to leave behind an issue or a patch instead of moving on.",
        contributions: [
          {
            name: "Temporal Python SDK",
            meta: "OpenAI Agents integration · PR #1741 · Merged",
            desc: "While testing the Temporal OpenAI Agents integration, I noticed that FunctionTools and Activity-backed tools ran in different places. The documentation did not explain why, so I followed the SDK implementation and added a diagram and documentation for the execution flow. PR #1741 was merged.",
            linkText: "PR #1741 ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
          },
          {
            name: "Google Genkit",
            meta: "Ollama Cloud Provider · PR #3813",
            desc: "While using the Ollama integration for Go, I found that the official example did not run as written and opened Issue #3748. I then used Ollama Cloud's OpenAI-compatible API to implement a provider, along with model capability mappings, tests, and documentation.",
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
            desc: "While trying Python Lambda SnapStart with Chalice, I found that the framework made Lambda versions and aliases difficult to manage and discussed it in Issue #2147. I later reviewed PR #2173 and suggested validating invalid alias values before they reached deployment.",
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
        role: "Backend Software Engineer",
        period: "2022.04 – 2025.11",
        domain: "B2B BNPL · Payment / Credit / Contract / Settlement",
        summary:
          "Built and operated payment, credit assessment, digital contract, and settlement backends for a B2B BNPL platform. I mainly worked on post-payment asynchronous processing, external financial-service integrations, duplicate-event prevention, and production incident tracing.",
      },
    },
    ko: {
      meta: {
        title: "이재영 · Backend Software Engineer",
        description:
          "결제, 신용평가, 전자계약, 정산 백엔드와 비동기 금융 워크플로를 개발하고 운영해 온 백엔드 소프트웨어 엔지니어 이재영의 포트폴리오.",
      },
      hero: {
        role: "백엔드 소프트웨어 엔지니어",
        location: "대한민국 서울",
        name: "이재영",
        headline: "결제, 신용평가, 계약, 정산처럼\n문제가 생겼을 때 복구가 중요한 시스템을 만들고 운영했습니다.",
        subheadline:
          "결제, 신용평가, 전자계약, 정산 백엔드를 3.5년 이상 개발하고 운영했습니다. 문서만으로 이해가 안 되면 구현까지 내려가 보고, 같은 불편이 반복되면 직접 도구를 만들어 해결합니다.",
        ctaWork: "프로젝트 보기",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "일하는 방식",
        title: "모르면 확인하고, 반복되면 줄입니다.",
        p1: "결제나 신용평가처럼 외부 시스템이 많이 얽힌 업무를 하다 보니, 정상적으로 한 번 처리되는 것보다 중간에 실패했을 때 어디서부터 다시 시작할지를 더 많이 고민했습니다. 중복 이벤트는 한 번만 처리되게 만들고, 오래 걸리는 작업은 중간 상태를 남겨 처음부터 다시 돌리지 않도록 했습니다.",
        p2: "문서만 보고 동작이 잘 이해되지 않으면 라이브러리나 프레임워크 구현까지 내려가 확인합니다. 같은 문제를 여러 번 만나면 다음에는 사람이 기억하지 않아도 되도록 코드나 작은 도구로 옮기는 편입니다.",
        p3: "백엔드 구현에만 머무르지 않고 사용자가 실제로 거치는 화면과 흐름도 함께 살폈습니다. 디자이너, 프론트엔드 개발자, PM, 운영 담당자와 의견을 맞추고, 운영 피드백과 고객 인터뷰에서 확인한 내용을 제품 개선에 반영했습니다.",
      },
      work: {
        title: "주요 프로젝트",
        subtitle:
          "회사에서 운영했던 시스템과, 일을 하거나 개발하면서 불편해서 직접 만든 도구들을 정리했습니다.",
        expandCTA: "자세히 보기 ↓",
        collapseCTA: "닫기 ↑",
      },
      oss: {
        title: "오픈소스",
        subtitle:
          "도구를 쓰다가 이상하거나 아쉬웠던 부분을 그냥 넘기지 않고, 이슈나 코드로 남긴 작업들입니다.",
        contributions: [
          {
            name: "Temporal Python SDK",
            meta: "OpenAI Agents integration · PR #1741 · Merged",
            desc: "Temporal OpenAI Agents integration을 테스트하다가 FunctionTool과 Activity 기반 Tool의 실행 위치가 다르다는 걸 발견했습니다. 문서만으로는 이유를 이해하기 어려워 SDK 구현을 따라가 봤고, 실행 구조를 설명하는 다이어그램과 문서를 추가했습니다. PR #1741은 merge되었습니다.",
            linkText: "PR #1741 ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
          },
          {
            name: "Google Genkit",
            meta: "Ollama Cloud Provider · PR #3813",
            desc: "Go용 Ollama integration을 써보다가 공식 예제대로는 동작하지 않는 부분을 발견해 Issue #3748을 열었습니다. 이후 Ollama Cloud가 OpenAI-compatible API를 제공한다는 점을 이용해 provider를 구현하고, model capability mapping과 테스트, 문서를 함께 추가했습니다.",
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
            desc: "Chalice에서 Python Lambda SnapStart를 써보려다 Lambda version과 alias를 프레임워크에서 다루기 어렵다는 걸 확인해 Issue #2147에서 논의했습니다. 이후 관련 기능을 추가하는 PR #2173을 리뷰하면서, 잘못된 alias 값이 배포 단계까지 가지 않도록 미리 검증하는 방식을 제안했습니다.",
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
        role: "Backend Software Engineer",
        period: "2022.04 – 2025.11",
        domain: "B2B BNPL · Payment / Credit / Contract / Settlement",
        summary:
          "B2B BNPL 플랫폼에서 결제, 신용평가, 전자계약, 정산 백엔드를 개발하고 운영했습니다. 결제 이후 비동기 처리, 외부 금융 서비스 연동, 중복 이벤트 방지와 장애 추적 같은 운영 이슈를 주로 다뤘습니다.",
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
              ? "사업자를 위한 B2B BNPL 플랫폼에서 결제, 신용평가, 전자계약, 정산과 팩토링 후속 처리를 개발하고 운영했습니다."
              : "Built and operated a B2B BNPL platform for sole proprietors and corporations across payments, credit assessment, contracting, and settlement."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "결제 승인과 한도 변경처럼 바로 결과가 필요한 부분은 동기로 두고, 알림이나 후속 처리처럼 따로 재시도할 수 있는 작업은 Lambda, EventBridge와 SQS로 분리했습니다. 외부 시스템이 느리거나 실패해도 결제 요청 자체가 같이 막히지 않게 하기 위해서였습니다."
              : "I kept payment approval and credit-limit changes synchronous because they need an immediate result. Notifications and other work that could be retried separately moved to Lambda, EventBridge, and SQS so a slow or failed external system would not block the payment request itself."}
          </p>
          <p class="work-highlight-line">
            {lang === "ko"
              ? "수일 걸리던 신용평가 처리를 정상 시간대 기준 10분 이내로 줄였고, 주 15~20시간가량 걸리던 납부 안내 업무도 자동화했습니다."
              : "Cut credit assessment from several days to under 10 minutes during normal service hours, and automated payment-notice work that had taken roughly 15–20 hours each week."}
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
                    ? "동시성 제어: 한도 차감과 승인 상태를 함께 쓰기"
                    : "Concurrency Control: Atomic Limit Deduction & Approval"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "같은 고객의 결제 요청이나 한도 조회가 겹칠 때는 DynamoDB 조건부 쓰기(Conditional Writes)로 먼저 처리할 작업을 정했습니다. 한도 차감과 승인 레코드 생성, 취소 시 한도 복원은 TransactWriteItems 한 요청에 넣었고, DB 반영이 끝난 뒤에만 후속 이벤트를 발행했습니다. 파트너사마다 다른 정산 조건은 공통 규칙과 파트너별 정책으로 나눠 도메인 모델에 반영했습니다."
                    : "When payment requests or credit-limit checks overlapped for the same customer, DynamoDB conditional writes decided which request could proceed. Limit deduction and approval creation—and limit restoration on cancellation—were placed in one TransactWriteItems request. Follow-up events were published only after the database write completed. Partner-specific settlement terms were split between shared rules and partner policies in the domain model."}
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
                    ? "정산 리포팅과 여러 조건을 조합한 조회를 위해 데이터를 Aurora PostgreSQL로 옮기고, 반복되던 백오피스 검색 조건은 SQLAlchemy 기반 QueryCriteria 패턴으로 정리했습니다. 신규 조회 API를 만드는 데 걸리던 시간은 보통 2~3일에서 3~4시간으로 줄었습니다. 고객과 결제 상태에 따라 발송 대상과 안내 데이터를 미리 계산하는 배치도 만들어, 매주 15~20시간씩 걸리던 납부 안내 추출과 발송을 자동화했습니다."
                    : "For settlement reports and queries with many filter combinations, I projected data into Aurora PostgreSQL and collected recurring back-office filters in a SQLAlchemy QueryCriteria pattern. A new query API that usually took 2–3 days could then be built in 3–4 hours. I also added a batch job that precomputed recipients and notice data, automating payment-notice work that had taken 15–20 hours each week."}
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
              ? "회계법인에서 실제로 사용한 도구입니다. 감사 증빙을 위해 Bloomberg Terminal 조회 화면을 건별로 기록해야 했지만, 사용할 수 있는 단말기는 한 대뿐이었습니다. 감사 시즌에 몰리는 요청을 쌓아두고 하나씩 처리하면서, 중간에 실패해도 이어서 실행할 수 있는 작업 파이프라인을 만들었습니다."
              : "This tool was used by an accounting firm. Audit evidence required recording each Bloomberg Terminal result, but only one terminal was available. I built a pipeline that queued the requests that piled up during audit season, processed them one at a time, and resumed after an interrupted job."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "Go API가 요청을 PGMQ에 쌓고, Python worker가 단일 Terminal에서 하나씩 실행하도록 만들었습니다. 진행 상태와 결과는 따로 저장해서 사람이 중간에 개입하거나 작업이 실패해도 처음부터 다시 돌리지 않고 이어서 처리할 수 있게 했습니다."
              : "The Go API queued requests in PGMQ, and a Python worker ran them one at a time on the terminal. Progress and results were stored separately so an interrupted or manually paused job could continue instead of starting over."}
          </p>
          <p class="work-highlight-line">
            {lang === "ko"
              ? "데이터 수집과 대사에 들어가던 수작업을 약 60~80% 줄였습니다."
              : "Reduced manual data collection and reconciliation work by roughly 60–80%."}
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
                    ? "감사 증빙을 위해 Bloomberg Terminal 조회 화면을 요청마다 캡처하고 대사해야 했지만, 사용할 수 있는 단말기는 한 대뿐이었습니다. 감사 시즌에는 한 작업에 수 분씩 걸리는 요청이 한꺼번에 몰렸습니다. 요청을 먼저 받아 쌓아두고 단말기에서는 하나씩 실행할 수 있도록 HTTP API와 실행 worker를 분리했습니다."
                    : "Audit evidence required capturing and reconciling a Bloomberg Terminal result for every request, but only one terminal was available. During audit season, requests that each took several minutes arrived in batches. I separated the HTTP API from the execution worker so requests could be queued first and run one at a time on the terminal."}
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
                    ? "Go API는 요청을 받으면 추적용 Job ID를 돌려주고 PostgreSQL 기반 메시지 큐인 PGMQ에 작업을 쌓았습니다. 전용 단말기의 Python worker는 queued → dispatched → running → succeeded/failed 상태를 기록하며 한 번에 하나씩 실행했습니다. 진행 상태와 수집 결과를 따로 저장해, 클라이언트가 다시 접속해도 완료된 증빙을 조회할 수 있게 했습니다."
                    : "The Go API returned a tracking job ID and queued the work in PGMQ, a PostgreSQL-based message queue. A Python worker on the dedicated terminal recorded queued, dispatched, running, and succeeded/failed states while executing one job at a time. Progress and collected output were stored separately so completed evidence remained available after a client reconnected."}
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
                        ? "사람이 단말기를 직접 조작하거나 다른 작업이 끼어들면 실행 중이던 작업이 중단될 수 있었습니다. 이때 PGMQ의 가시성 타임아웃이 지난 작업은 큐로 돌아가 다시 실행됩니다. 작업 상태와 수집 결과는 따로 저장해 재실행이 기존 증빙 데이터를 덮어쓰지 않게 했습니다."
                        : "Someone using the terminal could interrupt a running job. After the PGMQ visibility timeout, that job returned to the queue for another attempt. Execution state and collected output were stored separately so a retry did not overwrite existing evidence."}
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
              ? "여러 개발자가 하나의 기능을 여러 서비스와 브랜치에서 나눠 작업하다 보니 Alembic migration 순서와 각자의 로컬 DB 상태가 자주 어긋났습니다. sample data만으로는 실제 데이터 타입이나 cardinality에 따라 달라지는 query까지 확인하기 어려웠습니다."
              : "When several developers split one feature across services and branches, Alembic migration order and local database state often drifted apart. Sample data was not enough to check queries whose behavior depended on real data types or cardinality."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "개발·스테이징 환경의 schema와 테스트 데이터를 로컬로 덤프하고, Alembic migration 상태까지 한 번에 맞출 수 있는 CLI를 만들었습니다."
              : "I built a CLI that dumps schemas and test data from development and staging environments into a local database, then brings the Alembic migration state in sync."}
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
                        ? "원격 스테이징 DB에서 읽은 데이터에는 YAML로 설정한 컬럼별 마스킹 규칙을 메모리에서 먼저 적용한 뒤 로컬 DB에 적재합니다. 개인정보 값은 난수나 마스킹된 값으로 바꾸되, 데이터 타입과 외래키 제약조건, 테스트에 필요한 데이터 분포는 유지했습니다."
                        : "Column-level masking rules from YAML are applied in memory before data is written to the local database. Personal values are randomized or masked while preserving data types, foreign-key constraints, and the data distribution needed for testing."}
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
              ? "빌드 캐시, Docker 데이터, 로컬 AI 모델처럼 개발하면서 쌓이는 파일을 정리할 때마다 여러 도구를 오가야 했습니다. 제가 자주 쓰는 기능만 한곳에서 쓸 수 있는 가벼운 macOS 앱을 직접 만들기 시작했습니다."
              : "Cleaning up build caches, Docker data, and local AI models meant jumping between several tools. I started building a lightweight macOS app that puts the cleanup features I use most in one place."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "삭제 기능은 UI에서 받은 경로를 그대로 신뢰하지 않도록 만들었습니다. Rust 쪽에서 먼저 파일을 스캔해 ID를 발급하고, 실제 삭제 시점에 보호 경로와 파일 정보를 다시 확인합니다. 삭제 전에는 지워질 항목을 미리 볼 수 있고, 포트를 점유한 프로세스도 함께 정리할 수 있습니다."
              : "The delete flow does not trust a path supplied by the UI. Rust scans each file and issues an ID first, then checks protected paths and file metadata again when deletion begins. The app also previews what will be removed and can stop processes holding local ports."}
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
                    ? "삭제 경로를 UI에서 받지 않는 이유"
                    : "Why the UI Does Not Supply Delete Paths"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "Cargo target/, node_modules, Docker 캐시는 개발하다 보면 수십 GB까지 쌓입니다. 하지만 정리 앱이 UI에서 받은 파일 경로를 그대로 삭제하면 소스 코드도 대상이 될 수 있습니다. 그래서 삭제 후보를 Rust가 직접 스캔해 정하고, UI는 그 결과에 붙은 ID만 선택하도록 만들었습니다."
                    : "Cargo target/ directories, node_modules, and Docker caches can grow to tens of gigabytes. But a cleanup app that deletes any path supplied by its UI could also remove source code. Rust therefore discovers the candidates itself, and the UI can select only the IDs returned by that scan."}
                </p>
              </div>

              <!-- Safety Model -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "스캔 ID로만 삭제 요청하기"
                    : "Deleting Only by Scan ID"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "Svelte UI는 실제 파일 경로 대신 현재 스캔에서 발급된 임시 Item ID만 Rust로 보냅니다. Rust의 SafetyPlanner는 ID에 연결된 경로가 등록된 아티팩트 패턴에 맞는지, Safe / Rebuild / Manual 중 어떤 항목인지 다시 확인한 뒤 삭제 계획을 만듭니다."
                    : "The Svelte UI sends Rust only a temporary item ID from the current scan, not a filesystem path. Rust's SafetyPlanner checks the linked path against registered artifact patterns and its Safe, Rebuild, or Manual category before creating the delete plan."}
                </p>
                <ul class="cs-bullet-list">
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "사전에 정의된 빌드 아티팩트 서명(Signature Scope) 내에서만 삭제 후보를 생성합니다."
                        : "Creates cleanup candidates only from registered build-artifact patterns."}
                    </span>
                  </li>
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "심볼릭 링크(Symlink), 소스 코드 루트, 키체인 같은 보호 경로는 후보에서 제외합니다. 삭제 직전에는 inode와 metadata를 다시 읽고, 스캔 이후 대상이 달라졌으면 실행을 중단합니다."
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
                        ? "파일 탐색은 UI 메인 스레드와 분리된 Rust spawn_blocking worker에서 수행합니다. 진행률과 집계 데이터는 Tauri IPC 이벤트로 보내 스캔 중에도 UI를 조작할 수 있게 했습니다. 삭제 직전에는 보호 경로 규칙과 inode를 다시 확인하고, 스캔 이후 대상이 달라졌으면 삭제하지 않습니다."
                        : "File traversal runs in a Rust spawn_blocking worker away from the UI thread. Progress and size totals are sent through Tauri IPC events so the UI remains usable during a scan. Before deletion, Rust checks protected-path rules and the inode again, and skips the operation if the target changed after scanning."}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Retrospective -->
              <div class="cs-retro-block">
                <p>
                  <strong>{lang === "ko" ? "회고:" : "Retrospective:"}</strong>
                  {lang === "ko"
                    ? "정리 기능을 더 붙이는 것보다, 어떤 경로가 왜 삭제 대상이 됐는지 확인할 수 있는 구조를 먼저 만들었습니다. 현재는 macOS에서 쓰고 있고, 다음에는 Windows/Linux 지원과 오래 떠 있는 프로세스 감지 기능을 추가할 계획입니다."
                    : "Before adding more cleanup features, I built a flow that makes it possible to inspect which path was selected and why. It currently runs on macOS; Windows and Linux support and detection for long-running processes are next."}
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
