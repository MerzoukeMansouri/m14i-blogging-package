/**
 * AI Generation Types for Blog Content
 * These types define the request/response structures for AI-powered content generation
 */

import type { LayoutSection, LayoutType } from "./layouts";
import type { SEOMetadata } from "./seo";

/**
 * Request to generate a complete blog post from a prompt
 */
export interface GenerateCompleteBlogRequest {
  /** The topic or prompt describing what the blog post should be about */
  prompt: string;
  /** Optional: Desired layout preferences */
  layoutPreference?: LayoutType[];
  /** Optional: Target audience or tone (e.g., "technical", "beginner-friendly", "professional") */
  tone?: string;
  /** Optional: Desired length (short, medium, long) */
  length?: "short" | "medium" | "long";
  /** Optional: Additional instructions for the AI */
  additionalInstructions?: string;
}

/**
 * Response from complete blog post generation
 */
export interface GenerateCompleteBlogResponse {
  /** Generated blog post title */
  title: string;
  /** Generated URL-friendly slug */
  slug: string;
  /** Generated excerpt/summary */
  excerpt: string;
  /** Generated content sections with layouts */
  sections: LayoutSection[];
  /** Generated SEO metadata */
  seo_metadata: SEOMetadata & {
    openGraph?: {
      title?: string;
      description?: string;
      image?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
    };
  };
  /** Suggested category */
  category?: string;
  /** Suggested tags */
  tags: string[];
}

/**
 * Request to generate blog post layout structure only
 */
export interface GenerateLayoutRequest {
  /** The topic or prompt describing what the blog post should be about */
  prompt: string;
  /** Optional: Desired layout preferences */
  layoutPreference?: LayoutType[];
  /** Optional: Target audience or tone */
  tone?: string;
  /** Optional: Desired length (short, medium, long) */
  length?: "short" | "medium" | "long";
  /** Optional: Additional instructions */
  additionalInstructions?: string;
}

/**
 * Response from layout generation
 */
export interface GenerateLayoutResponse {
  /** Generated blog post title */
  title: string;
  /** Generated URL-friendly slug */
  slug: string;
  /** Generated excerpt/summary */
  excerpt: string;
  /** Layout structure with section types and descriptions (no content yet) */
  layout: Array<{
    id: string;
    type: LayoutType;
    description: string; // What this section should contain
  }>;
  /** Suggested category */
  category?: string;
  /** Suggested tags */
  tags: string[];
}

/**
 * Request to generate a single section
 */
export interface GenerateSectionRequest {
  /** The topic or description for this section */
  prompt: string;
  /** The layout type to use for this section */
  layoutType: LayoutType;
  /** Optional: Context from the rest of the blog post */
  context?: string;
}

/**
 * Response from section generation
 */
export interface GenerateSectionResponse {
  /** Generated layout section */
  section: LayoutSection;
}

/**
 * Request to generate SEO metadata
 */
export interface GenerateSEORequest {
  /** Blog post title */
  title: string;
  /** Blog post excerpt or content summary */
  excerpt?: string;
  /** Optional: Full content for better SEO generation */
  content?: string;
  /** Optional: Category */
  category?: string;
  /** Optional: Existing tags */
  tags?: string[];
}

/**
 * Response from SEO generation
 */
export interface GenerateSEOResponse {
  /** Generated SEO metadata */
  seo_metadata: SEOMetadata & {
    openGraph?: {
      title?: string;
      description?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
    };
  };
  /** Suggested or improved tags */
  tags?: string[];
}

/**
 * Request to improve existing content
 */
export interface ImproveContentRequest {
  /** The existing content to improve */
  content: string;
  /** The type of improvement requested */
  instruction: "expand" | "shorten" | "rewrite" | "add-examples" | "improve-clarity" | "make-engaging";
  /** Optional: Additional context or instructions */
  additionalContext?: string;
}

/**
 * Response from content improvement
 */
export interface ImproveContentResponse {
  /** Improved content */
  content: string;
  /** Optional: Explanation of changes made */
  changes?: string;
}

/**
 * AI Generation Error
 */
export interface AIGenerationError {
  /** Error message */
  error: string;
  /** Error code */
  code?: "RATE_LIMIT" | "API_ERROR" | "INVALID_REQUEST" | "AUTHENTICATION_ERROR";
  /** Additional details */
  details?: string;
}

/**
 * Configuration for AI content generation
 */
export interface AIGenerationConfig {
  /** Anthropic API key */
  apiKey: string;
  /** Model to use (default: claude-3-5-sonnet-20241022) */
  model?: string;
  /** Maximum tokens for response */
  maxTokens?: number;
  /** Temperature for generation (0-1, higher = more creative) */
  temperature?: number;
}
