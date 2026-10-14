# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Docusaurus with a static Astro build while preserving the site's public routes and GitHub Pages deployment.

**Architecture:** Keep the npm project in `website/`. Render shared navigation, metadata, and footer through one Astro layout; render the existing article content from Markdown and blog collection entries. Publish Astro's `dist/` output to `gh-pages` through a local deploy script.

**Tech Stack:** Astro 7, npm, Markdown, CSS, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-24-astro-migration-design.md`

## Global Constraints

- Preserve all current public routes and written content.
- Keep the site entirely prerendered for GitHub Pages and retain `https://www.nextmotionai.com`.
- Keep the current Google Analytics tracking ID `G-YLHJEZJCWG`.
- Do not publish the site as part of this implementation.

## Review Focus

- Extensionless routes on GitHub Pages should map to generated `.html` files.
- Blog listing, archive, and news tag should include the welcome post.
- Existing RSS, Atom, and sitemap URLs should remain valid XML documents.
- Navigation and static asset links should resolve after the framework switch.
- `dist/CNAME` should contain the domain without angle brackets.
- Production HTML should contain the tracking ID and useful page metadata.

---

### Task 1: Production-output contract

**Files:** Create `website/tests/site.test.mjs`.

**Interfaces:** Consumes `website/dist/` from `npm run build`; produces a Node test command for the generated site.

- [x] Write tests for the route, content, link, analytics, and CNAME requirements in the spec.
- [x] Run `node --test tests/site.test.mjs` from `website/`; expect failure because Astro output does not exist yet.
- [x] Keep the test as the regression check for later tasks.

### Task 2: Astro site and content

**Files:** Replace `website/package.json`, `website/package-lock.json`, and `website/tsconfig.json`; create `website/astro.config.mjs`, Astro layouts/pages/styles/content, and `website/public/`; remove obsolete Docusaurus source and config.

**Interfaces:** Produces static pages under `website/dist/` for Task 1's test and npm commands `start`, `build`, `typecheck`, `test`, and `deploy`.

- [x] Install Astro and the minimal dependencies needed for Markdown and deployment.
- [x] Implement the shared site layout, CSS, routes, Markdown content, and blog listings.
- [x] Run `npm run build`, `npm run typecheck`, and `npm test`; fix failures until all pass.

### Task 3: Repo guidance and deployment readiness

**Files:** Update `README.md`, `website/README.md`, `AGENTS.md`, and `website/.gitignore`.

**Interfaces:** Documents the commands produced by Task 2 and the manual `gh-pages` publishing workflow.

- [x] Replace Docusaurus-specific development and deployment instructions.
- [x] Run `npm ci`, `npm run build`, `npm run typecheck`, `npm test`, and `git diff --check` as final verification.
- [x] Inspect generated routes, assets, and git diff; do not run `npm run deploy`.
