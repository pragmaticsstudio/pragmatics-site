## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Site simplification (done)

The site was simplified into plain markdown (tracking issue #4, plan in `docs/SIMPLIFY.md`).
The README is the authoring guide. Rules that still apply:

- Keep the original wording when moving content; never invent client facts, dates or quotes.
- No forms, no client JavaScript, no new dependencies.
- The look is the live site's: bright cream frame and rules, regular-weight headings, no filled
  cards, links never underlined. Compare visual changes with the live site at 375px and 1440px.
- Run `npm run check` before every push; it must report 0 broken references.
- Never commit screenshots or the screenshot script.
- If the page review board is still in use, update it after each task as `docs/SIMPLIFY.md` describes.
