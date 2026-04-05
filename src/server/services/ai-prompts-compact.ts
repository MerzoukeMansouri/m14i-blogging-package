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

  return `${l.expert}. Generate blog layout.

CRITICAL: 100% VALID JSON { } NO \`\`\` escape " NO trailing commas

Response: {title,slug,excerpt:"150-200c",layout:[{id,type,description}],category,tags:[]}

PROVEN PATTERNS (use these successful structures):
${lang === "fr" ? "• Article tech: 1-col(hero+image)→2-col(contenu+quote/image)→grid-2x3(6 features emoji)→1-col(conclusion)" : "• Tech article: 1-col(hero+image)→2-col(content+quote/image)→grid-2x3(6 features emoji)→1-col(conclusion)"}
${lang === "fr" ? "• Portfolio: 1-col(hero)→grid-2x2(4 projets)→2-col(détails+visuel)→1-col(CTA)" : "• Portfolio: 1-col(hero)→grid-2x2(4 projects)→2-col(details+visual)→1-col(CTA)"}
${lang === "fr" ? "• Guide: 1-col(intro)→3-col(3 steps)→2-col-wide-left(détail+tip)→grid-2x3(6 tips)→1-col(next steps)" : "• Guide: 1-col(intro)→3-col(3 steps)→2-col-wide-left(detail+tip)→grid-2x3(6 tips)→1-col(next steps)"}

Layout types:
• 1-column: ALWAYS start hero (image+intro), conclusion, focused content
• 2-columns: Text+quote/image (NOT text+text), comparisons, before/after
• 3-columns: Exactly 3 equal steps/features/benefits
• 2-columns-wide-left: Main(66%)+sidebar tip/quote(33%)
• 2-columns-wide-right: Visual/icon(33%)+detail(66%)
• grid-2x2: 4 equal showcase items
• grid-2x3: 6 feature cards (use emoji)
• grid-3x3: 9 gallery items
• grid-4-even: 4 prominent features

MANDATORY RULES:
1. START with 1-column hero (description must mention image)
2. Use grids for features/benefits (description: mention emoji/icons)
3. 2-col = text + quote/image (description must specify)
4. END with 1-column conclusion
5. NEVER repeat same type consecutively
6. Alternate dense(grid/3-col) with spacious(1-col/2-col)

Words: short~3-4 sect 1k, medium~5-6 sect 1.5-2k, long~6-7 sect 2-2.5k

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

  return `${l.writer}. Generate section ${layoutType}.

CRITICAL JSON RULES:
- ONLY valid JSON object
- START with { and END with }
- Escape ALL quotes in content with \\\"
- NO newlines in strings (use \\\\n)
- NO trailing commas
- NO markdown code blocks
- Test JSON validity before responding

Response format: {section:{id,type:"${layoutType}",columns:[[blocks]]}}
${layoutType}: ${colReq}

Blocks: text{id,type:"text",content:"markdown with escaped quotes"}, image{id,type:"image",src,alt,caption}, video{id,type:"video",url,caption}, quote{id,type:"quote",content,author,role}, carousel{id,type:"carousel",slides:[{src,alt,caption}]}, pdf{id,type:"pdf",url,title,description}
Placeholder URLs: https://placeholder.example/name.jpg

Content rules: 250-500w MAX, paragraphs 2-3 ${lang === "fr" ? "phrases" : "sentences"}, H2/H3 ${lang === "fr" ? "chaque" : "every"} 150-200w

${context ? `Context:${context}` : ""}

FINAL CHECK: Verify JSON is valid before sending!`;
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

CRITICAL: 100% VALID JSON { } start/end ONLY, NO \`\`\`, escape ", newlines \\n, NO trailing commas

Philosophy: scannable (headings+short paragraphs), engaging (hook+interest), actionable (value+takeaways), visual (hierarchy+breathing), elegant (professional+warm)

Layouts: 1-column(intro/conclusion), 2-columns(comparisons), 2-columns-wide-left(content+tip 66/33), 2-columns-wide-right(icon+detail 33/66), 3-columns(features), grid-4-even(4 items 2x2)

Opening: hook(question/stat)+value+context, 2-3 para MAX, consider hero img
Body: mix 2/3-col rhythm, 1 topic+2-4 points, H2/H3 liberally, examples+data, visuals strategic
Closing: 3-5 takeaways, clear CTA, forward-looking

Markdown: **bold** ${lang === "fr" ? "termes clés" : "key terms"}, *italic* ${lang === "fr" ? "emphase" : "emphasis"}, \`code\` ${lang === "fr" ? "technique" : "technical"}, lists ${lang === "fr" ? "scannables" : "scannable"}, ## structure

Blocks: text{id,type:"text",content:"md"}, image{id,type:"image",src,alt,caption}, video{id,type:"video",url,caption}, quote{id,type:"quote",content,author,role}, carousel{id,type:"carousel",slides,autoPlay,aspectRatio}, pdf{id,type:"pdf",url,title,description,displayMode}

Response: {title,slug,excerpt:"150-160c",sections:[{id,type,columns:[[blocks]]}],seo_metadata:{description:"<160c",keywords:[],robots:"index, follow",openGraph:{title,description},twitter:{card:"summary_large_image",title,description}},category,tags:[]}

CRITICAL: escape ", use \\n, unique ids, match columns count to layout type, NO trailing commas, start { end }

${req.tone ? `Tone:${req.tone}` : `Tone:${lang === "fr" ? "Pro+accessible, autoritaire+conversationnel" : "Pro yet approachable, authoritative yet conversational"}`}
${req.length ? `Len:${req.length}` : `Len:${lang === "fr" ? "moyen 5-7 sect 800-1200 mots" : "medium 5-7 sect 800-1200 words"}`}
${req.layoutPreference?.length ? `Layouts:${req.layoutPreference}` : `Layouts:${lang === "fr" ? "variés 2-col 3-col grilles" : "varied 2-col 3-col grids"}`}
${req.additionalInstructions ? ` ${req.additionalInstructions}` : ""}

Checklist: { }? Escaped "? \\n? NO commas? "keys"? NO \`\`\`? Closed brackets?`;
}

export function generateSEOPrompt(language?: "en" | "fr"): string {
  const lang = language || "en";
  const l = LANG[lang];

  return `${l.seo}. Generate SEO metadata.

JSON: {seo_metadata:{description:"150-160c SEO",keywords:[],robots:"index, follow",openGraph:{title:"OG engaging",description:"OG compelling"},twitter:{card:"summary_large_image",title:"Twitter optimized",description:"Twitter desc"}},tags:["t1","t2","t3"]}

Focus: ${lang === "fr" ? "descriptions claires incitant clic, keywords intent recherche, titres optimisés partage, 3-5 tags pertinents" : "clear compelling descriptions encouraging clicks, keywords matching search intent, optimized titles for sharing, 3-5 highly relevant tags"}`;
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
