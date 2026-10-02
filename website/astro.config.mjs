import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.nextmotionai.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
