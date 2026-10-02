import type { APIRoute } from 'astro';
import { escapeXml } from '../../lib/xml';
import { getPublishedPosts } from '../../lib/posts';

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getPublishedPosts()).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const origin = site ?? new URL('https://www.nextmotionai.com');
  const items = posts.map((post) => {
    const url = new URL(`/blog/${post.id}`, origin).href;
    const content = post.rendered?.html ?? `<p>${escapeXml(post.body?.trim() ?? post.data.description)}</p>`;
    return `<item><title>${escapeXml(post.data.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${post.data.date.toUTCString()}</pubDate><description>${escapeXml(post.data.description)}</description><content:encoded>${escapeXml(content)}</content:encoded></item>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>Next Motion AI Journal</title><link>${new URL('/blog', origin).href}</link><description>Research notes from Next Motion AI.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
