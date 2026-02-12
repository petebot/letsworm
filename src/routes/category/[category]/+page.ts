import type { PageLoad } from './$types';
import client from '../../../sanity';

export const load: PageLoad = async ({ params }) => {
  const { category } = params;

  // Fetch the category details using the slug
  const categoryData = await client.fetch(`
    *[_type == "category" && slug.current == $category][0]{
      _id,
      title,
      slug
    }
  `, { category });

  if (!categoryData) {
    console.error(`Category data not found for slug: ${category}`);
    return { data: { posts: [], categoryTitle: '', category: '' } };
  }

  // Fetch posts for the specific category
  let posts = await client.fetch(`
    *[_type == "post" && references($categoryId)] {
      title,
      mainImage,
      publishedAt,
      excerpt,
      slug,
      "author": coalesce(author->name, author->givenName + " " + select(defined(author->middleName) => author->middleName + " ", "") + author->familyName),
      "categories": categories[]->{
        _id,
        title,
        slug
      }
    }
  `, { categoryId: categoryData._id });

  return {
    data: {
      posts,
      categoryTitle: categoryData.title,
      category
    }
  };
};
