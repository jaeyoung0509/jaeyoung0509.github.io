import { Rss } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <small>© {new Date().getFullYear()} Jaeyoung Lee</small>
        <div className="footer-links">
          <a href="/feed.xml">
            <Rss size={16} /> RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
