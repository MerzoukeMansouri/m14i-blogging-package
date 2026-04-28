import { defineConfig } from 'tsup';

function getOutputExtension({ format }: { format: string }) {
  return {
    js: format === 'esm' ? '.mjs' : '.cjs',
  };
}

export default defineConfig([
  // Core components and utilities
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    splitting: false,
    minify: false,
    outExtension: getOutputExtension,
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'use-sync-external-store',
      'use-sync-external-store/shim',
      'lucide-react',
      '@supabase/supabase-js',
      '@supabase/ssr',
      'next',
      'next/server',
      'next/navigation',
    ],
    injectStyle: false,
  },
  // Client-only exports (server-safe)
  {
    entry: {
      'client/index': 'src/client/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    minify: false,
    outExtension: getOutputExtension,
    external: [
      '@supabase/supabase-js',
      '@supabase/ssr',
    ],
    injectStyle: false,
  },
  // Public-facing components
  {
    entry: {
      'public/index': 'src/public/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    treeshake: true,
    splitting: false,
    minify: false,
    outExtension: getOutputExtension,
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'lucide-react',
      '@supabase/supabase-js',
      '@supabase/ssr',
      'next',
      'next/navigation',
      'react-markdown',
      'remark-gfm',
    ],
    injectStyle: false,
  },
  // CSS bundle
  {
    entry: {
      index: 'src/styles.css',
    },
    outDir: 'dist',
    loader: {
      '.css': 'copy',
    },
  },
]);
