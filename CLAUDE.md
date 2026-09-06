# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # vite dev server
npm run build     # tsc (typecheck, noEmit) && vite build
npm run preview   # serve dist/
```

No linter, no test suite. `npm run build` is the only gate — tsconfig has `strict`, `noUnusedLocals`, and `noUnusedParameters`, so an unused import fails the build.

## What this is

A single-page React portfolio for Rudransh Singh Tomar (smart contract security engineer). Everything renders from one route; there is no router, no backend, no data fetching. Vite + React 18 + Tailwind + framer-motion + react-three-fiber.

## Architecture

**Content lives in `src/data/profile.ts`** — every string, stat, chain, project, and achievement. Components only read from it. Change copy there, never inline in a section. (A comment in that file notes a v2 intent to populate it from the GitHub API at build time.)

**`App.tsx` is the whole page layout**, and the stacking order is the design:
1. `LedgerBase` — fixed `z-0` backdrop for the entire site (grid + a field of real research-doc titles, plus a brighter copy revealed inside a cursor-trailing spotlight).
2. `HeroSection` — a pinned 3-screen scroll track (`#hero-track`) where scroll progress scrubs a 3D contract block apart and back together.
3. A single `z-10` rounded-top panel holding every other section — it slides *over* the pinned hero. That rounded corner + shadow is what sells the takeover; don't flatten it.
4. `Storyteller` (SPECTER) — fixed pixel-art narrator docked across the page.

**Section wiring is by attribute, not imports.** Sections carry `id="..."` (Navbar anchor targets: `#about`, `#journey`, `#projects`, `#wins`, `#contact`) and `data-story="..."` (Storyteller's IntersectionObserver key, matching `SECTION_LINES` in `Storyteller.tsx`). Adding a section means adding both, plus a line in `SECTION_LINES` and `STORY_ORDER`.

**Motion primitives live in `src/components/motion.tsx`** — `Parallax`, `FadeIn`, `ScrambleText`, `HighlightText` (scroll-scrubbed word reveal fed by `aboutSegments`-shaped `TextSegment[]`), `Counter`. Reuse these rather than hand-rolling framer-motion in a section.

**Transform layering rule (from Hero's pills):** one writer per element. Nesting order outer→inner is FadeIn (entrance) · Parallax (scroll) · mouse-parallax · float · magnetic — each on its own wrapper, never two transforms on the same node.

## Graceful degradation is load-bearing

Three independent fallback paths already exist; preserve them when touching these areas:

- **Capability modes** — `Hero.tsx`'s `detectMode()` returns `full` (fine pointer, ≥768px), `lite` (touch/small: fewer shards, no tilt), or `static` (`prefers-reduced-motion`: no pin, no scrub, no 3D). Effects gate on `matchMedia('(pointer: fine)')` throughout.
- **3D is lazy + boundaried** — `Scene` is `lazy()`-imported so `three` lands in its own chunk, wrapped in `SceneBoundary` (`hero3d/ErrorBoundary.tsx`) which drops the whole 3D layer to a DOM fallback if WebGL is missing or the scene throws.
- **StringTune is optional** — `initStringTune()` is called in a try/catch; only on success does `App` add `st-ready`/`cursor-hidden` to `<html>`. If it fails the native cursor stays and the site is fine.

## Conventions

- Colors and fonts come from `tailwind.config.js` (`ink`, `surface`, `paper`, `electric`, `electric-glow`, `neon`; `font-display` Kanit, `font-mono` JetBrains Mono). Use the tokens, not hex literals — except inside `hero3d/` and `Storyteller.tsx`, where three.js and canvas need numeric/string literals that mirror the same palette.
- `src/index.css` holds the effects Tailwind can't express: `.hero-heading`, `.vibrant-gradient`, `.ledger-grid`, `.spotlight-layer`, `.st-cursor*`, `.hover-bg`, `.specter-*`. It ends with a `prefers-reduced-motion` block that neutralizes animations — extend it when adding a keyframe animation.
- Shared UI atoms are in `components/ui.tsx` (`ContactButton`, `GhostButton`, `SectionTag`) and `GradientHeading.tsx` (`base="ink"` variant for the white Research section).
- `hero3d/shards.ts` is deterministic by design — a seeded `mulberry32` PRNG so shard positions agree across every frame and reload. Never introduce per-frame randomness there.
- StringTune drives cursor/magnetic effects via DOM attributes; spread the bags from `lib/stringtune.ts` (`magnetic()`, `cursorFollower()`) instead of writing the attributes by hand.
