import { PrismaService } from '../prisma/prisma.service';
export declare class TranslationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMessages(locale: string): Promise<Record<string, unknown>>;
    upsertTranslation(locale: string, key: string, value: string, namespace?: string): Promise<{
        translation_id: string;
        locale: string;
        key: string;
        value: string;
        namespace: string | null;
        created_at: Date;
        updated_at: Date;
    }>;
    upsertBulk(translations: {
        locale: string;
        key: string;
        value: string;
        namespace?: string;
    }[]): Promise<{
        translation_id: string;
        locale: string;
        key: string;
        value: string;
        namespace: string | null;
        created_at: Date;
        updated_at: Date;
    }[]>;
}
