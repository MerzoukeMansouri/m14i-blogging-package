import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'server/index': 'src/server/index.ts',
    styles: 'src/styles.css',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  minify: false,
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
  // Inject CSS imports into the bundle for automatic inclusion
  injectStyle: true,
  // Also output CSS as separate file for manual import
  loader: {
    '.css': 'local-css',
  },
  esbuildOptions(options) {
    // Ensure CSS is bundled correctly
    options.loader = {
      ...options.loader,
      '.css': 'css',
    };
  },
});
