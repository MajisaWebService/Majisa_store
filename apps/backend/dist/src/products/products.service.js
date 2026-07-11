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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(categoryId, search, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            isActive: true,
        };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: { variants: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
            include: {
                variants: true,
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: { name: true },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async create(data) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                basePrice: data.basePrice,
                imageUrl: data.imageUrl,
                categoryId: data.categoryId,
                variants: {
                    create: data.variants.map((v) => ({
                        color: v.color,
                        size: v.size,
                        price: v.price !== undefined ? v.price : data.basePrice,
                        stock: v.stock,
                        sku: v.sku,
                    })),
                },
            },
            include: { variants: true },
        });
    }
    async update(id, data) {
        await this.findOne(id);
        const { variants, ...productData } = data;
        const updated = await this.prisma.product.update({
            where: { id },
            data: productData,
            include: { variants: true },
        });
        if (variants && Array.isArray(variants)) {
            for (const v of variants) {
                if (v.id) {
                    await this.prisma.productVariant.update({
                        where: { id: v.id },
                        data: {
                            price: v.price,
                            stock: v.stock,
                            sku: v.sku,
                        },
                    });
                }
                else {
                    await this.prisma.productVariant.create({
                        data: {
                            productId: id,
                            color: v.color,
                            size: v.size,
                            price: v.price !== undefined ? v.price : updated.basePrice,
                            stock: v.stock,
                            sku: v.sku,
                        },
                    });
                }
            }
        }
        return this.prisma.product.findUnique({
            where: { id },
            include: { variants: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map