import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a USD price to Indian Rupees with ₹ symbol
 * Conversion: 1 USD ≈ ₹83
 * Uses Indian number formatting (e.g. ₹4,149, ₹1,24,900)
 */
export function toINR(usd: number, perMonth = false): string {
  const inr = Math.round(usd * 83);
  // Indian lakh formatting
  const formatted = new Intl.NumberFormat("en-IN").format(inr);
  return `₹${formatted}${perMonth ? "/mo" : ""}`;
}

/**
 * Format a raw INR amount (no conversion needed)
 */
export function formatINR(inr: number, perMonth = false): string {
  const formatted = new Intl.NumberFormat("en-IN").format(Math.round(inr));
  return `₹${formatted}${perMonth ? "/mo" : ""}`;
}
