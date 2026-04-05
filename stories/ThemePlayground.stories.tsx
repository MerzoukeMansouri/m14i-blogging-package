import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { BlogPreview } from "../src/components/BlogPreview";
import type { LayoutSection } from "../src/types";

const meta: Meta<typeof BlogPreview> = {
  title: "Theming/Theme Playground",
  component: BlogPreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Interactive Theme Playground

Use the controls below to customize all CSS variables in real-time.
This is the most comprehensive way to test and preview your custom theme before implementing it in your app.

## How to Use

1. Adjust the controls to customize colors, typography, spacing, etc.
2. Copy the generated CSS variables to your project
3. Apply them in your global CSS file

\`\`\`css
:root {
  --blog-primary: 220 100% 50%;
  --blog-font-family: 'Inter', sans-serif;
  --blog-radius-lg: 1rem;
  /* ... more variables */
}
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogPreview>;

const playgroundSections: LayoutSection[] = [
  {
    id: "section-1",
    type: "1-column",
    columns: [
      [
        {
          id: "intro",
          type: "text",
          content: "# Theme Playground\n\nUse the **controls panel** to customize every aspect of the theme. Changes apply in real-time!",
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
          id: "content",
          type: "text",
          content: "## Interactive Customization\n\nAdjust colors, typography, spacing, and more using the controls. Perfect for designers and developers alike.",
        },
      ],
      [
        {
          id: "quote",
          type: "quote",
          content: "The details are not the details. They make the design.",
          author: "Charles Eames",
          role: "Designer",
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
          id: "list",
          type: "text",
          content: `## Features\n\n- **Real-time updates**: See changes instantly\n- **Complete control**: Every CSS variable is customizable\n- **Copy & paste**: Export your theme for production use\n- **Visual feedback**: Test with real content\n\nThis makes theme development fast and intuitive.`,
        },
      ],
    ],
  },
];

export const Playground: Story = {
  args: {
    title: "Theme Playground - Customize Everything!",
    sections: playgroundSections,
  },
  argTypes: {
    // Colors
    primaryHue: {
      control: { type: "range", min: 0, max: 360, step: 1 },
      description: "Primary color hue (0-360)",
      table: { category: "Colors - Primary" },
    },
    primarySaturation: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Primary color saturation (%)",
      table: { category: "Colors - Primary" },
    },
    primaryLightness: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Primary color lightness (%)",
      table: { category: "Colors - Primary" },
    },

    backgroundHue: {
      control: { type: "range", min: 0, max: 360, step: 1 },
      description: "Background hue (0-360)",
      table: { category: "Colors - Background" },
    },
    backgroundSaturation: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Background saturation (%)",
      table: { category: "Colors - Background" },
    },
    backgroundLightness: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Background lightness (%)",
      table: { category: "Colors - Background" },
    },

    foregroundHue: {
      control: { type: "range", min: 0, max: 360, step: 1 },
      description: "Text color hue (0-360)",
      table: { category: "Colors - Text" },
    },
    foregroundSaturation: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Text color saturation (%)",
      table: { category: "Colors - Text" },
    },
    foregroundLightness: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Text color lightness (%)",
      table: { category: "Colors - Text" },
    },

    mutedHue: {
      control: { type: "range", min: 0, max: 360, step: 1 },
      description: "Muted color hue (0-360)",
      table: { category: "Colors - Muted" },
    },
    mutedSaturation: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Muted saturation (%)",
      table: { category: "Colors - Muted" },
    },
    mutedLightness: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Muted lightness (%)",
      table: { category: "Colors - Muted" },
    },

    // Typography
    fontFamily: {
      control: "select",
      options: [
        "system-ui, -apple-system, sans-serif",
        "Georgia, Times, serif",
        "'Inter', sans-serif",
        "'Roboto', sans-serif",
        "'Playfair Display', serif",
        "'Montserrat', sans-serif",
        "'Merriweather', serif",
      ],
      description: "Body font family",
      table: { category: "Typography" },
    },
    baseFontSize: {
      control: { type: "range", min: 12, max: 24, step: 1 },
      description: "Base font size (px)",
      table: { category: "Typography" },
    },
    lineHeight: {
      control: { type: "range", min: 1, max: 2.5, step: 0.05 },
      description: "Base line height",
      table: { category: "Typography" },
    },
    fontWeightNormal: {
      control: "select",
      options: ["300", "400", "500"],
      description: "Normal font weight",
      table: { category: "Typography" },
    },
    fontWeightBold: {
      control: "select",
      options: ["600", "700", "800", "900"],
      description: "Bold font weight",
      table: { category: "Typography" },
    },

    // Spacing
    spacingScale: {
      control: { type: "range", min: 0.5, max: 2, step: 0.1 },
      description: "Spacing scale multiplier",
      table: { category: "Spacing" },
    },

    // Border Radius
    borderRadius: {
      control: "select",
      options: ["0", "0.25rem", "0.375rem", "0.5rem", "0.75rem", "1rem", "1.5rem"],
      description: "Border radius",
      table: { category: "Layout" },
    },

    // Container
    containerMaxWidth: {
      control: "select",
      options: ["768px", "1024px", "1280px", "1536px", "100%"],
      description: "Container max width",
      table: { category: "Layout" },
    },
    containerPadding: {
      control: "select",
      options: ["0.5rem", "1rem", "1.5rem", "2rem", "3rem"],
      description: "Container padding",
      table: { category: "Layout" },
    },

    // Quote
    quoteBorderColor: {
      control: "color",
      description: "Quote border color",
      table: { category: "Components - Quote" },
    },
    quoteBorderWidth: {
      control: "select",
      options: ["2px", "3px", "4px", "6px", "8px"],
      description: "Quote border width",
      table: { category: "Components - Quote" },
    },
  },
  args: {
    // Default values
    primaryHue: 220,
    primarySaturation: 90,
    primaryLightness: 50,
    backgroundHue: 0,
    backgroundSaturation: 0,
    backgroundLightness: 100,
    foregroundHue: 0,
    foregroundSaturation: 0,
    foregroundLightness: 4,
    mutedHue: 0,
    mutedSaturation: 0,
    mutedLightness: 96,
    fontFamily: "system-ui, -apple-system, sans-serif",
    baseFontSize: 16,
    lineHeight: 1.5,
    fontWeightNormal: "400",
    fontWeightBold: "700",
    spacingScale: 1,
    borderRadius: "0.5rem",
    containerMaxWidth: "1024px",
    containerPadding: "1rem",
    quoteBorderColor: "#B87333",
    quoteBorderWidth: "4px",
  },
  render: (args, context) => {
    const {
      primaryHue,
      primarySaturation,
      primaryLightness,
      backgroundHue,
      backgroundSaturation,
      backgroundLightness,
      foregroundHue,
      foregroundSaturation,
      foregroundLightness,
      mutedHue,
      mutedSaturation,
      mutedLightness,
      fontFamily,
      baseFontSize,
      lineHeight,
      fontWeightNormal,
      fontWeightBold,
      spacingScale,
      borderRadius,
      containerMaxWidth,
      containerPadding,
      quoteBorderColor,
      quoteBorderWidth,
    } = context.args as any;

    useEffect(() => {
      const root = document.documentElement;

      // Colors
      root.style.setProperty("--blog-primary", `${primaryHue} ${primarySaturation}% ${primaryLightness}%`);
      root.style.setProperty("--blog-background", `${backgroundHue} ${backgroundSaturation}% ${backgroundLightness}%`);
      root.style.setProperty("--blog-foreground", `${foregroundHue} ${foregroundSaturation}% ${foregroundLightness}%`);
      root.style.setProperty("--blog-muted", `${mutedHue} ${mutedSaturation}% ${mutedLightness}%`);

      // Derive related colors
      root.style.setProperty("--blog-primary-foreground", `${primaryHue} ${primarySaturation}% ${primaryLightness > 50 ? 10 : 98}%`);
      root.style.setProperty("--blog-muted-foreground", `${mutedHue} ${mutedSaturation}% ${mutedLightness > 50 ? mutedLightness - 45 : mutedLightness + 45}%`);
      root.style.setProperty("--blog-border", `${backgroundHue} ${backgroundSaturation}% ${backgroundLightness > 50 ? backgroundLightness - 10 : backgroundLightness + 10}%`);

      // Typography
      root.style.setProperty("--blog-font-family", fontFamily);
      root.style.setProperty("--blog-font-size-base", `${baseFontSize}px`);
      root.style.setProperty("--blog-line-height-base", lineHeight.toString());
      root.style.setProperty("--blog-font-weight-normal", fontWeightNormal);
      root.style.setProperty("--blog-font-weight-bold", fontWeightBold);

      // Spacing (scaled)
      root.style.setProperty("--blog-spacing-xs", `${0.25 * spacingScale}rem`);
      root.style.setProperty("--blog-spacing-sm", `${0.5 * spacingScale}rem`);
      root.style.setProperty("--blog-spacing-md", `${1 * spacingScale}rem`);
      root.style.setProperty("--blog-spacing-lg", `${1.5 * spacingScale}rem`);
      root.style.setProperty("--blog-spacing-xl", `${2 * spacingScale}rem`);
      root.style.setProperty("--blog-spacing-2xl", `${3 * spacingScale}rem`);

      // Border radius
      root.style.setProperty("--blog-radius-lg", borderRadius);
      root.style.setProperty("--blog-radius-md", `calc(${borderRadius} * 0.75)`);
      root.style.setProperty("--blog-radius-sm", `calc(${borderRadius} * 0.5)`);

      // Layout
      root.style.setProperty("--blog-container-max-width", containerMaxWidth);
      root.style.setProperty("--blog-container-padding", containerPadding);

      // Quote
      root.style.setProperty("--blog-quote-border-color", quoteBorderColor);
      root.style.setProperty("--blog-quote-border-width", quoteBorderWidth);
    }, [
      primaryHue, primarySaturation, primaryLightness,
      backgroundHue, backgroundSaturation, backgroundLightness,
      foregroundHue, foregroundSaturation, foregroundLightness,
      mutedHue, mutedSaturation, mutedLightness,
      fontFamily, baseFontSize, lineHeight,
      fontWeightNormal, fontWeightBold,
      spacingScale, borderRadius,
      containerMaxWidth, containerPadding,
      quoteBorderColor, quoteBorderWidth,
    ]);

    return <BlogPreview {...args} />;
  },
};
