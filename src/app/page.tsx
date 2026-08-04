import { PostSearch } from "@/components/post-search";
import { PageTitle } from "@/components/page-title";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <PageTitle>Blog</PageTitle>
      <PostSearch posts={posts} />
    </>
  );
}
