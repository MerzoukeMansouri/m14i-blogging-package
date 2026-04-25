import type { LayoutSection } from "@m14i/blogging-core";

export function sanitizeBlocks(blocks: unknown): LayoutSection["columns"][number] {
  if (!Array.isArray(blocks)) return [];

  return blocks
    .filter((block): block is Record<string, unknown> => !!block && typeof block === "object" && "id" in block && "type" in block)
    .map((block) => ({
      ...block,
      id: String(block.id),
    })) as LayoutSection["columns"][number];
}

export function sanitizeSections(sections: unknown): LayoutSection[] {
  if (!Array.isArray(sections)) return [];

  return sections
    .filter((section): section is Partial<LayoutSection> & { id: string; type: LayoutSection["type"] } => {
      return !!section && typeof section === "object" && "id" in section && "type" in section;
    })
    .map((section) => ({
      id: String(section.id),
      type: section.type,
      columns: Array.isArray(section.columns)
        ? section.columns.map((column) => sanitizeBlocks(column)).filter(Array.isArray)
        : [],
    }));
}
