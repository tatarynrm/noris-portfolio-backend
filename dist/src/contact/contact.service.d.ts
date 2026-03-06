import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class ContactService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    create(data: {
        name: string;
        email: string;
        phone: string;
        interest: string;
        dynamicField?: string;
        projectDetails: string;
    }): Promise<{
        email: string;
        name: string;
        created_at: Date;
        updated_at: Date;
        message_id: string;
        phone: string;
        interest: string;
        dynamic_field: string | null;
        project_details: string;
        status: string;
    }>;
}
