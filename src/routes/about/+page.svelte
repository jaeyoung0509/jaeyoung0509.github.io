<script lang="ts">
  import { ArrowUpRight, Mail } from "lucide-svelte";
  import { siteConfig } from "$lib/site";

  const projects = [
    {
      name: "Moonberg",
      role: "Go backend · Python worker · Vue",
      description:
        "비동기 작업을 요청하고 처리 상태와 결과를 확인하는 제품 흐름을 설계했습니다.",
      href: "https://moonberg.co.kr/",
      label: "서비스",
    },
    {
      name: "BitBrief",
      role: "Real-time data · WebSocket · Vue",
      description:
        "분산된 시장 데이터를 한 화면에서 비교하고 실시간 연결 상태를 명확히 보여주는 인터페이스를 만들었습니다.",
      href: "https://bitbrief.net/",
      label: "서비스",
    },
    {
      name: "alembic-dump",
      role: "Python CLI · AWS · PostgreSQL",
      description:
        "Private DB 접근과 스테이징 데이터 준비, 마이그레이션 검증에 반복되던 수작업을 CLI로 자동화했습니다.",
      href: "https://github.com/jaeyoung0509/alembic-dump",
      label: "GitHub",
    },
  ];
</script>

<svelte:head>
  <title>소개 | {siteConfig.name}</title>
  <meta
    name="description"
    content="백엔드 엔지니어 이재영의 기술 관심사, 프로젝트와 연락처입니다."
  />
  <link rel="canonical" href={`${siteConfig.url}/about/`} />
</svelte:head>

<section class="about container">
  <div class="about-heading">
    <p class="eyebrow">About</p>
    <h1>운영 가능한 시스템을 만드는 백엔드 엔지니어</h1>
  </div>
  <div class="about-copy">
    <p class="lead">
      Python과 AWS를 중심으로 핀테크 제품의 복잡한 상태 흐름을 다루는
      백엔드 엔지니어 이재영입니다.
    </p>
    <p>
      BNPL 플랫폼에서 결제, 신용평가, 본인인증, 전자계약, 정산과
      백오피스 워크플로를 개발했습니다. 초기 시장 검증을 위한 FastAPI
      기반 서비스부터 AWS 서버리스와 이벤트 기반 구조로 확장되는
      과정을 경험했습니다.
    </p>
    <p>
      운영 중인 시스템의 상태를 설명할 수 있는 관측 가능성과 데이터
      경계를 중요하게 생각합니다. 개인 프로젝트에서는 Go 기반 백엔드,
      실시간 데이터 처리와 반복적인 운영 작업을 줄이는 개발 도구를
      만들고 있습니다.
    </p>
    <div class="contact">
      <a href="mailto:ejaebbang@gmail.com">
        <Mail size={17} /> ejaebbang@gmail.com
      </a>
      <a href="https://github.com/jaeyoung0509" target="_blank" rel="noreferrer">
        <svg
          class="github-icon"
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
          />
        </svg>
        github.com/jaeyoung0509
        <ArrowUpRight size={14} />
      </a>
    </div>
  </div>
</section>

<section class="about-work container">
  <div class="section-heading">
    <div>
      <p class="eyebrow">Selected Work</p>
      <h2>프로젝트</h2>
    </div>
  </div>
  <div class="project-list">
    {#each projects as project, index (project.name)}
      <article>
        <span class="number">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p class="role">{project.role}</p>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        <a href={project.href} target="_blank" rel="noreferrer">
          {#if project.label === "GitHub"}
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
          {/if}
          {project.label}
          <ArrowUpRight size={15} />
        </a>
      </article>
    {/each}
  </div>
</section>
