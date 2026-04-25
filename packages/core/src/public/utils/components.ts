/**
 * Component utilities
 * Helper functions for working with dynamic components
 */

import type { BlogComponents } from "../types";

/**
 * Get component from components object with default fallback
 */
export function getComponent<K extends keyof BlogComponents>(
  components: BlogComponents | undefined,
  key: K,
  fallback: string
): BlogComponents[K] | typeof fallback {
  return components?.[key] || fallback;
}

/**
 * Get multiple components with defaults
 */
export function getComponents<K extends keyof BlogComponents>(
  components: BlogComponents | undefined,
  defaults: Record<K, string>
): Record<K, BlogComponents[K] | string> {
  const result = {} as Record<K, BlogComponents[K] | string>;

  for (const [key, fallback] of Object.entries(defaults) as Array<[K, string]>) {
    result[key] = getComponent(components, key, fallback);
  }

  return result;
}