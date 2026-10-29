/**
 * Formats a number as Indian Rupee (INR) currency.
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Returns a human-friendly relative time string (e.g., "Just now", "4m ago", "1h ago")
 */
export function formatRelativeTime(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) {
      return 'Just now';
    }
    if (diffMinutes === 1) {
      return '1 min ago';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes} mins ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) {
      return '1 hour ago';
    }
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return 'Yesterday';
    }
    return `${diffDays} days ago`;
  } catch {
    return 'Recently';
  }
}

/**
 * Returns an exact formatted timestamp for tooltips and detail views (e.g., "11:45 AM, 29 Oct")
 */
export function formatExactDateTime(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return isoDateString;
  }
}
