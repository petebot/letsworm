import client from "../../sanity";

const CONTRIBUTORS_QUERY = `*[_type == "author"] | order(familyName asc, givenName asc, name asc){
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
  "storyCount": count(*[_type == "post" && (author._ref == ^._id || illustrator._ref == ^._id)]),
  "promptedCount": count(*[_type == "post" && (
    (author._ref == ^._id && promptedBy == "writing") ||
    (illustrator._ref == ^._id && promptedBy == "art")
  )]),
  "respondedCount": count(*[_type == "post" && (
    (author._ref == ^._id && promptedBy == "art") ||
    (illustrator._ref == ^._id && promptedBy == "writing")
  )])
}`;

export async function load() {
  const contributors = await client.fetch(CONTRIBUTORS_QUERY);
  return { contributors };
}
