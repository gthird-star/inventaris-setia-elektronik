import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const start = new Date('2026-11-01T09:00:00.000Z');
const end = new Date('2026-12-01T00:00:00.000Z');

function dateFor(day: number, hour: number) {
  return new Date(Date.UTC(2026, 10, day, hour, 0, 0));
}

async function recordMovement(input: {
  productId: number;
  quantity: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  date: Date;
  userId: number;
  supplierId?: number;
  notes: string;
}) {
  const product = await prisma.product.findUnique({ where: { id: input.productId } });
  if (!product) throw new Error(`Product ${input.productId} tidak ditemukan`);

  const delta = input.type === 'IN' ? input.quantity : input.type === 'OUT' ? -input.quantity : input.quantity;
  const nextStock = product.currentStock + delta;
  if (nextStock < 0) return false;

  await prisma.$transaction(async (tx) => {
    const number = `SIM-NOV26-${input.date.getUTCDate().toString().padStart(2, '0')}-${input.productId}-${input.type}`;
    const transaction = await tx.stockTransaction.create({
      data: {
        transactionNumber: number,
        transactionType: input.type,
        transactionDate: input.date,
        supplierId: input.supplierId || null,
        notes: input.notes,
        status: 'confirmed',
        createdById: input.userId,
        confirmedById: input.userId,
        confirmedAt: input.date,
      },
    });
    const item = await tx.stockTransactionItem.create({
      data: {
        transactionId: transaction.id,
        productId: product.id,
        quantity: Math.abs(input.quantity),
        unitCost: product.purchasePrice,
        unitPrice: product.sellingPrice,
        notes: 'Data simulasi November 2026',
      },
    });
    await tx.stockMovement.create({
      data: {
        productId: product.id,
        transactionId: transaction.id,
        transactionItemId: item.id,
        movementType: input.type,
        quantityIn: delta > 0 ? delta : null,
        quantityOut: delta < 0 ? Math.abs(delta) : null,
        balanceBefore: product.currentStock,
        balanceAfter: nextStock,
        createdById: input.userId,
        createdAt: input.date,
      },
    });
    await tx.product.update({ where: { id: product.id }, data: { currentStock: nextStock } });
    await tx.activityLog.create({
      data: {
        userId: input.userId,
        action: input.type === 'ADJUSTMENT' ? 'STOCK_OPNAME' : `STOCK_${input.type}`,
        entityType: 'Product',
        entityId: product.id,
        description: `${input.notes} (${product.currentStock} -> ${nextStock})`,
        createdAt: input.date,
      },
    });
  });
  return true;
}

async function main() {
  const existing = await prisma.stockTransaction.count({ where: { transactionNumber: { startsWith: 'SIM-NOV26-' } } });
  if (existing > 0) {
    console.log(`Simulasi sudah ada: ${existing} transaksi. Tidak ada data baru yang dibuat.`);
    return;
  }

  const [admin, petugas, products, suppliers] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { username: 'admin' } }),
    prisma.user.findUniqueOrThrow({ where: { username: 'petugas' } }),
    prisma.product.findMany({ where: { isActive: true }, orderBy: { id: 'asc' } }),
    prisma.supplier.findMany({ where: { isActive: true }, orderBy: { id: 'asc' } }),
  ]);
  if (!products.length || !suppliers.length) throw new Error('Produk atau pemasok belum tersedia. Jalankan seed terlebih dahulu.');

  let created = 0;
  let skipped = 0;
  for (let day = 1; day <= 30; day += 1) {
    const date = dateFor(day, 10);
    const weekday = date.getUTCDay();

    if ([1, 4].includes(weekday)) {
      for (let index = 0; index < products.length; index += 1) {
        const quantity = 4 + ((day + index * 3) % 8);
        const product = products[index]!;
        const supplier = suppliers[(day + index) % suppliers.length]!;
        if (await recordMovement({ productId: product.id, quantity, type: 'IN', date, userId: admin.id, supplierId: supplier.id, notes: 'Pembelian rutin dari pemasok' })) created += 1;
      }
    }

    if (weekday >= 1 && weekday <= 6) {
      const first = products[(day + 1) % products.length]!;
      const second = products[(day + 3) % products.length]!;
      for (const product of [first, second]) {
        const quantity = 1 + ((day + product.id) % 4);
        if (await recordMovement({ productId: product.id, quantity, type: 'OUT', date: dateFor(day, 15), userId: petugas.id, notes: 'Penjualan harian' })) created += 1;
        else skipped += 1;
      }
    }

    if ([7, 18, 27].includes(day)) {
      const product = products[day % products.length]!;
      if (await recordMovement({ productId: product.id, quantity: 1, type: 'OUT', date: dateFor(day, 16), userId: petugas.id, notes: 'Barang rusak saat pemeriksaan' })) created += 1;
    }

    if (weekday === 0) {
      const product = products[(day + 2) % products.length]!;
      const current = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
      const difference = day % 2 === 0 ? -1 : 1;
      if (current.currentStock + difference >= 0 && await recordMovement({ productId: product.id, quantity: difference, type: 'ADJUSTMENT', date: dateFor(day, 17), userId: admin.id, notes: 'Stock opname mingguan' })) created += 1;
    }
  }

  const totals = await prisma.stockTransaction.groupBy({
    by: ['transactionType'],
    where: { transactionNumber: { startsWith: 'SIM-NOV26-' } },
    _count: { _all: true },
  });
  console.log(JSON.stringify({ period: `${start.toISOString()} - ${end.toISOString()}`, created, skipped, totals }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
