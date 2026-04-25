/**
 * Layout Templates for Blog Posts
 * Proven editorial structures based on industry best practices
 */

import type { LayoutTemplate } from "../types/aiGeneration";

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: "article",
    name: "Article",
    description: "Standard blog post with clear structure and visual rhythm",
    useCase: "General blog posts, thought leadership, opinion pieces",
    suggestedLength: "medium",
    sections: [
      {
        layoutType: "1-column",
        purpose: "Hero section - grab attention with visual + hook",
        contentGuidance: "Start with compelling image, then 3-sentence hook that promises value. Set context and create curiosity.",
      },
      {
        layoutType: "2-columns-wide-left",
        purpose: "Main argument with supporting visual",
        contentGuidance: "Primary content with detailed explanation (left), supporting quote or chart (right). Establish main thesis.",
      },
      {
        layoutType: "grid-2x2",
        purpose: "Key benefits or takeaways",
        contentGuidance: "4 scannable cards with headings and bullets. Each card delivers one concrete benefit or insight.",
      },
      {
        layoutType: "2-columns",
        purpose: "Supporting details with visual contrast",
        contentGuidance: "Deeper explanation or examples (left), image or data visualization (right). Add credibility.",
      },
      {
        layoutType: "1-column",
        purpose: "Conclusion with clear action",
        contentGuidance: "Recap 3-5 key points in bullets, then concrete CTA. No vague inspiration.",
      },
    ],
  },
  {
    id: "how-to",
    name: "How-To Guide",
    description: "Step-by-step tutorial with clear instructions",
    useCase: "Tutorials, guides, instructional content",
    suggestedLength: "medium",
    sections: [
      {
        layoutType: "1-column",
        purpose: "Introduction - set expectations",
        contentGuidance: "Image showing end result, then explain what readers will learn, prerequisites, estimated time.",
      },
      {
        layoutType: "2-columns-wide-left",
        purpose: "Context and background",
        contentGuidance: "Why this matters, common mistakes to avoid (left), quick tip or stat (right).",
      },
      {
        layoutType: "2-columns-wide-right",
        purpose: "Step 1 with visual",
        contentGuidance: "Screenshot or diagram (left), detailed step-by-step instructions (right). Be specific.",
      },
      {
        layoutType: "2-columns-wide-right",
        purpose: "Step 2 with visual",
        contentGuidance: "Screenshot or diagram (left), detailed step-by-step instructions (right). Include tips.",
      },
      {
        layoutType: "2-columns-wide-right",
        purpose: "Step 3 with visual",
        contentGuidance: "Screenshot or diagram (left), detailed step-by-step instructions (right). Address common issues.",
      },
      {
        layoutType: "1-column",
        purpose: "Summary and next steps",
        contentGuidance: "Bullet recap of key steps, troubleshooting tips, what to do next.",
      },
    ],
  },
  {
    id: "listicle",
    name: "Listicle",
    description: "Scannable list format for quick consumption",
    useCase: "Top 10 lists, resource roundups, comparison posts",
    suggestedLength: "short",
    sections: [
      {
        layoutType: "1-column",
        purpose: "Hero - promise the list value",
        contentGuidance: "Eye-catching image, then hook explaining what's in the list and why readers need it.",
      },
      {
        layoutType: "grid-2x2",
        purpose: "Items 1-4",
        contentGuidance: "4 cards with clear headings and 1-2 bullet points each. Each item stands alone.",
      },
      {
        layoutType: "grid-2x2",
        purpose: "Items 5-8",
        contentGuidance: "4 cards with clear headings and 1-2 bullet points each. Maintain variety.",
      },
      {
        layoutType: "2-columns",
        purpose: "Bonus item or deep dive",
        contentGuidance: "Detailed explanation of standout item (left), supporting visual or quote (right).",
      },
      {
        layoutType: "1-column",
        purpose: "Conclusion and action",
        contentGuidance: "Summary of top 3 items, clear next step or call to action.",
      },
    ],
  },
  {
    id: "ultimate-guide",
    name: "Ultimate Guide",
    description: "Comprehensive pillar content with multiple sections",
    useCase: "Pillar pages, definitive guides, in-depth resources",
    suggestedLength: "long",
    sections: [
      {
        layoutType: "1-column",
        purpose: "Hero - establish authority",
        contentGuidance: "Professional hero image, comprehensive hook explaining scope and value of guide.",
      },
      {
        layoutType: "2-columns-wide-left",
        purpose: "Fundamentals",
        contentGuidance: "Core concepts and definitions (left), key stat or expert quote (right).",
      },
      {
        layoutType: "grid-2x2",
        purpose: "Key principles overview",
        contentGuidance: "4 foundational principles as scannable cards with headings and bullets.",
      },
      {
        layoutType: "2-columns",
        purpose: "Deep dive section 1",
        contentGuidance: "Detailed explanation with examples (left), chart or supporting visual (right).",
      },
      {
        layoutType: "2-columns-wide-left",
        purpose: "Deep dive section 2",
        contentGuidance: "Advanced concepts with breakdown (left), tip or case study callout (right).",
      },
      {
        layoutType: "grid-2x2",
        purpose: "Practical applications",
        contentGuidance: "4 real-world use cases or implementation examples as cards.",
      },
      {
        layoutType: "2-columns",
        purpose: "Common challenges",
        contentGuidance: "Problem-solving guidance (left), helpful visual or quote (right).",
      },
      {
        layoutType: "1-column",
        purpose: "Conclusion and resources",
        contentGuidance: "Recap key takeaways in bullets, provide additional resources, clear next steps.",
      },
    ],
  },
  {
    id: "showcase",
    name: "Showcase",
    description: "Visual-heavy format highlighting features or examples",
    useCase: "Product features, portfolio pieces, visual demonstrations",
    suggestedLength: "medium",
    sections: [
      {
        layoutType: "1-column",
        purpose: "Hero - visual impact",
        contentGuidance: "Striking hero image showcasing main subject, compelling hook about what makes it special.",
      },
      {
        layoutType: "grid-2x2",
        purpose: "Highlight features or benefits",
        contentGuidance: "4 standout features as cards with icons/images, headings, and bullet points.",
      },
      {
        layoutType: "2-columns-wide-right",
        purpose: "Feature spotlight 1",
        contentGuidance: "Visual demonstration (left), detailed explanation and benefits (right).",
      },
      {
        layoutType: "2-columns-wide-right",
        purpose: "Feature spotlight 2",
        contentGuidance: "Visual demonstration (left), detailed explanation and use cases (right).",
      },
      {
        layoutType: "2-columns",
        purpose: "Social proof or testimonial",
        contentGuidance: "User feedback or case study (left), supporting chart or image (right).",
      },
      {
        layoutType: "1-column",
        purpose: "Call to action",
        contentGuidance: "Summary of value proposition, specific call to action with clear next steps.",
      },
    ],
  },
  {
    id: "tutorial",
    name: "Tutorial",
    description: "Hands-on learning with practical examples",
    useCase: "Technical tutorials, skill-building content, workshops",
    suggestedLength: "medium",
    sections: [
      {
        layoutType: "1-column",
        purpose: "Introduction - what you'll build",
        contentGuidance: "Screenshot of final result, then explain learning objectives and prerequisites.",
      },
      {
        layoutType: "2-columns-wide-left",
        purpose: "Conceptual foundation",
        contentGuidance: "Core concepts explained (left), quick reference or diagram (right).",
      },
      {
        layoutType: "grid-2x2",
        purpose: "Overview of approach",
        contentGuidance: "4 phases or components as cards. High-level roadmap.",
      },
      {
        layoutType: "2-columns-wide-right",
        purpose: "Implementation step 1",
        contentGuidance: "Code sample or screenshot (left), detailed walkthrough (right).",
      },
      {
        layoutType: "2-columns-wide-right",
        purpose: "Implementation step 2",
        contentGuidance: "Code sample or screenshot (left), detailed walkthrough with tips (right).",
      },
      {
        layoutType: "2-columns",
        purpose: "Testing and validation",
        contentGuidance: "How to verify it works (left), example output or result (right).",
      },
      {
        layoutType: "1-column",
        purpose: "Practice and next steps",
        contentGuidance: "Suggested exercises, common issues and solutions, resources for deeper learning.",
      },
    ],
  },
  {
    id: "problem-solution",
    name: "Problem/Solution",
    description: "Pain-driven narrative leading to solution",
    useCase: "Case studies, product marketing, consulting content",
    suggestedLength: "medium",
    sections: [
      {
        layoutType: "1-column",
        purpose: "Hook - establish the problem",
        contentGuidance: "Visual representing the pain point, then describe the problem readers face.",
      },
      {
        layoutType: "2-columns-wide-left",
        purpose: "Problem analysis",
        contentGuidance: "Deep dive into why this problem exists and its impact (left), stat or quote reinforcing severity (right).",
      },
      {
        layoutType: "2-columns",
        purpose: "Traditional approaches and limitations",
        contentGuidance: "What people typically try (left), why it falls short with chart showing gaps (right).",
      },
      {
        layoutType: "grid-2x2",
        purpose: "Solution components",
        contentGuidance: "4 key elements of the solution as cards with clear benefits.",
      },
      {
        layoutType: "2-columns-wide-left",
        purpose: "Implementation details",
        contentGuidance: "How to apply the solution (left), tip or case study callout (right).",
      },
      {
        layoutType: "1-column",
        purpose: "Action plan",
        contentGuidance: "Specific steps to get started, expected results, clear call to action.",
      },
    ],
  },
  {
    id: "case-study",
    name: "Case Study",
    description: "Story-based format showing real results",
    useCase: "Success stories, customer spotlights, project retrospectives",
    suggestedLength: "medium",
    sections: [
      {
        layoutType: "1-column",
        purpose: "Introduction - the story hook",
        contentGuidance: "Compelling before/after image or hero visual, then introduce subject and tease transformation.",
      },
      {
        layoutType: "2-columns",
        purpose: "Background and challenge",
        contentGuidance: "Situation and context (left), specific challenges faced as quote or callout (right).",
      },
      {
        layoutType: "2-columns-wide-left",
        purpose: "Approach and strategy",
        contentGuidance: "Detailed explanation of methodology (left), key decision point or insight (right).",
      },
      {
        layoutType: "grid-2x2",
        purpose: "Results and metrics",
        contentGuidance: "4 key outcomes with specific numbers and charts. Make it concrete.",
      },
      {
        layoutType: "2-columns",
        purpose: "Lessons learned",
        contentGuidance: "Insights and takeaways (left), expert quote or testimonial (right).",
      },
      {
        layoutType: "1-column",
        purpose: "Takeaway and application",
        contentGuidance: "How readers can apply these lessons, summary bullets, next steps.",
      },
    ],
  },
];

/**
 * Get a template by ID
 */
export function getTemplate(id: string): LayoutTemplate | undefined {
  return LAYOUT_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get all template IDs
 */
export function getTemplateIds(): string[] {
  return LAYOUT_TEMPLATES.map((t) => t.id);
}

/**
 * Get templates filtered by suggested length
 */
export function getTemplatesByLength(length: "short" | "medium" | "long"): LayoutTemplate[] {
  return LAYOUT_TEMPLATES.filter((t) => t.suggestedLength === length);
}
