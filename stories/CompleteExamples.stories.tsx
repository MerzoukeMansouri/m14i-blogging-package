import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogPreview } from "../src/components/BlogPreview";
import type { LayoutSection } from "../src/types";

const meta: Meta<typeof BlogPreview> = {
  title: "Complete Examples/Real-World Blogs",
  component: BlogPreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Complete Blog Examples

Real-world examples demonstrating the full power of the blogging system.
These examples combine multiple features: layouts, content blocks, images, quotes, videos, PDFs, and more.

## Examples Included

- **Tech Blog Post** - Tutorial-style article with code, images, and structured content
- **Portfolio Showcase** - Visual portfolio with grids, carousels, and testimonials
- **Product Launch** - Marketing content with hero sections, features, and CTAs
- **Company Blog** - Corporate blog with team info, statistics, and media
- **Documentation** - Technical documentation with PDFs, code samples, and diagrams
- **News Article** - Magazine-style article with multimedia content
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogPreview>;

// Tech Blog Post - Tutorial Style
export const TechBlogPost: Story = {
  name: "📝 Tech Tutorial Blog",
  args: {
    title: "Building Scalable React Applications: A Complete Guide",
    sections: [
      {
        id: "hero",
        type: "1-column",
        columns: [
          [
            {
              id: "hero-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200",
              alt: "React code on screen",
              caption: "Modern React development",
            },
            {
              id: "intro",
              type: "text",
              content: `# Building Scalable React Applications

Published on March 15, 2024 · 15 min read

In this comprehensive guide, we'll explore best practices for building production-ready React applications that can scale to millions of users.

## What You'll Learn

- **Architecture patterns** for large React apps
- **State management** strategies
- **Performance optimization** techniques
- **Testing** best practices
- **Deployment** strategies`,
            },
          ],
        ],
      },
      {
        id: "architecture",
        type: "2-columns",
        columns: [
          [
            {
              id: "arch-text",
              type: "text",
              content: `## Architecture Patterns

When building large applications, choosing the right architecture is crucial.

### Feature-Based Structure

Organize your code by features rather than file types:

\`\`\`
src/
  features/
    auth/
    dashboard/
    profile/
  shared/
    components/
    hooks/
    utils/
\`\`\`

This approach:
- ✅ Improves code organization
- ✅ Makes features more maintainable
- ✅ Enables lazy loading
- ✅ Simplifies team collaboration`,
            },
          ],
          [
            {
              id: "arch-quote",
              type: "quote",
              content: "Good architecture is less about the perfect structure and more about making the right tradeoffs for your specific use case.",
              author: "Dan Abramov",
              role: "React Core Team",
            },
            {
              id: "arch-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
              alt: "Code architecture diagram",
            },
          ],
        ],
      },
      {
        id: "state-management",
        type: "1-column",
        columns: [
          [
            {
              id: "state-text",
              type: "text",
              content: `## State Management Strategies

Choosing the right state management solution depends on your app's complexity:

### Small to Medium Apps
- **React Context** + **useReducer** - Built-in, simple, no dependencies
- **Zustand** - Minimal boilerplate, great DX

### Large Apps
- **Redux Toolkit** - Industry standard, excellent tooling
- **Jotai** - Atomic state management, fine-grained updates
- **TanStack Query** - For server state (API data)

### Performance Tip
Don't put everything in global state! Use local state for UI-only concerns.`,
            },
          ],
        ],
      },
      {
        id: "performance",
        type: "grid-2x3",
        columns: [
          [
            {
              id: "perf-1",
              type: "text",
              content: "### ⚡ Code Splitting\n\nUse `React.lazy()` and dynamic imports to split your bundle and load code on demand.",
            },
          ],
          [
            {
              id: "perf-2",
              type: "text",
              content: "### 🎯 Memoization\n\nUse `React.memo()`, `useMemo()`, and `useCallback()` strategically to prevent unnecessary re-renders.",
            },
          ],
          [
            {
              id: "perf-3",
              type: "text",
              content: "### 🖼️ Image Optimization\n\nUse modern formats (WebP, AVIF), lazy loading, and responsive images with `srcset`.",
            },
          ],
          [
            {
              id: "perf-4",
              type: "text",
              content: "### 📦 Bundle Analysis\n\nRegularly analyze your bundle with tools like `webpack-bundle-analyzer`.",
            },
          ],
          [
            {
              id: "perf-5",
              type: "text",
              content: "### 🔄 Virtual Lists\n\nFor long lists, use virtualization libraries like `react-window` or `tanstack-virtual`.",
            },
          ],
          [
            {
              id: "perf-6",
              type: "text",
              content: "### 🚀 SSR/SSG\n\nConsider Next.js or Remix for server-side rendering and static generation.",
            },
          ],
        ],
      },
      {
        id: "conclusion",
        type: "1-column",
        columns: [
          [
            {
              id: "conclusion-text",
              type: "text",
              content: `## Conclusion

Building scalable React applications requires careful planning and adherence to best practices. Remember:

1. **Start simple** - Don't over-engineer early
2. **Measure first** - Optimize based on real metrics
3. **Test well** - Automated tests save time
4. **Document** - Future you will thank present you

### Next Steps

- Explore the official React documentation
- Try building a small project with these patterns
- Join the React community on Discord

Happy coding! 🚀`,
            },
            {
              id: "author-bio",
              type: "quote",
              content: "Senior Full-Stack Engineer with 10+ years of experience building web applications at scale.",
              author: "Alex Morgan",
              role: "Tech Lead @ TechCorp",
            },
          ],
        ],
      },
    ],
  },
};

// Portfolio Showcase
export const PortfolioShowcase: Story = {
  name: "🎨 Creative Portfolio",
  args: {
    title: "Sarah Chen - UX/UI Designer Portfolio",
    sections: [
      {
        id: "hero",
        type: "1-column",
        columns: [
          [
            {
              id: "hero-text",
              type: "text",
              content: `# Hello, I'm Sarah Chen 👋

## UX/UI Designer · Creative Director

I design beautiful, intuitive digital experiences that users love. With 8+ years of experience working with startups and Fortune 500 companies, I bring both creativity and strategic thinking to every project.

📍 San Francisco, CA · [sarahchen.design](https://sarahchen.design) · hello@sarahchen.design`,
            },
          ],
        ],
      },
      {
        id: "featured-work",
        type: "1-column",
        columns: [
          [
            {
              id: "featured-title",
              type: "text",
              content: "## Featured Projects",
            },
            {
              id: "carousel",
              type: "carousel",
              slides: [
                {
                  src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
                  alt: "FinTech App",
                  title: "FinTech Mobile App",
                  caption: "Complete redesign increasing user engagement by 156%",
                },
                {
                  src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
                  alt: "Analytics Dashboard",
                  title: "Analytics Dashboard",
                  caption: "B2B SaaS platform serving 10k+ businesses",
                },
                {
                  src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200",
                  alt: "E-commerce Platform",
                  title: "E-commerce Redesign",
                  caption: "Conversion rate improved by 43%",
                },
              ],
              autoPlay: true,
              autoPlayInterval: 4000,
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "16/9",
            },
          ],
        ],
      },
      {
        id: "portfolio-grid",
        type: "grid-3x3",
        columns: [
          [
            {
              id: "p1",
              type: "image",
              src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
              alt: "Mobile Design",
              caption: "Mobile Banking App",
            },
          ],
          [
            {
              id: "p2",
              type: "image",
              src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
              alt: "Web Design",
              caption: "SaaS Landing Page",
            },
          ],
          [
            {
              id: "p3",
              type: "image",
              src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
              alt: "Dashboard",
              caption: "Admin Dashboard",
            },
          ],
          [
            {
              id: "p4",
              type: "text",
              content: "**150+**\n\nProjects Completed",
            },
          ],
          [
            {
              id: "quote",
              type: "quote",
              content: "Design is thinking made visual.",
              author: "Saul Bass",
            },
          ],
          [
            {
              id: "p5",
              type: "text",
              content: "**45+**\n\nHappy Clients",
            },
          ],
          [
            {
              id: "p6",
              type: "image",
              src: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=500",
              alt: "Branding",
              caption: "Brand Identity",
            },
          ],
          [
            {
              id: "p7",
              type: "image",
              src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=500",
              alt: "UI Kit",
              caption: "Design System",
            },
          ],
          [
            {
              id: "p8",
              type: "image",
              src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=500",
              alt: "Prototypes",
              caption: "Interactive Prototype",
            },
          ],
        ],
      },
      {
        id: "skills",
        type: "2-columns",
        columns: [
          [
            {
              id: "skills-text",
              type: "text",
              content: `## Skills & Expertise

### Design Tools
- Figma (Expert)
- Adobe Creative Suite
- Sketch
- Principle for Animation

### Development
- HTML/CSS
- React & Vue.js
- Tailwind CSS
- Framer Motion`,
            },
          ],
          [
            {
              id: "approach",
              type: "text",
              content: `## Design Approach

**User-Centered**
Always start with user research and testing

**Data-Driven**
Make decisions based on analytics and metrics

**Collaborative**
Work closely with developers and stakeholders

**Iterative**
Continuous improvement through feedback`,
            },
          ],
        ],
      },
      {
        id: "testimonials",
        type: "1-column",
        columns: [
          [
            {
              id: "testimonial-title",
              type: "text",
              content: "## What Clients Say",
            },
            {
              id: "testimonial",
              type: "quote",
              content: "Sarah transformed our product completely. Her attention to detail and understanding of user psychology is exceptional. Our user engagement metrics have never been better.",
              author: "Michael Rodriguez",
              role: "CEO, TechStartup Inc.",
            },
          ],
        ],
      },
    ],
  },
};

// Product Launch
export const ProductLaunch: Story = {
  name: "🚀 Product Launch Page",
  args: {
    title: "Introducing NovaDash - Next-Gen Analytics Platform",
    sections: [
      {
        id: "hero",
        type: "1-column",
        columns: [
          [
            {
              id: "hero-content",
              type: "text",
              content: `# Introducing NovaDash

## The Analytics Platform Built for Modern Teams

Transform your data into actionable insights with AI-powered analytics, real-time collaboration, and beautiful visualizations.

🎉 **Now Available** · Starting at $49/month · [Try Free for 30 Days →](#)`,
            },
            {
              id: "hero-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
              alt: "NovaDash Dashboard",
              caption: "Beautiful analytics at your fingertips",
            },
          ],
        ],
      },
      {
        id: "features",
        type: "1-column",
        columns: [
          [
            {
              id: "features-title",
              type: "text",
              content: "## Why Teams Choose NovaDash",
            },
          ],
        ],
      },
      {
        id: "features-grid",
        type: "grid-2x3",
        columns: [
          [
            {
              id: "f1",
              type: "text",
              content: "### 🤖 AI-Powered Insights\n\nAutomatic anomaly detection and predictive analytics powered by machine learning.",
            },
          ],
          [
            {
              id: "f2",
              type: "text",
              content: "### ⚡ Real-Time Data\n\nSee your metrics update in real-time with sub-second latency.",
            },
          ],
          [
            {
              id: "f3",
              type: "text",
              content: "### 🎨 Beautiful Dashboards\n\nCreate stunning visualizations with our drag-and-drop dashboard builder.",
            },
          ],
          [
            {
              id: "f4",
              type: "text",
              content: "### 🔒 Enterprise Security\n\nSOC 2 Type II certified with end-to-end encryption.",
            },
          ],
          [
            {
              id: "f5",
              type: "text",
              content: "### 🔌 100+ Integrations\n\nConnect to Salesforce, HubSpot, Google Analytics, and more.",
            },
          ],
          [
            {
              id: "f6",
              type: "text",
              content: "### 👥 Team Collaboration\n\nShare insights, comment, and collaborate in real-time.",
            },
          ],
        ],
      },
      {
        id: "demo",
        type: "1-column",
        columns: [
          [
            {
              id: "demo-title",
              type: "text",
              content: "## See NovaDash in Action",
            },
            {
              id: "demo-video",
              type: "video",
              url: "https://www.w3schools.com/html/mov_bbb.mp4",
              title: "Product Demo",
              description: "Watch a 2-minute overview of NovaDash's key features",
              thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            },
          ],
        ],
      },
      {
        id: "stats",
        type: "grid-4-even",
        columns: [
          [
            {
              id: "stat1",
              type: "text",
              content: "## 10,000+\n\n**Active Users**\n\nTrusted worldwide",
            },
          ],
          [
            {
              id: "stat2",
              type: "text",
              content: "## 50M+\n\n**Data Points**\n\nProcessed daily",
            },
          ],
          [
            {
              id: "stat3",
              type: "text",
              content: "## 99.99%\n\n**Uptime**\n\nReliable service",
            },
          ],
          [
            {
              id: "stat4",
              type: "text",
              content: "## 4.9/5\n\n**Rating**\n\nHighly recommended",
            },
          ],
        ],
      },
      {
        id: "testimonial",
        type: "1-column",
        columns: [
          [
            {
              id: "customer-quote",
              type: "quote",
              content: "NovaDash has completely transformed how we make decisions. The AI insights alone have saved us countless hours of manual analysis.",
              author: "Jennifer Lee",
              role: "VP of Operations, DataCorp",
            },
          ],
        ],
      },
      {
        id: "pricing",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "plan-starter",
              type: "text",
              content: `### Starter

**$49/mo**

Perfect for small teams

- Up to 5 users
- 10 dashboards
- Basic integrations
- Email support

[Start Free Trial](#)`,
            },
          ],
          [
            {
              id: "plan-pro",
              type: "text",
              content: `### Professional

**$149/mo**

For growing companies

- Up to 25 users
- Unlimited dashboards
- All integrations
- Priority support
- AI insights

[Start Free Trial](#)`,
            },
          ],
          [
            {
              id: "plan-enterprise",
              type: "text",
              content: `### Enterprise

**Custom**

For large organizations

- Unlimited users
- Custom integrations
- Dedicated support
- SLA guarantee
- On-premise option

[Contact Sales](#)`,
            },
          ],
        ],
      },
      {
        id: "cta",
        type: "1-column",
        columns: [
          [
            {
              id: "cta-content",
              type: "text",
              content: `## Ready to Get Started?

Join thousands of teams already using NovaDash to make better data-driven decisions.

**No credit card required** · **Cancel anytime** · **30-day money-back guarantee**

[Try NovaDash Free for 30 Days →](#)`,
            },
          ],
        ],
      },
    ],
  },
};

// Company Blog
export const CompanyBlog: Story = {
  name: "🏢 Company News Article",
  args: {
    title: "TechVision Raises $50M Series B to Transform Enterprise AI",
    sections: [
      {
        id: "header",
        type: "1-column",
        columns: [
          [
            {
              id: "headline",
              type: "text",
              content: `# TechVision Raises $50M Series B

## Leading investors back our mission to democratize enterprise AI

**San Francisco, CA** — March 20, 2024

TechVision, the leading enterprise AI platform, today announced it has raised $50 million in Series B funding led by Sequoia Capital, with participation from existing investors Andreessen Horowitz and new investor Index Ventures.`,
            },
            {
              id: "header-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
              alt: "TechVision team",
              caption: "TechVision team celebrating Series B funding",
            },
          ],
        ],
      },
      {
        id: "quote-section",
        type: "1-column",
        columns: [
          [
            {
              id: "ceo-quote",
              type: "quote",
              content: "This funding validates our vision of making enterprise AI accessible to every company, not just tech giants. We're just getting started.",
              author: "Lisa Zhang",
              role: "CEO & Co-founder, TechVision",
            },
          ],
        ],
      },
      {
        id: "growth",
        type: "2-columns",
        columns: [
          [
            {
              id: "growth-text",
              type: "text",
              content: `## Rapid Growth & Traction

Since our Series A 18 months ago, TechVision has experienced tremendous growth:

- **300%** revenue growth year-over-year
- **500+** enterprise customers
- **2M+** AI models deployed
- **50** team members across 3 offices

This momentum demonstrates the strong demand for accessible, enterprise-grade AI solutions.`,
            },
          ],
          [
            {
              id: "growth-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
              alt: "Growth metrics",
              caption: "Revenue growth trajectory",
            },
          ],
        ],
      },
      {
        id: "use-of-funds",
        type: "1-column",
        columns: [
          [
            {
              id: "funds-text",
              type: "text",
              content: `## How We'll Use the Funding

This investment will fuel our expansion across three key areas:`,
            },
          ],
        ],
      },
      {
        id: "priorities",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "priority1",
              type: "text",
              content: `### 🚀 Product Innovation

Expand our AI capabilities with new models, enhanced accuracy, and industry-specific solutions.`,
            },
          ],
          [
            {
              id: "priority2",
              type: "text",
              content: `### 👥 Team Growth

Triple our engineering team and expand to new markets in Europe and Asia-Pacific.`,
            },
          ],
          [
            {
              id: "priority3",
              type: "text",
              content: `### 🤝 Customer Success

Enhance our support and training programs to ensure customer success at scale.`,
            },
          ],
        ],
      },
      {
        id: "investor-quote",
        type: "1-column",
        columns: [
          [
            {
              id: "investor-statement",
              type: "quote",
              content: "TechVision is solving one of the most critical challenges in enterprise: making AI practical and accessible. Their platform approach and customer-first mindset make them uniquely positioned to win this market.",
              author: "Pat Grady",
              role: "Partner, Sequoia Capital",
            },
          ],
        ],
      },
      {
        id: "team",
        type: "1-column",
        columns: [
          [
            {
              id: "team-title",
              type: "text",
              content: "## Meet Our Leadership Team",
            },
          ],
        ],
      },
      {
        id: "leadership",
        type: "grid-2x3",
        columns: [
          [
            {
              id: "leader1",
              type: "text",
              content: "**Lisa Zhang**\nCEO & Co-founder\n\n_Ex-Google AI, Stanford PhD_",
            },
          ],
          [
            {
              id: "leader2",
              type: "text",
              content: "**James Park**\nCTO & Co-founder\n\n_Ex-Meta ML, MIT_",
            },
          ],
          [
            {
              id: "leader3",
              type: "text",
              content: "**Sarah Johnson**\nVP Engineering\n\n_Ex-Amazon AWS_",
            },
          ],
          [
            {
              id: "leader4",
              type: "text",
              content: "**Michael Chen**\nVP Sales\n\n_Ex-Salesforce, Oracle_",
            },
          ],
          [
            {
              id: "leader5",
              type: "text",
              content: "**Emily Rodriguez**\nVP Product\n\n_Ex-Microsoft, IBM_",
            },
          ],
          [
            {
              id: "hiring",
              type: "text",
              content: "**We're Hiring!**\n\n_Join our team_\n\n[View Open Roles →](#)",
            },
          ],
        ],
      },
      {
        id: "closing",
        type: "1-column",
        columns: [
          [
            {
              id: "closing-text",
              type: "text",
              content: `## About TechVision

TechVision is the leading enterprise AI platform helping companies deploy, manage, and scale AI solutions. Founded in 2021, we serve over 500 enterprise customers across financial services, healthcare, retail, and manufacturing.

For more information, visit [techvision.ai](https://techvision.ai)

### Media Contact
press@techvision.ai
+1 (415) 555-0123`,
            },
          ],
        ],
      },
    ],
  },
};

// Documentation Example
export const Documentation: Story = {
  name: "📚 Technical Documentation",
  args: {
    title: "API Integration Guide - Complete Developer Documentation",
    sections: [
      {
        id: "intro",
        type: "1-column",
        columns: [
          [
            {
              id: "intro-text",
              type: "text",
              content: `# API Integration Guide

Complete documentation for integrating with our REST API

**Version:** 2.0
**Last Updated:** March 2024
**Compatibility:** All plans

## Overview

This guide covers everything you need to integrate our API into your application. You'll learn how to authenticate, make requests, handle responses, and troubleshoot common issues.`,
            },
          ],
        ],
      },
      {
        id: "quick-start",
        type: "2-columns",
        columns: [
          [
            {
              id: "getting-started",
              type: "text",
              content: `## Quick Start

### 1. Get Your API Key

Navigate to Settings → API Keys in your dashboard and create a new key.

### 2. Install SDK

\`\`\`bash
npm install @company/api-sdk
\`\`\`

### 3. Initialize

\`\`\`javascript
import { ApiClient } from '@company/api-sdk';

const client = new ApiClient({
  apiKey: 'your_api_key',
  environment: 'production'
});
\`\`\``,
            },
          ],
          [
            {
              id: "first-request",
              type: "text",
              content: `### 4. Make Your First Request

\`\`\`javascript
const response = await client.users.list({
  limit: 10,
  offset: 0
});

console.log(response.data);
\`\`\`

### Response

\`\`\`json
{
  "data": [...],
  "meta": {
    "total": 150,
    "limit": 10,
    "offset": 0
  }
}
\`\`\``,
            },
          ],
        ],
      },
      {
        id: "pdf-docs",
        type: "1-column",
        columns: [
          [
            {
              id: "pdf-title",
              type: "text",
              content: "## Complete API Reference",
            },
            {
              id: "pdf-doc",
              type: "pdf",
              url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              title: "Full API Documentation (PDF)",
              description: "Comprehensive API reference with all endpoints, parameters, and examples",
              displayMode: "both",
            },
          ],
        ],
      },
      {
        id: "authentication",
        type: "1-column",
        columns: [
          [
            {
              id: "auth-text",
              type: "text",
              content: `## Authentication

All API requests require authentication using API keys. Include your key in the \`Authorization\` header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

### Security Best Practices

⚠️ **Never expose your API key in client-side code**

✅ Store keys securely in environment variables
✅ Rotate keys regularly
✅ Use different keys for development and production
✅ Monitor API usage for unusual activity`,
            },
          ],
        ],
      },
      {
        id: "endpoints",
        type: "1-column",
        columns: [
          [
            {
              id: "endpoints-title",
              type: "text",
              content: "## Core Endpoints",
            },
          ],
        ],
      },
      {
        id: "endpoint-grid",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "users-endpoint",
              type: "text",
              content: `### Users API

\`\`\`
GET    /api/v2/users
POST   /api/v2/users
GET    /api/v2/users/:id
PUT    /api/v2/users/:id
DELETE /api/v2/users/:id
\`\`\`

Manage user accounts`,
            },
          ],
          [
            {
              id: "projects-endpoint",
              type: "text",
              content: `### Projects API

\`\`\`
GET    /api/v2/projects
POST   /api/v2/projects
GET    /api/v2/projects/:id
PUT    /api/v2/projects/:id
DELETE /api/v2/projects/:id
\`\`\`

Manage projects`,
            },
          ],
          [
            {
              id: "analytics-endpoint",
              type: "text",
              content: `### Analytics API

\`\`\`
GET /api/v2/analytics/events
GET /api/v2/analytics/users
GET /api/v2/analytics/metrics
\`\`\`

Retrieve analytics data`,
            },
          ],
          [
            {
              id: "webhooks-endpoint",
              type: "text",
              content: `### Webhooks API

\`\`\`
GET    /api/v2/webhooks
POST   /api/v2/webhooks
DELETE /api/v2/webhooks/:id
\`\`\`

Configure event webhooks`,
            },
          ],
        ],
      },
      {
        id: "rate-limiting",
        type: "2-columns",
        columns: [
          [
            {
              id: "limits-text",
              type: "text",
              content: `## Rate Limiting

To ensure fair usage, we enforce rate limits:

| Plan | Requests/Hour |
|------|---------------|
| Free | 1,000 |
| Pro | 10,000 |
| Enterprise | 100,000 |

### Headers

Every response includes rate limit info:

\`\`\`
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9950
X-RateLimit-Reset: 1647364800
\`\`\``,
            },
          ],
          [
            {
              id: "error-handling",
              type: "text",
              content: `## Error Handling

HTTP status codes indicate success or failure:

- **200** OK - Request succeeded
- **201** Created - Resource created
- **400** Bad Request - Invalid params
- **401** Unauthorized - Invalid API key
- **403** Forbidden - No permission
- **404** Not Found - Resource not found
- **429** Too Many Requests - Rate limited
- **500** Server Error - Our fault

Errors include detailed messages:

\`\`\`json
{
  "error": {
    "code": "invalid_parameter",
    "message": "Invalid user ID",
    "param": "user_id"
  }
}
\`\`\``,
            },
          ],
        ],
      },
      {
        id: "support",
        type: "1-column",
        columns: [
          [
            {
              id: "support-text",
              type: "text",
              content: `## Support & Resources

### Need Help?

- 📧 **Email:** api-support@company.com
- 💬 **Slack:** [Join our dev community](https://slack.company.com)
- 📖 **Changelog:** [View recent updates](/changelog)
- 🐛 **Report Issues:** [GitHub Issues](https://github.com/company/api/issues)

### Additional Resources

- [Video Tutorials](/tutorials)
- [Code Examples](/examples)
- [SDKs & Libraries](/sdks)
- [Postman Collection](/postman)`,
            },
          ],
        ],
      },
    ],
  },
};

// Magazine Article
export const MagazineArticle: Story = {
  name: "📰 Magazine-Style Article",
  args: {
    title: "The Future of Remote Work: Inside the Companies Reimagining the Office",
    sections: [
      {
        id: "hero",
        type: "1-column",
        columns: [
          [
            {
              id: "cover",
              type: "image",
              src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200",
              alt: "Remote work setup",
              caption: "The new office: anywhere with an internet connection",
            },
            {
              id: "headline",
              type: "text",
              content: `# The Future of Remote Work

## Inside the Companies Reimagining the Office

By **Emma Thompson** · Photography by **Marcus Lee**
Published in *Tech & Society* · March 2024 · 12 min read`,
            },
          ],
        ],
      },
      {
        id: "intro",
        type: "1-column",
        columns: [
          [
            {
              id: "lede",
              type: "text",
              content: `The pandemic forced millions to work from home overnight. Four years later, those temporary arrangements have evolved into permanent transformations of how we work, where we work, and why we work the way we do.

As companies grapple with return-to-office mandates and employees resist giving up their newfound flexibility, a new model is emerging—one that's neither fully remote nor traditionally office-based, but something entirely different.`,
            },
          ],
        ],
      },
      {
        id: "quote1",
        type: "1-column",
        columns: [
          [
            {
              id: "expert-quote",
              type: "quote",
              content: "We're not going back to 2019. The office as a mandatory daily destination is over. The question now is: what replaces it?",
              author: "Dr. Rebecca Chan",
              role: "Workplace Researcher, MIT",
            },
          ],
        ],
      },
      {
        id: "data-section",
        type: "2-columns",
        columns: [
          [
            {
              id: "data-text",
              type: "text",
              content: `## The Numbers Tell the Story

Recent research paints a clear picture of the shift:

- **74%** of companies now offer flexible work
- **65%** of employees prefer hybrid arrangements
- **$4.6B** saved annually in real estate costs
- **13%** productivity increase reported
- **20%** reduction in employee turnover

These aren't just statistics—they represent a fundamental shift in how organizations operate and how people live their lives.`,
            },
          ],
          [
            {
              id: "data-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
              alt: "Statistics dashboard",
              caption: "Remote work adoption by industry",
            },
          ],
        ],
      },
      {
        id: "case-studies",
        type: "1-column",
        columns: [
          [
            {
              id: "cases-title",
              type: "text",
              content: "## Three Companies Leading the Way",
            },
          ],
        ],
      },
      {
        id: "companies",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "company1",
              type: "text",
              content: `### GitLab
**All-Remote Since 2014**

1,300+ employees across 65 countries with zero offices.

"Our handbook is our office," says CEO Sid Sijbrandij.

Results:
- Hired talent from anywhere
- Lower costs
- 24/7 productivity`,
            },
          ],
          [
            {
              id: "company2",
              type: "text",
              content: `### Salesforce
**"Success From Anywhere"**

Flexible work as standard, offices as collaboration hubs.

Redesigned 30% of office space for team activities.

Results:
- 95% employee satisfaction
- Reduced real estate
- Same productivity`,
            },
          ],
          [
            {
              id: "company3",
              type: "text",
              content: `### Spotify
**"Work From Anywhere"**

Employees choose work location with quarterly team meetups.

Invested in home office equipment for all.

Results:
- Talent from 50+ countries
- Increased diversity
- Higher retention`,
            },
          ],
        ],
      },
      {
        id: "photo-essay",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "photo1",
              type: "image",
              src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600",
              alt: "Video call",
              caption: "Daily standups, reimagined",
            },
          ],
          [
            {
              id: "photo2",
              type: "image",
              src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600",
              alt: "Home office",
              caption: "The new corner office",
            },
          ],
          [
            {
              id: "photo3",
              type: "image",
              src: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600",
              alt: "Coffee shop work",
              caption: "Office hours at the cafe",
            },
          ],
          [
            {
              id: "photo4",
              type: "image",
              src: "https://images.unsplash.com/photo-1600880292201-e24f69370f75?w=600",
              alt: "Collaborative space",
              caption: "When teams do meet",
            },
          ],
        ],
      },
      {
        id: "challenges",
        type: "1-column",
        columns: [
          [
            {
              id: "challenges-text",
              type: "text",
              content: `## The Challenges Remain

Despite the optimism, remote work isn't without its problems:

### Burnout & Always-On Culture
Without clear boundaries between home and work, many employees struggle to disconnect. The "always available" expectation has led to increased stress and burnout.

### Career Development
Junior employees especially struggle without in-person mentorship and spontaneous learning opportunities that offices traditionally provided.

### Innovation & Creativity
Some leaders worry that serendipitous hallway conversations and whiteboard sessions can't be replicated on Zoom.

### Inequality
Not everyone has a suitable home office. Parents, those in small apartments, or people with unreliable internet face disadvantages.`,
            },
          ],
        ],
      },
      {
        id: "future",
        type: "2-columns",
        columns: [
          [
            {
              id: "future-text",
              type: "text",
              content: `## What's Next?

The future of work is still being written, but trends are emerging:

**Async-First Communication**
Moving away from meetings to written updates and recorded videos.

**Virtual HQs**
Platforms like Gather and Virbela creating immersive digital offices.

**Four-Day Weeks**
Companies experimenting with shorter work weeks while maintaining output.`,
            },
          ],
          [
            {
              id: "tech-image",
              type: "image",
              src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600",
              alt: "Future of work",
              caption: "Virtual reality meetings on the horizon",
            },
          ],
        ],
      },
      {
        id: "conclusion",
        type: "1-column",
        columns: [
          [
            {
              id: "closing-quote",
              type: "quote",
              content: "The office isn't dead—it's just not the default anymore. That's actually a good thing. It forces us to be intentional about when and why we gather.",
              author: "Sarah Patel",
              role: "Chief People Officer, Notion",
            },
            {
              id: "conclusion-text",
              type: "text",
              content: `## The Bottom Line

Remote work has matured from a pandemic necessity to a legitimate, often superior way of working for many industries and roles. The companies succeeding in this new era aren't trying to recreate the office remotely—they're inventing entirely new ways of collaborating, communicating, and creating value.

The future of work isn't remote or in-office. It's intentional, flexible, and focused on outcomes rather than presence.

---

*Emma Thompson is a senior editor at Tech & Society magazine and author of "The Distributed Workforce: A Guide for Leaders."*`,
            },
          ],
        ],
      },
    ],
  },
};
