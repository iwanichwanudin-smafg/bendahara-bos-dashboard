// Daftar kolom setiap tabel — cermin dari supabase/schema_bendahara_bos.sql.
// Database tiruan menolak kolom yang tidak ada di sini, seperti Supabase sungguhan.
// Jika skema di database diubah, perbarui juga daftar ini.
export const COLUMNS = {
  si_batches: ['id','nomor_si','tanggal','tanggal_format','perihal','nama_bank','rekening_sumber','atas_nama_sumber','total_nominal','status','status_badge','catatan','month_folder','si_folder','extra','updated_at'],
  si_transfers: ['id','batch_id','no','original_no','unit_id','unit_nama','kategori','va_siplah','nama_bank','atas_nama','bruto','pajak','netto','ket','note','uraian','extra','updated_at'],
  transaksi: ['id','batch_id','no_si','tanggal','unit_id','unit_nama','kategori','nama_barang','uraian','qty','satuan','harga_satuan','nominal','total_nominal','netto','bruto','pajak','va_siplah','nama_bank','atas_nama','ket','note','keterangan','extra','updated_at'],
  rekening_koran: ['id','row_index','serial_date','tanggal','uraian','tipe','kategori','debit','kredit','saldo','extra','updated_at']
};
