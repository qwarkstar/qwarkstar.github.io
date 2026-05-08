# Product

## Register

product

> Surface override: the project landing pages at `/justahead/` (R·iving) and `/trashscan/` use **brand** register. The homepage `/` and any future CV-shaped pages use **product** register: scannable, dense, recruiter-readable.

## Users

Four audiences, in priority order:

1. **Recruiters and hiring managers** running the Northeastern co-op cycle and FAANG-adjacent intern pipelines. They skim. They want years, stack, links to shipped things, GitHub. The homepage is the primary surface for this audience.
2. **Engineering managers and senior developers** who follow a recruiter's link and dig deeper. They want depth: how decisions were made, what got iterated, what the code actually does. The TrashScan firmware section and R·iving's privacy/architecture detail serve this audience.
3. **App Store visitors** landing on R·iving's marketing page. Consumer mindset: does this app do what I think? Is it safe? Will it drain my battery? Click "Download." This audience reads English copy and trusts the FAQ.
4. **Other students and collaborators** at Northeastern, hackathon teammates, NER club members. They want to know what Julian is into and whether they can work with him.

## Product Purpose

A portfolio + two project landing pages for Julian Rzezak (CS/CE @ Northeastern, 2nd year, Boston/Miami). The homepage proves Julian ships polished things. The project pages turn each shipped thing into a closeable case study.

Success looks like: a recruiter or hiring manager closes the tab holding three impressions in this order — *this person ships polished things; this person thinks like an engineer; this person has taste.*

## Brand Personality

Two-word personality: **considered, technical.**

A third register that runs through the existing copy: **calm and lived-in.** First-person where it earns it ("I'm a second-year CE/CS student", "the commuter who just needs five more minutes of sleep"), specifics over abstractions ("Boston / Miami", "0.9 mm enameled copper", "5 reads over 500 ms"), no urgency theater.

Voice rules already established in the codebase and worth preserving:
- No em dashes anywhere. Use commas, colons, periods, parentheses.
- Specifics beat adjectives. "Five reads before I believe you" beats "robust detection algorithm".
- The site can have a person in it. "Made with care in Miami" stays.
- Quietly confident, never bragging. Let the App Store badge and the working PCB do the bragging.

## Anti-references

What this should never look like:

- **Generic dev-undergrad portfolio.** Terminal-themed hero, ASCII art, `whoami` headings, neon green on black, typewriter effect on `Hello World`, `> ./run-portfolio.sh`. Cliched and category-reflex; reads as freshman year.
- **Crypto / AI-startup landing.** Animated gradient mesh blobs, glassmorphic cards, hero metrics in a 3-column "10x · 99.9% · $0" grid, "Built for the future" subhead. Templated 2024 SaaS vibe.
- **Resume-as-website.** Skill bars at "85% TypeScript", education timeline with dots, "About me" section that reads like an inflated resume bullet.
- **Awwwards-bait showreel.** Scroll-jacked transitions, mouse-follow gradient cursors, locked scrolls, parallax layered to oblivion. Tryhard, hostile to recruiters skimming on a flight.

## Design Principles

1. **Specifics over adjectives.** Every claim names a number, a stack, a city, a part. "0.9 mm copper" not "high-quality wiring". "iOS background audio + native geofencing" not "advanced architecture".
2. **The site is the proof.** Craft of the page itself is the demo reel for the "has taste" impression. Typography, spacing, copy, motion all read as the same person who wrote the firmware. No one element should feel templated.
3. **Restraint is the personality.** When in doubt, do less: smaller type, fewer cards, less color, less motion. The existing dark theme + single blue accent is correct. Don't add a gradient because the page feels quiet.
4. **One register per surface.** Homepage scans like a tool (recruiters skim it). Project pages tell a story (managers read them). Don't mix the two grammars on one page.
5. **Hiring managers read on a 14-inch laptop in a window.** Optimize for that, not for full-width 4K. Cap reading width, keep the hero readable above the fold at 1366×768.

## Accessibility & Inclusion

- **WCAG 2.1 AA** on color contrast and semantics across all three sites.
- **`prefers-reduced-motion`** is already respected in `style.css`; preserve and extend.
- **Keyboard navigation**: every interactive element reachable via Tab, with visible `:focus-visible` styling. Mobile nav toggle, FAQ details, all `.btn` and link styles need confirmed focus rings.
- **Alt text and aria-labels** on every icon, mockup image, and decorative SVG. Decorative SVGs should carry `aria-hidden="true"` (already mostly done).
- **Reading order**: the SR-only flow should match the visual flow — no decorative content trapped between heading and body.
