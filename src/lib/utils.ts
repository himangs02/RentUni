import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseImages(imagesField: string | string[] | null | undefined): string[] {
  if (!imagesField) {
    return ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'];
  }
  if (Array.isArray(imagesField)) {
    return imagesField;
  }
  try {
    const parsed = JSON.parse(imagesField);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // If not JSON, try comma separated
    const parts = imagesField.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts;
  }
  return [imagesField];
}

export function calculateRentalDays(start: Date | string, end: Date | string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const diffMs = Math.max(0, e - s);
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

export function calculateDaysRemaining(endDate: Date | string): {
  days: number;
  isOverdue: boolean;
  label: string;
} {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const diffMs = end - now;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return {
      days: Math.abs(days),
      isOverdue: true,
      label: `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'}`,
    };
  } else if (days === 0) {
    return {
      days: 0,
      isOverdue: false,
      label: 'Due Today',
    };
  } else {
    return {
      days,
      isOverdue: false,
      label: `${days} day${days === 1 ? '' : 's'} left`,
    };
  }
}
