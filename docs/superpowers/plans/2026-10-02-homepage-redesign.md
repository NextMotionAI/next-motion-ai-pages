# Next Motion AI Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an editorial science website that introduces Next Motion AI's research direction without revealing unpublished project details or claiming unvalidated outcomes.

**Architecture:** Keep the current static Astro routes and content collection. Redesign the shared layout and homepage with CSS plus a decorative SVG component, then update the Approach and About copy to match the research's actual stage.

**Tech Stack:** Astro, Markdown, CSS, SVG, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-10-02-homepage-redesign-design.md`

## Global Constraints

- Preserve all existing public URL paths and GitHub Pages static output.
- Publish no internal research implementation details or unsupported outcome claims.
- Preserve the analytics ID, feeds, sitemap, canonical links, CNAME, and .nojekyll marker.
- Do not deploy.

## Review Focus

- At 375px width, hero text, artwork, and navigation fit without horizontal overflow.
- All primary actions lead to existing pages or the contact email address.
- The decorative SVG does not convey a specific molecule or result.
- Motion respects reduced-motion preferences.
- Public copy accurately frames research as exploratory.

---

### Task 1: Public content contract

**Files:** Modify `website/tests/site.test.mjs`.

**Interfaces:** Existing `npm test` reads the generated `website/dist/` output.

- [x] Add assertions for the new homepage headline, high-level approach language, contact email action, and unchanged public routes.
- [x] Run the test against the old build and observe the expected failure.

### Task 2: Shared visual system and homepage

**Files:** Modify `website/src/layouts/BaseLayout.astro`, `website/src/styles/global.css`, `website/src/pages/index.astro`; create `website/src/components/DiscoveryField.astro`.

**Interfaces:** Existing Markdown and blog routes continue to use `BaseLayout.astro`; all new links point to preserved routes.

- [x] Implement the shared header, footer, colors, type, focus styles, and responsive rules.
- [x] Build the five homepage sections and original decorative SVG.
- [x] Run `npm test` and `npm run typecheck`; fix failures.

### Task 3: Supporting pages and visual QA

**Files:** Modify `website/src/pages/docs/who_we_are.md`, `website/src/pages/about.md`, and shared article styles as needed.

**Interfaces:** Preserve `/docs/who_we_are` and `/about`.

- [x] Replace outdated platform and product-result wording with high-level research copy.
- [x] Build, typecheck, run the full test suite, and inspect desktop and phone-width previews.
- [x] Check generated output, links, diff whitespace, and public copy against the spec; leave deployment untouched.
