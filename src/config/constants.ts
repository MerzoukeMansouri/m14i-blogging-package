// Default values for various configurations

// Theme defaults
export const DEFAULT_COLORS = {
  primary: "hsl(var(--primary))",
  border: "hsl(var(--border))",
  background: "hsl(var(--background))",
  accent: "hsl(var(--accent))",
} as const;

// UI defaults
export const DEFAULT_UI_SETTINGS = {
  showPreviewToggle: true,
  compactMode: false,
  sidebarWidth: "320px",
} as const;

// Content defaults
export const DEFAULT_CONTENT_PLACEHOLDERS = {
  text: "Votre texte ici... (Markdown supporté)",
  quote: "Votre citation ici",
  imageAlt: "Description de l'image",
  videoCaption: "Description de la vidéo",
  pdfTitle: "Nom du document",
} as const;

// Carousel defaults
export const DEFAULT_CAROUSEL_SETTINGS = {
  autoPlay: false,
  autoPlayInterval: 3000,
  showDots: true,
  showArrows: true,
  loop: true,
  aspectRatio: "16/9" as const,
} as const;

// PDF defaults
export const DEFAULT_PDF_SETTINGS = {
  displayMode: "both" as const,
  height: "600px",
} as const;

// Reading settings for SEO analysis
export const READING_SPEED_WPM = 200;