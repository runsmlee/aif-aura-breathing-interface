import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 5,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        drop_debugger: true,
        ecma: 2020,
        module: true,
        toplevel: true,
        booleans_as_integers: true,
        reduce_funcs: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
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
        manualChunks: {
          react: ['react', 'react-dom'],
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
