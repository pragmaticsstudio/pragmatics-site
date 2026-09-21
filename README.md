# Pragmatics Studio

Static Astro rebuild of the Pragmatics Studio website.

## Development

```sh
npm install
npm run dev
```

The local development server runs at `http://localhost:4321`.

## Build

```sh
npm run build
npm run preview
```

The static output is written to `dist/`.

## Deployment

Pushes to `main` deploy through GitHub Actions to:

https://pragmaticsstudio.github.io/pragmatics-site/

The original scrape is not required for builds. Generated directories such as `node_modules/`, `.astro/`, and `dist/` are intentionally ignored.
