import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const dist = new URL('../dist/', import.meta.url).pathname;
const routes = new Map([
  ['index.html', 'Building a reinforcement learning platform for biology'],
  ['markdown-page.html', 'Markdown page example'],
  ['platform.html', 'reinforcement learning platform'],
  ['research.html', 'Research at'],
  ['research/peptide-mhc-binding.html', 'peptide–MHC binding'],
  ['journal/2026-10-02-learning-from-feedback-in-peptide-discovery.html', 'A computational prediction is not an experimental measurement.'],
  ['journal/welcome.html', 'Welcome to Next Motion AI homepage'],
  ['journal/tags.html', 'peptide discovery'],
  ['journal/tags/peptide-discovery.html', 'Can learning from feedback improve peptide discovery?'],
  ['journal/tags/news.html', 'No research notes published yet'],
  ['404.html', 'Page not found'],
]);

test('navigation routes use the names shown on the site', () => {
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(home, /href="\/platform"[^>]*>Platform<\/a>/);
  assert.match(home, /<details class="nav-dropdown"[\s\S]*?<summary>Research/);
  assert.match(home, /href="\/research"[^>]*>Overview<\/a>/);
  assert.match(home, /href="\/research\/peptide-mhc-binding"[^>]*>Peptide–MHC binding<\/a>/);
  assert.match(home, /href="\/platform"[^>]*>Explore the platform/);
  assert.ok(existsSync(join(dist, 'platform.html')));
  assert.ok(existsSync(join(dist, 'research.html')));
  assert.ok(existsSync(join(dist, 'research/peptide-mhc-binding.html')));
  assert.match(readFileSync(join(dist, 'platform.html'), 'utf8'), /href="\/platform" aria-current="page">Platform<\/a>/);

  const research = readFileSync(join(dist, 'research.html'), 'utf8');
  assert.match(research, /<h1 id="research-heading">Research at <em>Next Motion AI\.<\/em><\/h1>/);
  assert.match(research, /algorithm design/);
  assert.match(research, /RL engineering/);
  assert.match(research, /automated lab systems/);
  assert.doesNotMatch(research, /Each project gives us a defined question/);
  assert.match(research, /href="\/research\/peptide-mhc-binding"[^>]*>Explore the project/);
  assert.doesNotMatch(research, /class="research-focus"/);
  assert.match(readFileSync(join(dist, 'research/peptide-mhc-binding.html'), 'utf8'), /href="\/journal\/2026-10-02-learning-from-feedback-in-peptide-discovery"/);
  assert.ok(existsSync(join(dist, 'journal/archive.html')));
  assert.ok(existsSync(join(dist, 'journal/tags.html')));
  assert.ok(existsSync(join(dist, 'journal/tags/peptide-discovery.html')));
  assert.ok(existsSync(join(dist, 'journal/2026-10-02-learning-from-feedback-in-peptide-discovery.html')));

  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /https:\/\/www\.nextmotionai\.com\/platform<\/loc>/);
  assert.match(sitemap, /https:\/\/www\.nextmotionai\.com\/research<\/loc>/);
  assert.match(sitemap, /https:\/\/www\.nextmotionai\.com\/research\/peptide-mhc-binding<\/loc>/);
  assert.doesNotMatch(sitemap, /https:\/\/www\.nextmotionai\.com\/(?:projects|journal)<\/loc>/);
  assert.doesNotMatch(sitemap, /https:\/\/www\.nextmotionai\.com\/(?:docs\/who_we_are|blog)(?:<|\/)/);
});

test('old page addresses point to the matching new routes', () => {
  const aliases = new Map([
    ['docs/who_we_are.html', '/platform'],
    ['approach.html', '/platform'],
    ['projects.html', '/research'],
    ['journal.html', '/research/peptide-mhc-binding'],
    ['journal/archive.html', '/research/peptide-mhc-binding'],
    ['blog.html', '/research/peptide-mhc-binding'],
    ['blog/archive.html', '/research/peptide-mhc-binding'],
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
  assert.match(html, /href="\/platform"/);
  assert.match(html, /href="\/research"/);
  assert.doesNotMatch(html, /href="\/about"/);
  assert.match(html, /G-YLHJEZJCWG/);
});

test('public homepage introduces exploratory research and a working contact path', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(html, /<h1[^>]*>[^<]*Building a reinforcement learning platform for biology/);
  assert.doesNotMatch(html, /NEXT MOTION AI \/ PLATFORM IN DEVELOPMENT/);
  assert.match(html, /peptide–MHC binding/);
  assert.match(html, /<section class="home-project[^\"]*"[\s\S]*href="\/research\/peptide-mhc-binding"[^>]*>Explore the project/);
  assert.match(html, /href="\/platform"[^>]*>Explore the platform/);
  assert.equal(html.match(/href="mailto:contact@nextmotionai\.com"/g)?.length, 2);
  assert.doesNotMatch(html, /Scroll to explore|EVIDENCE FOR THE PLATFORM|START A CONVERSATION/i);
  assert.doesNotMatch(html, /WeChat|Discord/);
});

test('homepage and first project surface the same latest project note', () => {
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  const project = readFileSync(join(dist, 'research/peptide-mhc-binding.html'), 'utf8');
  const homeLatest = home.match(/<section class="home-project[^\"]*"[\s\S]*?<h3[^>]*><a href="([^"]+)"/);
  const projectLatest = project.match(/<article class="research-progress-latest"[\s\S]*?<h4[^>]*><a href="([^"]+)"/);

  assert.ok(homeLatest, 'homepage should feature a research note');
  assert.ok(projectLatest, 'project should link to its latest note');
  assert.equal(homeLatest[1], projectLatest[1]);
});

test('platform page describes the developing platform and its first project', () => {
  const html = readFileSync(join(dist, 'platform.html'), 'utf8');
  assert.match(html, /<title>Reinforcement Learning Platform \| Next Motion AI<\/title>/);
  assert.match(html, /building a reinforcement learning platform/i);
  assert.match(html, /peptide–MHC binding/i);
  assert.match(html, /prioritiz/i);
  assert.match(html, /experimental/i);
  assert.doesNotMatch(html, /one (?:question|candidate) at a time|one by one/i);
  assert.match(html, /href="\/research\/peptide-mhc-binding"/);
  assert.match(html, /THE PLATFORM<\/p>/);
  assert.doesNotMatch(html, /THE PLATFORM \/ IN DEVELOPMENT/);
  assert.doesNotMatch(html, /is a reinforcement learning \(RL\) platform/i);
  assert.doesNotMatch(html, /\b(?:HLA|allele|MHCflurry|PPO)\b/i);
});

test('project page lists its notes and keeps the legacy draft out of listings', () => {
  const html = readFileSync(join(dist, 'research/peptide-mhc-binding.html'), 'utf8');
  assert.match(html, /href="\/journal\/2026-10-02-learning-from-feedback-in-peptide-discovery"/);
  assert.doesNotMatch(html, /No research notes published yet|Welcome to Next Motion AI homepage/);
  for (const file of ['journal/tags.html', 'journal/tags/news.html']) {
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

test('project page describes the first project and its limits', () => {
  const html = readFileSync(join(dist, 'research/peptide-mhc-binding.html'), 'utf8');
  assert.match(html, /<title>Peptide–MHC Binding \| Next Motion AI<\/title>/);
  assert.match(html, /peptide–MHC binding/);
  assert.match(html, /first project/i);
  assert.match(html, /exploratory computational research/i);
  assert.match(html, /binding alone does not establish/i);
  assert.doesNotMatch(html, /\b(?:MHCflurry|PPO|training budget|candidate length)\b/i);
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(home, /peptide–MHC binding/);
  assert.doesNotMatch(home, /\b(?:MHCflurry|PPO|training budget|candidate length)\b/i);
  assert.match(readFileSync(join(dist, 'sitemap.xml'), 'utf8'), /https:\/\/www\.nextmotionai\.com\/research/);
  assert.doesNotMatch(readFileSync(join(dist, 'sitemap.xml'), 'utf8'), /\/about/);
});

test('project page and notes link to each other', () => {
  const project = readFileSync(join(dist, 'research/peptide-mhc-binding.html'), 'utf8');
  const latestNote = project.match(/<article class="research-progress-latest"[\s\S]*?<h4[^>]*><a href="([^"]+)"/);

  assert.ok(latestNote);
  assert.ok(project.includes(`href="${latestNote[1]}"`), 'project should point to its latest note');
  assert.doesNotMatch(project, /Follow the <em>work/);
  assert.doesNotMatch(project, /class="project-outro/);
  for (const slug of ['2026-10-02-learning-from-feedback-in-peptide-discovery', '2026-10-12-strong-baseline-peptide-screening']) {
    const note = readFileSync(join(dist, 'journal', `${slug}.html`), 'utf8');
    assert.match(note, /href="\/research\/peptide-mhc-binding"[^>]*>Peptide–MHC binding project<\/a>/);
  }
});

test('project page explains the biology before the first project in one section', () => {
  const html = readFileSync(join(dist, 'research/peptide-mhc-binding.html'), 'utf8');
  const sections = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map(([section]) => section);
  assert.equal(sections.length, 2, 'Research should have one compact context section and one roadmap section');
  assert.match(sections[0], /class="research-focus"[^>]*id="first-project"/);
  assert.match(sections[0], /FIRST PROJECT/);
  assert.match(sections[0], /Why study <em>peptide–MHC binding\?<\/em>/);
  assert.match(sections[0], /MHC proteins can bind short peptide fragments/);
  assert.match(sections[0], /href="\/journal\/2026-10-02-learning-from-feedback-in-peptide-discovery"/);
  assert.doesNotMatch(sections[0], /<h2|class="research-project/);
});

test('project page highlights a three-milestone research roadmap', () => {
  const html = readFileSync(join(dist, 'research/peptide-mhc-binding.html'), 'utf8');
  const progress = html.match(/<section class="research-roadmap[^\"]*"[\s\S]*?<\/section>/)?.[0];
  assert.ok(progress);
  assert.match(progress, /Where <em>we are\.<\/em>/);
  assert.equal((progress.match(/<li class="roadmap-milestone/g) ?? []).length, 3);
  assert.match(progress, /QUESTION FRAMED/);
  assert.match(progress, /SCREENING TASK/);
  assert.match(progress, /CURRENT FOCUS/);
  assert.match(progress, /LATEST NOTE/);
  assert.match(progress, /next research stage/);
  assert.match(progress, /2026-10-12-strong-baseline-peptide-screening/);
  assert.match(progress, /href="\/journal"/);
  assert.doesNotMatch(html, /class="project-status|class="research-project/);
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
  assert.match(rss, /<channel>.*<link>https:\/\/www\.nextmotionai\.com\/research<\/link>/);
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
