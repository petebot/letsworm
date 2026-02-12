import type { PageServerLoad } from './$types';
import client from '../../sanity';

export const load: PageServerLoad = async () => {
  const page = await client.fetch(
    `
    *[_type == "page" && slug.current == "about"][0]{
      _id,
      title,
      hero,
      body,
      slug
    }
  `
  );

  return { page };
};
