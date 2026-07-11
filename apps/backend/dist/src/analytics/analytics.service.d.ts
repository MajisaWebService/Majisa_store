import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalRevenue: number;
        totalDiscount: number;
        totalOrders: number;
        averageOrderValue: number;
        colorStats: {
            color: string;
            qty: number;
        }[];
        sizeStats: {
            size: string;
            qty: number;
        }[];
    }>;
    getSalesTrend(): Promise<{
        date: string;
        sales: number;
        revenue: number;
    }[]>;
}
