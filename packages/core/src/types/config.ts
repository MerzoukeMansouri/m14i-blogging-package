import type { ComponentType } from "react";
import type { LayoutType, ContentBlockType, LayoutSection } from "./index";

// Layout configuration
export interface LayoutConfig {
  type: LayoutType;
  label: string;
  icon?: ComponentType<{ className?: string }>;
}

// Block configuration
export interface BlockConfig {
  type: ContentBlockType;
  label: string;
  icon?: ComponentType<{ className?: string }>;
}

// Theme configuration
export interface ThemeConfig {
  colors?: {
    primary?: string;
    border?: string;
    background?: string;
    accent?: string;
  };
}

// UI configuration
export interface UIConfig {
  showPreviewToggle?: boolean;
  compactMode?: boolean;
  sidebarWidth?: string;
}

// Callback functions configuration
export interface CallbacksConfig {
  onSave?: (sections: LayoutSection[]) => void;
  onChange?: (sections: LayoutSection[]) => void;
  onValidate?: (sections: LayoutSection[]) => boolean | string;
}

// Main Blog Builder configuration
export interface BlogBuilderConfig {
  layouts?: LayoutConfig[];
  blocks?: BlockConfig[];
  theme?: ThemeConfig;
  ui?: UIConfig;
  callbacks?: CallbacksConfig;
}