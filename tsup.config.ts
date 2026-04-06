import { defineConfig } from 'tsup';

// Common external dependencies shared across bundles
const commonExternals = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  '@hello-pangea/dnd',
  'lucide-react',
  'react-markdown',
  'remark-gfm',
  '@supabase/supabase-js',
  '@supabase/ssr',
];

// Common output extension configuration
function getOutputExtension({ format }: { format: string }) {
  return {
    js: format === 'esm' ? '.mjs' : '.cjs',
  };
}

export default defineConfig([
  // Main components bundle
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
    external: commonExternals,
    injectStyle: false, // Don't inject CSS, we'll provide it separately
  },
  // Client data access layer bundle
  {
    entry: {
      'client/index': 'src/client/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    outExtension: getOutputExtension,
    external: [
      '@supabase/supabase-js',
      '@supabase/ssr',
    ],
  },
  // Server utilities bundle
  {
    entry: {
      'server/index': 'src/server/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    outExtension: getOutputExtension,
    external: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      '@supabase/ssr',
      'next',
      'next/server',
      'next/navigation',
      '@anthropic-ai/sdk',
      '@toon-format/toon',
    ],
  },
  // Admin interface bundle
  {
    entry: {
      'admin/index': 'src/admin/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    outExtension: getOutputExtension,
    external: commonExternals,
  },
  // Public interface bundle
  {
    entry: {
      'public/index': 'src/public/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    outExtension: getOutputExtension,
    external: commonExternals,
  },
  // CSS bundle - copy as index.css for the styles export
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
