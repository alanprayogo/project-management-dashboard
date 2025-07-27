"use client";

// Client-side date formatting to avoid hydration issues
export function formatDate(
  dateString: string | Date,
  options?: {
    locale?: string;
    format?: "short" | "long" | "medium";
  }
): string {
  if (!dateString) return "";

  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  // Check if date is valid
  if (isNaN(date.getTime())) return "";

  const { locale = "en-US", format = "short" } = options || {};

  try {
    switch (format) {
      case "short":
        return date.toLocaleDateString(locale, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      case "medium":
        return date.toLocaleDateString(locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      case "long":
        return date.toLocaleDateString(locale, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      default:
        return date.toLocaleDateString(locale);
    }
  } catch (error) {
    // Fallback to ISO string if locale formatting fails
    return date.toISOString().split("T")[0];
  }
}

export function formatDateTime(
  dateString: string | Date,
  options?: {
    locale?: string;
    includeTime?: boolean;
  }
): string {
  if (!dateString) return "";

  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) return "";

  const { locale = "en-US", includeTime = true } = options || {};

  try {
    if (includeTime) {
      return date.toLocaleString(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return formatDate(date, { locale });
    }
  } catch (error) {
    return date.toISOString().replace("T", " ").substring(0, 16);
  }
}

export function getRelativeTime(dateString: string | Date): string {
  if (!dateString) return "";

  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(date);
}
