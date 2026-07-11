import { ProductsService } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(categoryId?: string, search?: string, page?: string, limit?: string): Promise<{
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
    create(data: any): Promise<{
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
