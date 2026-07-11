import { TShirtColor, TShirtSize } from '@majistyle/types';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateSKU(productName: string, color: TShirtColor, size: TShirtSize): string {
  const prefix = productName.slice(0, 3).toUpperCase();
  return `${prefix}-${color.slice(0, 3)}-${size}-${Math.floor(100 + Math.random() * 900)}`;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function calculateDiscount(orderTotal: number, discountType: 'PERCENT' | 'FIXED', discountValue: number): number {
  if (discountType === 'PERCENT') {
    return Math.round((orderTotal * discountValue) / 100);
  }
  return Math.min(discountValue, orderTotal);
}
