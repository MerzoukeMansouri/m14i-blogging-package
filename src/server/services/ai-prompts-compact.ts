/**
 * AI Prompts - Compact Format (40-60% token reduction)
 * Token-optimized prompts using concise text instead of verbose explanations
 */

const LANG = {
  en: {
    expert: "Expert blog strategist",
    writer: "Expert content writer",
    seo: "SEO expert",
    editor: "Expert content editor",
    respond: "RESPOND ONLY VALID JSON",
  },
  fr: {
    expert: "Expert stratégie contenu blog",
    writer: "Rédacteur expert",
    seo: "Expert SEO",
    editor: "Éditeur contenu expert",
    respond: "RÉPONDRE UNIQUEMENT JSON VALIDE",
  },
};

export function generateLayoutPrompt(req: {
  length?: string;
  layoutPreference?: string[];
  tone?: string;
  additionalInstructions?: string;
  language?: "en" | "fr";
}): string {
  const lang = req.language || "en";
  const l = LANG[lang];

  return `${l.expert}. ${lang === "fr" ? "Générer structure blog." : "Generate blog layout."}

${lang === "fr" ? "CRITIQUE: JSON 100% VALIDE { } PAS de \`\`\` échapper \" PAS de virgules finales" : "CRITICAL: 100% VALID JSON { } NO \`\`\` escape \" NO trailing commas"}

${lang === "fr" ? "LANGUE: Tout le contenu (title, description, excerpt, category) DOIT être en FRANÇAIS - AUCUN mot anglais!" : "LANGUAGE: All content must be in English"}

${lang === "fr" ? "Réponse: {title,slug,excerpt:\"150-200c\",layout:[{id,type,description}],category}" : "Response: {title,slug,excerpt:\"150-200c\",layout:[{id,type,description}],category}"}

${lang === "fr" ? "PATTERNS PROUVÉS (utiliser ces structures):" : "PROVEN PATTERNS (use these successful structures):"}
${lang === "fr" ? "• Article tech: 1-col(hero+image)→2-col(contenu+quote/image)→grid-2x3(6 features emoji)→1-col(conclusion)" : "• Tech article: 1-col(hero+image)→2-col(content+quote/image)→grid-2x3(6 features emoji)→1-col(conclusion)"}
${lang === "fr" ? "• Portfolio: 1-col(hero)→grid-2x2(4 projets)→2-col(détails+visuel)→1-col(CTA)" : "• Portfolio: 1-col(hero)→grid-2x2(4 projects)→2-col(details+visual)→1-col(CTA)"}
${lang === "fr" ? "• Guide: 1-col(intro)→3-col(3 étapes)→2-col-wide-left(détail+astuce)→grid-2x3(6 conseils)→1-col(prochaines étapes)" : "• Guide: 1-col(intro)→3-col(3 steps)→2-col-wide-left(detail+tip)→grid-2x3(6 tips)→1-col(next steps)"}

${lang === "fr" ? "Types de layout:" : "Layout types:"}
${lang === "fr" ? "• 1-column: TOUJOURS commencer hero (image+intro), conclusion, contenu focalisé" : "• 1-column: ALWAYS start hero (image+intro), conclusion, focused content"}
${lang === "fr" ? "• 2-columns: Texte+quote/image (PAS texte+texte), comparaisons, avant/après" : "• 2-columns: Text+quote/image (NOT text+text), comparisons, before/after"}
${lang === "fr" ? "• 3-columns: Exactement 3 étapes/features/bénéfices égaux" : "• 3-columns: Exactly 3 equal steps/features/benefits"}
${lang === "fr" ? "• 2-columns-wide-left: Principal(66%)+sidebar astuce/quote(33%)" : "• 2-columns-wide-left: Main(66%)+sidebar tip/quote(33%)"}
${lang === "fr" ? "• 2-columns-wide-right: Visuel/icône(33%)+détail(66%)" : "• 2-columns-wide-right: Visual/icon(33%)+detail(66%)"}
${lang === "fr" ? "• grid-2x2: 4 items égaux showcase" : "• grid-2x2: 4 equal showcase items"}
${lang === "fr" ? "• grid-2x3: 6 cartes features (utiliser emoji)" : "• grid-2x3: 6 feature cards (use emoji)"}
${lang === "fr" ? "• grid-3x3: 9 items galerie" : "• grid-3x3: 9 gallery items"}
${lang === "fr" ? "• grid-4-even: 4 features proéminentes" : "• grid-4-even: 4 prominent features"}

${lang === "fr" ? "RÈGLES OBLIGATOIRES:" : "MANDATORY RULES:"}
${lang === "fr" ? "1. COMMENCER avec 1-column hero (description doit mentionner image)" : "1. START with 1-column hero (description must mention image)"}
${lang === "fr" ? "2. Utiliser grids pour features/bénéfices (description: mentionner emoji/icônes)" : "2. Use grids for features/benefits (description: mention emoji/icons)"}
${lang === "fr" ? "3. 2-col = texte + quote/image (description doit spécifier)" : "3. 2-col = text + quote/image (description must specify)"}
${lang === "fr" ? "4. FINIR avec 1-column conclusion" : "4. END with 1-column conclusion"}
${lang === "fr" ? "5. JAMAIS répéter même type consécutivement" : "5. NEVER repeat same type consecutively"}
${lang === "fr" ? "6. Alterner dense(grid/3-col) avec aéré(1-col/2-col)" : "6. Alternate dense(grid/3-col) with spacious(1-col/2-col)"}

${lang === "fr" ? "Mots: court~3-4 sect 1k, moyen~5-6 sect 1.5-2k, long~6-7 sect 2-2.5k" : "Words: short~3-4 sect 1k, medium~5-6 sect 1.5-2k, long~6-7 sect 2-2.5k"}

${req.length ? `Len:${req.length}` : ""}${req.layoutPreference?.length ? ` Pref:${req.layoutPreference}` : ""}${req.tone ? ` Tone:${req.tone}` : ""}${req.additionalInstructions ? ` ${req.additionalInstructions}` : ""}`;
}

export function generateSectionPrompt(
  layoutType: string,
  context?: string,
  language?: "en" | "fr"
): string {
  const lang = language || "en";
  const l = LANG[lang];

  const colReq = lang === "fr"
    ? {"1-column":"1col pleine","2-columns":"2col égales","3-columns":"3col égales","2-columns-wide-left":"2col gauche+large 66/33","2-columns-wide-right":"2col droite+large 33/66"}[layoutType]
    : {"1-column":"1col full","2-columns":"2col equal","3-columns":"3col equal","2-columns-wide-left":"2col left wider 66/33","2-columns-wide-right":"2col right wider 33/66"}[layoutType];

  return `${l.writer}. ${lang === "fr" ? `Générer section ${layoutType}.` : `Generate section ${layoutType}.`}

${lang === "fr" ? "LANGUE: Tout le contenu DOIT être en FRANÇAIS - AUCUN mot anglais dans content, caption, author!" : "LANGUAGE: All content must be in English"}

${lang === "fr" ? "RÈGLES JSON CRITIQUES:" : "CRITICAL JSON RULES:"}
${lang === "fr" ? "- SEULEMENT objet JSON valide" : "- ONLY valid JSON object"}
${lang === "fr" ? "- COMMENCE avec { et TERMINE avec }" : "- START with { and END with }"}
${lang === "fr" ? "- Échapper TOUTES les guillemets dans content avec \\\\\"" : "- Escape ALL quotes in content with \\\\\""}
${lang === "fr" ? "- PAS de sauts de ligne dans strings (utiliser \\\\\\\\n)" : "- NO newlines in strings (use \\\\\\\\n)"}
${lang === "fr" ? "- PAS de virgules finales" : "- NO trailing commas"}
${lang === "fr" ? "- PAS de blocs markdown code" : "- NO markdown code blocks"}
${lang === "fr" ? "- Tester validité JSON avant envoi" : "- Test JSON validity before responding"}

${lang === "fr" ? "Format réponse:" : "Response format:"} {section:{id,type:"${layoutType}",columns:[[blocks]]}}
${layoutType}: ${colReq}

Blocks: text{id,type:"text",content:"markdown ${lang === "fr" ? "avec guillemets échappés" : "with escaped quotes"}"}, image{id,type:"image",src,alt,caption}, video{id,type:"video",url,caption}, quote{id,type:"quote",content,author,role}, carousel{id,type:"carousel",slides:[{src,alt,caption}]}, pdf{id,type:"pdf",url,title,description}
${lang === "fr" ? "URLs placeholder:" : "Placeholder URLs:"} https://placeholder.example/name.jpg

${lang === "fr" ? "RÈGLES VISUEL D'ABORD:" : "VISUAL FIRST RULES:"}
${lang === "fr" ? "- 1-column: TOUJOURS inclure 1 image + texte (100-150 mots max, paragraphes courts)" : "- 1-column: ALWAYS include 1 image + text (100-150w max, short paragraphs)"}
${lang === "fr" ? "- 2-columns: Col1 = texte court (80-120 mots), Col2 = image OU quote (JAMAIS texte+texte)" : "- 2-columns: Col1 = short text (80-120w), Col2 = image OR quote (NEVER text+text)"}
${lang === "fr" ? "- 3-columns: 3 cartes courtes (50-80 mots chacune) avec emoji au début" : "- 3-columns: 3 short cards (50-80w each) with emoji at start"}
${lang === "fr" ? "- Grids: Très court (30-50 mots par cellule) avec emoji/icônes" : "- Grids: Very short (30-50w per cell) with emoji/icons"}
${lang === "fr" ? "- Paragraphes: MAX 2-3 phrases courtes" : "- Paragraphs: MAX 2-3 short sentences"}
${lang === "fr" ? "- Préférer listes à puces aux longs paragraphes" : "- Prefer bullet lists over long paragraphs"}
${lang === "fr" ? "- H2/H3 tous les 100 mots" : "- H2/H3 every 100w"}

${context ? `Context:${context}` : ""}

${lang === "fr" ? "VÉRIFICATION FINALE: Vérifier que JSON est valide avant envoi!" : "FINAL CHECK: Verify JSON is valid before sending!"}`;
}

export function generateCompletePrompt(req: {
  tone?: string;
  length?: string;
  layoutPreference?: string[];
  additionalInstructions?: string;
  language?: "en" | "fr";
}): string {
  const lang = req.language || "en";
  const l = LANG[lang];

  return `${lang === "fr" ? "Rédacteur expert blog élégant" : "Expert elegant blog writer"}.

${lang === "fr" ? "LANGUE: Tout le contenu DOIT être en FRANÇAIS - AUCUN mot anglais dans title, content, captions, author!" : "LANGUAGE: All content must be in English"}

${lang === "fr" ? "CRITIQUE: JSON 100% VALIDE { } début/fin SEULEMENT, PAS de \`\`\`, échapper \", sauts ligne \\n, PAS virgules finales" : "CRITICAL: 100% VALID JSON { } start/end ONLY, NO \`\`\`, escape \", newlines \\n, NO trailing commas"}

${lang === "fr" ? "Philosophie: VISUEL d'abord - scannable (titres+paragraphes courts), engageant (accroche), actionable (valeur), respire (images/quotes/emojis)" : "Philosophy: VISUAL first - scannable (headings+short paragraphs), engaging (hook), actionable (value), breathing (images/quotes/emojis)"}

${lang === "fr" ? "Layouts: 1-column(intro/conclusion+images), 2-columns(texte+quote/image), 2-columns-wide-left(contenu+astuce 66/33), 2-columns-wide-right(icône+détail 33/66), 3-columns(features), grid-4-even(4 items 2x2)" : "Layouts: 1-column(intro/conclusion+images), 2-columns(text+quote/image), 2-columns-wide-left(content+tip 66/33), 2-columns-wide-right(icon+detail 33/66), 3-columns(features), grid-4-even(4 items 2x2)"}

${lang === "fr" ? "Ouverture: Image hero + accroche courte (100-150 mots MAX), 2-3 para courts" : "Opening: Hero image + short hook (100-150w MAX), 2-3 short para"}
${lang === "fr" ? "Corps: Mixer 2/3-col, 1 sujet+points, H2/H3 100 mots, listes à puces, images/quotes TOUJOURS dans 2-col" : "Body: Mix 2/3-col, 1 topic+points, H2/H3 100w, bullet lists, images/quotes ALWAYS in 2-col"}
${lang === "fr" ? "Fermeture: 3-5 points clés, CTA clair, concis" : "Closing: 3-5 key points, clear CTA, concise"}

${lang === "fr" ? "Contenu: Paragraphes 2-3 phrases MAX, listes à puces préférées, texte 80-120 mots par colonne" : "Content: Paragraphs 2-3 sentences MAX, bullet lists preferred, text 80-120w per column"}

Markdown: **bold** ${lang === "fr" ? "termes clés" : "key terms"}, *italic* ${lang === "fr" ? "emphase" : "emphasis"}, \`code\` ${lang === "fr" ? "technique" : "technical"}, lists ${lang === "fr" ? "scannables" : "scannable"}, ## structure

Blocks: text{id,type:"text",content:"md"}, image{id,type:"image",src,alt,caption}, video{id,type:"video",url,caption}, quote{id,type:"quote",content,author,role}, carousel{id,type:"carousel",slides,autoPlay,aspectRatio}, pdf{id,type:"pdf",url,title,description,displayMode}

${lang === "fr" ? "Réponse:" : "Response:"} {title,slug,excerpt:"150-160c",sections:[{id,type,columns:[[blocks]]}],seo_metadata:{description:"<160c",keywords:[],robots:"index, follow",openGraph:{title,description},twitter:{card:"summary_large_image",title,description}},category}

${lang === "fr" ? "CRITIQUE: échapper \", utiliser \\n, ids uniques, colonnes correspondant au type layout, PAS virgules finales, début { fin }" : "CRITICAL: escape \", use \\n, unique ids, match columns count to layout type, NO trailing commas, start { end }"}

${req.tone ? `Tone:${req.tone}` : `Tone:${lang === "fr" ? "Pro+accessible, autoritaire+conversationnel" : "Pro yet approachable, authoritative yet conversational"}`}
${req.length ? `Len:${req.length}` : `Len:${lang === "fr" ? "moyen 5-7 sect 800-1200 mots" : "medium 5-7 sect 800-1200 words"}`}
${req.layoutPreference?.length ? `Layouts:${req.layoutPreference}` : `Layouts:${lang === "fr" ? "variés 2-col 3-col grilles" : "varied 2-col 3-col grids"}`}
${req.additionalInstructions ? ` ${req.additionalInstructions}` : ""}

Checklist: { }? Escaped "? \\n? NO commas? "keys"? NO \`\`\`? Closed brackets?`;
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
