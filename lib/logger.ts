/**
 * Production Error Logging Utility
 *
 * This provides structured logging for the application.
 * Can be extended to integrate with services like Sentry, DataDog, etc.
 */

interface LogContext {
  [key: string]: any;
}

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';
  private logToConsole = true;
  private logToExternal = !this.isDevelopment; // Send to external service in production

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context) : '';
    return `[${timestamp}] ${level}: ${message}${contextStr ? ` | ${contextStr}` : ''}`;
  }

  private async sendToExternalService(level: LogLevel, message: string, context?: LogContext) {
    // This is where you would integrate with Sentry, DataDog, LogRocket, etc.
    if (!this.logToExternal) return;

    try {
      // Example: Send to a logging service
      if (typeof window === 'undefined') {
        // Server-side logging
        console.log(`[External Log] ${this.formatMessage(level, message, context)}`);
      }
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  debug(message: string, context?: LogContext) {
    const formatted = this.formatMessage(LogLevel.DEBUG, message, context);
    if (this.logToConsole && this.isDevelopment) {
      console.debug(formatted);
    }
  }

  info(message: string, context?: LogContext) {
    const formatted = this.formatMessage(LogLevel.INFO, message, context);
    if (this.logToConsole) {
      console.info(formatted);
    }
    this.sendToExternalService(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext) {
    const formatted = this.formatMessage(LogLevel.WARN, message, context);
    if (this.logToConsole) {
      console.warn(formatted);
    }
    this.sendToExternalService(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      ...(error instanceof Error && {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }),
    };

    const formatted = this.formatMessage(LogLevel.ERROR, message, errorContext);
    if (this.logToConsole) {
      console.error(formatted);
    }
    this.sendToExternalService(LogLevel.ERROR, message, errorContext);
  }

  critical(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      severity: 'critical',
      ...context,
      ...(error instanceof Error && {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }),
    };

    const formatted = this.formatMessage(LogLevel.CRITICAL, message, errorContext);
    if (this.logToConsole) {
      console.error(formatted);
    }
    this.sendToExternalService(LogLevel.CRITICAL, message, errorContext);
  }
}

// Export singleton instance
export const logger = new Logger();
