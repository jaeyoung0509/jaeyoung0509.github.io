export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  locale: "ko" | "en";
  featured: boolean;
  draft: boolean;
  cover?: string;
  coverAlt?: string;
  readingMinutes: number;
};

export type PostHeading = {
  depth: 2 | 3;
  id: string;
  text: string;
};

export function formatDate(date: string, locale: "ko" | "en" = "ko") {
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date(date));
}
