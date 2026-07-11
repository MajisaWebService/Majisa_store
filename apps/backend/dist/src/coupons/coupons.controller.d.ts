import { CouponsService } from './coupons.service';
export declare class CouponsController {
    private couponsService;
    constructor(couponsService: CouponsService);
    validate(code: string, orderValue: string): Promise<{
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
    create(data: any): Promise<{
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
