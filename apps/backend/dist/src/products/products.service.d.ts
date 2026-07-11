import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(categoryId?: string, search?: string, page?: number, limit?: number): Promise<{
        items: ({
            variants: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                color: string;
                size: string;
                price: number;
                stock: number;
                sku: string;
                productId: string;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string;
            basePrice: number;
            imageUrl: string;
            isActive: boolean;
            categoryId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
        };
        reviews: ({
            user: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            userId: string;
            rating: number;
            comment: string;
        })[];
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            size: string;
            price: number;
            stock: number;
            sku: string;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string;
        basePrice: number;
        imageUrl: string;
        isActive: boolean;
        categoryId: string;
    }>;
    create(data: {
        name: string;
        description: string;
        basePrice: number;
        imageUrl: string;
        categoryId: string;
        variants: Array<{
            color: string;
            size: string;
            price?: number;
            stock: number;
            sku: string;
        }>;
    }): Promise<{
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            size: string;
            price: number;
            stock: number;
            sku: string;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string;
        basePrice: number;
        imageUrl: string;
        isActive: boolean;
        categoryId: string;
    }>;
    update(id: string, data: any): Promise<{
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
            size: string;
            price: number;
            stock: number;
            sku: string;
            productId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string;
        basePrice: number;
        imageUrl: string;
        isActive: boolean;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string;
        basePrice: number;
        imageUrl: string;
        isActive: boolean;
        categoryId: string;
    }>;
}
