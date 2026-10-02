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
  ['blog.html', 'A space for what'],
  ['blog/welcome.html', 'Welcome to Next Motion AI homepage'],
  ['blog/archive.html', 'No research notes published yet'],
  ['blog/tags.html', 'No research notes published yet'],
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

test('journal is an open space until research updates are ready', () => {
  const html = readFileSync(join(dist, 'blog.html'), 'utf8');
  assert.match(html, /No research notes published yet/);
  assert.match(html, /href="\/projects"/);
  assert.doesNotMatch(html, /Welcome to Next Motion AI homepage|All posts|Tags/);
  for (const file of ['blog/archive.html', 'blog/tags.html', 'blog/tags/news.html']) {
    const page = readFileSync(join(dist, file), 'utf8');
    assert.doesNotMatch(page, /Welcome to Next Motion AI homepage|<article class="post-card"/);
  }
  assert.match(readFileSync(join(dist, 'blog/welcome.html'), 'utf8'), /name="robots" content="noindex"/);
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
  assert.doesNotMatch(rss, /<item>/);
  assert.doesNotMatch(atom, /<entry>/);
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
