import type { PageServerLoad } from './$types';
import client from '../../../../sanity';

export const load: PageServerLoad = async ({ params }) => {
  const { slug, issue } = params;

  // Fetch the current post data
  const post = await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      mainImage,
      "author": author->name,
      "illustrator": illustrator->name,
      publishedAt,
      body,
      excerpt,
      "writer": writer->name,
      "categories": categories[]->{_id, title, slug},
      "storyCycleName": storyCycleName[]->{_id, title, slug},
      slug
    }
  `,
    { slug }
  );

  if (!post) {
    return { data: { post: null, relatedPosts: [], suitePosts: [], issue: null } };
  }

  // Fetch related posts based on the same categories
  const categoryIds: string[] | undefined = post?.categories?.map((c: any) => c._id);
  const relatedPosts = await client.fetch(
    `
    *[_type == "post" && slug.current != $slug && references($categoryIds)] | order(_createdAt desc)[0...3] {
      title,
      mainImage,
      publishedAt,
      excerpt,
      slug,
      "author": author->name,
      "categories": categories[]->{_id, title, slug},
      "storyCycleName": storyCycleName[]->{_id, title, slug}
    }
  `,
    { slug, categoryIds }
  );

  // Fetch suite posts (story cycle)
  let suitePosts: any[] = [];
  if (post?.storyCycleName) {
    const suiteSlug = post.storyCycleName[0]?.slug?.current;
    if (suiteSlug) {
      suitePosts = await client.fetch(
        `*[_type == "post" && storyCycleName[0]->slug.current == $suiteSlug] | order(publishedAt asc){ title, mainImage, publishedAt, slug, "author": author->name, "categories": categories[]->{_id,title,slug}, "storyCycleName": storyCycleName[]->{_id,title,slug} }`,
        { suiteSlug }
      );
    }
  }

  // Fetch issue metadata (if present) by slug or issueNumber
  const issueData = await client.fetch(
    `*[_type == "issue" && (slug.current == $issue || issueNumber == $issue)][0]{ title, issueNumber, slug }`,
    { issue }
  );

  return { data: { post, relatedPosts, suitePosts, issue: issueData } };
};
