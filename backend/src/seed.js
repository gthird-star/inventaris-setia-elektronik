import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
    // ensure demo admin user
    const passwordHash = await bcrypt.hash('12345678', 10);
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: { passwordHash, isActive: true, role: 'admin' },
        create: {
            name: 'Admin',
            username: 'admin',
            email: 'admin@example.com',
            passwordHash,
            role: 'admin',
            isActive: true,
        },
    });
    await prisma.user.upsert({
        where: { username: 'petugas' },
        update: { passwordHash: await bcrypt.hash('petugas123', 10), isActive: true, role: 'petugas' },
        create: {
            name: 'Petugas Toko',
            username: 'petugas',
            email: 'petugas@example.com',
            passwordHash: await bcrypt.hash('petugas123', 10),
            role: 'petugas',
            isActive: true,
        },
    });
    const categories = [
        { name: 'Peralatan Listrik', description: 'Saklar, stop kontak, terminal, dan kipas.' },
        { name: 'Lampu', description: 'Lampu LED, TL, dan downlight.' },
        { name: 'Kabel', description: 'Kabel listrik, HDMI, dan kabel roll.' },
        { name: 'Aksesori', description: 'Baterai, remote, dan perlengkapan kecil.' },
        { name: 'Audio/Video', description: 'Speaker, headphone, dan perangkat hiburan.' },
        { name: 'Peralatan Rumah Tangga', description: 'Rice cooker, blender, dan setrika.' },
    ];
    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: { description: category.description },
            create: category,
        });
    }
    // suppliers
    const suppliers = [
        { code: 'SUP001', name: 'Supplier A' },
        { code: 'SUP002', name: 'Supplier B' },
        { code: 'SUP003', name: 'Supplier C' },
    ];
    for (const s of suppliers) {
        await prisma.supplier.upsert({
            where: { code: s.code },
            update: {},
            create: { ...s },
        });
    }
    await prisma.product.deleteMany();
    const cats = await prisma.category.findMany();
    const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));
    // products demo data
    const products = [
        { sku: 'PROD001', name: 'Kabel NYM 2.5mm²', category: 'Kabel', unit: 'pcs', purchasePrice: 5000, sellingPrice: 7000, minimumStock: 10 },
        { sku: 'PROD002', name: 'Lampu LED 9W', category: 'Lampu', unit: 'pcs', purchasePrice: 8000, sellingPrice: 12000, minimumStock: 5 },
        { sku: 'PROD003', name: 'Stop Kontak 2 lubang', category: 'Peralatan Listrik', unit: 'pcs', purchasePrice: 15000, sellingPrice: 20000, minimumStock: 8 },
        { sku: 'PROD004', name: 'Kipas Angin 12"', category: 'Peralatan Listrik', unit: 'pcs', purchasePrice: 120000, sellingPrice: 150000, minimumStock: 3 },
        { sku: 'PROD005', name: 'Rice Cooker 2L', category: 'Peralatan Rumah Tangga', unit: 'pcs', purchasePrice: 250000, sellingPrice: 300000, minimumStock: 4 },
        { sku: 'PROD006', name: 'Headphone Bluetooth', category: 'Audio/Video', unit: 'pcs', purchasePrice: 500000, sellingPrice: 650000, minimumStock: 2 },
    ];
    for (const p of products) {
        await prisma.product.upsert({
            where: { sku: p.sku },
            update: {
                name: p.name,
                categoryId: catMap[p.category] ?? 0,
                unit: p.unit,
                purchasePrice: p.purchasePrice,
                sellingPrice: p.sellingPrice,
                minimumStock: p.minimumStock,
                currentStock: Math.floor(Math.random() * 100),
            },
            create: {
                sku: p.sku,
                name: p.name,
                categoryId: catMap[p.category] ?? 0,
                unit: p.unit,
                purchasePrice: p.purchasePrice,
                sellingPrice: p.sellingPrice,
                minimumStock: p.minimumStock,
                currentStock: Math.floor(Math.random() * 100),
                isActive: true,
            },
        });
    }
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map