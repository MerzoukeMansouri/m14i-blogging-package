/**
 * AI Generation Shared Types
 * Types used across packages for AI features
 */

import type { LayoutType } from "./layouts";

/**
 * Brand context for AI generation
 * Provides site/brand information to ground AI responses
 */
export interface BrandContext {
  /** Site or brand name */
  siteName: string;
  /** Site description or tagline */
  description: string;
  /** Industry or niche (e.g., "technology", "healthcare", "education") */
  industry?: string;
  /** Target audience description (e.g., "developers", "small business owners") */
  targetAudience?: string;
  /** Preferred tone (e.g., "professional", "casual", "technical", "friendly") */
  tone?: string;
  /** Vocabulary preferences */
  vocabulary?: {
    /** Words/phrases to prefer in generated content */
    prefer?: string[];
    /** Words/phrases to avoid in generated content */
    avoid?: string[];
  };
  /** Key topics or themes */
  topics?: string[];
  /** Brand voice guidelines */
  voiceGuidelines?: string;
}

/**
 * Layout Template
 * Predefined blog post structure with content guidance
 */
export interface LayoutTemplate {
  /** Unique template identifier */
  id: string;
  /** Display name */
  name: string;
  /** Template description */
  description: string;
  /** When to use this template */
  useCase: string;
  /** Suggested content length */
  suggestedLength: "short" | "medium" | "long";
  /** Template sections with layout types and content guidance */
  sections: Array<{
    /** Layout type for this section */
    layoutType: LayoutType;
    /** What content should be generated for this section */
    contentGuidance: string;
    /** Purpose of this section in the overall narrative */
    purpose: string;
  }>;
}
