import type { PageServerLoad } from "./$types";
import client from "../../../sanity";

const CONTRIBUTOR_QUERY = `*[_type == "author" && slug.current == $slug][0]{
  _id,
  name,
  givenName,
  middleName,
  familyName,
  slug,
  image,
  "roles": select(
    count(*[_type == "post" && author._ref == ^._id]) > 0 && count(*[_type == "post" && illustrator._ref == ^._id]) > 0 => ["author", "artist"],
    count(*[_type == "post" && author._ref == ^._id]) > 0 => ["author"],
    count(*[_type == "post" && illustrator._ref == ^._id]) > 0 => ["artist"],
    []
  ),
  bio,
  "storyCount": count(*[_type == "post" && (author._ref == ^._id || illustrator._ref == ^._id)]),
  "promptedCount": count(*[_type == "post" && (
    (author._ref == ^._id && promptedBy == "writing") ||
    (illustrator._ref == ^._id && promptedBy == "art")
  )]),
  "respondedCount": count(*[_type == "post" && (
    (author._ref == ^._id && promptedBy == "art") ||
    (illustrator._ref == ^._id && promptedBy == "writing")
  )]),
  "stories": *[_type == "post" && (author._ref == ^._id || illustrator._ref == ^._id)] | order(publishedAt desc){
    _id,
    title,
    excerpt,
    slug,
    mainImage,
    publishedAt,
    promptedBy,
    "author": author->{_id, name, givenName, middleName, familyName, slug, image},
    "illustrator": illustrator->{_id, name, givenName, middleName, familyName, slug, image},
    "issue": *[_type == "issue" && references(^._id)][0]{ title, issueNumber, slug }
  }
}`;

export const load: PageServerLoad = async ({ params }) => {
  const contributor = await client.fetch(CONTRIBUTOR_QUERY, { slug: params.slug });
  return { contributor };
};