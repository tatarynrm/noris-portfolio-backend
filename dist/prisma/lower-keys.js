"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting translation key and namespace lowercasing...');
    try {
        const result = await prisma.$executeRaw `UPDATE translation SET key = LOWER(key)`;
        console.log(`Updated translation keys to lowercase. Rows affected: ${result}`);
        const resultNamespace = await prisma.$executeRaw `UPDATE translation SET namespace = LOWER(namespace) WHERE namespace IS NOT NULL`;
        console.log(`Updated namespaces to lowercase. Rows affected: ${resultNamespace}`);
    }
    catch (error) {
        console.error('Error executing raw update:', error);
        console.log('Falling back to iterative update...');
        const translations = await prisma.translation.findMany();
        let skipped = 0;
        let updated = 0;
        for (const t of translations) {
            const lowerKey = t.key.toLowerCase();
            const lowerNamespace = t.namespace ? t.namespace.toLowerCase() : null;
            if (t.key !== lowerKey || t.namespace !== lowerNamespace) {
                try {
                    await prisma.translation.update({
                        where: { translation_id: t.translation_id },
                        data: { key: lowerKey, namespace: lowerNamespace }
                    });
                    updated++;
                }
                catch (e) {
                    console.log(`Skipped duplicate lowercase key for locale ${t.locale}: ${lowerKey}`);
                    skipped++;
                    await prisma.translation.delete({
                        where: { translation_id: t.translation_id }
                    });
                }
            }
        }
        console.log(`Fallback complete. Updated: ${updated}, Skipped (deleted dupes): ${skipped}`);
    }
    console.log('Finished translation lowercasing.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=lower-keys.js.map