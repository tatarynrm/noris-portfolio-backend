import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getAdminMenu(): Promise<{
        created_at: Date;
        updated_at: Date;
        menu_id: string;
        title: string;
        link: string;
        icon: string | null;
        sequence: number;
        is_active: boolean;
    }[]>;
    getAllTranslations(): Promise<{
        created_at: Date;
        updated_at: Date;
        translation_id: string;
        locale: string;
        key: string;
        value: string;
        namespace: string | null;
    }[]>;
}
