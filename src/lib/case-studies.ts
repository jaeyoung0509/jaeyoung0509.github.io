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
    tagline: "10+ event-driven serverless services · idempotent financial workflows",
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
      "Established idempotency, retry backoffs, and dead letter queue (DLQ) operational policies across asynchronous payment and settlement workflows.",
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
    
    Q1 -.->|Retries exhausted| DLQ1[Contract DLQ]
    Q2 -.->|Retries exhausted| DLQ2[Settlement DLQ]`,
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
          "The persisted payment state remains intact. Downstream tasks retry with exponential backoff in SQS. If an external service remains down after retries are exhausted, the message moves to a DLQ without rolling back the payment state.",
      },
      {
        scenario: "What if a consumer encounters an unrecoverable runtime exception?",
        solution:
          "When retries are exhausted, SQS redrives the message to a Dead Letter Queue. CloudWatch Alarms notify the on-call engineer with structured transaction metadata. Once the bug is patched, operators trigger controlled message replay.",
      },
    ],
    results: [
      "Handled retries and downstream failures without duplicate payout issues reported during the production period.",
      "Standardized correlation_id tracing across asynchronous services, reducing incident triage time from hours to minutes.",
      "Decoupled slow external partner API calls (3–5s) from user-facing checkout response paths, ensuring snappy client responsiveness.",
    ],
    learnings: [
      "Queue ordering does not replace application-level idempotency. In distributed systems, at-least-once delivery is the only realistic baseline; correctness must live at the database state transition boundary.",
      "Asynchronous systems require observability as a first-class citizen. Without structured correlation IDs, debugging multi-queue failures across microservices is impossible.",
      "More service boundaries reduce code coupling while increasing operational coupling. Every new service boundary adds network failure modes, queue maintenance, and deployment coordination.",
    ],
    differentlyToday: [
      "Start with fewer service boundaries: I would use a modular monolith or coarse-grained services first, reducing distributed transaction overhead while the domain model is still forming.",
      "Evaluate durable execution (e.g. Temporal) for long-running stateful workflows: Instead of stringing together dozens of SQS queues, EventBridge rules, and custom state tables to manage multi-day business processes, durable execution orchestrators keep the entire state machine in readable, deterministic code.",
      "Standardize correlation IDs and tracing headers from Day 1: Retrofitting tracing across dozens of async queues is far more painful than baking open-telemetry standards into the shared base runtime from the start.",
    ],
  },
  {
    slug: "moonberg",
    number: "02",
    title: "MOONBERG",
    subtitle: "Long-running Bloomberg data collection with Go and Python",
    tagline: "A durable queue and job-state workflow for multi-minute financial data collection.",
    summary:
      "Architecture case study on coordinating Bloomberg data collection between a Go API, PostgreSQL/PGMQ, and isolated Python workers for a financial workflow used by an accounting firm.",
    meta: [
      { label: "ROLE", value: "Backend Engineer / Product Owner" },
      { label: "DOMAIN", value: "Financial Data Extraction & Analysis" },
      { label: "FOCUS", value: "Long-Running Jobs · Durable Queue · Job State" },
      { label: "STACK", value: "Go / Python / PostgreSQL / PGMQ / Vue / Docker" },
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
      "Moonberg is a financial workflow used by an accounting firm to collect, normalize, and structure Bloomberg data.",
      "A single collection job can take minutes, so it must run outside the HTTP request lifecycle.",
      "The system uses a Go API, PostgreSQL/PGMQ, persistent job state, and isolated Python Bloomberg workers to keep the request and collection lifecycles separate.",
    ],
    whatIOwned: [
      "Designed asynchronous job dispatch between a Go API and isolated Python Bloomberg workers.",
      "Implemented persistent job states (queued → dispatched → running → succeeded/failed) backed by PostgreSQL and PGMQ.",
      "Kept collection results available after the original request ended so the workflow could be resumed and reviewed later.",
    ],
    problem: {
      headline: "Bloomberg data collection could take minutes and depended on isolated local workers.",
      subheadline: "How do you keep long-running extraction out of the HTTP request lifecycle?",
      details: [
        "The API needed to acknowledge work before collection finished while preserving a durable link between the job, worker result, and current state.",
        "PostgreSQL and PGMQ provide the queue and state boundary without coupling the client request to the worker process.",
      ],
    },
    constraints: [
      "Jobs that outlive the HTTP gateway must continue without holding the client connection open.",
      "The current state and result must remain queryable after a client disconnects or a worker finishes later.",
      "The queue and worker boundary must keep API coordination separate from resource-heavy Bloomberg collection.",
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
        title: "Go API + PostgreSQL Queue + Python Bloomberg Worker (Chosen)",
        pros: [
          "The Go API acknowledges work quickly without waiting for collection to finish.",
          "Python workers handle the long-running Bloomberg collection in isolation.",
          "PGMQ and PostgreSQL keep queued work, job state, and results durable.",
        ],
        cons: [
          "Requires explicit contracts between the API, queue, worker, and persistent job state.",
        ],
      },
    ],
    decision:
      "Decision: Option C — Use a Go API with PostgreSQL/PGMQ and persistent job state, while isolated Python Bloomberg workers handle the long-running collection.",
    whyChosen: [
      "Separating API coordination from resource-heavy collection keeps the request lifecycle short and the worker lifecycle independent.",
      "PGMQ and PostgreSQL provide a durable queue and state boundary without adding a separate queue cluster to operate.",
    ],
    architecture: {
      caption: "Moonberg Long-Running Job Architecture",
      mermaidDiagram: `flowchart TD
    User[Client] -->|1. POST /jobs| GoAPI[Go API]
    GoAPI -->|2. Create queued job| DB[(PostgreSQL + PGMQ)]
    GoAPI -->|3. Return job ID| User
    DB -->|4. Claim queued job| Worker[Python Bloomberg Worker]
    Worker -->|5. Collect & normalize data| Bloomberg[Bloomberg Data Source]
    Worker -->|6. Persist result and state| DB
    User -.->|7. Read job state/result| GoAPI
    GoAPI -->|8. Query persistent state| DB`,
    },
    failureModes: [
      {
        scenario: "What if the HTTP request ends before a collection job finishes?",
        solution:
          "The job remains in PostgreSQL and PGMQ with its current state. A later request can look up the job ID and read the persisted result instead of starting the collection again.",
      },
      {
        scenario: "What if the user disconnects or refreshes the page while a job is running?",
        solution:
          "The job continues execution independently on the server. When the user reconnects, the frontend queries by job ID and reads the persisted state and result.",
      },
    ],
    results: [
      "Removed the dependency on a long-lived HTTP request for multi-minute collection jobs.",
      "Kept job state and collection results available for later lookup after the original request ended.",
      "Maintained a small API process by isolating resource-heavy Bloomberg work in Python workers.",
    ],
    learnings: [
      "Long-running tasks must treat worker crashes and client disconnections as normal baseline conditions, not rare edge cases.",
      "Decoupling API gateway lifecycle from background worker lifecycles is the most effective way to preserve web responsiveness under heavy compute loads.",
    ],
    differentlyToday: [
      "I would evaluate a dedicated workflow engine if the lifecycle grows beyond the needs of a durable PostgreSQL queue and explicit job state.",
    ],
  },
  {
    slug: "alembic-dump",
    number: "03",
    title: "ALEMBIC-DUMP",
    subtitle: "Making database migration testing reproducible",
    tagline: "Python tooling for schema synchronization, database dump/load, and safe data masking.",
    summary:
      "How an internal migration workflow grew into an open-source Python library for Alembic synchronization, database dump/load, data masking, and SSH tunnel support.",
    meta: [
      { label: "TYPE", value: "Open Source / Developer Tooling" },
      { label: "REPOSITORY", value: "jaeyoung0509/alembic-dump" },
      { label: "STATUS", value: "Active · Published" },
      { label: "FOCUS", value: "Database Migration · Data Masking · Operational Safety" },
      { label: "STACK", value: "Python / PostgreSQL / Alembic / SSH / Vault" },
      { label: "PERIOD", value: "2023 – Present" },
    ],
    stack: ["Python", "PostgreSQL", "Alembic", "SSH", "Data Masking"],
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
      "Migration verification required reproducing a representative database locally without exposing customer data.",
      "alembic-dump grew from that internal workflow into an open-source Python library for schema synchronization, database dump/load, data masking, and secure remote access.",
    ],
    whatIOwned: [
      "Built and open-sourced alembic-dump as a Python library for repeatable database migration and data workflows.",
      "Implemented Alembic revision alignment together with database dump and load operations.",
      "Added chunked data masking and remote access through SSH tunneling, with support for secret backends such as AWS Secrets Manager and Vault.",
    ],
    problem: {
      headline: "Migration checks required a safe, repeatable database snapshot.",
      subheadline: "How do you reproduce schema and data without copying sensitive records into local environments?",
      details: [
        "Private network access, inconsistent dump steps, and unmasked data made local verification slow and risky.",
        "The library keeps schema synchronization and data handling explicit so a local database can reproduce the required shape without carrying original sensitive values.",
      ],
    },
    constraints: [
      "Must access remote databases through an explicit secure tunnel and secret backend.",
      "Must mask sensitive values before saving or loading local data.",
      "Must keep schema synchronization and data transfer reusable across migration environments.",
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
        title: "Ad-hoc Dump and Masking Scripts",
        pros: ["Quick to write for one environment."],
        cons: [
          "Procedures drift across environments and masking is easy to forget or apply inconsistently.",
        ],
      },
      {
        name: "Option C",
        title: "Reusable Python Library (Chosen)",
        pros: [
          "Coordinates Alembic synchronization, database dump/load, masking, and secure remote access.",
          "Reusable from application code, scripts, and future automation.",
        ],
        cons: [
          "Requires a clear library API and explicit configuration for different environments.",
        ],
      },
    ],
    decision:
      "Decision: Option C — Build and open-source a Python library that combines Alembic synchronization, database dump/load, masking, and secure remote access into a repeatable workflow.",
    whyChosen: [
      "When operational friction is high, developers take shortcuts. The only reliable way to enforce database safety is to make the safest path the easiest path.",
    ],
    architecture: {
      caption: "alembic-dump Automated Migration Workflow",
      mermaidDiagram: `flowchart LR
    Dev[Developer or CI] -->|Use library| Lib[alembic-dump Python library]
    Secrets[AWS Secrets Manager / Vault] --> Lib
    Lib -->|SSH tunnel| RemoteDB[(Remote PostgreSQL)]
    RemoteDB -->|Dump / load| Lib
    Lib -->|Chunked masking| SafeData[Sanitized data]
    Lib -->|Alembic revision sync| LocalDB[(Local PostgreSQL)]
    SafeData --> LocalDB`,
    },
    failureModes: [
      {
        scenario: "What if sensitive records enter a local dump?",
        solution:
          "Data is masked while it is being transferred and processed in chunks, so the local database can reproduce the shape of the source without carrying the original sensitive values.",
      },
      {
        scenario: "What if a migration script contains harmful table locks or broken SQL syntax?",
        solution:
          "The migration executes locally against the exact schema structure in Docker first, surfacing lock contention and syntax errors before the code is merged or deployed.",
      },
    ],
    results: [
      "Reduced the internal migration pre-flight workflow from roughly 30 minutes to under 2 minutes.",
      "Turned schema synchronization, database dump/load, and masking into reusable open-source building blocks.",
      "Made it easier to reproduce migration-related database states without carrying original sensitive values.",
    ],
    learnings: [
      "Developer tooling is an extension of system reliability. Automating repetitive operational workflows removes human error at the source.",
      "A reusable library is only useful when its data boundaries, masking behavior, and failure cases are explicit.",
    ],
    differentlyToday: [
      "Extend the library with a GitHub Actions integration that spins up ephemeral database containers on pull requests and comments with migration diffs and lock analysis.",
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
      "ZENITH was designed as a fast, offline-first native tool that scans and cleans development workspaces without sending telemetry.",
    ],
    whatIOwned: [
      "Designed and developed the complete desktop application combining a high-performance Rust backend with a modern Svelte UI via Tauri.",
      "Moved scan execution to a background worker so large directory walks do not block the UI.",
      "Designed a clean, keyboard-friendly UI focused on developer productivity and safety.",
    ],
    problem: {
      headline: "Existing system cleaners are bloated, subscription-heavy, and ignore developer artifacts.",
      subheadline: "How do you scan and safely reclaim tens of gigabytes of build cache in seconds?",
      details: [
        "Traditional cleaning utilities target browser cookies and system caches, completely missing development artifacts like Target dirs, Gradle caches, or Docker unused volumes.",
        "Electron-based desktop tools can consume more memory and launch more slowly than a native utility.",
      ],
    },
    constraints: [
      "Must remain lightweight with a small idle footprint.",
      "Must guarantee safe file deletions with explicit confirmation and safety dry-runs.",
      "Must operate completely offline with zero telemetry or tracking.",
    ],
    options: [
      {
        name: "Option A",
        title: "Electron + Node.js Desktop App",
        pros: ["Familiar web ecosystem and rapid UI prototyping."],
        cons: ["Larger binary size and higher memory/CPU usage."],
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
          "Small native footprint, fast filesystem scanning in Rust, and a reactive Svelte UI.",
          "OS-native webview with a lower runtime footprint.",
        ],
        cons: ["Requires bridging async commands between Rust IPC and frontend state."],
      },
    ],
    decision:
      "Decision: Option C — Combine a Rust scanning core with Tauri's lightweight IPC and Svelte's reactive frontend to build an offline-first developer desktop tool.",
    whyChosen: [
      "Scanning hundreds of thousands of files in deeply nested node_modules or Cargo target folders requires native file I/O speed.",
      "Tauri leverages macOS WebKit, keeping the final application binary and runtime footprint small.",
    ],
    architecture: {
      caption: "ZENITH Architecture (Tauri + Rust + Svelte)",
      mermaidDiagram: `flowchart LR
    UI[Svelte 5 UI] -->|Tauri IPC invoke| Core[Rust Core Engine]
    Core -->|spawn_blocking background worker| FS[macOS File System]
    FS -->|Target / Cache Artifacts| Core
    Core -->|Calculated Sizes & Safety Check| UI
    UI -->|Confirm Clean| Core
    Core -->|Guarded deletion| FS`,
    },
    failureModes: [
      {
        scenario: "What if scanning a massive directory locks up the UI thread?",
        solution:
          "Scanning runs outside the UI thread in a background worker, with progress streamed over Tauri IPC to keep the Svelte UI responsive.",
      },
      {
        scenario: "What if a user accidentally deletes uncommitted source code?",
        solution:
          "ZENITH identifies registered artifact patterns and revalidates the target's filesystem identity immediately before deletion.",
      },
    ],
    results: [
      "Lightweight distribution bundle with a small idle footprint.",
      "Fast scanning across deeply nested development directories without blocking the UI.",
      "Preview-first checks and guarded deletion keep cleanup boundaries explicit.",
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
