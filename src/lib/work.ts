export interface WorkChapter {
  heading: string;
  prose: string;
  bullets?: string[];
}

export interface WorkResult {
  metric: string;
  label?: string;
}

export interface WorkProject {
  slug: string;
  number: string;
  domain: string;
  title: string;
  premise: string;
  problem: string;
  solution: string;
  results: WorkResult[];
  stack: string[];
  chapters?: WorkChapter[];
  mermaidDiagram?: string;
  failureModes?: { scenario: string; solution: string }[];
}

export const workProjects: Record<"ko" | "en", WorkProject[]> = {
  ko: [
    {
      slug: "paymonths",
      number: "01",
      domain: "FINTECH · B2B 결제·신용",
      title: "PAYMONTHS",
      premise:
        "가입부터 첫 결제까지 막히던 온보딩과 결제 뒤에 따라오는 계약·정산 처리를 다시 만든 작업",
      problem:
        "가입부터 첫 외상결제까지 3영업일 이상 소요되고 계약 단계 고객 약 50% 이탈. 백오피스에서는 매주 15~20시간의 반복 업무 발생.",
      solution:
        "신용평가·전자계약·결제수단 등록 흐름을 다시 만들고, 결제 승인과 그 이후 처리를 나눴습니다. 작업 진행 상태를 저장해 두어 외부 장애가 나도 중단된 지점부터 다시 처리할 수 있게 했습니다.",
      results: [
        {
          metric: "3영업일+ → 10분 이내",
          label: "가입부터 첫 외상결제 가능까지 · 정상 시간대",
        },
        { metric: "약 50% → 5% 미만", label: "계약 단계 이탈률" },
        { metric: "3영업일 → 1분 미만", label: "첫 결제 승인 소요 시간" },
        {
          metric: "1인 처리량 10배+",
          label: "백오피스 반복 업무 · 주 15~20시간 수작업 자동화",
        },
      ],
      stack: [
        "Python",
        "AWS Lambda",
        "EventBridge",
        "SQS FIFO",
        "DynamoDB",
        "PostgreSQL",
      ],
      chapters: [
        {
          heading: "1. 온보딩 병목 해소: 3영업일 심사를 10분 자동화로 단축",
          prose:
            "기존에는 사업자 신용평가를 위해 운영자가 서류를 일일이 확인하느라 가입부터 첫 외상결제까지 3영업일 이상 걸렸고, 계약 단계에서 들어온 고객의 절반쯤이 떠났습니다. 외부 기관 연동과 스크래핑 파이프라인을 붙여 정상 시간대 심사를 10분 안으로 줄이고 전자계약 절차를 간단하게 바꿨습니다. 홈택스·정부24 야간 점검으로 심사가 멈추는 시간에는 DynamoDB에 진행 상태와 다음 실행 시각을 저장해 뒀다가, 점검이 끝나면 고객 재신청 없이 이어서 진행되도록 했습니다.",
        },
        {
          heading: "2. 결제·한도 정합성: DynamoDB 조건부 쓰기와 Outbox 패턴",
          prose:
            "같은 고객이 동시에 결제하거나 주문을 취소해도 한도를 넘겨 승인하거나 두 번 결제되지 않도록, 결제 승인과 한도 차감·복원을 DynamoDB TransactWriteItems 하나로 묶어 처리했습니다. 결제 상태와 이벤트 기록을 같은 트랜잭션 경계에 두고, DynamoDB Streams로 후속 이벤트를 발행해 DB에는 저장됐는데 이벤트가 빠지는 경우를 없앴습니다.",
        },
        {
          heading: "3. 계약·정산 자동화: SQS FIFO 기반 순서 보장과 도메인 정책 분리",
          prose:
            "결제 승인 뒤에 따라오는 전자계약·정산·알림은 결제 트랜잭션과 떼어 SQS FIFO와 Lambda 파이프라인으로 돌렸습니다. 첫 결제 처리가 3영업일에서 1분 안으로 줄었고, 파트너마다 달랐던 계약·정산 규칙은 공통 규칙과 파트너별 정책으로 나눠 관리했습니다. 결제·연체 상태가 바뀔 때 안내 대상을 미리 뽑고 CMS 출금동의 상태를 다시 확인하는 과정을 넣어, 주 15~20시간 들던 반복 작업을 자동화했습니다.",
        },
        {
          heading: "4. 관측성 및 장애 격리: 상관관계 ID와 DLQ 기반 재처리 체계",
          prose:
            "요청이 여러 Lambda를 거칠 때 같은 ID로 묶어 로그를 남겨, 장애가 나면 그 ID 하나로 흐름을 따라갈 수 있게 했습니다. 외부 금융망이 느려지거나 잠깐 멈추면 지수 백오프로 재시도하고, 계속 실패하는 메시지는 DLQ에 따로 모아 콘솔에서 다시 처리할 수 있게 했습니다.",
        },
      ],
      mermaidDiagram: `flowchart TD
    Client[Client / PG Webhook] -->|1. 결제 승인 요청| API[Payment API Lambda]
    API -->|2. TransactWriteItems 원자적 실행\n결제 승인 + 한도 차감/복원| DDB[(DynamoDB)]
    DDB -->|3. DynamoDB Streams\nTransactional Outbox| Outbox[Outbox Handler Lambda]
    Outbox -->|4. 도메인 이벤트 발행| EB[AWS EventBridge]
    
    EB -->|Order Paid| Q1[SQS FIFO: 계약 큐]
    EB -->|Order Paid| Q2[SQS FIFO: 정산 큐]
    
    Q1 -->|order_id 기준 순서 보장| CWorker[Contract Service Lambda]
    CWorker -->|전자계약 API| ExtContract[외부 전자서명 연동]
    
    Q2 -->|order_id 기준 순서 보장| SWorker[Settlement Service Lambda]
    SWorker -->|펌뱅킹 이체 API| ExtBank[은행 VAN / PG]
    
    Q1 -.->|재시도 초과| DLQ1[계약 DLQ]
    Q2 -.->|재시도 초과| DLQ2[정산 DLQ]`,
    },
    {
      slug: "moonberg",
      number: "02",
      domain: "감사 업무 자동화 · 개인 프로젝트",
      title: "MOONBERG",
      premise:
        "단일 Bloomberg Terminal 단말기 병목과 감사 증빙 수작업을 해소하기 위한 비동기 작업 큐 시스템",
      problem:
        "감사 증빙을 위해 Bloomberg Terminal 건별 조회가 필수적이었으나, 사용할 수 있는 단말기가 한 대뿐이라 감사 시즌에 수 분씩 걸리는 요청이 집중되어 전담 인력이 필요할 정도로 병목 발생.",
      solution:
        "Go 백엔드 API(Job ID 발급) + PostgreSQL PGMQ(작업 큐) + Terminal 전용 Python worker(순차 처리) + Vue 3 Console로 요청 접수와 단말기 실행을 완전히 분리.",
      results: [
        { metric: "약 60~80% 절감", label: "업무별 반복 수작업" },
        { metric: "충돌 없이 순차 처리", label: "단말기 독점·동시 세션 충돌 방지" },
        {
          metric: "이어서 재실행 가능",
          label: "중단된 작업은 상태 확인 후",
        },
      ],
      stack: ["Go", "Python", "PostgreSQL", "PGMQ", "Docker", "Vue"],
      chapters: [
        {
          heading: "Terminal 단말기 1대로 몰리는 감사 요청 격리",
          prose:
            "감사 시즌에는 건당 수 분이 소요되는 증빙 데이터 조회 요청이 동시에 다수 유입되었습니다. 단말기 독점과 세션 충돌을 방지하기 위해 요청 접수와 실행 엔진을 분리했습니다.",
        },
        {
          heading: "Go API와 PostgreSQL PGMQ 기반 작업 큐",
          prose:
            "Go API는 요청 접수 즉시 Job ID를 반환하고 PostgreSQL 기반 메시지 큐인 PGMQ에 작업을 적재합니다. 전용 Terminal의 Python worker가 작업을 하나씩 순서대로 실행하고 진행률과 정규화된 결과를 저장합니다. 운영자는 언제든 웹 콘솔에서 진행 상황과 완료된 증빙 데이터를 조회할 수 있습니다.",
        },
        {
          heading: "단말기 세션 중단 대응 및 멱등적 재실행",
          prose:
            "현장 단말기 사용이나 네트워크 불안정으로 프로세스가 끊길 경우에 대비해 작업 단계별 상태를 저장했습니다. 중단된 작업은 저장된 상태부터 이어서 실행되고, 이미 끝난 이전 작업의 결과는 그대로 둡니다.",
        },
      ],
      mermaidDiagram: `flowchart TD
    Client[Client / Web Console] -->|1. POST /jobs| GoAPI[Go API]
    GoAPI -->|2. 작업 큐 적재| DB[(PostgreSQL + PGMQ)]
    GoAPI -->|3. Job ID 반환| Client
    DB -->|4. 작업 폴링| Worker[Python Bloomberg Worker]
    Worker -->|5. 데이터 수집 및 정규화| Bloomberg[Bloomberg Terminal API]
    Worker -->|6. 결과 및 상태 영속화| DB
    Client -.->|7. 진행 상태 조회 및 결과 수신| GoAPI
    GoAPI -->|8. 영속 상태 조회| DB`,
    },
    {
      slug: "alembic_dump",
      number: "03",
      domain: "로컬 DB 재현 도구 · 오픈소스",
      title: "ALEMBIC DUMP",
      premise:
        "브랜치별 마이그레이션 불일치와 스테이징 실데이터 검증을 단일 명령으로 자동화한 개발자 CLI",
      problem:
        "여러 서비스와 기능이 병렬로 개발되며 브랜치마다 Alembic 리비전 순서가 어긋나고, 샘플 데이터만으로는 실제 데이터 카디널리티와 건수에 따른 쿼리 동작을 배포 전에 검증하기 어려웠음.",
      solution:
        "Bastion 접속, AWS Secrets Manager 인증정보 조회, SSH 터널링, PostgreSQL SSL 연결, 마이그레이션 상태 조회를 단일 CLI 명령으로 통합 자동화.",
      results: [
        { metric: "약 10분 → 1분 내외", label: "마이그레이션 사전 검증" },
        {
          metric: "배포 전 로컬에서 검증",
          label: "실데이터 기반 쿼리 플랜·인덱스 동작",
        },
        {
          metric: "단일 명령으로 표준화",
          label: "로컬 DB 환경 세팅·디버깅",
        },
      ],
      stack: [
        "Python",
        "PostgreSQL",
        "Alembic",
        "SSH Tunnel",
        "AWS Secrets Manager",
      ],
      chapters: [
        {
          heading: "병렬 개발 환경의 마이그레이션 순서 불일치 해결",
          prose:
            "다수의 마이크로서비스와 기능 브랜치가 동시에 진행되면서 Alembic 마이그레이션 순서 충돌과 로컬 DB 스키마 불일치가 빈번했습니다. 복잡한 수기 체크리스트를 단일 CLI로 표준화했습니다.",
        },
        {
          heading: "인증부터 터널링까지 한 번의 명령으로 처리",
          prose:
            "AWS Secrets Manager에서 임시 인증 정보를 받아 Bastion을 통한 SSH 터널을 열고, PostgreSQL SSL 연결 후 현재 로컬 브랜치와 스테이징 스키마 간의 마이그레이션 상태를 즉시 진단합니다. 10분 이상 걸리던 검증 작업이 1분 이내로 단축되었습니다.",
        },
      ],
    },
    {
      slug: "zenith",
      number: "04",
      domain: "macOS 개발 도구 · 개인 프로젝트",
      title: "ZENITH",
      premise:
        "개발자 캐시·Docker 정리와 포트 점유 프로세스 확인을 위한 macOS 데스크톱 앱",
      problem:
        "패키지 매니저 캐시, Docker 빌드 캐시, 로컬 AI 모델이 수십 GB의 디스크를 차지하고 좀비 프로세스가 로컬 포트를 점유할 때마다 여러 도구를 수작업으로 실행해야 했으며, 임의 경로 삭제 위험 존재.",
      solution:
        "Tauri(Rust + Svelte 5) 기반 데스크톱 앱. 미리 정한 캐시·빌드 패턴만 정리 대상으로 삼고, 코드·키체인·인증정보 경로는 제외합니다. 포트를 차지한 프로세스 조회·종료도 지원합니다.",
      results: [
        {
          metric: "원클릭 디스크 회수",
          label: "미리 정한 캐시·빌드 패턴만 정리 대상",
        },
        {
          metric: "포트 충돌 해결",
          label: "점유 프로세스 탐색·종료",
        },
        {
          metric: "외부 전송 없음",
          label: "스캔·정리는 로컬에서만 처리",
        },
      ],
      stack: ["Rust", "Tauri", "Svelte 5", "macOS"],
      chapters: [
        {
          heading: "화이트리스트 기반 안전 삭제 모델",
          prose:
            "사용자가 지정한 임의 경로를 무분별하게 삭제하는 대신, 사전에 정의된 안전한 빌드 산출물 및 캐시 디렉터리 패턴만 스캔합니다. 소스 코드 리포지토리, Keychain, 민감한 인증 정보는 스캔 후보에서 원천 차단됩니다.",
          bullets: [
            "미리 정한 캐시와 빌드 산출물 패턴에 맞는 경로만 삭제 후보로 만듭니다.",
            "소스 코드, Keychain과 인증정보가 있는 경로는 삭제 후보에서 제외합니다.",
          ],
        },
        {
          heading: "로컬 완결형 처리와 포트 프로세스 관리",
          prose:
            "스캔과 정리는 로컬에서만 실행되고, 스캔 결과는 외부로 보내지 않습니다. 포트를 차지한 프로세스를 찾아 필요할 때 종료할 수 있습니다.",
        },
      ],
    },
  ],
  en: [
    {
      slug: "paymonths",
      number: "01",
      domain: "FINTECH · B2B PAYMENTS & CREDIT",
      title: "PAYMONTHS",
      premise:
        "Rework of blocked onboarding and the contract and settlement work that follows payment",
      problem:
        "Onboarding to first transaction took 3+ business days with ~50% drop-off at the contract stage. Back-office operations spent 15–20 hours weekly on recurring manual tasks.",
      solution:
        "Redesigned credit assessment, digital contracts, and payment method registration. Split payment approval from follow-up work, and saved job progress so interrupted work could be retried after external outages.",
      results: [
        {
          metric: "3+ days → Under 10 mins",
          label: "Onboarding to first payment · operating hours",
        },
        { metric: "~50% → Under 5%", label: "Contract drop-off rate" },
        { metric: "3 days → Under 1 min", label: "First payment approval" },
        {
          metric: "10x+ capacity",
          label: "Per-operator · 15–20 hrs/week of manual work automated",
        },
      ],
      stack: [
        "Python",
        "AWS Lambda",
        "EventBridge",
        "SQS FIFO",
        "DynamoDB",
        "PostgreSQL",
      ],
      chapters: [
        {
          heading:
            "1. Eliminating onboarding bottlenecks: From 3 business days to 10 minutes",
          prose:
            "Previously, manual document reviews by operations meant onboarding to first transaction took 3+ business days, leading to ~50% customer drop-off at the contract stage. By integrating external verification APIs and scraping pipelines, credit assessment was reduced to under 10 minutes during operating hours. To handle nightly maintenance windows at Gov24 and Hometax, job states and next execution timestamps were persisted in DynamoDB, resuming automatically once maintenance ended without requiring customer reapplication.",
        },
        {
          heading:
            "2. Payment & credit limit consistency: DynamoDB atomic transactions and Outbox",
          prose:
            "To keep concurrent payments and cancellations from approving over the limit or charging twice, payment approval and limit deduction/restoration run in one DynamoDB TransactWriteItems transaction. Payment state and the event record are written in the same transaction boundary, and follow-up events are published from DynamoDB Streams so a committed payment never loses its event.",
        },
        {
          heading:
            "3. Contract & settlement automation: SQS FIFO ordering and domain policy isolation",
          prose:
            "Contract signing, seller payouts, and notifications run apart from payment approval in an SQS FIFO and Lambda pipeline. First payment approval went from 3 business days to under 1 minute. Partner-specific settlement rules live as shared rules plus per-partner policies. Pre-calculating notice recipients on status changes and re-checking CMS direct-debit consent removed 15–20 hours of weekly manual work.",
        },
        {
          heading:
            "4. Observability & failure isolation: Correlation IDs and DLQ re-drive",
          prose:
            "One request ID is passed across Lambdas with structured JSON logs, so an incident can be followed with a single ID. On banking network timeouts, retries use exponential backoff and repeatedly failing messages go to a DLQ for reprocessing from the console.",
        },
      ],
      mermaidDiagram: `flowchart TD
    Client[Client / PG Webhook] -->|1. Submit Payment| API[Payment API Lambda]
    API -->|2. Atomic TransactWriteItems\nPayment PAID + Limit Deducted| DDB[(DynamoDB)]
    DDB -->|3. DynamoDB Streams\nTransactional Outbox| Outbox[Outbox Handler Lambda]
    Outbox -->|4. Emit Domain Event| EB[AWS EventBridge]
    
    EB -->|Order Paid| Q1[SQS FIFO: Contract Queue]
    EB -->|Order Paid| Q2[SQS FIFO: Settlement Queue]
    
    Q1 -->|Ordered by order_id| CWorker[Contract Service Lambda]
    CWorker -->|E-Signature API| ExtContract[External Contract Gateway]
    
    Q2 -->|Ordered by order_id| SWorker[Settlement Service Lambda]
    SWorker -->|Bank Transfer API| ExtBank[Bank VAN / PG]
    
    Q1 -.->|Retries exhausted| DLQ1[Contract DLQ]
    Q2 -.->|Retries exhausted| DLQ2[Settlement DLQ]`,
    },
    {
      slug: "moonberg",
      number: "02",
      domain: "AUDIT AUTOMATION · INDEPENDENT PROJECT",
      title: "MOONBERG",
      premise:
        "Asynchronous job queue system resolving single Bloomberg Terminal bottlenecks and manual audit proofs",
      problem:
        "Audit evidence required per-item queries on the Bloomberg Terminal, but only one terminal was available. During peak audit periods, queries taking minutes each caused severe contention and required dedicated manual operation.",
      solution:
        "Decoupled job submission from execution using a Go backend API (Job ID generation) + PostgreSQL PGMQ (job queue) + dedicated Terminal Python worker (sequential execution) + Vue 3 Web Console.",
      results: [
        { metric: "60–80% less", label: "Repetitive manual work" },
        {
          metric: "No session conflicts",
          label: "Sequential execution on a single terminal",
        },
        {
          metric: "Rerun from saved state",
          label: "Interrupted jobs continue where they stopped",
        },
      ],
      stack: ["Go", "Python", "PostgreSQL", "PGMQ", "Docker", "Vue"],
      chapters: [
        {
          heading: "Isolating high-volume audit requests for a single terminal",
          prose:
            "During audit season, numerous queries taking several minutes each arrived concurrently. To eliminate terminal contention and session clashes, request ingestion was decoupled from the execution worker.",
        },
        {
          heading: "Job queue architecture with Go API and PGMQ",
          prose:
            "The Go API immediately returns a Job ID and enqueues the task in PGMQ. A dedicated Python worker on the terminal consumes jobs one by one, persisting progress and normalized results to PostgreSQL. Operators can disconnect and check completed audit proofs on the web console at any time.",
        },
        {
          heading: "Recovering from interrupted terminal sessions",
          prose:
            "In case of on-site terminal preemption or network interruption, step-level progress is saved. Interrupted tasks continue from the saved state without repeating completed steps.",
        },
      ],
      mermaidDiagram: `flowchart TD
    Client[Client / Web Console] -->|1. POST /jobs| GoAPI[Go API]
    GoAPI -->|2. Enqueue job| DB[(PostgreSQL + PGMQ)]
    GoAPI -->|3. Return Job ID| Client
    DB -->|4. Claim job| Worker[Python Bloomberg Worker]
    Worker -->|5. Query & normalize| Bloomberg[Bloomberg Terminal API]
    Worker -->|6. Persist results & state| DB
    Client -.->|7. Poll status & download results| GoAPI
    GoAPI -->|8. Query state| DB`,
    },
    {
      slug: "alembic_dump",
      number: "03",
      domain: "LOCAL DATABASE CLI · OPEN SOURCE",
      title: "ALEMBIC DUMP",
      premise:
        "Developer CLI automating migration drift across branches and staging database verification in one command",
      problem:
        "With parallel multi-service feature development, Alembic revision sequences drifted across branches. Minimal sample datasets failed to reproduce query behaviors that depended on real cardinality and row counts before deployment.",
      solution:
        "Automated bastion access, AWS Secrets Manager credential lookup, SSH tunneling, PostgreSQL SSL connections, and migration status inspection into a single unified CLI command.",
      results: [
        {
          metric: "~10 mins → Under 1 min",
          label: "Pre-flight migration verification",
        },
        {
          metric: "Verified locally pre-release",
          label: "Real-data query plans and index behavior",
        },
        {
          metric: "One-command replication",
          label: "Local staging DB setup across the team",
        },
      ],
      stack: [
        "Python",
        "PostgreSQL",
        "Alembic",
        "SSH Tunnel",
        "AWS Secrets Manager",
      ],
      chapters: [
        {
          heading: "Eliminating migration drift in parallel development",
          prose:
            "Frequent schema drift and Alembic revision conflicts occurred across parallel feature branches. The CLI replaced an error-prone manual setup checklist with a reproducible single-command workflow.",
        },
        {
          heading: "Automating authentication, tunneling, and schema diffing",
          prose:
            "The tool fetches credentials from AWS Secrets Manager, establishes an SSH bastion tunnel with PostgreSQL SSL, and inspects migration differentials between the local branch and staging. Pre-flight checks dropped from 10 minutes to under 1 minute.",
        },
      ],
    },
    {
      slug: "zenith",
      number: "04",
      domain: "macOS DEVELOPER TOOL · INDEPENDENT PROJECT",
      title: "ZENITH",
      premise:
        "macOS desktop app for cleaning developer caches and Docker resources and checking port processes",
      problem:
        "Developer caches, Docker artifacts, and local AI weights consumed tens of gigabytes while orphaned processes locked local ports, requiring multiple disparate commands and carrying risks of accidental file deletion.",
      solution:
        "Lightweight native desktop app built with Tauri (Rust + Svelte 5). Classifies cleanup candidates by safety tiers, strictly excludes source code, Keychain, and credentials, and provides inspection/termination of port-holding processes.",
      results: [
        {
          metric: "One-click disk recovery",
          label: "Only allow-listed caches and build outputs",
        },
        {
          metric: "Instant port-conflict fix",
          label: "Find and stop port-holding processes",
        },
        {
          metric: "No external transmission",
          label: "Scans and cleanup run locally",
        },
      ],
      stack: ["Rust", "Tauri", "Svelte 5", "macOS"],
      chapters: [
        {
          heading: "Whitelist-based safety deletion model",
          prose:
            "Rather than allowing arbitrary filesystem path deletion, Zenith scans only registered build artifacts and cache directories. Source code directories, Keychain storage, and credential files are strictly excluded from candidates.",
          bullets: [
            "Creates cleanup candidates only from registered build-artifact patterns.",
            "Excludes source code, Keychain data, and credential paths from cleanup candidates.",
          ],
        },
        {
          heading: "On-device privacy and port process control",
          prose:
            "All scans and cleanup run on the local machine, and scan results are not sent elsewhere. Developers can also find processes holding local ports and stop them when needed.",
        },
      ],
    },
  ],
};
