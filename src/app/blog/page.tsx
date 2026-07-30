import type { Metadata } from "next";
import { PostSearch } from "@/components/post-search";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "글",
  description:
    "백엔드 시스템, 이벤트 기반 설계, 운영 가시성과 개발 생산성에 관한 글입니다.",
  alternates: {
    canonical: "/blog/",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <header className="page-header container">
        <p className="eyebrow">Writing</p>
        <h1>Blog</h1>
        <p>
          구현 방법만이 아니라 선택의 맥락과 운영 이후의 결과를 함께
          기록합니다.
        </p>
      </header>
      <PostSearch posts={posts} />
    </>
  );
}
