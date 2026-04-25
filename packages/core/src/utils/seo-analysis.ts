/**
 * Content Analysis Utilities for SEO
 * Provides functions to analyze blog content for reading time, word count, excerpts, and more
 */

import type { BlogPost, LayoutSection, ContentBlock } from '../types';
import type { ContentAnalysis } from '../types/seo';

import { READING_SPEED_WPM } from '../config/constants';

/**
 * Extract plain text from markdown content
 * Removes markdown formatting, code blocks, links, etc.
 */
export function extractPlainText(markdown: string): string {
  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove headings
    .replace(/#{1,6}\s+/g, '')
    // Remove bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Clean up whitespace
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  const plainText = extractPlainText(text);
  if (!plainText) return 0;

  // Split by whitespace and filter out empty strings
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Count total words across all content blocks in sections
 */
export function countWordsInSections(sections: LayoutSection[]): number {
  let totalWords = 0;

  for (const section of sections) {
    if (!section?.columns) continue;
    for (const column of section.columns) {
      for (const block of column) {
        if (block.type === 'text') {
          totalWords += countWords(block.content);
        } else if (block.type === 'quote') {
          totalWords += countWords(block.content);
        }
      }
    }
  }

  return totalWords;
}

/**
 * Calculate reading time based on word count
 * @param wordCount - Total number of words
 * @param wordsPerMinute - Reading speed (default: 200 WPM)
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadingTime(
  wordCount: number,
  wordsPerMinute: number = READING_SPEED_WPM
): number {
  if (wordCount === 0) return 0;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Calculate reading time from blog sections
 * @param sections - Blog post sections
 * @param wordsPerMinute - Reading speed (default: 200 WPM)
 * @returns Reading time in minutes
 */
export function calculateReadingTimeFromSections(
  sections: LayoutSection[],
  wordsPerMinute: number = READING_SPEED_WPM
): number {
  const wordCount = countWordsInSections(sections);
  return calculateReadingTime(wordCount, wordsPerMinute);
}

/**
 * Generate an excerpt from content
 * Tries to extract complete sentences up to maxLength
 *
 * @param text - Text to generate excerpt from
 * @param maxLength - Maximum length in characters (default: 155 for meta description)
 * @returns Generated excerpt
 */
export function generateExcerpt(text: string, maxLength: number = 155): string {
  const plainText = extractPlainText(text).trim();

  if (!plainText) return '';
  if (plainText.length <= maxLength) return plainText;

  // Try to break at sentence boundaries
  const sentences = plainText.split(/[.!?]+\s+/);
  let excerpt = '';

  for (const sentence of sentences) {
    const withSentence = excerpt + (excerpt ? '. ' : '') + sentence;
    if (withSentence.length > maxLength) {
      break;
    }
    excerpt = withSentence;
  }

  // If no complete sentence fits, just truncate at word boundary
  if (!excerpt) {
    excerpt = plainText.substring(0, maxLength);
    const lastSpace = excerpt.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      excerpt = excerpt.substring(0, lastSpace);
    }
  }

  // Add ellipsis if truncated
  if (excerpt.length < plainText.length) {
    excerpt = excerpt.trim() + '...';
  }

  return excerpt;
}

/**
 * Generate excerpt from blog post sections
 * Combines text from all text and quote blocks until maxLength is reached
 */
export function generateExcerptFromSections(
  sections: LayoutSection[],
  maxLength: number = 155
): string {
  let combinedText = '';

  // Collect text from all blocks
  for (const section of sections) {
    if (!section?.columns) continue;
    for (const column of section.columns) {
      for (const block of column) {
        if (block.type === 'text') {
          combinedText += ' ' + block.content;
        } else if (block.type === 'quote') {
          combinedText += ' ' + block.content;
        }
      }
    }
  }

  return generateExcerpt(combinedText, maxLength);
}

/**
 * Extract headings from markdown text
 */
export function extractHeadingsFromMarkdown(markdown: string): Array<{ level: number; text: string }> {
  const headings: Array<{ level: number; text: string }> = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      headings.push({ level, text });
    }
  }

  return headings;
}

/**
 * Extract all headings from blog post sections
 */
export function extractHeadingsFromSections(sections: LayoutSection[]): Array<{ level: number; text: string }> {
  const allHeadings: Array<{ level: number; text: string }> = [];

  for (const section of sections) {
    if (!section?.columns) continue;
    for (const column of section.columns) {
      for (const block of column) {
        if (block.type === 'text') {
          const headings = extractHeadingsFromMarkdown(block.content);
          allHeadings.push(...headings);
        }
      }
    }
  }

  return allHeadings;
}

/**
 * Count specific block types in sections
 */
export function countBlocksByType(sections: LayoutSection[]): Record<string, number> {
  const counts: Record<string, number> = {
    text: 0,
    image: 0,
    video: 0,
    quote: 0,
    pdf: 0,
    carousel: 0,
  };

  for (const section of sections) {
    if (!section?.columns) continue;
    for (const column of section.columns) {
      for (const block of column) {
        counts[block.type]++;
      }
    }
  }

  return counts;
}

/**
 * Perform comprehensive content analysis on a blog post
 */
export function analyzeContent(blogPost: BlogPost): ContentAnalysis {
  const wordCount = countWordsInSections(blogPost.sections);
  const readingTime = calculateReadingTime(wordCount);
  const headings = extractHeadingsFromSections(blogPost.sections);
  const blockCounts = countBlocksByType(blogPost.sections);

  // Auto-generate excerpt if not provided
  const autoExcerpt = !blogPost.excerpt
    ? generateExcerptFromSections(blogPost.sections)
    : undefined;

  return {
    wordCount,
    readingTime,
    autoExcerpt,
    headings,
    imageCount: blockCounts.image + blockCounts.carousel,
    videoCount: blockCounts.video,
  };
}

/**
 * Format reading time as human-readable string
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read", "< 1 min read")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 0) return '< 1 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}

/**
 * Get ISO 8601 duration format for reading time (for Schema.org)
 * @param minutes - Reading time in minutes
 * @returns ISO 8601 duration string (e.g., "PT5M")
 */
export function getReadingTimeDuration(minutes: number): string {
  return `PT${minutes}M`;
}

/**
 * Generate a URL-friendly slug from a title
 * @param title - The title to convert to a slug
 * @returns URL-friendly slug (lowercase, hyphenated, no special chars)
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-{2,}/g, '-'); // Replace multiple hyphens with single hyphen
}
