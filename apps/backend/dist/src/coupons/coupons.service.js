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
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CouponsService = class CouponsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(data) {
        const code = data.code.toUpperCase();
        const existing = await this.prisma.coupon.findUnique({ where: { code } });
        if (existing) {
            throw new common_1.BadRequestException('Coupon code already exists');
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
    async validateCoupon(code, orderValue) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (!coupon || !coupon.isActive) {
            throw new common_1.BadRequestException('Invalid or inactive coupon');
        }
        if (coupon.usedCount >= coupon.maxUses) {
            throw new common_1.BadRequestException('Coupon usage limit reached');
        }
        if (new Date() > new Date(coupon.expiryDate)) {
            throw new common_1.BadRequestException('Coupon has expired');
        }
        if (orderValue < coupon.minOrderValue) {
            throw new common_1.BadRequestException(`Minimum order value of INR ${coupon.minOrderValue} required for this coupon`);
        }
        return coupon;
    }
    async incrementUsedCount(code) {
        return this.prisma.coupon.update({
            where: { code: code.toUpperCase() },
            data: { usedCount: { increment: 1 } },
        });
    }
    async remove(id) {
        return this.prisma.coupon.delete({ where: { id } });
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map