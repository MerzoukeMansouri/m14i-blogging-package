# Gallery Grid Layouts - Documentation

## Overview

Les **Gallery Grid Layouts** sont une nouvelle catégorie de layouts qui permettent de créer des grilles flexibles où vous pouvez placer **n'importe quel type de contenu** dans chaque cellule.

Contrairement au content block "Gallery" (qui ne supporte que des images), les grid layouts vous donnent une liberté totale pour mixer texte, images, vidéos, PDFs, quotes, etc.

## Layouts Disponibles

### grid-2x2
Grille 2×2 avec **4 cellules**

```tsx
{
  id: "section-1",
  type: "grid-2x2",
  columns: [
    [/* Cellule 1 (haut-gauche) */],
    [/* Cellule 2 (haut-droite) */],
    [/* Cellule 3 (bas-gauche) */],
    [/* Cellule 4 (bas-droite) */],
  ]
}
```

**Idéal pour:**
- Services (4 services principaux)
- Features highlights
- Team highlights (4 membres clés)
- Process en 4 étapes

### grid-3x3
Grille 3×3 avec **9 cellules**

```tsx
{
  id: "section-1",
  type: "grid-3x3",
  columns: [
    [/* Cellule 1 */], [/* Cellule 2 */], [/* Cellule 3 */],
    [/* Cellule 4 */], [/* Cellule 5 */], [/* Cellule 6 */],
    [/* Cellule 7 */], [/* Cellule 8 */], [/* Cellule 9 */],
  ]
}
```

**Idéal pour:**
- Portfolios (9 projets)
- Team pages (équipe complète)
- Product catalogs
- Photo galleries

### grid-2x3
Grille 2×3 avec **6 cellules** (2 colonnes, 3 rangées)

```tsx
{
  id: "section-1",
  type: "grid-2x3",
  columns: [
    [/* Cellule 1 */], [/* Cellule 2 */],
    [/* Cellule 3 */], [/* Cellule 4 */],
    [/* Cellule 5 */], [/* Cellule 6 */],
  ]
}
```

**Idéal pour:**
- Features (6 caractéristiques)
- Benefits
- Steps/Process
- Mixed content showcase

### grid-4-even
Grille avec **4 colonnes égales**

```tsx
{
  id: "section-1",
  type: "grid-4-even",
  columns: [
    [/* Colonne 1 */],
    [/* Colonne 2 */],
    [/* Colonne 3 */],
    [/* Colonne 4 */],
  ]
}
```

**Idéal pour:**
- Stats/Metrics (4 chiffres clés)
- Image galleries
- Product features
- Quick facts

## Exemples d'Usage

### Exemple 1: Services avec grid-2x2

```tsx
const servicesSection: LayoutSection = {
  id: "services",
  type: "grid-2x2",
  columns: [
    [
      {
        id: "service-1",
        type: "text",
        content: "## 💻 Web Development\n\nCreation de sites modernes et performants."
      }
    ],
    [
      {
        id: "service-2",
        type: "text",
        content: "## 📱 Mobile Apps\n\nApplications iOS et Android natives."
      }
    ],
    [
      {
        id: "service-3",
        type: "text",
        content: "## 🎨 UI/UX Design\n\nDesign d'interfaces intuitives."
      }
    ],
    [
      {
        id: "service-4",
        type: "text",
        content: "## ☁️ Cloud Solutions\n\nInfrastructure scalable et sécurisée."
      }
    ]
  ]
};
```

### Exemple 2: Portfolio avec grid-3x3

```tsx
const portfolioSection: LayoutSection = {
  id: "portfolio",
  type: "grid-3x3",
  columns: [
    // Rangée 1 - Images
    [{ id: "p1", type: "image", src: "project1.jpg", alt: "Project 1" }],
    [{ id: "p2", type: "image", src: "project2.jpg", alt: "Project 2" }],
    [{ id: "p3", type: "image", src: "project3.jpg", alt: "Project 3" }],

    // Rangée 2 - Mixte
    [{ id: "p4", type: "text", content: "**Client:** TechCorp\n**Année:** 2024" }],
    [{ id: "p5", type: "quote", content: "Excellent travail!", author: "CEO" }],
    [{ id: "p6", type: "text", content: "**Technologies:** React, Node.js" }],

    // Rangée 3 - Images
    [{ id: "p7", type: "image", src: "project7.jpg", alt: "Project 7" }],
    [{ id: "p8", type: "image", src: "project8.jpg", alt: "Project 8" }],
    [{ id: "p9", type: "image", src: "project9.jpg", alt: "Project 9" }],
  ]
};
```

### Exemple 3: Features avec grid-2x3

```tsx
const featuresSection: LayoutSection = {
  id: "features",
  type: "grid-2x3",
  columns: [
    [
      {
        id: "f1",
        type: "text",
        content: "### 🚀 Performance\n\nOptimisation maximale pour des temps de chargement rapides."
      }
    ],
    [
      {
        id: "f2",
        type: "text",
        content: "### 🔒 Sécurité\n\nChiffrement end-to-end et conformité RGPD."
      }
    ],
    [
      {
        id: "f3",
        type: "text",
        content: "### 📱 Responsive\n\nAdaptatif sur tous les appareils."
      }
    ],
    [
      {
        id: "f4",
        type: "text",
        content: "### ♿ Accessibilité\n\nConformité WCAG 2.1 AA."
      }
    ],
    [
      {
        id: "f5",
        type: "text",
        content: "### 🎨 Customizable\n\nThèmes 100% personnalisables."
      }
    ],
    [
      {
        id: "f6",
        type: "text",
        content: "### 📊 Analytics\n\nSuivi en temps réel."
      }
    ]
  ]
};
```

### Exemple 4: Stats avec grid-4-even

```tsx
const statsSection: LayoutSection = {
  id: "stats",
  type: "grid-4-even",
  columns: [
    [
      {
        id: "stat-1",
        type: "text",
        content: "## 500+\n\n**Clients**\n\nPartout dans le monde"
      }
    ],
    [
      {
        id: "stat-2",
        type: "text",
        content: "## 10 ans\n\n**Expérience**\n\nDans le digital"
      }
    ],
    [
      {
        id: "stat-3",
        type: "text",
        content: "## 98%\n\n**Satisfaction**\n\nTaux de recommandation"
      }
    ],
    [
      {
        id: "stat-4",
        type: "text",
        content: "## 24/7\n\n**Support**\n\nDisponibilité totale"
      }
    ]
  ]
};
```

### Exemple 5: Contenu Mixte avec grid-2x2

```tsx
const mixedSection: LayoutSection = {
  id: "mixed",
  type: "grid-2x2",
  columns: [
    [
      {
        id: "img1",
        type: "image",
        src: "https://example.com/photo.jpg",
        alt: "Team photo",
        caption: "Notre équipe"
      }
    ],
    [
      {
        id: "text1",
        type: "text",
        content: "## À Propos\n\nNous sommes une équipe passionnée de 50+ experts."
      }
    ],
    [
      {
        id: "quote1",
        type: "quote",
        content: "La meilleure équipe avec laquelle j'ai travaillé.",
        author: "Marie Dupont",
        role: "Client"
      }
    ],
    [
      {
        id: "pdf1",
        type: "pdf",
        url: "https://example.com/brochure.pdf",
        title: "Notre Brochure",
        displayMode: "download"
      }
    ]
  ]
};
```

## Styling Personnalisé

Les grid layouts utilisent les mêmes props de customization que les autres layouts:

```tsx
<BlogPreview
  sections={[gridSection]}
  classNames={{
    section: "mb-12 p-6 bg-gray-50 rounded-xl",
    column: "p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
  }}
/>
```

### Exemple avec Tailwind CSS

```tsx
<BlogPreview
  sections={portfolioSection}
  classNames={{
    section: "mb-16",
    column: "group relative overflow-hidden rounded-2xl"
  }}
/>
```

## Responsive Design

Les grilles s'adaptent automatiquement sur mobile:
- `grid-2x2`: Reste en 2×2 sur desktop, devient 1 colonne sur mobile
- `grid-3x3`: Reste en 3×3 sur desktop, devient 2 colonnes sur tablette, 1 sur mobile
- `grid-2x3`: Reste en 2×3 sur desktop, devient 1 colonne sur mobile
- `grid-4-even`: Reste en 4 colonnes sur desktop, devient 2 sur tablette, 1 sur mobile

## Cas d'Usage Recommandés

### grid-2x2
✅ Services (4 services)
✅ Features highlights
✅ Team core members
✅ Process steps
✅ Product variants

### grid-3x3
✅ Portfolio complet (9 projets)
✅ Team page (toute l'équipe)
✅ Product catalog
✅ Photo galleries
✅ Benefits showcase

### grid-2x3
✅ Features (6 features)
✅ Mixed content
✅ Testimonials + images
✅ Benefits list
✅ Step-by-step guides

### grid-4-even
✅ Key metrics/stats
✅ Image galleries
✅ Product features
✅ Quick facts
✅ Social proof

## Migration depuis Gallery Block

Si vous utilisiez le content block "Gallery", voici comment migrer vers les grid layouts:

**Avant (Gallery Block):**
```tsx
{
  id: "gallery-1",
  type: "gallery",
  images: [
    { src: "img1.jpg", alt: "Image 1" },
    { src: "img2.jpg", alt: "Image 2" },
    { src: "img3.jpg", alt: "Image 3" },
    { src: "img4.jpg", alt: "Image 4" }
  ],
  columns: 2
}
```

**Après (Grid Layout):**
```tsx
{
  id: "section-1",
  type: "grid-2x2",
  columns: [
    [{ id: "img1", type: "image", src: "img1.jpg", alt: "Image 1" }],
    [{ id: "img2", type: "image", src: "img2.jpg", alt: "Image 2" }],
    [{ id: "img3", type: "image", src: "img3.jpg", alt: "Image 3" }],
    [{ id: "img4", type: "image", src: "img4.jpg", alt: "Image 4" }]
  ]
}
```

**Avantages de la migration:**
- ✅ Plus de flexibilité (mixer différents types de contenu)
- ✅ Meilleur contrôle du layout
- ✅ Styling individualisé par cellule
- ✅ Grilles plus grandes (jusqu'à 3×3)

## Best Practices

1. **Cohérence visuelle**: Gardez un style cohérent dans toutes les cellules
2. **Équilibre**: Alternez entre types de contenu pour un rendu dynamique
3. **Espacement**: Utilisez les props `classNames` pour un spacing uniforme
4. **Images**: Préférez des images de même ratio dans une même grille
5. **Texte**: Limitez la longueur du texte dans chaque cellule pour éviter les déséquilibres

## Storybook

Explorez tous les exemples dans Storybook:

```bash
npm run storybook
```

Naviguez vers **Layouts/Gallery Grids** pour voir 9 exemples interactifs.

---

**Les grid layouts transforment votre blogging avec une flexibilité maximale!** 🎨✨
