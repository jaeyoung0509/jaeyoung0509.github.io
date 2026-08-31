<script lang="ts">
  import { onMount } from "svelte";
  import { replaceState } from "$app/navigation";
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
        replaceState(url, {});
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
          "Portfolio of Jaeyoung Lee, a backend software engineer who spent 3 years and 7 months building and operating payment, credit, contract, and settlement systems.",
      },
      hero: {
        role: "Backend Software Engineer",
        location: "Seoul, South Korea",
        name: "Jaeyoung Lee",
        headline: "I built and ran payment and credit systems,\nwith a focus on what happens after a job is interrupted.",
        subheadline:
          "Over 3 years and 7 months at FinovusLab, I worked on duplicate events, ordering, retries, and jobs that needed to pick up where they left off.",
        ctaWork: "Projects",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "How I work",
        title: "A successful API response did not always mean the job was done.",
        p1: "I stored the processing state and the next step so duplicate events did not repeat a state change or an external API call. A credit assessment interrupted by scheduled downtime at Gov24 or Hometax could resume without asking the user to apply again.",
        p2: "When the documentation does not explain a behavior, I read the SDK code. I leave what I find in an issue or pull request, and turn recurring operational work into a CLI or a small app.",
        p3: "I tried to use payment, contract, and settlement terms consistently between conversations with operations teammates and the concepts represented in code.",
      },
      work: {
        title: "Projects",
        subtitle:
          "Systems I operated at work and developer tools I built for recurring problems.",
        expandCTA: "View details ↓",
        collapseCTA: "Close ↑",
      },
      oss: {
        title: "Open Source",
        subtitle:
          "Issues and pull requests for problems I ran into while using these tools.",
        contributions: [
          {
            name: "Temporal Python SDK",
            meta: "OpenAI Agents integration · PR #1741 · Merged",
            desc: "While looking through the Temporal OpenAI Agents integration, I found that FunctionTools and Activity-backed tools ran in different places. I traced the SDK code and added a diagram and documentation for that execution flow. PR #1741 was merged.",
            linkText: "PR #1741 ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
          },
          {
            name: "Google Genkit",
            meta: "Ollama Cloud Provider · PR #3813",
            desc: "The official Go and Ollama example did not compile against the current SDK. I reproduced the problem and opened Issue #3748, then implemented an Ollama Cloud provider with tests and documentation in PR #3813.",
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
            desc: "While trying Lambda SnapStart with Chalice, I found that version and alias support was missing. In my review of PR #2173, I suggested validating invalid alias values before deployment.",
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
          "Owned more than ten serverless services in a small team, focusing on post-payment asynchronous processing, external financial-service integrations, and tracing production incidents.",
      },
    },
    ko: {
      meta: {
        title: "이재영 · Backend Software Engineer",
        description:
          "B2B BNPL의 결제, 신용평가, 전자계약, 정산 백엔드를 3년 7개월 동안 개발하고 운영한 이재영의 포트폴리오.",
      },
      hero: {
        role: "백엔드 소프트웨어 엔지니어",
        location: "대한민국 서울",
        name: "이재영",
        headline: "결제부터 신용평가·계약·정산까지,\nB2B BNPL 백엔드를 개발하고 운영했습니다.",
        subheadline:
          "파이노버스랩에서 3년 7개월 동안 결제 승인과 후속 비동기 처리, 외부 금융 서비스 연동을 담당했습니다. 중복 이벤트와 중단된 작업의 재시작 문제를 주로 다뤘습니다.",
        ctaWork: "프로젝트 보기",
        techStack: ["Python", "Go", "PostgreSQL", "AWS"],
      },
      about: {
        eyebrow: "백엔드 운영 경험",
        title: "중복 요청과 외부 시스템 중단 이후의 처리를 설계했습니다.",
        p1: "결제 이후 계약·정산·알림이 여러 단계로 이어지는 환경에서 처리 상태와 재시작 지점을 관리했습니다. 같은 이벤트가 다시 들어와도 상태 변경과 외부 API 호출이 중복되지 않도록 했습니다.",
        p2: "정부24나 홈택스 점검으로 신용평가가 중단되면, 점검 종료 후 사용자의 재신청 없이 이어서 처리되도록 구성했습니다.",
        p3: "기획·운영·개발이 결제·계약·정산의 상태와 규칙을 같은 의미로 이해할 수 있도록 유비쿼터스 언어를 정리했습니다. 업무 경계와 파트너별 정책을 나누고, 상태 전이와 도메인 이벤트로 규칙을 표현하는 등 DDD의 전략적·전술적 설계를 문서와 코드에 함께 반영했습니다.",
      },
      work: {
        title: "주요 프로젝트",
        subtitle:
          "실무에서 운영한 시스템과 반복 작업을 줄이기 위해 만든 도구입니다.",
        expandCTA: "자세히 보기 ↓",
        collapseCTA: "닫기 ↑",
      },
      oss: {
        title: "오픈소스",
        subtitle:
          "오픈소스를 사용하며 발견한 문제와 개선 사항을 이슈와 PR로 공유했습니다.",
        contributions: [
          {
            name: "Temporal Python SDK",
            meta: "OpenAI Agents integration · PR #1741 · Merged",
            desc: "Temporal의 OpenAI Agents 연동을 살펴보다가 FunctionTool과 Activity 기반 도구의 실행 위치가 다르다는 것을 확인했습니다. SDK 코드를 따라가며 확인한 실행 흐름을 다이어그램과 문서로 정리했고, PR #1741은 병합됐습니다.",
            linkText: "PR #1741 ↗",
            linkUrl: "https://github.com/temporalio/sdk-python/pull/1741",
          },
          {
            name: "Google Genkit",
            meta: "Ollama Cloud Provider · PR #3813",
            desc: "Go용 Ollama 공식 예제가 현재 SDK와 맞지 않아 컴파일되지 않는 문제를 재현해 Issue #3748로 보고했습니다. 이후 Ollama Cloud의 OpenAI 호환 API를 사용하는 프로바이더와 테스트, 문서를 구현해 PR #3813으로 제출했습니다.",
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
            desc: "Chalice에서 Lambda SnapStart를 사용하다 버전과 별칭 지원이 부족한 점을 확인했습니다. 관련 PR #2173을 리뷰하며 잘못된 별칭 값을 배포 전에 검증하는 방식을 제안했습니다.",
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
          "B2B BNPL의 결제·신용평가·전자계약·정산 백엔드를 개발하고 운영했습니다. 결제와 후속 작업을 분리해 외부 시스템 장애의 영향을 줄이고, 신용평가와 납부 안내 업무를 자동화했습니다.",
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
                ? "B2B 결제·신용"
                : "B2B payments and credit"}
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
                    ? "결제 승인과 후속 작업을 분리했습니다"
                    : "Separating approval from retryable work"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "초기 FastAPI/Elastic Beanstalk 기반 MVP에 신용평가, 전자계약, 정산, 알림과 파트너 연동이 붙으면서 외부 API 지연이나 장애가 결제 승인까지 늦추는 문제가 생겼습니다. 결제 승인과 한도 변경은 동기 트랜잭션에서 처리하고, 따로 재시도할 수 있는 계약, 정산, 알림과 파트너 연동은 Lambda, EventBridge와 SQS로 분리했습니다."
                    : "As credit assessment, contracts, settlement, notifications, and partner integrations were added to the initial FastAPI and Elastic Beanstalk MVP, delays in an external API began slowing down payment approval. I kept approval and credit-limit updates in a synchronous transaction, and moved contracts, settlement, notifications, and partner calls that could be retried separately to Lambda, EventBridge, and SQS."}
                </p>
              </div>

              <!-- 2. Hexagonal Architecture / Domain Isolation -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "결제 승인과 한도 변경을 함께 반영했습니다"
                    : "Updating approval and credit limits together"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "같은 고객의 결제 요청이나 한도 변경이 겹치면 DynamoDB 조건부 쓰기로 하나의 요청만 처리되게 했습니다. 한도 차감과 승인 생성, 취소 시 한도 복원은 TransactWriteItems 한 요청에 넣었고, DB 반영이 끝난 뒤에만 후속 이벤트를 발행했습니다. 파트너마다 다른 계약과 정산 규칙은 공통 부분과 별도 정책으로 나눴습니다."
                    : "When payment requests or credit-limit updates overlapped for the same customer, a DynamoDB conditional write allowed only one request to proceed. Limit deduction and approval creation, or limit restoration after a cancellation, were written in one TransactWriteItems request. Follow-up events were published only after the write completed. Contract and settlement rules were split into shared behavior and partner-specific policies."}
                </p>
              </div>

              <!-- 3. Async Pipelines & Failure Lessons -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "기관 점검이 끝난 뒤 작업을 이어서 처리했습니다"
                    : "Resuming credit checks after scheduled downtime"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "담당자가 자료를 직접 확인하느라 수일 걸리던 사업자 신용평가를 외부 SaaS와 연동해 정상 시간대에는 10분 안에 끝나도록 줄였습니다. 작업 상태와 다음 실행 시간을 DynamoDB에 저장했고, 홈택스나 정부24가 점검 중이면 다음 실행 시간을 점검 종료 이후로 옮겼습니다. 사용자가 다시 신청하지 않아도 기존 작업이 이어서 실행됐습니다."
                    : "I connected the business credit review to an external service, reducing a process that had taken several days to under ten minutes during normal service hours. The job state and next run time were stored in DynamoDB. If Hometax or Gov24 was under maintenance, the next run moved to the end of that window and the existing job resumed without asking the user to apply again."}
                </p>
              </div>

              <!-- 4. Observability & Operability -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "납부 안내에 들던 주 15~20시간을 줄였습니다"
                    : "Removing 15–20 hours of weekly notice work"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "결제와 연체 상태가 바뀔 때 납부 안내 대상을 미리 계산해 발송 예정일별로 저장했습니다. 발송 직전에는 CMS 출금동의 상태를 다시 확인했습니다. 운영자가 매주 직접 대상을 추리고 발송하던 15~20시간의 작업을 자동화했습니다."
                    : "When payment or delinquency state changed, the system calculated notice recipients ahead of time and stored them by send date. It checked the latest CMS debit-consent state immediately before sending. This replaced 15–20 hours of weekly work spent selecting recipients and sending notices by hand."}
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
                ? "감사 업무 자동화"
                : "Bloomberg audit automation"}
            </span>
          </div>

          <h3 class="work-title">MOONBERG</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "감사 증빙을 위해 Bloomberg Terminal 조회 결과를 건별로 남겨야 했지만, 사용할 수 있는 단말기는 한 대뿐이었습니다. 감사 시즌에는 이 작업만 맡는 인력이 따로 필요할 정도로 요청이 몰렸습니다."
              : "Each Bloomberg Terminal result had to be saved as audit evidence, but only one terminal was available. During audit season, the volume was high enough to require a person dedicated to this work."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "여러 운영자가 넣은 요청을 PGMQ에 쌓고 Python worker가 Terminal에서 하나씩 처리했습니다. Go backend와 Vue3 Web Console에서는 요청을 넣고 진행 상태와 결과를 확인할 수 있게 했습니다."
              : "Requests from multiple operators were queued in PGMQ and processed one at a time by a Python worker on the terminal. A Go backend and Vue 3 web console handled job submission and showed progress and results."}
          </p>
          <p class="work-highlight-line">
            {lang === "ko"
              ? "업무별 반복 수작업을 약 60~80% 줄였습니다."
              : "Reduced recurring manual work by roughly 60–80%, depending on the task."}
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
                    ? "Terminal 한 대로 몰리는 요청을 처리했습니다"
                    : "One terminal, many audit requests"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "감사 시즌에는 한 작업에 수 분씩 걸리는 요청이 한꺼번에 몰렸습니다. 요청은 먼저 받아 쌓아두고, Terminal에서는 하나씩 실행할 수 있도록 HTTP API와 실행 worker를 분리했습니다."
                    : "During audit season, requests that each took several minutes arrived in batches. I separated the HTTP API from the worker so requests could be queued first and then run one at a time on the terminal."}
                </p>
              </div>

              <!-- Go API & PGMQ -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "요청 접수와 실행을 분리했습니다"
                    : "Queueing terminal jobs with PGMQ"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "Go API는 요청을 받으면 Job ID를 돌려주고 PostgreSQL 기반 메시지 큐인 PGMQ에 작업을 넣었습니다. 전용 Terminal의 Python worker는 한 번에 하나씩 작업을 실행하고 진행 상태와 결과를 저장했습니다. 운영자는 다시 접속해도 완료된 결과를 확인할 수 있었습니다."
                    : "The Go API returned a job ID and put the work in PGMQ, a PostgreSQL-based message queue. A Python worker on the dedicated terminal ran one job at a time and stored its progress and result. Operators could reconnect later and still retrieve completed results."}
                </p>
              </div>

              <!-- Architecture Diagram -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko" ? "작업 흐름" : "Job flow"}
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
                    ? "중간에 멈춘 작업만 다시 실행했습니다"
                    : "Recovering interrupted terminal jobs"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "작업 도중 누군가 Terminal을 사용하거나 프로세스가 끊기는 경우가 있어 진행 상태와 결과를 따로 저장했습니다. 중간에 멈추면 해당 작업만 다시 실행하고 기존 결과는 별도로 확인할 수 있게 했습니다."
                    : "A person using the terminal or a stopped worker process could interrupt a job. Progress and results were stored separately so only the interrupted job had to run again and earlier results remained available."}
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
                ? "로컬 DB 재현 도구 · 오픈소스"
                : "Local database CLI · Open source"}
            </span>
          </div>

          <h3 class="work-title">ALEMBIC DUMP</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "하나의 기능을 여러 서비스와 개발자가 나눠 작업하면서 브랜치마다 Alembic 마이그레이션 순서와 로컬 DB 상태가 자주 달라졌습니다. 샘플 데이터만으로는 실제 데이터 타입이나 건수에 따라 달라지는 쿼리를 확인하기 어려웠습니다."
              : "When several developers split one feature across services and branches, Alembic migration order and local database state often drifted apart. Sample data was not enough to check queries whose behavior depended on real data types or cardinality."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "스테이징 DB를 로컬에서 재현할 때 필요한 베스천 접속, Secrets Manager 인증 정보 조회, SSH 터널, PostgreSQL SSL 연결과 마이그레이션 상태 확인을 CLI 하나로 묶었습니다."
              : "I put the steps for reproducing a staging database locally into one CLI: connecting through a bastion, reading credentials from Secrets Manager, opening an SSH tunnel, using PostgreSQL SSL, and checking the migration state."}
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
                    ? "브랜치마다 마이그레이션 상태가 달라졌습니다"
                    : "Migration state drifted across branches"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "여러 서비스와 기능을 병렬로 개발하면서 Alembic 리비전 순서와 각자의 로컬 DB 스키마가 자주 어긋났습니다. 단순한 샘플 데이터로는 실제 데이터 타입이나 건수에 따라 달라지는 쿼리까지 배포 전에 확인하기 어려웠습니다."
                    : "As work moved across several services and branches, Alembic revision order and local schemas often drifted apart. Simple sample data was not enough to check queries whose behavior depended on real data types or row counts before release."}
                </p>
              </div>

              <!-- Python API Workflow & Proof -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "반복하던 확인 과정을 한 명령으로 묶었습니다"
                    : "Turning the checklist into one command"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "베스천 접속, Secrets Manager 인증 정보 조회, SSH 터널, PostgreSQL SSL 연결과 마이그레이션 상태 확인을 한 명령으로 처리하도록 만들었습니다. 약 10분 걸리던 검증은 1분 내외로 줄었습니다."
                    : "The CLI handled the bastion connection, Secrets Manager lookup, SSH tunnel, PostgreSQL SSL connection, and migration-state check in one command. A verification that took about ten minutes came down to roughly one minute."}
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
                ? "macOS 개발 도구"
                : "macOS developer tool"}
            </span>
          </div>

          <h3 class="work-title">ZENITH</h3>
          <p class="work-premise">
            {lang === "ko"
              ? "개발 캐시와 Docker 데이터, 로컬 AI 모델을 정리하거나 오래 떠 있는 프로세스를 찾을 때마다 여러 도구를 써야 했습니다. 자주 쓰는 기능을 한곳에 모으려고 macOS 앱을 만들기 시작했습니다."
              : "Cleaning developer caches, Docker data, and local AI models, or finding a long-running process, meant using several different tools. I started a macOS app that puts the features I use most in one place."}
          </p>
          <p class="work-premise-sub">
            {lang === "ko"
              ? "임의 경로가 바로 삭제되지 않도록 후보를 먼저 검사하고, 안전 등급을 통과한 항목만 삭제 단계로 넘깁니다. 소스 코드나 Keychain, 인증정보가 있는 경로는 후보에서 제외했고, 로컬 포트를 사용하는 프로세스도 찾아 종료할 수 있게 했습니다."
              : "The app inspects cleanup candidates before deletion and only passes items in an allowed safety category to the delete step. Source code, Keychain data, and credential paths are excluded. It can also find and stop processes using local ports."}
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
                    ? "임의 경로를 바로 삭제하지 않습니다"
                    : "Rejecting arbitrary delete paths"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "정리 앱이 전달받은 파일 경로를 그대로 삭제하면 소스 코드까지 대상이 될 수 있습니다. 그래서 먼저 캐시와 빌드 산출물 패턴에 맞는 후보를 찾고, 사용자는 그 결과 안에서만 삭제할 항목을 고르게 했습니다."
                    : "A cleanup app that deletes any supplied path could remove source code as well. Zenith first finds candidates that match known cache and build-output patterns, and lets the user select only from those results."}
                </p>
              </div>

              <!-- Safety Model -->
              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "삭제 전에 후보와 안전 등급을 확인합니다"
                    : "Reviewing candidates before deletion"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "삭제 후보는 바로 지워도 되는 항목, 다시 생성할 수 있는 항목, 사용자가 직접 확인해야 하는 항목으로 나눴습니다. 삭제 전에는 어떤 항목이 선택됐는지 미리 볼 수 있습니다."
                    : "Candidates are grouped into items that are safe to remove, items that can be rebuilt, and items that require manual review. The user can inspect the selected items before deletion."}
                </p>
                <ul class="cs-bullet-list">
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "미리 정한 캐시와 빌드 산출물 패턴에 맞는 경로만 삭제 후보로 만듭니다."
                        : "Creates cleanup candidates only from registered build-artifact patterns."}
                    </span>
                  </li>
                  <li>
                    <Check size={14} class="check-accent" />
                    <span>
                      {lang === "ko"
                        ? "소스 코드, Keychain과 인증정보가 있는 경로는 삭제 후보에서 제외합니다."
                        : "Excludes source code, Keychain data, and credential paths from cleanup candidates."}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="cs-block">
                <h4 class="cs-heading">
                  {lang === "ko"
                    ? "정리 작업은 로컬에서 처리합니다"
                    : "Keeping cleanup data on the Mac"}
                </h4>
                <p class="cs-prose">
                  {lang === "ko"
                    ? "개발 도구 캐시와 Docker, 로컬 AI 자원을 한 화면에서 확인할 수 있으며, 스캔 결과와 정리 작업 정보는 외부로 보내지 않습니다."
                    : "Developer caches, Docker data, and local AI resources can be reviewed in one place. Scan results and cleanup information stay on the machine."}
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
