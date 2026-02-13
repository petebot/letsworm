import type { PageServerLoad } from "./$types";
import client from "../../../sanity";

const ISSUE_QUERY = `*[_type == "issue" && (slug.current == $slug || issueNumber == $slug)][0]{
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
    "categories": categories[]->{_id, title, slug, description}
  }
}`;

export const load: PageServerLoad = async ({ params }) => {
  const issue = await client.fetch(ISSUE_QUERY, { slug: params.slug });
  return { issue };
};