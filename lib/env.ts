/**
 * Environment Variable Validation
 *
 * This file validates that all required environment variables are set at runtime.
 * It prevents the application from starting with missing critical configuration.
 */

type EnvironmentVariables = {
  // Database
  DATABASE_URL: string;

  // Authentication
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;

  // Payment Processing (Stripe)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;

  // Email Service (Resend)
  RESEND_API_KEY: string;

  // Image Management (Cloudinary)
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  // Dropshipping (Spocket)
  SPOCKET_API_KEY: string;
  SPOCKET_WEBHOOK_SECRET: string;

  // Cron Jobs
  CRON_SECRET: string;

  // AI/SEO Optimization (Anthropic) - Optional
  ANTHROPIC_API_KEY?: string;

  // Dropshipping (AutoDS) - Optional
  AUTODS_API_KEY?: string;

  // App Configuration
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_APP_NAME: string;

  // Node Environment
  NODE_ENV?: 'development' | 'production' | 'test';
};

/**
 * Required environment variables that must be set
 */
const REQUIRED_ENV_VARS: (keyof EnvironmentVariables)[] = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'SPOCKET_API_KEY',
  'SPOCKET_WEBHOOK_SECRET',
  'CRON_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_APP_NAME',
];

/**
 * Validate environment variables at startup
 * @throws Error if any required variables are missing
 */
export function validateEnvironment(): void {
  const missingVars: string[] = [];

  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    const message = `
Missing required environment variables:
${missingVars.map((v) => `  - ${v}`).join('\n')}

Please update your .env file with the missing variables.
See .env.example for the required format.
    `.trim();

    throw new Error(message);
  }
}

/**
 * Get validated environment variables with type safety
 */
export function getEnv(): EnvironmentVariables {
  validateEnvironment();

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    SPOCKET_API_KEY: process.env.SPOCKET_API_KEY!,
    SPOCKET_WEBHOOK_SECRET: process.env.SPOCKET_WEBHOOK_SECRET!,
    CRON_SECRET: process.env.CRON_SECRET!,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    AUTODS_API_KEY: process.env.AUTODS_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME!,
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  };
}

/**
 * Check if a specific optional variable is available
 */
export function hasOptionalVar(varName: 'ANTHROPIC_API_KEY' | 'AUTODS_API_KEY'): boolean {
  return !!process.env[varName];
}

// Validate on module load (runs when this file is imported)
if (typeof window === 'undefined') {
  // Only validate on server-side to avoid issues in browser
  try {
    validateEnvironment();
  } catch (error) {
    // Log but don't throw here - let it throw when actually needed
    console.error(error);
  }
}
