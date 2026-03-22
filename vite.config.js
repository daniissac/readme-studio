import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/readme-studio/',
  build: {
    outDir: 'dist',
  },
  server: {
    open: true,
  },
});
