import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TranslationsService {
  constructor(private prisma: PrismaService) { }

  async getMessages(locale: string) {
    const translations = await this.prisma.translation.findMany({
      where: { locale },
    });

    const messages: Record<string, unknown> = {};
    translations.forEach((t) => {
      const keys = t.key.split('.');
      let current = messages;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = t.value;
        } else {
          current[key] = (current[key] || {}) as Record<string, unknown>;
          current = current[key] as Record<string, unknown>;
        }
      });
    });

    return messages;
  }

  async upsertTranslation(
    locale: string,
    key: string,
    value: string,
    namespace?: string,
  ) {
    return this.prisma.translation.upsert({
      where: {
        locale_key: { locale, key },
      },
      update: { value, namespace },
      create: { locale, key, value, namespace },
    });
  }

  async upsertBulk(translations: { locale: string; key: string; value: string; namespace?: string }[]) {
    return this.prisma.$transaction(
      translations.map((t) =>
        this.prisma.translation.upsert({
          where: { locale_key: { locale: t.locale, key: t.key } },
          update: { value: t.value, namespace: t.namespace },
          create: { locale: t.locale, key: t.key, value: t.value, namespace: t.namespace },
        }),
      ),
    );
  }
}
