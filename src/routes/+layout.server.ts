import type { LayoutServerLoad } from "./$types";
import client from "../sanity";

export const load: LayoutServerLoad = async ({ url }) => {
  const [pages, categories] = await Promise.all([
    client.fetch(`
      *[_type == "page" && includeInNav == true] | order(_createdAt asc) {
        title,
        slug,
        _id
      }
    `),
    client.fetch(`
      *[_type == "category" && count(*[_type == "post" && references(^._id)]) > 0]{
        title,
        slug
      }
    `),
  ]);

  return { pathname: url.pathname, pages, categories };
};