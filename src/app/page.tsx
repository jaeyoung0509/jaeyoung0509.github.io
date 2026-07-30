import { PostSearch } from "@/components/post-search";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <header className="page-header home-header container">
        <h1>Blog</h1>
      </header>
      <PostSearch posts={posts} />
    </>
  );
}
