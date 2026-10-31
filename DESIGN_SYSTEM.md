# DESIGN_SYSTEM.md

# Pedoman Desain UI --- Inventaris Setia Elektronik

**Versi:** 1.0\
**Referensi visual:** Screenshot dashboard SilverLogix yang diberikan
pengguna dan tautan Pinterest `https://pin.it/b4klOMnjZ`\
**Tujuan:** Mengadaptasi pola dashboard admin yang rapi dan berorientasi
data untuk kebutuhan inventaris toko elektronik.

> Referensi digunakan sebagai inspirasi struktur dan hierarki visual,
> bukan untuk menyalin identitas merek, logo, nama, atau konten produk
> SilverLogix. Identitas visual harus menggunakan nama Setia Elektronik.

## 1. Arah Desain

Bangun dashboard admin modern yang: - Profesional, bersih, dan mudah
dipindai. - Mengutamakan data inventaris dan aktivitas operasional. -
Memiliki sidebar biru tua yang konsisten. - Menggunakan area konten
putih atau abu-abu sangat muda. - Memakai kartu statistik, tabel data,
badge status, ikon sederhana, dan grafik ringkas. - Menghindari dekorasi
berlebihan. - Nyaman digunakan pada layar desktop dan tetap responsif di
ponsel.

Kesan yang dituju: **tepercaya, efisien, jelas, dan operasional**.

## 2. Prinsip Referensi Visual

Dari screenshot referensi, gunakan pola berikut: 1. Sidebar vertikal
berwarna biru tua. 2. Identitas aplikasi di bagian atas sidebar. 3.
Navigasi dengan ikon dan label. 4. Item menu aktif memiliki latar biru
yang lebih terang. 5. Topbar berisi pencarian, tanggal, notifikasi, dan
profil pengguna. 6. Judul halaman besar dengan deskripsi singkat. 7.
Kartu ringkasan berjajar di bagian atas. 8. Tabel data menjadi fokus
utama halaman. 9. Tombol aksi utama menonjol tetapi tidak berlebihan.
10. Status ditampilkan dengan badge warna. 11. Tabel menyediakan
pencarian/filter, ekspor, pagination, dan pilihan jumlah baris.

Jangan gunakan teks, logo, angka, nama orang, data pengiriman, atau
elemen merek SilverLogix. Ganti seluruh konten dengan kebutuhan Setia
Elektronik.

## 3. Design Tokens

Gunakan token terpusat agar tampilan konsisten. Nilai di bawah adalah
titik awal yang dapat disesuaikan setelah implementasi.

### Warna

  -----------------------------------------------------------------------
  Token                   Nilai awal              Penggunaan
  ----------------------- ----------------------- -----------------------
  `--color-primary-900`   `#17377A`               Sidebar dan elemen
                                                  utama

  `--color-primary-800`   `#1E438F`               Hover sidebar

  `--color-primary-600`   `#3267D5`               Tombol utama dan link

  `--color-primary-100`   `#E8F0FF`               Item menu
                                                  aktif/permukaan biru
                                                  muda

  `--color-background`    `#F6F8FC`               Latar aplikasi

  `--color-surface`       `#FFFFFF`               Kartu, tabel, modal

  `--color-text`          `#182230`               Teks utama

  `--color-text-muted`    `#667085`               Teks sekunder

  `--color-border`        `#E3E8EF`               Garis tepi dan pemisah

  `--color-success`       `#16834A`               Status normal/berhasil

  `--color-success-bg`    `#DDF8E7`               Latar status berhasil

  `--color-warning`       `#9A6700`               Stok rendah/perlu
                                                  perhatian

  `--color-warning-bg`    `#FFF0C2`               Latar peringatan

  `--color-danger`        `#B42318`               Stok habis/error

  `--color-danger-bg`     `#FEE4E2`               Latar bahaya

  `--color-info`          `#2457B2`               Informasi/status proses

  `--color-info-bg`       `#E1ECFF`               Latar informasi
  -----------------------------------------------------------------------

Pastikan kontras teks memadai. Jangan menyampaikan status hanya melalui
warna; sertakan label atau ikon.

### Tipografi

-   Gunakan `Inter`, `Plus Jakarta Sans`, atau font sans-serif sistem.
-   Judul halaman: 28--32 px, semibold/bold.
-   Judul bagian: 18--20 px, semibold.
-   Isi teks: 14--16 px.
-   Label dan metadata: 12--13 px.
-   Angka pada kartu statistik: 26--32 px.
-   Gunakan line-height yang nyaman dan hindari terlalu banyak variasi
    font.

### Spasi dan Bentuk

Gunakan skala spasi berbasis kelipatan 4 atau 8 px.

  Token                                              Nilai
  ------------------- ------------------------------------
  `--radius-sm`                                       6 px
  `--radius-md`                                      10 px
  `--radius-lg`                                      14 px
  `--radius-card`                                    12 px
  `--shadow-card`       `0 1px 3px rgba(16, 24, 40, 0.06)`
  `--sidebar-width`                            232--248 px
  `--topbar-height`                              64--72 px

Gunakan border tipis dan bayangan lembut. Hindari efek glassmorphism,
gradien berlebihan, atau bayangan tebal yang tidak ada fungsinya.

## 4. Layout Aplikasi

### Desktop

-   Sidebar tetap di sisi kiri.
-   Topbar berada di bagian atas area konten.
-   Konten memiliki padding sekitar 24 px.
-   Gunakan grid yang adaptif.
-   Kartu statistik tampil 4 kolom pada layar lebar, 2 kolom pada layar
    menengah.
-   Tabel memenuhi lebar konten dan dapat di-scroll horizontal jika
    memang diperlukan.

Contoh struktur:

``` text
┌────────────────────┬───────────────────────────────────────────────┐
│ SETIA ELEKTRONIK   │ Search...       Tanggal   Notifikasi  Profil  │
│                    ├───────────────────────────────────────────────┤
│ Dashboard          │ Dashboard                                     │
│ Produk             │ Ringkasan inventaris toko                     │
│ Barang Masuk       │                                               │
│ Barang Keluar      │ [Total Produk] [Total Stok] [Stok Rendah]     │
│ Mutasi Stok        │ [Stok Habis]                                  │
│ Kategori           │                                               │
│ Pemasok            │ [Grafik Pergerakan Stok] [Perlu Restock]      │
│ Laporan            │                                               │
│ Pengguna           │ [Tabel Aktivitas / Transaksi Terbaru]         │
│ Pengaturan         │                                               │
└────────────────────┴───────────────────────────────────────────────┘
```

### Responsif

-   Pada tablet, sidebar dapat diciutkan.
-   Pada ponsel, gunakan drawer navigasi atau sidebar overlay.
-   Kartu statistik menjadi 2 kolom atau 1 kolom sesuai lebar layar.
-   Filter tabel dapat ditempatkan di panel/filter drawer.
-   Form panjang dibagi menjadi kelompok yang jelas.
-   Tombol utama harus mudah dijangkau dan tidak tertutup elemen lain.
-   Jangan memaksakan tabel lebar; gunakan horizontal scroll atau
    tampilan kartu pada layar kecil.

## 5. Sidebar

### Header

-   Tampilkan nama **Setia Elektronik**.
-   Gunakan ikon sederhana bertema inventaris/elektronik.
-   Logo dapat dibuat sebagai ikon abstrak, bukan mengambil logo toko
    lain.
-   Nama aplikasi dapat ditampilkan sebagai "Inventory System".

### Navigasi yang Disarankan

1.  Dashboard
2.  Inventaris
    -   Semua Produk
    -   Kategori
    -   Mutasi Stok
3.  Transaksi Stok
    -   Barang Masuk
    -   Barang Keluar
4.  Pemasok
5.  Laporan
6.  Pengguna (admin)
7.  Audit Log (admin)
8.  Pengaturan

Item aktif menggunakan latar biru lebih terang, teks putih, dan
indikator yang jelas. Ikon harus konsisten dari satu library dan
memiliki ukuran yang sama.

Jangan tampilkan menu yang tidak dapat digunakan atau tidak diizinkan
untuk peran pengguna.

## 6. Topbar

Komponen: - Tombol buka/tutup sidebar untuk layar kecil. - Kolom
pencarian cepat. - Tanggal atau filter periode bila relevan. -
Notifikasi stok rendah. - Avatar atau inisial pengguna. - Nama dan peran
pengguna. - Menu profil dan logout.

Pencarian global dapat menemukan produk berdasarkan kode, nama, merek,
atau barcode. Jangan menampilkan data sensitif yang tidak diizinkan
kepada pengguna.

## 7. Dashboard Inventaris

### Header

Judul: `Dashboard`\
Deskripsi: `Ringkasan kondisi inventaris Setia Elektronik`

Sediakan filter periode bila grafik atau ringkasan membutuhkannya.
Jangan membuat semua kartu berubah berdasarkan filter jika metriknya
memang bersifat kondisi stok saat ini.

### Kartu Statistik

Kartu yang disarankan: 1. **Total Produk** --- jumlah produk aktif yang
berbeda. 2. **Total Unit Stok** --- jumlah unit berdasarkan satuan
masing-masing; beri label jelas karena unit yang berbeda tidak selalu
bisa dijumlahkan secara bermakna. 3. **Stok Rendah** --- jumlah produk
di bawah atau pada ambang minimum. 4. **Stok Habis** --- jumlah produk
dengan stok nol.

Alternatif kartu tambahan: - Barang masuk hari ini. - Barang keluar hari
ini. - Estimasi nilai persediaan.

Setiap kartu menampilkan ikon, label, angka, dan keterangan singkat.
Grafik mini/sparkline hanya digunakan jika ada data historis yang valid.
Jangan menampilkan persentase pertumbuhan palsu.

### Bagian Konten

-   Grafik barang masuk dan keluar per hari/minggu/bulan.
-   Tabel "Produk Perlu Restock".
-   Tabel "Transaksi Terbaru".
-   Aktivitas pengguna terbaru jika relevan.

Gunakan empty state yang menjelaskan bahwa data belum tersedia, bukan
grafik atau angka buatan.

## 8. Desain Tabel Data

Tabel adalah komponen utama untuk pekerjaan inventaris.

### Struktur Tabel Produk

Kolom yang disarankan: - Kode produk. - Nama produk. - Kategori. -
Merek/model. - Stok. - Satuan. - Harga modal (khusus peran yang
diizinkan). - Harga jual (jika diperlukan). - Status stok. - Aksi.

### Toolbar Tabel

-   Pencarian.
-   Filter kategori.
-   Filter status stok.
-   Tombol tambah produk.
-   Tombol ekspor.
-   Tombol filter lanjutan bila diperlukan.

### Aturan Tabel

-   Header kolom mudah dibaca.
-   Gunakan garis pemisah halus.
-   Baris memiliki tinggi yang nyaman.
-   Angka dan harga rata kanan.
-   Nama dan kode produk rata kiri.
-   Pagination jelas.
-   Tampilkan jumlah hasil dan pilihan jumlah baris.
-   Aksi per baris berupa tombol atau menu yang mudah dipahami.
-   Konfirmasi tindakan destruktif atau sensitif.
-   Jangan menaruh terlalu banyak tombol di setiap baris.
-   Harga modal hanya terlihat oleh peran yang berwenang.

## 9. Badge Status Inventaris

Gunakan status dengan teks dan warna yang konsisten.

  Status                Gaya           Contoh label
  --------------------- -------------- ---------------
  Normal                Hijau lembut   Normal
  Stok rendah           Kuning/amber   Stok Rendah
  Habis                 Merah lembut   Habis
  Draft                 Abu-abu        Draft
  Menunggu konfirmasi   Kuning         Menunggu
  Dikonfirmasi          Hijau          Terkonfirmasi
  Dibatalkan            Merah/abu      Dibatalkan

Aturan bisnis status harus konsisten dengan backend. Warna hanyalah
representasi visual, bukan sumber kebenaran status.

## 10. Formulir dan Dialog

-   Label selalu terlihat; jangan hanya mengandalkan placeholder.
-   Tandai field wajib.
-   Tampilkan validasi dekat field terkait.
-   Gunakan input numerik untuk jumlah dan harga.
-   Format angka rupiah dengan pemisah ribuan yang konsisten.
-   Sediakan pemilih produk yang bisa dicari.
-   Untuk transaksi, tampilkan ringkasan sebelum konfirmasi.
-   Pisahkan tombol "Simpan Draft" dari "Konfirmasi Transaksi".
-   Gunakan dialog konfirmasi untuk pembatalan atau penyesuaian stok.
-   Jelaskan konsekuensi tindakan pada dialog.
-   Jangan mengizinkan pengeditan langsung terhadap ledger stok.

## 11. Halaman Produk

Tampilan: - Judul dan deskripsi singkat. - Tombol `Tambah Produk`. -
Ringkasan/filter jika berguna. - Tabel produk. - Form tambah/edit dalam
halaman atau modal besar. - Halaman detail berisi informasi produk dan
riwayat mutasi.

Form produk: - Kode produk. - Barcode opsional. - Nama. - Kategori. -
Merek dan model. - Satuan. - Harga modal. - Harga jual. - Batas stok
minimum. - Lokasi penyimpanan. - Deskripsi.

Stok berjalan tidak boleh diedit sebagai field biasa. Perubahan stok
dilakukan lewat saldo awal, transaksi masuk/keluar, atau penyesuaian
yang diaudit.

## 12. Halaman Barang Masuk dan Keluar

### Barang Masuk

-   Nomor transaksi.
-   Tanggal.
-   Pemasok/referensi.
-   Produk dan jumlah.
-   Harga modal per unit bila relevan.
-   Catatan.
-   Status dan pembuat.
-   Aksi simpan draft/konfirmasi sesuai izin.

### Barang Keluar

-   Nomor transaksi.
-   Tanggal.
-   Produk dan jumlah.
-   Alasan pengeluaran.
-   Referensi.
-   Catatan.
-   Status dan pembuat.

Tampilkan peringatan yang jelas jika stok tidak mencukupi. Pastikan
konfirmasi dilakukan secara aman di backend dan saldo diperbarui secara
atomik.

## 13. Laporan dan Grafik

-   Gunakan grafik sederhana dengan label dan tooltip yang jelas.
-   Jangan memakai grafik 3D.
-   Hindari terlalu banyak warna.
-   Pastikan legenda dan satuan terlihat.
-   Sediakan filter periode yang mudah dipahami.
-   Sediakan ekspor sesuai izin.
-   Tampilkan periode dan waktu pembuatan laporan.
-   Grafik harus berdasarkan data aktual, bukan angka hard-coded.

## 14. Aksesibilitas dan Interaksi

-   Kontras teks memadai.
-   Semua kontrol dapat diakses dengan keyboard.
-   Fokus keyboard terlihat.
-   Ikon tombol memiliki label aksesibel atau tooltip.
-   Jangan menyampaikan status hanya dengan warna.
-   Target klik cukup besar.
-   Form memiliki pesan error yang spesifik.
-   Loading, success, empty, dan error state harus dirancang.
-   Hindari animasi berlebihan; transisi singkat hanya untuk membantu
    pemahaman.

## 15. Panduan Implementasi

Jika menggunakan React/Next.js dan Tailwind: - Definisikan token warna
dan radius dalam satu tempat. - Buat komponen reusable: `AppSidebar`,
`Topbar`, `PageHeader`, `StatCard`, `DataTable`, `StatusBadge`,
`SearchInput`, `FilterBar`, `ConfirmDialog`, dan `EmptyState`. - Gunakan
layout konsisten di seluruh halaman. - Pisahkan komponen UI dari logika
data. - Gunakan komponen tabel yang mendukung loading, error, empty
state, pagination, dan filter. - Hindari duplikasi CSS dan komponen. -
Gunakan ikon dari satu library yang konsisten. - Pastikan desain tidak
bergantung pada data demo.

## 16. Kriteria Penerimaan Desain

-   [ ] Sidebar biru tua dan menu aktif terlihat jelas.
-   [ ] Nama dan identitas menggunakan Setia Elektronik.
-   [ ] Topbar berisi pencarian dan profil pengguna.
-   [ ] Dashboard memiliki kartu ringkasan yang relevan dengan
    inventaris.
-   [ ] Tabel memiliki pencarian, filter, pagination, dan aksi yang
    berfungsi.
-   [ ] Badge status konsisten dan menyertakan teks.
-   [ ] Form menampilkan validasi dan konfirmasi yang jelas.
-   [ ] Harga modal dibatasi berdasarkan hak akses.
-   [ ] Semua angka dashboard berasal dari data, bukan angka contoh di
    produksi.
-   [ ] Empty, loading, error, dan success state tersedia.
-   [ ] Tampilan responsif pada desktop, tablet, dan ponsel.
-   [ ] Kontras dan navigasi keyboard diperhatikan.
-   [ ] Tidak ada logo, nama orang, atau konten SilverLogix yang
    disalin.
-   [ ] Tidak ada tombol visual yang tidak berfungsi.

## 17. Prompt untuk AI Coding Agent

Buat UI sistem inventaris Setia Elektronik dengan mengacu pada
`DESIGN_SYSTEM.md` dan spesifikasi fungsional pada `PROJECT_SPEC.md`.

Gunakan screenshot dashboard SilverLogix yang diberikan sebagai
referensi tata letak umum: sidebar biru tua, topbar, kartu statistik,
tabel data, filter, tombol ekspor, dan badge status. Adaptasikan
semuanya untuk inventaris toko elektronik; jangan menyalin branding atau
data dari referensi.

Prioritaskan dashboard desktop yang profesional dan responsif. Buat
komponen reusable dan token desain terpusat. Pastikan tabel dan seluruh
kontrol benar-benar berfungsi dengan data backend. Jangan membuat angka
statistik palsu di produksi. Jika data belum tersedia, gunakan empty
state atau data demo yang diberi label jelas.

Sebelum coding, periksa struktur repository dan stack yang ada.
Implementasikan bertahap, pertahankan konsistensi antarhalaman, serta
uji tampilan desktop dan mobile.
