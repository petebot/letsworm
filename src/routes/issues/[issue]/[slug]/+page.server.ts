import type { PageServerLoad } from "./$types";
import client from "../../../../sanity";

export const load: PageServerLoad = async ({ params }) => {
  const { slug, issue } = params;

  const post = await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      mainImage,
      promptedBy,
      "author": coalesce(author->name, author->givenName + " " + select(defined(author->middleName) => author->middleName + " ", "") + author->familyName),
      "illustrator": coalesce(illustrator->name, illustrator->givenName + " " + select(defined(illustrator->middleName) => illustrator->middleName + " ", "") + illustrator->familyName),
      publishedAt,
      body,
      excerpt,
      "writer": coalesce(writer->name, writer->givenName + " " + select(defined(writer->middleName) => writer->middleName + " ", "") + writer->familyName),
      "categories": categories[]->{_id, title, slug},
      slug
    }
  `,
    { slug }
  );

  if (!post) {
    return { data: { post: null, relatedPosts: [], suitePosts: [], issue: null } };
  }

  const categoryIds: string[] | undefined = post?.categories?.map((c: any) => c._id);
  const relatedPosts = await client.fetch(
    `
    *[_type == "post" && slug.current != $slug && references($categoryIds)] | order(_createdAt desc)[0...3] {
      title,
      mainImage,
      publishedAt,
      excerpt,
      slug,
      "author": coalesce(author->name, author->givenName + " " + select(defined(author->middleName) => author->middleName + " ", "") + author->familyName),
      "categories": categories[]->{_id, title, slug}
    }
  `,
    { slug, categoryIds }
  );

  const issueData = await client.fetch(
    `*[_type == "issue" && (slug.current == $issue || issueNumber == $issue)][0]{ title, issueNumber, slug }`,
    { issue }
  );

  return { data: { post, relatedPosts, suitePosts: [], issue: issueData } };
};