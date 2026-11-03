-- =====================================================================
-- Skema Dashboard Bendahara BOS SMAS Future Gate (TA 2026)  — keadaan akhir
-- Sudah diterapkan ke project Supabase "Tools Anggaran BOS SMA Future Gate".
-- Disimpan di repo sebagai dokumentasi / untuk membangun ulang database.
-- Akses: hanya pengguna login yang terdaftar di akses_pengguna.
--   peran 'bendahara' = baca + tulis;  'kepsek' / 'pembaca' = baca saja.
-- =====================================================================

create table public.akses_pengguna (
  email text primary key,
  nama text,
  peran text not null check (peran in ('bendahara', 'kepsek', 'pembaca')),
  dibuat_pada timestamptz not null default now(),
  constraint akses_email_huruf_kecil check (email = lower(email))
);

create or replace function public.peran_saya()
returns text language sql stable security definer set search_path = ''
as $$
  select a.peran from public.akses_pengguna a
  where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
$$;
revoke all on function public.peran_saya() from public, anon;
grant execute on function public.peran_saya() to authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end; $$;

create table public.profil_sekolah (
  id smallint primary key default 1 check (id = 1),
  nama text not null, npsn text, nama_yayasan text, alamat text, nama_bank text,
  no_rekening text, nama_rekening text, nama_kepsek text, nama_bendahara text,
  hp_bendahara text, email_bendahara text, tahun_anggaran int,
  updated_at timestamptz not null default now()
);

create table public.rekening_bank (
  id smallint primary key default 1 check (id = 1),
  bank text, cabang text, nomor_rekening text, nama_rekening text, tahun_anggaran int,
  file_sumber text, sheet_sumber text,
  total_mutasi_debit numeric(16,2), total_mutasi_kredit numeric(16,2), saldo_akhir numeric(16,2),
  updated_at timestamptz not null default now()
);

create table public.pagu_tahunan (
  tahun int primary key,
  total_siswa int not null,
  nominal_per_siswa numeric(16,2) not null,
  total_pagu_gross numeric(16,2) not null,
  iuran_fkss_per_siswa numeric(16,2) not null default 0,
  total_iuran_fkss numeric(16,2) not null default 0,
  total_pagu_netto numeric(16,2) not null,
  pagu_tahap1 numeric(16,2) not null default 0,
  pagu_tahap2 numeric(16,2) not null default 0,
  updated_at timestamptz not null default now()
);

create table public.pagu_unit (
  id text primary key,
  tahun int not null references public.pagu_tahunan (tahun) on update cascade,
  urutan smallint not null default 0,
  nama text not null,
  siswa int not null default 0,
  pagu_murni numeric(16,2) not null default 0,
  talangan_fkss numeric(16,2) not null default 0,
  pagu numeric(16,2) not null default 0,
  warna text, catatan text,
  updated_at timestamptz not null default now()
);

create table public.si_batches (
  id text primary key,
  nomor_si text not null,
  tanggal date not null,
  tanggal_format text, perihal text, nama_bank text, rekening_sumber text, atas_nama_sumber text,
  total_nominal numeric(16,2) not null default 0,
  status text, status_badge text, catatan text, month_folder text, si_folder text,
  extra jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.si_transfers (
  id bigint generated always as identity primary key,
  batch_id text not null references public.si_batches (id) on update cascade on delete cascade,
  no int not null,
  original_no int,
  unit_id text not null references public.pagu_unit (id) on update cascade,
  unit_nama text, kategori text, va_siplah text, nama_bank text, atas_nama text,
  bruto numeric(16,2), pajak numeric(16,2), netto numeric(16,2),
  ket text, note text, uraian text,
  extra jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (batch_id, no)
);

create table public.transaksi (
  id text primary key,
  batch_id text references public.si_batches (id) on update cascade on delete cascade,
  no_si text,
  tanggal date not null,
  unit_id text not null references public.pagu_unit (id) on update cascade,
  unit_nama text, kategori text, nama_barang text, uraian text,
  qty numeric(14,4), satuan text,
  harga_satuan numeric(16,2), nominal numeric(16,2), total_nominal numeric(16,2),
  netto numeric(16,2), bruto numeric(16,2), pajak numeric(16,2),
  va_siplah text, nama_bank text, atas_nama text, ket text, note text, keterangan text,
  extra jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.rekening_koran (
  id text primary key,
  row_index int, serial_date int,
  tanggal date not null,
  uraian text not null,
  tipe text not null check (tipe in ('PENERIMAAN', 'PENGELUARAN')),
  kategori text,
  debit numeric(16,2) not null default 0,
  kredit numeric(16,2) not null default 0,
  saldo numeric(16,2) not null default 0,
  extra jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index idx_pagu_unit_tahun on public.pagu_unit (tahun);
create index idx_si_batches_tanggal on public.si_batches (tanggal);
create index idx_si_transfers_batch on public.si_transfers (batch_id);
create index idx_si_transfers_unit on public.si_transfers (unit_id);
create index idx_transaksi_batch on public.transaksi (batch_id);
create index idx_transaksi_unit on public.transaksi (unit_id);
create index idx_transaksi_tanggal on public.transaksi (tanggal);
create index idx_rekening_koran_tanggal on public.rekening_koran (tanggal);

do $$
declare t text;
begin
  foreach t in array array['profil_sekolah','rekening_bank','pagu_tahunan','pagu_unit','si_batches','si_transfers','transaksi','rekening_koran']
  loop
    execute format('create trigger trg_%1$s_updated_at before update on public.%1$I for each row execute function public.set_updated_at()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %1$s_baca on public.%1$I for select to authenticated using ((select public.peran_saya()) is not null)', t);
    execute format('create policy %1$s_tambah on public.%1$I for insert to authenticated with check ((select public.peran_saya()) = ''bendahara'')', t);
    execute format('create policy %1$s_ubah on public.%1$I for update to authenticated using ((select public.peran_saya()) = ''bendahara'') with check ((select public.peran_saya()) = ''bendahara'')', t);
    execute format('create policy %1$s_hapus on public.%1$I for delete to authenticated using ((select public.peran_saya()) = ''bendahara'')', t);
  end loop;
end $$;

alter table public.akses_pengguna enable row level security;
create policy akses_baca_diri_sendiri on public.akses_pengguna
  for select to authenticated
  using (email = lower(coalesce((select auth.jwt() ->> 'email'), '')));

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;

-- ---------------------------------------------------------------------
-- MENAMBAH PENGGUNA (jalankan di SQL Editor Supabase, setelah akun dibuat di
-- Authentication > Users > Add user):
--   insert into public.akses_pengguna (email, nama, peran)
--   values ('email.kepsek@contoh.sch.id', 'Nama Kepala Sekolah', 'kepsek');
-- Mencabut akses:
--   delete from public.akses_pengguna where email = 'email@contoh.sch.id';
-- ---------------------------------------------------------------------
