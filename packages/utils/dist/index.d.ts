import { TShirtColor, TShirtSize } from '@majistyle/types';
export declare function formatPrice(amount: number): string;
export declare function generateSKU(productName: string, color: TShirtColor, size: TShirtSize): string;
export declare function validateEmail(email: string): boolean;
export declare function calculateDiscount(orderTotal: number, discountType: 'PERCENT' | 'FIXED', discountValue: number): number;
//# sourceMappingURL=index.d.ts.map