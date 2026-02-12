import type { PageServerLoad } from './$types';
import client from '../../sanity';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

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
    return { data: { post: null, relatedPosts: [], suitePosts: [] } };
  }

  // See if this post is part of an issue. If so, redirect to the canonical nested URL.
  const issue = await client.fetch(
    `*[_type == "issue" && references($postId)][0]{ title, issueNumber, slug }`,
    { postId: post._id }
  );

  if (issue) {
    const issueSegment = issue.slug?.current ?? issue.issueNumber ?? 'issues';
    throw redirect(301, `/issues/${issueSegment}/${slug}`);
  }

  // Otherwise fall back to original data fetching for standalone posts
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

  return { data: { post, relatedPosts, suitePosts: [] } };
};
