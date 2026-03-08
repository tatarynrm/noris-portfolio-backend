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
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'tatarynrm@gmail.com';
    const hashedPassword = await bcrypt.hash('Aa527465182@@@', 10);
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: client_1.UserRole.admin },
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Super Admin',
            role: client_1.UserRole.admin,
        },
    });
    console.log(`Admin user created/updated: ${admin.email}`);
    const menuItems = [
        { title: 'Dashboard', link: '/admin', icon: 'LayoutDashboard', sequence: 1 },
        { title: 'Translations', link: '/admin/translations', icon: 'Languages', sequence: 2 },
        { title: 'Users', link: '/admin/users', icon: 'Users', sequence: 3 },
        { title: 'Projects', link: '/admin/projects', icon: 'Briefcase', sequence: 4 },
    ];
    for (const item of menuItems) {
        await prisma.admin_menu.upsert({
            where: { menu_id: item.title.toLowerCase().replace(' ', '_') },
            update: { ...item },
            create: {
                menu_id: item.title.toLowerCase().replace(' ', '_'),
                ...item
            },
        });
    }
    console.log('Admin menu items seeded.');
    const statuses = [
        { name: 'Planning', color: '#94a3b8' },
        { name: 'In Progress', color: '#3b82f6' },
        { name: 'Completed', color: '#10b981' },
        { name: 'On Hold', color: '#f59e0b' },
        { name: 'Cancelled', color: '#ef4444' },
    ];
    for (const status of statuses) {
        await prisma.project_status.upsert({
            where: { name: status.name },
            update: { color: status.color },
            create: { ...status },
        });
    }
    console.log('Project statuses seeded.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-admin.js.map