import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        conversor: resolve(__dirname, 'conversor.html'),
        cotacoes: resolve(__dirname, 'cotacoes.html'),
        sobre: resolve(__dirname, 'sobre.html'),
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});
