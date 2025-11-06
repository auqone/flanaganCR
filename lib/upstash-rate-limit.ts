import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis client (will only initialize if environment variables are set)
let redis: Redis | null = null;
let ratelimiters: {
  auth: Ratelimit | null;
  api: Ratelimit | null;
  public: Ratelimit | null;
  admin: Ratelimit | null;
} = {
  auth: null,
  api: null,
  public: null,
  admin: null,
};

// Initialize Redis and rate limiters if Upstash is configured
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Auth endpoints - strict limits
  ratelimiters.auth = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 requests per 15 minutes
    analytics: true,
    prefix: "@upstash/ratelimit:auth",
  });

  // API endpoints - moderate limits
  ratelimiters.api = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 requests per minute
    analytics: true,
    prefix: "@upstash/ratelimit:api",
  });

  // Public endpoints - generous limits
  ratelimiters.public = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(120, "1 m"), // 120 requests per minute
    analytics: true,
    prefix: "@upstash/ratelimit:public",
  });

  // Admin endpoints - moderate limits
  ratelimiters.admin = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 requests per minute
    analytics: true,
    prefix: "@upstash/ratelimit:admin",
  });
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (for different hosting providers)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  const ip =
    cfConnectingIp ||
    realIp ||
    forwardedFor?.split(",")[0].trim() ||
    "unknown";

  return ip;
}

/**
 * Check rate limit using Upstash Redis (production) or fallback to in-memory (development)
 */
export async function checkUpstashRateLimit(
  identifier: string,
  type: "auth" | "api" | "public" | "admin" = "api"
): Promise<RateLimitResult> {
  const limiter = ratelimiters[type];

  // If Upstash is not configured, use fallback in-memory rate limiting
  if (!limiter || !redis) {
    console.warn(
      "Upstash Redis not configured - using fallback in-memory rate limiting"
    );
    return fallbackRateLimit(identifier, type);
  }

  try {
    const result = await limiter.limit(identifier);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      resetTime: result.reset,
      retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
    };
  } catch (error) {
    console.error("Upstash rate limit check failed:", error);
    // Fallback to allowing the request if rate limit check fails
    return {
      success: true,
      limit: 0,
      remaining: 0,
      resetTime: Date.now(),
    };
  }
}

/**
 * Fallback in-memory rate limiting (for development/testing)
 */
const inMemoryStore = new Map<
  string,
  { count: number; resetTime: number }
>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of inMemoryStore.entries()) {
    if (value.resetTime < now) {
      inMemoryStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

function fallbackRateLimit(
  identifier: string,
  type: "auth" | "api" | "public" | "admin"
): RateLimitResult {
  const limits = {
    auth: { max: 5, window: 15 * 60 * 1000 }, // 5 per 15 min
    api: { max: 60, window: 60 * 1000 }, // 60 per minute
    public: { max: 120, window: 60 * 1000 }, // 120 per minute
    admin: { max: 30, window: 60 * 1000 }, // 30 per minute
  };

  const limit = limits[type];
  const key = `${type}:${identifier}`;
  const now = Date.now();

  let record = inMemoryStore.get(key);

  // Reset if window expired
  if (!record || record.resetTime < now) {
    record = {
      count: 0,
      resetTime: now + limit.window,
    };
  }

  record.count++;
  inMemoryStore.set(key, record);

  const success = record.count <= limit.max;
  const remaining = Math.max(0, limit.max - record.count);

  return {
    success,
    limit: limit.max,
    remaining,
    resetTime: record.resetTime,
    retryAfter: success ? undefined : Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Rate limit middleware for API routes
 */
export async function withRateLimit(
  request: Request,
  type: "auth" | "api" | "public" | "admin" = "api"
): Promise<{ allowed: boolean; response?: Response }> {
  const identifier = getClientIdentifier(request);
  const result = await checkUpstashRateLimit(identifier, type);

  if (!result.success) {
    const headers = new Headers();
    headers.set("X-RateLimit-Limit", result.limit.toString());
    headers.set("X-RateLimit-Remaining", "0");
    headers.set("X-RateLimit-Reset", result.resetTime.toString());
    if (result.retryAfter) {
      headers.set("Retry-After", result.retryAfter.toString());
    }

    return {
      allowed: false,
      response: new Response(
        JSON.stringify({
          error: "Too many requests",
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            ...Object.fromEntries(headers.entries()),
            "Content-Type": "application/json",
          },
        }
      ),
    };
  }

  return { allowed: true };
}

/**
 * Get rate limit analytics (if using Upstash with analytics enabled)
 */
export async function getRateLimitAnalytics(
  type: "auth" | "api" | "public" | "admin"
): Promise<{
  totalRequests: number;
  blockedRequests: number;
  uniqueIdentifiers: number;
} | null> {
  if (!redis) {
    return null;
  }

  try {
    // This would require implementing custom analytics tracking
    // Upstash Ratelimit has built-in analytics but requires separate queries
    const prefix = `@upstash/ratelimit:${type}`;

    // Placeholder - implement based on your needs
    return {
      totalRequests: 0,
      blockedRequests: 0,
      uniqueIdentifiers: 0,
    };
  } catch (error) {
    console.error("Failed to get rate limit analytics:", error);
    return null;
  }
}

/**
 * Reset rate limit for a specific identifier (useful for testing or manual overrides)
 */
export async function resetRateLimit(
  identifier: string,
  type: "auth" | "api" | "public" | "admin" = "api"
): Promise<boolean> {
  if (!redis) {
    // Clear from in-memory store
    const key = `${type}:${identifier}`;
    inMemoryStore.delete(key);
    return true;
  }

  try {
    const prefix = `@upstash/ratelimit:${type}`;
    await redis.del(`${prefix}:${identifier}`);
    return true;
  } catch (error) {
    console.error("Failed to reset rate limit:", error);
    return false;
  }
}
