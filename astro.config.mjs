import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pragmaticsstudio.github.io/pragmatics-site',
  base: '/pragmatics-site',
  build: { format: 'directory' },
});
