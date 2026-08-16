import { getAllPosts } from "$lib/posts";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  const posts = getAllPosts();
  return {
    posts,
  };
};
