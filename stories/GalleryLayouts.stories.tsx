import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogPreview } from "../src/components/BlogPreview";
import type { LayoutSection } from "../src/types";

const meta: Meta<typeof BlogPreview> = {
  title: "Layouts/Gallery Grids",
  component: BlogPreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Gallery Grid Layouts

Grid layouts permettent de créer des mises en page en grille où vous pouvez placer **n'importe quel type de contenu** dans chaque cellule.

## Layouts Disponibles

- **grid-2x2**: Grille 2×2 (4 cellules)
- **grid-3x3**: Grille 3×3 (9 cellules)
- **grid-2x3**: Grille 2×3 (6 cellules)
- **grid-4-even**: Grille 4 colonnes égales

## Avantages

✅ Mixer différents types de contenu (texte, images, PDF, vidéos, quotes)
✅ Mise en page flexible et moderne
✅ Idéal pour portfolios, galeries, dashboards
✅ Responsive design automatique

## Usage

\`\`\`tsx
const section: LayoutSection = {
  id: "grid-1",
  type: "grid-2x2",
  columns: [
    [{ id: "1", type: "image", src: "...", alt: "..." }],
    [{ id: "2", type: "text", content: "## Title\\nContent..." }],
    [{ id: "3", type: "quote", content: "Quote", author: "..." }],
    [{ id: "4", type: "pdf", url: "...", title: "..." }],
  ]
};
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogPreview>;

// Grid 2x2 - Mixed content
export const Grid2x2Mixed: Story = {
  args: {
    title: "Grille 2×2 - Contenu Mixte",
    sections: [
      {
        id: "section-1",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "cell-1",
              type: "text",
              content: "## Innovation\n\nNotre approche unique combine créativité et technologie.",
            },
          ],
          [
            {
              id: "cell-2",
              type: "quote",
              content: "La simplicité est la sophistication suprême.",
              author: "Leonardo da Vinci",
            },
          ],
          [
            {
              id: "cell-3",
              type: "image",
              src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500",
              alt: "Technology",
            },
          ],
          [
            {
              id: "cell-4",
              type: "text",
              content: "### Résultats\n\n- **98%** satisfaction client\n- **50+** projets réussis\n- **24/7** support",
            },
          ],
        ],
      },
    ],
  },
};

// Grid 3x3 - Portfolio
export const Grid3x3Portfolio: Story = {
  args: {
    title: "Grille 3×3 - Portfolio",
    sections: [
      {
        id: "section-1",
        type: "grid-3x3",
        columns: [
          [
            {
              id: "p1",
              type: "image",
              src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
              alt: "Project 1",
              caption: "Web Design",
            },
          ],
          [
            {
              id: "p2",
              type: "image",
              src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
              alt: "Project 2",
              caption: "Analytics",
            },
          ],
          [
            {
              id: "p3",
              type: "image",
              src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400",
              alt: "Project 3",
              caption: "Development",
            },
          ],
          [
            {
              id: "p4",
              type: "text",
              content: "**Mobile Apps**\nApplications iOS & Android",
            },
          ],
          [
            {
              id: "p5",
              type: "quote",
              content: "Excellence is not a destination; it is a continuous journey.",
            },
          ],
          [
            {
              id: "p6",
              type: "text",
              content: "**Cloud Solutions**\nInfrastructure scalable",
            },
          ],
          [
            {
              id: "p7",
              type: "image",
              src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
              alt: "Project 7",
              caption: "Team Collaboration",
            },
          ],
          [
            {
              id: "p8",
              type: "image",
              src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400",
              alt: "Project 8",
              caption: "Design Thinking",
            },
          ],
          [
            {
              id: "p9",
              type: "image",
              src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
              alt: "Project 9",
              caption: "Strategy",
            },
          ],
        ],
      },
    ],
  },
};

// Grid 2x3 - Features
export const Grid2x3Features: Story = {
  args: {
    title: "Grille 2×3 - Features",
    sections: [
      {
        id: "section-1",
        type: "grid-2x3",
        columns: [
          [
            {
              id: "f1",
              type: "text",
              content: "### 🚀 Performance\n\nOptimisation maximale pour des temps de chargement ultra-rapides.",
            },
          ],
          [
            {
              id: "f2",
              type: "text",
              content: "### 🔒 Sécurité\n\nProtection de niveau entreprise avec chiffrement end-to-end.",
            },
          ],
          [
            {
              id: "f3",
              type: "text",
              content: "### 📱 Responsive\n\nInterface adaptative sur tous les appareils et tailles d'écran.",
            },
          ],
          [
            {
              id: "f4",
              type: "text",
              content: "### ♿ Accessibilité\n\nConformité WCAG 2.1 AA pour une expérience inclusive.",
            },
          ],
          [
            {
              id: "f5",
              type: "text",
              content: "### 🎨 Personnalisation\n\nThèmes et styles 100% customisables selon votre marque.",
            },
          ],
          [
            {
              id: "f6",
              type: "text",
              content: "### 📊 Analytics\n\nSuivi détaillé et rapports en temps réel de vos métriques.",
            },
          ],
        ],
      },
    ],
  },
};

// Grid 4-even - Image gallery
export const Grid4EvenGallery: Story = {
  args: {
    title: "Grille 4 Colonnes - Galerie Photos",
    sections: [
      {
        id: "section-1",
        type: "grid-4-even",
        columns: [
          [
            {
              id: "img1",
              type: "image",
              src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
              alt: "Mountain landscape",
              caption: "Montagnes",
            },
          ],
          [
            {
              id: "img2",
              type: "image",
              src: "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=300",
              alt: "Ocean view",
              caption: "Océan",
            },
          ],
          [
            {
              id: "img3",
              type: "image",
              src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300",
              alt: "Forest",
              caption: "Forêt",
            },
          ],
          [
            {
              id: "img4",
              type: "image",
              src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300",
              alt: "Desert",
              caption: "Désert",
            },
          ],
        ],
      },
    ],
  },
};

// Grid 2x2 - Services
export const Grid2x2Services: Story = {
  args: {
    title: "Nos Services",
    sections: [
      {
        id: "intro",
        type: "1-column",
        columns: [
          [
            {
              id: "intro-text",
              type: "text",
              content: "# Nos Services\n\nDécouvrez notre gamme complète de solutions digitales.",
            },
          ],
        ],
      },
      {
        id: "services-grid",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "service-1",
              type: "text",
              content: "## 💻 Développement Web\n\nCréation de sites et applications web modernes avec les dernières technologies (React, Next.js, Node.js).",
            },
          ],
          [
            {
              id: "service-2",
              type: "text",
              content: "## 📱 Applications Mobiles\n\nDéveloppement d'apps iOS et Android natives et cross-platform performantes.",
            },
          ],
          [
            {
              id: "service-3",
              type: "text",
              content: "## 🎨 UI/UX Design\n\nDesign d'interfaces intuitives et expériences utilisateur engageantes.",
            },
          ],
          [
            {
              id: "service-4",
              type: "text",
              content: "## ☁️ Cloud & DevOps\n\nInfrastructure cloud, CI/CD, containerisation et automatisation complète.",
            },
          ],
        ],
      },
    ],
  },
};

// Grid 3x3 - Team
export const Grid3x3Team: Story = {
  args: {
    title: "Notre Équipe",
    sections: [
      {
        id: "team-grid",
        type: "grid-3x3",
        columns: [
          [
            {
              id: "member-1",
              type: "text",
              content: "**Alice Martin**\nCEO & Co-fondatrice\n\n_\"Passionnée par l'innovation\"_",
            },
          ],
          [
            {
              id: "member-2",
              type: "text",
              content: "**Bob Durand**\nCTO\n\n_\"Expert en architecture logicielle\"_",
            },
          ],
          [
            {
              id: "member-3",
              type: "text",
              content: "**Claire Dubois**\nDesign Lead\n\n_\"Créativité et esthétique\"_",
            },
          ],
          [
            {
              id: "member-4",
              type: "text",
              content: "**David Chen**\nDev Frontend\n\n_\"React & TypeScript ninja\"_",
            },
          ],
          [
            {
              id: "center-quote",
              type: "quote",
              content: "Together we achieve more",
            },
          ],
          [
            {
              id: "member-5",
              type: "text",
              content: "**Emma Lopez**\nDev Backend\n\n_\"Scalabilité et performance\"_",
            },
          ],
          [
            {
              id: "member-6",
              type: "text",
              content: "**Frank Wilson**\nProduct Manager\n\n_\"Vision produit\"_",
            },
          ],
          [
            {
              id: "member-7",
              type: "text",
              content: "**Grace Taylor**\nMarketing\n\n_\"Stratégie digitale\"_",
            },
          ],
          [
            {
              id: "member-8",
              type: "text",
              content: "**Henry Kim**\nDevOps Engineer\n\n_\"Infrastructure as Code\"_",
            },
          ],
        ],
      },
    ],
  },
};

// Grid 2x3 - Mixed with images and text
export const Grid2x3Marketing: Story = {
  args: {
    title: "Pourquoi Nous Choisir?",
    sections: [
      {
        id: "why-us",
        type: "grid-2x3",
        columns: [
          [
            {
              id: "reason-1",
              type: "image",
              src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
              alt: "Team collaboration",
              caption: "Équipe expérimentée",
            },
          ],
          [
            {
              id: "reason-2",
              type: "text",
              content: "### Expertise Reconnue\n\n10+ ans d'expérience dans le développement digital avec plus de 200 projets réussis.",
            },
          ],
          [
            {
              id: "reason-3",
              type: "text",
              content: "### Technologies Modernes\n\nUtilisation des frameworks et outils les plus récents pour garantir performance et pérennité.",
            },
          ],
          [
            {
              id: "reason-4",
              type: "image",
              src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
              alt: "Modern office",
              caption: "Environnement innovant",
            },
          ],
          [
            {
              id: "reason-5",
              type: "quote",
              content: "Le meilleur partenaire pour notre transformation digitale",
              author: "Jean Dupont",
              role: "DG, TechCorp",
            },
          ],
          [
            {
              id: "reason-6",
              type: "text",
              content: "### Support 24/7\n\nÉquipe disponible à tout moment pour répondre à vos besoins et questions.",
            },
          ],
        ],
      },
    ],
  },
};

// Grid 4-even - Stats/Metrics
export const Grid4EvenStats: Story = {
  args: {
    title: "Nos Chiffres Clés",
    sections: [
      {
        id: "stats",
        type: "grid-4-even",
        columns: [
          [
            {
              id: "stat-1",
              type: "text",
              content: "## 500+\n\n**Clients satisfaits**\n\nPartout dans le monde",
            },
          ],
          [
            {
              id: "stat-2",
              type: "text",
              content: "## 10 ans\n\n**D'expérience**\n\nDans le digital",
            },
          ],
          [
            {
              id: "stat-3",
              type: "text",
              content: "## 98%\n\n**Satisfaction**\n\nTaux de recommandation",
            },
          ],
          [
            {
              id: "stat-4",
              type: "text",
              content: "## 24/7\n\n**Support**\n\nDisponibilité totale",
            },
          ],
        ],
      },
    ],
  },
};
