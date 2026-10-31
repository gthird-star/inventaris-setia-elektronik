# PROJECT_SPEC.md

# Sistem Informasi Inventaris Setia Elektronik

**Versi:** 1.0\
**Status:** Spesifikasi awal\
**Jenis aplikasi:** Sistem informasi inventaris berbasis web\
**Lokasi bisnis:** Setia Elektronik, wilayah Pasirian, Kabupaten
Lumajang, Jawa Timur

> **Catatan validitas data:** Informasi publik tentang toko dan proses
> operasionalnya masih terbatas. Nama toko dan lokasi merupakan konteks
> awal; daftar produk, stok, harga, pemasok, jumlah karyawan, dan
> prosedur toko harus dikonfirmasi langsung. Jangan memperlakukan data
> demo sebagai data asli.

## 1. Tujuan Produk

Membangun aplikasi inventaris yang membantu pemilik dan karyawan: -
Mengelola produk, kategori, dan pemasok. - Mencatat barang masuk dan
barang keluar. - Memantau saldo stok dan stok minimum. - Menelusuri
riwayat pergerakan stok. - Menghasilkan laporan inventaris yang dapat
difilter dan diekspor. - Menjaga akurasi, keamanan, dan jejak audit
perubahan data.

## 2. Ruang Lingkup

### Modul MVP (prioritas utama)

1.  Login dan logout.
2.  Dashboard inventaris.
3.  CRUD produk dan kategori.
4.  Manajemen pemasok.
5.  Transaksi barang masuk.
6.  Transaksi barang keluar dengan alasan.
7.  Riwayat mutasi stok.
8.  Peringatan stok rendah dan stok habis.
9.  Laporan stok dan mutasi.
10. Manajemen pengguna dan hak akses.
11. Audit log.
12. Backup dan pemulihan basis data.

### Pengembangan berikutnya

-   Pesanan pembelian ke pemasok.
-   Penjualan dan pelanggan.
-   Retur pelanggan/pemasok.
-   Stock opname.
-   Pemindaian barcode.
-   Notifikasi pemesanan ulang.

Jangan menganggap barang keluar selalu berarti penjualan. Barang dapat
keluar karena rusak, hilang, retur pemasok, penggunaan internal, atau
penyesuaian.

## 3. Profil Toko dan Data yang Perlu Dikumpulkan

  Data                           Status
  ------------------------------ -----------------------------------------------
  Nama                           Setia Elektronik
  Wilayah                        Pasirian, Lumajang, Jawa Timur
  Jenis usaha                    Toko elektronik (perlu validasi jenis produk)
  Katalog aktual                 Belum dikumpulkan
  Stok awal                      Belum dikumpulkan
  Harga beli/jual                Belum dikumpulkan
  Daftar pemasok                 Belum dikumpulkan
  Pengguna sistem                Belum ditentukan
  Alur pembelian dan penjualan   Perlu wawancara
  Metode penilaian persediaan    Perlu disepakati

Sebelum implementasi, wawancarai pemilik/petugas dan kumpulkan contoh
catatan barang, faktur, pemasok, serta stok fisik.

## 4. Peran Pengguna

### Admin/Pemilik

-   Akses seluruh dashboard dan laporan.
-   Mengelola produk, kategori, pemasok, dan akun pengguna.
-   Mengonfirmasi transaksi stok.
-   Menyetujui penyesuaian dan pembatalan.
-   Melihat audit log dan nilai persediaan.
-   Mengelola pengaturan serta backup.

### Petugas

-   Melihat dan mencari produk.
-   Mencatat barang masuk dan keluar sesuai izin.
-   Melihat stok dan riwayat transaksi yang diizinkan.
-   Tidak boleh menghapus riwayat transaksi atau mengubah pengaturan
    sensitif tanpa izin.

Validasi izin wajib dilakukan di backend, bukan hanya dengan
menyembunyikan menu di frontend.

## 5. Data Produk

Atribut produk yang disarankan: - `id`: primary key. - `sku`: kode
produk unik. - `barcode`: opsional. - `name`: nama produk. -
`category_id`: kategori. - `brand` dan `model`: merek dan model, jika
relevan. - `description`: deskripsi opsional. - `unit`: satuan seperti
pcs, unit, meter, atau set. - `purchase_price`: harga modal referensi. -
`selling_price`: harga jual referensi. - `minimum_stock`: batas stok
minimum. - `current_stock`: saldo berjalan, diperbarui hanya melalui
mekanisme transaksi stok. - `location`: lokasi penyimpanan, jika
dibutuhkan. - `is_active`: status produk. - `created_at`, `updated_at`.

Produk yang sudah memiliki transaksi sebaiknya dinonaktifkan, bukan
dihapus permanen. Atribut produk harus disesuaikan dengan katalog aktual
toko.

## 6. Kategori dan Pemasok

Kategori merupakan data yang bisa dikelola admin, bukan daftar tetap
yang diasumsikan sebagai katalog toko. Contoh kategori untuk data demo:
peralatan listrik, lampu, kabel, aksesori elektronik, perangkat
audio/video, peralatan rumah tangga, suku cadang, dan lainnya.
Konfirmasi kategori sebenarnya kepada toko.

Atribut pemasok: - `id`, `code`, `name`. - `contact_name`, `phone`,
`email`. - `address`, `notes`, `is_active`. - `created_at`,
`updated_at`.

Jangan mengarang nama atau kontak pemasok.

## 7. Transaksi Inventaris

### Barang masuk

Sumber dapat berupa pembelian, retur pelanggan, saldo awal, atau
penyesuaian positif. Simpan nomor transaksi, tanggal, produk, jumlah,
harga modal saat transaksi jika relevan, pemasok/referensi, catatan,
pembuat, status, dan waktu konfirmasi.

### Barang keluar

Simpan nomor transaksi, tanggal, produk, jumlah, alasan, referensi,
catatan, pembuat, status, dan waktu konfirmasi. Alasan dapat berupa
penjualan, barang rusak, barang hilang, retur pemasok, penggunaan
internal, atau penyesuaian negatif.

### Status transaksi

Gunakan status seperti `draft`, `confirmed`, dan `cancelled` dengan
aturan transisi yang tegas. Draft tidak mengubah stok. Transaksi yang
sudah dikonfirmasi tidak dihapus langsung; koreksi menggunakan transaksi
pembalik atau penyesuaian yang tercatat.

## 8. Aturan Stok dan Integritas

Rumus konseptual:

`Stok akhir = stok awal + total masuk - total keluar`

Hanya transaksi sah yang sudah dikonfirmasi yang memengaruhi saldo.
Ketika transaksi dikonfirmasi: 1. Validasi input dan status. 2.
Lindungi/kunci saldo produk yang terkait. 3. Periksa stok terkini untuk
transaksi keluar. 4. Catat transaksi dan item. 5. Catat pergerakan stok.
6. Perbarui saldo berjalan. 7. Catat pengguna dan waktu. 8. Commit semua
perubahan dalam satu transaksi database.

Jika salah satu langkah gagal, rollback seluruh perubahan. Cegah
pemrosesan ganda akibat permintaan berulang dan cegah stok negatif,
termasuk ketika ada transaksi bersamaan.

Setiap penyesuaian stok wajib memiliki alasan dan pengguna yang
bertanggung jawab. Jangan mengubah atau menghapus pergerakan stok yang
telah diposting; gunakan transaksi pembalik.

## 9. Rancangan Database Awal

Nama tabel dan kolom berikut adalah rancangan konseptual, bukan SQL
final.

### `users`

`id`, `name`, `username`, `email`, `password_hash`, `role`, `is_active`,
`last_login_at`, `created_at`, `updated_at`.

### `categories`

`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`.

### `products`

`id`, `sku`, `barcode`, `name`, `category_id`, `brand`, `model`,
`description`, `unit`, `purchase_price`, `selling_price`,
`minimum_stock`, `current_stock`, `location`, `is_active`, `created_at`,
`updated_at`.

### `suppliers`

`id`, `code`, `name`, `contact_name`, `phone`, `email`, `address`,
`notes`, `is_active`, `created_at`, `updated_at`.

### `stock_transactions`

`id`, `transaction_number`, `transaction_type`, `transaction_date`,
`supplier_id`, `reference_number`, `notes`, `status`, `created_by`,
`confirmed_by`, `confirmed_at`, `reversal_of_transaction_id`,
`created_at`, `updated_at`.

### `stock_transaction_items`

`id`, `transaction_id`, `product_id`, `quantity`, `unit_cost`,
`unit_price`, `notes`, `created_at`.

### `stock_movements`

`id`, `product_id`, `transaction_id`, `transaction_item_id`,
`movement_type`, `quantity_in`, `quantity_out`, `balance_before`,
`balance_after`, `created_by`, `created_at`.

### `activity_logs`

`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`,
`ip_address`, `created_at`.

Relasi: - Satu kategori memiliki banyak produk. - Satu transaksi
memiliki banyak item. - Satu produk dapat muncul di banyak item
transaksi dan mutasi stok. - Satu pemasok dapat terkait dengan banyak
transaksi pembelian. - Satu pengguna dapat membuat banyak transaksi dan
log aktivitas. - Transaksi pembalik merujuk transaksi asal.

Gunakan primary key, foreign key, indeks, batasan unik, dan migration.
Untuk rancangan produksi, putuskan apakah `current_stock` disimpan
sebagai saldo berjalan atau dihitung dari pergerakan. Jika disimpan,
pembaruannya harus atomik dan konsisten dengan ledger pergerakan stok.

## 10. Dashboard dan Laporan

### Dashboard

-   Total jenis produk aktif.
-   Total unit persediaan.
-   Produk stok rendah.
-   Produk stok habis.
-   Ringkasan barang masuk/keluar hari ini.
-   Nilai persediaan sesuai metode yang disepakati.
-   Grafik pergerakan stok.
-   Aktivitas terbaru.

Semua angka harus berasal dari database. Bedakan jumlah jenis produk
dari jumlah unit barang. Tampilkan empty state jika belum ada data.

### Laporan

-   Daftar produk dan stok.
-   Stok rendah/habis.
-   Barang masuk dan keluar.
-   Mutasi stok.
-   Penyesuaian stok.
-   Nilai persediaan.
-   Aktivitas pengguna.

Filter dapat mencakup rentang tanggal, produk, kategori, pemasok, jenis
transaksi, pengguna, dan status. Ekspor CSV/Excel untuk analisis serta
PDF/cetak untuk dokumen formal.

Nilai persediaan harus mengikuti metode yang dipilih, misalnya FIFO atau
rata-rata tertimbang. Sebelum metode ditetapkan, tampilkan nilai sebagai
estimasi berdasarkan harga modal referensi dan jangan menyebutnya
sebagai nilai akuntansi final.

## 11. Keamanan dan Operasional

-   Hash kata sandi dengan algoritma yang sesuai.
-   Gunakan query terparameterisasi atau ORM yang aman.
-   Validasi di frontend dan backend.
-   Lindungi endpoint dengan autentikasi dan otorisasi.
-   Gunakan HTTPS di lingkungan produksi.
-   Terapkan perlindungan CSRF bila relevan dengan strategi sesi.
-   Simpan rahasia di environment variables.
-   Jangan menaruh kredensial di repository.
-   Catat tindakan penting di audit log.
-   Buat backup teratur, simpan secara aman, dan uji pemulihannya.
-   Sediakan migration database dan dokumentasi setup.

## 12. Teknologi yang Disarankan

Pilihan awal yang konsisten: - Frontend: React atau Next.js dengan
TypeScript. - Styling: Tailwind CSS. - Backend: Node.js + Express +
TypeScript. - Database: MySQL atau MariaDB. - Validasi: Zod atau library
setara. - Version control: Git.

Teknologi akhir harus mengikuti kondisi repository dan keputusan
pengembang. Jangan mengganti stack yang sudah dipilih tanpa alasan yang
jelas. Jangan mengakses database langsung dari browser.

## 13. Halaman Aplikasi

-   Login.
-   Dashboard.
-   Produk dan detail produk.
-   Kategori.
-   Barang masuk.
-   Barang keluar.
-   Mutasi stok.
-   Pemasok.
-   Laporan.
-   Manajemen pengguna.
-   Audit log.
-   Pengaturan dan backup.

## 14. Data Demo

Data demo boleh dipakai untuk menguji UI, tetapi harus jelas diberi
label dan tidak boleh bercampur dengan data produksi. Jangan mengklaim
nama produk, harga, stok, pemasok, atau transaksi demo sebagai data asli
Setia Elektronik.

Sebelum go-live: 1. Kumpulkan katalog aktual. 2. Bersihkan kode/nama
duplikat. 3. Seragamkan satuan. 4. Validasi harga dan jumlah. 5.
Cocokkan stok awal dengan stok fisik. 6. Impor dan verifikasi data. 7.
Minta persetujuan pemilik.

## 15. Pengujian dan Kriteria Penerimaan

-   [ ] Login/logout dan hak akses berfungsi.
-   [ ] Produk, kategori, dan pemasok dapat dikelola.
-   [ ] Kode produk dan transaksi unik.
-   [ ] Draft tidak mengubah stok.
-   [ ] Konfirmasi barang masuk menambah stok tepat.
-   [ ] Konfirmasi barang keluar mengurangi stok tepat.
-   [ ] Stok negatif dan transaksi ganda dicegah.
-   [ ] Kegagalan transaksi melakukan rollback.
-   [ ] Pembatalan menghasilkan efek pembalik yang dapat ditelusuri.
-   [ ] Riwayat stok dan audit log tersedia.
-   [ ] Notifikasi stok minimum akurat.
-   [ ] Laporan sesuai data dan filter.
-   [ ] Ekspor menghasilkan data yang benar.
-   [ ] Backup dan pemulihan diuji.
-   [ ] UI responsif di desktop dan ponsel.
-   [ ] Data demo terpisah dari data produksi.

## 16. Tahapan Implementasi

1.  Analisis proses toko dan kumpulkan kebutuhan.
2.  Rancang ERD, alur transaksi, dan UI.
3.  Implementasikan autentikasi dan hak akses.
4.  Implementasikan produk, kategori, dan pemasok.
5.  Implementasikan barang masuk/keluar dan ledger stok.
6.  Implementasikan dashboard, notifikasi, dan laporan.
7.  Uji integritas, keamanan, dan responsivitas.
8.  Migrasikan data aktual dan lakukan uji coba dengan pemilik.

## 17. Instruksi untuk AI Coding Agent

-   Baca repository dan identifikasi stack sebelum mengubah kode.
-   Jadikan dokumen ini sebagai spesifikasi fungsional.
-   Jangan mengarang fakta toko atau mencampur data demo dengan
    produksi.
-   Implementasikan fitur bertahap dan modular.
-   Gunakan transaksi database untuk perubahan stok.
-   Jangan menghapus riwayat transaksi terkonfirmasi.
-   Jangan membuat angka dashboard statis di produksi.
-   Jangan membuat tombol atau endpoint palsu.
-   Sediakan migration, seed data demo yang terpisah, dokumentasi, dan
    pengujian.
-   Jalankan pengujian setelah perubahan penting dan perbaiki error
    sebelum lanjut.
-   Jika keputusan bisnis belum diketahui, dokumentasikan asumsi dan
    minta konfirmasi; jangan menyajikan asumsi sebagai fakta.
