import client from "../../../sanity";

const ISSUE_QUERY = `*[_type == "issue" && (slug.current == $slug || issueNumber == $slug)][0]{
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
    "categories": categories[]->{_id, title, slug, description},
    "storyCycleName": storyCycleName[]->{_id, title, slug, description}
  }
}`;

export async function load({ params }) {
  const slug = params.slug;
  const issue = await client.fetch(ISSUE_QUERY, { slug });
  return { issue };
}
