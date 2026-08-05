import { ArrowUpRight } from "lucide-react";

type LinkPreviewProps = {
  href: string;
  title: string;
  description: string;
  site?: string;
};

export function LinkPreview({
  href,
  title,
  description,
  site,
}: LinkPreviewProps) {
  const url = new URL(href);
  const siteLabel = site ?? url.hostname.replace(/^www\./, "");

  return (
    <a
      className="link-preview"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${title} 새 탭에서 열기`}
    >
      <span className="link-preview-site">
        <span aria-hidden="true">{siteLabel.slice(0, 1).toUpperCase()}</span>
        {siteLabel}
      </span>
      <strong>{title}</strong>
      <span className="link-preview-description">{description}</span>
      <span className="link-preview-url">
        {url.hostname}
        <ArrowUpRight size={16} aria-hidden="true" />
      </span>
    </a>
  );
}
