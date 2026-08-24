import { getAllPosts } from "$lib/posts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const posts = getAllPosts("ko");
  return {
    posts: posts.slice(0, 3),
  };
};
