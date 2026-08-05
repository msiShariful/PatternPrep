# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this project is

**PatternPrep** — a fully static FAANG interview prep site. Core thesis: learning by algorithm *pattern* (Two Pointers, Sliding Window, DP, …) beats grinding random problems. No backend, no build step, no framework, no login — plain HTML/CSS/JS served as static files; all user progress lives in browser localStorage.

Current content: **107 problems across 18 pattern categories in 6 phases**, a **Pattern Atlas** mind map (16 data-structure branches → pattern families → techniques, ~180 nodes; the default view of `#/patterns`), **Data Structures guides** (16 zero-to-master visual guides on `#/structures`, one per Atlas branch — anatomy diagrams, interactive steppers, Big-O strips, self-checks, mastery ladders), DSA Fundamentals primer (9 topics), System Design (6 topics + 3 guided walkthroughs), Databases & SQL (5 topics), CS Fundamentals (6 topics), Behavioral (7 topics), and two guided roadmaps (Junior/Mid ~12 weeks, Senior+ ~10 weeks) whose stages link to real site content and track live progress.

## Running & verifying

```sh
python3 -m http.server 8000        # from repo root; or open index.html directly (file:// works)
```

There is no test suite. Verification is:

```sh
for f in js/*.js js/data/*.js; do node --check "$f"; done   # syntax
```

plus a data-integrity check (run with `node -e`, stub `global.window = {}`, eval every file in `js/data/`, then assert): unique problem ids, unique category orders, difficulty ∈ {Easy, Medium, Hard, Super Hard}, exactly 3 hints per problem, non-stub `solution.java`, contiguous `group` sequences when categories are sorted by `order`, that every roadmap item id resolves to a real category/topic, that every `cat` in `PATTERN_MAP` resolves to a real category id (plus: every category should stay reachable from at least one map node), and for structures guides: unique ids/orders, known hues and block types, every `learn` in `PATTERN_MAP` and every ladder `href` resolving to a real guide/category/route. After UI changes, crawl all hash routes in a browser (Playwright MCP) and check for console errors — every route must render a non-empty view and an active top-bar tab.

## Architecture

Everything is wired through `index.html` script tags (load order matters: data files → highlight.js → storage.js → app.js). No modules, no imports — each file attaches to `window`.

- `js/app.js` — the entire app: hash router (`#/roadmap`, `#/patterns[/map|/list]`, `#/pattern/:catId`, `#/problem/:catId/:probId`, `#/structures[/:id]`, `#/fundamentals[/:id]`, `#/system-design[/topic/:id|/design/:id]`, `#/database[/:id]`, `#/cs[/:id]`, `#/behavioral[/:id]`), all view renderers, top-bar/drawer chrome. HTML is built with string concatenation; **always escape user-visible data text with `esc()`** — except `blocks` content and topic `summary`/`intro` fields, which are trusted bundled data allowed to contain `<code>/<strong>` inline tags.
- `js/storage.js` — `window.Progress` over localStorage key `patternprep.v1`. Shape: `{ problems: { [id]: { status, hints, solution } }, topics: { "scope:topicId": true } }`. Topic read-state keys are scoped: `fund:` `st:` (structures guides) `sd:` `sdp:` (design walkthroughs) `db:` `cs:` `bh:`.
- `js/highlight.js` — tiny regex highlighter for `java`/`sql` code blocks; anything else is escaped verbatim.
- `js/data/*.js` — all content:
  - `problems-*.js` push categories onto `window.PROBLEM_BANK`
  - `fundamentals.js` → `window.FUNDAMENTALS`, `beyond-dsa.js` → `window.BEYOND_DSA`, `behavioral.js` → `window.BEHAVIORAL`, `roadmaps.js` → `window.ROADMAPS`, `pattern-map.js` → `window.PATTERN_MAP` (the Pattern Atlas taxonomy)
  - `structures.js` → `window.STRUCTURES_META` + the `window.STRUCTURE_TOPICS` array that `structures-a.js` … `structures-e.js` push guide topics onto (sorted by `order` in app.js)

## Data schemas (follow exactly when adding content)

Category: `{ id, name, group, order, tagline, blurb, problems[] }`. `order` is the global sort key and must be unique; categories in the same `group` must have contiguous orders (groups render as "phases"). Current phases/hues (`GROUP_HUE` in app.js): Arrays & Strings=blue, Pointers & Search=green, Stacks & Heaps=amber, Trees & Graphs=red, Greedy & Bits=teal, Recursion & DP=purple. New category ⇒ also add its 2-letter code to `AVATAR` in app.js and a `<script>` tag in index.html if it's a new file.

Problem: `{ id (kebab, globally unique), title, difficulty, description (plain text; paragraphs split on blank lines; paragraphs starting with Input/Output/Example render as mono blocks), hints: [exactly 3, progressive: pattern nudge → approach → pseudocode], solution: { java, explanation, time, space } }`. Solutions are Java-only, real implementations, `class Solution` style.

Topic (fundamentals/beyond-dsa/behavioral): `{ id, title, summary, blocks[] }` where a block is `{type:"p"|"h3", text}` | `{type:"list", items[]}` | `{type:"code", lang, text}` | `{type:"table", headers[], rows[][]}`. Inline emphasis via `<code>`/`<strong>` only — no markdown.

Roadmap stage items: `{kind:"patterns", ids:[categoryIds]}` | `{kind:"topics", scope, ids:[topicIds]}` | `{kind:"note", text}` (external, untracked). Ids must resolve — the integrity check above catches dangling references.

Pattern Atlas (`PATTERN_MAP`): `{ credit, branches[] }`; a node is `{ t, cat?, kids? }` where `t` is plain display text (escaped with `esc()` at render time), `cat` optionally links the node to a problem-bank category (renders a live `solved/total` chip), and top-level branches also carry `hue` (any hue family in css/style.css, including the extended set below) plus `learn` (a structures-guide id, rendered as a "guide" chip).

Structures guide topic: `{ id, order (1-16, display sort), title, hue, tagline, minutes, summary, blocks[] }`. Guides use the standard block types **plus visual blocks** rendered by app.js (`renderBlocks` + `bindBlocks`; hue flows via `--dg-main/--dg-c/--dg-on` CSS vars set on the page wrapper): `callout` (`variant: analogy|rule|pitfall|pro`, `title`, `text`), `bigO` (`rows: [[op, "O(…)", note]]` — cost chips auto-colored by `bigOClass`), `cells` (box diagram: `dir:"v"`, `index`, `arrows`, `cells:[{v, hl:1|2, dim}]`, `pointers:[{i, t, pos}]`, `caption`), `tree` (`root:{v, hl, kids[]}`), `graph` (`nodes:[{id, v, x, y, hl}]`, `edges:[{a, b, w, dir, hl}]`), `steps` (interactive stepper: `title`, `frames:[{d, cells|tree|graph}]` — same diagram kind across frames, spec object without its `type` key), `check` (`items:[{q, a}]` tap-to-reveal), `ladder` (`steps:[{t, d, href?, link?}]`). Diagram `v` values are escaped; captions/q/a/text are trusted (only `<code>/<strong>`). The Array guide in `structures-a.js` is the exemplar new guides must match. Taxonomy adapted from CodeWithNishchal's DSA Patterns mind map. The atlas renderer (`renderAtlas` in app.js) measures HTML nodes, lays out a left-to-right tidy tree, and draws SVG bezier ribbons in the branch hue; collapse/zoom state (`atlasSession`) is per-tab only. Map mode is an immersive workspace: `body.atlas-full` (added by `viewPatterns`, removed at the top of `route()`) breaks the view out of the content column, hides the footer, and locks page scroll so the canvas (`.atlas-stage`, viewport-height below the top bar) is the only scroll context; controls float over the canvas (`.atlas-float-*`). Zoom is anchored (cursor for ctrl+wheel, viewport center for buttons). The map/list preference persists under localStorage key `patternprep.patternsView` (a UI pref like theme — NOT part of Progress export).

## Product invariants (don't break these)

- **Hints unlock strictly one level at a time**; hint N+1 stays disabled until N is revealed. Reveal state persists.
- **Solutions are always collapsed on page load**, even if previously viewed. No accidental spoilers anywhere (list pages never leak hint/solution text).
- Progress must survive export → reset → import round-trips; `importJSON` must reject non-PatternPrep files and tolerate exports from older shapes (missing `topics`).
- Old URLs keep working — routes are the public API of a static site.

## Design system

Material 3 Expressive, light and dark themes. All colors are CSS custom properties; the dark set lives in `html[data-theme="dark"]` at the top of `css/style.css` (Google dark palette — bright hue mains like `#8ab4f8`, deep tonal containers). Theme is resolved by an inline script in `index.html` **before** the stylesheet loads (no flash): stored preference under localStorage key `patternprep.theme`, else `prefers-color-scheme`; the top-bar sun/moon button toggles and persists it (theme is NOT part of Progress export). Never hardcode a color in CSS or JS — use tokens; SVG ring colors are passed as `var(--hue)` strings and applied via `style="stroke:…"` (the `stroke` attribute doesn't support `var()`), with tracks styled by the `.ring-track` class.

Tokens at the top of `css/style.css`. Beyond the six phase hues there is an extended set for Pattern Atlas branches — indigo, magenta, orange, brown, slate, graphite — each defined as `--<hue>`, `--<hue>-c`, `--on-<hue>-c` in both themes (no `-soft` variant). Type: Outfit (display), Roboto (body), Google Sans Code (mono) via Google Fonts with system fallbacks. Five-plus-one hue system (see phases above); tonal container colors for chips/avatars; signature elements are the wavy SVG progress ring (`wavyRingSVG`) and per-problem "solve strips". Respect `prefers-reduced-motion`; keep visible focus states; mobile breakpoints at 1080px (tabs→drawer) and 760px.

## Conventions

- Commits: authored by the repo owner only (msiShariful) — never add a `Co-Authored-By: Claude` trailer.
- Vanilla ES5-flavored JS (var, string concat) to match existing code; no dependencies, no build tooling — keep it that way unless explicitly asked.
- Bulk content authoring (new problem sets) parallelizes well across subagents — give them the exact schema above and require `node --check` before they finish.
