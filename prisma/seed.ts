import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const locales = ['en', 'uk', 'pl', 'fr', 'de'];
  // Using absolute path for messages
  const messagesPath = '/Users/noris/Desktop/Noris/SkillsMaster/noris-portfolio/messages';

  for (const locale of locales) {
    const filePath = path.join(messagesPath, `${locale}.json`);
    console.log(`Checking ${filePath}...`);
    if (!fs.existsSync(filePath)) {
      console.log(`File ${filePath} does not exist.`);
      continue;
    }

    const messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const flattenMessages = (obj: any, prefix = '') => {
      let entries: { key: string; value: string }[] = [];
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          entries = entries.concat(flattenMessages(value, fullKey));
        } else {
          entries.push({ key: fullKey, value: String(value) });
        }
      }
      return entries;
    };

    const entries = flattenMessages(messages);
    console.log(`Seeding ${locale} with ${entries.length} entries...`);

    for (const entry of entries) {
      await prisma.translation.upsert({
        where: {
          locale_key: { locale, key: entry.key },
        },
        update: { value: entry.value },
        create: { locale, key: entry.key, value: entry.value },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
