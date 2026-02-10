import client from "../../sanity";

export type CategorySummary = {
  _id?: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
};

export type StoryCycleSummary = {
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
  author?: string;
  categories?: CategorySummary[];
  storyCycleName?: StoryCycleSummary[];
};

const POSTS_QUERY = `
  *[_type == "post"]{
    title,
    mainImage,
    publishedAt,
    excerpt,
    slug,
    "author": author->name,
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
  } | order(publishedAt desc)
`;

export const fetchAllPosts = async (): Promise<Post[]> => {
  // Centralise the post query so multiple routes can share the same data contract.
  return client.fetch(POSTS_QUERY);
};
