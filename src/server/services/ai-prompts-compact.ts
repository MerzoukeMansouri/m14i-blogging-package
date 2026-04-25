/**
 * AI Prompts - Compact Format
 * Enhanced with content best practices and brand context integration
 */

import type { BrandContext } from "../../types/aiGeneration";

const LANG = {
  en: {
    expert: "Expert blog strategist",
    writer: "Expert content writer",
    seo: "SEO expert",
    editor: "Expert content editor",
  },
  fr: {
    expert: "Expert stratégie contenu blog",
    writer: "Rédacteur expert",
    seo: "Expert SEO",
    editor: "Éditeur contenu expert",
  },
};

/**
 * Build brand context section for prompts
 */
function buildBrandContextSection(brand?: BrandContext, language?: "en" | "fr"): string {
  if (!brand) return "";

  const lang = language || "en";
  const lines: string[] = [];

  lines.push(lang === "fr" ? "\nCONTEXTE DE MARQUE:" : "\nBRAND CONTEXT:");
  lines.push(`${lang === "fr" ? "Site" : "Site"}: ${brand.siteName}`);

  if (brand.industry) {
    lines.push(`${lang === "fr" ? "Industrie" : "Industry"}: ${brand.industry}`);
  }

  if (brand.targetAudience) {
    lines.push(`${lang === "fr" ? "Audience" : "Audience"}: ${brand.targetAudience}`);
  }

  if (brand.tone) {
    lines.push(`${lang === "fr" ? "Ton" : "Tone"}: ${brand.tone}`);
  }

  if (brand.vocabulary?.avoid && brand.vocabulary.avoid.length > 0) {
    lines.push(`${lang === "fr" ? "JAMAIS utiliser" : "NEVER use"}: ${brand.vocabulary.avoid.join(", ")}`);
  }

  if (brand.vocabulary?.prefer && brand.vocabulary.prefer.length > 0) {
    lines.push(`${lang === "fr" ? "Préférer" : "Prefer"}: ${brand.vocabulary.prefer.join(", ")}`);
  }

  return lines.join("\n");
}

/**
 * Content writing best practices (universal rules)
 */
const CONTENT_WRITING_RULES = {
  en: `
CONTENT WRITING BEST PRACTICES:
• Paragraphs: 2-4 sentences MAXIMUM (scannable, mobile-friendly)
• Headings: Clear H2/H3, descriptive not generic (e.g. "Setup Authentication" not "Getting Started")
• White space: Essential - blank line after each heading, between paragraphs
• Bullet lists: Use for series, benefits, steps (not continuous prose)
• Opening hook: First 3 sentences must grab attention, promise concrete value
• Concrete details: Named examples, specific numbers, real places/tools
• No filler: Avoid vague corporate speak and buzzwords`,
  fr: `
BONNES PRATIQUES RÉDACTION:
• Paragraphes: 2-4 phrases MAXIMUM (scannable, mobile-friendly)
• Titres: H2/H3 clairs, descriptifs pas génériques (ex: "Configuration authentification" pas "Pour commencer")
• Espace blanc: Essentiel - ligne vide après chaque titre, entre paragraphes
• Listes à puces: Utiliser pour séries, bénéfices, étapes (pas prose continue)
• Accroche ouverture: 3 premières phrases doivent capter attention, promettre valeur concrète
• Détails concrets: Exemples nommés, chiffres spécifiques, lieux/outils réels
• Pas de remplissage: Éviter jargon corporate vague et buzzwords`,
};

export function generateLayoutPrompt(req: {
  length?: string;
  layoutPreference?: string[];
  tone?: string;
  additionalInstructions?: string;
  language?: "en" | "fr";
  brandContext?: BrandContext;
}): string {
  const lang = req.language || "en";
  const l = LANG[lang];
  const brandSection = buildBrandContextSection(req.brandContext, lang);

  return `${l.expert}. ${lang === "fr" ? "Générer structure blog." : "Generate blog layout."}
${brandSection}

${lang === "fr" ? "CRITIQUE: Répondre avec UN SEUL objet JSON valide. Commencer par { finir par }. Pas de ``` ni texte autour." : "CRITICAL: Return ONE valid JSON object only. Start with { end with }. No ``` and no surrounding commentary."}

${lang === "fr" ? "LANGUE: tout le contenu doit être en FRANÇAIS." : "LANGUAGE: all content must be in English."}

${lang === "fr" ? "Réponse: {title,slug,excerpt:\"150-200c\",layout:[{id,type,description}],category}" : "Response: {title,slug,excerpt:\"150-200c\",layout:[{id,type,description}],category}"}

${lang === "fr" ? "PATTERNS PROUVÉS:" : "PROVEN PATTERNS:"}
${lang === "fr" ? "• Article: 1-column hero → 2-columns texte+quote/image → grid-2x2 points clés → 1-column conclusion" : "• Article: 1-column hero → 2-columns text+quote/image → grid-2x2 key points → 1-column conclusion"}
${lang === "fr" ? "• Guide: 1-column intro → 2-columns-wide-left détail+astuce → grid-2x2 étapes → 1-column next steps" : "• Guide: 1-column intro → 2-columns-wide-left detail+tip → grid-2x2 steps → 1-column next steps"}
${lang === "fr" ? "• Showcase: 1-column hero → grid-2x2 highlights → 2-columns-wide-right visuel+détail → 1-column CTA" : "• Showcase: 1-column hero → grid-2x2 highlights → 2-columns-wide-right visual+detail → 1-column CTA"}

${lang === "fr" ? "TYPES (choisir selon l'intention éditoriale):" : "TYPES (choose based on editorial intent):"}
• 1-column = hero opener, standalone narrative, closing conclusion with CTA
• 2-columns = text (main argument) + image or quote (never text + text)
• 2-columns-wide-left = deep explanation (wide left) + sidebar tip or stat (narrow right)
• 2-columns-wide-right = visual anchor or stat (narrow left) + detailed steps (wide right)
• grid-2x2 = 4 compact benefit/feature cards, each scannable in 5 seconds

${lang === "fr" ? "RÈGLES OBLIGATOIRES:" : "MANDATORY RULES:"}
1. ${lang === "fr" ? "Commencer par un hero 1-column dont la description mentionne un visuel précis." : "Start with a 1-column hero whose description explicitly mentions a specific visual."}
2. ${lang === "fr" ? "Finir par une conclusion 1-column." : "End with a 1-column conclusion."}
3. ${lang === "fr" ? "Ne jamais répéter le même layout consécutivement." : "Never repeat the same layout consecutively."}
4. ${lang === "fr" ? "Alterner sections denses (grid) et respirations (1-col/2-col)." : "Alternate dense sections (grid) and breathing sections (1-col/2-col)."}
5. ${lang === "fr" ? "Chaque description doit promettre du vrai contenu utile, jamais une section vide ou décorative." : "Each description must promise real useful content, never an empty or decorative section."}
6. ${lang === "fr" ? "Chaque description doit être concrète: sujet précis, angle éditorial, élément visuel distinct." : "Each description must be concrete: precise subject, editorial angle, distinct visual element."}
7. ${lang === "fr" ? "Éviter le filler générique." : "Avoid generic filler."}
8. ${lang === "fr" ? "Pour tout layout à 2 colonnes, exiger un mélange éditorial: une colonne texte principal + une colonne support visuel/quote/chart. Jamais texte + texte." : "For every 2-column layout, require an editorial mix: one main text column + one supporting visual/quote/chart column. Never text + text."}

${lang === "fr" ? "Longueur: court 3-4 sections, moyen 5-6, long 6-7." : "Length: short 3-4 sections, medium 5-6, long 6-7."}

${req.length ? `Len:${req.length}` : ""}${req.layoutPreference?.length ? ` Pref:${req.layoutPreference}` : ""}${req.tone ? ` Tone:${req.tone}` : ""}${req.additionalInstructions ? ` ${req.additionalInstructions}` : ""}`;
}

const LAYOUT_STRATEGY = {
  en: {
    "1-column": {
      columns: "1 column",
      intent: "Hero intro OR standalone narrative OR data-driven section OR conclusion CTA. Full-width storytelling with one strong visual or chart.",
      blocks: "For HERO/INTRO: MUST start with image (hero/banner) first, then text (hook paragraph + 2-3 short paras). For data-driven sections: chart (bar/line/area with real labeled data points, xAxisLabel, yAxisLabel, title, caption) + text commentary. For conclusion: text with bullet key-takeaways + concrete CTA sentence.",
      forbidden: "Do not use quote or carousel here. No grid-like splitting of ideas. Hero sections MUST have an image block.",
    },
    "2-columns": {
      columns: "2 columns (equal 50/50)",
      intent: "Side-by-side contrast: substantive editorial text paired with a supporting visual, pull-quote, or data chart. Never two text blocks.",
      blocks: "col1: text (2-4 paragraphs with ## heading, bullet list welcome). col2: image OR quote OR chart (bar/line/pie with 4-6 data points and meaningful title — choose one block type only). The two columns must use different block families.",
      forbidden: "Never put text in both columns. Never put two images. Never use the same dominant block type in both columns. col2 must be exactly one non-text supporting block.",
    },
    "2-columns-wide-left": {
      columns: "2 columns (66% left / 33% right)",
      intent: "Main argument or deep-dive explanation on the left; sidebar tip, stat callout, chart, or supporting detail on the right.",
      blocks: "col1 (wide): text with ## heading, 3-5 paragraphs or bullet breakdown. col2 (narrow): quote with specific author+role OR image OR chart (bar/pie with 3-5 data points and caption). Prefer a non-text supporting block to keep visual contrast.",
      forbidden: "Right column must NOT be a full article. Keep it tight: 1 block max. Do not mirror the main text with another long text block.",
    },
    "2-columns-wide-right": {
      columns: "2 columns (33% left / 66% right)",
      intent: "Visual anchor, stat chart, or icon on the left; detailed explanation or step-by-step on the right.",
      blocks: "col1 (narrow): image (portrait/square crop) OR chart (bar/pie with 4-6 data points, height:220) OR quote. col2 (wide): text with ## heading, 3-5 paragraphs or numbered steps.",
      forbidden: "Left column must NOT be a full article. One block only: image, chart, or quote. Do not use text in both columns.",
    },
    "grid-2x2": {
      columns: "4 columns (2×2 grid)",
      intent: "Four highlights, benefits, or use-cases presented as compact cards. Each cell is scannable in 5 seconds.",
      blocks: "Each cell: text with ### heading (3-5 words) + 1-2 bullet points. Optionally one small image per cell.",
      forbidden: "No paragraphs longer than 2 lines. No narrative flow between cells — each must stand alone.",
    },
  },
  fr: {
    "1-column": {
      columns: "1 colonne",
      intent: "Hero intro OU récit autonome OU section data-driven OU conclusion CTA. Storytelling pleine largeur avec un fort visuel ou graphique.",
      blocks: "Pour HERO/INTRO: DOIT commencer par image (hero/bannière) en premier, puis texte (accroche + 2-3 courts paragraphes). Pour section data-driven: chart (bar/line/area avec données réelles étiquetées, xAxisLabel, yAxisLabel, title, caption) + texte de commentaire. Pour conclusion: texte avec points-clés bullet + phrase CTA concrète.",
      forbidden: "Pas de quote ni carousel. Pas de découpage d'idées en grille. Les sections hero DOIVENT avoir un bloc image.",
    },
    "2-columns": {
      columns: "2 colonnes (50/50 égal)",
      intent: "Contraste côte à côte: texte éditorial substantiel + visuel, pull-quote ou graphique de données. Jamais deux blocs texte.",
      blocks: "col1: texte (2-4 paragraphes avec ## titre, liste à puces bienvenue). col2: image OU quote OU chart (bar/line/pie avec 4-6 points de données et titre significatif — un seul type de bloc). Les deux colonnes doivent utiliser des familles de blocs différentes.",
      forbidden: "Jamais texte dans les deux colonnes. Jamais deux images. Jamais le même type dominant dans les deux colonnes. col2 doit être exactement un bloc de support non-texte.",
    },
    "2-columns-wide-left": {
      columns: "2 colonnes (66% gauche / 33% droite)",
      intent: "Argument principal ou explication approfondie à gauche; astuce sidebar, stat, graphique ou détail complémentaire à droite.",
      blocks: "col1 (large): texte avec ## titre, 3-5 paragraphes ou liste détaillée. col2 (étroite): quote avec auteur+rôle précis OU image OU chart (bar/pie avec 3-5 points de données et caption). Préférer un bloc de support non-texte pour garder un contraste visuel.",
      forbidden: "Colonne droite pas un article complet. Maximum 1 bloc. Ne pas dupliquer le texte principal avec un autre long texte.",
    },
    "2-columns-wide-right": {
      columns: "2 colonnes (33% gauche / 66% droite)",
      intent: "Ancre visuelle, graphique stat ou icône à gauche; explication détaillée ou pas-à-pas à droite.",
      blocks: "col1 (étroite): image (portrait/carré) OU chart (bar/pie avec 4-6 points de données, height:220) OU quote. col2 (large): texte avec ## titre, 3-5 paragraphes ou étapes numérotées.",
      forbidden: "Colonne gauche pas un article complet. Un seul bloc: image, graphique ou quote. Ne pas utiliser du texte dans les deux colonnes.",
    },
    "grid-2x2": {
      columns: "4 colonnes (grille 2×2)",
      intent: "Quatre points forts, bénéfices ou cas d'usage présentés comme cartes compactes. Chaque cellule est lisible en 5 secondes.",
      blocks: "Chaque cellule: texte avec ### titre (3-5 mots) + 1-2 bullet points. Optionnellement une petite image par cellule.",
      forbidden: "Pas de paragraphes de plus de 2 lignes. Pas de flux narratif entre cellules.",
    },
  },
};

export function generateSectionPrompt(
  layoutType: string,
  context?: string,
  language?: "en" | "fr",
  brandContext?: BrandContext
): string {
  const lang = language || "en";
  const l = LANG[lang];
  const strategy = LAYOUT_STRATEGY[lang][layoutType as keyof typeof LAYOUT_STRATEGY["en"]] || {
    columns: layoutType,
    intent: lang === "fr" ? "Générer du contenu pertinent." : "Generate relevant content.",
    blocks: lang === "fr" ? "Texte et images selon le contexte." : "Text and images as appropriate.",
    forbidden: "",
  };
  const brandSection = buildBrandContextSection(brandContext, lang);

  return `${l.writer}. ${lang === "fr" ? `Générer section ${layoutType}.` : `Generate section ${layoutType}.`}
${brandSection}

${lang === "fr" ? "LANGUE: tout le contenu doit être en FRANÇAIS." : "LANGUAGE: all content must be in English."}

${lang === "fr" ? "JSON CRITIQUE:" : "CRITICAL JSON:"}
- ${lang === "fr" ? "Un seul objet JSON valide." : "One valid JSON object only."}
- ${lang === "fr" ? "Commencer avec { finir avec }." : "Start with { end with }."}
- ${lang === "fr" ? "Pas de ``` ni explication hors JSON." : "No ``` and no commentary outside JSON."}
- ${lang === "fr" ? "Utiliser l'échappement JSON standard." : "Use standard JSON escaping."}
- ${lang === "fr" ? "Utiliser \\n pour les retours de ligne markdown dans les strings JSON." : "Use \\n for markdown line breaks inside JSON strings."}
- ${lang === "fr" ? "Pas de virgules finales." : "No trailing commas."}

${lang === "fr" ? "Format:" : "Format:"} {section:{id,type:"${layoutType}",columns:[[blocks]]}}
${lang === "fr" ? "Colonnes requises:" : "Required columns:"} ${strategy.columns}

${lang === "fr" ? "STRATÉGIE DE CONTENU pour ce layout:" : "CONTENT STRATEGY for this layout:"}
${lang === "fr" ? "Intention:" : "Intent:"} ${strategy.intent}
${lang === "fr" ? "Blocs attendus:" : "Expected blocks:"} ${strategy.blocks}
${lang === "fr" ? "INTERDIT:" : "FORBIDDEN:"} ${strategy.forbidden}

Blocks:
- text{id,type:"text",content:"markdown"}
- image{id,type:"image",src,alt,caption}
- video{id,type:"video",url,caption}
- quote{id,type:"quote",content,author,role}
- carousel{id,type:"carousel",slides:[{src,alt,caption}]}
- pdf{id,type:"pdf",url,title,description}
- chart{id,type:"chart",chartType:"bar"|"line"|"area"|"pie",title:"descriptive title",data:[{label,value,color?}],xAxisLabel:"X axis label",yAxisLabel:"descriptive metric name used as legend (e.g. 'Adoption %' not 'value')",caption:"source note",height?}

${lang === "fr" ? "Placeholder URLs: https://placeholder.example/name.jpg" : "Placeholder URLs: https://placeholder.example/name.jpg"}
${CONTENT_WRITING_RULES[lang]}

${lang === "fr" ? "RÈGLES DE QUALITÉ:" : "QUALITY RULES:"}
1. ${lang === "fr" ? "CHAQUE colonne doit contenir au moins 1 block valide." : "EVERY column must contain at least 1 valid block."}
2. ${lang === "fr" ? "Titres markdown (##/###) seuls sur leur ligne. Paragraphe après ligne vide." : "Markdown headings (##/###) alone on their own line. Paragraph after blank line."}
3. ${lang === "fr" ? "Titres markdown: ne jamais couper un titre sur plusieurs lignes. Le titre complet doit tenir sur une seule ligne." : "Markdown headings: NEVER split a heading across multiple lines. The full heading text must be on ONE line."}
4. ${lang === "fr" ? "Paragraphes: 2-4 phrases max (scannable). Préférer listes à puces pour séries." : "Paragraphs: 2-4 sentences max (scannable). Prefer bullet lists for series."}
5. ${lang === "fr" ? "Contenu concret: exemples nommés, chiffres spécifiques, lieux/outils réels." : "Concrete content: named examples, specific numbers, real places/tools."}
6. ${lang === "fr" ? "Images: alt + caption uniques, spécifiques, descriptifs." : "Images: unique, specific, descriptive alt + caption."}
7. ${lang === "fr" ? "Interdits: section vide, colonne vide, argument répété." : "Forbidden: empty section, empty column, repeated argument."}

${context ? `Context:${context}` : ""}

${lang === "fr" ? "VÉRIFICATION FINALE: JSON valide, colonnes remplies, stratégie layout respectée, contenu concret, paragraphes courts." : "FINAL CHECK: valid JSON, all columns filled, layout strategy followed, concrete content, short paragraphs."}`;
}

export function generateCompletePrompt(req: {
  tone?: string;
  length?: string;
  layoutPreference?: string[];
  additionalInstructions?: string;
  language?: "en" | "fr";
  brandContext?: BrandContext;
}): string {
  const lang = req.language || "en";
  const brandSection = buildBrandContextSection(req.brandContext, lang);

  return `${lang === "fr" ? "Rédacteur expert blog élégant" : "Expert elegant blog writer"}.
${brandSection}

${lang === "fr" ? "LANGUE: tout le contenu doit être en FRANÇAIS." : "LANGUAGE: all content must be in English."}

${lang === "fr" ? "CRITIQUE: répondre avec UN SEUL objet JSON valide. Commencer par { finir par }. Pas de ``` ni texte hors JSON." : "CRITICAL: return ONE valid JSON object only. Start with { end with }. No ``` and no surrounding commentary."}

${lang === "fr" ? "Utiliser l'échappement JSON standard. Utiliser \\n pour les retours de ligne markdown dans les strings JSON." : "Use standard JSON escaping. Use \\n for markdown line breaks inside JSON strings."}

${lang === "fr" ? "Philosophie: visuel d'abord, scannable, utile, élégant, jamais creux." : "Philosophy: visual first, scannable, useful, elegant, never hollow."}

${lang === "fr" ? "SPÉCIFICITÉ OBLIGATOIRE: préférer exemples nommés, chiffres, objets, lieux, scènes visuelles." : "MANDATORY SPECIFICITY: prefer named examples, numbers, objects, places, vivid visual scenes."}

${lang === "fr" ? "QUALITÉ OBLIGATOIRE: chaque colonne doit contenir du vrai contenu, chaque section doit apporter un angle nouveau, chaque image doit être distincte." : "MANDATORY QUALITY: every column must contain real content, every section must add a new angle, every image must feel distinct."}

${lang === "fr" ? "Layouts: 1-column(intro/conclusion/data+images/charts), 2-columns(texte+quote/image/chart), 2-columns-wide-left(contenu+astuce/chart), 2-columns-wide-right(chart/visuel+détail), grid-2x2(4 items)." : "Layouts: 1-column(intro/conclusion/data+images/charts), 2-columns(text+quote/image/chart), 2-columns-wide-left(content+tip/chart), 2-columns-wide-right(chart/visual+detail), grid-2x2(4 items)."}

${lang === "fr" ? "GRAPHIQUES (chart): utiliser au moins 1 graphique par article quand le sujet comporte des données, tendances, comparaisons ou stats. Fournir des données réelles et plausibles (4-8 points). Types: bar=comparaison, line=tendance temporelle, area=évolution, pie=répartition." : "CHARTS: include at least 1 chart per article when the topic involves data, trends, comparisons, or stats. Use realistic plausible data (4-8 points). Types: bar=comparison, line=time trend, area=growth, pie=distribution. Always include title, data with labels+values, xAxisLabel, yAxisLabel (not for pie), caption."}

${lang === "fr" ? "Ouverture: image hero + accroche courte, 100-150 mots max, 2-3 paragraphes courts." : "Opening: hero image + short hook, 100-150 words max, 2-3 short paragraphs."}
${lang === "fr" ? "Corps: alterner 2-col/grid et respirations 1-col; utiliser listes à puces, H2/H3 réguliers, visuels et graphiques intégrés intelligemment." : "Body: alternate 2-col/grid with 1-col breathing space; use bullet lists, regular H2/H3 headings, purposeful visuals and charts."}
${lang === "fr" ? "Fermeture: 3-5 points clés, CTA concret, pas de vague inspiration." : "Closing: 3-5 key points, concrete CTA, no vague inspiration."}

${lang === "fr" ? "Titres markdown: 2-6 mots, seuls sur leur ligne. Le paragraphe commence après une ligne vide markdown. NE JAMAIS couper un titre sur plusieurs lignes — le titre entier sur une seule ligne." : "Markdown headings: 2-6 words, alone on their own line. Paragraphs start after a blank markdown line. NEVER split a heading across multiple lines — the full heading text on ONE line only."}

${CONTENT_WRITING_RULES[lang]}

${lang === "fr" ? "Paragraphes: 2-4 phrases max (scannable). Préférer listes à puces aux longs blocs." : "Paragraphs: 2-4 sentences max (scannable). Prefer bullet lists over long blocks."}

${lang === "fr" ? "Images: alt+caption uniques, descriptifs, visuels." : "Images: alt+caption must be unique, descriptive, visual."}

${lang === "fr" ? "Interdits: colonne vide, section vide, répétition du même argument, CTA vague." : "Forbidden: empty column, empty section, repeated argument, vague CTA."}

${lang === "fr" ? "Format: Markdown simple sans formatage excessif. Utiliser ## pour titres, listes à puces quand approprié, texte brut autrement. Pas de formatage **gras** ou *italique* prédéfini." : "Format: Simple markdown without excessive formatting. Use ## for headings, bullet lists when appropriate, plain text otherwise. No predefined **bold** or *italic* formatting."}

Blocks: text{id,type:"text",content:"md"}, image{id,type:"image",src,alt,caption}, video{id,type:"video",url,caption}, quote{id,type:"quote",content,author,role}, carousel{id,type:"carousel",slides,autoPlay,aspectRatio}, pdf{id,type:"pdf",url,title,description,displayMode}, chart{id,type:"chart",chartType:"bar"|"line"|"area"|"pie",title:"descriptive title",data:[{label,value,color?}],xAxisLabel:"X axis label",yAxisLabel:"descriptive metric name (used as series legend — e.g. 'Adoption %' not 'value')",caption:"source/interpretation note",height?}

${lang === "fr" ? "RÈGLE CHART: yAxisLabel devient le nom de la série dans la légende — toujours descriptif (ex: 'Taux d'adoption %', 'Temps (secondes)'), jamais 'value' ni 'data'. title et xAxisLabel obligatoires." : "CHART RULE: yAxisLabel becomes the series name in the legend — always descriptive (e.g. 'Adoption %', 'Time (seconds)'), never 'value' or 'data'. title and xAxisLabel are required."}

${lang === "fr" ? "Réponse:" : "Response:"} {title,slug,excerpt:"150-160c",sections:[{id,type,columns:[[blocks]]}],seo_metadata:{description:"<160c",keywords:[],robots:"index, follow",openGraph:{title,description},twitter:{card:"summary_large_image",title,description}},category}

${lang === "fr" ? "CRITIQUE: ids uniques, nombre de colonnes conforme au layout, pas de virgules finales, JSON valide seulement." : "CRITICAL: unique ids, column count must match layout, no trailing commas, valid JSON only."}

${req.tone ? `Tone:${req.tone}` : `Tone:${lang === "fr" ? "pro accessible, autoritaire mais conversationnel" : "professional, approachable, authoritative but conversational"}`}
${req.length ? `Len:${req.length}` : `Len:${lang === "fr" ? "moyen 5-7 sections 800-1200 mots" : "medium 5-7 sections 800-1200 words"}`}
${req.layoutPreference?.length ? `Layouts:${req.layoutPreference}` : `Layouts:${lang === "fr" ? "variés, sans répétition lourde" : "varied, without heavy repetition"}`}
${req.additionalInstructions ? ` ${req.additionalInstructions}` : ""}

Checklist: { } only? valid JSON? headings on standalone lines? concrete details? no empty columns? no filler clichés?`;
}

export function generateSEOPrompt(language?: "en" | "fr"): string {
  const lang = language || "en";
  const l = LANG[lang];

  return `${l.seo}. ${lang === "fr" ? "Générer métadonnées SEO." : "Generate SEO metadata."}

${lang === "fr" ? "LANGUE: Tout le contenu DOIT être en FRANÇAIS - description, title, keywords en français!" : "LANGUAGE: All content must be in English"}

JSON: {seo_metadata:{description:"150-160c SEO",keywords:[],robots:"index, follow",openGraph:{title:"${lang === "fr" ? "OG engageant" : "OG engaging"}",description:"${lang === "fr" ? "OG captivant" : "OG compelling"}"},twitter:{card:"summary_large_image",title:"${lang === "fr" ? "Twitter optimisé" : "Twitter optimized"}",description:"${lang === "fr" ? "Twitter desc" : "Twitter desc"}"}}}

${lang === "fr" ? "Focus: descriptions claires incitant clic, keywords intent recherche, titres optimisés partage" : "Focus: clear compelling descriptions encouraging clicks, keywords matching search intent, optimized titles for sharing"}`;
}

export function generateImprovePrompt(
  instruction: string,
  additionalContext?: string,
  language?: "en" | "fr"
): string {
  const lang = language || "en";
  const l = LANG[lang];

  const instructions = lang === "fr" ? {
    expand: "Développer: + détails, exemples, explications. Complet+informatif.",
    shorten: "Conciser: préserver points clés, éliminer redondance, clarté.",
    rewrite: "Réécrire: + engageant, mieux structuré, même sens.",
    "add-examples": "Ajouter exemples pertinents+pratiques illustrer concepts.",
    "improve-clarity": "Améliorer clarté+lisibilité. Idées complexes → faciles.",
    "make-engaging": "Rendre + engageant+captivant. Accroches, flow, intéressant.",
  } : {
    expand: "Expand: +details, examples, explanations. Comprehensive+informative.",
    shorten: "Concise: preserve key points, remove redundancy, clarity.",
    rewrite: "Rewrite: +engaging, better structured, same meaning.",
    "add-examples": "Add relevant practical examples illustrating concepts.",
    "improve-clarity": "Improve clarity+readability. Complex ideas → easier.",
    "make-engaging": "Make +engaging+compelling. Hooks, flow, interesting.",
  };

  return `${l.editor}. Improve content.

JSON: {content:"improved (md supported)",changes:"brief explanation"}

Instruction: ${instructions[instruction as keyof typeof instructions]}
${additionalContext ? `Context: ${additionalContext}` : ""}`;
}
