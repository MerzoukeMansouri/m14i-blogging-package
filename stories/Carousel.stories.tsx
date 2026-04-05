import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogPreview } from "../src/components/BlogPreview";
import type { LayoutSection } from "../src/types";

const meta: Meta<typeof BlogPreview> = {
  title: "Content Blocks/Carousel",
  component: BlogPreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Carousel Content Block

Un carousel moderne et interactif pour afficher des diaporamas d'images avec navigation et autoplay.

## Features

✅ **Navigation par flèches** - Boutons gauche/droite (masquables)
✅ **Navigation par points** - Indicateurs de position (masquables)
✅ **Auto-play** - Défilement automatique configurable
✅ **Loop** - Retour au début après la dernière slide
✅ **Aspect Ratios** - 16:9, 4:3, 1:1, 21:9
✅ **Titres & Captions** - Overlay sur chaque slide
✅ **Transitions fluides** - Animations CSS performantes
✅ **Responsive** - Adaptatif sur tous les appareils
✅ **Accessible** - ARIA labels et navigation au clavier

## Usage

\`\`\`tsx
const carouselBlock: CarouselBlock = {
  id: "carousel-1",
  type: "carousel",
  slides: [
    {
      src: "https://example.com/slide1.jpg",
      alt: "Slide 1",
      title: "Premier Slide",
      caption: "Description du slide"
    },
    // ... more slides
  ],
  autoPlay: true,
  autoPlayInterval: 3000, // milliseconds
  showDots: true,
  showArrows: true,
  loop: true,
  aspectRatio: "16/9"
};
\`\`\`

## Props

- **slides**: Array d'images avec src, alt, title (opt.), caption (opt.)
- **autoPlay**: Boolean - activer l'auto-play (default: false)
- **autoPlayInterval**: Number - intervalle en ms (default: 3000)
- **showDots**: Boolean - afficher les points (default: true)
- **showArrows**: Boolean - afficher les flèches (default: true)
- **loop**: Boolean - boucler à la fin (default: true)
- **aspectRatio**: "16/9" | "4/3" | "1/1" | "21/9" (default: "16/9")
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogPreview>;

// Sample slides
const natureSlides = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    alt: "Mountain landscape",
    title: "Montagnes Majestueuses",
    caption: "Les sommets enneigés des Alpes"
  },
  {
    src: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=1200",
    alt: "Ocean view",
    title: "Océan Infini",
    caption: "Les vagues de l'océan Pacifique"
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200",
    alt: "Forest",
    title: "Forêt Mystérieuse",
    caption: "La nature à l'état pur"
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200",
    alt: "Desert",
    title: "Désert Ardent",
    caption: "Les dunes du Sahara"
  }
];

// Default - All features enabled
export const Default: Story = {
  args: {
    title: "Carousel par Défaut",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides,
              autoPlay: false,
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "16/9"
            }
          ]
        ]
      }
    ]
  }
};

// Auto-play enabled
export const AutoPlay: Story = {
  args: {
    title: "Carousel avec Auto-play",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "text-1",
              type: "text",
              content: "Ce carousel défile automatiquement toutes les 3 secondes."
            },
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides,
              autoPlay: true,
              autoPlayInterval: 3000,
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "16/9"
            }
          ]
        ]
      }
    ]
  }
};

// Fast auto-play
export const FastAutoPlay: Story = {
  args: {
    title: "Défilement Rapide",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides,
              autoPlay: true,
              autoPlayInterval: 1500, // 1.5 seconds
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "16/9"
            }
          ]
        ]
      }
    ]
  }
};

// Without arrows
export const WithoutArrows: Story = {
  args: {
    title: "Sans Flèches de Navigation",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides,
              autoPlay: false,
              showDots: true,
              showArrows: false,
              loop: true,
              aspectRatio: "16/9"
            }
          ]
        ]
      }
    ]
  }
};

// Without dots
export const WithoutDots: Story = {
  args: {
    title: "Sans Points de Navigation",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides,
              autoPlay: false,
              showDots: false,
              showArrows: true,
              loop: true,
              aspectRatio: "16/9"
            }
          ]
        ]
      }
    ]
  }
};

// Minimal (no navigation)
export const Minimal: Story = {
  args: {
    title: "Carousel Minimal",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides,
              autoPlay: true,
              autoPlayInterval: 4000,
              showDots: false,
              showArrows: false,
              loop: true,
              aspectRatio: "16/9"
            }
          ]
        ]
      }
    ]
  }
};

// No loop
export const NoLoop: Story = {
  args: {
    title: "Sans Boucle",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "text-1",
              type: "text",
              content: "Ce carousel s'arrête à la dernière slide (pas de boucle)."
            },
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides,
              autoPlay: false,
              showDots: true,
              showArrows: true,
              loop: false,
              aspectRatio: "16/9"
            }
          ]
        ]
      }
    ]
  }
};

// Square aspect ratio (1:1)
export const SquareFormat: Story = {
  args: {
    title: "Format Carré (1:1)",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides,
              autoPlay: true,
              autoPlayInterval: 3000,
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "1/1"
            }
          ]
        ]
      }
    ]
  }
};

// 4:3 aspect ratio
export const StandardFormat: Story = {
  args: {
    title: "Format Standard (4:3)",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides,
              autoPlay: false,
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "4/3"
            }
          ]
        ]
      }
    ]
  }
};

// Ultra-wide (21:9)
export const UltraWide: Story = {
  args: {
    title: "Format Ultra-large (21:9)",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides,
              autoPlay: false,
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "21/9"
            }
          ]
        ]
      }
    ]
  }
};

// Portfolio showcase
export const PortfolioShowcase: Story = {
  args: {
    title: "Showcase Portfolio",
    sections: [
      {
        id: "intro",
        type: "1-column",
        columns: [
          [
            {
              id: "intro-text",
              type: "text",
              content: "# Nos Derniers Projets\n\nDécouvrez nos réalisations les plus récentes."
            }
          ]
        ]
      },
      {
        id: "carousel-section",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: [
                {
                  src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
                  alt: "Web Project",
                  title: "Application Web Moderne",
                  caption: "React + TypeScript + Tailwind CSS"
                },
                {
                  src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
                  alt: "Analytics Dashboard",
                  title: "Dashboard Analytics",
                  caption: "Visualisation de données en temps réel"
                },
                {
                  src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200",
                  alt: "Mobile App",
                  title: "Application Mobile",
                  caption: "iOS & Android natif"
                }
              ],
              autoPlay: true,
              autoPlayInterval: 4000,
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "16/9"
            }
          ]
        ]
      }
    ]
  }
};

// Product gallery
export const ProductGallery: Story = {
  args: {
    title: "Galerie Produit",
    sections: [
      {
        id: "product",
        type: "2-columns",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: [
                {
                  src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
                  alt: "Product view 1",
                  title: "Vue Principale"
                },
                {
                  src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
                  alt: "Product view 2",
                  title: "Détails"
                },
                {
                  src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
                  alt: "Product view 3",
                  title: "Autre Angle"
                }
              ],
              autoPlay: false,
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "1/1"
            }
          ],
          [
            {
              id: "product-info",
              type: "text",
              content: `## Casque Premium\n\n**Prix:** 299€\n\n### Caractéristiques\n\n- Audio haute fidélité\n- Réduction de bruit active\n- Bluetooth 5.0\n- Autonomie 30h\n- Confortable\n\n[Acheter Maintenant](#)`
            }
          ]
        ]
      }
    ]
  }
};

// Testimonials carousel
export const TestimonialsCarousel: Story = {
  args: {
    title: "Témoignages Clients",
    sections: [
      {
        id: "testimonials",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: [
                {
                  src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
                  alt: "Client 1",
                  title: "Excellence!",
                  caption: "Meilleur service que j'ai jamais eu - Jean Dupont, CEO TechCorp"
                },
                {
                  src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
                  alt: "Client 2",
                  title: "Incroyable",
                  caption: "Équipe professionnelle et réactive - Marie Martin, Designer"
                },
                {
                  src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
                  alt: "Client 3",
                  title: "Recommandé",
                  caption: "Résultats au-delà de mes attentes - Pierre Durand, Entrepreneur"
                }
              ],
              autoPlay: true,
              autoPlayInterval: 5000,
              showDots: true,
              showArrows: false,
              loop: true,
              aspectRatio: "1/1"
            }
          ]
        ]
      }
    ]
  }
};

// Empty carousel
export const EmptyCarousel: Story = {
  args: {
    title: "Carousel Vide",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "carousel-1",
              type: "carousel",
              slides: [],
              autoPlay: false,
              showDots: true,
              showArrows: true,
              loop: true,
              aspectRatio: "16/9"
            }
          ]
        ]
      }
    ]
  }
};

// Multiple carousels
export const MultipleCarousels: Story = {
  args: {
    title: "Plusieurs Carousels",
    sections: [
      {
        id: "section-1",
        type: "2-columns",
        columns: [
          [
            {
              id: "text-1",
              type: "text",
              content: "### Nature"
            },
            {
              id: "carousel-1",
              type: "carousel",
              slides: natureSlides.slice(0, 3),
              autoPlay: true,
              autoPlayInterval: 3000,
              showDots: true,
              showArrows: false,
              loop: true,
              aspectRatio: "16/9"
            }
          ],
          [
            {
              id: "text-2",
              type: "text",
              content: "### Technologie"
            },
            {
              id: "carousel-2",
              type: "carousel",
              slides: [
                {
                  src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
                  alt: "Tech 1",
                  title: "Code"
                },
                {
                  src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800",
                  alt: "Tech 2",
                  title: "Laptop"
                }
              ],
              autoPlay: true,
              autoPlayInterval: 3500,
              showDots: true,
              showArrows: false,
              loop: true,
              aspectRatio: "16/9"
            }
          ]
        ]
      }
    ]
  }
};
