import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('menu')
    async getMenu() {
        return this.adminService.getAdminMenu();
    }

    @Get('translations')
    async getTranslations() {
        return this.adminService.getAllTranslations();
    }
}
