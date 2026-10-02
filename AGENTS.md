# Repository guidance for Codex

## Project

- This repository contains the public Next Motion AI site at `https://www.nextmotionai.com`.
- The static Astro project is in `website/`. Run npm commands there, not at the repository root.
- GitHub Pages serves the `gh-pages` branch of `nextmotionai/next-motion-ai-pages`; this checkout's `origin` can differ. `website/public/CNAME` and the root `CNAME` identify the custom domain.

## Where to work

- `website/src/pages/` contains the site routes. Markdown pages use `website/src/layouts/ArticleLayout.astro`.
- `website/src/layouts/BaseLayout.astro` contains shared navigation, footer, metadata, and analytics. Global styles are in `website/src/styles/global.css`.
- `website/src/content/blog/` contains Markdown posts. `website/src/content.config.ts` defines their frontmatter. Only posts with `published: true` (the default) appear in archive listings, feeds, and the sitemap; unpublished posts retain their direct URLs for compatibility.
- `website/public/` contains assets copied into the built site, including the GitHub Pages domain and `.nojekyll` files.

## Local workflow

From `website/`, use `npm ci` to install dependencies and `npm run start` to develop. Run `npm run typecheck` for Astro or TypeScript edits and `npm test` to build and check the generated site. `npm run preview` serves the production build locally. Keep `website/package-lock.json` in sync if dependencies change.

## Changes and release

- Preserve existing public URLs unless a task explicitly changes them. Check changed pages locally, including mobile widths when UI is affected.
- Treat statements about the company, product, and scientific capabilities as public claims; use approved copy or verify facts before adding them.
- `npm run deploy` pushes the built site to GitHub Pages. Prepare and verify changes locally before running it; only deploy when the task explicitly calls for publishing.
