import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CouponsService } from '../coupons/coupons.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private couponsService: CouponsService,
  ) {}

  async createOrder(userId: string | null, data: {
    cartId: string;
    fullName: string;
    email: string;
    phone: string;
    shippingAddress: string;
    city: string;
    state: string;
    zipCode: string;
    couponCode?: string;
  }) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: data.cartId },
      include: {
        items: {
          include: {
            productVariant: { include: { product: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty or does not exist');
    }

    for (const item of cart.items) {
      if (item.productVariant.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product variant: ${item.productVariant.product.name} (${item.productVariant.color} / ${item.productVariant.size})`,
        );
      }
    }

    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += item.productVariant.price * item.quantity;
    }

    let discountAmount = 0;
    let coupon = null;
    if (data.couponCode) {
      coupon = await this.couponsService.validateCoupon(data.couponCode, totalAmount);
      if (coupon.discountType === 'PERCENT') {
        discountAmount = Math.round((totalAmount * coupon.discountValue) / 100);
      } else {
        discountAmount = Math.min(coupon.discountValue, totalAmount);
      }
    }

    const finalAmount = totalAmount - discountAmount;

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          totalAmount,
          discountAmount,
          finalAmount,
          couponCode: data.couponCode || null,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          shippingAddress: data.shippingAddress,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          items: {
            create: cart.items.map((item) => ({
              productVariantId: item.productVariantId,
              customDesignId: item.customDesignId,
              quantity: item.quantity,
              price: item.productVariant.price,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (data.couponCode) {
        await tx.coupon.update({
          where: { code: data.couponCode.toUpperCase() },
          data: { usedCount: { increment: 1 } },
        });
      }

      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: finalAmount,
          status: 'COMPLETED',
          provider: 'SIMULATED',
          transactionId: `TX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      });

      await tx.cartItem.deleteMany({
        where: { cartId: data.cartId },
      });

      return order;
    });
  }

  async findOne(id: string, userId?: string | null) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            productVariant: { include: { product: true } },
            customDesign: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userId && order.userId !== userId) {
      throw new BadRequestException('Unauthorized access to order');
    }

    return order;
  }

  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            productVariant: { include: { product: true } },
            customDesign: true,
          },
        },
      },
    });
  }

  async findAllOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            productVariant: { include: { product: true } },
            customDesign: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus, trackingNumber?: string) {
    const data: any = { status };
    if (trackingNumber) {
      data.trackingNumber = trackingNumber;
    }
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }
}
