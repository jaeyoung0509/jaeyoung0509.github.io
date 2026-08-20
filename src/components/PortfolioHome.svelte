<script lang="ts">
  import { tick } from "svelte";
  import { slide } from "svelte/transition";
  import {
    ArrowUpRight,
    ArrowDown,
    Mail,
    MapPin,
    GitPullRequest,
    ChevronDown,
    Check,
    AlertCircle,
    CheckCircle2,
  } from "lucide-svelte";
  import MermaidHandler from "$components/MermaidHandler.svelte";
  import { siteConfig } from "$lib/site";

  let lang = $state<"en" | "ko">("en");
  let expandedWork = $state<Record<string, boolean>>({
    paymonths: false,
    moonberg: false,
    alembic_dump: false,
    zenith: false,
  });

  function disclosureDuration() {
    if (typeof window === "undefined") return 0;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 300;
  }

  async function toggleWork(slug: string) {
    const isOpening = !expandedWork[slug];
    expandedWork[slug] = isOpening;
    await tick();

    requestAnimationFrame(() => {
      const targetId = isOpening
        ? `work-details-${slug}`
        : `work-item-${slug}`;
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  const content = $derived({
    en: {
      hero: {
        role: "Software Engineer",
        location: "Seoul, South Korea",
        name: "Jaeyoung Lee",
        headline: "I enjoy understanding how systems work,\nbuilding practical tools, and learning from open source.",
        subheadline:
          "Backend engineer with 3.5+ years building payment, credit, contract, and settlement systems. Interested in reliable asynchronous systems, developer tooling, and understanding how things work beneath the abstraction.",
        ctaWork: "View Selected Work",
        ctaContact: "Contact",
        techStack: ["Python", "Go", "PostgreSQL", "AWS", "Rust"],
      },
      about: {
        title: "Turning manual and failure-prone workflows into reliable systems.",
        p1: "I enjoy taking manual, repetitive, or failure-prone problems in day-to-day engineering and turning them into reliable systems and practical developer tools.",
        p2: "When learning new technologies or solving tricky edge cases, I prefer digging into the underlying source code and tracing real execution paths rather than relying solely on high-level documentation. This habit naturally led to building tools like alembic-dump and Zenith, as well as contributing upstream to open-source projects like the Temporal Python SDK.",
        stats: [
          { num: "3.5+", label: "Years Building FinTech Systems" },
          { num: "Open Source", label: "Learning Through Source Code & Contributions" },
        ],
      },
      work: {
        title: "Selected work",
        subtitle:
          "Real-world engineering problems I encountered, and the technical decisions behind solving them.",
        expandCTA: "Details",
        collapseCTA: "Close",
        items: [
          {
            slug: "paymonths",
            number: "01",
            title: "PAYMONTHS",
            subtitle: "Designing financial workflows from payments to settlement",
            tagline:
              "B2B BNPL platform handling multi-step transactions across payments, e-contracts, and seller payouts.",
            domain: "B2B FinTech · Event-Driven",
            stack: [
              "Python",
              "AWS Lambda",
              "EventBridge",
              "SQS FIFO",
              "DynamoDB",
              "PostgreSQL",
            ],
            quickSummary: {
              problem: "Handling partial failures across external payment/bank APIs",
              solution: "Per-order SQS FIFO + Idempotency Keys + Transactional State Guards",
              impact: "Prevented duplicate processing and inconsistent payout state across retryable workflows",
            },
            context:
              "PAYMONTHS is a B2B BNPL service that processes financial events from buyer checkout to seller settlement across multiple external partners.",
            owned: [
              "Built asynchronous processing pipelines across payments, digital contracts, and merchant settlements.",
              "Implemented idempotency keys and retry mechanisms to handle intermittent third-party bank/PG failures.",
              "Improved observability by introducing correlation_id-based structured logging to trace issues in distributed environments.",
            ],
            problem: {
              headline:
                "Financial workflows frequently face Partial Failures where one step succeeds but subsequent steps fail.",
              subheadline: "How do you maintain reliable state across distributed external partners?",
              details:
                "If a payment charge succeeds but downstream digital contracting times out or settlement events drop, money is stranded in an indeterminate state requiring costly manual reconciliation.",
            },
            decisions: {
              considerations: [
                {
                  title: "Synchronous API Chaining",
                  desc: "Simple mental model, but downstream partner latency and timeouts cascade into checkout failures.",
                },
                {
                  title: "Message-Driven Asynchronous Processing",
                  desc: "Decouples service dependencies and allows safe retries without blocking client response paths.",
                },
              ],
              choice:
                "Decision: Applied SQS FIFO queues with per-order message grouping, backed by database-level idempotency keys and state transition guards inside transactional boundaries.",
            },
            architectureDiagram: `flowchart TD
    Client[Client / PG Webhook] -->|1. Submit Payment| API[Payment API Lambda]
    API -->|2. Persist PAID State| DB[(PostgreSQL)]
    API -->|3. Emit Event| EB[AWS EventBridge]
    
    EB -->|Rule: Order Paid| Q1[SQS FIFO: Contract Queue]
    EB -->|Rule: Order Paid| Q2[SQS FIFO: Settlement Queue]
    
    Q1 -->|Ordered by order_id| CWorker[Contract Service Lambda]
    CWorker -->|E-Signature API| ExtContract[External Contract Gateway]
    CWorker -->|Emit Contract Signed| EB
    
    Q2 -->|Ordered by order_id| SWorker[Settlement Service Lambda]
    SWorker -->|Bank Transfer API| ExtBank[Bank VAN / Payment Gateway]
    
    Q1 -.->|After 5 retries| DLQ1[Contract DLQ]
    Q2 -.->|After 5 retries| DLQ2[Settlement DLQ]`,
            failureModes: [
              {
                q: "What if payment webhooks arrive multiple times due to network retries?",
                a: "Every event carries a unique idempotency_key. The consumer validates unique constraints in a database transaction, safely ignoring duplicate deliveries without double-processing.",
              },
              {
                q: "What if external banking or contract APIs experience intermittent outages?",
                a: "The core payment state remains secured as PAYMENT_SUCCEEDED. Downstream tasks retry with exponential backoff in SQS and isolate to a DLQ if retries are exhausted.",
              },
            ],
            results: [
              "Operated reliably without payout discrepancies or duplicate settlement issues during production.",
              "Structured correlation_id logging significantly reduced incident triage time across asynchronous queues.",
              "Decoupled slow external partner API calls (3–5s) from user-facing checkout response paths.",
            ],
            learning:
              "Queue ordering alone does not guarantee correctness. In distributed systems, at-least-once delivery is the baseline; integrity must be guarded at the database state transition boundary.",
            differently:
              "While microservices provided fast early domain boundaries, if designing this today, I would start with a modular monolith and evaluate service extraction much more deliberately as domain complexity matures.",
          },
          {
            slug: "moonberg",
            number: "02",
            title: "MOONBERG",
            subtitle: "Asynchronous architecture for long-running data collection",
            tagline:
              "Coordinating multi-minute corporate financial filing extractions between Go API gateways and isolated Python workers.",
            domain: "Financial Data · Async Architecture",
            stack: ["Go", "Python", "PostgreSQL", "Vue", "Docker"],
            quickSummary: {
              problem: "Gateway timeouts and zombie job state on multi-minute extraction tasks",
              solution: "Go Coordinator + Isolated Python Workers + DB State Machine & Heartbeats",
              impact: "Decoupled long-running jobs from API request lifecycles with automatic failure recovery",
            },
            context:
              "Moonberg extracts, normalizes, and structures public corporate financial filings and market disclosures. A single collection job takes between 30 seconds and 10 minutes depending on document size and exchange rate limits.",
            owned: [
              "Designed asynchronous job dispatch splitting lightweight client coordination in Go from heavy HTML parsing in Python.",
              "Implemented a PostgreSQL-backed transactional job state machine using SELECT FOR UPDATE SKIP LOCKED.",
              "Built a heartbeat monitoring garbage collector to detect and recover aborted worker jobs automatically.",
            ],
            problem: {
              headline:
                "Long-running asynchronous jobs are difficult to track and recover when network rate limits or worker processes fail.",
              subheadline: "How do you prevent frozen UI screens and zombie database jobs?",
              details:
                "Financial filing sites enforce rate limiting and frequent HTML changes. Crashed worker processes left tasks stranded in 'RUNNING' status.",
            },
            decisions: {
              considerations: [
                {
                  title: "Synchronous HTTP with Long Timeout",
                  desc: "Simple, but gateway timeouts and network blips drop connections and discard all progress.",
                },
                {
                  title: "Go Coordinator + Python Worker Pool + DB State Machine + SSE",
                  desc: "Go manages concurrent SSE streams with minimal memory, while isolated Python workers execute scraping.",
                },
              ],
              choice:
                "Decision: High-concurrency Go API server streams progress, while isolated Python worker processes claim tasks using PostgreSQL SKIP LOCKED and report heartbeats.",
            },
            architectureDiagram: `flowchart TD
    User[Vue Frontend] -->|1. POST /jobs| GoAPI[Go API Coordinator]
    GoAPI -->|2. Create Job PENDING| DB[(PostgreSQL Jobs)]
    User -.->|SSE Progress Stream| GoAPI
    
    subgraph Worker Pool
        PyWorker1[Python Scraper Worker 1]
        PyWorker2[Python Scraper Worker 2]
    end
    
    DB -->|3. Claim: SKIP LOCKED| PyWorker1
    PyWorker1 -->|4. Update: RUNNING| DB
    PyWorker1 -->|5. Scrape & Parse| ExtSites[Financial Filing Sites]
    PyWorker1 -->|6. Heartbeat every 10s| DB
    PyWorker1 -->|7. Persist Result & COMPLETED| DB
    
    GoAPI -->|8. Sweep Dead Heartbeats to ABORTED| DB`,
            failureModes: [
              {
                q: "What if a scraping worker crashes halfway through a multi-minute job?",
                a: "Workers write heartbeats every 10s. A background garbage collector in Go detects jobs with no heartbeat for >30s, marks them ABORTED, and automatically re-queues them with exponential backoff.",
              },
            ],
            results: [
              "Eliminated gateway timeout disconnects and enabled smooth client reconnects without losing progress.",
              "Deduplicated identical concurrent scraping requests by caching active and completed job states.",
            ],
            learning:
              "Long-running tasks must treat worker crashes and client disconnections as normal baseline conditions, not rare edge cases.",
            differently:
              "Instead of building custom heartbeat and lock mechanics in PostgreSQL, I would evaluate dedicated workflow orchestration engines (such as Temporal or Redis Asynq in Go) to simplify lifecycle code.",
          },
          {
            slug: "alembic_dump",
            number: "03",
            title: "ALEMBIC-DUMP",
            subtitle: "Automating database migration verification into a CLI tool",
            tagline:
              "Turning error-prone manual staging checklists into a single, reproducible CLI command.",
            domain: "Developer Tooling · Open Source",
            stack: ["Python", "PostgreSQL", "Alembic", "AWS SSM", "CLI"],
            quickSummary: {
              problem: "Fragile, multi-step manual procedures for private VPC DB migration tests",
              solution: "Unified CLI automating SSM tunnels, schema dumps, and local dry-runs",
              impact: "Reduced staging migration verification from ~30 min to ~2 min",
            },
            context:
              "In production AWS environments, RDS PostgreSQL databases reside inside private VPC subnets. Before applying schema migrations, developers had to manually set up bastion tunnels, extract schema snapshots, sanitize data, and verify migrations locally.",
            owned: [
              "Built and open-sourced alembic-dump as a single CLI tool to replace fragile 10-step manual checklists.",
              "Automated AWS SSM Session Manager port-forwarding subprocess lifecycle and cleanup on SIGINT/SIGTERM.",
              "Standardized local schema dry-run procedures across the team to verify migration safety.",
            ],
            problem: {
              headline:
                "Manual database migration verification was tedious and prone to human error under deadline pressure.",
              subheadline: "How do you make the safest path also the easiest path?",
              details:
                "Manual SSH/SSM port forwarding, mismatched pg_dump parameters, and Alembic revision conflicts often led to broken migrations discovered only during deployment.",
            },
            decisions: {
              considerations: [
                {
                  title: "Static Wiki Checklist & Manual Procedures",
                  desc: "Zero upfront code, but high friction and easily skipped when engineers are in a rush.",
                },
                {
                  title: "Unified Python CLI Tool",
                  desc: "One command orchestrating SSM tunnels, sanitized schema dumps, and local container verification.",
                },
              ],
              choice:
                "Decision: Build and open-source a Python CLI (alembic-dump) that manages AWS SSM tunnels, runs pg_dump/pg_restore, and verifies Alembic revision heads against a local container.",
            },
            architectureDiagram: `flowchart LR
    Dev[Developer Machine] -->|alembic-dump sync| CLI[alembic-dump CLI]
    CLI -->|1. Start SSM Session| Bastion[AWS SSM Session Manager]
    Bastion -->|2. Private Port Forward| RDS[(AWS RDS PostgreSQL)]
    RDS -->|3. Extract Schema & Seed| CLI
    CLI -->|4. Boot & Restore| LocalDB[(Local Docker DB)]
    CLI -->|5. Run alembic upgrade head| LocalDB
    LocalDB -->|6. Report Schema Diff & Locks| Dev`,
            failureModes: [
              {
                q: "What if the SSM tunnel drops or the user cancels with Ctrl+C?",
                a: "The CLI registers signal handlers (SIGINT, SIGTERM) to terminate orphan tunnel processes and purge partial dump files, preventing port conflicts.",
              },
            ],
            results: [
              "Reduced migration pre-flight check time from ~30 minutes of manual steps to under 2 minutes.",
              "Eliminated revision head conflicts and table lock surprises during deployments.",
            ],
            learning:
              "Developer tooling is an extension of system reliability. Automating repetitive operational workflows removes human error at the source.",
            differently:
              "Extend beyond local CLI execution into a GitHub Actions CI bot that automatically spins up ephemeral database containers on pull requests and reports migration diffs.",
          },
          {
            slug: "zenith",
            number: "04",
            title: "ZENITH",
            subtitle: "A lightweight macOS utility for developers",
            tagline:
              "Rust + Svelte desktop application focused on safely cleaning development environments.",
            domain: "Developer Tooling · macOS",
            stack: ["Rust", "Tauri", "Svelte", "macOS"],
            quickSummary: {
              problem: "Safely identifying reclaimable developer build caches without touching user data",
              solution: "Rust Multi-Threaded Scanning Engine + Tauri & Svelte Native UI",
              impact: "Fast workspace cleanup backed by dry-run previews and safe Trash recovery",
            },
            context:
              "Developers accumulate gigabytes of hidden build artifacts (Cargo target/, node_modules, Docker unused caches) on macOS. The key engineering challenge is accurately identifying safe-to-delete artifacts while preventing any accidental data loss.",
            owned: [
              "Designed and developed the desktop app combining a high-performance Rust core with a modern Svelte UI via Tauri.",
              "Implemented multi-threaded parallel directory traversal in Rust to inspect heavy build caches quickly.",
              "Focused on preview-first and Trash-safe deletion experiences to guarantee deletion safety.",
            ],
            problem: {
              headline:
                "Development caches are deeply nested and dangerous to clean with naive recursive deletes.",
              subheadline: "How do you scan and safely reclaim gigabytes of development artifacts?",
              details:
                "Build artifacts spread across arbitrary folders. A deletion tool must provide deterministic pattern recognition, explicit dry-run previews, and safe recovery to protect uncommitted work.",
            },
            decisions: {
              considerations: [
                {
                  title: "Electron + Node.js Desktop App",
                  desc: "Familiar ecosystem, but heavy memory consumption and large binary size (>100MB).",
                },
                {
                  title: "Tauri (Rust) + Svelte",
                  desc: "Tiny binary footprint, fast native filesystem traversal in Rust, and reactive lightweight UI.",
                },
              ],
              choice:
                "Decision: Combine Rust multi-threaded scanning algorithms with Tauri's lightweight IPC and Svelte's reactive frontend to build an offline-first developer desktop tool.",
            },
            architectureDiagram: `flowchart LR
    UI[Svelte 5 UI] -->|Tauri IPC invoke| Core[Rust Core Engine]
    Core -->|Rayon Parallel Walk| FS[macOS File System]
    FS -->|Target / Cache Artifacts| Core
    Core -->|Calculated Sizes & Safety Check| UI
    UI -->|Confirm Clean| Core
    Core -->|Safe Trash / Reclaim| FS`,
            failureModes: [
              {
                q: "What if scanning a massive directory locks up the UI thread?",
                a: "Scanning runs on background Rust worker threads using rayon. Progress events are throttled and streamed over Tauri IPC, keeping the Svelte UI smooth.",
              },
              {
                q: "What if a user accidentally includes source files in a cleanup run?",
                a: "ZENITH matches strict known artifact signatures (e.g. target/, .venv, node_modules) and defaults to macOS Trash rather than permanent unrecoverable deletion.",
              },
            ],
            results: [
              "Lightweight distribution bundle with minimal idle memory usage (<30MB).",
              "Fast parallel scanning across deeply nested development directories in milliseconds.",
              "Safely reclaims tens of gigabytes of disk space per clean run with zero data loss accidents.",
            ],
            learning:
              "Developer tools must prioritize safety and predictability above all else—accidental data loss destroys user trust immediately.",
            differently:
              "Add a community plugin architecture to allow developers to define custom artifact cleaners via simple YAML or Lua manifests.",
          },
        ],
      },
      oss: {
        title: "Open source",
        subtitle:
          "I enjoy learning from open source projects, reading implementations, and contributing improvements when I find something useful.",
        contributionsTitle: "Core Contributions & Tooling",
        contributions: [
          {
            name: "Temporal Python SDK",
            subtitle: "OpenAI Agents Integration",
            prTitle: "PR #1741 — Clarify OpenAI Agents tool execution ↗",
            prUrl: "https://github.com/temporalio/sdk-python/pull/1741",
            desc: "While experimenting with Temporal's OpenAI Agents integration, I traced the SDK execution boundaries between Workflow-local and Activity-backed tools, contributing documentation clarifications upstream.",
            status: "Merged",
            statusType: "merged",
          },
          {
            name: "alembic-dump",
            subtitle: "Database Migration Automation CLI",
            prTitle: "GitHub Repository ↗",
            prUrl: "https://github.com/jaeyoung0509/alembic-dump",
            desc: "Open-source Python CLI tool automating AWS SSM Session Manager port-forwarding, database snapshot extraction, and local Alembic migration verification.",
            status: "Active · Published",
            statusType: "active",
          },
        ],
      },
      experience: {
        title: "Experience",
        items: [
          {
            company: "FinovusLab",
            role: "Software Engineer",
            period: "2022.04 – 2025.11",
            summary:
              "Built core payment, automated contract signing, credit evaluation, and merchant settlement backends for a B2B BNPL platform.",
            highlights: [
              "Scaled event-driven serverless architecture across 15+ microservices and 25+ asynchronous SQS FIFO queues on AWS.",
              "Implemented distributed idempotency keys and transactional outbox patterns across flaky third-party bank/PG APIs (0 financial loss or duplicate settlement errors).",
              "Unified structured logging with correlation IDs, reducing distributed incident triage time from hours to minutes.",
              "Created alembic-dump to automate private VPC database migration dry-runs, reducing staging check time from 30m to 2m.",
            ],
          },
        ],
      },
    },
    ko: {
      hero: {
        role: "소프트웨어 엔지니어",
        location: "대한민국 서울",
        name: "이재영 (Jaeyoung Lee)",
        headline: "시스템의 동작 원리를 이해하고,\n실용적인 도구를 만드는 과정을 즐깁니다.",
        subheadline:
          "결제, 신용평가, 전자계약, 정산 등 핀테크 코어 시스템을 3.5년 이상 설계·운영해 온 백엔드 엔지니어입니다. 신뢰성 있는 비동기 시스템과 개발자 도구, 그리고 추상화 아래의 동작 원리를 탐구하는 데 깊은 관심을 두고 있습니다.",
        ctaWork: "주요 엔지니어링 사례 보기",
        ctaContact: "문의하기",
        techStack: ["Python", "Go", "PostgreSQL", "AWS", "Rust"],
      },
      about: {
        title: "불안정하고 반복적인 문제를 신뢰할 수 있는 시스템과 도구로 바꿉니다.",
        p1: "업무에서 반복해서 마주치는 수동 절차나 실패하기 쉬운 불안정한 문제들을 그냥 두기보다, 신뢰할 수 있는 시스템과 작고 유용한 도구로 구조화하는 것을 좋아합니다.",
        p2: "새로운 기술을 배우거나 복잡한 버그를 해결할 때도 단순히 문서를 읽는 데 그치지 않고 실제 오픈소스 구현체와 런타임을 따라 내려가며 설계 의도를 파악하는 습관이 있습니다. 이러한 탐구는 자연스럽게 alembic-dump와 Zenith 같은 도구 제작과 Temporal Python SDK 기여로 이어졌습니다.",
        stats: [
          { num: "3.5+년", label: "핀테크 시스템 구축 및 운영" },
          { num: "오픈소스", label: "소스코드 분석과 기여를 통한 배움" },
        ],
      },
      work: {
        title: "주요 작업",
        subtitle:
          "실제 프로젝트에서 마주한 문제와, 해결 과정에서 고민했던 기술적 선택을 정리했습니다.",
        expandCTA: "자세히",
        collapseCTA: "접기",
        items: [
          {
            slug: "paymonths",
            number: "01",
            title: "PAYMONTHS",
            subtitle: "결제부터 정산까지 이어지는 금융 워크플로 설계",
            tagline:
              "결제부터 판매자 정산까지 여러 금융 단계를 안정적으로 처리하는 B2B BNPL 플랫폼",
            domain: "B2B 핀테크 · 이벤트 기반",
            stack: [
              "Python",
              "AWS Lambda",
              "EventBridge",
              "SQS FIFO",
              "DynamoDB",
              "PostgreSQL",
            ],
            quickSummary: {
              problem: "외부 PG/은행 API 실패 및 부분 성공(Partial Failure) 처리",
              solution: "주문별 SQS FIFO + DB 멱등성 키 + 트랜잭션 상태 전이 검증",
              impact: "재시도 상황에서도 정산 누락 및 중복 결제/지급 발생 방지",
            },
            context:
              "PAYMONTHS는 B2B BNPL 서비스로, 구매 기업의 결제부터 판매 기업의 정산까지 여러 금융 이벤트를 처리하는 플랫폼입니다.",
            owned: [
              "결제, 전자계약, 정산으로 이어지는 비동기 처리 흐름 개발",
              "외부 PG 및 은행 API 실패 상황을 고려한 멱등성 처리 및 재시도 구조 구현",
              "분산 환경에서 장애 원인 파악을 위한 correlation_id 기반 로깅 체계 개선",
            ],
            problem: {
              headline:
                "금융 거래에서는 일부 단계만 성공하는 Partial Failure 상황이 빈번하게 발생합니다.",
              subheadline: "결제 성공 이후 계약이나 정산 과정에서 실패했을 때 상태를 어떻게 관리할 것인가?",
              details:
                "결제 승인 후 전자계약 발급이나 판매자 정산 이벤트가 유실되면 자금 흐름과 법적 효력이 어긋나며 수작업 대사 비용이 급증합니다.",
            },
            decisions: {
              considerations: [
                {
                  title: "동기식 API 호출",
                  desc: "구현은 단순하지만 외부 파트너사 장애가 전체 결제 흐름으로 전파됨",
                },
                {
                  title: "메시지 기반 비동기 처리",
                  desc: "서비스 간 결합도를 낮추고 안전한 재시도 및 지연 처리가 가능",
                },
              ],
              choice:
                "결정: 주문별 SQS FIFO 큐와 DB 트랜잭션 내 멱등성 키, 상태 전이 검증 구조를 결합하여 적용했습니다.",
            },
            architectureDiagram: `flowchart TD
    Client[클라이언트 / 웹훅] -->|1. 결제 요청| API[Payment API Lambda]
    API -->|2. 상태 저장 PAID| DB[(PostgreSQL)]
    API -->|3. 결제 완료 이벤트| EB[AWS EventBridge]
    
    EB -->|규칙 라우팅| Q1[SQS FIFO: Contract Queue]
    EB -->|규칙 라우팅| Q2[SQS FIFO: Settlement Queue]
    
    Q1 -->|주문순서 보장| CWorker[Contract Lambda]
    CWorker -->|전자서명 API| ExtContract[외부 전자서명 서비스]
    CWorker -->|계약완료 이벤트| EB
    
    Q2 -->|정산 대기열| SWorker[Settlement Lambda]
    SWorker -->|정산 송금| ExtBank[은행 VAN / PG]
    
    Q1 -.->|5회 실패 시| DLQ1[Contract DLQ]
    Q2 -.->|5회 실패 시| DLQ2[Settlement DLQ]`,
            failureModes: [
              {
                q: "동일한 결제 완료 웹훅이나 이벤트가 네트워크 재시도로 중복 도착하면?",
                a: "모든 이벤트는 고유한 idempotency_key를 가집니다. 컨슈머는 DB 트랜잭션 내에서 유니크 인덱스를 검사하여 이미 처리된 건이면 즉시 정상 반환하고 중복 처리를 건너뜁니다.",
              },
              {
                q: "결제는 성공했으나 외부 전자계약 서비스나 은행 API가 일시 장애로 응답하지 않으면?",
                a: "메인 결제 상태는 PAYMENT_SUCCEEDED로 안전하게 보존됩니다. 하위 작업은 지수 백오프를 통해 SQS에서 재시도되며, 최대 재시도 초과 시 DLQ로 격리되어 데이터가 오염되지 않습니다.",
              },
            ],
            results: [
              "운영 기간 동안 정산 누락 및 이중 지급 문제 없이 안정적으로 운영",
              "주문별 correlation_id 구조화 로깅 체계로 비동기 큐 장애 추적 시간 단축",
              "느린 외부 연동(전자서명 3~5초, 은행 응답)을 사용자 결제 API 응답 경로에서 분리하여 응답 속도 최적화",
            ],
            learning:
              "큐의 순서 보장(FIFO)은 애플리케이션 수준의 멱등성을 대체할 수 없습니다. 분산 환경에서는 언제나 '적어도 한 번' 전달을 가정하고 데이터베이스 상태 전이 레벨에서 무결성을 방어해야 합니다.",
            differently:
              "당시에는 빠른 도메인 분리를 위해 MSA 구조를 선택했지만, 현재 다시 설계한다면 초기에는 모듈러 모놀리스로 시작하고 서비스 분리 시점을 더 신중하게 가져갈 것 같습니다.",
          },
          {
            slug: "moonberg",
            number: "02",
            title: "MOONBERG",
            subtitle: "장시간 실행되는 데이터 수집 작업 처리 구조",
            tagline:
              "Go API 코디네이터와 격리된 Python 워커 간의 수 분 소요 기업 공시 데이터 수집 작업 조율",
            domain: "금융 데이터 · 비동기 아키텍처",
            stack: ["Go", "Python", "PostgreSQL", "Vue", "Docker"],
            quickSummary: {
              problem: "수 분 소요되는 크롤링 작업의 타임아웃 및 워커 크래시 시 좀비 작업 발생",
              solution: "Go 코디네이터(SSE) + Python 워커 풀 + DB 상태 머신 & 하트비트 GC",
              impact: "API 요청 생명주기와 장기 실행 작업 분리 및 자동 복구 달성",
            },
            context:
              "Moonberg는 상장 기업의 공시 보고서와 재무제표를 수집하고 정규화하는 데이터 파이프라인 서비스입니다. 문서 크기와 거래소 레이트 리밋에 따라 작업 하나당 30초에서 10분이 소요됩니다.",
            owned: [
              "경량 클라이언트 조율(Go)과 무거운 파싱 작업(Python)을 분리한 비동기 작업 디스패치 구조 설계",
              "PostgreSQL SELECT FOR UPDATE SKIP LOCKED를 활용한 트랜잭션 기반 작업 상태 머신 구현",
              "워커 비정상 종료 시 중단된 작업을 자동 감지하고 복구하는 하트비트 가비지 컬렉터 구현",
            ],
            problem: {
              headline:
                "실행 시간이 긴 비동기 작업은 네트워크 순단이나 워커 비정상 종료 시 상태 관리가 어렵습니다.",
              subheadline: "화면 멈춤과 데이터베이스 좀비 작업을 어떻게 방지할 것인가?",
              details:
                "공시 사이트의 레이트 리밋과 메모리 스파이크로 워커가 강제 종료되면 작업이 'RUNNING' 상태로 영구 고착되는 문제를 방지해야 했습니다.",
            },
            decisions: {
              considerations: [
                {
                  title: "동기식 HTTP 타임아웃 연장",
                  desc: "구현은 단순하지만 게이트웨이 타임아웃 및 네트워크 순단 시 모든 작업 진행 내역이 유실됨",
                },
                {
                  title: "Go 코디네이터 + Python 워커 풀 + DB 상태 머신 + SSE",
                  desc: "Go는 최소 메모리로 동시 스트림을 관리하고, Python 워커는 무거운 파싱을 격리 실행",
                },
              ],
              choice:
                "결정: 동시성 처리에 뛰어난 Go API 서버가 클라이언트 요청과 SSE 진행률을 스트리밍하고, 격리된 Python 워커 풀이 PostgreSQL SKIP LOCKED로 작업을 획득하여 실행하는 구조를 채택했습니다.",
            },
            architectureDiagram: `flowchart TD
    User[Vue Frontend] -->|1. POST /jobs| GoAPI[Go API Coordinator]
    GoAPI -->|2. Create Job PENDING| DB[(PostgreSQL Jobs)]
    User -.->|SSE Progress Stream| GoAPI
    
    subgraph Worker Pool
        PyWorker1[Python Scraper Worker 1]
        PyWorker2[Python Scraper Worker 2]
    end
    
    DB -->|3. Claim: SKIP LOCKED| PyWorker1
    PyWorker1 -->|4. Update: RUNNING| DB
    PyWorker1 -->|5. Scrape & Parse| ExtSites[Financial Filing Sites]
    PyWorker1 -->|6. Heartbeat every 10s| DB
    PyWorker1 -->|7. Persist Result & COMPLETED| DB
    
    GoAPI -->|8. Sweep Dead Heartbeats to ABORTED| DB`,
            failureModes: [
              {
                q: "수 분 이상 소요되는 작업 도중 파싱 워커가 메모리 부족 등으로 크래시되면?",
                a: "워커는 10초마다 DB에 하트비트를 기록합니다. Go 코디네이터의 백그라운드 GC가 30초 이상 하트비트가 없는 작업을 감지하여 ABORTED로 변경하고 지수 백오프로 자동 재할당합니다.",
              },
            ],
            results: [
              "게이트웨이 타임아웃 끊김을 제거하고 클라이언트 재접속 시에도 이전 작업 결과를 즉시 복구",
              "동일 문서 중복 수집 요청을 캐싱 및 중복 제거하여 외부 시스템 부하 경감",
            ],
            learning:
              "장기 실행 작업은 워커 크래시와 클라이언트 연결 끊김을 예외가 아닌 정상적인 기준 조건으로 다루어야 합니다.",
            differently:
              "자체 하트비트와 DB 락 메커니즘 대신 검증된 워크플로 엔진(Temporal 등)을 도입하여 락 관리와 폴링 코드를 단순화했을 것입니다.",
          },
          {
            slug: "alembic_dump",
            number: "03",
            title: "ALEMBIC-DUMP",
            subtitle: "반복되는 DB 마이그레이션 검증 과정을 CLI 도구로 자동화",
            tagline:
              "실수를 유발하던 수동 검증 절차를 재현 가능한 단일 CLI 명령어로 자동화",
            domain: "개발자 도구 · 오픈소스",
            stack: ["Python", "PostgreSQL", "Alembic", "AWS SSM", "CLI"],
            quickSummary: {
              problem: "복잡하고 실수하기 쉬운 Private VPC DB 마이그레이션 수동 검증",
              solution: "SSM 터널링, 스키마 덤프, 로컬 도커 DB 테스트를 자동화한 통합 CLI",
              impact: "스테이징 마이그레이션 사전 검증 시간 30분 → 2분 단축",
            },
            context:
              "보안 규정에 따라 AWS RDS 데이터베이스는 인터넷에 연결되지 않는 Private VPC 서브넷에 위치합니다. 스키마 마이그레이션을 적용하기 전, 배스천 터널을 설정하고 스키마 덤프를 추출하여 로컬 도커 DB에서 사전 검증해야 했습니다.",
            owned: [
              "번거로운 수동 절차를 대체하는 단일 CLI 도구 alembic-dump 설계, 개발 및 오픈소스 배포",
              "AWS SSM 세션 매니저 포트포워딩 서브프로세스 생명주기 및 종료 시 자원 정리 자동화",
              "팀 내 로컬 스키마 드라이런 절차를 표준화하여 마이그레이션 안전성 확보",
            ],
            problem: {
              headline:
                "DB 마이그레이션 사전 검증 절차가 번거로워 마감 일정에 쫓길 때 검증을 건너뛰는 위험이 있었습니다.",
              subheadline: "가장 안전한 검증 절차를 가장 쉬운 방법으로 만들 수 없을까?",
              details:
                "수동 포트포워딩과 pg_dump 파라미터 불일치, Alembic 브랜치 충돌이 배포 시점에야 발견되는 문제를 해결해야 했습니다.",
            },
            decisions: {
              considerations: [
                {
                  title: "위키 문서 기반의 수동 체크리스트",
                  desc: "초기 개발 비용은 없으나 작업 피로도로 인해 체크리스트를 생략하여 인적 실수 발생",
                },
                {
                  title: "통합 Python CLI 도구 개발",
                  desc: "단 한 줄의 명령어로 SSM 터널링, 스키마 덤프, 로컬 도커 DB 기동 및 마이그레이션 검증 자동화",
                },
              ],
              choice:
                "결정: AWS SSM 세션 매니저 포트포워딩과 PostgreSQL pg_dump/pg_restore, Alembic 마이그레이션 검증을 자동으로 수행하는 Python CLI(alembic-dump)를 개발하여 오픈소스로 공개했습니다.",
            },
            architectureDiagram: `flowchart LR
    Dev[Developer Machine] -->|alembic-dump sync| CLI[alembic-dump CLI]
    CLI -->|1. Start SSM Session| Bastion[AWS SSM Session Manager]
    Bastion -->|2. Private Port Forward| RDS[(AWS RDS PostgreSQL)]
    RDS -->|3. Extract Schema & Seed| CLI
    CLI -->|4. Boot & Restore| LocalDB[(Local Docker DB)]
    CLI -->|5. Run alembic upgrade head| LocalDB
    LocalDB -->|6. Report Schema Diff & Locks| Dev`,
            failureModes: [
              {
                q: "덤프 도중 SSM 터널이 끊어지거나 사용자가 Ctrl+C로 중단하면?",
                a: "CLI는 시그널 핸들러(SIGINT, SIGTERM)를 통해 고아 프로세스와 임시 덤프 파일을 즉시 안전하게 정리하여 포트 충돌을 방지합니다.",
              },
            ],
            results: [
              "수동 절차로 30분가량 소요되던 사전 검증 시간을 2분 이내로 단축",
              "배포 시점의 Alembic 리비전 충돌 및 예기치 않은 테이블 락 사고 예방",
            ],
            learning:
              "개발자 도구는 시스템 신뢰성의 연장선입니다. 반복적인 운영 마찰을 자동화하면 인적 실수를 원천 차단할 수 있습니다.",
            differently:
              "로컬 CLI를 넘어 GitHub Actions CI 봇으로 확장하여 PR 생성 시 임시 DB 컨테이너에서 마이그레이션 락 분석 결과를 자동 코멘트하도록 발전시킬 것입니다.",
          },
          {
            slug: "zenith",
            number: "04",
            title: "ZENITH",
            subtitle: "개발 환경의 대용량 캐시를 안전하게 탐색하고 정리하는 유틸리티",
            tagline:
              "Rust와 Tauri를 활용하여 개발 환경의 대용량 빌드 캐시를 빠르고 안전하게 정리",
            domain: "개발자 도구 · macOS",
            stack: ["Rust", "Tauri", "Svelte", "macOS"],
            quickSummary: {
              problem: "사용자 데이터 손실 없이 대용량 개발 빌드 캐시를 안전하게 식별 및 정리",
              solution: "Rust 멀티스레드 병렬 탐색 엔진 + Tauri & Svelte 네이티브 UI",
              impact: "사전 프리뷰와 휴지통 안전 복구 기반의 빠른 로컬 개발 환경 정리",
            },
            context:
              "개발을 진행하다 보면 수십 기가바이트의 target, node_modules, Docker 캐시가 시스템에 쌓입니다. 핵심 엔지니어링 과제는 소스코드 유실 없이 안전하게 삭제 가능한 대상을 정확히 식별하고 검증하는 것입니다.",
            owned: [
              "Rust 기반 고성능 파일 탐색 엔진과 Tauri + Svelte UI 구조 설계 및 개발",
              "대용량 개발 캐시(target/, node_modules, Docker 등)를 안전하게 탐색하고 정리하는 워크플로 구현",
              "소스코드 유실 방지를 위한 사전 확인 및 휴지통 이동 중심의 안전한 삭제 경험 설계",
            ],
            problem: {
              headline:
                "개발 환경 캐시는 깊고 방대하여 단순 삭제 명령 시 중요한 소스코드 유실 위험이 있습니다.",
              subheadline: "수십 기가바이트의 개발 아티팩트를 어떻게 빠르고 안전하게 정리할 것인가?",
              details:
                "빌드 아티팩트는 디렉터리 곳곳에 흩어져 있습니다. 삭제 도구는 명확한 패턴 인식과 사전 드라이런 확인, 복구 가능한 삭제 경로를 제공해야 합니다.",
            },
            decisions: {
              considerations: [
                {
                  title: "Electron + Node.js 데스크톱 앱",
                  desc: "빠른 UI 프로토타이핑이 가능하지만 높은 메모리 점유율과 큰 바이너리 용량",
                },
                {
                  title: "Tauri (Rust) + Svelte",
                  desc: "초경량 바이너리, Rust 네이티브 I/O 속도, 반응성 높은 Svelte UI",
                },
              ],
              choice:
                "결정: Rust 멀티스레드 파일 탐색 알고리즘과 Tauri 경량 IPC, Svelte 반응형 프론트엔드를 결합하여 오프라인 고성능 개발자 데스크톱 앱을 구축했습니다.",
            },
            architectureDiagram: `flowchart LR
    UI[Svelte 5 UI] -->|Tauri IPC invoke| Core[Rust Core Engine]
    Core -->|Rayon 병렬 탐색| FS[macOS 파일 시스템]
    FS -->|빌드 아티팩트 목록| Core
    Core -->|용량 계산 및 안전 검사| UI
    UI -->|삭제 확인| Core
    Core -->|휴지통 이동 / 용량 확보| FS`,
            failureModes: [
              {
                q: "수십만 개의 대규모 디렉터리를 스캔할 때 UI 렌더링이 멈추면?",
                a: "스캔 작업은 rayon 백그라운드 워커 스레드에서 수행되며 진행률 이벤트는 스로틀링되어 전송되므로 Svelte UI가 매끄럽게 유지됩니다.",
              },
              {
                q: "사용자가 중요한 소스 코드를 실수로 삭제 대상에 포함하면?",
                a: "ZENITH는 명확한 빌드 아티팩트 서명만 매칭하며, 영구 삭제가 아닌 OS 휴지통으로 이동시켜 언제든 복구할 수 있도록 방어합니다.",
              },
            ],
            results: [
              "가벼운 번들 용량과 적은 메모리 사용량 유지 (<30MB)",
              "Rust 병렬 이터레이터로 깊은 개발 디렉터리를 수백 밀리초 만에 탐색",
              "사전 검사와 휴지통 이동을 통해 소스코드 유실 없이 안전하게 디스크 공간 확보",
            ],
            learning:
              "개발자 도구는 무엇보다 안전성과 예측 가능성이 최우선이어야 합니다. 작은 데이터 유실도 사용자의 신뢰를 완전히 무너뜨립니다.",
            differently:
              "커뮤니티가 간단한 YAML이나 Lua 스크립트로 사용자 정의 아티팩트 클리너를 정의할 수 있는 플러그인 아키텍처를 추가할 것입니다.",
          },
        ],
      },
      oss: {
        title: "오픈소스",
        subtitle:
          "오픈소스 코드를 읽으며 구현을 배우고, 유용한 개선점을 찾아 생태계에 기여하는 것을 좋아합니다.",
        contributionsTitle: "주요 오픈소스 기여 및 도구",
        contributions: [
          {
            name: "Temporal Python SDK",
            subtitle: "OpenAI Agents SDK 통합",
            prTitle: "PR #1741 — OpenAI Agents 도구 실행 경계 명확화 ↗",
            prUrl: "https://github.com/temporalio/sdk-python/pull/1741",
            desc: "Temporal과 OpenAI Agents 통합 시 Workflow(결정론적 로컬 도구)와 Activity(비결정론적 I/O 도구) 간의 실행 경계 모호성을 SDK 소스코드 분석을 통해 밝혀내고 공식 문서에 기여했습니다.",
            status: "Merged",
            statusType: "merged",
          },
          {
            name: "alembic-dump",
            subtitle: "데이터베이스 마이그레이션 자동화 CLI",
            prTitle: "GitHub 리포지토리 ↗",
            prUrl: "https://github.com/jaeyoung0509/alembic-dump",
            desc: "AWS SSM 터널링, 스키마 덤프 추출, 로컬 도커 DB 마이그레이션 사전 검증을 자동화하는 오픈소스 파이썬 CLI입니다.",
            status: "Active · PyPI / GitHub",
            statusType: "active",
          },
        ],
      },
      experience: {
        title: "경력",
        items: [
          {
            company: "FinovusLab",
            role: "소프트웨어 엔지니어",
            period: "2022.04 – 2025.11",
            summary:
              "B2B BNPL 핀테크 플랫폼에서 결제, 전자계약 체결, 신용평가, 정산 코어 백엔드 시스템 개발 및 운영",
            highlights: [
              "AWS Lambda, EventBridge, SQS FIFO 기반으로 15개 이상의 서비스와 25개 이상의 비동기 대기열 조율",
              "외부 PG사, 공인전자계약, 은행 API 장애에 대응하는 분산 멱등성 및 아웃박스 패턴 구현 (정산 사고 0건)",
              "주문별 correlation_id 구조화 로깅 체계 확립으로 분산 장애 추적 시간 단축",
              "Private VPC 데이터베이스 마이그레이션 도구(alembic-dump) 개발로 검증 시간 93% 단축",
            ],
          },
        ],
      },
    },
  });

  const c = $derived(content[lang]);
</script>

<svelte:head>
  <title>Jaeyoung Lee — Software Engineer</title>
  <meta
    name="description"
    content="Jaeyoung Lee · Software Engineer. I enjoy understanding how systems work, building practical tools, and learning from open source."
  />
  <meta property="og:title" content="Jaeyoung Lee — Software Engineer" />
  <meta
    property="og:description"
    content="Backend engineer with 3.5+ years building payment, credit, contract, and settlement systems. Interested in reliable asynchronous systems, developer tooling, and understanding how things work beneath the abstraction."
  />
  <meta property="og:image" content={`${siteConfig.url}/images/editorial-backend-desk.jpg`} />
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
          class:active={lang === "en"}
          onclick={() => (lang = "en")}
        >
          EN
        </button>
        <span class="lang-divider">/</span>
        <button
          type="button"
          class="lang-btn"
          class:active={lang === "ko"}
          onclick={() => (lang = "ko")}
        >
          KO
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
      <a href="mailto:ejaebbang@gmail.com" class="btn-hero-secondary">
        <Mail size={14} /> {c.hero.ctaContact}
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

  <!-- About Me Section -->
  <section class="portfolio-section" id="about">
    <div class="section-title-row">
      <h2 class="section-heading-large">{c.about.title}</h2>
    </div>

    <div class="about-split-layout">
      <div class="about-prose-col">
        <p class="about-lead-paragraph">{c.about.p1}</p>
        <p class="about-body-paragraph">{c.about.p2}</p>
      </div>

      <div class="about-highlights-col">
        {#each c.about.stats as stat (stat.label)}
          <div class="about-fact">
            <span class="stat-num">{stat.num}</span>
            <span class="stat-label">{stat.label}</span>
          </div>
        {/each}
      </div>
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
      {#each c.work.items as item (item.slug)}
        <article
          id={`work-item-${item.slug}`}
          class="work-item"
          class:is-expanded={expandedWork[item.slug]}
        >
          <div class="work-num-col">
            <span class="work-large-num">{item.number}</span>
          </div>

          <div class="work-main-col">
            <div class="work-meta-top">
              <span class="work-domain-badge">{item.domain}</span>
            </div>

            <h3 class="work-title">{item.title}</h3>
            <p class="work-subtitle">{item.subtitle}</p>
            <p class="work-tagline">{item.tagline}</p>

            <dl class="work-summary">
              <div class="summary-row">
                <dt>{lang === "ko" ? "문제" : "Problem"}</dt>
                <dd>{item.quickSummary.problem}</dd>
              </div>
              <div class="summary-row">
                <dt>{lang === "ko" ? "해결" : "Solution"}</dt>
                <dd>{item.quickSummary.solution}</dd>
              </div>
              <div class="summary-row">
                <dt>{lang === "ko" ? "결과" : "Result"}</dt>
                <dd>{item.quickSummary.impact}</dd>
              </div>
            </dl>

            <p class="work-stack-line" aria-label={lang === "ko" ? "기술 스택" : "Technology stack"}>
              {#each item.stack as tech, idx (tech)}
                <span>{tech}</span>{#if idx < item.stack.length - 1}<span aria-hidden="true"> / </span>{/if}
              {/each}
            </p>

            <!-- Expandable Technical Case Study Detail -->
            {#if expandedWork[item.slug]}
              <div
                id={`work-details-${item.slug}`}
                class="work-deep-dive-panel"
                transition:slide={{ duration: disclosureDuration() }}
              >
                <!-- Context & Focus -->
                <div class="dd-section">
                  <h4 class="dd-title">01 / Context & Focus</h4>
                  <p class="dd-text">{item.context}</p>
                  <ul class="dd-bullet-list">
                    {#each item.owned as owned, idx (idx)}
                      <li>
                        <Check size={14} class="check-accent" />
                        <span>{owned}</span>
                      </li>
                    {/each}
                  </ul>
                </div>

                <!-- Problem -->
                <div class="dd-section">
                  <h4 class="dd-title">02 / The Problem</h4>
                  <div class="dd-problem-banner">
                    <p class="dd-prob-lead">{item.problem.headline}</p>
                    {#if item.problem.subheadline}
                      <p class="dd-prob-punchline">{item.problem.subheadline}</p>
                    {/if}
                  </div>
                  <p class="dd-text">{item.problem.details}</p>
                </div>

                <!-- Technical Decisions -->
                <div class="dd-section">
                  <h4 class="dd-title">03 / Technical Decisions</h4>
                  <div class="dd-options-list">
                    {#each item.decisions.considerations as consideration (consideration.title)}
                      <div class="dd-option-card">
                        <div class="dd-opt-name">{consideration.title}</div>
                        <div class="dd-opt-desc">{consideration.desc}</div>
                      </div>
                    {/each}
                  </div>
                  <div class="dd-decision-banner">
                    <CheckCircle2 size={15} />
                    <span>{item.decisions.choice}</span>
                  </div>
                </div>

                <!-- Architecture Diagram -->
                {#if item.architectureDiagram}
                  <div class="dd-section">
                    <h4 class="dd-title">04 / Architecture</h4>
                    <figure class="mermaid-diagram" data-chart={item.architectureDiagram}>
                      <div class="mermaid-loading">Rendering architecture diagram...</div>
                    </figure>
                  </div>
                {/if}

                <!-- Handling Failures -->
                <div class="dd-section">
                  <h4 class="dd-title">05 / Handling Failures</h4>
                  <div class="dd-failure-list">
                    {#each item.failureModes as fm (fm.q)}
                      <div class="dd-failure-item">
                        <div class="dd-fail-q">
                          <AlertCircle size={15} />
                          <strong>{fm.q}</strong>
                        </div>
                        <p class="dd-fail-a">{fm.a}</p>
                      </div>
                    {/each}
                  </div>
                </div>

                <!-- Results & Retrospective -->
                <div class="dd-section">
                  <h4 class="dd-title">06 / Results & Retrospective</h4>
                  <ul class="dd-results-list">
                    {#each item.results as res, idx (idx)}
                      <li>
                        <span class="res-check">✓</span>
                        <span>{res}</span>
                      </li>
                    {/each}
                  </ul>
                  <div class="dd-learning-box">
                    <p><strong>Key Takeaway:</strong> {item.learning}</p>
                    <p class="dd-differently"><strong>Retrospective:</strong> {item.differently}</p>
                  </div>
                </div>
              </div>
            {/if}
          </div>

          <div class="work-action-col">
            <button
              type="button"
              class="work-toggle-btn"
              class:is-active={expandedWork[item.slug]}
              onclick={() => toggleWork(item.slug)}
              aria-expanded={expandedWork[item.slug]}
              aria-controls={`work-details-${item.slug}`}
              aria-label={expandedWork[item.slug] ? c.work.collapseCTA : c.work.expandCTA}
            >
              <span class="toggle-label">
                {#if expandedWork[item.slug]}
                  {c.work.collapseCTA}
                {:else}
                  {c.work.expandCTA}
                {/if}
              </span>
              <ChevronDown size={13} class="toggle-icon" />
            </button>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <!-- Section Divider -->
  <hr class="section-rule" />

  <!-- Open Source & Explorations -->
  <section class="portfolio-section">
    <div class="section-title-row">
      <h2 class="section-heading-large">{c.oss.title}</h2>
      <p class="section-heading-sub">{c.oss.subtitle}</p>
    </div>

    <!-- Core Contributions -->
    <div class="oss-subgroup">
      <h3 class="oss-group-heading">{c.oss.contributionsTitle}</h3>
      <div class="oss-list">
        {#each c.oss.contributions as item (item.name)}
          <article class="oss-entry">
            <div class="oss-card-top">
              <div>
                <h4 class="oss-card-name">{item.name}</h4>
                <p class="oss-card-sub">{item.subtitle}</p>
              </div>
              <span class="oss-status">
                {#if item.statusType === "merged"}<Check size={13} aria-hidden="true" />{/if}
                {item.status}
              </span>
            </div>

            <p class="oss-card-desc">{item.desc}</p>

            {#if item.prTitle && item.prUrl}
              <a
                href={item.prUrl}
                target="_blank"
                rel="noreferrer"
                class="oss-pr-link"
              >
                <GitPullRequest size={14} /> {item.prTitle}
              </a>
            {/if}
          </article>
        {/each}
      </div>
    </div>

  </section>

  <!-- Section Divider -->
  <hr class="section-rule" />

  <!-- Experience Summary -->
  <section class="portfolio-section">
    <div class="section-title-row">
      <h2 class="section-heading-large">{c.experience.title}</h2>
    </div>

    <div class="experience-list">
      {#each c.experience.items as exp (exp.company)}
        <article class="exp-entry">
          <div class="exp-header-row">
            <div>
              <h3 class="exp-company-name">{exp.company}</h3>
              <p class="exp-role-title">{exp.role}</p>
            </div>
            <span class="exp-period-tag">{exp.period}</span>
          </div>
          <p class="exp-summary-text">{exp.summary}</p>
          <ul class="exp-bullet-list">
            {#each exp.highlights as item (item)}
              <li>{item}</li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>
</div>

<MermaidHandler />
