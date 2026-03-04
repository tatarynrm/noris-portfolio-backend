import { TranslationsService } from './translations.service';
export declare class TranslationsController {
    private readonly translationsService;
    constructor(translationsService: TranslationsService);
    getMessages(locale: string): Promise<Record<string, unknown>>;
    upsert(data: {
        locale: string;
        key: string;
        value: string;
        namespace?: string;
    }): Promise<{
        created_at: Date;
        updated_at: Date;
        translation_id: string;
        locale: string;
        key: string;
        value: string;
        namespace: string | null;
    }>;
}
