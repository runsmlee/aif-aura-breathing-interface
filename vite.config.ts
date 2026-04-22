import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        drop_debugger: true,
        ecma: 2020,
        module: true,
        toplevel: true,
        reduce_funcs: true,
        reduce_vars: true,
        collapse_vars: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        hoist_funs: true,
        hoist_vars: true,
        side_effects: true,
        sequences: true,
        properties: true,
        dead_code: true,
        drop_console: false,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        if_return: true,
        join_vars: true,
        inline: true,
      },
      format: {
        comments: false,
        ecma: 2020,
      },
      ecma: 2020,
      module: true,
      toplevel: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    env: {
      NODE_ENV: 'development',
    },
  },
});
