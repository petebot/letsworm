import type { PageServerLoad } from "./$types";
import client from "../../../sanity";

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  const page = await client.fetch(
    `
    *[_type == "page" && slug.current == $slug][0]{
      _id,
      title,
      hero,
      body,
      slug
    }
  `,
    { slug }
  );

  return { page };
};
