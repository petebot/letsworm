import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import client from "../../../sanity";

export const load: PageLoad = async ({ params }) => {
  const page = await client.fetch(
    `
      *[_type == "page" && slug.current == $slug][0]{
        title,
        includeInNav,
        hero,
        body,
        slug
      }
    `,
    { slug: params.slug }
  );

  if (!page) {
    throw error(404, "Page not found");
  }

  return { page };
};
