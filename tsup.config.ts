// @ts-ignore
import { defineConfig } from 'tsup';

export default defineConfig([
  // Main package build
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    external: ['react', 'react-dom'],
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.mjs' : '.js',
      };
    },
  },
  // React integration build
  {
    entry: ['src/react.tsx'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    external: ['react', 'react-dom', './core.js'],
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.mjs' : '.js',
      };
    },
  },
  // UMD build for direct browser usage
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'WAO',
    minify: true,
    sourcemap: true,
    outDir: 'dist',
    platform: 'browser',
    target: 'es2018',
    external: ['react', 'react-dom'],
    outExtension() {
      return {
        js: '.umd.js',
      };
    },
  },
]); 
