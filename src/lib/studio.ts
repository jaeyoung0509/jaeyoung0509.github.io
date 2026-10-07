// Client-safe types shared by the Studio UI. File and Git operations live in server/studio.ts.
export type { StudioPostData } from "./post-shared";
export type ImageGarbageReport = {
  filename: string;
  url: string;
  sizeBytes: number;
  sizeFormatted: string;
};
