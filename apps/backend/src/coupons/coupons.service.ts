import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    code: string;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
    minOrderValue?: number;
    expiryDate: string;
    maxUses?: number;
  }) {
    const code = data.code.toUpperCase();
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      throw new BadRequestException('Coupon code already exists');
    }

    return this.prisma.coupon.create({
      data: {
        code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderValue: data.minOrderValue || 0,
        expiryDate: new Date(data.expiryDate),
        maxUses: data.maxUses || 100,
        usedCount: 0,
        isActive: true,
      },
    });
  }

  async validateCoupon(code: string, orderValue: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException('Invalid or inactive coupon');
    }

    if (coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      throw new BadRequestException('Coupon has expired');
    }

    if (orderValue < coupon.minOrderValue) {
      throw new BadRequestException(`Minimum order value of INR ${coupon.minOrderValue} required for this coupon`);
    }

    return coupon;
  }

  async incrementUsedCount(code: string) {
    return this.prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: { usedCount: { increment: 1 } },
    });
  }

  async remove(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }
}
