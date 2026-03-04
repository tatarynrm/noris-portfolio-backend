import { PrismaService } from '../prisma/prisma.service';
import { user } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<user | null>;
    findById(user_id: string): Promise<user | null>;
    findByGoogleId(google_id: string): Promise<user | null>;
    create(data: {
        email: string;
        password?: string;
        name?: string;
        picture?: string;
        google_id?: string;
    }): Promise<user>;
    findOrCreate(profile: {
        id: string;
        emails: {
            value: string;
        }[];
        displayName?: string;
        photos?: {
            value: string;
        }[];
    }): Promise<user>;
    findByResetToken(token: string): Promise<user | null>;
    updateResetToken(userId: string, token: string | null, expires: Date | null): Promise<user>;
    updatePassword(userId: string, password?: string): Promise<user>;
    findAll(): Promise<user[]>;
    update(userId: string, data: Partial<user>): Promise<user>;
}
