import type { LayoutLoad } from "./$types";
import client from "../sanity";

export const load: LayoutLoad = async ({
  url: { pathname },
}: {
  url: { pathname: string };
}) => {
  const pages = await client.fetch(`
    *[_type == "page" && includeInNav == true] | order(_createdAt asc) {
      title,
      slug,
      _id
    }
  `);

  return { pathname, pages };
};

