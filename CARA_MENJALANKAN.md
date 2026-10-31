# Setia Elektronik Inventory System

Catatan ini berisi akun demo dan cara menjalankan aplikasi inventaris Setia Elektronik.

## Akun Demo

| Role | Username | Password | Akses |
|---|---|---|---|
| Admin | `admin` | `12345678` | Semua fitur |
| Petugas | `petugas` | `petugas123` | Dashboard, produk, transaksi stok, mutasi, laporan |

> Ganti password demo sebelum aplikasi digunakan di lingkungan produksi.

## Persiapan

Pastikan sudah terpasang:

- Node.js dan npm
- VS Code (opsional)

Struktur proyek:

```text
backend/   API Express, Prisma, dan database SQLite
frontend/  React, Vite, dan tampilan aplikasi
```

## Menjalankan Backend

Buka terminal pertama dari folder proyek:

```powershell
cd "D:\Website Ujicoba\Inventaris_toko setia elektronik\backend"
npm install
npm run prisma:generate
npm run prisma:seed
npm run dev
```

Backend berjalan di:

```text
http://localhost:3000
```

Endpoint pengecekan:

```text
http://localhost:3000/health
```

## Menjalankan Frontend

Buka terminal kedua dari folder proyek:

```powershell
cd "D:\Website Ujicoba\Inventaris_toko setia elektronik\frontend"
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya:

```text
http://localhost:5173/login
```

## Cara Login

1. Pastikan backend sudah berjalan di port `3000`.
2. Pastikan frontend sudah berjalan di port `5173`.
3. Buka `http://localhost:5173/login`.
4. Masukkan salah satu akun pada tabel akun demo.
5. Setelah berhasil, aplikasi mengarahkan ke dashboard.

## Fitur Berdasarkan Role

### Admin

- Dashboard
- Produk
- Barang masuk dan barang keluar
- Mutasi stok
- Laporan stok
- Kategori
- Pemasok
- Pengguna

### Petugas

- Dashboard
- Melihat produk
- Mencatat barang masuk
- Mencatat barang keluar
- Melihat mutasi stok
- Melihat laporan stok

Petugas tidak dapat mengakses endpoint pengelolaan pengguna, kategori, dan pemasok.

## Perintah Pengembangan

### Backend

```powershell
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run prisma:seed
npm run simulate:november
npm run populate:realistic
```

`npm run simulate:november` menambahkan data demo transaksi untuk 1–30
November 2026. Script bersifat idempoten: jika simulasi periode tersebut
sudah ada, script tidak menggandakan transaksi.

`npm run populate:realistic` menambahkan 24 produk dan histori transaksi toko
yang realistis. Script aman dijalankan ulang dan akan menyegarkan stok akhir
data demo tersebut tanpa menghapus transaksi simulasi lain.

### Frontend

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

## Troubleshooting

### Login gagal

- Pastikan backend aktif di `http://localhost:3000`.
- Pastikan username dan password benar.
- Jika database baru dibuat, jalankan `npm run prisma:seed` dari folder `backend`.
- Jika browser menyimpan token lama, buka DevTools lalu hapus `localStorage` dengan key `token`, kemudian refresh.

### Port sudah digunakan

Tutup proses yang memakai port `3000` atau `5173`, kemudian jalankan ulang aplikasi.

### Halaman tidak berubah setelah login

Lakukan hard refresh dengan `Ctrl + F5`. Pastikan frontend dijalankan ulang setelah ada perubahan kode.

## Catatan Database

Database SQLite berada di:

```text
backend/prisma/dev.db
```

Perintah seed membuat atau memperbarui akun demo, kategori, pemasok, dan produk contoh.
