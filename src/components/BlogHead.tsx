/**
 * Blog Head Component for Next.js Pages Router
 * Provides automatic SEO meta tags and structured data for blog posts
 * Use with next/head in Next.js Pages Router
 */

import React from 'react';
import type { BlogPost } from '../types';
import type { SEOConfig } from '../types/seo';
import { generateHTMLMetaTags, generateCanonicalLink } from '../utils/meta-generators';
import { generateAllStructuredData, toJSONLD } from '../utils/structured-data';

export interface BlogHeadProps {
  /** Blog post to generate meta tags for */
  post: BlogPost;
  /** SEO configuration */
  config: SEOConfig;
  /** Additional options */
  options?: {
    /** Include breadcrumb structured data */
    includeBreadcrumbs?: boolean;
    /** Include author structured data */
    includeAuthor?: boolean;
    /** Custom breadcrumbs */
    customBreadcrumbs?: Array<{ name: string; url?: string }>;
  };
  /** Children to render inside Head (for additional meta tags) */
  children?: React.ReactNode;
}

/**
 * BlogHead component for Next.js Pages Router
 * Renders all necessary meta tags and structured data inside next/head
 *
 * @example
 * // In your pages/blog/[slug].tsx:
 * import Head from 'next/head';
 * import { BlogHead } from 'm14i-blogging';
 *
 * export default function BlogPage({ post }) {
 *   return (
 *     <>
 *       <Head>
 *         <BlogHead post={post} config={seoConfig} />
 *       </Head>
 *       <BlogPreview post={post} />
 *     </>
 *   );
 * }
 */
export function BlogHead({ post, config, options, children }: BlogHeadProps) {
  const metaTags = generateHTMLMetaTags(post, config);
  const canonicalUrl = generateCanonicalLink(post, config);
  const schemas = config.enableStructuredData
    ? generateAllStructuredData(post, config, options)
    : [];

  return (
    <>
      {/* Page title */}
      <title>{post.title}</title>

      {/* Meta tags */}
      {metaTags.map((tag, index) => {
        const { name, property, content, ...rest } = tag;
        if (name) {
          return <meta key={`meta-${index}`} name={name} content={content} {...rest} />;
        }
        if (property) {
          return <meta key={`meta-${index}`} property={property} content={content} {...rest} />;
        }
        return <meta key={`meta-${index}`} content={content} {...rest} />;
      })}

      {/* Canonical link */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* JSON-LD structured data */}
      {schemas.map((schema, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJSONLD(schema),
          }}
        />
      ))}

      {/* Additional children */}
      {children}
    </>
  );
}

/**
 * Standalone meta tags component (without title and canonical)
 * Use this if you want to manage title and canonical separately
 */
export function BlogMetaTags({ post, config }: { post: BlogPost; config: SEOConfig }) {
  const metaTags = generateHTMLMetaTags(post, config);

  return (
    <>
      {metaTags.map((tag, index) => {
        const { name, property, content, ...rest } = tag;
        if (name) {
          return <meta key={`meta-${index}`} name={name} content={content} {...rest} />;
        }
        if (property) {
          return <meta key={`meta-${index}`} property={property} content={content} {...rest} />;
        }
        return <meta key={`meta-${index}`} content={content} {...rest} />;
      })}
    </>
  );
}

/**
 * Standalone JSON-LD component
 * Use this if you want to manage structured data separately
 */
export function BlogStructuredData({
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
