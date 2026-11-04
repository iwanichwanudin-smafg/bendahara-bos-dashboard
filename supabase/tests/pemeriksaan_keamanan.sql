-- =====================================================================
-- PEMERIKSAAN KEAMANAN DATABASE — jalankan di Supabase > SQL Editor kapan saja
-- (aman: semuanya berupa SELECT/transaksi yang dibatalkan, tidak mengubah data).
-- =====================================================================

-- 1) Semua tabel harus rls_aktif = true, anon_bisa_baca = false.
select c.relname as tabel,
       c.relrowsecurity as rls_aktif,
       has_table_privilege('anon', c.oid, 'select') as anon_bisa_baca
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by 1;
-- Harapan: rls_aktif = true dan anon_bisa_baca = false di SETIAP baris.

-- 2) Daftar pengguna terdaftar dan perannya.
select u.email, (u.email_confirmed_at is not null) as terkonfirmasi, a.peran
from auth.users u left join public.akses_pengguna a on a.email = lower(u.email)
order by u.created_at;
-- Harapan: setiap orang yang berhak punya peran; akun tanpa peran (null) tidak bisa melihat data.

-- 3) Akun kepala sekolah TIDAK boleh bisa mengubah/menghapus (ganti email sesuai akun kepsek).
begin;
set local role authenticated;
select set_config('request.jwt.claims',
  json_build_object('email', 'email.kepsek@contoh.sch.id', 'role', 'authenticated')::text, true);
with u as (update public.transaksi set note = note returning 1),
     d as (delete from public.si_transfers returning 1)
select (select count(*) from public.transaksi) as bisa_baca,
       (select count(*) from u) as baris_diubah,
       (select count(*) from d) as baris_dihapus;
rollback;
-- Harapan: bisa_baca > 0, baris_diubah = 0, baris_dihapus = 0.
