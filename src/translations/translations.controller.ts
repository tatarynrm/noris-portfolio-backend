import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) { }

  @Get(':locale')
  async getMessages(@Param('locale') locale: string) {
    return this.translationsService.getMessages(locale);
  }

  @Post('upsert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  async upsert(@Body() data: { locale: string; key: string; value: string; namespace?: string }) {
    return this.translationsService.upsertTranslation(data.locale, data.key, data.value, data.namespace);
  }
}
