import type { LayoutServerLoad } from "./$types";
import client from "../sanity";

export const load: LayoutServerLoad = async ({ url }) => {
  const pages = await client.fetch(`
    *[_type == "page" && includeInNav == true] | order(_createdAt asc) {
      title,
      slug,
      _id
    }
  `);

  return { pathname: url.pathname, pages };
};