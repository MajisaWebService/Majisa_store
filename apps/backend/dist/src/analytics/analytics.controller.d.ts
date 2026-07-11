import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
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
