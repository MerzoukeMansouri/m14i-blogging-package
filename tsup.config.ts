import { defineConfig } from 'tsup';

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
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.mjs' : '.cjs',
      };
    },
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@hello-pangea/dnd',
      'lucide-react',
      'react-markdown',
      'remark-gfm',
      '@supabase/supabase-js',
      '@supabase/ssr',
    ],
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
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.mjs' : '.cjs',
      };
    },
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
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.mjs' : '.cjs',
      };
    },
    external: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      '@supabase/ssr',
    ],
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
