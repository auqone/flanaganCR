// Simple in-memory rate limiter
// For production, consider using Redis or Upstash for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the time window
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // If no entry exists or time window has passed, create new entry
  if (!entry || entry.resetTime < now) {
    const resetTime = now + config.interval;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit presets for different types of endpoints
 */
export const rateLimits = {
  // Strict limit for authentication endpoints
  auth: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },
  // Moderate limit for API endpoints
  api: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
  // Lenient limit for public endpoints
  public: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 120, // 120 requests per minute
  },
  // Strict limit for admin operations
  admin: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
};

/**
 * Get client IP address from request headers
 */
export function getClientIp(request: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to 'unknown' if IP cannot be determined
  // In production, this should be handled by the platform (Vercel, etc.)
  return 'unknown';
}
