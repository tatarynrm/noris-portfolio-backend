import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getMenu(): Promise<{
        created_at: Date;
        updated_at: Date;
        menu_id: string;
        title: string;
        link: string;
        icon: string | null;
        sequence: number;
        is_active: boolean;
    }[]>;
    getTranslations(): Promise<{
        created_at: Date;
        updated_at: Date;
        translation_id: string;
        locale: string;
        key: string;
        value: string;
        namespace: string | null;
    }[]>;
}
