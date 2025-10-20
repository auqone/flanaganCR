import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import {
  checkRateLimit,
  getClientIp,
  rateLimits,
  RateLimitConfig,
} from './rate-limit';

// Middleware to protect admin API routes
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      );
    }

    // Token is valid, allow the request to proceed
    return null;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Wrapper function to protect API routes
export function withAdminAuth(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const authCheck = await requireAdmin(request);

    if (authCheck) {
      return authCheck; // Return the error response
    }

    return handler(request, context);
  };
}

/**
 * Rate limiting middleware wrapper
 */
export function withRateLimit(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  config: RateLimitConfig = rateLimits.api
) {
  return async (request: NextRequest, context?: any) => {
    const ip = getClientIp(request);
    const identifier = `${ip}:${request.nextUrl.pathname}`;

    const result = checkRateLimit(identifier, config);

    if (!result.success) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': result.resetTime.toString(),
          },
        }
      );
    }

    const response = await handler(request, context);

    // Add rate limit headers to successful responses
    response.headers.set(
      'X-RateLimit-Limit',
      config.maxRequests.toString()
    );
    response.headers.set(
      'X-RateLimit-Remaining',
      result.remaining.toString()
    );
    response.headers.set(
      'X-RateLimit-Reset',
      result.resetTime.toString()
    );

    return response;
  };
}

/**
 * Combine multiple middleware functions
 */
export function composeMiddleware(
  ...middlewares: Array<
    (
      handler: (request: NextRequest, context?: any) => Promise<NextResponse>
    ) => (request: NextRequest, context?: any) => Promise<NextResponse>
  >
) {
  return (
    handler: (request: NextRequest, context?: any) => Promise<NextResponse>
  ) => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      handler
    );
  };
}
