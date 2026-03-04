"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new client_1.PrismaClient();
async function main() {
    const locales = ['en', 'uk', 'pl', 'fr', 'de'];
    const messagesPath = '/Users/noris/Desktop/Noris/SkillsMaster/noris-portfolio/messages';
    for (const locale of locales) {
        const filePath = path.join(messagesPath, `${locale}.json`);
        console.log(`Checking ${filePath}...`);
        if (!fs.existsSync(filePath)) {
            console.log(`File ${filePath} does not exist.`);
            continue;
        }
        const messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const flattenMessages = (obj, prefix = '') => {
            let entries = [];
            for (const [key, value] of Object.entries(obj)) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (typeof value === 'object' && value !== null) {
                    entries = entries.concat(flattenMessages(value, fullKey));
                }
                else {
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
//# sourceMappingURL=seed.js.map