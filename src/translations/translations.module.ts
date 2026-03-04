import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [TranslationsService, PrismaService],
  controllers: [TranslationsController],
  exports: [TranslationsService],
})
export class TranslationsModule {}
