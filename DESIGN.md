# Design — jaeyoung0509

A locked design system for this Korean technical blog.

## Genre

Content-first editorial with an austere technical register. Large sans headings,
sparse controls, hairline rules, and unframed indexes make the site feel like an
engineer's maintained notebook rather than a product landing page.

## Macrostructure family

- Home and archive: Index-first. Search and article rows are the primary
  structure; thumbnails support scanning without becoming cards.
- Article: Long Document with a right-side table of contents.
- About: Split Studio for the introduction, followed by an unframed, single-column
  project index that reads like edited engineering notes rather than a product grid.

## Theme

- Paper: clean neutral white with cool-grey secondary surfaces.
- Ink: high-contrast softened charcoal, never pure black.
- Accent: deep green used for navigation and small labels only.
- Rules: hairlines separate sections; cards and decorative containers are avoided.

## Typography

- Display: Pretendard and Korean system sans, weight 750, roman.
- Body: Pretendard and Korean system sans, weight 400.
- Mono: SF Mono / JetBrains Mono for the wordmark, code, and metadata.
- Headings use no italic styling and no negative letter spacing.

## Spacing

A named 4-point scale from 4px to 104px. Large empty areas establish rhythm;
small gaps stay compact around metadata and controls.

## Motion

Motion-cut. Only short hover transitions are allowed. No scroll reveals,
bounces, parallax, or decorative animation.

## Interaction

- Every interactive element has a visible `:focus-visible` state.
- Links carry navigation. Buttons are reserved for controls such as search,
  filtering, and disclosures.
- Radius is 0–2px except for content images where 2px is allowed.

## Implementation

- Components are styled with semantic class names in `src/app.css`.
- Tailwind v4 is loaded for its base layer and remains available, but page and
  component styling should not be rewritten as utility-class chains.
- `bits-ui` may provide accessible interaction primitives; it does not define the
  site's visual language.
- Prefer existing design tokens over component-local colour, spacing, or radius values.

## About Page Grammar

- Section headings are plain, sentence-case titles. Do not pair every heading with
  a small uppercase eyebrow.
- A project is an article preview: number, domain, title, short premise, a compact
  Problem / Solution / Result definition list, and a slash-separated stack line.
- Do not render project signals, technology names, actions, or statuses as pills.
- Project summaries use horizontal rules and whitespace. They have no surface fill,
  outline, shadow, or rounded card container.
- Expanded case studies may use rules and indentation for hierarchy, but not nested
  banners or repeated bordered boxes.
- Open-source work is a single-column record list. Status is quiet metadata; green is
  reserved for a small state icon or link interaction.
- “Currently exploring” is a reading/research note, visually distinct from completed
  projects and contributions.
- About facts are typographic rows, not statistic cards. If they repeat the prose
  without adding useful context, remove them.
- Mono type is metadata only: project numbers, domains, dates, stacks, and compact
  labels. Body explanations and headings remain in the primary sans family.

## Page Rules

- No decorative gradients, glass effects, floating cards, or feature grids.
- No generated hero illustration on the home page.
- Article images show the subject directly and include captions when available.
- Accent colour occupies less than 5% of a viewport.
- Mobile widths use one column and must not scroll horizontally.
- Background surfaces are reserved for code, search controls, and genuinely stateful
  UI—not for grouping ordinary portfolio copy.
