import { defineConfig } from 'vite';

// Keep config Babel-free to avoid the preact-jsx Babel transform crash
// (`babel-plugin-transform-hook-names` -> _parser.parse is not a function).
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
});
