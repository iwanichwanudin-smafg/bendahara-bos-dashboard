-- ====================================================================
-- UPDATE 6 ITEM REVISI RKAS TAHAP 2 NEGATIF (SMAS FUTURE GATE 2026)
-- Target Total Tahap 2 RKAS Resmi = Rp 675.155.000 (Selisih Koreksi = -Rp 9.374.024)
-- ====================================================================

-- 1. Drop CHECK constraint lama yang melarang tahap2 negatif (jika ada)
ALTER TABLE rab_items DROP CONSTRAINT IF EXISTS check_tahap2_positive;
ALTER TABLE rab_items DROP CONSTRAINT IF EXISTS rab_items_tahap2_check;

-- Pastikan constraint check_tahap_total mendukung nilai negatif desimal
ALTER TABLE rab_items DROP CONSTRAINT IF EXISTS check_tahap_total;
ALTER TABLE rab_items ADD CONSTRAINT check_tahap_total CHECK (ABS((tahap1 + tahap2) - harga_final) <= 1.00);

-- 2. Update 6 Item Koreksi Revisi
-- Item 1: Amplop Coklat / casing D (kode: 5.1.02.01.01.06.05.08, vol: 28 pak, tarif: 82.000)
UPDATE rab_items
SET 
    desc = 'Amplop Coklat / casing D',
    kode_rekening = '5.1.02.01.01.06.05.08',
    harga_final = 1960000.00,
    tahap1 = 2296000.00,
    tahap2 = -336000.00,
    updated_at = NOW()
WHERE (desc ILIKE '%Amplop Coklat%' OR kode_rekening = '5.1.02.01.01.06.05.08')
  AND volume = 28 AND tarif = 82000;

-- Item 2: Tagihan Listrik P-1/TR 6.600 VA s.d. 200 kVA (vol: 6.793 kwh, tarif: 950)
UPDATE rab_items
SET 
    desc = 'Tagihan Listrik P-1/TR 6.600 VA s.d. 200 kVA',
    harga_final = 6310697.00,
    tahap1 = 6453350.00,
    tahap2 = -142653.00,
    updated_at = NOW()
WHERE (desc ILIKE '%Tagihan Listrik P-1%' OR desc ILIKE '%6.793%')
  AND volume = 6793 AND tarif = 950;

-- Item 3: Belanja Tagihan Listrik Bulanan (vol: 1 bulan, tarif: 12.000.000, tahap1: 12.000.000)
UPDATE rab_items
SET 
    desc = 'Belanja Tagihan Listrik Bulanan',
    harga_final = 8930727.00,
    tahap1 = 12000000.00,
    tahap2 = -3069273.00,
    updated_at = NOW()
WHERE (desc ILIKE '%Tagihan Listrik%' OR desc ILIKE '%Belanja Tagihan Listrik Bulanan%')
  AND volume = 1 AND tarif = 12000000 AND (tahap1 = 12000000 OR tahap1 IS NULL);

-- Item 4: Honor Riski Francisko (kode: 7959770671130342, vol: 80 jam, tarif: 190.000)
UPDATE rab_items
SET 
    desc = 'Honor Riski Francisko',
    kode_rekening = '7959770671130342',
    harga_final = 11052271.00,
    tahap1 = 15200000.00,
    tahap2 = -4147729.00,
    updated_at = NOW()
WHERE (desc ILIKE '%Riski Francisko%' OR kode_rekening = '7959770671130342')
  AND volume = 80 AND tarif = 190000;

-- Item 5: Honor Pangestu Wibisono (vol: 88 jam, tarif: 210.000)
UPDATE rab_items
SET 
    desc = 'Honor Pangestu Wibisono',
    harga_final = 17969641.00,
    tahap1 = 18480000.00,
    tahap2 = -510359.00,
    updated_at = NOW()
WHERE desc ILIKE '%Pangestu Wibisono%'
  AND volume = 88 AND tarif = 210000;

-- Item 6: Honor Mahmud Syah Alam (kode: 9642771672130312, vol: 90 jam, tarif: 140.000)
UPDATE rab_items
SET 
    desc = 'Honor Mahmud Syah Alam',
    kode_rekening = '9642771672130312',
    harga_final = 11431990.00,
    tahap1 = 12600000.00,
    tahap2 = -1168010.00,
    updated_at = NOW()
WHERE (desc ILIKE '%Mahmud Syah Alam%' OR kode_rekening = '9642771672130312')
  AND volume = 90 AND tarif = 140000;

-- 3. Query Verifikasi SUM(tahap2) untuk RKAS SMAS Future Gate 2026
SELECT 
    SUM(tahap2) AS total_tahap2_2026,
    COUNT(*) AS total_item_rkas,
    COUNT(CASE WHEN tahap2 < 0 THEN 1 END) AS jumlah_item_koreksi_negatif,
    SUM(CASE WHEN tahap2 < 0 THEN tahap2 ELSE 0 END) AS total_nominal_koreksi_negatif
FROM rab_items;
