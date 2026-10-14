# Astro migration design

The public Next Motion AI site will move from Docusaurus to Astro while remaining a static GitHub Pages site at `https://www.nextmotionai.com`.

The Astro project stays in `website/`. It will retain the current routes: `/`, `/about`, `/markdown-page`, `/docs/who_we_are`, `/blog`, `/blog/welcome`, `/blog/archive`, `/blog/tags`, and `/blog/tags/news`, plus a 404 page. Existing `/blog/rss.xml`, `/blog/atom.xml`, and `/sitemap.xml` feeds remain available. Existing written content, the blue and off-white visual style, logo, navigation, metadata, and Google Analytics tracking ID remain. The product page and blog post remain Markdown; the blog index and tag pages derive from the post collection so later posts can be added without manually editing each listing.

Astro prerenders every route to HTML with file-style output for extensionless GitHub Pages URLs. Public assets move to `website/public/`; its `CNAME` contains the plain domain name. The site uses Astro templates and CSS without a React runtime, since the only active React home page feature list is empty. A local `npm run deploy` command builds and publishes `dist/` to the existing `gh-pages` branch of `nextmotionai/next-motion-ai-pages`, as the old Docusaurus configuration did. No deployment is part of this migration task.

Verification covers the production build, TypeScript/Markdown checks, generated routes and core page content, internal links, analytics, and the CNAME. The deploy command itself is not run because it publishes the live site.
