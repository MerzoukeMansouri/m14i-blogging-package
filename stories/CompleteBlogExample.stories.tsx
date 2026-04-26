import type { Meta, StoryObj } from "@storybook/react";
import { BlogPreview } from "@m14i/blogging-core";
import type { LayoutSection } from "@m14i/blogging-core";

// Complete blog post with all block types
const completeBlogSections: LayoutSection[] = [
  {
    id: "hero",
    type: "full",
    columns: [
      [
        {
          id: "hero-text",
          type: "text",
          content: "# Building Modern Web Applications\n\nA comprehensive guide to creating scalable, performant, and maintainable web applications using modern tools and best practices.",
        },
      ],
    ],
  },
  {
    id: "intro",
    type: "two-column",
    columns: [
      [
        {
          id: "intro-left",
          type: "text",
          content: "## Overview\n\nModern web development has evolved significantly over the past decade. Today's developers have access to powerful frameworks, tools, and methodologies that enable the creation of sophisticated applications.",
        },
      ],
      [
        {
          id: "intro-right",
          type: "text",
          content: "## What You'll Learn\n\n- Component-based architecture\n- State management patterns\n- Performance optimization\n- Testing strategies\n- Deployment best practices",
        },
      ],
    ],
  },
  {
    id: "quote-1",
    type: "full",
    columns: [
      [
        {
          id: "quote-content",
          type: "quote",
          content: "Any application that can be written in JavaScript, will eventually be written in JavaScript.",
          author: "Jeff Atwood (Atwood's Law)",
        },
      ],
    ],
  },
  {
    id: "code-example",
    type: "full",
    columns: [
      [
        {
          id: "code-intro",
          type: "text",
          content: "## Code Example\n\nHere's a simple React component using hooks:",
        },
        {
          id: "code-block",
          type: "code",
          content: `import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}`,
          language: "typescript",
        },
      ],
    ],
  },
  {
    id: "three-col",
    type: "three-column",
    columns: [
      [
        {
          id: "col1",
          type: "text",
          content: "### Performance\n\nOptimize for speed with code splitting, lazy loading, and caching strategies.",
        },
      ],
      [
        {
          id: "col2",
          type: "text",
          content: "### Scalability\n\nBuild applications that grow with your business needs using modular architecture.",
        },
      ],
      [
        {
          id: "col3",
          type: "text",
          content: "### Maintainability\n\nWrite clean, documented code that's easy for your team to understand and extend.",
        },
      ],
    ],
  },
  {
    id: "architecture",
    type: "full",
    columns: [
      [
        {
          id: "arch-text",
          type: "text",
          content: "## Application Architecture\n\nA well-structured application follows the principles of separation of concerns and single responsibility. Here's a typical structure:",
        },
        {
          id: "arch-code",
          type: "code",
          content: `app/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── services/           # API and business logic
├── utils/              # Helper functions
├── types/              # TypeScript definitions
└── pages/              # Route pages`,
          language: "bash",
        },
      ],
    ],
  },
  {
    id: "best-practices",
    type: "two-column",
    columns: [
      [
        {
          id: "practices-left",
          type: "text",
          content: "## Best Practices\n\n1. **Component Design**\n   - Keep components small and focused\n   - Use composition over inheritance\n   - Implement proper prop validation\n\n2. **State Management**\n   - Lift state only when necessary\n   - Use context for global state\n   - Consider state management libraries for complex apps",
        },
      ],
      [
        {
          id: "practices-right",
          type: "text",
          content: "## Testing Strategy\n\n1. **Unit Tests**\n   - Test individual functions and components\n   - Mock external dependencies\n   - Aim for high coverage\n\n2. **Integration Tests**\n   - Test component interactions\n   - Verify data flow\n   - Test user workflows",
        },
      ],
    ],
  },
  {
    id: "conclusion",
    type: "full",
    columns: [
      [
        {
          id: "conclusion-text",
          type: "text",
          content: "## Conclusion\n\nBuilding modern web applications requires a combination of technical skills, architectural knowledge, and best practices. By following the principles outlined in this guide, you'll be well-equipped to create applications that are performant, scalable, and maintainable.\n\nRemember: good code is not just about making things work—it's about making things work well, and making them easy to change when requirements evolve.",
        },
      ],
    ],
  },
];

const meta = {
  title: "Examples/Complete Blog Post",
  component: BlogPreview,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof BlogPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TechnicalArticle: Story = {
  args: {
    title: "Building Modern Web Applications",
    excerpt: "A comprehensive guide to creating scalable, performant, and maintainable web applications using modern tools and best practices.",
    sections: completeBlogSections,
    showReadingTime: true,
    date: new Date("2024-03-15"),
    dateLocale: "en-US",
  },
  parameters: {
    docs: {
      description: {
        story: "A complete technical blog post demonstrating all layout types and content blocks.",
      },
    },
  },
};

export const MagazineStyle: Story = {
  args: {
    title: "Building Modern Web Applications",
    excerpt: "A comprehensive guide to creating scalable, performant, and maintainable web applications.",
    sections: completeBlogSections,
    showReadingTime: true,
    date: new Date("2024-03-15"),
    theme: {
      container: "max-w-6xl mx-auto px-8 py-16",
      header: "mb-20 text-center",
      title: "text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
      excerpt: "text-2xl text-gray-600 mb-10 font-light max-w-3xl mx-auto",
      meta: "flex items-center justify-center gap-8 text-base text-gray-500",
      article: "space-y-16 prose prose-lg max-w-none",
      section: "mb-20",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Magazine-style layout with custom theming and gradient effects.",
      },
    },
  },
};

export const MinimalistDesign: Story = {
  args: {
    title: "Building Modern Web Applications",
    sections: completeBlogSections,
    showReadingTime: false,
    showMeta: false,
    theme: {
      container: "max-w-2xl mx-auto px-4 py-16",
      title: "text-4xl font-serif mb-12 leading-tight",
      article: "space-y-8 font-serif text-gray-800 text-lg leading-relaxed",
      section: "mb-12",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Clean, minimalist design focused on typography and readability.",
      },
    },
  },
};
