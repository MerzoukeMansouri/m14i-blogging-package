/**
 * Blog SEO Component for Next.js App Router
 * Provides automatic SEO metadata generation for blog posts
 */

import type { BlogPost } from '../types';
import type { SEOConfig } from '../types/seo';
import { generateBlogMetadata, type NextMetadata } from '../utils/meta-generators';
import { generateAllStructuredData, toJSONLD } from '../utils/structured-data';

export { generateBlogMetadata };

/**
 * Generate metadata for Next.js App Router
 *
 * @example
 * // In your app/blog/[slug]/page.tsx:
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const post = await getPost(params.slug);
 *   return generateBlogMetadata(post, seoConfig);
 * }
 */
export { generateBlogMetadata as generateMetadata };

/**
 * Blog SEO component that renders JSON-LD structured data
 * Use this in your Next.js App Router page to include structured data
 *
 * @example
 * // In your app/blog/[slug]/page.tsx:
 * import { BlogSEO } from 'm14i-blogging';
 *
 * export default function BlogPage({ post }) {
 *   return (
 *     <>
 *       <BlogSEO post={post} config={seoConfig} />
 *       <BlogPreview post={post} />
 *     </>
 *   );
 * }
 */
export function BlogSEO({
  post,
  config,
  options,
}: {
  post: BlogPost;
  config: SEOConfig;
  options?: {
    includeBreadcrumbs?: boolean;
    includeAuthor?: boolean;
    customBreadcrumbs?: Array<{ name: string; url?: string }>;
  };
}) {
  if (!config.enableStructuredData) {
    return null;
  }

  const schemas = generateAllStructuredData(post, config, options);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJSONLD(schema),
          }}
        />
      ))}
    </>
  );
}

/**
 * Utility function to generate just the JSON-LD for manual use
 */
export function generateBlogJSONLD(
  post: BlogPost,
  config: SEOConfig,
  options?: {
    includeBreadcrumbs?: boolean;
    includeAuthor?: boolean;
    customBreadcrumbs?: Array<{ name: string; url?: string }>;
  }
): string {
  const schemas = generateAllStructuredData(post, config, options);
  return toJSONLD(schemas);
}
