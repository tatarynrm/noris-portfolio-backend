import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationsModule } from './translations/translations.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TranslationsModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    AdminModule,
    ContactModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
