import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
    ) { }

    async create(data: {
        name: string;
        email: string;
        phone: string;
        interest: string;
        dynamicField?: string;
        projectDetails: string;
    }) {
        const message = await this.prisma.contact_message.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                interest: data.interest,
                dynamic_field: data.dynamicField,
                project_details: data.projectDetails,
            },
        });

        // Notify admin via email
        await this.mailService.sendContactNotification(data);

        return message;
    }
}
