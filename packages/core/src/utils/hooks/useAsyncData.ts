import { useState, useCallback, useEffect, useRef } from "react";

export interface UseAsyncDataOptions<T> {
  /**
   * Initial data value
   */
  initialData?: T;
  /**
   * Auto-fetch on mount
   */
  autoFetch?: boolean;
  /**
   * Callback when data fetches successfully
   */
  onSuccess?: (data: T) => void;
  /**
   * Callback when fetch fails
   */
  onError?: (error: Error) => void;
}

export interface UseAsyncDataReturn<T> {
  /**
   * The current data value
   */
  data: T | undefined;
  /**
   * Whether the async operation is currently loading
   */
  isLoading: boolean;
  /**
   * Error message if fetch failed
   */
  error: string | null;
  /**
   * Execute the async operation
   */
  execute: (...args: any[]) => Promise<T | undefined>;
  /**
   * Reset to initial state
   */
  reset: () => void;
  /**
   * Set data manually
   */
  setData: (data: T) => void;
}

/**
 * Generic hook for managing async data fetching with loading/error states
 *
 * Eliminates boilerplate for the common pattern:
 * - useState for data, loading, error
 * - try/catch in useCallback
 * - setLoading(true)/setLoading(false)
 *
 * @example
 * ```ts
 * const { data: posts, isLoading, error, execute } = useAsyncData(
 *   async (page: number) => {
 *     const res = await fetch(`/api/posts?page=${page}`);
 *     return res.json();
 *   }
 * );
 *
 * // Call it
 * await execute(1);
 * ```
 */
export function useAsyncData<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataReturn<T> {
  const { initialData, autoFetch = false, onSuccess, onError } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncFn(...args);

        if (isMountedRef.current) {
          setData(result);
          setIsLoading(false);
          onSuccess?.(result);
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";

        if (isMountedRef.current) {
          setError(errorMessage);
          setData(undefined);
          setIsLoading(false);
          onError?.(err instanceof Error ? err : new Error(errorMessage));
        }

        return undefined;
      }
    },
    [asyncFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setIsLoading(false);
    setError(null);
  }, [initialData]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [autoFetch, execute]);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
    setData,
  };
}
