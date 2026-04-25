import { defineConfig } from 'tsup';

function getOutputExtension({ format }: { format: string }) {
  return {
    js: format === 'esm' ? '.mjs' : '.cjs',
  };
}

export default defineConfig([
  // Admin components
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
      '@hello-pangea/dnd',
      'lucide-react',
      'react-markdown',
      'remark-gfm',
      'rehype-stringify',
      'remark-parse',
      'remark-rehype',
      'unified',
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-link',
      '@tiptap/extension-image',
      '@tiptap/extension-placeholder',
      '@m14i/blogging-core',
      '@m14i/blogging-server',
      '@supabase/supabase-js',
      '@supabase/ssr',
      'next',
      'next/server',
      'next/navigation',
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
