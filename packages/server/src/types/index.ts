/**
 * Server package types
 * Re-exports core types and adds server-specific types
 */

// Re-export all core types
export type * from "@m14i/blogging-core/client";

// Re-export server-specific AI generation types
export type {
  GenerateCompleteBlogRequest,
  GenerateCompleteBlogResponse,
  GenerateLayoutRequest,
  GenerateLayoutResponse,
  GenerateSectionRequest,
  GenerateSectionResponse,
  GenerateSEORequest,
  GenerateSEOResponse,
  ImproveContentRequest,
  ImproveContentResponse,
  AIGenerationError,
  AIGenerationConfig,
  GenerateFromTemplateRequest,
} from "./aiGeneration";
