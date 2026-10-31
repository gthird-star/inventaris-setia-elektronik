import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const prefix = 'REAL-OCT26-';

const products = [
  ['KBL-NYM-2X15', 'Kabel NYM 2 x 1.5mm', 'Kabel', 'meter', 4200, 6500, 30, 40],
  ['KBL-NYM-2X25', 'Kabel NYM 2 x 2.5mm', 'Kabel', 'meter', 6800, 9500, 24, 35],
  ['KBL-ROL-15', 'Kabel Roll 15 Meter', 'Kabel', 'roll', 85000, 115000, 6, 2],
  ['KBL-HDMI-15', 'Kabel HDMI 1.5 Meter', 'Kabel', 'pcs', 28000, 45000, 10, 16],
  ['LMP-LED-9', 'Lampu LED 9 Watt', 'Lampu', 'pcs', 8500, 13000, 20, 30],
  ['LMP-LED-12', 'Lampu LED 12 Watt', 'Lampu', 'pcs', 10500, 16000, 20, 25],
  ['LMP-LED-18', 'Lampu LED 18 Watt', 'Lampu', 'pcs', 17500, 26000, 12, 0],
  ['LMP-TUBE-20', 'Lampu TL LED 20 Watt', 'Lampu', 'pcs', 32000, 48000, 8, 15],
  ['LMP-DOWN-7', 'Lampu Downlight 7 Watt', 'Lampu', 'pcs', 22000, 35000, 10, 18],
  ['STK-2LUB', 'Stop Kontak 2 Lubang', 'Peralatan Listrik', 'pcs', 14500, 22000, 15, 25],
  ['STK-4LUB', 'Stop Kontak 4 Lubang', 'Peralatan Listrik', 'pcs', 25000, 38000, 12, 20],
  ['STK-EXT-5', 'Terminal Kabel 5 Meter', 'Peralatan Listrik', 'pcs', 38000, 55000, 8, 15],
  ['SAK-1WAY', 'Saklar Tunggal', 'Peralatan Listrik', 'pcs', 9000, 15000, 15, 25],
  ['SAK-2WAY', 'Saklar Seri', 'Peralatan Listrik', 'pcs', 14000, 22000, 12, 0],
  ['FAN-12', 'Kipas Angin 12 Inch', 'Peralatan Listrik', 'unit', 125000, 165000, 4, 8],
  ['FAN-16', 'Kipas Angin 16 Inch', 'Peralatan Listrik', 'unit', 185000, 235000, 3, 7],
  ['RC-18', 'Rice Cooker 1.8 Liter', 'Peralatan Rumah Tangga', 'unit', 235000, 295000, 4, 7],
  ['RC-2L', 'Rice Cooker 2 Liter', 'Peralatan Rumah Tangga', 'unit', 285000, 355000, 3, 8],
  ['BLD-500', 'Blender 500 ml', 'Peralatan Rumah Tangga', 'unit', 175000, 225000, 3, 8],
  ['SETRIKA-350', 'Setrika 350 Watt', 'Peralatan Rumah Tangga', 'unit', 135000, 175000, 4, 10],
  ['SPK-BT', 'Speaker Bluetooth Mini', 'Audio/Video', 'unit', 95000, 145000, 5, 9],
  ['HD-BT', 'Headphone Bluetooth', 'Audio/Video', 'unit', 155000, 225000, 5, 0],
  ['REM-UNIV', 'Remote TV Universal', 'Aksesori', 'pcs', 18000, 30000, 10, 15],
  ['BAT-AA', 'Baterai AA Isi 2', 'Aksesori', 'pack', 12000, 18000, 20, 30],
] as const;

const suppliers = [
  { code: 'SUP001', name: 'CV Sinar Elektrik' },
  { code: 'SUP002', name: 'PT Cahaya Nusantara' },
  { code: 'SUP003', name: 'Toko Grosir Makmur' },
  { code: 'SUP004', name: 'UD Berkah Elektronik' },
];

function date(day: number, hour: number) {
  return new Date(2026, 9, day, hour, 0, 0);
}

async function main() {
  const categoriesWithDescriptions = [
    ['Peralatan Listrik', 'Saklar, stop kontak, terminal, dan kipas.'],
    ['Lampu', 'Lampu LED, TL, dan downlight.'],
    ['Kabel', 'Kabel listrik, HDMI, dan kabel roll.'],
    ['Aksesori', 'Baterai, remote, dan perlengkapan kecil.'],
    ['Audio/Video', 'Speaker, headphone, dan perangkat hiburan.'],
    ['Peralatan Rumah Tangga', 'Rice cooker, blender, dan setrika.'],
  ] as const;
  const categoryNames = categoriesWithDescriptions.map(([name]) => name);
  for (const [name, description] of categoriesWithDescriptions) await prisma.category.upsert({ where: { name }, update: { description, isActive: true }, create: { name, description } });
  for (const supplier of suppliers) await prisma.supplier.upsert({ where: { code: supplier.code }, update: { name: supplier.name, isActive: true }, create: supplier });

  const categories = await prisma.category.findMany({ where: { name: { in: categoryNames } } });
  const categoryByName = new Map(categories.map((category) => [category.name, category.id]));
  const supplier = await prisma.supplier.findUniqueOrThrow({ where: { code: 'SUP001' } });
  const user = await prisma.user.findUniqueOrThrow({ where: { username: 'admin' } });
  const existing = await prisma.stockTransaction.count({ where: { transactionNumber: { startsWith: prefix } } });
  if (existing > 0) {
    for (const [sku, , , , , , , finalStock] of products) {
      await prisma.product.update({ where: { sku }, data: { currentStock: finalStock } });
    }
    console.log(`Stok akhir data REAL-OCT26 disegarkan: ${products.filter((product) => product[7] <= product[6]).length} stok rendah, ${products.filter((product) => product[7] === 0).length} stok habis.`);
    return;
  }

  for (const [sku, name, category, unit, purchasePrice, sellingPrice, minimumStock, finalStock] of products) {
    const product = await prisma.product.upsert({
      where: { sku },
      update: { name, categoryId: categoryByName.get(category)!, unit, purchasePrice, sellingPrice, minimumStock, currentStock: 0, isActive: true },
      create: { sku, name, categoryId: categoryByName.get(category)!, unit, purchasePrice, sellingPrice, minimumStock, currentStock: 0, isActive: true },
    });
    const sold = Math.max(6, Math.floor(minimumStock * 1.5));
    const received = finalStock + sold;
    await prisma.$transaction(async (tx) => {
      const inbound = await tx.stockTransaction.create({
        data: { transactionNumber: `${prefix}IN-${sku}`, transactionType: 'IN', transactionDate: date(2 + (product.id % 10), 9), supplierId: supplier.id, notes: 'Penerimaan stok awal periode', status: 'confirmed', createdById: user.id },
      });
      const inboundItem = await tx.stockTransactionItem.create({
        data: { transactionId: inbound.id, productId: product.id, quantity: received, unitCost: purchasePrice, unitPrice: sellingPrice },
      });
      await tx.stockMovement.create({
        data: { productId: product.id, transactionId: inbound.id, transactionItemId: inboundItem.id, movementType: 'IN', quantityIn: received, quantityOut: null, balanceBefore: 0, balanceAfter: received, createdById: user.id },
      });
      const outbound = await tx.stockTransaction.create({
        data: { transactionNumber: `${prefix}OUT-${sku}`, transactionType: 'OUT', transactionDate: date(18 + (product.id % 10), 15), notes: 'Penjualan toko selama periode berjalan', status: 'confirmed', createdById: user.id },
      });
      const outboundItem = await tx.stockTransactionItem.create({
        data: { transactionId: outbound.id, productId: product.id, quantity: sold, unitCost: purchasePrice, unitPrice: sellingPrice },
      });
      await tx.stockMovement.create({
        data: { productId: product.id, transactionId: outbound.id, transactionItemId: outboundItem.id, movementType: 'OUT', quantityIn: null, quantityOut: sold, balanceBefore: received, balanceAfter: finalStock, createdById: user.id },
      });
      await tx.product.update({ where: { id: product.id }, data: { currentStock: finalStock } });
    });
  }
  console.log(`Data lapangan berhasil dibuat: ${products.length} produk, ${products.filter((product) => product[7] <= product[6]).length} stok rendah, ${products.filter((product) => product[7] === 0).length} stok habis.`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());
