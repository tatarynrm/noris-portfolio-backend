import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getAdminMenu() {
        return this.prisma.admin_menu.findMany({
            where: { is_active: true },
            orderBy: { sequence: 'asc' },
        });
    }

    async getAllTranslations() {
        return this.prisma.translation.findMany({
            orderBy: { key: 'asc' },
        });
    }

    // Additional admin methods can be added here
}
