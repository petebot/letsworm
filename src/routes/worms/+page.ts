import type { PageLoad } from "./$types";
import { fetchAllPosts } from "$lib/data/posts";

export const load: PageLoad = async () => {
  const data = await fetchAllPosts();
  return { data };
};
