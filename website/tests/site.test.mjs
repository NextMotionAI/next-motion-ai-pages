import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const dist = new URL('../dist/', import.meta.url).pathname;
const routes = new Map([
  ['index.html', 'Reinforcement learning for biological discovery'],
  ['markdown-page.html', 'Markdown page example'],
  ['approach.html', 'The Challenge'],
  ['projects.html', 'peptide–MHC binding'],
  ['journal.html', 'Can learning from feedback improve peptide discovery?'],
  ['journal/2026-10-02-learning-from-feedback-in-peptide-discovery.html', 'A computational prediction is not an experimental measurement.'],
  ['journal/welcome.html', 'Welcome to Next Motion AI homepage'],
  ['journal/archive.html', 'Can learning from feedback improve peptide discovery?'],
  ['journal/tags.html', 'peptide discovery'],
  ['journal/tags/peptide-discovery.html', 'Can learning from feedback improve peptide discovery?'],
  ['journal/tags/news.html', 'No research notes published yet'],
  ['404.html', 'Page not found'],
]);

test('navigation routes use the names shown on the site', () => {
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(home, /href="\/approach"[^>]*>Approach<\/a>/);
  assert.match(home, /href="\/projects"[^>]*>Projects<\/a>/);
  assert.match(home, /href="\/journal"[^>]*>Journal<\/a>/);
  assert.match(home, /href="\/approach"[^>]*>Explore our approach/);
  assert.ok(existsSync(join(dist, 'approach.html')));
  assert.ok(existsSync(join(dist, 'journal.html')));
  assert.match(readFileSync(join(dist, 'approach.html'), 'utf8'), /href="\/approach" aria-current="page">Approach<\/a>/);

  const journal = readFileSync(join(dist, 'journal.html'), 'utf8');
  assert.match(journal, /href="\/journal\/2026-10-02-learning-from-feedback-in-peptide-discovery"/);
  assert.ok(existsSync(join(dist, 'journal/archive.html')));
  assert.ok(existsSync(join(dist, 'journal/tags.html')));
  assert.ok(existsSync(join(dist, 'journal/tags/peptide-discovery.html')));
  assert.ok(existsSync(join(dist, 'journal/2026-10-02-learning-from-feedback-in-peptide-discovery.html')));

  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /https:\/\/www\.nextmotionai\.com\/approach<\/loc>/);
  assert.match(sitemap, /https:\/\/www\.nextmotionai\.com\/journal<\/loc>/);
  assert.doesNotMatch(sitemap, /https:\/\/www\.nextmotionai\.com\/(?:docs\/who_we_are|blog)(?:<|\/)/);
});

test('old page addresses point to the matching new routes', () => {
  const aliases = new Map([
    ['docs/who_we_are.html', '/approach'],
    ['blog.html', '/journal'],
    ['blog/archive.html', '/journal/archive'],
    ['blog/tags.html', '/journal/tags'],
    ['blog/tags/peptide-discovery.html', '/journal/tags/peptide-discovery'],
    ['blog/2026-10-02-learning-from-feedback-in-peptide-discovery.html', '/journal/2026-10-02-learning-from-feedback-in-peptide-discovery'],
    ['blog/welcome.html', '/journal/welcome'],
  ]);
  for (const [file, destination] of aliases) {
    const html = readFileSync(join(dist, file), 'utf8');
    assert.match(html, new RegExp(`<meta http-equiv="refresh" content="0; url=${destination}"`));
    assert.ok(html.includes(`rel="canonical" href="https://www.nextmotionai.com${destination}"`));
    assert.ok(html.includes(`href="${destination}"`));
  }
});

test('all existing public routes are built with their content', () => {
  for (const [file, expected] of routes) {
    const path = join(dist, file);
    assert.ok(existsSync(path), `${file} is missing`);
    const html = readFileSync(path, 'utf8');
    assert.match(html, /<html[^>]*lang="en"/);
    assert.ok(html.includes(expected), `${file} is missing ${expected}`);
  }
});

test('home page retains site metadata, navigation, and analytics', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(html, /<title>Next Motion AI \| Reinforcement Learning for Computational Biology<\/title>/);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /name="description" content="[^"]*peptide–MHC binding/);
  assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1], 'https://www.nextmotionai.com/');
  assert.match(html, /href="\/approach"/);
  assert.match(html, /href="\/projects"/);
  assert.match(html, /href="\/journal"/);
  assert.doesNotMatch(html, /href="\/about"/);
  assert.match(html, /G-YLHJEZJCWG/);
});

test('public homepage introduces exploratory research and a working contact path', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(html, /<h1[^>]*>[^<]*Reinforcement learning for biological discovery/);
  assert.match(html, /peptide–MHC binding/);
  assert.match(html, /href="\/projects"[^>]*>Our first research focus/);
  assert.match(html, /href="\/approach"[^>]*>Explore our approach/);
  assert.match(html, /href="mailto:contact@nextmotionai\.com"/);
  assert.doesNotMatch(html, /WeChat|Discord/);
});

test('approach copy describes research without exposing internal study details', () => {
  const html = readFileSync(join(dist, 'approach.html'), 'utf8');
  assert.match(html, /<title>Reinforcement Learning Approach \| Next Motion AI<\/title>/);
  assert.match(html, /peptide–MHC binding/i);
  assert.match(html, /prioritiz/i);
  assert.match(html, /experimental/i);
  assert.doesNotMatch(html, /one (?:question|candidate) at a time|one by one/i);
  assert.match(html, /href="\/projects"/);
  assert.doesNotMatch(html, /is a reinforcement learning \(RL\) platform/i);
  assert.doesNotMatch(html, /\b(?:HLA|allele|MHCflurry|PPO)\b/i);
});

test('journal highlights the first research note and keeps the legacy draft out of listings', () => {
  const html = readFileSync(join(dist, 'journal.html'), 'utf8');
  assert.match(html, /href="\/journal\/2026-10-02-learning-from-feedback-in-peptide-discovery"/);
  assert.doesNotMatch(html, /No research notes published yet|Welcome to Next Motion AI homepage/);
  for (const file of ['journal/archive.html', 'journal/tags.html', 'journal/tags/news.html']) {
    const page = readFileSync(join(dist, file), 'utf8');
    assert.doesNotMatch(page, /Welcome to Next Motion AI homepage/);
  }
  assert.doesNotMatch(readFileSync(join(dist, 'journal/tags/news.html'), 'utf8'), /<article class="post-card"/);
  assert.match(readFileSync(join(dist, 'journal/welcome.html'), 'utf8'), /name="robots" content="noindex"/);
});

test('first research note has article metadata and states its current limits', () => {
  const html = readFileSync(join(dist, 'journal/2026-10-02-learning-from-feedback-in-peptide-discovery.html'), 'utf8');
  assert.match(html, /<h1[^>]*>Can learning from feedback improve peptide discovery\?<\/h1>/);
  assert.match(html, /<time datetime="2026-10-02">October 2, 2026<\/time>/);
  assert.match(html, /There are no experimental results to report yet/);
  assert.match(html, /A computational prediction is not an experimental measurement/);
  assert.doesNotMatch(html, /name="robots" content="noindex"/);
});

test('projects page describes a research question and its limits', () => {
  const html = readFileSync(join(dist, 'projects.html'), 'utf8');
  assert.match(html, /<title>Peptide–MHC Binding Research \| Next Motion AI<\/title>/);
  assert.match(html, /peptide–MHC binding/);
  assert.match(html, /exploratory computational research/i);
  assert.match(html, /binding alone does not establish/i);
  assert.doesNotMatch(html, /\b(?:MHCflurry|PPO|training budget|candidate length)\b/i);
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(home, /peptide–MHC binding/);
  assert.doesNotMatch(home, /\b(?:MHCflurry|PPO|training budget|candidate length)\b/i);
  assert.match(readFileSync(join(dist, 'sitemap.xml'), 'utf8'), /https:\/\/www\.nextmotionai\.com\/projects/);
  assert.doesNotMatch(readFileSync(join(dist, 'sitemap.xml'), 'utf8'), /\/about/);
});

test('generated CNAME contains the live domain', () => {
  assert.equal(readFileSync(join(dist, 'CNAME'), 'utf8').trim(), 'www.nextmotionai.com');
});

test('robots and sitemap index useful pages without the template example', () => {
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
  assert.match(robots, /^User-agent: \*\nAllow: \/\n/m);
  assert.match(robots, /Sitemap: https:\/\/www\.nextmotionai\.com\/sitemap\.xml/);
  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /\/markdown-page/);
  assert.match(readFileSync(join(dist, 'markdown-page.html'), 'utf8'), /name="robots" content="noindex"/);
});

test('existing XML feeds and sitemap remain available', () => {
  for (const file of ['journal/rss.xml', 'journal/atom.xml', 'blog/rss.xml', 'blog/atom.xml', 'sitemap.xml']) {
    const path = join(dist, file);
    assert.ok(existsSync(path), `${file} is missing`);
    const xml = readFileSync(path, 'utf8');
    assert.match(xml, /<\?xml/);
    assert.ok(!xml.includes('https://www.nextmotionai.com/journal/welcome'), `${file} still lists the legacy welcome post`);
  }
  const rss = readFileSync(join(dist, 'journal/rss.xml'), 'utf8');
  const atom = readFileSync(join(dist, 'journal/atom.xml'), 'utf8');
  assert.match(rss, /<item>.*learning-from-feedback-in-peptide-discovery/);
  assert.match(atom, /<entry>.*learning-from-feedback-in-peptide-discovery/);
  assert.match(rss, /<channel>.*<link>https:\/\/www\.nextmotionai\.com\/journal<\/link>/);
});

test('local links and assets in generated pages resolve', () => {
  for (const file of routes.keys()) {
    const html = readFileSync(join(dist, file), 'utf8');
    for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const pathname = decodeURIComponent(url.split(/[?#]/, 1)[0]);
      const relative = pathname.slice(1);
      const candidates = pathname === '/'
        ? ['index.html']
        : [relative, `${relative}.html`, join(relative, 'index.html')];
      assert.ok(candidates.some((candidate) => existsSync(join(dist, candidate))), `${file} has a broken local link: ${url}`);
    }
  }
});
