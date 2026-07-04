# Class 5 Maths Worksheet Generator

Version 1.0 · Prepared for personal/home-education use · Repository: github.com/jainviyom/math-quiz-app
· Live app: https://jainviyom.github.io/math-quiz-app/

---

## 1. Executive Summary

The Class 5 Maths Worksheet Generator is a single-page, browser-based app that generates
randomized CBSE/NCERT Class 5 Math-Magic practice worksheets, chapter by chapter, and produces a
print-ready paper (with an answer key) via the browser's own print/Save-as-PDF function.

It was built for a parent to generate fresh, varied practice papers for a Class 5 CBSE student
without manually writing questions or reusing the same fixed worksheet. Every question is produced
by a small randomized generator function (different numbers, names, and wording each time), rather
than pulled from a fixed bank of pre-written questions, so no two generated papers are identical
and answers can't be memorized from a previous attempt.

The app deliberately has **no backend, no database, and no build step** — it is three static files
(`index.html`, `app.js`, `questions.js`) that run entirely in the browser, hosted for free on
GitHub Pages. This keeps it usable offline (by opening `index.html` directly) and trivial to host,
fork, or hand to someone else with no installation.

---

## 2. Business Requirements Document (BRD)

### 2.1 Purpose & Background

The requester's daughter is in Class 5, CBSE board, studying from NCERT's Math-Magic textbook. She
needs regular practice papers covering the syllabus chapter by chapter, but hand-writing a fresh
worksheet each time (or reusing the same one) is slow and doesn't scale, and reused worksheets let
a student memorize answers rather than practice the underlying skill. The app automates paper
generation: pick a chapter (or several), pick a difficulty and question count, and get an
instantly generated, printable paper with an answer key.

### 2.2 Business Objectives

| # | Objective |
|---|---|
| 1 | Generate a fresh, randomized worksheet for any NCERT Class 5 Math-Magic chapter (or combination of chapters) in under a few seconds. |
| 2 | Guarantee that repeated generations produce different questions, so practice papers can be reused indefinitely without the student memorizing answers. |
| 3 | Produce a paper that's ready to print or save as a PDF immediately, with no extra tools (no PDF library, no account, no install). |
| 4 | Always ship an answer key alongside the questions, so a parent can grade without doing the maths themselves. |
| 5 | Cover the full breadth of the NCERT Class 5 syllabus, not just arithmetic drills — including geometry, symmetry, data handling, and measurement. |
| 6 | Keep the app free to run and easy to access from any device (phone, tablet, laptop) via a browser link. |

### 2.3 Target Users / Personas

| Persona | Description | Primary needs |
|---|---|---|
| Parent (primary user) | Generates and prints worksheets for their child; grades using the answer key | Fast chapter selection, reliable print/PDF output, correct answers |
| Student (Class 5, CBSE) | Solves the generated worksheet on paper | Clear, age-appropriate question wording; varied questions across attempts |
| Future maintainer (the requester, as a developer) | May extend the question bank or add features later | Readable, ungrouped generator functions that are easy to extend per chapter |

### 2.4 Scope — In Scope (delivered)

- Full coverage of all **14 chapters** of NCERT Class 5 Math-Magic (see §7 for the complete
  chapter-by-chapter question catalog)
- **51 distinct question generator functions** across those chapters, each producing randomized
  numbers/names/wording on every call — no fixed question bank
- Three question formats per the requester's spec: **MCQ**, **fill-in-the-blank**, and **word
  problems**, selectable as "mixed" or restricted to one format
- Chapter multi-select (tick any combination, or "Select all chapters")
- Configurable **question count** (4–40), **difficulty** (Easy / Medium / Hard / Mixed), and a
  free-text **paper title**
- Even distribution of generated questions across all selected chapters (round-robin chapter
  sequencing, then shuffled), so a multi-chapter paper doesn't cluster all its questions from one
  topic
- **Answer key**, auto-paginated onto its own printed page, numbered to match the question paper
- Printable layout with Name / Date / Marks fields and per-question mark values, using the
  browser's native print dialog (no PDF-generation dependency)
- **Fully offline-capable**: works by double-clicking `index.html` locally, with no server
  required
- **Hosted publicly** on GitHub Pages for access from any device via a URL

### 2.5 Scope — Out of Scope (current version) / Roadmap

| Item | Status |
|---|---|
| Interactive/auto-graded quiz mode (answering in-browser, instant scoring) | Not built — current version is a printable worksheet generator only, per the requester's chosen scope |
| Persisting/saving generated papers (history of past worksheets) | Not started — each generation is ephemeral until printed |
| User accounts / multiple children's profiles | Not started — single-user, no login |
| Difficulty adapting to a student's past performance | Not started — difficulty is a manual per-paper setting, not tracked over time |
| Diagrams/images for geometry questions (angles, shapes, nets) | Not started — geometry questions are described in text rather than rendered visually |
| Other subjects / other classes | Not started — scoped to Class 5 CBSE Maths only |
| Automated UI regression tests | Not started — verified manually via a one-off Playwright script during development, not checked into the repo as a test suite |

### 2.6 Functional Requirements

| Area | Requirement |
|---|---|
| Chapter selection | User can tick any subset of the 14 chapters, or click "Select all chapters" to toggle all at once |
| Paper settings | User can set number of questions (clamped to 4–40), difficulty (Easy/Medium/Hard/Mixed), question-type mix (Mixed/MCQ/Fill-in/Word), and a paper title |
| Validation | Clicking "Generate worksheet" with zero chapters selected shows an alert and does not generate a paper |
| Generation | Each click of "Generate worksheet" builds a new, independently randomized set of questions — no caching or repetition across generations |
| Question distribution | Questions are spread round-robin across the selected chapters (not randomly weighted, which could over-represent one chapter), then the final order is shuffled |
| Difficulty handling | When "Mixed" difficulty is selected, each individual question independently gets a random difficulty (Easy/Medium/Hard) rather than a fixed difficulty for the whole paper |
| Question-type filtering | When a specific question type (MCQ/Fill-in/Word) is selected, only generators of that type are used per chapter; if a chapter has no generator of the requested type, it falls back to any of that chapter's generators rather than failing |
| MCQ rendering | Multiple-choice questions render 4 lettered options (a–d) with no duplicate option text and the correct answer always present among the options |
| Answer key | Every generated question has a corresponding numbered entry in the Answer Key section, in the same order as the questions |
| Print output | The "Print / Save as PDF" button invokes the browser print dialog; on-screen-only controls (chapter picker, settings panel, buttons) are hidden in the print stylesheet; the Answer Key is forced onto a new printed page |

### 2.7 Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Worksheet generation (up to 40 questions) completes instantly (client-side computation only, no network round-trip) |
| Availability | Hosted on GitHub Pages (static hosting); also works fully offline from a local file copy |
| Portability | No install, no build step, no package manager — works in any modern desktop or mobile browser |
| Cost | $0 — GitHub Pages hosting is free for a public repository; no paid APIs or services used |
| Maintainability | Each chapter's question logic is isolated to its own small set of generator functions in `questions.js`, so new question types can be added per chapter without touching other chapters |
| Accessibility of source | Public GitHub repository, plain HTML/CSS/JS — auditable without specialized tooling |

### 2.8 Assumptions & Constraints

- The user has a modern browser (Chrome, Edge, Safari, or Firefox) with JavaScript enabled.
- Printing to PDF relies on the browser's own print-to-PDF capability rather than a bundled PDF
  library — output fidelity depends on the browser used.
- Question content is aligned to the NCERT Math-Magic Class 5 textbook's chapter list and CBSE
  conventions, based on general curriculum knowledge rather than a licensed copy of the textbook;
  wording and scope may not match the textbook's exact phrasing or example numbers chapter-for-chapter.
- Geometry/3D-shape/mapping questions are text-described (no generated diagrams), which constrains
  how visually-dependent a question can be (e.g., no "identify this shape in the picture" questions).

### 2.9 Success Metrics

| Metric | Target |
|---|---|
| Chapter coverage | All 14 NCERT Class 5 Math-Magic chapters represented |
| Question variety per chapter | At least 2 distinct generator functions per chapter (actual: 2–5, avg. ~3.6) |
| Regenerated-paper uniqueness | Re-generating with the same settings should very rarely produce an identical set of 12+ questions (achieved via per-question randomized numeric ranges and shuffled chapter/question ordering) |
| Cost to run | $0 recurring cost |
| Time to first worksheet | Under 1 minute from opening the app to a printed/exported paper |

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                 Browser                                   │
│                                                                            │
│  index.html                                                               │
│   - chapter checkboxes, paper-settings controls, worksheet output area   │
│   - loads questions.js then app.js via <script> tags (no bundler)        │
│                                                                            │
│  questions.js                            app.js                          │
│  ┌──────────────────────────┐   uses    ┌───────────────────────────┐    │
│  │ generic helpers:          │◀─────────│ renders CHAPTERS into      │    │
│  │  randInt/choice/shuffle/  │           │  checkboxes                │    │
│  │  gcd/lcm/number-to-words/ │           │ builds a randomized        │    │
│  │  Indian-comma formatting  │           │  chapter sequence           │    │
│  │                            │           │ picks a generator per       │    │
│  │ 51 question generator     │──questions▶ question, applying the      │    │
│  │  functions, grouped into  │   objects  │  chosen difficulty/type     │    │
│  │  the CHAPTERS registry    │           │ renders questions + answer  │    │
│  │  (14 chapters)            │           │  key into the DOM            │    │
│  └──────────────────────────┘           │ wires "Print / Save as PDF" │    │
│                                          │  to window.print()          │    │
│                                          └───────────────────────────┘    │
│                                                                            │
│  <style> in index.html: on-screen layout + a @media print block that     │
│  hides controls and forces the Answer Key onto a new printed page        │
└──────────────────────────────────────────────────────────────────────────┘
```

There is no server-side component: all logic — question generation, randomization, rendering, and
print formatting — executes client-side in the browser. GitHub Pages serves the three static files
unmodified; there is nothing to deploy beyond a `git push`.

### 3.2 Component Responsibilities

| Component | File | Responsibility |
|---|---|---|
| Page shell & styling | `index.html` | Defines the DOM structure (chapter grid, settings panel, worksheet output, answer key section) and all CSS, including a `@media print` block that hides interactive controls and forces a page break before the answer key |
| Question bank | `questions.js` | Generic random-number/string helpers; the Indian-numbering-system word/comma formatters; 51 question-generator functions (one function per question "shape" within a chapter); the `CHAPTERS` array that registers each chapter's `id`, display `name`, and its list of `{type, fn}` generators |
| App logic | `app.js` | Renders the chapter checklist from `CHAPTERS`; handles "Select all chapters"; reads paper settings on Generate; builds a shuffled, round-robin chapter sequence for the requested question count; picks a generator per question (respecting the type filter and per-question difficulty); renders questions (with lettered MCQ options or a ruled answer space) and the matching answer key; wires the Print button to `window.print()` |
| Hosting | GitHub Pages (`jainviyom/math-quiz-app`, `main` branch, root) | Serves the static files over HTTPS at a public URL; rebuilds automatically on every push to `main` |

### 3.3 Data Flow — Worksheet Generation (detailed)

1. User ticks one or more chapter checkboxes (or clicks "Select all chapters") and sets the number
   of questions, difficulty, question-type mix, and paper title.
2. On **Generate worksheet**: `app.js` reads the selected `CHAPTERS` entries and validates at least
   one is selected (otherwise alerts and stops).
3. `buildChapterSequence()` repeatedly shuffles the selected chapter list and lays it end-to-end
   until it reaches the requested question count, then shuffles the resulting sequence again — this
   spreads questions evenly across chapters while keeping final ordering random.
4. For each entry in that sequence: `pickGenerator()` selects one of that chapter's generator
   functions (filtered to the requested question type where possible), a per-question difficulty is
   resolved (fixed, or randomly chosen per question when "Mixed" is selected), and the generator
   function is called to produce a `{ type, marks, text, options?, answer }` object.
5. Each question object is rendered into the on-screen question list (MCQ options lettered a–d;
   fill-in and word questions get a ruled answer space) and its `answer` is appended to the Answer
   Key list in the same order.
6. **Print / Save as PDF** calls `window.print()`; the `@media print` stylesheet hides the settings
   panel and buttons and forces the Answer Key onto a new page, so the printed/exported PDF contains
   only the paper itself.

### 3.4 Deployment Architecture

```
 Local machine                        GitHub                              GitHub Pages
┌───────────────────┐   git push    ┌───────────────────────────┐  auto-build  ┌─────────────────────────────┐
│ math-quiz-app/     │ ─────────────▶│ jainviyom/math-quiz-app     │─────────────▶│ jainviyom.github.io/         │
│ (source: index.html│               │   branch: main               │              │  math-quiz-app/               │
│  app.js,           │               │   (public repo)              │              │  (static file serving,        │
│  questions.js)     │               └───────────────────────────┘              │   HTTPS, no server runtime)   │
└───────────────────┘                                                            └─────────────────────────────┘
```

GitHub Pages was enabled via the GitHub REST API (`POST /repos/{owner}/{repo}/pages`) with the
source set to the `main` branch, root path — no separate `gh-pages` branch or build workflow is
used, since the app has no build step. Any future `git push` to `main` republishes the live site
automatically within roughly a minute.

---

## 4. Tech Stack

### 4.1 Summary

| Layer | Choice | Notes |
|---|---|---|
| Markup | Plain HTML5 (`index.html`) | Single page, no templating engine |
| Styling | Plain CSS (inline `<style>` in `index.html`) | No framework/CDN dependency; includes a dedicated `@media print` block |
| Client logic | Vanilla JavaScript (ES6+), two files (`questions.js`, `app.js`) | No framework (React/Vue/etc.), no bundler, no transpilation |
| Data/question model | In-memory JS objects, generated at click-time | No database, no JSON fixtures — every question is computed from a generator function |
| Hosting | GitHub Pages (static hosting) | Free for public repos; serves the repo's `main` branch root directly |
| Source control | GitHub — `jainviyom/math-quiz-app` (public repository) | |

### 4.2 Why This Stack

- **No backend, no database, no build step** — the entire feature set (randomized question
  generation, chapter selection, print output) is achievable in the browser alone, so introducing a
  server, framework, or bundler would add operational and maintenance cost with no corresponding
  benefit.
- **Print-to-PDF via the browser** avoids a client-side PDF-generation dependency (e.g. jsPDF) —
  the browser's own print engine already handles pagination, fonts, and page breaks reliably via
  standard CSS (`@media print`, `page-break-before`).
- **Static hosting (GitHub Pages)** matches the app's nature: nothing to compute or store
  server-side, so a CDN-backed static host is both the cheapest ($0) and simplest option, and the
  same files also work by double-clicking `index.html` with no hosting at all.
- **Vanilla JS over a framework**: the app's interactivity (checkbox state, one generate action,
  re-rendering a list) is simple enough that React/Vue would add a build step and dependency
  surface without a corresponding reduction in code complexity.

### 4.3 Dependencies

None. There are no `package.json`, npm packages, or CDN script/style includes — `index.html`,
`app.js`, and `questions.js` are the entire runtime.

---

## 5. Data Model — Question & Chapter Schema

### 5.1 Question object shape

Every generator function returns a plain object of this shape:

```js
{
  type: 'mcq' | 'fill' | 'word',   // rendering + answer-key format
  marks: 1 | 2,                    // shown next to the question, summed into the paper's total
  text: string,                    // the question text (already includes any blank as "______")
  options?: string[],              // present only when type === 'mcq'; always includes `answer`,
                                    // shuffled, and guaranteed free of duplicate option strings
  answer: string,                  // the value written into the Answer Key
}
```

### 5.2 Chapter registry (`CHAPTERS`)

```js
{
  id: string,          // stable slug, e.g. 'fish-tale'
  name: string,        // display name shown in the chapter checklist and question tags
  generators: [
    { type: 'mcq' | 'fill' | 'word', fn: (difficulty) => Question }
  ]
}
```

`app.js` never hard-codes chapter or question logic — it only iterates `CHAPTERS`, so adding a new
chapter or question type is a `questions.js`-only change (see §9, Roadmap).

### 5.3 Difficulty scaling convention

Each generator function accepts a `difficulty` argument (`'easy' | 'medium' | 'hard'`) and widens
its random-number ranges (and, for some chapters, the number of digits/steps involved) as
difficulty increases. When the paper-level difficulty setting is "Mixed," `app.js` chooses a random
difficulty per question rather than per paper, so a single "Mixed" paper naturally blends easy and
hard questions.

---

## 6. Application Reference (Files)

| File | Role |
|---|---|
| `index.html` | Page structure, all CSS (screen + print), and the two `<script src>` includes |
| `questions.js` | Helper functions (`randInt`, `choice`, `shuffle`, `gcd`, `lcm`, `formatIndian`, `numberToWordsIndian`, `isPrime`, `ordinal`) + 51 question-generator functions + the `CHAPTERS` registry |
| `app.js` | DOM wiring: renders the chapter checklist, "Select all," Generate button handler (sequencing, generation, rendering), Print button handler |
| `README.md` | End-user quick-start instructions |
| `docs/PROJECT_DOCUMENTATION.md` | This document |

There is no routing, no server endpoints, and no persistence layer — the entire "application" is
these files plus the browser's DOM and print APIs.

---

## 7. Feature Documentation — Chapter & Question Catalog

All 14 NCERT Class 5 Math-Magic chapters, with each chapter's question generators and format:

| # | Chapter | Generators (format) |
|---|---|---|
| 1 | The Fish Tale (Large Numbers & Place Value) | Place value of a digit (MCQ) · Number name in words (Fill) · Expanded form (Fill) · Compare two numbers with >/</= (MCQ) · Successor/predecessor (Fill) |
| 2 | Shapes and Angles | Classify an angle — acute/right/obtuse/straight/reflex (MCQ) · Find a triangle's third angle (Fill) · Right-angle fact (Fill) · Name a polygon by side count (MCQ) |
| 3 | How Many Squares? | Total squares in a rows×cols grid (Fill) · Find rows from total + columns (Fill) · Tiling word problem (Word) |
| 4 | Parts and Wholes (Fractions) | Fraction of a whole from a word context (Fill) · Equivalent fraction (MCQ) · Compare two fractions (MCQ) · Add/subtract like fractions (Fill) |
| 5 | Does it Look the Same? (Symmetry) | Lines of symmetry of a named shape (Fill) · Does a capital letter have a line of symmetry (MCQ) |
| 6 | Be My Multiple, I'll be Your Factor | List all factors of a number (Fill) · Prime or composite (MCQ) · LCM of two numbers (Fill) · HCF of two numbers (Fill) · Divisibility check (MCQ) |
| 7 | Can You See the Pattern? | Next number in an arithmetic sequence (Fill) · Missing middle term in a sequence (Fill) · Triangular-number dot-pattern word problem (Word) |
| 8 | Mapping Your Way | Map scale → actual distance (Word) · Actual distance → map scale (Word) · Direction after turns (MCQ) |
| 9 | Boxes and Sketches (3D Shapes) | Faces/edges/vertices of a named solid (MCQ) · Identify a solid from its faces/edges/vertices (MCQ) |
| 10 | Tenths and Hundredths (Decimals) | Fraction → decimal (Fill) · Decimal → fraction (Fill) · Add/subtract decimals (Fill) · Compare two decimals (MCQ) · Decimal place value — tenths/hundredths (MCQ) |
| 11 | Area and its Boundary | Rectangle area (Fill) · Rectangle perimeter (Fill) · Square area or perimeter (Fill) · Find a missing side from perimeter (Word) · Composite (L-shaped) area (Word) |
| 12 | Smart Charts (Data Handling) | Total/max/min/difference from a data table (Word) · Pictograph reading (Word) |
| 13 | Ways to Multiply and Divide | Multi-digit multiplication (Fill) · Division with remainder (Fill) · Multiplication word problem (Word) · Division/sharing word problem (Word) |
| 14 | How Big? How Heavy? (Measurement) | Length conversion — km/m/cm (Fill) · Weight conversion — kg/g (Fill) · Volume conversion — L/mL (Fill) · Mixed measurement word problem (Word) |

**Totals:** 14 chapters · 51 question generators · 3 question formats (MCQ / Fill-in-the-blank /
Word problem) · 3 difficulty levels plus a "Mixed" mode.

---

## 8. Setup & Deployment Guide

### 8.1 Run locally (no install)

1. Clone or download the repository.
2. Double-click `index.html` — it opens directly in the default browser and works fully offline.

No `npm install`, no server, and no build command are required.

### 8.2 Redeploy the live site

The live site is served directly from the `main` branch root by GitHub Pages. To publish a change:

```bash
git add -A
git commit -m "describe the change"
git push origin main
```

GitHub Pages rebuilds automatically within about a minute of the push; the live URL
(https://jainviyom.github.io/math-quiz-app/) does not change.

### 8.3 GitHub Pages configuration (one-time, already done)

Pages was enabled via:

```
POST https://api.github.com/repos/jainviyom/math-quiz-app/pages
{ "source": { "branch": "main", "path": "/" } }
```

equivalent to ticking Settings → Pages → Source → `main` / `(root)` in the GitHub web UI. No
workflow file, custom domain, or build action is configured.

---

## 9. Known Limitations, Risks & Roadmap Notes

| Item | Note |
|---|---|
| No visual diagrams | Angle, shape, and 3D-solid questions are described in text rather than drawn, since the app has no diagram/SVG rendering — this limits how visually-dependent a question can be |
| No saved history | Each worksheet exists only until the next "Generate" click or page reload; there's no way to retrieve a previously generated paper's exact questions after leaving the page (only the printed/exported copy persists) |
| Answer key trusts generator correctness | There's no independent solver double-checking each generator's `answer` field — correctness relies on the generator's own arithmetic being right (validated via the randomized smoke test in §10, not via a formal proof) |
| Single subject/grade | Scoped to CBSE Class 5 NCERT Math-Magic only; extending to other grades/subjects would mean a new `CHAPTERS` registry, not a reuse of the existing one |
| No automated test suite in the repo | Correctness was verified with an ad-hoc script during development (7,650 generated-question assertions + a Playwright click-through), but no test files are checked into the repository itself |

---

## 10. Appendix — Verification Performed During Development

- **Automated logic smoke test**: every one of the 51 generator functions was called 50 times at
  each of the three difficulty levels (7,650 total generations) and checked for: no missing
  text/answer, no `NaN`/`undefined` leaking into question or answer text, and — for MCQs — no
  duplicate options and the correct answer always present among the options. This caught and fixed
  a duplicate-option bug in the place-value generator (Chapter 1) that occurred specifically when
  the selected digit was in the ones place.
- **Browser-driven UI test (Playwright, headless Chromium)**: confirmed all 14 chapter checkboxes
  render, "Select all chapters" checks all of them, "Generate worksheet" produces a matching
  question list and answer key, the empty-selection alert fires correctly, and no JavaScript
  console errors occur during generation.
- **Print-layout verification**: captured a screenshot with print media emulation to confirm the
  settings panel and buttons are hidden, and the Answer Key is pushed onto its own page, before
  and after a CSS fix (the on-screen title/subtitle were initially still visible in the print
  layout; fixed by scoping the `@media print` hide rule to `.app > h1, .app > .subtitle`).
