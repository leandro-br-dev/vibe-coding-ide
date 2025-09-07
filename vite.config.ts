import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: 'localhost',
    fs: {
      allow: ['../..']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.platform': JSON.stringify(process.platform),
    'process.env': JSON.stringify(process.env),
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@monaco-editor/react', 'monaco-editor'],
  },
  worker: {
    format: 'es'
  }
});