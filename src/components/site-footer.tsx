import { ArrowUpRight, Rss } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <small>© {new Date().getFullYear()} Jaeyoung Lee</small>
        <div className="footer-links">
          <a href="https://github.com/jaeyoung0509">
            <FaGithub size={16} /> GitHub <ArrowUpRight size={13} />
          </a>
          <a href="/feed.xml">
            <Rss size={16} /> RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
