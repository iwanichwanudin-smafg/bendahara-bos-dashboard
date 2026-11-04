# BOSku — Dashboard Bendahara BOS SMAS Future Gate

Aplikasi web untuk bendahara BOS: mencatat Surat Instruksi (SI) bank, transaksi belanja, pagu per unit,
dan rekonsiliasi rekening koran. Pengguna: Bendahara (ubah data) dan Kepala Sekolah (lihat saja).
Berisi **data keuangan sekolah yang sensitif**. Utamakan keamanan dan ketepatan angka di atas kecepatan.

## Menjalankan
- `npm install` lalu `npm run dev` (pengembangan), `npm run build` (produksi), `npm test` (test otomatis).
- Salin `.env.example` menjadi `.env.local` dan isi dua variabel Supabase. File `.env*` tidak boleh di-commit.
- **Jalankan `npm test` dan `npm run build` sebelum menyatakan pekerjaan selesai.** Jangan bilang "sudah benar"
  tanpa hasil test yang lulus.

## Teknologi
Vite + JavaScript biasa (tanpa framework), Chart.js, SheetJS (impor Excel), Supabase (database + login),
deploy di Vercel (project `bendahara-bos-dashboard-o68i`).

## Struktur
- `main.js` — logika utama dan tampilan (besar; ubah dengan hati-hati, sedikit demi sedikit).
- `src/lib/supabaseClient.js` — klien Supabase (membaca variabel `VITE_*`).
- `src/lib/auth.js` — login, pengecekan peran, kotak pengguna.
- `src/lib/repository.js` — **satu-satunya** tempat yang membaca/menulis database; menerjemahkan objek aplikasi
  (camelCase) ke tabel (snake_case) dan menyimpan hanya baris yang berubah.
- `src/modules/` — modul fitur (mis. rekonsiliasi bank).
- `supabase/schema_bendahara_bos.sql` — skema database terakhir; `supabase/tests/` — pemeriksaan keamanan.
- `tests/` — test otomatis dengan database tiruan dan **data karangan**.

## Aturan keras (jangan dilanggar)
1. **Jangan menulis rahasia di kode atau repo**: password, kunci `service_role` / `secret`, token. Hanya kunci
   *publishable* yang boleh dipakai di aplikasi, dan hanya lewat variabel lingkungan.
2. **Jangan menaruh data sekolah di kode atau folder `public/`**: nomor rekening, nama penerima transfer,
   daftar transaksi, file Excel keuangan. Semua data hidup di database dan hanya dimuat setelah login.
   Data untuk test harus **karangan** (lihat `tests/fixtures.mjs`).
3. **RLS harus tetap aktif di semua tabel.** Jangan mematikan RLS atau menambah policy untuk role `anon`.
   Setiap tabel baru wajib: aktifkan RLS, baca = peran terdaftar, tulis = hanya `bendahara`.
4. **Perubahan skema database dicatat** di `supabase/schema_bendahara_bos.sql` dan daftar kolom di
   `tests/schema_columns.mjs`. Jangan mengubah database tanpa mencatatnya.
5. **Jangan menghapus data, file, atau project** (termasuk tombol "Kosongkan Transaksi") tanpa persetujuan
   eksplisit pengguna. Tindakan merusak/permanen: tanyakan dulu.
6. Angka uang harus akurat: total SI = jumlah transfernya; jangan membulatkan atau mengubah satuan diam-diam.
7. Kode tidak boleh membocorkan data ke log atau pesan error yang tampil ke pengguna.

## Catatan penting
- Peran ada di tabel `akses_pengguna` (`bendahara` = baca+tulis; `kepsek`/`pembaca` = baca saja). Menambah pengguna:
  buat akun di Supabase Authentication, lalu `insert` ke `akses_pengguna` dengan email huruf kecil yang sama.
- Pendaftaran mandiri di Supabase dimatikan; jangan menyalakannya kembali.
- Tanggal `tanggal` dipakai untuk urutan dan pencocokan rekening koran; label teks `tanggalFormat` mengikuti surat asli.
  Keduanya bisa sengaja berbeda (mis. SI-828: label "4 April 2026" mengikuti surat, tanggal data 4 Mei). Jangan "diperbaiki"
  tanpa bertanya.
- Project Supabase paket Free bisa di-pause bila lama tidak dipakai; jika aplikasi gagal memuat data, periksa itu dulu.
- Skrip `*.mjs` di akar repo adalah alat sekali pakai dari masa lalu dan tidak ikut build; jangan diandalkan.
- Bahasa antarmuka dan komentar: Bahasa Indonesia.
