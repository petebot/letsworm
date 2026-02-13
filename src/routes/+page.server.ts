import type { PageServerLoad } from "./$types";
import { fetchAllPosts } from "$lib/data/posts";
import client from "../sanity";

const LATEST_ISSUE_QUERY = `*[_type == "issue" && published == true] | order(issueNumber desc)[0]{
  title,
  issueNumber,
  slug,
  publishedAt,
  "stories": stories[]->{
    title,
    mainImage,
    publishedAt,
    excerpt,
    slug,
    promptedBy,
    "author": author->{
      _id,
      name,
      givenName,
      middleName,
      familyName,
      slug,
      image
    },
    "authorDisplayName": coalesce(author->name, author->givenName + " " + select(defined(author->middleName) => author->middleName + " ", "") + author->familyName),
    "writer": coalesce(writer->name, writer->givenName + " " + select(defined(writer->middleName) => writer->middleName + " ", "") + writer->familyName),
    "illustrator": illustrator->{
      _id,
      name,
      givenName,
      middleName,
      familyName,
      slug,
      image
    },
    "illustratorDisplayName": coalesce(illustrator->name, illustrator->givenName + " " + select(defined(illustrator->middleName) => illustrator->middleName + " ", "") + illustrator->familyName),
    "categories": categories[]->{
      _id,
      title,
      slug,
      description
    }
  }
}`;

export const load: PageServerLoad = async () => {
  const data = await fetchAllPosts();
  const issue = await client.fetch(LATEST_ISSUE_QUERY);
  return { data, issue };
};