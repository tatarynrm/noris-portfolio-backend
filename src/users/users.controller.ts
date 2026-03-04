import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(UserRole.admin)
    async findAll() {
        const users = await this.usersService.findAll();
        // Strip passwords before sending
        return users.map(({ password, ...user }) => user);
    }

    @Patch(':id')
    @Roles(UserRole.admin)
    async update(@Param('id') id: string, @Body() data: any) {
        const user = await this.usersService.update(id, data);
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
