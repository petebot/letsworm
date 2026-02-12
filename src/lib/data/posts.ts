import client from "../../sanity";

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
  author?: string;
  writer?: string;
  illustrator?: string;
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
    "author": coalesce(author->name, author->givenName + " " + select(defined(author->middleName) => author->middleName + " ", "") + author->familyName),
    "writer": coalesce(writer->name, writer->givenName + " " + select(defined(writer->middleName) => writer->middleName + " ", "") + writer->familyName),
    "illustrator": coalesce(illustrator->name, illustrator->givenName + " " + select(defined(illustrator->middleName) => illustrator->middleName + " ", "") + illustrator->familyName),
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
