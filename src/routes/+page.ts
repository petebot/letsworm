import { fetchAllPosts } from "$lib/data/posts";
import client from "../sanity";

const LATEST_ISSUE_QUERY = `*[_type == "issue" && published == true] | order(issueNumber desc)[0]{
  title,
  issueNumber,
  slug,
  publishedAt,
  heroImage
}`;

export async function load() {
  const data = await fetchAllPosts();
  const issue = await client.fetch(LATEST_ISSUE_QUERY);
  return { data, issue };
}