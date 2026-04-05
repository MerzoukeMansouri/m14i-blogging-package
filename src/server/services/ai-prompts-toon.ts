/**
 * AI Prompts - Compact Format
 * Token-optimized prompts for blog generation with multilingual support
 * Using concise text format instead of TOON (TOON is for data, not prompts)
 */

/** Language-specific strings */
const LANG = {
  en: {
    expert: "expert blog strategist",
    writer: "expert content writer",
    seo: "SEO expert",
    editor: "expert content editor",
    respond_json: "RESPOND ONLY WITH VALID JSON NOW",
    generate_layout: "Generate blog post layout for",
    generate_section: "Generate a section about",
    generate_post: "Generate a complete blog post about",
  },
  fr: {
    expert: "expert en stratégie de contenu blog",
    writer: "rédacteur expert",
    seo: "expert SEO",
    editor: "éditeur de contenu expert",
    respond_json: "RÉPONDRE UNIQUEMENT AVEC DU JSON VALIDE MAINTENANT",
    generate_layout: "Générer la structure du blog pour",
    generate_section: "Générer une section sur",
    generate_post: "Générer un article de blog complet sur",
  },
};

/**
 * Generate layout prompt (TOON optimized)
 * ~70% token reduction vs original
 */
export function generateLayoutPrompt(
  request: {
    length?: string;
    layoutPreference?: string[];
    tone?: string;
    additionalInstructions?: string;
    language?: "en" | "fr";
  }
): string {
  const lang = request.language || "en";
  const l = LANG[lang];

  return `${l.expert}. ${lang === "fr" ? "Générer structure article" : "Generate blog layout"}.

CRITICAL: 100% VALID JSON. Start {, end }, NO markdown blocks, escape quotes \\", newlines \\n, NO trailing commas.

Response: {title:"str",slug:"url-slug",excerpt:"150-200chars",layout:[{id:"section-1",type:"hero|two-column|three-column|full-width|sidebar-left|sidebar-right",description:"content"}],category:"cat",tags:["t1","t2"]}

Layouts:
- hero: ${lang === "fr" ? "intro forte, img large+headline" : "strong intro, large img+headline"}
- two-column: ${lang === "fr" ? "contenu principal, text|img alterné" : "main content, text|img alternating"}
- three-column: ${lang === "fr" ? "features/bénéfices, icon+title+desc" : "features/benefits, icon+title+desc"}
- full-width: ${lang === "fr" ? "emphase narrative, centered" : "narrative emphasis, centered"}
- sidebar: ${lang === "fr" ? "contexte additionnel, main+sidebar" : "additional context, main+sidebar"}

Design rules (MANDATORY):
1. VARIETY: NEVER same layout 2x
2. RHYTHM: alternate dense/spacious
3. ASYMMETRY: two-col alternate sides
4. STORY: hook→educate→organize→convert

Composition:
- short: hero→two-col→full-width (2-3 sect)
- medium: hero→two-col(text|img)→three-col→two-col(img|text) (3-4 sect)
- long: hero→two-col→three-col→two-col→sidebar (4-5 sect)

Word counts:
- target: 1,500-2,500
- short: ~1,000 (2-3 sect)
- medium: ~1,500-2,000 (3-4 sect)
- long: ~2,000-2,500 (4-5 sect)
- MAX: 2,500 (quality>quantity)

${request.length ? `Length: ${request.length}` : ""}
${request.layoutPreference?.length ? `Prefer: ${request.layoutPreference.join(",")}` : ""}
${request.tone ? `Tone: ${request.tone}` : ""}
${request.additionalInstructions ? `Extra: ${request.additionalInstructions}` : ""}`;
    role: l.expert,
    task: lang === "fr" ? "Générer structure article blog" : "Generate blog post layout structure",
    critical: "100% VALID JSON",
    json_rules: {
      start: "{",
      end: "}",
      no: ["```", "md", "text"],
      escape: '\\"',
      newlines: "\\n",
      quotes: '""',
      comma: "no_trailing",
    },
    response_structure: {
      title: lang === "fr" ? "Titre article" : "Blog post title",
      slug: "url-friendly-slug",
      excerpt: "150-200 chars",
      layout: [{ id: "section-1", type: "hero|two-column|three-column|full-width|sidebar-left|sidebar-right", description: lang === "fr" ? "Contenu section" : "Section content" }],
      category: lang === "fr" ? "catégorie suggérée" : "suggested category",
      tags: ["tag1", "tag2"],
    },
    layouts: {
      hero: { use: lang === "fr" ? "intro forte" : "strong intro", visual: "large img+headline+text", creates: lang === "fr" ? "engagement immédiat" : "immediate engagement" },
      "two-column": { use: lang === "fr" ? "contenu principal" : "main content", visual: "text|img alternating", creates: lang === "fr" ? "respiration visuelle" : "visual breathing" },
      "three-column": { use: lang === "fr" ? "features/bénéfices" : "features/benefits", visual: "icon+title+desc", creates: lang === "fr" ? "info structurée" : "structured info" },
      "full-width": { use: lang === "fr" ? "emphase narrative" : "narrative emphasis", visual: "centered full-bleed", creates: lang === "fr" ? "pauses dramatiques" : "dramatic pauses" },
      "sidebar-left|right": { use: lang === "fr" ? "contexte additionnel" : "additional context", visual: "main+sidebar", creates: lang === "fr" ? "profondeur" : "depth" },
    },
    design_principles: {
      variety: "NEVER same layout 2x",
      rhythm: "alternate dense/spacious",
      asymmetry: "two-col: alternate sides",
      hierarchy: lang === "fr" ? "but visuel clair" : "clear visual purpose",
      story: lang === "fr" ? "hook→éduquer→organiser→convertir" : "hook→educate→organize→convert",
    },
    composition: {
      short: "hero→two-col→full-width (2-3 sections)",
      medium: "hero→two-col(text|img)→three-col→two-col(img|text) (3-4 sections)",
      long: "hero→two-col→three-col→two-col→sidebar (4-5 sections)",
    },
    word_count: {
      target: "1,500-2,500",
      short: "~1,000 (2-3 sections)",
      medium: "~1,500-2,000 (3-4 sections)",
      long: "~2,000-2,500 (4-5 sections)",
      max: "NEVER exceed 2,500",
    },
    config: {
      length: request.length,
      layouts: request.layoutPreference?.join(","),
      tone: request.tone,
      extra: request.additionalInstructions,
    },
  });
}

/**
 * Generate section prompt (TOON optimized)
 * ~75% token reduction vs original
 */
export function generateSectionPrompt(
  layoutType: string,
  context?: string,
  language?: "en" | "fr"
): string {
  const lang = language || "en";
  const l = LANG[lang];

  return `${l.writer}. ${lang === "fr" ? "Générer section avec layout" : "Generate section with layout"} ${layoutType}.

JSON ONLY. Response: {section:{id:"unique",type:"${layoutType}",columns:[...]}}

Layout ${layoutType}: ${getLayoutColumnRequirements(layoutType, lang)}

Blocks: text{id,type:"text",content:"markdown"}, image{id,type:"image",src,alt,caption?}, video{id,type:"video",url,caption?}, quote{id,type:"quote",content,author?,role?}, carousel{id,type:"carousel",slides:[{src,alt,caption}],autoPlay?,aspectRatio?}, pdf{id,type:"pdf",url,title?,description?,displayMode?}

Media: use placeholder URLs https://placeholder.example/name.jpg

2025 writing (MANDATORY):
- Length: ${lang === "fr" ? "250-500 mots MAX/section" : "250-500 words MAX/section"}
- Paragraphs: ${lang === "fr" ? "2-3 phrases (max 4 lignes)" : "2-3 sentences (max 4 lines)"}
- Headings: H2/H3 ${lang === "fr" ? "chaque" : "every"} 150-200 ${lang === "fr" ? "mots" : "words"}
- Front-load ${lang === "fr" ? "info clé" : "key info"}
- Sentences: 15-20 ${lang === "fr" ? "mots moy" : "words avg"}
- Voice: ${lang === "fr" ? "active uniquement" : "active only"}
- Transitions: ${lang === "fr" ? "Cependant, Par conséquent, En fait" : "However, Therefore, In fact"}
- Format: **bold** ${lang === "fr" ? "termes clés" : "key terms"}, bullets ${lang === "fr" ? "3+ items" : "3+ items"}, ${lang === "fr" ? "listes numérotées étapes" : "numbered lists steps"}, ${lang === "fr" ? "1 visuel/section" : "1 visual/section"}
- Engagement: ${lang === "fr" ? "accroche forte, exemples concrets, tutoyer (vous), points clés clairs" : "strong hook, concrete examples, address directly (you), clear takeaways"}

${context ? `Context: ${context}` : ""}`;
    role: l.writer,
    task: lang === "fr" ? "Générer section blog avec layout spécifique" : "Generate single blog section with specified layout",
    json_only: true,
    structure: {
      section: {
        id: "unique-id",
        type: layoutType,
        columns: "array of content blocks",
      },
    },
    layout: layoutType,
    col_requirements: getLayoutColumnRequirements(layoutType, lang),
    blocks: {
      text: { id: "str", type: "text", content: "markdown" },
      image: { id: "str", type: "image", src: "str", alt: "str", caption: "str?" },
      video: { id: "str", type: "video", url: "str", caption: "str?" },
      quote: { id: "str", type: "quote", content: "str", author: "str?", role: "str?" },
      carousel: { id: "str", type: "carousel", slides: "[{src,alt,caption}]", autoPlay: "bool?", aspectRatio: "16/9?" },
      pdf: { id: "str", type: "pdf", url: "str", title: "str?", description: "str?", displayMode: "both?" },
    },
    media_note: "use placeholder URLs: https://placeholder.example/name.jpg",
    writing_2025: {
      length: lang === "fr" ? "250-500 mots MAX par section" : "250-500 words MAX per section",
      paragraphs: lang === "fr" ? "2-3 phrases (max 4 lignes)" : "2-3 sentences (max 4 lines)",
      headings: lang === "fr" ? "H2/H3 chaque 150-200 mots" : "H2/H3 every 150-200 words",
      front_load: lang === "fr" ? "info clé en premier" : "key info first",
      sentences: lang === "fr" ? "15-20 mots moy" : "15-20 words avg",
      voice: lang === "fr" ? "voix active uniquement" : "active voice only",
      transitions: lang === "fr" ? "Cependant, Par conséquent, En fait, Plus important" : "However, Therefore, In fact, Most importantly",
      formatting: {
        bold: lang === "fr" ? "termes clés" : "key terms",
        bullets: lang === "fr" ? "3+ items liés" : "3+ related items",
        numbered: lang === "fr" ? "étapes séquentielles" : "sequential steps",
        visual: lang === "fr" ? "1 élément visuel/section" : "1 visual/section",
      },
      engagement: {
        start: lang === "fr" ? "accroche/déclaration forte" : "hook/strong statement",
        examples: lang === "fr" ? "concrets, pas abstraits" : "concrete, not abstract",
        reader: lang === "fr" ? "tutoyer (vous)" : "address directly (you)",
        end: lang === "fr" ? "points clés/transitions clairs" : "clear takeaways/transitions",
      },
    },
    context: context,
  });
}

/**
 * Generate complete blog prompt (TOON optimized)
 * ~80% token reduction vs original
 */
export function generateCompletePrompt(
  request: {
    tone?: string;
    length?: string;
    layoutPreference?: string[];
    additionalInstructions?: string;
    language?: "en" | "fr";
  }
): string {
  const lang = request.language || "en";
  const l = LANG[lang];

  return encode({
    role: lang === "fr" ? "rédacteur expert blog élégant" : "expert elegant blog content writer",
    critical: "100% VALID JSON",
    json_rules: {
      start: "{", end: "}",
      no: ["```", "md", "extra_text"],
      escape_quotes: '\\"',
      newlines: "\\n",
      no_trailing_commas: true,
      all_keys_quoted: true,
    },
    common_mistakes: {
      wrong: ['content:"She said "hello"', 'content:"Line1\nLine2"', 'tags:["t1","t2",]', '{title:"Post"}', '```json\n{}\n```'],
      correct: ['content:"She said \\"hello\\""', 'content:"Line1\\nLine2"', 'tags:["t1","t2"]', '{"title":"Post"}', '{}'],
    },
    philosophy: {
      scannable: lang === "fr" ? "titres, paragraphes courts, pauses visuelles" : "headings, short paragraphs, visual breaks",
      engaging: lang === "fr" ? "accrocher immédiatement, maintenir intérêt" : "hook immediately, maintain interest",
      actionable: lang === "fr" ? "valeur pratique, points clairs" : "practical value, clear takeaways",
      visual: lang === "fr" ? "hiérarchie visuelle, respiration" : "visual hierarchy, breathing room",
      elegant: lang === "fr" ? "professionnel avec chaleur conversationnelle" : "professional with conversational warmth",
    },
    layouts: {
      "1-column": lang === "fr" ? "intro/conclusion/narration" : "intro/conclusion/narrative",
      "2-columns": lang === "fr" ? "comparaisons/avant-après" : "comparisons/before-after",
      "2-columns-wide-left": lang === "fr" ? "contenu+conseil (66/33)" : "content+tip (66/33)",
      "2-columns-wide-right": lang === "fr" ? "icône+détail (33/66)" : "icon+detail (33/66)",
      "3-columns": lang === "fr" ? "features/bénéfices/étapes" : "features/benefits/steps",
      "grid-4-even": lang === "fr" ? "4 items égaux (2x2)" : "4 equal items (2x2)",
    },
    structure: {
      opening: {
        hook: lang === "fr" ? "question/stat/déclaration forte" : "question/stat/bold statement",
        value: lang === "fr" ? "ce que lecteur apprendra" : "what reader will learn",
        context: lang === "fr" ? "pourquoi c'est important maintenant" : "why this matters now",
        length: lang === "fr" ? "2-3 paragraphes max" : "2-3 paragraphs max",
        visual: lang === "fr" ? "envisager hero image/vidéo" : "consider hero image/video",
      },
      body: {
        mix: lang === "fr" ? "alterner 2-col et 3-col pour rythme" : "mix 2-col and 3-col for rhythm",
        topic: lang === "fr" ? "1 sujet clair + 2-4 points" : "1 clear topic + 2-4 points",
        subheadings: lang === "fr" ? "utiliser ## et ### libéralement" : "use ## and ### liberally",
        examples: lang === "fr" ? "exemples, données, études de cas" : "examples, data, case studies",
        visuals: lang === "fr" ? "images/vidéos/carrousels stratégiques" : "images/videos/carousels strategic",
      },
      closing: {
        synthesize: lang === "fr" ? "3-5 points clés" : "3-5 key takeaways",
        cta: lang === "fr" ? "prochaine étape claire" : "clear next step",
        forward: lang === "fr" ? "déclaration prospective" : "forward-looking statement",
      },
    },
    markdown: {
      bold: lang === "fr" ? "termes clés" : "key terms",
      italic: lang === "fr" ? "emphase subtile" : "subtle emphasis",
      code: lang === "fr" ? "termes techniques" : "technical terms",
      lists: lang === "fr" ? "points scannables" : "scannable points",
      headings: "## structure",
      blockquotes: lang === "fr" ? "avec parcimonie" : "sparingly",
    },
    style: {
      headings: lang === "fr" ? "clairs, descriptifs" : "clear, descriptive",
      voice: lang === "fr" ? "voix active" : "active voice",
      sentences: lang === "fr" ? "varier longueur" : "vary length",
      transitions: lang === "fr" ? "entre sections" : "between sections",
      specificity: lang === "fr" ? "nombres, exemples, scénarios réels" : "numbers, examples, real scenarios",
    },
    blocks: {
      text: { id: "str", type: "text", content: "markdown" },
      image: { id: "str", type: "image", src: "url", alt: "str", caption: "str?" },
      video: { id: "str", type: "video", url: "url", caption: "str?" },
      quote: { id: "str", type: "quote", content: "str", author: "str", role: "str" },
      carousel: { id: "str", type: "carousel", slides: "[{src,alt,caption}]", autoPlay: "bool", aspectRatio: "16/9" },
      pdf: { id: "str", type: "pdf", url: "url", title: "str", description: "str", displayMode: "both" },
    },
    placeholder_note: "use: https://placeholder.example/descriptive-name.jpg",
    response_structure: {
      title: lang === "fr" ? "Titre accrocheur" : "Compelling title",
      slug: "url-slug",
      excerpt: "150-160 chars",
      sections: [
        {
          id: "section-1",
          type: "1-column",
          columns: [[{ id: "block-1", type: "text", content: "## Intro\\n\\nParagraph with **bold** and *italic*.\\n\\nSecond para." }]],
        },
      ],
      seo_metadata: {
        description: lang === "fr" ? "description <160 chars" : "description <160 chars",
        keywords: ["primary", "secondary", "long-tail"],
        robots: "index, follow",
        openGraph: { title: lang === "fr" ? "Titre réseaux sociaux" : "Social media title", description: lang === "fr" ? "Description partage" : "Sharing description" },
        twitter: { card: "summary_large_image", title: lang === "fr" ? "Titre Twitter" : "Twitter title", description: lang === "fr" ? "Description Twitter" : "Twitter description" },
      },
      category: lang === "fr" ? "Catégorie" : "Category",
      tags: ["tag1", "tag2"],
    },
    critical_reminders: {
      newlines: "use \\n not literal",
      quotes: 'escape with \\"',
      unique_ids: "all blocks/sections",
      layout_types: "1-column,2-columns,3-columns,2-columns-wide-left,2-columns-wide-right,grid-2x2,grid-3x3,grid-2x3,grid-4-even",
      block_types: "text,image,video,quote,carousel,pdf",
      columns_match: "array count = layout type",
      start_end: "{ ... } nothing else",
    },
    config: {
      tone: request.tone || (lang === "fr" ? "Professionnel mais accessible, autoritaire mais conversationnel" : "Professional yet approachable, authoritative yet conversational"),
      length: request.length || (lang === "fr" ? "moyen (5-7 sections, 800-1200 mots)" : "medium (5-7 sections, 800-1200 words)"),
      layouts: request.layoutPreference?.join(",") || (lang === "fr" ? "utiliser layouts variés (2-col, 3-col, grilles) pour intérêt visuel" : "use varied layouts (2-col, 3-col, grids) for visual interest"),
      extra: request.additionalInstructions,
    },
    checklist: [
      lang === "fr" ? "Commence par { et finit par } ?" : "Starts with { and ends with } ?",
      lang === "fr" ? "Échappé TOUTES les quotes avec \\\\" + " ?" : "Escaped ALL quotes with \\\\" + " ?",
      lang === "fr" ? "Remplacé TOUS les sauts de ligne par \\\\n ?" : "Replaced ALL line breaks with \\\\n ?",
      lang === "fr" ? "Enlevé TOUTES les virgules trailing ?" : "Removed ALL trailing commas ?",
      lang === "fr" ? "TOUS les noms de propriétés entre guillemets doubles ?" : "ALL property names in double quotes ?",
      lang === "fr" ? "Évité les blocs markdown ?" : "Avoided markdown blocks ?",
      lang === "fr" ? "Chaque bracket correctement fermé ?" : "Every bracket properly closed ?",
    ],
    final: l.respond_json,
  });
}

/**
 * Generate SEO prompt (TOON optimized)
 */
export function generateSEOPrompt(language?: "en" | "fr"): string {
  const lang = language || "en";
  const l = LANG[lang];

  return encode({
    role: l.seo,
    task: lang === "fr" ? "Générer métadonnées SEO complètes" : "Generate comprehensive SEO metadata",
    json_only: true,
    structure: {
      seo_metadata: {
        description: lang === "fr" ? "description SEO (150-160 chars)" : "SEO description (150-160 chars)",
        keywords: ["keyword1", "keyword2"],
        robots: "index, follow",
        openGraph: { title: lang === "fr" ? "titre OG accrocheur" : "engaging OG title", description: lang === "fr" ? "description OG" : "OG description" },
        twitter: { card: "summary_large_image", title: lang === "fr" ? "titre Twitter optimisé" : "Twitter-optimized title", description: lang === "fr" ? "description Twitter" : "Twitter description" },
      },
      tags: ["tag1", "tag2", "tag3"],
    },
    focus: {
      descriptions: lang === "fr" ? "claires, incitant au clic" : "clear, click-encouraging",
      keywords: lang === "fr" ? "correspondant à l'intention de recherche" : "matching search intent",
      titles: lang === "fr" ? "optimisés pour partage social" : "optimized for social sharing",
      tags: lang === "fr" ? "3-5 tags très pertinents" : "3-5 highly relevant tags",
    },
  });
}

/**
 * Generate improve content prompt (TOON optimized)
 */
export function generateImprovePrompt(
  instruction: string,
  additionalContext?: string,
  language?: "en" | "fr"
): string {
  const lang = language || "en";
  const l = LANG[lang];

  const instructions = lang === "fr" ? {
    expand: "Développer ce contenu avec plus de détails, exemples et explications. Le rendre plus complet et informatif.",
    shorten: "Rendre ce contenu plus concis tout en préservant tous les points clés. Éliminer la redondance et se concentrer sur la clarté.",
    rewrite: "Réécrire ce contenu pour le rendre plus engageant et mieux structuré tout en conservant le même sens.",
    "add-examples": "Ajouter des exemples pertinents et pratiques pour illustrer les concepts de ce contenu.",
    "improve-clarity": "Améliorer la clarté et la lisibilité de ce contenu. Rendre les idées complexes plus faciles à comprendre.",
    "make-engaging": "Rendre ce contenu plus engageant et captivant. Ajouter des accroches, améliorer le flow et le rendre plus intéressant à lire.",
  } : {
    expand: "Expand this content with more details, examples, and explanations. Make it more comprehensive and informative.",
    shorten: "Make this content more concise while preserving all key points. Remove redundancy and focus on clarity.",
    rewrite: "Rewrite this content to make it more engaging and better structured while maintaining the same meaning.",
    "add-examples": "Add relevant, practical examples to illustrate the concepts in this content.",
    "improve-clarity": "Improve the clarity and readability of this content. Make complex ideas easier to understand.",
    "make-engaging": "Make this content more engaging and compelling. Add hooks, improve flow, and make it more interesting to read.",
  };

  return encode({
    role: l.editor,
    task: lang === "fr" ? "Améliorer le contenu selon instruction" : "Improve content based on instruction",
    json_only: true,
    instruction: instructions[instruction as keyof typeof instructions],
    context: additionalContext,
    response: {
      content: lang === "fr" ? "Contenu amélioré (markdown supporté)" : "Improved content (markdown supported)",
      changes: lang === "fr" ? "Brève explication des changements" : "Brief explanation of changes",
    },
  });
}

/**
 * Helper: Get layout column requirements in specified language
 */
function getLayoutColumnRequirements(layoutType: string, lang: "en" | "fr"): string {
  const requirements = lang === "fr" ? {
    "1-column": "1 colonne - contenu pleine largeur",
    "2-columns": "2 colonnes - largeur égale",
    "3-columns": "3 colonnes - largeur égale",
    "2-columns-wide-left": "2 colonnes - gauche plus large (66% / 33%)",
    "2-columns-wide-right": "2 colonnes - droite plus large (33% / 66%)",
    "grid-2x2": "4 colonnes - grille 2x2",
    "grid-3x3": "9 colonnes - grille 3x3",
    "grid-2x3": "6 colonnes - grille 2x3",
    "grid-4-even": "4 colonnes - grille égale",
  } : {
    "1-column": "1 column - full width content",
    "2-columns": "2 columns - equal width",
    "3-columns": "3 columns - equal width",
    "2-columns-wide-left": "2 columns - left column wider (66% / 33%)",
    "2-columns-wide-right": "2 columns - right column wider (33% / 66%)",
    "grid-2x2": "4 columns - 2x2 grid layout",
    "grid-3x3": "9 columns - 3x3 grid layout",
    "grid-2x3": "6 columns - 2x3 grid layout",
    "grid-4-even": "4 columns - even grid",
  };

  return requirements[layoutType as keyof typeof requirements] || layoutType;
}
