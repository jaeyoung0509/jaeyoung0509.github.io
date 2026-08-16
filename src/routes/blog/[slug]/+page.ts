import { getAllPosts, getPost } from "$lib/posts";
import { error } from "@sveltejs/kit";
import type { EntryGenerator, PageLoad } from "./$types";

export const entries: EntryGenerator = () => {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
};

export const load: PageLoad = async ({ params }) => {
  const post = await getPost(params.slug);
  if (!post) {
    error(404, "포스트를 찾을 수 없습니다.");
  }
  return {
    post,
  };
};
