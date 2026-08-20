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
          "Backend engineer with 3.5+ years building payment, credit, contract, and settlement systems. I turn failure-prone workflows into reliable services and practical developer tools.",
        ctaWork: "View Selected Work",
        ctaContact: "Contact",
        techStack: ["Python", "Go", "PostgreSQL", "AWS", "Rust"],
      },
      about: {
        title: "Turning manual and failure-prone workflows into reliable systems.",
        p1: "The problems I keep returning to are practical ones: a payment retry that can duplicate a payout, a data-collection job that outlives its request, or a migration check people skip because it takes too long.",
        p2: "I like tracing those failures through the implementation—not just the API surface—and turning the repeated fix into a tool or a clearer system boundary. That led to work on alembic-dump, Zenith, and an upstream Temporal Python SDK contribution.",
      },
      work: {
        title: "Selected work",
        subtitle:
          "Systems I built, the failure modes they had to handle, and what I would change now.",
        expandCTA: "Details",
        collapseCTA: "Close",
        items: [
          {
            slug: "paymonths",
            number: "01",
            title: "PAYMONTHS",
            subtitle: "Designing financial workflows from payments to settlement",
            tagline:
              "10+ event-driven serverless services supporting payment, contract, and settlement workflows.",
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
              solution: "SQS FIFO + Idempotency Keys + Transactional State Guards",
              impact: "Safe retries without duplicate processing or inconsistent payout state",
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
              "Financial filing collection jobs that can take minutes, coordinated by a Go API and Python workers.",
            domain: "Financial Data · Async Architecture",
            stack: ["Go", "Python", "PostgreSQL", "Vue", "Docker"],
            quickSummary: {
              problem: "Multi-minute Bloomberg collection jobs outlive HTTP requests",
              solution: "Go API + PostgreSQL Queue (PGMQ) + Python Bloomberg Workers + Persistent Job State",
              impact: "Durable job tracking outside the HTTP request lifecycle",
            },
            context:
              "Moonberg is a financial workflow used by an accounting firm to collect, normalize, and structure Bloomberg data. A single collection job can take minutes, so it runs outside the HTTP request lifecycle.",
            owned: [
              "Designed asynchronous job dispatch between a Go API and isolated Python Bloomberg workers.",
              "Implemented persistent job states (queued → dispatched → running → succeeded/failed) backed by PostgreSQL and PGMQ.",
              "Kept collection results available after the original request ended so the workflow could be resumed and reviewed later.",
            ],
            problem: {
              headline:
                "Bloomberg data collection could take minutes and depended on isolated local workers.",
              subheadline: "How do you keep long-running extraction out of the HTTP request lifecycle?",
              details:
                "The API needed to acknowledge work before collection finished, while PostgreSQL and PGMQ kept the job state and result connected across the worker boundary.",
            },
            decisions: {
              considerations: [
                {
                  title: "Synchronous HTTP with Long Timeout",
                  desc: "Simple, but gateway timeouts and network blips drop connections and discard all progress.",
                },
                {
                  title: "Go API + PostgreSQL Queue + Python Bloomberg Workers",
                  desc: "PGMQ retains queued work and persistent job state while Python workers handle long-running collection outside the API process.",
                },
              ],
              choice:
                "Decision: Go API + PostgreSQL Queue (PGMQ) + Python Bloomberg Workers + Persistent Job State.",
            },
            architectureDiagram: `flowchart TD
    User[Client] -->|1. POST /jobs| GoAPI[Go API]
    GoAPI -->|2. Create queued job| DB[(PostgreSQL + PGMQ)]
    GoAPI -->|3. Return job ID| User
    DB -->|4. Claim queued job| Worker[Python Bloomberg Worker]
    Worker -->|5. Collect & normalize data| Bloomberg[Bloomberg Data Source]
    Worker -->|6. Persist result and state| DB
    User -.->|7. Read job state/result| GoAPI
    GoAPI -->|8. Query persistent state| DB`,
            failureModes: [
              {
                q: "What if the HTTP request ends before a collection job finishes?",
                a: "The job remains in PostgreSQL and PGMQ with its current state. A later request can look up the job ID and read the persisted result instead of starting the collection again.",
              },
            ],
            results: [
              "Eliminated gateway timeout disconnects and enabled smooth client reconnects without losing progress.",
              "Deduplicated identical concurrent scraping requests by caching active and completed job states.",
            ],
            learning:
              "Long-running tasks must treat worker crashes and client disconnections as normal baseline conditions, not rare edge cases.",
            differently:
              "I would evaluate a dedicated workflow engine if the lifecycle grows beyond the needs of a durable PostgreSQL queue and explicit job state.",
          },
          {
            slug: "alembic_dump",
            number: "03",
            title: "ALEMBIC-DUMP",
            subtitle: "Making database migration testing reproducible",
            tagline:
              "Python tooling for schema synchronization, database dump/load, and safe data masking.",
            domain: "Developer Tooling · Open Source",
            stack: ["Python", "PostgreSQL", "Alembic", "SSH", "Data Masking"],
            quickSummary: {
              problem: "Reproducing a migration-safe database state across environments",
              solution: "Alembic sync + dump/load + masking + SSH tunneling",
              impact: "Made migration and data-reproduction steps repeatable",
            },
            context:
              "Migration verification required reproducing a representative database locally without exposing customer data. alembic-dump grew from that internal workflow into an open-source Python library for schema synchronization, dump/load, and data masking.",
            owned: [
              "Built and open-sourced alembic-dump as a Python library for repeatable database migration and data workflows.",
              "Implemented Alembic revision alignment together with database dump and load operations.",
              "Added chunked data masking and remote access through SSH tunneling, with support for secret backends such as AWS Secrets Manager and Vault.",
            ],
            problem: {
              headline:
                "Migration checks required a safe, repeatable database snapshot.",
              subheadline: "How do you reproduce schema and data without copying sensitive records into local environments?",
              details:
                "Private network access, inconsistent dump steps, and unmasked data made local verification slow and risky.",
            },
            decisions: {
              considerations: [
                {
                  title: "Static Wiki Checklist & Manual Procedures",
                  desc: "Zero upfront code, but high friction and easily skipped when engineers are in a rush.",
                },
                {
                  title: "Reusable Python Library",
                  desc: "One library coordinating Alembic synchronization, dump/load, masking, and secure remote access.",
                },
              ],
              choice:
                "Decision: Build and open-source a Python library that combines Alembic synchronization, database dump/load, masking, and secure remote access into a repeatable workflow.",
            },
            architectureDiagram: `flowchart LR
    Dev[Developer or CI] -->|Use library| Lib[alembic-dump Python library]
    Secrets[AWS Secrets Manager / Vault] --> Lib
    Lib -->|SSH tunnel| RemoteDB[(Remote PostgreSQL)]
    RemoteDB -->|Dump / load| Lib
    Lib -->|Chunked masking| SafeData[Sanitized data]
    Lib -->|Alembic revision sync| LocalDB[(Local PostgreSQL)]
    SafeData --> LocalDB`,
            failureModes: [
              {
                q: "What if sensitive records enter a local dump?",
                a: "Data is masked while it is being transferred and processed in chunks, so the local database can reproduce the shape of the source without carrying the original sensitive values.",
              },
            ],
            results: [
              "Reduced the internal migration pre-flight workflow from roughly 30 minutes to under 2 minutes.",
              "Turned schema synchronization, database dump/load, and masking into reusable open-source building blocks.",
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
              solution: "Rust scanning core + Tauri/Svelte desktop UI",
              impact: "Fast workspace cleanup backed by dry-run previews and safe Trash recovery",
            },
            context:
              "Developers accumulate gigabytes of hidden build artifacts (Cargo target/, node_modules, Docker unused caches) on macOS. The key engineering challenge is accurately identifying safe-to-delete artifacts while preventing any accidental data loss.",
            owned: [
              "Designed and developed the desktop app combining a high-performance Rust core with a modern Svelte UI via Tauri.",
              "Moved scan execution to a background worker so large directory walks do not block the UI.",
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
                "Decision: Combine a Rust scanning core with Tauri's lightweight IPC and Svelte's reactive frontend to build an offline-first developer desktop tool.",
            },
            architectureDiagram: `flowchart LR
    UI[Svelte 5 UI] -->|Tauri IPC invoke| Core[Rust Core Engine]
    Core -->|spawn_blocking background worker| FS[macOS File System]
    FS -->|Target / Cache Artifacts| Core
    Core -->|Calculated Sizes & Safety Check| UI
    UI -->|Confirm Clean| Core
    Core -->|Safe Trash / Reclaim| FS`,
            failureModes: [
              {
                q: "What if scanning a massive directory locks up the UI thread?",
                a: "Scanning runs outside the UI thread in a background worker, while progress events are throttled and streamed over Tauri IPC to keep the Svelte UI responsive.",
              },
              {
                q: "What if a user accidentally includes source files in a cleanup run?",
                a: "ZENITH matches strict known artifact signatures (e.g. target/, .venv, node_modules) and defaults to macOS Trash rather than permanent unrecoverable deletion.",
              },
            ],
            results: [
              "Lightweight distribution bundle with minimal idle memory usage (<30MB).",
              "Fast scanning across deeply nested development directories without blocking the UI.",
              "Safely reclaims disk space with preview-first checks and Trash-based recovery.",
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
          "Reading implementations, then contributing where the behavior needs to be clearer.",
        contributionsTitle: "Contributions & tools",
        contributions: [
          {
            name: "Temporal Python SDK",
            subtitle: "OpenAI Agents Integration",
            prTitle: "PR #1741 — Tool docs ↗",
            prUrl: "https://github.com/temporalio/sdk-python/pull/1741",
            desc: "While experimenting with Temporal's OpenAI Agents integration, I traced the SDK execution boundaries between Workflow-local and Activity-backed tools, contributing documentation clarifications upstream.",
            status: "Merged",
            statusType: "merged",
          },
          {
            name: "Genkit Go",
            subtitle: "Ollama plugin · Docs and Ollama Cloud",
            links: [
              {
                label: "Issue #3748 — Ollama docs ↗",
                href: "https://github.com/genkit-ai/genkit/issues/3748",
              },
              {
                label: "PR #3813 — Ollama Cloud ↗",
                href: "https://github.com/genkit-ai/genkit/pull/3813",
              },
            ],
            desc: "Reported a broken Go Ollama documentation example caused by outdated DefineModel and ai.ModelInfo usage, then opened a compat_oai/ollamacloud plugin for Ollama Cloud's OpenAI-compatible API with model capability mapping, docs, and tests.",
            status: "1 issue closed · 1 PR open",
            statusType: "active",
          },
          {
            name: "Python Chalice",
            subtitle: "AWS Lambda · SnapStart support",
            prTitle: "Issue #2147 — SnapStart ↗",
            prUrl: "https://github.com/aws/chalice/issues/2147",
            desc: "Asked whether Chalice plans native AWS Lambda SnapStart support, since the deploy command and .chalice/config.json did not expose a configuration option.",
            status: "Open · Issue",
            statusType: "active",
          },
          {
            name: "alembic-dump",
            subtitle: "Database Migration Automation CLI",
            prTitle: "GitHub Repository ↗",
            prUrl: "https://github.com/jaeyoung0509/alembic-dump",
            desc: "Open-source Python library for Alembic synchronization, database dump/load, data masking, and SSH-based remote access.",
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
              "Built and operated 10+ event-driven serverless services across payment, credit, contract, and settlement workflows on AWS.",
              "Designed idempotent processing and transactional state guards around retryable bank and payment-provider integrations.",
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
          "결제, 신용평가, 전자계약, 정산 등 핀테크 코어 시스템을 3.5년 이상 설계·운영해 왔습니다. 실패하기 쉬운 업무 흐름을 신뢰할 수 있는 서비스와 실용적인 개발자 도구로 바꾸는 일에 관심이 있습니다.",
        ctaWork: "주요 엔지니어링 사례 보기",
        ctaContact: "문의하기",
        techStack: ["Python", "Go", "PostgreSQL", "AWS", "Rust"],
      },
        about: {
          title: "불안정하고 반복적인 문제를 신뢰할 수 있는 시스템과 도구로 바꿉니다.",
          p1: "제가 반복해서 다루는 문제는 꽤 실무적입니다. 재시도로 정산이 중복될 수 있는 결제, 요청보다 오래 걸리는 데이터 수집, 번거로워서 건너뛰기 쉬운 마이그레이션 검증 같은 문제입니다.",
          p2: "이런 실패를 API 표면에서 멈추지 않고 실제 구현까지 따라가 원인을 확인한 뒤, 반복되는 해결책을 도구나 명확한 시스템 경계로 바꾸는 편입니다. 그 과정에서 alembic-dump, Zenith, Temporal Python SDK 기여로 이어졌습니다.",
      },
        work: {
          title: "주요 작업",
          subtitle:
            "실제 운영과 제작 과정에서 만난 문제, 선택한 구조, 그리고 지금 다시 만든다면 바꿀 점을 정리했습니다.",
        expandCTA: "자세히",
        collapseCTA: "접기",
        items: [
          {
            slug: "paymonths",
            number: "01",
            title: "PAYMONTHS",
            subtitle: "결제부터 정산까지 이어지는 금융 워크플로 설계",
            tagline:
              "결제, 전자계약, 정산 워크플로를 지원하는 10개 이상의 이벤트 기반 서버리스 서비스",
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
              solution: "SQS FIFO + DB 멱등성 키 + 트랜잭션 상태 전이 검증",
              impact: "재시도 상황에서도 중복 처리와 일관성 없는 정산 상태 방지",
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
              "수 분이 걸릴 수 있는 재무 데이터 수집 작업을 Go API와 Python 워커로 조율",
            domain: "금융 데이터 · 비동기 아키텍처",
            stack: ["Go", "Python", "PostgreSQL", "Vue", "Docker"],
            quickSummary: {
              problem: "HTTP 요청보다 오래 걸리는 Bloomberg 데이터 수집 작업",
              solution: "Go API + PostgreSQL Queue(PGMQ) + Python Bloomberg 워커 + 영속 작업 상태",
              impact: "HTTP 요청 생명주기와 분리된 작업 추적",
            },
            context:
              "Moonberg는 회계법인 업무에 사용되는 재무 데이터 워크플로로, Bloomberg 데이터를 수집하고 정규화합니다. 작업 하나가 수 분 걸릴 수 있어 HTTP 요청과 분리된 방식으로 실행됩니다.",
            owned: [
              "Go API와 격리된 Python Bloomberg 워커 사이의 비동기 작업 디스패치 구조 설계",
              "PostgreSQL과 PGMQ를 기반으로 queued → dispatched → running → succeeded/failed 작업 상태를 영속화",
              "원래 요청이 끝난 뒤에도 작업 결과를 조회하고 이어서 확인할 수 있도록 결과 저장 흐름 구성",
            ],
            problem: {
              headline:
                "Bloomberg 데이터 수집은 수 분이 걸릴 수 있고 격리된 로컬 워커에 의존합니다.",
              subheadline: "장시간 수집 작업을 HTTP 요청 생명주기에서 어떻게 분리할 것인가?",
              details:
                "수집이 끝나기 전에 API가 요청을 먼저 응답해야 했고, 워커 경계를 넘은 뒤에도 PostgreSQL과 PGMQ가 작업 상태와 결과를 이어주어야 했습니다.",
            },
            decisions: {
              considerations: [
                {
                  title: "동기식 HTTP 타임아웃 연장",
                  desc: "구현은 단순하지만 게이트웨이 타임아웃 및 네트워크 순단 시 모든 작업 진행 내역이 유실됨",
                },
                {
                  title: "Go API + PostgreSQL Queue + Python Bloomberg 워커",
                  desc: "PGMQ가 대기 작업과 영속 상태를 보관하고, Python 워커가 API 프로세스와 분리된 장시간 수집을 수행",
                },
              ],
              choice:
                "결정: Go API + PostgreSQL Queue(PGMQ) + Python Bloomberg 워커 + 영속 작업 상태 구조를 채택했습니다.",
            },
            architectureDiagram: `flowchart TD
    User[클라이언트] -->|1. 작업 요청| GoAPI[Go API]
    GoAPI -->|2. queued 작업 생성| DB[(PostgreSQL + PGMQ)]
    GoAPI -->|3. 작업 ID 반환| User
    DB -->|4. 대기 작업 획득| Worker[Python Bloomberg 워커]
    Worker -->|5. 데이터 수집 및 정규화| Bloomberg[Bloomberg 데이터 소스]
    Worker -->|6. 결과 및 상태 저장| DB
    User -.->|7. 작업 상태 및 결과 조회| GoAPI
    GoAPI -->|8. 영속 상태 조회| DB`,
            failureModes: [
              {
                q: "수집이 끝나기 전에 HTTP 요청이 종료되면?",
                a: "작업은 현재 상태와 함께 PostgreSQL 및 PGMQ에 남습니다. 이후 작업 ID로 조회하면 수집을 다시 시작하지 않고 저장된 결과를 확인할 수 있습니다.",
              },
            ],
            results: [
              "게이트웨이 타임아웃 끊김을 제거하고 클라이언트 재접속 시에도 이전 작업 결과를 즉시 복구",
              "동일 문서 중복 수집 요청을 캐싱 및 중복 제거하여 외부 시스템 부하 경감",
            ],
            learning:
              "장기 실행 작업은 워커 크래시와 클라이언트 연결 끊김을 예외가 아닌 정상적인 기준 조건으로 다루어야 합니다.",
            differently:
              "작업 생명주기가 영속 PostgreSQL 큐와 명시적인 상태 관리 범위를 넘어선다면 전용 워크플로 엔진 도입을 검토했을 것입니다.",
          },
          {
            slug: "alembic_dump",
            number: "03",
            title: "ALEMBIC-DUMP",
            subtitle: "DB 마이그레이션 테스트를 재현 가능한 과정으로 만들기",
            tagline:
              "스키마 동기화, 데이터베이스 dump/load, 안전한 데이터 마스킹을 위한 Python 도구",
            domain: "개발자 도구 · 오픈소스",
            stack: ["Python", "PostgreSQL", "Alembic", "SSH", "Data Masking"],
            quickSummary: {
              problem: "환경마다 달라지는 마이그레이션용 데이터베이스 상태 재현",
              solution: "Alembic 동기화 + dump/load + 마스킹 + SSH 터널링",
              impact: "마이그레이션 및 데이터 재현 절차 표준화",
            },
            context:
              "마이그레이션을 검증하려면 고객 데이터를 노출하지 않으면서 대표적인 데이터베이스 상태를 로컬에서 재현해야 했습니다. alembic-dump는 이 내부 업무에서 출발해 스키마 동기화, dump/load, 데이터 마스킹을 제공하는 오픈소스 Python 라이브러리로 확장되었습니다.",
            owned: [
              "반복 가능한 데이터베이스 마이그레이션 및 데이터 워크플로를 위한 Python 라이브러리 alembic-dump 개발 및 오픈소스 공개",
              "Alembic 리비전 정렬과 데이터베이스 dump/load 작업 구현",
              "AWS Secrets Manager와 Vault 같은 시크릿 백엔드 및 SSH 터널링, 청크 단위 데이터 마스킹 지원",
            ],
            problem: {
              headline:
                "마이그레이션 검증에는 안전하고 반복 가능한 데이터베이스 스냅샷이 필요했습니다.",
              subheadline: "민감한 원본 데이터를 로컬로 복사하지 않고 스키마와 데이터를 어떻게 재현할 것인가?",
              details:
                "Private 네트워크 접근, 매번 달라지는 dump 절차, 마스킹되지 않은 데이터가 로컬 검증을 느리고 위험하게 만들었습니다.",
            },
            decisions: {
              considerations: [
                {
                  title: "위키 문서 기반의 수동 체크리스트",
                  desc: "초기 개발 비용은 없으나 작업 피로도로 인해 체크리스트를 생략하여 인적 실수 발생",
                },
                {
                  title: "재사용 가능한 Python 라이브러리",
                  desc: "Alembic 동기화, dump/load, 마스킹, 안전한 원격 접근을 하나의 라이브러리로 조율",
                },
              ],
              choice:
                "결정: Alembic 동기화, 데이터베이스 dump/load, 마스킹, 안전한 원격 접근을 반복 가능한 Python 라이브러리로 묶어 오픈소스로 공개했습니다.",
            },
            architectureDiagram: `flowchart LR
    Dev[개발자 또는 CI] -->|라이브러리 사용| Lib[alembic-dump Python library]
    Secrets[AWS Secrets Manager / Vault] --> Lib
    Lib -->|SSH 터널| RemoteDB[(원격 PostgreSQL)]
    RemoteDB -->|Dump / load| Lib
    Lib -->|청크 단위 마스킹| SafeData[마스킹된 데이터]
    Lib -->|Alembic 리비전 동기화| LocalDB[(로컬 PostgreSQL)]
    SafeData --> LocalDB`,
            failureModes: [
              {
                q: "민감한 원본 데이터가 로컬 dump에 들어가면?",
                a: "데이터를 전송·처리하는 과정에서 청크 단위로 마스킹하여 로컬 데이터베이스에는 원본 값이 아닌 구조만 재현되도록 합니다.",
              },
            ],
            results: [
              "내부 마이그레이션 사전 검증 절차를 약 30분에서 2분 이내로 단축",
              "스키마 동기화, 데이터베이스 dump/load, 마스킹을 재사용 가능한 오픈소스 구성요소로 정리",
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
              solution: "Rust scanning core + Tauri/Svelte 데스크톱 UI",
              impact: "사전 프리뷰와 휴지통 안전 복구 기반의 빠른 로컬 개발 환경 정리",
            },
            context:
              "개발을 진행하다 보면 수십 기가바이트의 target, node_modules, Docker 캐시가 시스템에 쌓입니다. 핵심 엔지니어링 과제는 소스코드 유실 없이 안전하게 삭제 가능한 대상을 정확히 식별하고 검증하는 것입니다.",
            owned: [
              "Rust 기반 고성능 파일 탐색 엔진과 Tauri + Svelte UI 구조 설계 및 개발",
              "UI를 막지 않도록 백그라운드 워커에서 대용량 개발 캐시(target/, node_modules, Docker 등)를 탐색하는 워크플로 구현",
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
                "결정: Rust scanning core와 Tauri 경량 IPC, Svelte 반응형 프론트엔드를 결합하여 오프라인 개발자 데스크톱 앱을 구축했습니다.",
            },
            architectureDiagram: `flowchart LR
    UI[Svelte 5 UI] -->|Tauri IPC invoke| Core[Rust Core Engine]
    Core -->|spawn_blocking 백그라운드 워커| FS[macOS 파일 시스템]
    FS -->|빌드 아티팩트 목록| Core
    Core -->|용량 계산 및 안전 검사| UI
    UI -->|삭제 확인| Core
    Core -->|휴지통 이동 / 용량 확보| FS`,
            failureModes: [
              {
                q: "수십만 개의 대규모 디렉터리를 스캔할 때 UI 렌더링이 멈추면?",
                a: "스캔 작업은 UI 스레드 밖의 백그라운드 워커에서 수행하고, 진행률 이벤트는 Tauri IPC로 스로틀링해 전송하여 Svelte UI의 반응성을 유지합니다.",
              },
              {
                q: "사용자가 중요한 소스 코드를 실수로 삭제 대상에 포함하면?",
                a: "ZENITH는 명확한 빌드 아티팩트 서명만 매칭하며, 영구 삭제가 아닌 OS 휴지통으로 이동시켜 언제든 복구할 수 있도록 방어합니다.",
              },
            ],
            results: [
              "가벼운 번들 용량과 적은 메모리 사용량 유지 (<30MB)",
              "UI를 막지 않으면서 깊은 개발 디렉터리를 빠르게 탐색",
              "사전 검사와 휴지통 이동을 통해 복구 가능한 디스크 정리 경험 제공",
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
          "구현을 따라가며 이해한 내용을 문서와 도구로 다시 남깁니다.",
        contributionsTitle: "기여 및 도구",
        contributions: [
          {
            name: "Temporal Python SDK",
            subtitle: "OpenAI Agents SDK 통합",
            prTitle: "PR #1741 — 실행 경계 문서 ↗",
            prUrl: "https://github.com/temporalio/sdk-python/pull/1741",
            desc: "Temporal과 OpenAI Agents 통합 시 Workflow(결정론적 로컬 도구)와 Activity(비결정론적 I/O 도구) 간의 실행 경계 모호성을 SDK 소스코드 분석을 통해 밝혀내고 공식 문서에 기여했습니다.",
            status: "Merged",
            statusType: "merged",
          },
          {
            name: "Genkit Go",
            subtitle: "Ollama 플러그인 · 문서 및 Ollama Cloud",
            links: [
              {
                label: "Issue #3748 — Ollama 문서 ↗",
                href: "https://github.com/genkit-ai/genkit/issues/3748",
              },
              {
                label: "PR #3813 — Ollama Cloud ↗",
                href: "https://github.com/genkit-ai/genkit/pull/3813",
              },
            ],
            desc: "오래된 DefineModel과 ai.ModelInfo 사용으로 컴파일되지 않던 Go Ollama 문서 예제를 제보하고, Ollama Cloud의 OpenAI 호환 API를 사용하는 compat_oai/ollamacloud 플러그인과 모델 기능 분류·문서·테스트를 추가했습니다.",
            status: "이슈 1건 종료 · PR 1건 진행 중",
            statusType: "active",
          },
          {
            name: "Python Chalice",
            subtitle: "AWS Lambda · SnapStart 지원 논의",
            prTitle: "Issue #2147 — SnapStart ↗",
            prUrl: "https://github.com/aws/chalice/issues/2147",
            desc: "Chalice의 deploy 명령과 .chalice/config.json에 설정 옵션이 없어 AWS Lambda SnapStart를 공식 지원할 계획이 있는지 문의했습니다.",
            status: "Open · Issue",
            statusType: "active",
          },
          {
            name: "alembic-dump",
            subtitle: "데이터베이스 마이그레이션 및 데이터 도구",
            prTitle: "GitHub 리포지토리 ↗",
            prUrl: "https://github.com/jaeyoung0509/alembic-dump",
            desc: "Alembic 동기화, 데이터베이스 dump/load, 데이터 마스킹, SSH 기반 원격 접근을 제공하는 오픈소스 Python 라이브러리입니다.",
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
              "AWS에서 결제, 신용평가, 전자계약, 정산 워크플로를 지원하는 10개 이상의 이벤트 기반 서버리스 서비스 개발 및 운영",
              "재시도 가능한 외부 PG·은행 연동에 멱등성 처리와 트랜잭션 상태 전이 검증을 적용",
              "주문별 correlation_id 구조화 로깅 체계 확립으로 분산 장애 추적 시간 단축",
              "Private VPC 데이터베이스 마이그레이션 도구(alembic-dump) 개발로 검증 시간을 30분에서 2분으로 단축",
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
    content="Jaeyoung Lee · Software Engineer. I turn failure-prone workflows into reliable services and practical developer tools."
  />
  <meta property="og:title" content="Jaeyoung Lee — Software Engineer" />
  <meta
    property="og:description"
    content="Backend engineer with 3.5+ years building payment, credit, contract, and settlement systems. I turn failure-prone workflows into reliable services and practical developer tools."
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

  <!-- Open Source -->
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
            {:else if item.prTitle && item.prUrl}
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
