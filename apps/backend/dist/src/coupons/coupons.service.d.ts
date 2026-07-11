import { PrismaService } from '../prisma/prisma.service';
export declare class CouponsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        minOrderValue: number;
        expiryDate: Date;
        maxUses: number;
        usedCount: number;
    }[]>;
    create(data: {
        code: string;
        discountType: 'PERCENT' | 'FIXED';
        discountValue: number;
        minOrderValue?: number;
        expiryDate: string;
        maxUses?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        minOrderValue: number;
        expiryDate: Date;
        maxUses: number;
        usedCount: number;
    }>;
    validateCoupon(code: string, orderValue: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        minOrderValue: number;
        expiryDate: Date;
        maxUses: number;
        usedCount: number;
    }>;
    incrementUsedCount(code: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        minOrderValue: number;
        expiryDate: Date;
        maxUses: number;
        usedCount: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        minOrderValue: number;
        expiryDate: Date;
        maxUses: number;
        usedCount: number;
    }>;
}
