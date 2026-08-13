-- ====================================================================
-- SUPABASE DATABASE SCHEMA FOR RKAS / RAB ITEMS (REKONSILIASI TAHAP 2)
-- ====================================================================

-- Table definition for rab_items
CREATE TABLE IF NOT EXISTS rab_items (
    id BIGSERIAL PRIMARY KEY,
    unit_id INT NOT NULL,
    kode_rekening VARCHAR(100),
    kode_program VARCHAR(100),
    jenis VARCHAR(100),
    desc TEXT NOT NULL,
    satuan VARCHAR(50) DEFAULT 'pcs',
    volume NUMERIC(12, 4) DEFAULT 1,       -- Volume/kuantitas estimasi awal
    tarif NUMERIC(15, 2) DEFAULT 0,         -- Tarif/harga satuan estimasi awal
    harga_final NUMERIC(15, 2) NOT NULL,   -- Total resmi item SETELAH revisi, bukan hasil kali otomatis
    tahap1 NUMERIC(15, 2) DEFAULT 0,       -- Alokasi/Realisasi Tahap 1
    tahap2 NUMERIC(15, 2) DEFAULT 0,       -- Alokasi Tahap 2 (WAJIB BISA NEGATIF, TANPA CONSTRAINT >= 0)
    bulan VARCHAR(50),
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- CHECK constraint: tahap1 + tahap2 = harga_final (dengan toleransi pembulatan desimal <= 1.00)
    CONSTRAINT check_tahap_total CHECK (ABS((tahap1 + tahap2) - harga_final) <= 1.00)
);

-- Index to optimize querying negative tahap2 items (Flagged Revisions)
CREATE INDEX IF NOT EXISTS idx_rab_items_tahap2_negative ON rab_items (tahap2) WHERE tahap2 < 0;

-- Function & Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rab_items_updated_at
    BEFORE UPDATE ON rab_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- View for Automatic Revision Flagging (tahap1 > harga_final => tahap2 < 0)
CREATE OR REPLACE VIEW view_rab_items_koreksi_revisi AS
SELECT 
    id,
    unit_id,
    kode_rekening,
    jenis,
    desc,
    volume,
    satuan,
    tarif,
    (volume * tarif) AS gross_estimate,
    harga_final,
    tahap1,
    tahap2,
    (harga_final - tahap1) AS selisih,
    CASE 
        WHEN (volume * tarif) = tahap1 THEN 'Volume x Tarif == Tahap 1 (Item direvisi turun setelah Tahap 1 terkunci)'
        ELSE 'Revisi Pagu Final lebih kecil dari Realisasi/Alokasi Tahap 1'
    END AS kemungkinan_penyebab
FROM rab_items
WHERE tahap2 < 0 OR tahap1 > harga_final;
