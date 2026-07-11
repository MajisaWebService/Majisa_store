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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const coupons_service_1 = require("../coupons/coupons.service");
let OrdersService = class OrdersService {
    prisma;
    couponsService;
    constructor(prisma, couponsService) {
        this.prisma = prisma;
        this.couponsService = couponsService;
    }
    async createOrder(userId, data) {
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
            throw new common_1.BadRequestException('Cart is empty or does not exist');
        }
        for (const item of cart.items) {
            if (item.productVariant.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product variant: ${item.productVariant.product.name} (${item.productVariant.color} / ${item.productVariant.size})`);
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
            }
            else {
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        if (userId && order.userId !== userId) {
            throw new common_1.BadRequestException('Unauthorized access to order');
        }
        return order;
    }
    async findUserOrders(userId) {
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
    async updateStatus(id, status, trackingNumber) {
        const data = { status };
        if (trackingNumber) {
            data.trackingNumber = trackingNumber;
        }
        return this.prisma.order.update({
            where: { id },
            data,
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        coupons_service_1.CouponsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map