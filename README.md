# Pragmatics Studio

The Pragmatics Studio website: a small static [Astro](https://astro.build) site with plain markdown content, one stylesheet, and no JavaScript in the browser. It deploys to GitHub Pages at https://pragmatics.studio/.

## Running it

```sh
npm install
npm run dev        # http://localhost:4321
npm run check      # build, then verify every internal link and image
```

Run `npm run check` before you push. It builds the site and lists every link or image that points at a file that doesn't exist (`page → missing path`). It must print `0 broken references`. A pull request that adds a broken link fails the same check in CI.

## Where things live

| What | Where |
|---|---|
| Blog posts | `src/content/posts/<slug>.md` |
| Case studies | `src/content/caseStudies/<slug>.md` |
| Pages (Studio, Learn, product pages) | `src/content/pages/<name>.md` |
| Homepage, Work, Blog and Services page text | `src/content/pages/index.md`, `case-studies.md`, `blog.md`, `services/index.md` |
| Images | `public/images/<collection>/<slug>/` |
| Videos | `public/video/` |
| Styles | `src/styles/brand.css` (tokens, frame) and `src/styles/clean.css` (everything else) |

The file name is the page's URL: `src/content/posts/my-post.md` becomes `/post/my-post/`, and `src/content/caseStudies/acme.md` becomes `/case-studies/acme/`.

## Adding a blog post

Create `src/content/posts/<slug>.md`:

```md
---
title: "The title of the post"
description: "One sentence. It shows under the title and in search results."
order: 1                    # position in the lists, 1 first (see "Order" below)
tag: "UX"                   # optional label on the cards
author: "Name"              # optional
image: "/images/posts/<slug>/cover.jpg"   # optional cover image
imageAlt: "What the image shows"          # optional
featured: true              # optional: large card at the top of the Blog page
date: 2026-10-30            # optional: only set it if you know the real date
---

Plain markdown here. Use `##` for section headings.

![Describe the image](/images/posts/<slug>/diagram.png)

[A video](https://www.youtube.com/watch?v=...) is just a link.
```

The post appears on the Blog page and, if it is one of the three newest, on the homepage. You don't edit any list.

## Adding a case study

Create `src/content/caseStudies/<slug>.md`:

```md
---
title: "The title"
description: "One sentence for search results."
subheading: "One line under the title."
client: "Client name"
year: "2026"
timeline: "6 months"
website: "https://example.com/"
cover: "/images/case-studies/<slug>/0.png"
coverAlt: "What the cover shows"
order: 10                   # position on the Work page, 1 first
tags: ["Product Design", "Branding"]
featured: true              # optional: show on the homepage
featuredOrder: 6            # position among the homepage projects, 1 first
---

The story, in markdown. Put each image after the section it belongs with:

![Client case study, image 1](/images/case-studies/<slug>/1.png)
```

Leave out `client`, `year`, `timeline` or `website` if you don't have them; the page just skips them. If a page keeps its own images and has no `cover`, set `cardImage` to the image the cards should use.

## Images and video

- Put each image under `public/images/<collection>/<slug>/` and refer to it as `/images/<collection>/<slug>/<file>`. Use short, readable file names.
- Photos: JPEG, at most 2000px wide, ideally under 600 KB. Screenshots with text: PNG. Images with transparent corners: WebP.
- You never write `width` or `height`: the build adds them so pages don't jump while images load.
- Videos in `public/video/` need both `.mp4` and `.webm`. The homepage hero uses `heroVideo` in `src/content/pages/index.md`.

## Order

`order` is a number, lowest first. Case studies use it for the Work page; posts use it unless two posts both have a `date`, in which case the newer one comes first. Give a new item a number that puts it where you want it; the others don't need to change.

## Redirecting an old page

Add a line to `redirects` in `astro.config.mjs`. Astro writes a small static redirect page, which works on GitHub Pages:

```js
redirects: { '/old-page': '/new-page/' }
```

## House rules

- **Keep the original wording.** Converting or moving content is a format change, not an edit.
- **No forms.** GitHub Pages can't process them. Use plain `mailto:` and social links.
- **The look is the live site's:** a bright cream frame and 2px cream rules, regular-weight headings, no filled cards, and **links are never underlined**. Reuse the existing `clean-*` classes before adding CSS, and compare any visual change with the site at 375px and 1440px.
- **No dependencies.** `astro` is the only one. Keep it that way.
- No HTML in content files, except in the few page files that already use it for layout.

## Deployment

Pushes to `main` deploy through GitHub Actions (`.github/workflows/deploy.yml`) to https://pragmatics.studio/. Pull requests run `npm run check` (`.github/workflows/check.yml`). The domain is set by `public/CNAME`.
