import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

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

    const colorStats: Record<string, number> = {};
    const sizeStats: Record<string, number> = {};

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

    const dailyData: Record<string, { date: string; sales: number; revenue: number }> = {};

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
}
