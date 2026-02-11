import { fetchAllPosts } from "$lib/data/posts";
import client from "../sanity";

const LATEST_ISSUE_QUERY = `*[_type == "issue" && published == true] | order(issueNumber desc)[0]{
  title,
  issueNumber,
  slug,
  publishedAt,
  heroImage,
  "stories": stories[]->{
    title,
    mainImage,
    publishedAt,
    excerpt,
    slug,
    "author": author->name,
    "writer": writer->name,
    "illustrator": illustrator->name,
    "categories": categories[]->{
      _id,
      title,
      slug,
      description
    },
    "storyCycleName": storyCycleName[]->{
      _id,
      title,
      slug,
      description
    }
  }
}`;

export async function load() {
  const data = await fetchAllPosts();
  const issue = await client.fetch(LATEST_ISSUE_QUERY);
  return { data, issue };
}