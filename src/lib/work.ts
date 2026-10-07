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
      premise: "B2B 외상결제 서비스의 결제·신용평가·계약·정산 백엔드 개발",
      problem: "서류 확인과 계약·정산에 수작업이 많았고, 외부 서비스의 처리 상태를 확인하며 작업을 이어가야 했습니다.",
      solution: "외부 기관 연동으로 심사와 계약 흐름을 수정했습니다. 결제 승인과 후속 작업을 나누고, 중단된 작업은 저장된 상태를 바탕으로 다시 처리하도록 구성했습니다.",
      results: [
        {
          metric: "심사·계약 절차 자동화",
          label: "외부 기관 연동과 전자계약"
        },
        {
          metric: "결제와 후속 작업 분리",
          label: "계약·정산·알림을 비동기로 처리"
        },
        {
          metric: "재처리와 운영 도구",
          label: "진행 상태 저장, 로그 추적, 실패 메시지 관리"
        }
      ],
      stack: [
        "Python",
        "AWS Lambda",
        "EventBridge",
        "SQS FIFO",
        "DynamoDB",
        "PostgreSQL"
      ],
      chapters: [
        {
          heading: "1. 외부 기관 연동과 비동기 심사",
          prose: "운영자가 서류를 확인하던 심사 과정에 외부 기관 연동과 스크래핑을 도입하고 전자계약 흐름을 수정했습니다. 홈택스·정부24 점검으로 처리가 중단되면 DynamoDB에 진행 상태와 다음 실행 시각을 저장하고, 이후 이어서 처리하도록 구성했습니다."
        },
        {
          heading: "2. 결제 상태와 한도 관리",
          prose: "같은 고객이 동시에 결제하거나 주문을 취소해도 한도를 넘겨 승인하거나 두 번 결제되지 않도록, 결제 승인과 한도 차감·복원을 DynamoDB TransactWriteItems 하나로 묶어 처리했습니다. 결제 상태와 이벤트 기록을 같은 트랜잭션 경계에 두고, DynamoDB Streams로 후속 이벤트를 발행해 DB에는 저장됐는데 이벤트가 빠지는 경우에 대응하도록 했습니다."
        },
        {
          heading: "3. 결제 이후 작업 처리",
          prose: "결제 승인 후의 전자계약·정산·알림은 SQS FIFO와 Lambda로 처리했습니다. 파트너별 계약·정산 규칙은 공통 로직과 개별 정책으로 나눴습니다. 결제·연체 상태에 따른 안내 대상 조회와 CMS 출금동의 확인 등 반복 업무도 자동화했습니다."
        },
        {
          heading: "4. 실패 작업 확인과 재처리",
          prose: "요청이 여러 Lambda를 거칠 때 같은 ID로 묶어 로그를 남겨, 장애가 나면 그 ID 하나로 흐름을 따라갈 수 있게 했습니다. 외부 금융망이 느려지거나 잠깐 멈추면 지수 백오프로 재시도하고, 계속 실패하는 메시지는 DLQ에 따로 모아 콘솔에서 다시 처리할 수 있게 했습니다."
        }
      ]
    },
    {
      slug: "moonberg",
      number: "02",
      domain: "감사 업무 자동화 · 개인 프로젝트",
      title: "MOONBERG",
      premise: "Bloomberg Terminal 조회 요청을 큐에 넣고 순서대로 처리하는 도구",
      problem: "공용 단말기 한 대에서 여러 조회 요청을 처리해야 했습니다. 작업을 접수하고 결과를 모으는 과정에도 수작업이 필요했습니다.",
      solution: "Go API로 요청을 접수하고 PostgreSQL PGMQ에 작업을 넣습니다. 단말기의 Python worker가 하나씩 실행하고, Vue 콘솔에서 진행 상황과 결과를 확인합니다.",
      results: [
        {
          metric: "조회 요청 순차 처리",
          label: "단말기에서 실행할 작업을 큐로 관리"
        },
        {
          metric: "진행 상태와 결과 조회",
          label: "웹 콘솔에서 확인"
        },
        {
          metric: "중단 작업 재실행",
          label: "저장된 작업 상태 활용"
        }
      ],
      stack: [
        "Go",
        "Python",
        "PostgreSQL",
        "PGMQ",
        "Docker",
        "Vue"
      ],
      chapters: [
        {
          heading: "공용 단말기의 조회 요청 관리",
          prose: "공용 단말기에 여러 조회 요청이 몰릴 때를 위해 요청 접수와 단말기 실행을 분리했습니다. 요청은 큐에 저장하고, worker가 순서대로 가져와 실행합니다."
        },
        {
          heading: "Go API와 PostgreSQL PGMQ 기반 작업 큐",
          prose: "Go API가 요청을 접수하면 Job ID를 반환하고 PGMQ에 작업을 넣습니다. Python worker가 단말기에서 작업을 순서대로 실행하고 결과를 저장합니다. 웹 콘솔에서는 진행 상황과 완료된 결과를 확인할 수 있습니다."
        },
        {
          heading: "중단된 작업 다시 실행하기",
          prose: "현장 단말기 사용이나 네트워크 불안정으로 프로세스가 끊길 경우에 대비해 작업 단계별 상태를 저장했습니다. 중단된 작업은 저장된 상태부터 이어서 실행되고, 이미 끝난 이전 작업의 결과는 그대로 둡니다."
        }
      ],
      mermaidDiagram: "flowchart TD\n    Client[Client / Web Console] -->|1. POST /jobs| GoAPI[Go API]\n    GoAPI -->|2. 작업 큐 적재| DB[(PostgreSQL + PGMQ)]\n    GoAPI -->|3. Job ID 반환| Client\n    DB -->|4. 작업 폴링| Worker[Python Bloomberg Worker]\n    Worker -->|5. 데이터 수집 및 정규화| Bloomberg[Bloomberg Terminal API]\n    Worker -->|6. 결과 및 상태 영속화| DB\n    Client -.->|7. 진행 상태 조회 및 결과 수신| GoAPI\n    GoAPI -->|8. 영속 상태 조회| DB"
    },
    {
      slug: "alembic_dump",
      number: "03",
      domain: "로컬 DB 재현 도구 · 오픈소스",
      title: "ALEMBIC DUMP",
      premise: "브랜치의 마이그레이션 상태를 확인하고 스테이징 DB를 로컬에 준비하는 CLI",
      problem: "브랜치마다 Alembic 리비전이 달라 로컬 DB를 맞추는 일이 번거로웠습니다. 샘플 데이터만으로 확인하기 어려운 쿼리도 있었습니다.",
      solution: "인증정보 조회, Bastion을 통한 SSH 터널 연결, PostgreSQL 연결과 마이그레이션 확인을 하나의 CLI에서 처리합니다.",
      results: [
        {
          metric: "배포 전 로컬에서 검증",
          label: "실데이터 기반 쿼리 플랜·인덱스 동작"
        },
        {
          metric: "단일 명령으로 표준화",
          label: "로컬 DB 환경 세팅·디버깅"
        }
      ],
      stack: [
        "Python",
        "PostgreSQL",
        "Alembic",
        "SSH Tunnel",
        "AWS Secrets Manager"
      ],
      chapters: [
        {
          heading: "브랜치별 마이그레이션 상태 확인",
          prose: "기능 브랜치를 오갈 때 로컬 DB와 마이그레이션 상태를 맞춰야 했습니다. 매번 수동으로 하던 확인과 연결 작업을 CLI로 묶었습니다."
        },
        {
          heading: "인증부터 터널링까지 한 번의 명령으로 처리",
          prose: "AWS Secrets Manager에서 인증정보를 조회하고 Bastion을 통해 SSH 터널을 엽니다. PostgreSQL에 SSL로 연결해 로컬 브랜치와 스테이징의 마이그레이션 상태를 확인합니다."
        }
      ]
    },
    {
      slug: "zenith",
      number: "04",
      domain: "macOS 개발 도구 · 개인 프로젝트",
      title: "ZENITH",
      premise: "개발자 캐시·Docker 정리와 포트 점유 프로세스 확인을 위한 macOS 데스크톱 앱",
      problem: "개발 도구의 캐시와 Docker 산출물을 정리하거나 포트 점유 프로세스를 찾을 때 여러 명령을 따로 실행해야 했습니다.",
      solution: "Tauri(Rust + Svelte 5) 기반 데스크톱 앱. 미리 정한 캐시·빌드 패턴만 정리 대상으로 삼고, 코드·키체인·인증정보 경로는 제외합니다. 포트를 차지한 프로세스 조회·종료도 지원합니다.",
      results: [
        {
          metric: "캐시·빌드 산출물 정리",
          label: "미리 정한 캐시·빌드 패턴만 정리 대상"
        },
        {
          metric: "포트 점유 프로세스 확인",
          label: "점유 프로세스 탐색·종료"
        },
        {
          metric: "외부 전송 없음",
          label: "스캔·정리는 로컬에서만 처리"
        }
      ],
      stack: [
        "Rust",
        "Tauri",
        "Svelte 5",
        "macOS"
      ],
      chapters: [
        {
          heading: "정리 대상 경로 제한",
          prose: "미리 정의한 빌드 산출물과 캐시 경로를 정리 대상으로 삼습니다. 소스 코드, Keychain, 인증정보가 있는 경로는 후보에서 제외하도록 구성했습니다.",
          bullets: [
            "미리 정한 캐시와 빌드 산출물 패턴에 맞는 경로만 삭제 후보로 만듭니다.",
            "소스 코드, Keychain과 인증정보가 있는 경로는 삭제 후보에서 제외합니다."
          ]
        },
        {
          heading: "로컬 실행과 포트 점유 확인",
          prose: "스캔과 정리는 로컬에서만 실행되고, 스캔 결과는 외부로 보내지 않습니다. 포트를 차지한 프로세스를 찾아 필요할 때 종료할 수 있습니다."
        }
      ]
    }
  ],
  en: [
    {
      slug: "paymonths",
      number: "01",
      domain: "FINTECH · B2B PAYMENTS & CREDIT",
      title: "PAYMONTHS",
      premise: "Backend development for a B2B credit-payment service",
      problem: "Document review, contracts, and settlements involved manual work. Jobs also needed to track the state of external services before continuing.",
      solution: "Redesigned credit assessment, digital contracts, and payment method registration. Split payment approval from follow-up work, and saved job progress so interrupted work could be retried after external outages.",
      results: [
        {
          metric: "Automated review and contracts",
          label: "External API integrations and digital contracts"
        },
        {
          metric: "Asynchronous follow-up work",
          label: "Contracts, settlements, and notifications"
        },
        {
          metric: "Retry and operations tools",
          label: "Stored progress, request logs, and failed-message handling"
        }
      ],
      stack: [
        "Python",
        "AWS Lambda",
        "EventBridge",
        "SQS FIFO",
        "DynamoDB",
        "PostgreSQL"
      ],
      chapters: [
        {
          heading: "1. External integrations and asynchronous reviews",
          prose: "I integrated external verification and scraping into the review process and updated the digital contract flow. During scheduled maintenance, jobs stored their progress and next execution time in DynamoDB so processing could continue later."
        },
        {
          heading: "2. Payment state and credit limits",
          prose: "Payment approval and credit-limit updates use one DynamoDB transaction. Payment state and event records share a transaction boundary, with DynamoDB Streams publishing follow-up events. This handles cases where a database update succeeds but event publication is interrupted."
        },
        {
          heading: "3. Work after payment approval",
          prose: "Contracts, settlements, and notifications ran through SQS FIFO and Lambda after payment approval. Shared logic and partner-specific policies handled contract and settlement rules. Recurring tasks such as querying notification recipients and checking withdrawal consent were automated."
        },
        {
          heading: "4. Tracking and retrying failed jobs",
          prose: "One request ID is passed across Lambdas with structured JSON logs, so an incident can be followed with a single ID. On banking network timeouts, retries use exponential backoff and repeatedly failing messages go to a DLQ for reprocessing from the console."
        }
      ]
    },
    {
      slug: "moonberg",
      number: "02",
      domain: "AUDIT AUTOMATION · INDEPENDENT PROJECT",
      title: "MOONBERG",
      premise: "A queue for running Bloomberg Terminal queries in sequence",
      problem: "Several requests shared one terminal. Receiving requests and collecting results also required manual work.",
      solution: "Decoupled job submission from execution using a Go backend API (Job ID generation) + PostgreSQL PGMQ (job queue) + dedicated Terminal Python worker (sequential execution) + Vue 3 Web Console.",
      results: [
        {
          metric: "Sequential query execution",
          label: "Queued work for a shared terminal"
        },
        {
          metric: "Status and result lookup",
          label: "Available through a web console"
        },
        {
          metric: "Retry interrupted jobs",
          label: "Using stored job progress"
        }
      ],
      stack: [
        "Go",
        "Python",
        "PostgreSQL",
        "PGMQ",
        "Docker",
        "Vue"
      ],
      chapters: [
        {
          heading: "Isolating high-volume audit requests for a single terminal",
          prose: "I separated request intake from terminal execution so several requests could share one terminal. Requests are stored in a queue and picked up by the worker in sequence."
        },
        {
          heading: "Job queue architecture with Go API and PGMQ",
          prose: "The Go API immediately returns a Job ID and enqueues the task in PGMQ. A dedicated Python worker on the terminal consumes jobs one by one, persisting progress and normalized results to PostgreSQL. Operators can disconnect and check completed audit proofs on the web console at any time."
        },
        {
          heading: "Recovering from interrupted terminal sessions",
          prose: "In case of on-site terminal preemption or network interruption, step-level progress is saved. Interrupted tasks continue from the saved state without repeating completed steps."
        }
      ],
      mermaidDiagram: "flowchart TD\n    Client[Client / Web Console] -->|1. POST /jobs| GoAPI[Go API]\n    GoAPI -->|2. Enqueue job| DB[(PostgreSQL + PGMQ)]\n    GoAPI -->|3. Return Job ID| Client\n    DB -->|4. Claim job| Worker[Python Bloomberg Worker]\n    Worker -->|5. Query & normalize| Bloomberg[Bloomberg Terminal API]\n    Worker -->|6. Persist results & state| DB\n    Client -.->|7. Poll status & download results| GoAPI\n    GoAPI -->|8. Query state| DB"
    },
    {
      slug: "alembic_dump",
      number: "03",
      domain: "LOCAL DATABASE CLI · OPEN SOURCE",
      title: "ALEMBIC DUMP",
      premise: "A CLI for checking migrations and preparing a local copy of the staging database",
      problem: "With parallel multi-service feature development, Alembic revision sequences drifted across branches. Minimal sample datasets failed to reproduce query behaviors that depended on real cardinality and row counts before deployment.",
      solution: "The CLI retrieves credentials, opens a bastion SSH tunnel, connects to PostgreSQL, and checks migration status.",
      results: [
        {
          metric: "Verified locally pre-release",
          label: "Real-data query plans and index behavior"
        },
        {
          metric: "One-command replication",
          label: "Local staging DB setup across the team"
        }
      ],
      stack: [
        "Python",
        "PostgreSQL",
        "Alembic",
        "SSH Tunnel",
        "AWS Secrets Manager"
      ],
      chapters: [
        {
          heading: "Eliminating migration drift in parallel development",
          prose: "Frequent schema drift and Alembic revision conflicts occurred across parallel feature branches. The CLI replaced an error-prone manual setup checklist with a reproducible single-command workflow."
        },
        {
          heading: "Automating authentication, tunneling, and schema diffing",
          prose: "The tool fetches credentials from AWS Secrets Manager, establishes an SSH bastion tunnel with PostgreSQL SSL, and inspects migration differentials between the local branch and staging. The CLI brings these setup steps into one command."
        }
      ]
    },
    {
      slug: "zenith",
      number: "04",
      domain: "macOS DEVELOPER TOOL · INDEPENDENT PROJECT",
      title: "ZENITH",
      premise: "macOS desktop app for cleaning developer caches and Docker resources and checking port processes",
      problem: "Developer caches, Docker artifacts, and local AI weights consumed tens of gigabytes while orphaned processes locked local ports, requiring multiple disparate commands and carrying risks of accidental file deletion.",
      solution: "A Tauri desktop app built with Rust and Svelte 5. It uses predefined cleanup patterns, excludes source code and credential paths, and lets users inspect and stop processes holding local ports.",
      results: [
        {
          metric: "Cache and build cleanup",
          label: "Only allow-listed caches and build outputs"
        },
        {
          metric: "Port process inspection",
          label: "Find and stop port-holding processes"
        },
        {
          metric: "No external transmission",
          label: "Scans and cleanup run locally"
        }
      ],
      stack: [
        "Rust",
        "Tauri",
        "Svelte 5",
        "macOS"
      ],
      chapters: [
        {
          heading: "Limiting cleanup paths",
          prose: "Zenith scans predefined build-output and cache paths. Source code, Keychain, and credential paths are excluded from cleanup candidates.",
          bullets: [
            "Creates cleanup candidates only from registered build-artifact patterns.",
            "Excludes source code, Keychain data, and credential paths from cleanup candidates."
          ]
        },
        {
          heading: "On-device privacy and port process control",
          prose: "All scans and cleanup run on the local machine, and scan results are not sent elsewhere. Developers can also find processes holding local ports and stop them when needed."
        }
      ]
    }
  ]
};
