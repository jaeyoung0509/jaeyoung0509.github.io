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
        <h1>Blog</h1>
      </header>
      <PostSearch posts={posts} />
    </>
  );
}
