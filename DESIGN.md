# Design — jaeyoung0509

A locked design system for this Korean technical blog.

## Genre

Modern-minimal editorial with an austere technical register. The large sans
heading, sparse controls, and unframed image index are informed by Claude
Blog's design DNA without copying its page.

## Macrostructure family

- Home and archive: Index-first. Search and article rows are the primary
  structure; thumbnails support scanning without becoming cards.
- Article: Long Document with a right-side table of contents.
- About: Split Studio with an unframed project index.

## Theme

- Paper: warm off-white, never pure white.
- Ink: softened charcoal, never pure black.
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
- Links carry navigation. Buttons are reserved for search and filtering.
- Radius is 0–2px except for content images where 2px is allowed.

## Page Rules

- No decorative gradients, glass effects, floating cards, or feature grids.
- No generated hero illustration on the home page.
- Article images show the subject directly and include captions when available.
- Accent colour occupies less than 5% of a viewport.
- Mobile widths use one column and must not scroll horizontally.
