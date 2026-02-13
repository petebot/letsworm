import client from "../../sanity";
import type { ContributorName } from "$lib/helpers/formatContributorName";

export type CategorySummary = {
  _id?: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
};

export type Post = {
  title?: string;
  mainImage?: Record<string, unknown>;
  publishedAt?: string;
  excerpt?: string;
  slug?: { current?: string };
  author?: (ContributorName & {
    slug?: { current?: string } | null;
    image?: Record<string, unknown> | null;
    _id?: string | null;
  }) | null;
  authorDisplayName?: string | null;
  writer?: string;
  illustrator?: (ContributorName & {
    slug?: { current?: string } | null;
    image?: Record<string, unknown> | null;
    _id?: string | null;
  }) | null;
  illustratorDisplayName?: string | null;
  promptedBy?: "art" | "writing";
  categories?: CategorySummary[];
};

const POSTS_QUERY = `
  *[_type == "post"]{
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
  } | order(publishedAt desc)
`;

export const fetchAllPosts = async (): Promise<Post[]> => {
  // Centralise the post query so multiple routes can share the same data contract.
  return client.fetch(POSTS_QUERY);
};
