export type PostMeta = {
  id?: string;
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
  coverYoutubeId?: string;
  coverYoutubeTitle?: string;
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

export function formatIndexDate(date: string): string {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  }).formatToParts(new Date(date));
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")}`;
}
