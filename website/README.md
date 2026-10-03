# Website

This Astro site builds static pages for [www.nextmotionai.com](https://www.nextmotionai.com). Use Node.js 22.12 or newer and npm.

## Develop and verify

From this directory:

```sh
npm ci
npm run start
```

`npm run build` writes the production site to `dist/`, and `npm run preview` serves that build locally. `npm run typecheck` checks Astro and TypeScript files. `npm test` builds the site and checks its public routes, content, links, feeds, analytics, and domain file.

## Content

- Edit the home page in `src/pages/index.astro` and the common header, footer, and metadata in `src/layouts/BaseLayout.astro`.
- Edit the Approach and Projects pages in `src/pages/`. Markdown pages use `src/layouts/ArticleLayout.astro`.
- Public navigation uses `/approach`, `/projects`, and `/journal`. The former `/docs/who_we_are` and `/blog` page URLs remain available as compatibility redirects; the former feed URLs still serve XML.
- Add research notes as Markdown files in `src/content/blog/` with `title`, `description`, `date`, `author`, and `tags` frontmatter. Set `published: false` to keep a legacy post's URL available without listing it in the journal archive, feeds, or sitemap. New posts are published by default.
- Put public images and other static assets in `public/`.

## Deploy to GitHub Pages

The existing deployment uses the `gh-pages` branch. `public/CNAME` contains the custom domain, and `public/.nojekyll` allows GitHub Pages to serve Astro's `_astro` assets.

After reviewing the built site, publish it with:

```sh
npm run deploy
```

This command builds the site and pushes `dist/` to the `gh-pages` branch of `nextmotionai/next-motion-ai-pages`. This checkout's `origin` may point to a different repository. GitHub Pages should be configured to serve the root of the organization repo's `gh-pages` branch. Deployment is a separate action from local verification.
