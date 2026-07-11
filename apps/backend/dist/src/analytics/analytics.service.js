"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const orders = await this.prisma.order.findMany({
            where: {
                status: { not: 'CANCELLED' },
            },
            include: {
                items: {
                    include: {
                        productVariant: true,
                    },
                },
            },
        });
        const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
        const totalDiscount = orders.reduce((sum, order) => sum + order.discountAmount, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const colorStats = {};
        const sizeStats = {};
        for (const order of orders) {
            for (const item of order.items) {
                const color = item.productVariant.color;
                const size = item.productVariant.size;
                colorStats[color] = (colorStats[color] || 0) + item.quantity;
                sizeStats[size] = (sizeStats[size] || 0) + item.quantity;
            }
        }
        return {
            totalRevenue,
            totalDiscount,
            totalOrders,
            averageOrderValue,
            colorStats: Object.entries(colorStats).map(([color, qty]) => ({ color, qty })),
            sizeStats: Object.entries(sizeStats).map(([size, qty]) => ({ size, qty })),
        };
    }
    async getSalesTrend() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const orders = await this.prisma.order.findMany({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                status: { not: 'CANCELLED' },
            },
            select: {
                createdAt: true,
                finalAmount: true,
            },
            orderBy: { createdAt: 'asc' },
        });
        const dailyData = {};
        for (const order of orders) {
            const dateStr = order.createdAt.toISOString().split('T')[0];
            if (!dailyData[dateStr]) {
                dailyData[dateStr] = { date: dateStr, sales: 0, revenue: 0 };
            }
            dailyData[dateStr].sales += 1;
            dailyData[dateStr].revenue += order.finalAmount;
        }
        return Object.values(dailyData);
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map