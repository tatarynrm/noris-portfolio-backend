import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 1. Create Admin User
    const adminEmail = 'tatarynrm@gmail.com';
    const hashedPassword = await bcrypt.hash('Aa527465182@@@', 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: UserRole.admin },
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Super Admin',
            role: UserRole.admin,
        },
    });

    console.log(`Admin user created/updated: ${admin.email}`);

    // 2. Seed Admin Menu
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

    // 3. Seed Project Statuses
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
