import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const dist = new URL('../dist/', import.meta.url).pathname;
const routes = new Map([
  ['index.html', 'Building a discovery engine for biology.'],
  ['about.html', 'contact@nextmotionai.com'],
  ['markdown-page.html', 'Markdown page example'],
  ['docs/who_we_are.html', 'The Challenge'],
  ['projects.html', 'peptide–MHC binding'],
  ['blog.html', 'Can learning from feedback improve peptide discovery?'],
  ['blog/2026-10-02-learning-from-feedback-in-peptide-discovery.html', 'A computational prediction is not an experimental measurement.'],
  ['blog/welcome.html', 'Welcome to Next Motion AI homepage'],
  ['blog/archive.html', 'Can learning from feedback improve peptide discovery?'],
  ['blog/tags.html', 'peptide discovery'],
  ['blog/tags/peptide-discovery.html', 'Can learning from feedback improve peptide discovery?'],
  ['blog/tags/news.html', 'No research notes published yet'],
  ['404.html', 'Page not found'],
]);

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
  assert.match(html, /<title>Next Motion AI<\/title>/);
  assert.match(html, /<meta name="description"/);
  assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1], 'https://www.nextmotionai.com/');
  assert.match(html, /href="\/docs\/who_we_are"/);
  assert.match(html, /href="\/projects"/);
  assert.match(html, /href="\/blog"/);
  assert.match(html, /href="\/about"/);
  assert.match(html, /G-YLHJEZJCWG/);
});

test('public homepage introduces exploratory research and a working contact path', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(html, /<h1[^>]*>[^<]*Building a discovery engine for biology\./);
  assert.match(html, /href="\/docs\/who_we_are"[^>]*>Explore our approach/);
  assert.match(html, /href="mailto:contact@nextmotionai\.com"/);
  assert.doesNotMatch(html, /WeChat|Discord/);
});

test('approach copy describes research without exposing internal study details', () => {
  const html = readFileSync(join(dist, 'docs/who_we_are.html'), 'utf8');
  assert.match(html, /We are exploring/);
  assert.match(html, /Define the question/);
  assert.match(html, /Choose what to explore/);
  assert.match(html, /Test what the evidence supports/);
  assert.match(html, /href="\/projects"/);
  assert.doesNotMatch(html, /is a reinforcement learning \(RL\) platform/i);
  assert.doesNotMatch(html, /\b(?:peptide|MHC|HLA|allele|MHCflurry|PPO)\b/i);
});

test('journal highlights the first research note and keeps the legacy draft out of listings', () => {
  const html = readFileSync(join(dist, 'blog.html'), 'utf8');
  assert.match(html, /href="\/blog\/2026-10-02-learning-from-feedback-in-peptide-discovery"/);
  assert.doesNotMatch(html, /No research notes published yet|Welcome to Next Motion AI homepage/);
  for (const file of ['blog/archive.html', 'blog/tags.html', 'blog/tags/news.html']) {
    const page = readFileSync(join(dist, file), 'utf8');
    assert.doesNotMatch(page, /Welcome to Next Motion AI homepage/);
  }
  assert.doesNotMatch(readFileSync(join(dist, 'blog/tags/news.html'), 'utf8'), /<article class="post-card"/);
  assert.match(readFileSync(join(dist, 'blog/welcome.html'), 'utf8'), /name="robots" content="noindex"/);
});

test('first research note has article metadata and states its current limits', () => {
  const html = readFileSync(join(dist, 'blog/2026-10-02-learning-from-feedback-in-peptide-discovery.html'), 'utf8');
  assert.match(html, /<h1[^>]*>Can learning from feedback improve peptide discovery\?<\/h1>/);
  assert.match(html, /<time datetime="2026-10-02">October 2, 2026<\/time>/);
  assert.match(html, /There are no experimental results to report yet/);
  assert.match(html, /A computational prediction is not an experimental measurement/);
  assert.doesNotMatch(html, /name="robots" content="noindex"/);
});

test('projects page describes a research question and its limits', () => {
  const html = readFileSync(join(dist, 'projects.html'), 'utf8');
  assert.match(html, /peptide–MHC binding/);
  assert.match(html, /exploratory computational research/i);
  assert.match(html, /binding alone does not establish/i);
  assert.doesNotMatch(html, /MHCflurry|PPO|training budget|candidate length/i);
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.doesNotMatch(home, /Peptide–MHC|allele/i);
  assert.match(readFileSync(join(dist, 'sitemap.xml'), 'utf8'), /https:\/\/www\.nextmotionai\.com\/projects/);
});

test('generated CNAME contains the live domain', () => {
  assert.equal(readFileSync(join(dist, 'CNAME'), 'utf8').trim(), 'www.nextmotionai.com');
});

test('existing XML feeds and sitemap remain available', () => {
  for (const file of ['blog/rss.xml', 'blog/atom.xml', 'sitemap.xml']) {
    const path = join(dist, file);
    assert.ok(existsSync(path), `${file} is missing`);
    const xml = readFileSync(path, 'utf8');
    assert.match(xml, /<\?xml/);
    assert.ok(!xml.includes('https://www.nextmotionai.com/blog/welcome'), `${file} still lists the legacy welcome post`);
  }
  const rss = readFileSync(join(dist, 'blog/rss.xml'), 'utf8');
  const atom = readFileSync(join(dist, 'blog/atom.xml'), 'utf8');
  assert.match(rss, /<item>.*learning-from-feedback-in-peptide-discovery/);
  assert.match(atom, /<entry>.*learning-from-feedback-in-peptide-discovery/);
  assert.match(rss, /<channel>.*<link>https:\/\/www\.nextmotionai\.com\/blog<\/link>/);
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
