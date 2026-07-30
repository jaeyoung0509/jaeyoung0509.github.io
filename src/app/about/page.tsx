import type { Metadata } from "next";
import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "소개",
  description:
    "백엔드 엔지니어 이재영의 기술 관심사, 프로젝트와 연락처입니다.",
  alternates: {
    canonical: "/about/",
  },
};

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

export default function AboutPage() {
  return (
    <>
      <section className="about container">
        <div className="about-heading">
          <p className="eyebrow">About</p>
          <h1>운영 가능한 시스템을 만드는 백엔드 엔지니어</h1>
        </div>
        <div className="about-copy">
          <p className="lead">
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
          <div className="contact">
            <a href="mailto:ejaebbang@gmail.com">
              <Mail size={17} /> ejaebbang@gmail.com
            </a>
            <a href="https://github.com/jaeyoung0509">
              <FaGithub size={17} /> github.com/jaeyoung0509
              <ArrowUpRight size={14} />
            </a>
            <a href="/files/cv_jaeyoung_lee.pdf">
              <FileText size={17} /> English CV
            </a>
          </div>
        </div>
      </section>

      <section className="about-work container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2>프로젝트</h2>
          </div>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <article key={project.name}>
              <span className="number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="role">{project.role}</p>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
              </div>
              <a href={project.href}>
                {project.label === "GitHub" && <FaGithub size={16} />}
                {project.label}
                <ArrowUpRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
