/**
 * Email utility functions for safe HTML generation
 */

/**
 * Escapes HTML special characters to prevent XSS attacks in email templates
 * @param text - The text to escape
 * @returns HTML-safe string
 */
export function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats a price value safely for display
 * @param amount - The amount in dollars
 * @returns Formatted price string
 */
export function formatPrice(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00';
  return `$${amount.toFixed(2)}`;
}

/**
 * Formats a date safely for display
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
}
