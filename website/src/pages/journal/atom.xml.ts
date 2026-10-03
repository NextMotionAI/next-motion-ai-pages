import type { APIRoute } from 'astro';
import { escapeXml } from '../../lib/xml';
import { getPublishedPosts } from '../../lib/posts';

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getPublishedPosts()).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const origin = site ?? new URL('https://www.nextmotionai.com');
  const updated = posts[0]?.data.date.toISOString() ?? new Date(0).toISOString();
  const entries = posts.map((post) => {
    const url = new URL(`/journal/${post.id}`, origin).href;
    const content = post.rendered?.html ?? `<p>${escapeXml(post.body?.trim() ?? post.data.description)}</p>`;
    return `<entry><title>${escapeXml(post.data.title)}</title><id>${url}</id><link href="${url}"/><updated>${post.data.date.toISOString()}</updated><author><name>${escapeXml(post.data.author)}</name></author><summary>${escapeXml(post.data.description)}</summary><content type="html">${escapeXml(content)}</content></entry>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Next Motion AI Journal</title><id>${new URL('/journal', origin).href}</id><link href="${new URL('/journal/atom.xml', origin).href}" rel="self"/><link href="${new URL('/journal', origin).href}"/><updated>${updated}</updated>${entries}</feed>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
