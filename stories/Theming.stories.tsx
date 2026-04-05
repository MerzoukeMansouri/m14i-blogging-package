import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { BlogPreview } from "../src/components/BlogPreview";
import { applyTheme, themePresets } from "../src/types/theme";
import type { LayoutSection } from "../src/types";

const meta: Meta<typeof BlogPreview> = {
  title: "Theming/CSS Variables",
  component: BlogPreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# CSS Variables Theming

This story demonstrates how to use CSS variables to theme the blog components.
Each preset applies a different set of CSS variable overrides to completely change the appearance.

## Available Presets
- **Default**: Clean, minimal light theme
- **Dark**: Dark mode with light text
- **Ocean**: Blue ocean-inspired theme
- **Sunset**: Warm orange/amber theme
- **Forest**: Green nature-inspired theme
- **Minimal**: Ultra-minimal with serif fonts

## How to Use

\`\`\`tsx
import { applyTheme, themePresets } from 'm14i-blogging';

useEffect(() => {
  applyTheme(themePresets.ocean.cssVariables!);
}, []);
\`\`\`

Or create your own theme:

\`\`\`tsx
import { applyTheme, CSSVariablesTheme } from 'm14i-blogging';

const myTheme: CSSVariablesTheme = {
  colors: {
    primary: "220 100% 50%",
    background: "220 15% 97%",
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
};

applyTheme(myTheme);
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogPreview>;

const richSections: LayoutSection[] = [
  {
    id: "section-1",
    type: "1-column",
    columns: [
      [
        {
          id: "intro",
          type: "text",
          content: "# The Art of Modern Blogging\n\nDiscover how to create beautiful, customizable blog layouts with ease.",
        },
      ],
    ],
  },
  {
    id: "section-2",
    type: "2-columns",
    columns: [
      [
        {
          id: "left",
          type: "text",
          content: "## Flexible Layouts\n\nCreate multi-column layouts that adapt to your content. Mix text, images, videos, and more.",
        },
      ],
      [
        {
          id: "quote-1",
          type: "quote",
          content: "Design is not just what it looks like and feels like. Design is how it works.",
          author: "Steve Jobs",
          role: "Apple Co-founder",
        },
      ],
    ],
  },
  {
    id: "section-3",
    type: "1-column",
    columns: [
      [
        {
          id: "main-content",
          type: "text",
          content: `## Rich Content Support\n\nThe blogging library supports **markdown formatting**, including:\n\n- Bold and *italic* text\n- Lists and nested items\n- Code blocks and inline \`code\`\n- And much more!\n\nThis makes it easy to create professional-looking content without writing complex HTML.`,
        },
      ],
    ],
  },
];

// Default Theme Story
export const DefaultTheme: Story = {
  args: {
    title: "Default Theme Example",
    sections: richSections,
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        applyTheme(themePresets.default.cssVariables!);
      }, []);
      return <Story />;
    },
  ],
};

// Dark Theme Story
export const DarkTheme: Story = {
  args: {
    title: "Dark Theme Example",
    sections: richSections,
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        applyTheme(themePresets.dark.cssVariables!);
      }, []);
      return (
        <div style={{ background: "hsl(0 0% 3.9%)", minHeight: "100vh", padding: "2rem" }}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Ocean Theme Story
export const OceanTheme: Story = {
  args: {
    title: "Ocean Theme Example",
    sections: richSections,
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        applyTheme(themePresets.ocean.cssVariables!);
      }, []);
      return <Story />;
    },
  ],
};

// Sunset Theme Story
export const SunsetTheme: Story = {
  args: {
    title: "Sunset Theme Example",
    sections: richSections,
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        applyTheme(themePresets.sunset.cssVariables!);
      }, []);
      return <Story />;
    },
  ],
};

// Forest Theme Story
export const ForestTheme: Story = {
  args: {
    title: "Forest Theme Example",
    sections: richSections,
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        applyTheme(themePresets.forest.cssVariables!);
      }, []);
      return <Story />;
    },
  ],
};

// Minimal Theme Story
export const MinimalTheme: Story = {
  args: {
    title: "Minimal Theme Example",
    sections: richSections,
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        applyTheme(themePresets.minimal.cssVariables!);
      }, []);
      return <Story />;
    },
  ],
};

// Custom Interactive Theme with Controls
export const CustomTheme: Story = {
  args: {
    title: "Custom Theme Example",
    sections: richSections,
  },
  argTypes: {
    primaryColor: {
      control: "color",
      description: "Primary brand color",
      table: { category: "Theme Colors" },
    },
    backgroundColor: {
      control: "color",
      description: "Page background color",
      table: { category: "Theme Colors" },
    },
    textColor: {
      control: "color",
      description: "Main text color",
      table: { category: "Theme Colors" },
    },
    fontFamily: {
      control: "select",
      options: [
        "system-ui, sans-serif",
        "Georgia, serif",
        "'Inter', sans-serif",
        "'Playfair Display', serif",
        "'Roboto', sans-serif",
      ],
      description: "Font family",
      table: { category: "Typography" },
    },
    borderRadius: {
      control: "select",
      options: ["0", "0.25rem", "0.5rem", "0.75rem", "1rem", "1.5rem"],
      description: "Border radius size",
      table: { category: "Layout" },
    },
  },
  render: (args, context) => {
    const { primaryColor, backgroundColor, textColor, fontFamily, borderRadius } = context.args as any;

    useEffect(() => {
      const root = document.documentElement;

      if (primaryColor) {
        // Convert hex to HSL
        const hsl = hexToHSL(primaryColor);
        root.style.setProperty("--blog-primary", hsl);
      }

      if (backgroundColor) {
        const hsl = hexToHSL(backgroundColor);
        root.style.setProperty("--blog-background", hsl);
      }

      if (textColor) {
        const hsl = hexToHSL(textColor);
        root.style.setProperty("--blog-foreground", hsl);
      }

      if (fontFamily) {
        root.style.setProperty("--blog-font-family", fontFamily);
      }

      if (borderRadius) {
        root.style.setProperty("--blog-radius-lg", borderRadius);
      }
    }, [primaryColor, backgroundColor, textColor, fontFamily, borderRadius]);

    return <BlogPreview {...args} />;
  },
};

// Helper function to convert hex to HSL
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${h} ${s}% ${lPercent}%`;
}
