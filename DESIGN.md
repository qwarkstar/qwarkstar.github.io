# Design System

Generated from existing CSS in `style.css`, `justahead/styles.css`, `trashscan/styles.css`. All three sites already share a unified visual system; this captures it so future variants stay on-brand.

## Theme

Dark, by deliberate scene choice.

> **Scene sentence:** A recruiter glances at the homepage on a 14-inch laptop in a half-lit airline lounge between flights. A commuter opens R·iving's landing page on their phone at the bus stop, late afternoon, sun glaring on the screen.

That second case is why the palette must keep saturated accents readable in bright light, not just look great in a dim portfolio review. Light theme is not on the roadmap.

## Color (OKLCH-equivalent of current hex tokens)

Current values are written in hex; expressed here as OKLCH for future tokens. All neutrals are tinted toward the brand blue at very low chroma.

| Role | Hex (current) | OKLCH | Usage |
|---|---|---|---|
| `--bg-0` | `#050507` | `oklch(0.07 0.005 264)` | Page background, default surface |
| `--bg-1` | `#0c0c10` | `oklch(0.13 0.005 264)` | `.section-dark` alternation, footer |
| `--bg-2` | `#14141b` | `oklch(0.17 0.007 264)` | Cards, social-row pill |
| `--bg-3` | `#1d1d26` | `oklch(0.22 0.008 264)` | Raised surfaces, hover states |
| `--border` | `#262631` | `oklch(0.27 0.01 264)` | Default border |
| `--border-soft` | `#1a1a23` | `oklch(0.20 0.008 264)` | Subtle dividers |
| `--text` | `#ffffff` | `oklch(1 0 0)` | Headings, primary text |
| `--text-dim` | `#a1a1aa` | `oklch(0.71 0.005 264)` | Body copy, secondary |
| `--text-mute` | `#6b6b76` | `oklch(0.50 0.008 264)` | Captions, meta |
| `--text-faint` | `#3a3a46` | `oklch(0.32 0.01 264)` | Disabled, placeholder |

**Action note:** `--text` is pure white — slightly garish on OLED at full brightness. Consider tinting to `oklch(0.99 0.005 264)` to follow impeccable's "never use #fff" rule.

## Color Strategy

**Restrained.** Tinted dark neutrals carry 90% of the surface; one accent per surface drives the rest.

| Surface | Primary accent | Secondary roles | Usage cap |
|---|---|---|---|
| Portfolio (`/`) | Blue `#0A84FF` | Gold `#F5C87A` (warmth, eyebrow), green `#30D158` (status badges), purple `#BF5AF2` (auxiliary tag) | Accent ≤10% of any viewport |
| R·iving (`/justahead/`) | Blue `#0A84FF` | Same secondary roles | Same |
| TrashScan (`/trashscan/`) | Green `#30D158` (theme-color) | Blue, gold, purple | Same |

The one accent ≤10% rule is the right discipline. The current sites mostly hold this; the marquees and `.section-head` eyebrows occasionally crowd it.

## Typography

| Family | Weights | Use |
|---|---|---|
| Manrope | 300, 400, 500, 600, 700, 800 | Display + UI. Loaded from Google Fonts. |
| Inter | 400 | `body` fallback. Currently overrides Manrope on body. **Inconsistency.** |
| JetBrains Mono | 400, 500 | Code blocks, mono labels |

> **Action note:** `style.css` declares `--font-display: 'Manrope', ...` but the `body` rule sets `font-family: 'Inter', ...`. Pick one. Manrope across the board reads more "considered"; Inter is more neutral. Recommend Manrope.

### Scale (current `clamp()` ramp)

| Token | clamp | Use |
|---|---|---|
| Hero title | `clamp(46px, 7vw, 88px)` | `<h1>` only |
| Section h2 | `clamp(30px, 4vw, 48px)` | Section headings |
| Featured h3 | `clamp(24px, 3vw, 34px)` | Featured-card titles |
| Subhead | `22px` | "Other projects" |
| Body | `17px` | About text, section sub-copy |
| Body small | `16px` | Card body |
| Meta | `14px` | Nav, social links |
| Eyebrow | `12px` (uppercase, +0.15em letter-spacing) | Section eyebrows |
| Caption | `11px` (uppercase) | Featured chip, status |

Letter-spacing tightens with size: `-0.03em` on hero, `-0.02em` on h2/featured, `-0.01em` on subhead, neutral on body, positive (`0.12–0.15em`) on uppercase eyebrows. **Keep this ramp.**

Line height: 1.6 body, 1.7 in card paragraphs, 1.02–1.15 on display.

Reading width: about 600px on `.hero-sub`, 760px on `.container-narrow`. Fine for body. (Body line length cap ~65–75ch is observed.)

## Layout

- Container: 1180px max, 24px gutters.
- Container narrow: 760px (about, education, FAQ, contact).
- Section padding: 100px vertical desktop, scale down ~64–72px mobile.
- Section heads: centered, max 680px wide, 56px below.
- Card radii: `--radius-sm` 10px, `--radius` 16px, `--radius-lg` 24px, `--radius-xl` 32px (featured cards).
- Spacing inside cards: 56px on featured cards, 28–32px on regular cards.

> **Rhythm note:** Section padding is uniform at 100px. impeccable's law: "Vary spacing for rhythm. Same padding everywhere is monotony." Consider 120px on the hero-adjacent first section, 80px on tighter ones.

## Components

| Component | File | Notes |
|---|---|---|
| `.nav` / `.nav-inner` | shared | Fixed, `backdrop-filter: blur(24px)` when scrolled. Glass-on-scroll is purposeful (it's a chrome treatment, not decoration). Keep. |
| `.btn-primary` | shared | Solid blue, soft shadow, `translateY(-2px)` on hover. Good. |
| `.btn-ghost` | shared | Subtle white-on-white. Good. |
| `.badge` (status) | shared | Pill, 8px dot, animated `pulse`. Reused for "Available on the App Store", etc. |
| `.eyebrow` | shared | Uppercase 12px in pill background. Heavily used. |
| `.section-head` | shared | Centered eyebrow + h2 + sub-paragraph triple. Good rhythm. |
| `.featured-card` | portfolio | 1.6fr / 1fr two-column with radial-blob `::before`. The blob is the closest thing to glassmorphism; it's working. |
| `.project-card` | portfolio | Icon + h4 + p + tag chips. Identical-grid risk: see audit. |
| `.feature` (R·iving) | brand | Icon + h3 + p in 3×2 grid. Identical-grid risk. |
| `.step` (4-step pipeline) | both | Numbered step with icon. Used identically on Riving "How it works" and TrashScan "System". |
| `.faq-item` | brand | `<details>` element, plus icon. Standard FAQ. |
| `.cta` | brand | Centered icon + h2 + p + button. Standard. |
| `.marquee` / `.route-marquee` | shared | Horizontal scrolling skill list. Decorative, balanced. |
| `.gradient` (text) | shared | `background-clip: text` on `--gold → --blue` linear gradient. **Absolute-ban violation in impeccable.** Used in hero titles and several inline emphasis spots. Plan to remove. |

## Motion

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-quart-ish). Matches impeccable's "ease-out exponential" rule. Keep.
- Hover lifts: `translateY(-2px)` on buttons, `-6px` on featured cards. Tasteful.
- Reveals: GSAP + ScrollTrigger (`.fade-in`, `.reveal`). Staggered 1–5 on hero.
- Background: `bg-glow` radial-gradient blobs are decorative-only, not load-bearing. Acceptable.
- `prefers-reduced-motion: reduce` collapses all transitions to 0.01ms — already correct. Keep.

> **Action note:** GSAP SplitText is loaded but not visibly used. If unused, drop it (saves a request).

## Accessibility

| Need | Status |
|---|---|
| Reduced motion | Implemented. |
| Color contrast (AA) | `--text-dim` on `--bg-0` measures around 7:1 — fine. `--text-mute` on `--bg-2` is closer to 4:1, marginal for body but OK as caption. **No issues at body sizes.** |
| Focus visible | Not explicitly defined. Browsers fall back to default outline. **Add `:focus-visible` styles for `.btn`, `.nav-links a`, `.faq-item summary`.** |
| Keyboard reachability | Mobile nav toggle is a `<button>` (good). FAQ uses `<details>` (good). All links are `<a>`. **Verify Tab order top-to-bottom matches reading order.** |
| Alt text | Decorative SVGs carry `aria-hidden="true"`; phone-mockup status icons are decorative and unlabeled (correct). The R·iving icon `<img>` in featured-card has descriptive alt (good). |
| Screen-reader landmarks | `<nav>`, `<header>`, `<section>`, `<footer>` used. **No `<main>` wrapper.** Add one. |

## Anti-patterns currently in the code

These are absolute-ban violations from `impeccable`'s shared design laws. Address in the high-confidence-fix pass:

1. **`.gradient` text class** (every site). `background-clip: text` over a `--gold → --blue` gradient. Used inside hero titles and emphasis spans. Replace with solid color + weight/size for emphasis.
2. **Identical-card grid risk** on portfolio's "Other projects" (only 2 cards now, low risk; will become a problem as projects are added) and R·iving's `.features` 3×2 (six identical icon-h3-p cards). Vary internal density or replace one card's content shape.
3. **Pure white `--text`** (`#fff`). Tint to `oklch(0.99 0.005 264)` per shared design law.
4. **Inter overriding Manrope on body.** Pick one. Recommend Manrope.

## Tokens to add (proposed)

| Token | Value | Why |
|---|---|---|
| `--text` (revised) | `#fafafb` | Tint white toward blue, per design law. |
| `--shadow-sm` | `0 4px 12px rgba(0, 0, 0, 0.4)` | Standardize card shadows (currently inline). |
| `--shadow-md` | `0 8px 24px rgba(10, 132, 255, 0.25)` | Standardize button shadows. |
| `--space-section-tight` | `64px` | Vary section rhythm. |
| `--space-section` | `100px` | Existing. |
| `--space-section-loose` | `120px` | Vary section rhythm. |
