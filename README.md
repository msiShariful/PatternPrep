<div align="center">

# PatternPrep

**Master 18 patterns, not 2,000 problems.**

A fully static FAANG interview prep platform — pattern-first problem bank, an interactive
pattern mind map, visual data-structure guides, progressive hints, system design, behavioral
prep, and guided roadmaps. No backend, no build step, no account.

![Static site](https://img.shields.io/badge/static-no%20backend-1a73e8)
![Dependencies](https://img.shields.io/badge/dependencies-zero-1e8e3e)
![Java solutions](https://img.shields.io/badge/solutions-Java-f29900)
![License: MIT](https://img.shields.io/badge/license-MIT-8430ce)

**[▶ Live demo](https://msishariful.github.io/PatternPrep/)**

<img src="docs/screenshots/home.png" alt="PatternPrep home — progress ring and pattern path" width="800">

<img src="docs/screenshots/pattern-map.png" alt="Pattern map — the whole DSA pattern taxonomy as an interactive full-screen mind map, with live progress chips linking into practice" width="800">

</div>

---

## Why

Most candidates brute-force LeetCode: hundreds of random problems, little retention. Interviewers,
meanwhile, reuse a small set of algorithmic patterns. PatternPrep organizes preparation around
those patterns — learn one, and every new problem in that family becomes a variation of something
you already know. Hints are deliberately progressive (pattern → approach → pseudocode) so you
struggle productively instead of flipping straight to solutions.

## Features

### 🗺️ Guided roadmaps
Two connected routes through everything on the site, each stage linking to real material with live
progress and a concrete *"move on when"* gate:

| Route | Target | Length | Emphasis |
|---|---|---|---|
| **Junior / Mid** | L3–L4 | ~12 weeks | Coding rounds first; CS breadth; design vocabulary |
| **Senior+** | L5+ | ~10 weeks | Hard-first patterns; 3 weeks of system design; leadership narrative |

<img src="docs/screenshots/roadmap.png" alt="Junior roadmap with connected stages" width="800">

### 🧩 Pattern-first problem bank — 107 problems, 18 patterns, 6 phases
Two Pointers · Sliding Window · Prefix Sums · Intervals · Fast & Slow Pointers · Linked List
Reversal · Binary Search · Monotonic Stack · Heaps/Top-K · Trees BFS/DFS · Tries · Graphs ·
Union-Find · Greedy · Bit Manipulation · Backtracking · Dynamic Programming · Advanced DP
(knapsack, tree, state-machine, and interval DP).

Every problem ships with:
- a statement with worked example and difficulty tag (Easy / Medium / Hard / Super Hard),
- **three progressive hints** that unlock one level at a time — no accidental spoilers,
- a **Java solution** (syntax-highlighted, collapsed by default) with approach explanation and
  time/space complexity.

<img src="docs/screenshots/problem-hints.png" alt="Problem page with progressive hint stepper" width="800">

The bank also opens as a **full-screen Pattern map** — an interactive mind map of the whole DSA
landscape (16 structure branches → pattern families → techniques) with live progress chips that
deep-link into practice.

### 🧠 Data structures, zero to master
Sixteen visual guides — one per branch of the Pattern map — that teach each structure from first
principles to senior-level insight, built to be absorbed fast rather than skimmed:

- **anatomy diagrams** — labeled cell/pointer figures, SVG trees and graphs,
- **interactive walkthroughs** — click through an insert shifting an array, a sift-up bubbling to
  the root, a BFS wave washing over a graph, a call stack unwinding — one change per frame,
- **color-coded Big-O strips** with an honest one-line *why* per row,
- callouts in four voices: *mental model*, *rule of thumb*, *watch out*, and *pro insight*
  (cache locality, O(n) heapify, TimSort stability, load-factor rehashes),
- **tap-to-reveal self-checks** for active recall, and a **4-rung mastery ladder** linking each
  guide into the problem bank.

<img src="docs/screenshots/structures-guide.png" alt="Array guide — Java operations, interactive insert walkthrough, and callouts" width="800">

### 📚 Beyond the algorithms
- **DSA Fundamentals** — Big O, core data structures, and a 6-step protocol for reading problems.
- **System Design** — scalability, load balancing, caching, SQL vs NoSQL, message queues, CAP —
  plus step-by-step walkthroughs of a URL shortener, rate limiter, and news feed.
- **Databases & SQL** — joins, indexing, normalization, transactions, and classic interview queries.
- **CS Fundamentals** — OSI model, TCP vs UDP, "what happens when you type a URL", processes vs
  threads, concurrency, memory & GC.
- **Behavioral** — the STAR framework with a worked answer, the story-bank matrix, **all 16 Amazon
  Leadership Principles**, Google/Meta signal breakdowns, senior-scope storytelling, and questions
  to ask back.

### 🌙 Light & dark themes
Defaults to your system preference; toggle any time from the top bar. The choice persists, with no
flash-of-wrong-theme on load.

<img src="docs/screenshots/home-dark.png" alt="PatternPrep in dark mode" width="800">

### 📈 Progress that stays yours
Solved/attempted status, hint reveals, and topic read-state are stored in `localStorage` — no
account, no server, nothing leaves your browser. Export a JSON backup any time (⋮ menu) and import
it on any machine. Clearing site data resets progress, so keep a backup.

## Quick start

```sh
git clone https://github.com/msiShariful/PatternPrep.git
cd PatternPrep
python3 -m http.server 8000   # any static server works
# open http://localhost:8000
```

No install, no build — opening `index.html` directly in a browser also works.

## Tech

Deliberately boring: semantic HTML, modern CSS (custom properties, grid), and framework-free
JavaScript. Hash-based routing, a ~60-line dependency-free syntax highlighter, and SVG progress
rings drawn at runtime. The entire site is static files — host it on GitHub Pages, Netlify, or a
USB stick.

```
index.html          shell — top app bar, drawer, script tags
css/style.css       design system (Material 3 Expressive, tokens at top)
js/app.js           router + all views
js/storage.js       localStorage progress, export/import
js/highlight.js     Java/SQL highlighter
js/data/            all content as plain JS data files
```

## Contributing

Content additions (problems, topics) are plain data files — see the schemas in
[`CLAUDE.md`](CLAUDE.md) and follow the existing format. Keep the invariants: hints unlock
progressively, solutions stay collapsed by default, and zero dependencies.

## License

[MIT](LICENSE) © 2026 Shariful Islam
