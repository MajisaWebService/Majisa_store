import { CustomDesignsService } from './custom-designs.service';
export declare class CustomDesignsController {
    private customDesignsService;
    constructor(customDesignsService: CustomDesignsService);
    create(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        baseProductId: string;
        selectedColor: string;
        selectedSize: string;
        config: import("@prisma/client/runtime/library").JsonValue;
        previewUrl: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        baseProductId: string;
        selectedColor: string;
        selectedSize: string;
        config: import("@prisma/client/runtime/library").JsonValue;
        previewUrl: string;
    }>;
    uploadFile(file: any): Promise<{
        url: string;
    }>;
}
