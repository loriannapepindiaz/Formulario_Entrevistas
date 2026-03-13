import { defineConfig } from 'vite';

// Keep Vite Babel-free, but compatible with React-style imports on Preact projects.
// This avoids the preact Babel hook-name crash while still resolving react/react-dom imports.
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'preact',
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react-dom/client': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
});
