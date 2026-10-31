import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

// auth middleware
function auth(requiredRoles?: string | string[]) {
  return (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      req.user = payload;
      const roles = requiredRoles ? (Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]) : [];
      if (roles.length && !roles.includes(payload.role)) return res.status(403).json({ error: 'Forbidden' });
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// login
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok || !user.isActive) return res.status(401).json({ error: 'Invalid credentials' });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const token = jwt.sign({ id: user.id, name: user.name, username: user.username, role: user.role }, process.env.JWT_SECRET || 'secret');
  res.json({ token, user: { id: user.id, name: user.name, username: user.username, role: user.role } });
});

app.get('/', (req, res) => res.json({ status: 'ok' }));
app.get('/health', (req, res) => res.json({ uptime: process.uptime() }));

// product routes (admin only)
app.get('/products', auth(['admin', 'petugas']), async (req, res) => {
  const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  res.json(products);
});
app.post(
  '/products',
  auth('admin'),
  body('sku').isString(),
  body('name').isString(),
  body('categoryId').isInt(),
  body('unit').isString(),
  body('purchasePrice').isFloat(),
  body('sellingPrice').isFloat(),
  async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { sku, name, categoryId, unit, purchasePrice, sellingPrice, minimumStock } = req.body;
    try {
      const product = await prisma.product.create({
        data: { sku, name, categoryId, unit, purchasePrice, sellingPrice, minimumStock, currentStock: 0 },
      });
      res.status(201).json(product);
    } catch (e) {
      res.status(400).json({ error: (e as Error).message });
    }
  },
);

app.patch('/products/:id', auth('admin'), async (req: any, res) => {
  const productId = Number(req.params.id);
  if (!Number.isInteger(productId)) return res.status(400).json({ error: 'Invalid product id' });
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        sku: req.body.sku,
        name: req.body.name,
        categoryId: Number(req.body.categoryId),
        unit: req.body.unit,
        purchasePrice: Number(req.body.purchasePrice),
        sellingPrice: Number(req.body.sellingPrice),
        minimumStock: Number(req.body.minimumStock),
      },
    });
    res.json(product);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

app.patch('/products/:id/deactivate', auth('admin'), async (req: any, res) => {
  const productId = Number(req.params.id);
  if (!Number.isInteger(productId)) return res.status(400).json({ error: 'Invalid product id' });
  try {
    res.json(await prisma.product.update({ where: { id: productId }, data: { isActive: false } }));
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

app.get('/categories', auth(['admin', 'petugas']), async (req, res) => {
  res.json(await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }));
});
app.post('/categories', auth('admin'), body('name').isString().notEmpty(), async (req: any, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try { res.status(201).json(await prisma.category.create({ data: { name: req.body.name, description: req.body.description } })); }
  catch (e) { res.status(400).json({ error: (e as Error).message }); }
});
app.get('/suppliers', auth(['admin', 'petugas']), async (req, res) => {
  res.json(await prisma.supplier.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }));
});
app.post('/suppliers', auth('admin'), body('code').isString().notEmpty(), body('name').isString().notEmpty(), async (req: any, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try { res.status(201).json(await prisma.supplier.create({ data: req.body })); }
  catch (e) { res.status(400).json({ error: (e as Error).message }); }
});
app.get('/users', auth('admin'), async (req, res) => {
  res.json(await prisma.user.findMany({ select: { id: true, name: true, username: true, email: true, role: true, isActive: true }, orderBy: { name: 'asc' } }));
});
app.post('/users', auth('admin'), body('name').isString().notEmpty(), body('username').isString().notEmpty(), body('password').isString().isLength({ min: 6 }), body('role').isIn(['admin', 'petugas']), async (req: any, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({ data: { name: req.body.name, username: req.body.username, email: req.body.email || `${req.body.username}@setia.local`, passwordHash, role: req.body.role, isActive: true } });
    res.status(201).json({ id: user.id, name: user.name, username: user.username, role: user.role });
  } catch (e) { res.status(400).json({ error: (e as Error).message }); }
});

// stock in transaction (admin & petugas)
app.post(
  '/stock/in',
  auth(),
  body('productId').isInt(),
  body('quantity').isInt({ min: 1 }),
  body('supplierId').optional().isInt(),
  async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { productId, quantity, supplierId, notes } = req.body;
    const userId = req.user.id;
    try {
      await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { id: productId } });
        if (!product) throw new Error('Product not found');
        const transaction = await tx.stockTransaction.create({
          data: {
            transactionNumber: `IN-${Date.now()}`,
            transactionType: 'IN',
            transactionDate: new Date(),
            supplierId: supplierId || null,
            notes: notes || null,
            status: 'confirmed',
            createdById: userId,
          },
        });
        const item = await tx.stockTransactionItem.create({
          data: {
            transactionId: transaction.id,
            productId,
            quantity,
            unitCost: product.purchasePrice,
            unitPrice: product.sellingPrice,
          },
        });
        await tx.stockMovement.create({
          data: {
            productId,
            transactionId: transaction.id,
            transactionItemId: item.id,
            movementType: 'IN',
            quantityIn: quantity,
            quantityOut: null,
            balanceBefore: product.currentStock,
            balanceAfter: product.currentStock + quantity,
            createdById: userId,
          },
        });
        await tx.product.update({
          where: { id: productId },
          data: { currentStock: { increment: quantity } },
        });
      });
      res.json({ status: 'stock in recorded' });
    } catch (e) {
      res.status(400).json({ error: (e as Error).message });
    }
  },
);

// stock out transaction (admin & petugas)
app.post(
  '/stock/out',
  auth(),
  body('productId').isInt(),
  body('quantity').isInt({ min: 1 }),
  body('reason').isString(),
  async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { productId, quantity, reason, notes } = req.body;
    const userId = req.user.id;
    try {
      await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { id: productId } });
        if (!product) throw new Error('Product not found');
        if (product.currentStock < quantity) throw new Error('Insufficient stock');
        const transaction = await tx.stockTransaction.create({
          data: {
            transactionNumber: `OUT-${Date.now()}`,
            transactionType: 'OUT',
            transactionDate: new Date(),
            status: 'confirmed',
            notes: `${reason}${notes ? ` - ${notes}` : ''}`,
            createdById: userId,
          },
        });
        const item = await tx.stockTransactionItem.create({
          data: {
            transactionId: transaction.id,
            productId,
            quantity,
            unitCost: product.purchasePrice,
            unitPrice: product.sellingPrice,
          },
        });
        await tx.stockMovement.create({
          data: {
            productId,
            transactionId: transaction.id,
            transactionItemId: item.id,
            movementType: 'OUT',
            quantityIn: null,
            quantityOut: quantity,
            balanceBefore: product.currentStock,
            balanceAfter: product.currentStock - quantity,
            createdById: userId,
          },
        });
        await tx.product.update({
          where: { id: productId },
          data: { currentStock: { decrement: quantity } },
        });
      });
      res.json({ status: 'stock out recorded' });
    } catch (e) {
      res.status(400).json({ error: (e as Error).message });
    }
  },
);

app.post(
  '/stock/opname',
  auth(),
  body('productId').isInt(),
  body('countedStock').isInt({ min: 0 }),
  body('notes').isString().notEmpty(),
  async (req: any, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { productId, countedStock, notes } = req.body;
    const userId = req.user.id;

    try {
      const result = await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { id: productId } });
        if (!product) throw new Error('Product not found');

        const delta = countedStock - product.currentStock;
        const transaction = await tx.stockTransaction.create({
          data: {
            transactionNumber: `OPN-${Date.now()}`,
            transactionType: 'ADJUSTMENT',
            transactionDate: new Date(),
            notes: `Stok fisik: ${countedStock} ${product.unit}. ${notes}`,
            status: 'confirmed',
            createdById: userId,
            confirmedById: userId,
            confirmedAt: new Date(),
          },
        });
        const item = await tx.stockTransactionItem.create({
          data: {
            transactionId: transaction.id,
            productId,
            quantity: Math.abs(delta),
            unitCost: product.purchasePrice,
            unitPrice: product.sellingPrice,
            notes: `Hasil hitung fisik: ${countedStock}`,
          },
        });
        await tx.stockMovement.create({
          data: {
            productId,
            transactionId: transaction.id,
            transactionItemId: item.id,
            movementType: 'ADJUSTMENT',
            quantityIn: delta > 0 ? delta : null,
            quantityOut: delta < 0 ? Math.abs(delta) : null,
            balanceBefore: product.currentStock,
            balanceAfter: countedStock,
            createdById: userId,
          },
        });
        await tx.product.update({
          where: { id: productId },
          data: { currentStock: countedStock },
        });
        await tx.activityLog.create({
          data: {
            userId,
            action: 'STOCK_OPNAME',
            entityType: 'Product',
            entityId: productId,
            description: `Opname ${product.name}: ${product.currentStock} -> ${countedStock}`,
          },
        });
        return { transactionNumber: transaction.transactionNumber, previousStock: product.currentStock, countedStock };
      });
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: (e as Error).message });
    }
  },
);

app.get('/movements', auth(['admin', 'petugas']), async (req, res) => {
  const movements = await prisma.stockMovement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  const productIds = [...new Set(movements.map((movement) => movement.productId))];
  const transactionIds = [...new Set(movements.map((movement) => movement.transactionId))];
  const [products, transactions] = await Promise.all([
    prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, sku: true, unit: true } }),
    prisma.stockTransaction.findMany({ where: { id: { in: transactionIds } }, select: { id: true, transactionNumber: true, notes: true, transactionDate: true, status: true, reversalOfId: true } }),
  ]);
  const productById = new Map(products.map((product) => [product.id, product]));
  const transactionById = new Map(transactions.map((transaction) => [transaction.id, transaction]));
  res.json(movements.map((movement) => ({ ...movement, product: productById.get(movement.productId), transaction: transactionById.get(movement.transactionId) })));
});
app.get('/transactions', auth(['admin', 'petugas']), async (req, res) => {
  res.json(await prisma.stockTransaction.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }));
});
app.post('/transactions/:id/cancel', auth('admin'), body('notes').optional().isString(), async (req: any, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const transactionId = Number(req.params.id);
  if (!Number.isInteger(transactionId)) return res.status(400).json({ error: 'ID transaksi tidak valid' });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const original = await tx.stockTransaction.findUnique({ where: { id: transactionId } });
      if (!original) throw new Error('Transaksi tidak ditemukan');
      if (original.status === 'cancelled') throw new Error('Transaksi sudah dibatalkan');
      if (original.transactionType === 'REVERSAL') throw new Error('Transaksi koreksi tidak dapat dikoreksi lagi');
      const existingReversal = await tx.stockTransaction.findFirst({ where: { reversalOfId: transactionId } });
      if (existingReversal) throw new Error('Transaksi sudah memiliki koreksi');
      const movements = await tx.stockMovement.findMany({ where: { transactionId }, orderBy: { id: 'asc' } });
      if (!movements.length) throw new Error('Transaksi tidak memiliki mutasi stok');
      const reversal = await tx.stockTransaction.create({
        data: {
          transactionNumber: `REV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          transactionType: 'REVERSAL',
          transactionDate: new Date(),
          notes: req.body.notes || `Koreksi transaksi ${original.transactionNumber}`,
          status: 'confirmed',
          createdById: req.user.id,
          confirmedById: req.user.id,
          confirmedAt: new Date(),
          reversalOfId: original.id,
        },
      });
      for (const movement of movements) {
        const product = await tx.product.findUnique({ where: { id: movement.productId } });
        if (!product) throw new Error('Produk transaksi tidak ditemukan');
        const quantity = movement.quantityIn || movement.quantityOut || 0;
        const isReversingIn = movement.quantityIn !== null && movement.quantityIn > 0;
        if (isReversingIn && product.currentStock < quantity) throw new Error(`Stok ${product.name} tidak cukup untuk koreksi`);
        const item = await tx.stockTransactionItem.create({
          data: {
            transactionId: reversal.id,
            productId: product.id,
            quantity,
            unitCost: product.purchasePrice,
            unitPrice: product.sellingPrice,
            notes: 'Pembalikan transaksi',
          },
        });
        await tx.stockMovement.create({
          data: {
            productId: product.id,
            transactionId: reversal.id,
            transactionItemId: item.id,
            movementType: 'REVERSAL',
            quantityIn: isReversingIn ? null : quantity,
            quantityOut: isReversingIn ? quantity : null,
            balanceBefore: product.currentStock,
            balanceAfter: product.currentStock + (isReversingIn ? -quantity : quantity),
            createdById: req.user.id,
          },
        });
        await tx.product.update({
          where: { id: product.id },
          data: isReversingIn ? { currentStock: { decrement: quantity } } : { currentStock: { increment: quantity } },
        });
      }
      await tx.stockTransaction.update({ where: { id: original.id }, data: { status: 'cancelled' } });
      await tx.activityLog.create({
        data: {
          userId: req.user.id,
          action: 'CANCEL_TRANSACTION',
          entityType: 'StockTransaction',
          entityId: original.id,
          description: `Membatalkan ${original.transactionNumber} dengan ${reversal.transactionNumber}`,
        },
      });
      return { transactionNumber: reversal.transactionNumber, cancelledTransaction: original.transactionNumber };
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});
app.get('/reports/stock', auth(['admin', 'petugas']), async (req, res) => {
  res.json(await prisma.product.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }));
});

// dashboard summary (admin & petugas)
app.get('/dashboard/summary', auth(['admin', 'petugas']), async (req, res) => {
  const totalProducts = await prisma.product.count({ where: { isActive: true } });
  const totalUnits = await prisma.product.aggregate({
    _sum: { currentStock: true },
  });
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { currentStock: true, minimumStock: true },
  });
  const lowStock = products.filter((product) => product.currentStock <= product.minimumStock).length;
  const outOfStock = await prisma.product.count({ where: { currentStock: 0 } });
  res.json({ totalProducts, totalUnits: totalUnits._sum.currentStock, lowStock, outOfStock });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
