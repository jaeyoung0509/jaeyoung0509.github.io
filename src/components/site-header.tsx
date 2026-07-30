import { FileText, Menu, Rss } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

const navigation = [
  { href: "/blog/", label: "blogs" },
  { href: "/about/", label: "about" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="홈">
          jaeyoung0509
        </Link>

        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="icon-button" href="/feed.xml" aria-label="RSS">
            <Rss size={18} />
          </Link>
          <a
            className="icon-button"
            href="https://github.com/jaeyoung0509"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>
          <a className="resume-link" href="/files/cv_jaeyoung_lee.pdf">
            <FileText size={17} />
            <span>English CV</span>
          </a>
          <details className="mobile-menu">
            <summary className="icon-button" aria-label="메뉴 열기">
              <Menu size={21} />
            </summary>
            <nav aria-label="모바일 메뉴">
              {navigation.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
              <a href="/files/cv_jaeyoung_lee.pdf">English CV</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
