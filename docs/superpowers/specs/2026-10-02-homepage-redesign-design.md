# Next Motion AI Website Redesign

## Intent

Present Next Motion AI as a thoughtful research effort exploring reinforcement learning for biological discovery. The public site should feel credible and memorable to potential scientific collaborators. It should explain the idea without exposing unpublished research direction, software design, datasets, evaluation protocols, results, or roadmaps.

## Public copy boundary

- The research codebase is at an early stage. Describe an approach being explored, not a deployed platform or validated scientific outcome.
- Public themes: biological design has large search spaces; objectives and feedback can guide iterative search; reinforcement learning is one possible tool; computational results require careful evaluation.
- Do not name the internal research problem, target, experimental setup, data sources, model/predictor, algorithms, budgets, milestones, or numerical claims.
- Do not imply that predictions are experimental results, that RL outperforms alternatives, or that work has produced medicines.
- Use contact@nextmotionai.com as the collaboration path. Preserve existing public routes and the static GitHub Pages deployment.

## Design direction

Use an editorial science aesthetic: warm ivory background, deep ink text, brand blue and soft green accents. Pair a bold sans headline with a restrained serif phrase. The hero is a two-column composition: direct, aspirational copy on the left and an original abstract SVG search-field illustration on the right. The visual represents possibility and feedback, not a real molecule or scientific result.

The homepage has five sections:

1. Hero: “Building a discovery engine for biology.” A supporting sentence explicitly frames the work as exploration; links to the approach and contact.
2. Thesis: biological design requires navigating many possibilities and tradeoffs.
3. Research lens: three conceptual steps—frame an objective, explore possibilities, learn from feedback—without presenting them as implemented workflow.
4. Evidence: computational ideas need reproducible evaluation and honest limits.
5. Contact: invite conversation about the research direction.

Use a simple header with Approach, Journal, About, and a Contact email action. Replace placeholder community links in the footer. Keep the blog and legacy routes. The product page becomes a high-level “Approach” article with the same cautious language; the About page briefly states the mission and contact address.

## Interaction and quality

- Static Astro output; no client framework, autoplay video, external font, or runtime server.
- Responsive at narrow phone widths, with readable text and navigation that wraps cleanly.
- Decorative animation is subtle and disabled by `prefers-reduced-motion`.
- Keyboard focus, contrast, semantic headings, and SVG decorative labeling are intentional.
- Preserve RSS/Atom, sitemap, canonical metadata, analytics ID, CNAME, and existing URL paths.

## Verification

Build and typecheck. Extend the generated-site tests to confirm the new headline, contact path, preserved routes, and removal of unsupported platform claims from prominent copy. Inspect desktop and mobile previews, including link navigation and overflow. Do not deploy.
