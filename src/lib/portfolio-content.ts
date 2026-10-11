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
        "백엔드 개발자 이재영의 작업 기록. B2B 외상결제 서비스 개발 경험과 개인 프로젝트, 오픈소스 기여를 정리했습니다.",
      ogImage: `${siteConfig.url}/images/editorial-backend-desk.jpg`,
    },
    hero: {
      role: "Backend Software Engineer",
      location: "대한민국 서울",
      name: "이재영",
      headline:
        "백엔드 개발자입니다.\n가끔 필요한 도구도 만듭니다.",
      subheadline:
        "Python과 Go로 일합니다. FinovusLab에서는 결제·계약·정산을 맡았습니다. 여기에는 그때 한 일과, 개발하다 번거로워서 직접 만든 도구들을 모았습니다.",
      ctaWork: "프로젝트 보기",
      techStack: ["Python", "Go", "PostgreSQL", "AWS"],
    },
    about: {
      eyebrow: "일하는 방식",
      title: "그동안 한 일",
      paragraphs: [
        "FinovusLab에서는 결제, 신용평가, 전자계약, 정산 기능을 맡았습니다. 외부 기관 API를 연동하고, 수작업으로 처리하던 심사와 운영 업무를 자동화하는 작업을 했습니다.",
        "결제 상태와 한도를 함께 갱신하고, 계약·정산·알림 같은 후속 작업은 비동기로 처리했습니다. 외부 서비스 점검이나 오류로 중단된 작업을 다시 처리할 수 있도록 진행 상태도 저장했습니다.",
        "개인 프로젝트로는 DB 환경을 준비하는 CLI와 macOS 정리 앱을 만들고 있습니다. 사용하던 오픈소스에서 발견한 문제는 이슈나 PR로 남기고, 그 과정에서 배운 내용은 블로그에 기록합니다.",
      ],
    },
    workSection: {
      title: "만든 것들",
      subtitle:
        "회사에서 맡았던 서비스와 혼자 만든 도구들.",
      expandCTA: "자세히 보기 ↓",
      collapseCTA: "닫기 ↑",
    },
    oss: {
      title: "오픈소스",
      subtitle:
        "쓰다가 발견한 문제를 따라가며 남긴 이슈와 PR.",
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
        "B2B 외상결제 서비스의 백엔드 개발과 운영을 담당했습니다. 결제·한도 관리, 외부 기관 연동, 전자계약·정산 처리와 운영 도구를 개발했습니다.",
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
        "Backend developer.\nOccasional toolmaker.",
      subheadline:
        "I work with Python and Go. At FinovusLab, I built payment, contract, and settlement systems. These are notes on that work and tools I made for recurring annoyances.",
      ctaWork: "Projects",
      techStack: ["Python", "Go", "PostgreSQL", "AWS"],
    },
    about: {
      eyebrow: "How I Work",
      title:
        "What I have worked on",
      paragraphs: [
        "At FinovusLab, I worked on payments, credit assessment, digital contracts, and settlements. My work included integrating external APIs and automating manual review and operations tasks.",
        "I kept payment status and credit-limit updates in the same transaction, and handled contracts, settlements, and notifications asynchronously. I also stored job progress so interrupted work could be retried after maintenance or errors.",
        "Outside work, I build a database setup CLI and a macOS cleanup app. I report problems I encounter in open source through issues and pull requests, and write about what I learn on this blog.",
      ],
    },
    workSection: {
      title: "Projects",
      subtitle:
        "Services I worked on, and tools I made for myself.",
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
        "Backend development and operations for a B2B credit-payment service. Worked on payment and credit-limit management, external API integrations, contracts, settlements, and internal tools.",
    },
  },
};
