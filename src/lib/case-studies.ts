export interface CaseStudyOption {
  name: string;
  title: string;
  pros: string[];
  cons: string[];
}

export interface CaseStudyFailureMode {
  scenario: string;
  solution: string;
}

export interface CaseStudyMetaItem {
  label: string;
  value: string;
}

export interface CaseStudyLink {
  label: string;
  href: string;
  isExternal?: boolean;
  isPrimary?: boolean;
}

export interface RelatedPost {
  title: string;
  href: string;
  description: string;
}

export interface CaseStudy {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  summary: string;
  meta: CaseStudyMetaItem[];
  stack: string[];
  signals: string[];
  links?: CaseStudyLink[];
  context: string[];
  whatIOwned: string[];
  problem: {
    headline: string;
    subheadline?: string;
    details: string[];
  };
  constraints: string[];
  options: CaseStudyOption[];
  decision: string;
  whyChosen: string[];
  architecture: {
    caption: string;
    isSimplified?: boolean;
    mermaidDiagram?: string;
  };
  failureModes: CaseStudyFailureMode[];
  results: string[];
  learnings: string[];
  differentlyToday: string[];
  relatedPosts?: RelatedPost[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "paymonths",
    number: "01",
    title: "PAYMONTHS",
    subtitle: "Reliable financial workflows at production scale",
    tagline: "15+ services · 25+ asynchronous queues · thousands of monthly state transitions",
    summary:
      "How I designed, operated, and evolved asynchronous payment, digital contract, and seller settlement workflows for a B2B Buy Now Pay Later (BNPL) platform on AWS.",
    meta: [
      { label: "ROLE", value: "Software Engineer" },
      { label: "DOMAIN", value: "FinTech (B2B BNPL)" },
      { label: "FOCUS", value: "Reliability · Asynchronous Workflows · Idempotency" },
      { label: "STACK", value: "Python / AWS Lambda / EventBridge / SQS FIFO / PostgreSQL / DynamoDB" },
      { label: "PERIOD", value: "2022.04 – 2025.11" },
    ],
    stack: [
      "Python",
      "AWS Lambda",
      "EventBridge",
      "SQS FIFO",
      "DynamoDB",
      "PostgreSQL",
    ],
    signals: [
      "Production Scale",
      "FinTech",
      "Event-Driven",
      "Reliability",
      "Architecture Trade-offs",
    ],
    links: [
      { label: "Live Service", href: "https://paymonths.com", isExternal: true },
    ],
    context: [
      "PAYMONTHS is a B2B BNPL (Buy Now Pay Later) fintech platform that allows corporate buyers to purchase goods on installment while paying suppliers immediately upon delivery.",
      "A single purchase order triggers an interconnected workflow spanning identity verification, credit limit assessment, legally binding electronic contract issuance, payment gateway (PG) execution, and scheduled bank settlement payouts.",
      "Starting from an early FastAPI monolithic prototype, the system evolved into an event-driven serverless architecture on AWS (Lambda, EventBridge, SQS FIFO, DynamoDB, PostgreSQL) to accommodate growing transaction volumes.",
    ],
    whatIOwned: [
      "Designed the end-to-end asynchronous backend architecture for payment processing, automated electronic contracting, and multi-phased seller settlement.",
      "Established distributed idempotency, retry backoffs, and dead letter queue (DLQ) operational policies across 25+ SQS queues and 15+ Lambda services.",
      "Unified logging and observability with standardized correlation IDs, cutting incident diagnosis time to minutes.",
      "Built internal developer tooling (alembic-dump) to automate private VPC database staging verification and schema migration safety.",
    ],
    problem: {
      headline: "Payment succeeds. Downstream contract signing or settlement processing fails.",
      subheadline: "What should the system do now?",
      details: [
        "In financial systems, partial success across distributed boundaries is far more dangerous than complete failure. If a buyer's payment gateway charge succeeds but the electronic seal API times out or the seller settlement event is dropped, money is stranded in an indeterminate state that demands costly manual reconciliation.",
        "External partner APIs—payment gateways, electronic signature services, and commercial bank VANs—frequently exhibit unpredictable latency (200ms to 15s) and transient HTTP 5xx errors.",
      ],
    },
    constraints: [
      "External partner API outages and latency spikes must not block user checkout responses or cascade into system-wide failures.",
      "Duplicate events and retried webhooks must never cause double payments or duplicate bank payouts.",
      "Sequential financial transitions (Payment Authorized → Contract Sealed → Settlement Scheduled) must strictly preserve order.",
      "A lean engineering team needed to operate the system reliably without maintaining heavy distributed cluster infrastructure (e.g. self-hosted Kafka/Zookeeper).",
      "Operators must be able to inspect the exact state of any transaction at any second using a single order ID.",
    ],
    options: [
      {
        name: "Option A",
        title: "Synchronous API Chaining (REST Calls across microservices)",
        pros: [
          "Straightforward mental model; immediate pass/fail feedback to client.",
        ],
        cons: [
          "Cascading timeouts: if service 4 of 5 fails, intermediate states are left dirty.",
          "High coupling: user checkout availability is directly hostage to third-party bank uptime.",
        ],
      },
      {
        name: "Option B",
        title: "Standard SQS + Application-Level Ordering",
        pros: [
          "Virtually unlimited message throughput and complete service decoupling.",
        ],
        cons: [
          "Out-of-order execution risk: settlement payouts could be processed before contract issuance.",
          "Requires complex application-level state machine polling and delayed retry logic in every consumer.",
        ],
      },
      {
        name: "Option C",
        title: "SQS FIFO + Application-Level Idempotency (Chosen)",
        pros: [
          "Guaranteed per-order ordering via MessageGroupId with built-in deduplication windows.",
          "Combines queue-level FIFO dispatch with strict database-level unique constraints and state transition guards.",
        ],
        cons: [
          "FIFO throughput limits (300~3,000 msg/s), though well above our B2B financial volume requirements.",
          "Queue FIFO alone cannot prevent duplicate network payloads; application-level idempotency remains mandatory.",
        ],
      },
    ],
    decision:
      "Decision: Option C — Partition asynchronous downstream pipelines using SQS FIFO keyed by order_id, backed by strict database-level idempotency keys and state transition guards inside transactional boundaries.",
    whyChosen: [
      "Ordering was non-negotiable for sequential financial transitions. A seller payout must never execute before the legally binding contract is electronically sealed.",
      "However, queue semantics alone do not guarantee correctness. If a Lambda consumer crashes right after committing to the database but before acknowledging the message, SQS will redeliver the message. We therefore designed for optimistic FIFO delivery combined with deterministic database-level unique index guards.",
    ],
    architecture: {
      caption: "PAYMONTHS Asynchronous Financial Workflow (Simplified architecture overview)",
      isSimplified: true,
      mermaidDiagram: `flowchart TD
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
    },
    failureModes: [
      {
        scenario: "What if the payment webhook arrives multiple times due to network retries?",
        solution:
          "Every event carries an idempotency_key derived from payment_transaction_id. The consumer runs inside a database transaction enforcing a unique constraint on (order_id, event_type, idempotency_key). If a record already exists, the transaction safely no-ops and returns 200 OK without double-charging or corrupting downstream queues.",
      },
      {
        scenario: "What if external e-signature or banking APIs fail after payment succeeds?",
        solution:
          "The core payment state remains secured as PAYMENT_SUCCEEDED. Downstream tasks retry with exponential backoff in SQS. If an external service remains down past maximum retries, the message moves to a DLQ without polluting or rolling back payment state.",
      },
      {
        scenario: "What if a consumer encounters an unrecoverable runtime exception?",
        solution:
          "After 5 failed attempts, SQS redrives the message to a Dead Letter Queue. CloudWatch Alarms immediately notify the on-call engineer with structured transaction metadata. Once the bug is patched, operators trigger controlled message replay.",
      },
    ],
    results: [
      "Zero financial discrepancies or duplicate payouts across thousands of monthly B2B transactions over 3+ years.",
      "Standardized correlation_id tracing across 15+ services, reducing incident triage time from hours to minutes.",
      "Decoupled slow external partner API calls (3–5s) from user-facing checkout response paths, ensuring snappy client responsiveness.",
    ],
    learnings: [
      "Queue ordering does not replace application-level idempotency. In distributed systems, at-least-once delivery is the only realistic baseline; correctness must live at the database state transition boundary.",
      "Asynchronous systems require observability as a first-class citizen. Without structured correlation IDs, debugging multi-queue failures across microservices is impossible.",
      "More service boundaries reduce code coupling while increasing operational coupling. Every new service boundary adds network failure modes, queue maintenance, and deployment coordination.",
    ],
    differentlyToday: [
      "Start with fewer service boundaries: Rather than splitting into 15+ fine-grained Lambda microservices early, I would use a modular monolith or coarse-grained services, reducing distributed transaction overhead.",
      "Evaluate durable execution (e.g. Temporal) for long-running stateful workflows: Instead of stringing together dozens of SQS queues, EventBridge rules, and custom state tables to manage multi-day business processes, durable execution orchestrators keep the entire state machine in readable, deterministic code.",
      "Standardize correlation IDs and tracing headers from Day 1: Retrofitting tracing across dozens of async queues is far more painful than baking open-telemetry standards into the shared base runtime from the start.",
    ],
  },
  {
    slug: "moonberg",
    number: "02",
    title: "MOONBERG",
    subtitle: "Long-running jobs with Go and Python",
    tagline: "Fault-tolerant asynchronous job coordination for multi-minute, failure-prone data collection.",
    summary:
      "Architecture case study on building a resilient data extraction platform coordinating long-running scraping tasks between Go API gateways and isolated Python workers.",
    meta: [
      { label: "ROLE", value: "Backend Engineer / Product Owner" },
      { label: "DOMAIN", value: "Financial Data Extraction & Analysis" },
      { label: "FOCUS", value: "Long-Running Jobs · Async Workers · Heartbeats" },
      { label: "STACK", value: "Go / Python / PostgreSQL / Vue / Docker" },
      { label: "PERIOD", value: "2023 – 2024" },
    ],
    stack: ["Go", "Python", "PostgreSQL", "Vue", "Docker"],
    signals: [
      "Go Backend",
      "Async Workers",
      "Job State Machine",
      "Retry & Backoff",
      "Product Ownership",
    ],
    links: [
      { label: "Service Link", href: "https://moonberg.co.kr/", isExternal: true },
    ],
    context: [
      "Moonberg aggregates, normalizes, and structures unstructured corporate financial filings and market disclosures from public financial exchanges.",
      "Depending on report size, document complexity, and exchange rate limits, a single collection job takes between 30 seconds and 10 minutes.",
      "Because standard HTTP gateway timeouts drop connections after 30 seconds, the system required an asynchronous job dispatch, state machine, and real-time streaming architecture.",
    ],
    whatIOwned: [
      "Designed the asynchronous job dispatch architecture splitting lightweight client coordination in Go from heavy HTML parsing in Python.",
      "Implemented a PostgreSQL-backed transactional job state machine using SELECT FOR UPDATE SKIP LOCKED to prevent double-processing without standalone queue clusters.",
      "Built a heartbeat monitoring garbage collector to detect and recover aborted worker jobs automatically.",
    ],
    problem: {
      headline: "Data collection jobs run for minutes and fail halfway through execution.",
      subheadline: "How do you prevent frozen UI screens and zombie database jobs?",
      details: [
        "External financial filing websites enforce aggressive rate limiting, CAPTCHAs, and frequent HTML structural changes.",
        "When worker processes crashed from memory spikes or network timeouts, jobs were left permanently stranded in 'RUNNING' status.",
      ],
    },
    constraints: [
      "Jobs exceeding 30-second gateway timeouts must be handled seamlessly without losing client connection state.",
      "Worker crashes and network failures must automatically trigger state recovery without leaving orphaned jobs.",
      "Users must be able to close the browser, navigate away, and recover full job results upon reconnection.",
    ],
    options: [
      {
        name: "Option A",
        title: "Synchronous HTTP with Extended Timeout",
        pros: ["Simplest possible implementation."],
        cons: [
          "Gateway and browser timeout drops; network blips discard all partial scraping work.",
        ],
      },
      {
        name: "Option B",
        title: "Single-Process In-Memory Task Queue",
        pros: ["No external database locking or messaging protocols needed."],
        cons: [
          "Server restarts wipe queued jobs; heavy memory consumption from Python scraping degrades API gateway latency.",
        ],
      },
      {
        name: "Option C",
        title: "Go Coordinator + Python Scraping Worker + DB State Machine + SSE (Chosen)",
        pros: [
          "Go manages concurrent client connections and SSE progress streams with minimal memory.",
          "Python workers run in isolated processes leveraging mature parsing libraries.",
          "PostgreSQL provides durable state persistence and concurrency safety.",
        ],
        cons: [
          "Requires explicit worker heartbeat protocols and inter-process communication contracts.",
        ],
      },
    ],
    decision:
      "Decision: Option C — A high-concurrency Go API server receives client requests and streams progress, while isolated Python worker processes claim tasks using PostgreSQL SELECT FOR UPDATE SKIP LOCKED and report heartbeats.",
    whyChosen: [
      "Separating API gateway coordination from resource-heavy scraping processes ensures the frontend remains responsive even during heavy parsing workloads.",
      "Using PostgreSQL's SKIP LOCKED eliminated the operational complexity of managing separate Redis or RabbitMQ instances while guaranteeing atomic job assignment.",
    ],
    architecture: {
      caption: "Moonberg Long-Running Job Architecture",
      mermaidDiagram: `flowchart TD
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
    },
    failureModes: [
      {
        scenario: "What if a scraping worker crashes halfway through a 5-minute job?",
        solution:
          "Workers write heartbeats to the database every 10 seconds. A background garbage collector in the Go coordinator detects jobs with no heartbeat for >30 seconds, marks them as ABORTED, and automatically re-queues them with exponential backoff (up to 3 retries).",
      },
      {
        scenario: "What if multiple users trigger the same filing report simultaneously?",
        solution:
          "Incoming requests generate a content hash key from (ticker, filing_date, report_type). If an identical job is already PENDING or RUNNING, the coordinator binds the new user to the existing job ID rather than spawning duplicate scraping workers.",
      },
      {
        scenario: "What if the user disconnects or refreshes the page while a job is running?",
        solution:
          "The job continues execution independently on the server. When the user reconnects, the frontend queries by job ID and immediately receives the live progress or completed structured filing data.",
      },
    ],
    results: [
      "Reduced job timeout failures to 0%, achieving a 99.2% overall long-running task success rate.",
      "Eliminated duplicate scraping requests by 40% through request deduplication and result caching.",
      "Maintained low memory footprint on API gateways by isolating memory-heavy browser and parsing engines.",
    ],
    learnings: [
      "Long-running tasks must treat worker crashes and client disconnections as normal baseline conditions, not rare edge cases.",
      "Decoupling API gateway lifecycle from background worker lifecycles is the most effective way to preserve web responsiveness under heavy compute loads.",
    ],
    differentlyToday: [
      "Instead of building custom heartbeat and queue mechanics in PostgreSQL, I would adopt a dedicated workflow orchestration engine (such as Temporal or Redis-backed Asynq in Go) to eliminate custom polling and lock management code.",
    ],
  },
  {
    slug: "alembic-dump",
    number: "03",
    title: "ALEMBIC-DUMP",
    subtitle: "Turning repeated migration problems into tooling",
    tagline: "Reproducible CLI workflow replacing error-prone manual DB migration checklists.",
    summary:
      "How I built an open-source Python CLI tool automating AWS SSM bastion port-forwarding, database snapshot extraction, and local Alembic migration verification.",
    meta: [
      { label: "TYPE", value: "Open Source / Developer Tooling" },
      { label: "REPOSITORY", value: "jaeyoung0509/alembic-dump" },
      { label: "STATUS", value: "Active · Published" },
      { label: "FOCUS", value: "Database Migration · Automation · Operational Safety" },
      { label: "STACK", value: "Python / PostgreSQL / Alembic / AWS SSM" },
      { label: "PERIOD", value: "2023 – Present" },
    ],
    stack: ["Python", "PostgreSQL", "Alembic", "AWS SSM", "CLI"],
    signals: [
      "Developer Tooling",
      "Automation",
      "PostgreSQL",
      "Operational Experience",
      "Safety First",
    ],
    links: [
      {
        label: "GitHub Repository ↗",
        href: "https://github.com/jaeyoung0509/alembic-dump",
        isExternal: true,
        isPrimary: true,
      },
    ],
    context: [
      "In our production AWS environment, RDS PostgreSQL databases reside inside private VPC subnets with no public internet access for security compliance.",
      "Before applying schema migrations via Alembic, developers had to manually set up bastion tunnels, extract schema snapshots, sanitize sensitive production data, spin up local Docker databases, and verify migrations.",
    ],
    whatIOwned: [
      "Created, architected, and open-sourced alembic-dump as a single CLI tool to replace fragile 10-step manual checklists.",
      "Automated AWS SSM Session Manager port-forwarding subprocess lifecycle and cleanup on SIGINT/SIGTERM.",
      "Standardized local schema dry-run procedures across the engineering team, preventing table lock accidents.",
    ],
    problem: {
      headline: "Database migration verification took 10+ manual checklist steps and 30 minutes.",
      subheadline: "Engineers skipped testing under deadline pressure, risking production lockouts.",
      details: [
        "Manual SSH/SSM port forwarding, mismatched pg_dump parameters, and Alembic revision head conflicts frequently led to broken migrations discovered only during deployment.",
        "Direct manual database dumping risked leaking un-sanitized customer PII onto developer workstations.",
      ],
    },
    constraints: [
      "Must adhere strictly to AWS security policies: access private subnet RDS solely through AWS SSM Session Manager.",
      "Must isolate schema definitions from customer PII before saving local dump files.",
      "Must work across macOS and Linux with zero external dependencies beyond standard Python and Docker CLI.",
    ],
    options: [
      {
        name: "Option A",
        title: "Static Wiki Checklist & Manual Procedures",
        pros: ["Zero upfront engineering time."],
        cons: [
          "Documentation quickly goes stale; developers skip steps under time pressure; human error is inevitable.",
        ],
      },
      {
        name: "Option B",
        title: "Shared Bash Scripts (.sh)",
        pros: ["Quick to write for one environment."],
        cons: [
          "Brittle cross-platform compatibility; poor signal handling and zombie SSH tunnels on unexpected termination.",
        ],
      },
      {
        name: "Option C",
        title: "Unified Python CLI Tool with Automated SSM Port-Forwarding (Chosen)",
        pros: [
          "One command (alembic-dump) handles SSM session setup, sanitized dump extraction, local Docker DB seeding, and migration testing.",
          "Guaranteed subprocess cleanup and temporary file deletion on exit.",
        ],
        cons: [
          "Required upfront CLI architecture, packaging, and open-source release effort.",
        ],
      },
    ],
    decision:
      "Decision: Option C — Build and open-source a Python CLI (alembic-dump) that orchestrates AWS SSM session manager port-forwarding, runs PostgreSQL pg_dump/pg_restore, and validates Alembic revision heads against a local container.",
    whyChosen: [
      "When operational friction is high, developers take shortcuts. The only reliable way to enforce database safety is to make the safest path the easiest path.",
    ],
    architecture: {
      caption: "alembic-dump Automated Migration Workflow",
      mermaidDiagram: `flowchart LR
    Dev[Developer Machine] -->|alembic-dump sync| CLI[alembic-dump CLI]
    CLI -->|1. Start SSM Session| Bastion[AWS SSM Session Manager]
    Bastion -->|2. Private Port Forward| RDS[(AWS RDS PostgreSQL)]
    RDS -->|3. Extract Schema & Seed| CLI
    CLI -->|4. Boot & Restore| LocalDB[(Local Docker DB)]
    CLI -->|5. Run alembic upgrade head| LocalDB
    LocalDB -->|6. Report Schema Diff & Locks| Dev`,
    },
    failureModes: [
      {
        scenario: "What if the SSM tunnel drops or times out mid-dump?",
        solution:
          "The CLI monitors subprocess health and registers exit signal handlers (SIGINT, SIGTERM) to terminate orphan tunnel processes and purge partial dump files, preventing port conflicts.",
      },
      {
        scenario: "What if a migration script contains harmful table locks or broken SQL syntax?",
        solution:
          "The migration executes locally against the exact schema structure in Docker first, surfacing lock contention and syntax errors before the code is merged or deployed.",
      },
    ],
    results: [
      "Reduced migration pre-flight verification time from 30 minutes to under 2 minutes (93% reduction).",
      "Zero production deployment rollbacks caused by Alembic revision head conflicts since adoption.",
      "Simplified onboarding for new engineers by eliminating complex multi-step database tunneling guides.",
    ],
    learnings: [
      "Developer tooling is an extension of system reliability. Automating repetitive operational workflows removes human error at the source.",
      "A great CLI is 90% error handling, clean process lifecycle management, and clear terminal feedback.",
    ],
    differentlyToday: [
      "Extend beyond local CLI execution into a GitHub Actions CI bot that automatically spins up ephemeral database containers on pull requests and comments with migration diffs and lock analysis.",
    ],
  },
  {
    slug: "zenith",
    number: "04",
    title: "ZENITH",
    subtitle: "A lightweight macOS utility for developers",
    tagline: "Rust + Svelte desktop application focused on cleaning development environments.",
    summary:
      "Built from personal frustration with expensive system cleanup tools, focusing on performance, privacy, and developer experience.",
    meta: [
      { label: "TYPE", value: "Desktop Application / Developer Tooling" },
      { label: "TARGET", value: "macOS (Apple Silicon & Intel)" },
      { label: "FOCUS", value: "Performance · Privacy · Developer Experience" },
      { label: "STACK", value: "Rust / Tauri / Svelte / TypeScript" },
      { label: "PERIOD", value: "2024 – Present" },
    ],
    stack: ["Rust", "Tauri", "Svelte", "TypeScript", "macOS"],
    signals: [
      "Developer Tooling",
      "Rust & Tauri",
      "Svelte",
      "Native Desktop",
      "Privacy First",
    ],
    context: [
      "Developers accumulate gigabytes of hidden build artifacts, Docker daemon caches, node_modules directories, and package manager residue on macOS.",
      "Commercial cleanup utilities are often bloated, demand expensive recurring subscriptions, and collect telemetry.",
      "ZENITH was designed as an ultra-fast, offline-first native tool that scans and cleans development workspaces in milliseconds.",
    ],
    whatIOwned: [
      "Designed and developed the complete desktop application combining a high-performance Rust backend with a modern Svelte UI via Tauri.",
      "Implemented multi-threaded parallel directory scanning algorithms in Rust to traverse massive file trees without freezing the UI.",
      "Designed a clean, keyboard-friendly UI focused on developer productivity and safety.",
    ],
    problem: {
      headline: "Existing system cleaners are bloated, subscription-heavy, and ignore developer artifacts.",
      subheadline: "How do you scan and safely reclaim tens of gigabytes of build cache in seconds?",
      details: [
        "Traditional cleaning utilities target browser cookies and system caches, completely missing development artifacts like Target dirs, Gradle caches, or Docker unused volumes.",
        "Electron-based desktop tools consume excessive memory (>300MB idle) and launch slowly.",
      ],
    },
    constraints: [
      "Must remain extremely lightweight with near-zero idle memory footprint (<30MB).",
      "Must guarantee safe file deletions with explicit confirmation and safety dry-runs.",
      "Must operate completely offline with zero telemetry or tracking.",
    ],
    options: [
      {
        name: "Option A",
        title: "Electron + Node.js Desktop App",
        pros: ["Familiar web ecosystem and rapid UI prototyping."],
        cons: ["Bloated binary size (>100MB) and high memory/CPU usage."],
      },
      {
        name: "Option B",
        title: "Pure CLI Tool (Rust / Go)",
        pros: ["Lightweight and simple to maintain."],
        cons: ["Lacks visual disk usage graphs and interactive selective inspection."],
      },
      {
        name: "Option C",
        title: "Tauri (Rust) + Svelte (Chosen)",
        pros: [
          "Tiny binary footprint (<10MB), ultra-fast native filesystem scanning in Rust, and reactive Svelte UI.",
          "OS-native webview with near-zero memory footprint.",
        ],
        cons: ["Requires bridging async commands between Rust IPC and frontend state."],
      },
    ],
    decision:
      "Decision: Option C — Combine Rust multi-threaded scanning algorithms with Tauri's lightweight IPC and Svelte's reactive frontend to build an offline-first, high-performance developer desktop tool.",
    whyChosen: [
      "Scanning hundreds of thousands of files in deeply nested node_modules or Cargo target folders requires native file I/O speed.",
      "Tauri leverages macOS WebKit, keeping the final application binary tiny and memory consumption under 30MB.",
    ],
    architecture: {
      caption: "ZENITH Architecture (Tauri + Rust + Svelte)",
      mermaidDiagram: `flowchart LR
    UI[Svelte 5 UI] -->|Tauri IPC invoke| Core[Rust Core Engine]
    Core -->|Rayon Parallel Walk| FS[macOS File System]
    FS -->|Target / Cache Artifacts| Core
    Core -->|Calculated Sizes & Safety Check| UI
    UI -->|Confirm Clean| Core
    Core -->|Safe Trash / Reclaim| FS`,
    },
    failureModes: [
      {
        scenario: "What if scanning a massive directory locks up the UI thread?",
        solution:
          "Scanning runs on background Rust worker threads using rayon. Progress events are throttled and streamed over Tauri IPC, keeping the Svelte UI responsive at 60 FPS.",
      },
      {
        scenario: "What if a user accidentally deletes uncommitted source code?",
        solution:
          "ZENITH identifies known artifact patterns (e.g. target/, .venv, node_modules) and defaults to macOS Trash rather than permanent unrecoverable deletion.",
      },
    ],
    results: [
      "Under 10MB distribution bundle and <30MB idle RAM usage.",
      "Scans 100,000+ files in under 300ms using multi-threaded parallel Rust iterators.",
      "Reclaims an average of 20~50GB of disk space on developer machines safely.",
    ],
    learnings: [
      "Tauri and Rust offer a compelling alternative to Electron for desktop developer utilities where performance and binary size matter.",
      "Developer tools must prioritize safety and predictability above all else—accidental data loss destroys user trust immediately.",
    ],
    differentlyToday: [
      "Add a plugin architecture to allow the community to define custom artifact cleaners via simple YAML or Lua manifests.",
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
