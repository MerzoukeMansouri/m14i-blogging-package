/**
 * Simple in-memory rate limiter for AI generation endpoints
 *
 * This prevents abuse of AI generation features by limiting
 * the number of requests per IP address within a time window.
 *
 * For production use, consider using a more robust solution like:
 * - Redis-based rate limiting
 * - Upstash rate limiting
 * - Vercel edge config
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if a request is allowed based on rate limits
   * @param identifier - Unique identifier (usually IP address)
   * @param limit - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with allowed status and metadata
   */
  checkLimit(
    identifier: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // No existing entry or expired entry
    if (!entry || entry.resetTime < now) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });

      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs,
      };
    }

    // Entry exists and is valid
    if (entry.count < limit) {
      entry.count++;
      this.store.set(identifier, entry);

      return {
        allowed: true,
        remaining: limit - entry.count,
        resetTime: entry.resetTime,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Remove expired entries from the store
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear all entries (useful for testing)
   */
  clear() {
    this.store.clear();
  }

  /**
   * Stop the cleanup interval
   */
  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Rate limit configuration for AI generation endpoints
 */
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed per window
   * @default 10
   */
  limit?: number;

  /**
   * Time window in milliseconds
   * @default 60000 (1 minute)
   */
  windowMs?: number;

  /**
   * Custom function to get the identifier (e.g., IP address)
   * @default Uses x-forwarded-for or x-real-ip headers
   */
  getIdentifier?: (request: Request) => string;
}

/**
 * Get client identifier from request headers
 */
function getClientIdentifier(request: Request): string {
  // Try to get IP from headers (common in production environments)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to a default identifier
  return "unknown";
}

/**
 * Apply rate limiting to a request
 *
 * @example
 * ```typescript
 * async function POST(request: Request) {
 *   const rateLimitResult = applyRateLimit(request, {
 *     limit: 5,
 *     windowMs: 60000, // 1 minute
 *   });
 *
 *   if (!rateLimitResult.allowed) {
 *     return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
 *       status: 429,
 *       headers: rateLimitResult.headers,
 *     });
 *   }
 *
 *   // Process request...
 * }
 * ```
 */
export function applyRateLimit(
  request: Request,
  config: RateLimitConfig = {}
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  headers: Record<string, string>;
} {
  const {
    limit = 10,
    windowMs = 60000, // 1 minute
    getIdentifier = getClientIdentifier,
  } = config;

  const identifier = getIdentifier(request);
  const result = rateLimiter.checkLimit(identifier, limit, windowMs);

  // Prepare rate limit headers
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
  };

  if (!result.allowed) {
    headers["Retry-After"] = Math.ceil(
      (result.resetTime - Date.now()) / 1000
    ).toString();
  }

  return {
    allowed: result.allowed,
    remaining: result.remaining,
    resetTime: result.resetTime,
    headers,
  };
}

/**
 * Get the rate limiter instance (useful for testing)
 */
export function getRateLimiter() {
  return rateLimiter;
}
