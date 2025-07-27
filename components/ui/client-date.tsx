"use client";

import { useEffect, useState } from "react";
import { formatDate, formatDateTime, getRelativeTime } from '../../lib/date-utils';


interface ClientDateProps {
  date: string | Date;
  format?: "short" | "medium" | "long" | "relative" | "datetime";
  locale?: string;
  className?: string;
  fallback?: string;
}

export function ClientDate({
  date,
  format = "short",
  locale = "en-US",
  className,
  fallback = "--",
}: ClientDateProps) {
  const [mounted, setMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState(fallback);

  useEffect(() => {
    setMounted(true);

    if (!date) {
      setFormattedDate(fallback);
      return;
    }

    try {
      let formatted: string;

      switch (format) {
        case "relative":
          formatted = getRelativeTime(date);
          break;
        case "datetime":
          formatted = formatDateTime(date, { locale });
          break;
        default:
          formatted = formatDate(date, { locale, format });
          break;
      }

      setFormattedDate(formatted);
    } catch (error) {
      console.warn("Date formatting error:", error);
      setFormattedDate(fallback);
    }
  }, [date, format, locale, fallback]);

  // Show fallback during SSR and initial hydration
  if (!mounted) {
    return <span className={className}>{fallback}</span>;
  }

  return <span className={className}>{formattedDate}</span>;
}
