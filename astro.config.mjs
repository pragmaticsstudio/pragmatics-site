import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pragmatics.studio',
  base: '/',
  build: { format: 'directory' },
  // Pages that were dropped. Astro writes a static redirect page for each.
  redirects: {
    '/project-category/branding': '/case-studies/',
    '/project-category/branding-2': '/case-studies/',
    '/project-category/content': '/case-studies/',
    '/project-category/design': '/case-studies/',
    '/project-category/product-design': '/case-studies/',
    '/blog-category/branding': '/blog/',
    '/blog-category/design': '/blog/',
    '/blog-category/ux': '/blog/',
    '/contact': '/studio/',
  },
});
