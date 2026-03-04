import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        user_id: string;
        email: string;
        google_id: string | null;
        password_reset_token: string | null;
        name: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        picture: string | null;
        password_reset_expires: Date | null;
        created_at: Date;
        updated_at: Date;
    }[]>;
    update(id: string, data: any): Promise<{
        user_id: string;
        email: string;
        google_id: string | null;
        password_reset_token: string | null;
        name: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        picture: string | null;
        password_reset_expires: Date | null;
        created_at: Date;
        updated_at: Date;
    }>;
}
