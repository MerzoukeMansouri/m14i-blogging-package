import { defineConfig } from 'tsup';

function getOutputExtension({ format }: { format: string }) {
  return {
    js: format === 'esm' ? '.mjs' : '.cjs',
  };
}

export default defineConfig({
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
    '@supabase/supabase-js',
    '@supabase/ssr',
    '@anthropic-ai/sdk',
    '@m14i/blogging-core',
    'next',
    'next/server',
    'next/navigation',
  ],
});
