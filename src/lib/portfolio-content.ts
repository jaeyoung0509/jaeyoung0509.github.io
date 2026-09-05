import { siteConfig } from "$lib/site";

export interface OssContribution {
  name: string;
  meta: string;
  desc: string;
  links?: { label: string; href: string }[];
  linkText?: string;
  linkUrl?: string;
}

export interface PortfolioContent {
  meta: {
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    role: string;
    location: string;
    name: string;
    headline: string;
    subheadline: string;
    ctaWork: string;
    techStack: string[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  workSection: {
    title: string;
    subtitle: string;
    expandCTA: string;
    collapseCTA: string;
  };
  oss: {
    title: string;
    subtitle: string;
    contributions: OssContribution[];
  };
  experience: {
    title: string;
    company: string;
    role: string;
    period: string;
    domain: string;
    summary: string;
  };
}

export const portfolioContent: Record<"ko" | "en", PortfolioContent> = {
  ko: {
    meta: {
      title: "이재영 · Software Engineer",
      description:
        "복잡한 금융 워크플로우를 고객과 운영이 실제로 쓰기 좋은 시스템으로 개선해왔습니다. B2B BNPL 결제, 신용평가, 전자계약, 정산 백엔드 엔지니어 이재영의 포트폴리오.",
      ogImage: `${siteConfig.url}/images/editorial-backend-desk.jpg`,
    },
    hero: {
      role: "Backend Software Engineer",
      location: "대한민국 서울",
      name: "이재영",
      headline:
        "복잡한 금융 워크플로우를\n고객과 운영이 실제로 쓰기 좋은 시스템으로 개선해왔습니다.",
      subheadline:
        "B2B BNPL에서 3년 7개월간 결제, 신용평가, 전자계약, 정산 백엔드를 개발하고 운영했습니다. 가입부터 첫 외상결제 이용까지 3영업일 이상 걸리던 흐름을 정상 시간대 10분 이내로 줄이고, 계약 단계 이탈률을 약 50%에서 5% 미만으로 낮췄습니다.",
      ctaWork: "프로젝트 보기",
      techStack: ["Python", "Go", "PostgreSQL", "AWS"],
    },
    about: {
      eyebrow: "일하는 방식",
      title: "결제와 운영 과정에서 반복되는 문제를 시스템으로 줄여왔습니다.",
      paragraphs: [
        "FinovusLab에서 B2B 외상결제를 만들 때, 가입부터 첫 결제까지 3영업일 넘게 걸렸습니다. 계약 단계에서 들어온 고객의 절반쯤이 기다리다 떠났고, 운영팀은 서류를 눈으로 확인하고 일일이 연락해야 했습니다.",
        "그래서 서류 확인을 외부 기관 연동과 비동기 심사로 바꿨습니다. 결제 승인과 한도 차감·복원은 하나의 트랜잭션으로 묶었고, 계약·정산·알림은 뒤로 빼서 외부 상태에 흔들리지 않게 했습니다. 파트너마다 달랐던 계약·정산 규칙은 공통 규칙과 파트너별 정책으로 나눠 관리했습니다.",
        "외부 점검이나 장애로 파이프라인이 멈춰도, 저장해 둔 진행 상태에서 이어서 처리되도록 했습니다. 고객이 다시 신청하지 않아도 되는 구조입니다. 문서만으로 이해가 안 되는 동작은 코드를 직접 따라가 보고, 반복되는 운영 작업은 스크립트와 도구로 줄였습니다.",
      ],
    },
    workSection: {
      title: "주요 프로젝트",
      subtitle:
        "실무에서 운영한 금융 시스템과 반복 작업을 줄이기 위해 만든 도구입니다.",
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
        "B2B BNPL의 결제·신용평가·전자계약·정산 백엔드를 개발하고 운영했습니다. 가입부터 첫 결제까지의 리드타임을 3영업일에서 10분 이내로 단축하고, 결제와 후속 작업을 분리해 외부 시스템 장애의 영향을 격리했습니다.",
    },
  },
  en: {
    meta: {
      title: "Jaeyoung Lee — Software Engineer",
      description:
        "Portfolio of Jaeyoung Lee, a backend software engineer who spent 3 years and 7 months building and operating payment, credit, contract, and settlement systems in B2B BNPL.",
      ogImage: `${siteConfig.url}/images/editorial-backend-desk.jpg`,
    },
    hero: {
      role: "Backend Software Engineer",
      location: "Seoul, South Korea",
      name: "Jaeyoung Lee",
      headline:
        "Improving complex financial workflows into systems\nthat work reliably for customers and operations.",
      subheadline:
        "Over 3 years and 7 months in B2B BNPL, I designed and operated backend systems for payments, credit assessment, digital contracts, and settlements. I reduced the onboarding-to-first-transaction timeline from 3+ business days to under 10 minutes during operating hours, and cut contract drop-off rate from ~50% to under 5%.",
      ctaWork: "Projects",
      techStack: ["Python", "Go", "PostgreSQL", "AWS"],
    },
    about: {
      eyebrow: "How I Work",
      title:
        "I reduce repeated payment and operations problems with backend systems.",
      paragraphs: [
        "When I joined the B2B credit-payment service at FinovusLab, onboarding to the first payment took over 3 business days. About half the customers dropped off at the contract step while waiting, and the ops team checked documents by eye and followed up one by one.",
        "I replaced manual reviews with external verification and async screening. Payment approval and limit deduction/restoration run in one transaction, while contracts, settlements, and notifications run afterwards so external delays don't block payment. Partner-specific contract and settlement rules are kept as shared rules plus per-partner policies.",
        "If a pipeline stops for external maintenance or an outage, it continues from the saved progress — customers don't need to reapply. When docs don't explain a behavior, I read the source directly, and I turn repeated ops work into scripts and tools.",
      ],
    },
    workSection: {
      title: "Projects",
      subtitle:
        "Systems I operated in production and developer tools built for recurring problems.",
      expandCTA: "View details ↓",
      collapseCTA: "Close ↑",
    },
    oss: {
      title: "Open Source",
      subtitle:
        "Issues and pull requests for problems I encountered while using these tools.",
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
        "Designed and operated backend systems for payments, credit assessment, digital contracts, and settlements in B2B BNPL. Reduced onboarding-to-transaction lead time from 3 business days to under 10 minutes, and decoupled payments from asynchronous follow-up tasks to isolate external failures.",
    },
  },
};
