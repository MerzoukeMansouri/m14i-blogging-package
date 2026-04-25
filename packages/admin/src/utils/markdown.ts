/**
 * Markdown to HTML conversion utility
 * Converts markdown strings to HTML for WYSIWYG editor
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

/**
 * Convert markdown string to HTML
 * @param markdown - Markdown string to convert
 * @returns HTML string
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // Support GitHub Flavored Markdown
    .use(remarkRehype) // Convert to HTML AST
    .use(rehypeStringify) // Serialize to HTML
    .process(markdown);

  return String(file);
}

/**
 * Synchronous version using basic regex replacements
 * Use this for simpler cases or when async is not possible
 * @param markdown - Markdown string to convert
 * @returns HTML string
 */
export function markdownToHtmlSync(markdown: string): string {
  if (!markdown) return "";

  // Check if already HTML
  if (markdown.trim().startsWith("<") || markdown.includes("</")) {
    return markdown;
  }

  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');

  // Code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Code blocks
  html = html.replace(/```([^`]*)```/gs, "<pre><code>$1</code></pre>");

  // Line breaks
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith("<")) {
    html = `<p>${html}</p>`;
  }

  return html;
}
