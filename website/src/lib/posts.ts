import { getCollection } from 'astro:content';

export const getPublishedPosts = async () =>
  (await getCollection('blog')).filter((post) => post.data.published);
