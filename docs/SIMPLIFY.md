# Simplifying the Pragmatics site

This is the working plan for turning the Webflow export into a simple static
site that can live in this repo for years without upkeep. It is written so any
agent or person can pick up the next task cold.

Tracking issue: [#4](https://github.com/pragmaticsstudio/pragmatics-site/issues/4).
Every task below is a GitHub issue; the issue has the detailed steps and the
"done when" checks. This file explains the goal, the rules and the workflow.

## The goal

- **Content is plain markdown.** Facts go in frontmatter, prose goes in the
  body. No HTML in content files.
- **One small stylesheet.** `src/styles/brand.css` (tokens and base) and
  `src/styles/clean.css` (everything else). No Webflow CSS.
- **No client JavaScript.** Nothing the page needs at runtime.
- **No new dependencies.** `astro` stays the only one in `package.json`.
  One-off helpers (HTML→markdown, image resizing) are installed with
  `npm i --no-save` and never committed.
- **Only the assets we use,** under readable paths in `public/images/`.
- **Hosted on GitHub Pages** exactly as today (`.github/workflows/deploy.yml`,
  `public/CNAME`).

## Ground rules

1. **Keep the original wording.** Converting a page is a format change, not an
   edit. Don't summarize, shorten or "improve" the copy. If something reads
   wrong, leave it and mention it on the issue.
2. **Look the same, or better.** Reuse the existing `clean-*` classes before
   adding CSS. Check every page you touch at phone width (375px) and desktop
   width.
3. **Don't delete pages on your own.** Which legacy pages stay is the owner's
   call on [#6](https://github.com/pragmaticsstudio/pragmatics-site/issues/6).
4. **`npm run check` must not get worse.** Once
   [#5](https://github.com/pragmaticsstudio/pragmatics-site/issues/5) lands, run
   it before every push. A task may not add broken links; the final tasks get
   the count to zero.
5. **Small commits.** One page, post or case study per commit.

## Where things stand (Oct 2026)

| | Clean markdown | Raw Webflow HTML |
|---|---|---|
| Pages (`src/content/pages`) | homepage, blog, case-studies, services | studio, contact, learn, 3 product pages, 8 category pages |
| Case studies | ground-news, nectar | 7 others |
| Posts | none | all 11 |

- `src/layouts/Base.astro` no longer loads `webflow.css`, so **raw HTML pages
  render unstyled on this branch.** That's expected until they are converted.
  `main`, the live site, is unaffected.
- `public/webflow/` is 129 MB; about 105 MB of it is referenced.
- Pages opt into the new layout with `clean: true` in frontmatter. That flag
  goes away at the end ([#12](https://github.com/pragmaticsstudio/pragmatics-site/issues/12)).

## Tasks, in order

| # | Task | Depends on |
|---|---|---|
| [#5](https://github.com/pragmaticsstudio/pragmatics-site/issues/5) | Add `npm run check` (build + verify links and assets) | – |
| [#6](https://github.com/pragmaticsstudio/pragmatics-site/issues/6) | **Owner decision:** which legacy pages and videos to keep | – |
| [#7](https://github.com/pragmaticsstudio/pragmatics-site/issues/7) | Convert the 11 blog posts | #5 |
| [#8](https://github.com/pragmaticsstudio/pragmatics-site/issues/8) | Convert the 7 remaining case studies | #5 |
| [#9](https://github.com/pragmaticsstudio/pragmatics-site/issues/9) | Convert kept pages, redirect dropped ones | #5, #6 |
| [#11](https://github.com/pragmaticsstudio/pragmatics-site/issues/11) | Generate the homepage, blog and work cards from the collections | #7, #8 |
| [#10](https://github.com/pragmaticsstudio/pragmatics-site/issues/10) | Move used images to `public/images/`, delete Webflow assets | #6, #7, #8, #9, #11 |
| [#12](https://github.com/pragmaticsstudio/pragmatics-site/issues/12) | Remove the legacy rendering path, tighten schemas | #7–#11 |
| [#13](https://github.com/pragmaticsstudio/pragmatics-site/issues/13) | Authoring guide in the README, CI check, ship to `main` | all |

#7, #8 and #9 touch different folders and can run in parallel.

## Workflow

The integration branch is **`copilot/cleanupmobile-markdown`**. Nothing goes to
`main` until [#13](https://github.com/pragmaticsstudio/pragmatics-site/issues/13).

To pick up a task:

1. Pick the lowest-numbered open issue whose dependencies are closed and
   that nobody is assigned to. Assign yourself, or comment "Taking this"
   if you can't assign.
2. Branch from the latest integration branch:
   ```bash
   git fetch origin copilot/cleanupmobile-markdown
   git checkout -b simplify/<issue-number>-<short-name> origin/copilot/cleanupmobile-markdown
   ```
3. Do the work, following the issue's steps. Run `npm run check` (or
   `npx astro build` before #5 exists).
4. Open a PR **into `copilot/cleanupmobile-markdown`**, not `main`. Put
   `Part of #<issue>` in the description, along with the before and after
   `npm run check` counts and phone and desktop screenshots of a changed page.
5. After the PR merges, **close the issue by hand.** GitHub only auto-closes
   issues for PRs into the default branch, so `Closes #N` won't fire here.
   Leave a one-line comment on the issue saying what shipped.
6. If you get stuck or a step in the issue turns out to be wrong, comment on
   the issue instead of guessing, and update the issue body if the plan
   changes.

## Conventions

**Running locally**

```bash
npm install
```

```bash
npx astro dev --background
```

Stop it with `npx astro dev stop`.

**Case study frontmatter** (copy `src/content/caseStudies/ground-news.md`):

```yaml
title: "Breaking Echo Chambers for Better Media Literacy"
description: "One sentence for search results."
subheading: "One line under the title."
client: "Ground News"
year: "2022"
timeline: "6 months"
website: "https://ground.news/"
gallery:
  - src: "/images/case-studies/ground-news/cover.png"
    alt: "…"
```

**Page frontmatter** (copy `src/content/pages/services/index.md`):

```yaml
title: "Services"
description: "…"
route: "services"
hero:
  heading: "…"
  subheading: "…"
```

**Images:** `public/images/<collection>/<slug>/<readable-name>.<ext>`,
referenced as `/images/…`. Until
[#10](https://github.com/pragmaticsstudio/pragmatics-site/issues/10) runs,
converted content keeps its `/webflow/images/…` paths. Point at the largest
original file, never a `-p-500` or `-p-800` variant.

**Redirects:** for removed pages, use the `redirects` map in
`astro.config.mjs`. Astro writes a static redirect page, which works on
GitHub Pages.
