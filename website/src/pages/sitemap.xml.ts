import type { APIRoute } from 'astro';
import { escapeXml } from '../lib/xml';
import { getPublishedPosts } from '../lib/posts';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];
  const paths = [
    '/',
    '/docs/who_we_are',
    '/projects',
    '/blog',
    ...(posts.length ? ['/blog/archive', '/blog/tags'] : []),
    ...posts.map((post) => `/blog/${post.id}`),
    ...tags.map((tag) => `/blog/tags/${tag}`),
  ];
  const origin = site ?? new URL('https://www.nextmotionai.com');
  const urls = paths.map((path) => `<url><loc>${escapeXml(new URL(path, origin).href)}</loc></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
