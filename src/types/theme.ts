/**
 * Theme Configuration Types for M14I Blogging
 *
 * These types define the complete theming system for the blog components.
 * Users can override CSS variables or use className props for full customization.
 */

/**
 * CSS Variable Theme Configuration
 *
 * All color values should be in HSL format without the hsl() wrapper.
 * Example: "220 13% 91%" instead of "hsl(220, 13%, 91%)"
 */
export interface CSSVariablesTheme {
  /* Base Colors (HSL values without hsl() wrapper) */
  colors?: {
    background?: string;
    foreground?: string;
    card?: string;
    cardForeground?: string;
    popover?: string;
    popoverForeground?: string;
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    muted?: string;
    mutedForeground?: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    destructiveForeground?: string;
    border?: string;
    input?: string;
    ring?: string;
  };

  /* Typography */
  typography?: {
    fontFamily?: string;
    fontFamilyMono?: string;
    fontSize?: {
      base?: string;
      sm?: string;
      xs?: string;
      lg?: string;
      xl?: string;
      "2xl"?: string;
      "3xl"?: string;
      "4xl"?: string;
      "5xl"?: string;
    };
    lineHeight?: {
      base?: string;
      tight?: string;
      relaxed?: string;
    };
    fontWeight?: {
      normal?: string;
      medium?: string;
      semibold?: string;
      bold?: string;
    };
  };

  /* Spacing */
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
    "3xl"?: string;
    "4xl"?: string;
  };

  /* Border Radius */
  radius?: {
    none?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
    full?: string;
  };

  /* Shadows */
  shadow?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };

  /* Layout */
  layout?: {
    containerMaxWidth?: string;
    containerPadding?: string;
    sectionGap?: string;
    columnGap?: string;
    blockGap?: string;
  };

  /* Component-specific */
  quote?: {
    borderColor?: string;
    borderWidth?: string;
  };
}

/**
 * Component-level className overrides
 *
 * Use these to completely customize individual components
 */
export interface BlogPreviewClassNames {
  container?: string;
  header?: string;
  title?: string;
  meta?: string;
  article?: string;
  section?: string;
  column?: string;
}

export interface ContentBlockClassNames {
  text?: string;
  image?: string;
  imageCaption?: string;
  video?: string;
  videoCaption?: string;
  quote?: string;
  quoteContent?: string;
  quoteFooter?: string;
  pdf?: string;
  pdfEmbed?: string;
  pdfTitle?: string;
  pdfDescription?: string;
  pdfDownloadButton?: string;
  carousel?: string;
  carouselSlide?: string;
  carouselImage?: string;
  carouselCaption?: string;
  carouselTitle?: string;
  carouselArrow?: string;
  carouselDot?: string;
  carouselDotActive?: string;
}

/**
 * Complete theme configuration
 */
export interface BlogTheme {
  cssVariables?: CSSVariablesTheme;
  classNames?: {
    preview?: BlogPreviewClassNames;
    contentBlock?: ContentBlockClassNames;
  };
}

/**
 * Predefined theme presets
 */
export const themePresets = {
  default: {
    cssVariables: {
      colors: {
        background: "0 0% 100%",
        foreground: "0 0% 3.9%",
        primary: "0 0% 9%",
        primaryForeground: "0 0% 98%",
      },
    },
  } as BlogTheme,

  dark: {
    cssVariables: {
      colors: {
        background: "0 0% 3.9%",
        foreground: "0 0% 98%",
        primary: "0 0% 98%",
        primaryForeground: "0 0% 9%",
        muted: "0 0% 14.9%",
        mutedForeground: "0 0% 63.9%",
        border: "0 0% 14.9%",
      },
    },
  } as BlogTheme,

  ocean: {
    cssVariables: {
      colors: {
        background: "210 40% 98%",
        foreground: "222 47% 11%",
        primary: "210 100% 50%",
        primaryForeground: "0 0% 100%",
        accent: "210 100% 95%",
        accentForeground: "210 100% 50%",
        border: "210 40% 90%",
      },
      quote: {
        borderColor: "#0ea5e9",
      },
    },
  } as BlogTheme,

  sunset: {
    cssVariables: {
      colors: {
        background: "24 100% 99%",
        foreground: "20 14.3% 4.1%",
        primary: "24 95% 53%",
        primaryForeground: "0 0% 100%",
        accent: "24 100% 95%",
        accentForeground: "24 95% 53%",
        border: "20 20% 90%",
      },
      quote: {
        borderColor: "#fb923c",
      },
    },
  } as BlogTheme,

  forest: {
    cssVariables: {
      colors: {
        background: "140 40% 98%",
        foreground: "140 10% 10%",
        primary: "142 71% 45%",
        primaryForeground: "0 0% 100%",
        accent: "142 71% 95%",
        accentForeground: "142 71% 45%",
        border: "140 30% 90%",
      },
      quote: {
        borderColor: "#10b981",
      },
    },
  } as BlogTheme,

  minimal: {
    cssVariables: {
      colors: {
        background: "0 0% 100%",
        foreground: "0 0% 0%",
        primary: "0 0% 0%",
        primaryForeground: "0 0% 100%",
        muted: "0 0% 97%",
        mutedForeground: "0 0% 40%",
        border: "0 0% 90%",
      },
      typography: {
        fontFamily: 'Georgia, "Times New Roman", serif',
      },
      radius: {
        lg: "0",
        md: "0",
        sm: "0",
      },
    },
  } as BlogTheme,
} as const;

/**
 * Utility function to apply theme CSS variables
 */
export function applyTheme(theme: CSSVariablesTheme): void {
  const root = document.documentElement;

  // Apply colors
  if (theme.colors) {
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVarName = `--blog-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  }

  // Apply typography
  if (theme.typography) {
    if (theme.typography.fontFamily) {
      root.style.setProperty("--blog-font-family", theme.typography.fontFamily);
    }
    if (theme.typography.fontFamilyMono) {
      root.style.setProperty("--blog-font-family-mono", theme.typography.fontFamilyMono);
    }
    if (theme.typography.fontSize) {
      Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--blog-font-size-${key}`, value);
      });
    }
    if (theme.typography.lineHeight) {
      Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
        root.style.setProperty(`--blog-line-height-${key}`, value);
      });
    }
    if (theme.typography.fontWeight) {
      Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
        root.style.setProperty(`--blog-font-weight-${key}`, value);
      });
    }
  }

  // Apply spacing
  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--blog-spacing-${key}`, value);
    });
  }

  // Apply radius
  if (theme.radius) {
    Object.entries(theme.radius).forEach(([key, value]) => {
      root.style.setProperty(`--blog-radius-${key}`, value);
    });
  }

  // Apply shadows
  if (theme.shadow) {
    Object.entries(theme.shadow).forEach(([key, value]) => {
      root.style.setProperty(`--blog-shadow-${key}`, value);
    });
  }

  // Apply layout
  if (theme.layout) {
    Object.entries(theme.layout).forEach(([key, value]) => {
      const cssVarName = `--blog-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  }

  // Apply quote
  if (theme.quote) {
    if (theme.quote.borderColor) {
      root.style.setProperty("--blog-quote-border-color", theme.quote.borderColor);
    }
    if (theme.quote.borderWidth) {
      root.style.setProperty("--blog-quote-border-width", theme.quote.borderWidth);
    }
  }
}
