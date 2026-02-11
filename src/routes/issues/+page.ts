import client from "../../sanity";

const ISSUES_QUERY = `*[_type == "issue" && published == true] | order(issueNumber desc){
  title,
  issueNumber,
  slug,
  publishedAt,
  heroImage
}`;

export async function load() {
  const issues = await client.fetch(ISSUES_QUERY);
  return { issues };
}
