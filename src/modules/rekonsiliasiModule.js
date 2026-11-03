// =========================================================
// REKONSILIASI MODULE - DASHBOARD BENDAHARA BOSKU
// Integrasi Buku Kas Bank BJB (Sheet: Rek Koran) & Verifikasi SI
// =========================================================

import * as XLSX from 'xlsx';
import { formatRupiah, formatNumber, formatDate } from '../utils/format.js';
import { REKENING_INFO } from '../data/rekeningKoranData.js';

// Data mutasi dimuat dari Supabase (lihat setRekKoranData) dan disimpan lewat callback onChange.
let rekKoranList = [];
let getSIBatches = () => [];
let canWrite = false;
let onRekChange = () => {};
let notifyToast = (msg) => console.log(msg);
let currentSubTab = 'mutasi'; // 'mutasi', 'pencocokan', 'bunga'
let pendingUploadedTransactions = null;

// Helper: Format Bulan Indonesia Pendek / Panjang
function getNamaBulan(bulanStr) {
  const map = {
    '01': 'Januari', '02': 'Februari', '03': 'Maret',
    '04': 'April', '05': 'Mei', '06': 'Juni',
    '07': 'Juli', '08': 'Agustus', '09': 'September',
    '10': 'Oktober', '11': 'November', '12': 'Desember'
  };
  return map[bulanStr] || bulanStr;
}

// Convert Excel Serial Date to YYYY-MM-DD
function excelDateToISO(serial) {
  if (!serial || isNaN(serial)) return '';
  const utc_days = Math.floor(serial - 25569);
  const date_info = new Date(utc_days * 86400 * 1000);
  return date_info.toISOString().split('T')[0];
}

// Diisi dari server setelah login
export function setRekKoranData(list) {
  rekKoranList = Array.isArray(list) ? JSON.parse(JSON.stringify(list)) : [];
}

export function saveRekKoranData() {
  if (!canWrite) {
    notifyToast('🔒 Akun Anda hanya dapat melihat data. Perubahan tidak disimpan.');
    return;
  }
  onRekChange(rekKoranList);
}

// Rekonsiliasi matcher: hubungkan baris bank dengan SI batches
export function matchBankWithSIBatches() {
  const batches = getSIBatches() || [];
  const matchedBatchIds = new Set();

  return rekKoranList.map(item => {
    let matchedBatch = null;

    if (item.tipe === 'PENGELUARAN' && item.kredit > 0) {
      // Prioritas 1: Cocokkan persis berdasarkan total nominal kredit
      matchedBatch = batches.find(b => b.totalNominal === item.kredit && !matchedBatchIds.has(b.id));

      // Jika ada multi-match, tandai ID yang terpakai
      if (matchedBatch) {
        matchedBatchIds.add(matchedBatch.id);
      }
    }

    return {
      ...item,
      matchedSI: matchedBatch || null,
      isMatched: !!matchedBatch
    };
  });
}

// =========================================================
// RENDER UTAMA HALAMAN REKONSILIASI
// =========================================================

export function renderRekonsiliasi() {
  const enrichedData = matchBankWithSIBatches();

  // 1. Update Metrics Cards
  const totalDebit = enrichedData.reduce((acc, r) => acc + (r.debit || 0), 0);
  const totalKredit = enrichedData.reduce((acc, r) => acc + (r.kredit || 0), 0);
  const saldoAkhir = enrichedData.length > 0 ? enrichedData[enrichedData.length - 1].saldo : 0;
  const saldoAwal = enrichedData.length > 0 && enrichedData[0].saldo ? enrichedData[0].saldo : 3939563;

  const statSaldoAwal = document.getElementById('rekonStatSaldoAwal');
  const statTotalDebit = document.getElementById('rekonStatTotalDebit');
  const statTotalKredit = document.getElementById('rekonStatTotalKredit');
  const statSaldoAkhir = document.getElementById('rekonStatSaldoAkhir');

  if (statSaldoAwal) statSaldoAwal.textContent = formatRupiah(saldoAwal);
  if (statTotalDebit) statTotalDebit.textContent = formatRupiah(totalDebit);
  if (statTotalKredit) statTotalKredit.textContent = formatRupiah(totalKredit);
  if (statSaldoAkhir) statSaldoAkhir.textContent = formatRupiah(saldoAkhir);

  // 2. Audit Box
  const creditItems = enrichedData.filter(r => r.tipe === 'PENGELUARAN');
  const matchedCount = creditItems.filter(r => r.isMatched).length;
  const totalSIBatches = (getSIBatches() || []).length;
  const totalNominalSI = (getSIBatches() || []).reduce((acc, b) => acc + (b.totalNominal || 0), 0);
  const selisihKredit = totalKredit - totalNominalSI;

  const rekonBoxTotalBank = document.getElementById('rekonBoxTotalBank');
  const rekonBoxTotalSI = document.getElementById('rekonBoxTotalSI');
  const rekonBoxSelisih = document.getElementById('rekonBoxSelisih');
  const rekonBoxPersen = document.getElementById('rekonBoxPersen');
  const badgeContainer = document.getElementById('rekonMatchBadgeContainer');

  if (rekonBoxTotalBank) rekonBoxTotalBank.textContent = formatRupiah(totalKredit);
  if (rekonBoxTotalSI) rekonBoxTotalSI.textContent = formatRupiah(totalNominalSI);
  if (rekonBoxSelisih) rekonBoxSelisih.textContent = formatRupiah(selisihKredit);
  if (rekonBoxPersen) {
    const pct = totalSIBatches > 0 ? Math.round((matchedCount / totalSIBatches) * 100) : 100;
    rekonBoxPersen.textContent = `${matchedCount}/${totalSIBatches} SI Cocok (${pct}%)`;
  }

  if (badgeContainer) {
    if (totalSIBatches > 0 && matchedCount === totalSIBatches) {
      badgeContainer.innerHTML = `
        <span class="rekon-badge rekon-badge-match" style="font-size: 0.82rem; padding: 4px 10px;">
          🟢 Seluruh ${totalSIBatches} SI Sistem Terverifikasi Terealisasi di Bank BJB
        </span>
      `;
    } else if (totalSIBatches > 0) {
      badgeContainer.innerHTML = `
        <span class="rekon-badge rekon-badge-unmatch" style="font-size: 0.82rem; padding: 4px 10px;">
          🟡 ${totalSIBatches - matchedCount} SI Perlu Penyesuaian
        </span>
      `;
    }
  }

  // 3. Render Active Sub Tab
  if (currentSubTab === 'mutasi') {
    renderMutasiTable(enrichedData);
  } else if (currentSubTab === 'pencocokan') {
    renderPencocokanTable(enrichedData);
  } else if (currentSubTab === 'bunga') {
    renderBungaTable(enrichedData);
  }
}

// ---------------------------------------------------------
// Sub Tab 1: Render Mutasi Rekening Koran Table
// ---------------------------------------------------------
function renderMutasiTable(data) {
  const tableBody = document.getElementById('rekonTableBodyMutasi');
  if (!tableBody) return;

  const filterTipe = document.getElementById('rekonFilterTipe')?.value || 'ALL';
  const filterBulan = document.getElementById('rekonFilterBulan')?.value || 'ALL';
  const filterStatus = document.getElementById('rekonFilterStatus')?.value || 'ALL';
  const searchKeyword = (document.getElementById('rekonSearchInput')?.value || '').trim().toLowerCase();

  const filtered = data.filter(item => {
    // Filter Tipe
    if (filterTipe === 'PENERIMAAN' && item.tipe !== 'PENERIMAAN') return false;
    if (filterTipe === 'PENGELUARAN' && item.tipe !== 'PENGELUARAN') return false;
    if (filterTipe === 'BUNGA_BANK' && item.kategori !== 'BUNGA_BANK') return false;
    if (filterTipe === 'PENCAIRAN_BOS' && item.kategori !== 'PENCAIRAN_BOS') return false;

    // Filter Bulan
    if (filterBulan !== 'ALL') {
      const monthPart = (item.tanggal || '').split('-')[1];
      if (monthPart !== filterBulan) return false;
    }

    // Filter Status Rekon
    if (filterStatus === 'MATCHED' && !item.isMatched && item.tipe === 'PENGELUARAN') return false;
    if (filterStatus === 'UNMATCHED' && item.isMatched && item.tipe === 'PENGELUARAN') return false;

    // Filter Search
    if (searchKeyword) {
      const uraianMatch = (item.uraian || '').toLowerCase().includes(searchKeyword);
      const siMatch = item.matchedSI && item.matchedSI.nomorSI.toLowerCase().includes(searchKeyword);
      const debitMatch = String(item.debit || '').includes(searchKeyword);
      const kreditMatch = String(item.kredit || '').includes(searchKeyword);
      const saldoMatch = String(item.saldo || '').includes(searchKeyword);
      if (!uraianMatch && !siMatch && !debitMatch && !kreditMatch && !saldoMatch) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 30px; color: var(--text-muted);">
          🔍 Tidak ada transaksi rekening koran yang cocok dengan kriteria filter atau kata kunci.
        </td>
      </tr>
    `;
    updateMutasiFooters(0, 0, 0, 0);
    return;
  }

  let html = '';
  filtered.forEach((r, idx) => {
    // Badges kategori
    let catBadgeClass = 'badge-cat-operasional';
    let catLabel = r.kategori || 'OPERASIONAL';
    if (r.kategori === 'PENCAIRAN_BOS') {
      catBadgeClass = 'rekon-badge-bos';
      catLabel = '🏛️ PENCAIRAN BOS';
    } else if (r.kategori === 'BUNGA_BANK') {
      catBadgeClass = 'rekon-badge-bunga';
      catLabel = '📈 BUNGA BANK';
    } else if (r.kategori === 'SALDO_AWAL') {
      catBadgeClass = 'rekon-badge-saldo';
      catLabel = '⏮️ SALDO AWAL';
    } else if (r.kategori === 'GAJI_HONOR') {
      catBadgeClass = 'badge-cat-gaji';
      catLabel = '👥 GAJI & HONOR';
    } else if (r.kategori === 'LANGGANAN_DAYA_JASA') {
      catBadgeClass = 'badge-cat-daya';
      catLabel = '⚡ DAYA & INTERNET';
    } else if (r.kategori === 'BELANJA_SIPLAH') {
      catBadgeClass = 'badge-cat-siplah';
      catLabel = '🛒 SIPLAH';
    }

    // SI link column
    let siColHtml = '<span style="color: var(--text-muted); font-size: 0.78rem;">-</span>';
    if (r.matchedSI) {
      siColHtml = `
        <a href="#cetak-si" class="rekon-si-link" onclick="window.selectAndShowSIBatch('${r.matchedSI.id}')" title="Klik untuk cetak / lihat dokumen SI resmi">
          📑 ${r.matchedSI.nomorSI.split('/')[0]} (${r.matchedSI.nomorSI})
        </a>
      `;
    } else if (r.tipe === 'PENGELUARAN') {
      siColHtml = `
        <span style="color: #b45309; font-size: 0.75rem; font-weight: 600;">
          ⚠️ Belum direkam di SI
        </span>
      `;
    }

    // Status Rekon badge
    let statusBadgeHtml = '';
    if (r.tipe === 'PENERIMAAN') {
      if (r.kategori === 'PENCAIRAN_BOS') {
        statusBadgeHtml = '<span class="rekon-badge rekon-badge-bos">🏛️ BOS Masuk</span>';
      } else if (r.kategori === 'BUNGA_BANK') {
        statusBadgeHtml = '<span class="rekon-badge rekon-badge-bunga">📈 Jasa Giro</span>';
      } else {
        statusBadgeHtml = '<span class="rekon-badge rekon-badge-saldo">Saldo Awal</span>';
      }
    } else {
      if (r.isMatched) {
        statusBadgeHtml = '<span class="rekon-badge rekon-badge-match">🟢 100% Cocok</span>';
      } else {
        statusBadgeHtml = '<span class="rekon-badge rekon-badge-unmatch" title="Transaksi penarikan terekam di bank tapi belum terdaftar dokumen SI">🟡 Perlu Penyesuaian</span>';
      }
    }

    html += `
      <tr>
        <td style="text-align: center; color: var(--text-muted); font-size: 0.75rem;">${idx + 1}</td>
        <td style="font-family: var(--font-mono); font-size: 0.8rem; white-space: nowrap;">${formatDate(r.tanggal)}</td>
        <td style="font-weight: 600; color: var(--text-main);">
          ${escapeHtml(r.uraian)}
        </td>
        <td>
          <span class="rekon-badge ${catBadgeClass}">${catLabel}</span>
        </td>
        <td>${siColHtml}</td>
        <td class="table-num" style="color: ${r.debit > 0 ? '#15803d' : 'var(--text-muted)'}; font-family: var(--font-mono); font-weight: ${r.debit > 0 ? '700' : 'normal'};">
          ${r.debit > 0 ? formatRupiah(r.debit) : '-'}
        </td>
        <td class="table-num" style="color: ${r.kredit > 0 ? '#b91c1c' : 'var(--text-muted)'}; font-family: var(--font-mono); font-weight: ${r.kredit > 0 ? '700' : 'normal'};">
          ${r.kredit > 0 ? formatRupiah(r.kredit) : '-'}
        </td>
        <td class="table-num" style="color: #0284c7; font-family: var(--font-mono); font-weight: 700;">
          ${formatRupiah(r.saldo)}
        </td>
        <td style="text-align: center;">${statusBadgeHtml}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;

  const sumDebit = filtered.reduce((acc, r) => acc + (r.debit || 0), 0);
  const sumKredit = filtered.reduce((acc, r) => acc + (r.kredit || 0), 0);
  const lastSaldo = filtered.length > 0 ? filtered[filtered.length - 1].saldo : 0;
  updateMutasiFooters(filtered.length, sumDebit, sumKredit, lastSaldo);
}

function updateMutasiFooters(count, debit, kredit, saldo) {
  const rowCountText = document.getElementById('rekonRowCountText');
  const footerDebit = document.getElementById('rekonFooterDebit');
  const footerKredit = document.getElementById('rekonFooterKredit');
  const footerSaldo = document.getElementById('rekonFooterSaldo');

  if (rowCountText) rowCountText.textContent = `Menampilkan ${count} transaksi mutasi`;
  if (footerDebit) footerDebit.textContent = formatRupiah(debit);
  if (footerKredit) footerKredit.textContent = formatRupiah(kredit);
  if (footerSaldo) footerSaldo.textContent = formatRupiah(saldo);
}

// ---------------------------------------------------------
// Sub Tab 2: Render Audit Pencocokan SI vs Bank
// ---------------------------------------------------------
function renderPencocokanTable(bankData) {
  const tableBody = document.getElementById('rekonTableBodyPencocokan');
  if (!tableBody) return;

  const batches = getSIBatches() || [];
  const creditBankRows = bankData.filter(r => r.tipe === 'PENGELUARAN');

  let rowsHtml = '';
  let totalSIVal = 0;
  let totalBankVal = 0;
  let totalDiffVal = 0;

  // Map each SI batch and search corresponding bank transaction
  const matchedBankIds = new Set();
  const pairs = [];

  batches.forEach(b => {
    totalSIVal += b.totalNominal;
    const bankMatch = creditBankRows.find(cr => cr.kredit === b.totalNominal && !matchedBankIds.has(cr.id));
    if (bankMatch) {
      matchedBankIds.add(bankMatch.id);
      pairs.push({
        si: b,
        bank: bankMatch,
        status: 'MATCHED',
        diff: 0
      });
      totalBankVal += bankMatch.kredit;
    } else {
      pairs.push({
        si: b,
        bank: null,
        status: 'SI_NOT_IN_BANK',
        diff: b.totalNominal
      });
      totalDiffVal += b.totalNominal;
    }
  });

  // Check remaining credit bank transactions not matched with SI
  creditBankRows.forEach(cr => {
    if (!matchedBankIds.has(cr.id)) {
      totalBankVal += cr.kredit;
      totalDiffVal += cr.kredit;
      pairs.push({
        si: null,
        bank: cr,
        status: 'BANK_NOT_IN_SI',
        diff: cr.kredit
      });
    }
  });

  pairs.forEach((p, idx) => {
    const no = idx + 1;
    let siNomorHtml = '<span style="color: var(--text-muted); font-size: 0.8rem;">(Tidak ada dokumen)</span>';
    let siTglHtml = '-';
    let siNominalHtml = '-';
    let bankTglHtml = '-';
    let bankUraianHtml = '<span style="color: var(--text-muted); font-size: 0.8rem;">(Belum ditarik di bank)</span>';
    let bankNominalHtml = '-';
    let diffHtml = '<span style="color: #15803d; font-family: var(--font-mono); font-weight: 700;">Rp 0</span>';
    let statusBadge = '';

    if (p.si) {
      siNomorHtml = `
        <a href="#cetak-si" class="rekon-si-link" onclick="window.selectAndShowSIBatch('${p.si.id}')">
          📑 ${escapeHtml(p.si.nomorSI)}
        </a>
      `;
      siTglHtml = formatDate(p.si.tanggal);
      siNominalHtml = formatRupiah(p.si.totalNominal);
    }

    if (p.bank) {
      bankTglHtml = formatDate(p.bank.tanggal);
      bankUraianHtml = escapeHtml(p.bank.uraian);
      bankNominalHtml = formatRupiah(p.bank.kredit);
    }

    if (p.status === 'MATCHED') {
      statusBadge = '<span class="rekon-badge rekon-badge-match">🟢 100% Cocok</span>';
    } else if (p.status === 'BANK_NOT_IN_SI') {
      diffHtml = `<span style="color: #d97706; font-family: var(--font-mono); font-weight: 700;">+ ${formatRupiah(p.diff)}</span>`;
      statusBadge = '<span class="rekon-badge rekon-badge-unmatch" title="Penarikan di bank tanpa nomor SI di sistem">🟡 Transaksi Bank Baru</span>';
    } else {
      diffHtml = `<span style="color: #ef4444; font-family: var(--font-mono); font-weight: 700;">- ${formatRupiah(p.diff)}</span>`;
      statusBadge = '<span class="rekon-badge rekon-badge-unmatch">🔴 Belum Cair di Bank</span>';
    }

    rowsHtml += `
      <tr>
        <td style="text-align: center; color: var(--text-muted); font-size: 0.75rem;">${no}</td>
        <td>${siNomorHtml}</td>
        <td style="font-family: var(--font-mono); font-size: 0.78rem;">${siTglHtml}</td>
        <td class="table-num" style="color: #0284c7; font-family: var(--font-mono); font-weight: 700;">${siNominalHtml}</td>
        <td style="font-family: var(--font-mono); font-size: 0.78rem;">${bankTglHtml}</td>
        <td style="font-weight: 600;">${bankUraianHtml}</td>
        <td class="table-num" style="color: #b91c1c; font-family: var(--font-mono); font-weight: 700;">${bankNominalHtml}</td>
        <td class="table-num">${diffHtml}</td>
        <td style="text-align: center;">${statusBadge}</td>
      </tr>
    `;
  });

  tableBody.innerHTML = rowsHtml;

  const footerSI = document.getElementById('rekonAuditFooterSI');
  const footerBank = document.getElementById('rekonAuditFooterBank');
  const footerDiff = document.getElementById('rekonAuditFooterDiff');

  if (footerSI) footerSI.textContent = formatRupiah(totalSIVal);
  if (footerBank) footerBank.textContent = formatRupiah(totalBankVal);
  if (footerDiff) footerDiff.textContent = formatRupiah(totalDiffVal);
}

// ---------------------------------------------------------
// Sub Tab 3: Render Akumulasi Bunga Bank
// ---------------------------------------------------------
function renderBungaTable(bankData) {
  const tableBody = document.getElementById('rekonTableBodyBunga');
  if (!tableBody) return;

  const bungaRows = bankData.filter(r => r.kategori === 'BUNGA_BANK' || (r.debit > 0 && r.kategori === 'SALDO_AWAL'));

  let html = '';
  let runningBunga = 0;

  bungaRows.forEach((r, idx) => {
    runningBunga += r.debit;
    const month = (r.tanggal || '').split('-')[1];
    const monthName = getNamaBulan(month);

    html += `
      <tr>
        <td style="text-align: center; color: var(--text-muted); font-size: 0.75rem;">${idx + 1}</td>
        <td style="font-family: var(--font-mono); font-size: 0.82rem;">${formatDate(r.tanggal)}</td>
        <td style="font-weight: 700; color: #0284c7;">Bulan ${monthName} 2026</td>
        <td style="font-weight: 600;">${escapeHtml(r.uraian)}</td>
        <td class="table-num" style="color: #166534; font-family: var(--font-mono); font-weight: 700; font-size: 0.88rem;">
          + ${formatRupiah(r.debit)}
        </td>
        <td class="table-num" style="color: #0284c7; font-family: var(--font-mono); font-weight: 800; font-size: 0.88rem;">
          ${formatRupiah(runningBunga)}
        </td>
        <td style="text-align: center;">
          <span class="rekon-badge rekon-badge-bunga">🟢 Terkreditkan</span>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;

  const footerBunga = document.getElementById('rekonBungaFooterTotal');
  if (footerBunga) footerBunga.textContent = formatRupiah(runningBunga);
}

// =========================================================
// EXCEL EXPORT (MUTASI REKENING KORAN BJB)
// =========================================================

export function exportRekKoranToExcel() {
  try {
    const wb = XLSX.utils.book_new();
    const enriched = matchBankWithSIBatches();

    // Sheet 1: Rekening Koran BJB
    const dataSheet1 = [
      ['REKENING KORAN BANK BJB - BOSP SMAS FUTURE GATE TA 2026'],
      [`No. Rekening: ${REKENING_INFO.nomorRekening} | A.N: ${REKENING_INFO.namaRekening} | Cabang: ${REKENING_INFO.cabang}`],
      [''],
      ['No', 'Tanggal', 'Uraian Transaksi', 'Kategori', 'No. SI Terkait', 'Debet (Rp)', 'Kredit (Rp)', 'Saldo (Rp)', 'Status Rekon']
    ];

    enriched.forEach((r, i) => {
      dataSheet1.push([
        i + 1,
        r.tanggal,
        r.uraian,
        r.kategori,
        r.matchedSI ? r.matchedSI.nomorSI : '',
        r.debit || 0,
        r.kredit || 0,
        r.saldo || 0,
        r.isMatched ? 'MATCHED' : (r.tipe === 'PENERIMAAN' ? 'INCOME' : 'PENDING')
      ]);
    });

    const ws1 = XLSX.utils.aoa_to_sheet(dataSheet1);
    XLSX.utils.book_append_sheet(wb, ws1, 'Rek Koran BJB');

    // Sheet 2: Ringkasan Bunga Bank
    const bungaItems = enriched.filter(r => r.kategori === 'BUNGA_BANK' || r.kategori === 'SALDO_AWAL');
    const dataSheet2 = [
      ['AKUMULASI BUNGA BANK BJB BOSP 2026'],
      ['No', 'Tanggal', 'Uraian', 'Bunga Masuk (Rp)', 'Akumulasi (Rp)']
    ];
    let accum = 0;
    bungaItems.forEach((b, i) => {
      accum += b.debit;
      dataSheet2.push([i + 1, b.tanggal, b.uraian, b.debit, accum]);
    });

    const ws2 = XLSX.utils.aoa_to_sheet(dataSheet2);
    XLSX.utils.book_append_sheet(wb, ws2, 'Bunga Bank');

    XLSX.writeFile(wb, `Rekening_Koran_BJB_BOSP_2026_${new Date().toISOString().slice(0, 10)}.xlsx`);
    notifyToast('✅ Berhasil mengunduh Rekening Koran ke format Excel (.xlsx)!');
  } catch (err) {
    console.error('Export error:', err);
    notifyToast('❌ Gagal mengekspor Excel: ' + err.message);
  }
}

// =========================================================
// OFFICIAL PRINT STATEMENT (A4 FORMAT WITH KOP & SIGNATURE)
// =========================================================

export function printRekKoranOfficial() {
  const printArea = document.getElementById('rekonPrintArea');
  if (!printArea) return;

  const enriched = matchBankWithSIBatches();
  const totalDebit = enriched.reduce((acc, r) => acc + (r.debit || 0), 0);
  const totalKredit = enriched.reduce((acc, r) => acc + (r.kredit || 0), 0);
  const saldoAkhir = enriched.length > 0 ? enriched[enriched.length - 1].saldo : 0;
  const saldoAwal = enriched.length > 0 ? enriched[0].saldo : 3939563;

  let rowsHtml = '';
  enriched.forEach((r, i) => {
    rowsHtml += `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
        <td style="text-align: center; padding: 5px;">${i + 1}</td>
        <td style="white-space: nowrap; padding: 5px; font-family: monospace;">${formatDate(r.tanggal)}</td>
        <td style="padding: 5px; font-weight: 500;">${escapeHtml(r.uraian)}</td>
        <td style="padding: 5px; font-family: monospace; font-size: 10px;">${r.matchedSI ? r.matchedSI.nomorSI.split('/')[0] : '-'}</td>
        <td style="text-align: right; padding: 5px; font-family: monospace; color: ${r.debit > 0 ? '#15803d' : '#64748b'};">${r.debit > 0 ? formatNumber(r.debit) : '-'}</td>
        <td style="text-align: right; padding: 5px; font-family: monospace; color: ${r.kredit > 0 ? '#b91c1c' : '#64748b'};">${r.kredit > 0 ? formatNumber(r.kredit) : '-'}</td>
        <td style="text-align: right; padding: 5px; font-family: monospace; font-weight: bold; color: #0f172a;">${formatNumber(r.saldo)}</td>
      </tr>
    `;
  });

  printArea.innerHTML = `
    <div style="border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h2 style="margin: 0; font-size: 18px; color: #0284c7; font-weight: 900; letter-spacing: 0.5px;">BANK BJB — KCP JATIASIH BEKASI</h2>
          <h3 style="margin: 3px 0 0 0; font-size: 14px; color: #0f172a; font-weight: 700;">REKENING KORAN GIRO KHUSUS BOSP REGULER</h3>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #475569;">Laporan Resmi Mutasi Rekening Dana Bantuan Operasional Satuan Pendidikan</p>
        </div>
        <div style="text-align: right; font-size: 11px; color: #334155; line-height: 1.5;">
          <div>No. Rekening : <strong style="font-family: monospace; font-size: 13px; color: #0284c7;">${REKENING_INFO.nomorRekening || ''}</strong></div>
          <div>Nama Rekening: <strong>SMAS FUTURE GATE</strong></div>
          <div>Mata Uang    : <strong>IDR (Indonesian Rupiah)</strong></div>
          <div>Periode Buka : <strong>01 Jan 2026 s/d 31 Okt 2026</strong></div>
        </div>
      </div>
    </div>

    <!-- Summary Box -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px;">
      <div>
        <div style="font-size: 9px; color: #64748b; font-weight: bold;">SALDO AWAL</div>
        <div style="font-size: 12px; font-weight: bold; font-family: monospace; color: #334155;">${formatRupiah(saldoAwal)}</div>
      </div>
      <div>
        <div style="font-size: 9px; color: #64748b; font-weight: bold;">TOTAL DEBET (PENERIMAAN)</div>
        <div style="font-size: 12px; font-weight: bold; font-family: monospace; color: #15803d;">${formatRupiah(totalDebit)}</div>
      </div>
      <div>
        <div style="font-size: 9px; color: #64748b; font-weight: bold;">TOTAL KREDIT (PENGELUARAN)</div>
        <div style="font-size: 12px; font-weight: bold; font-family: monospace; color: #b91c1c;">${formatRupiah(totalKredit)}</div>
      </div>
      <div>
        <div style="font-size: 9px; color: #64748b; font-weight: bold;">SALDO AKHIR REKENING</div>
        <div style="font-size: 12px; font-weight: bold; font-family: monospace; color: #0284c7;">${formatRupiah(saldoAkhir)}</div>
      </div>
    </div>

    <!-- Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #94a3b8; font-size: 10px; text-transform: uppercase;">
          <th style="padding: 6px; text-align: center; width: 30px;">No</th>
          <th style="padding: 6px; text-align: left; width: 85px;">Tanggal</th>
          <th style="padding: 6px; text-align: left;">Uraian Transaksi</th>
          <th style="padding: 6px; text-align: left; width: 75px;">No. SI</th>
          <th style="padding: 6px; text-align: right; width: 100px;">Debet (Rp)</th>
          <th style="padding: 6px; text-align: right; width: 100px;">Kredit (Rp)</th>
          <th style="padding: 6px; text-align: right; width: 105px;">Saldo (Rp)</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr style="border-top: 2px solid #0f172a; font-weight: bold; font-size: 11px; background: #f8fafc;">
          <td colspan="4" style="text-align: right; padding: 7px;">TOTAL MUTASI TRANSAKSI:</td>
          <td style="text-align: right; padding: 7px; font-family: monospace; color: #15803d;">${formatRupiah(totalDebit)}</td>
          <td style="text-align: right; padding: 7px; font-family: monospace; color: #b91c1c;">${formatRupiah(totalKredit)}</td>
          <td style="text-align: right; padding: 7px; font-family: monospace; color: #0284c7;">${formatRupiah(saldoAkhir)}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Signature Footer -->
    <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 11px; page-break-inside: avoid;">
      <div style="text-align: center; width: 220px;">
        <div>Mengetahui,</div>
        <div style="font-weight: bold;">Kepala Sekolah SMAS Future Gate</div>
        <div style="height: 55px;"></div>
        <div style="font-weight: bold; text-decoration: underline;">H. M. Lili Ramli, S.Pd., M.M.</div>
        <div style="color: #64748b; font-size: 10px;">NIP / NUPTK: -</div>
      </div>
      <div style="text-align: center; width: 220px;">
        <div>Bekasi, 31 Oktober 2026</div>
        <div style="font-weight: bold;">Bendahara BOS SMAS FG</div>
        <div style="height: 55px;"></div>
        <div style="font-weight: bold; text-decoration: underline;">Iwan Ichwanudin</div>
        <div style="color: #64748b; font-size: 10px;">Bendahara Pengeluaran BJB</div>
      </div>
    </div>
  `;

  document.body.classList.add('printing-rekon');
  window.print();
  setTimeout(() => {
    document.body.classList.remove('printing-rekon');
  }, 1000);
}

// =========================================================
// SYNC & UPLOAD MODAL LOGIC
// =========================================================

export function openUploadRekKoranModal() {
  const modal = document.getElementById('modalUploadRekKoran');
  if (modal) modal.classList.add('active');
  pendingUploadedTransactions = null;
  const btnSave = document.getElementById('btnSaveUploadedRekKoran');
  if (btnSave) btnSave.disabled = true;
  const previewBox = document.getElementById('rekKoranUploadPreview');
  if (previewBox) previewBox.style.display = 'none';
}

export function closeUploadRekKoranModal() {
  const modal = document.getElementById('modalUploadRekKoran');
  if (modal) modal.classList.remove('active');
  pendingUploadedTransactions = null;
}

export function handleFileSelection(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });

      // Look for sheet 'Rek Koran' or fallback to first sheet
      let sheetName = wb.SheetNames.find(s => s.toLowerCase().includes('rek') && s.toLowerCase().includes('koran')) || wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];

      const parsed = parseRekKoranSheet(ws);
      if (!parsed || parsed.length === 0) {
        throw new Error(`Tidak ditemukan transaksi valid di sheet '${sheetName}'.`);
      }

      pendingUploadedTransactions = parsed;

      const previewBox = document.getElementById('rekKoranUploadPreview');
      const previewFileName = document.getElementById('rekKoranPreviewFileName');
      const previewDetails = document.getElementById('rekKoranPreviewDetails');
      const btnSave = document.getElementById('btnSaveUploadedRekKoran');

      if (previewBox && previewFileName && previewDetails) {
        previewBox.style.display = 'block';
        previewFileName.textContent = `📄 File: ${file.name} (Sheet: ${sheetName})`;
        const debitSum = parsed.reduce((a, b) => a + b.debit, 0);
        const creditSum = parsed.reduce((a, b) => a + b.kredit, 0);
        const lastBal = parsed[parsed.length - 1].saldo;

        previewDetails.innerHTML = `
          <div>Jumlah Baris: <strong>${parsed.length} transaksi</strong></div>
          <div>Total Debet: <strong>${formatRupiah(debitSum)}</strong></div>
          <div>Total Kredit: <strong>${formatRupiah(creditSum)}</strong></div>
          <div>Saldo Akhir: <strong style="color: #0284c7;">${formatRupiah(lastBal)}</strong></div>
        `;
      }

      if (btnSave) btnSave.disabled = false;
      notifyToast(`📁 File berhasil dibaca (${parsed.length} transaksi). Klik tombol simpan.`);
    } catch (err) {
      console.error('File read error:', err);
      notifyToast('❌ Gagal membaca file Excel: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

export function applyPendingUploadedData() {
  if (!pendingUploadedTransactions || pendingUploadedTransactions.length === 0) return;
  rekKoranList = pendingUploadedTransactions;
  saveRekKoranData();
  renderRekonsiliasi();
  closeUploadRekKoranModal();
  notifyToast(`✅ Rekonsiliasi diperbarui dengan ${rekKoranList.length} transaksi dari file!`);
}

// Parser for sheet 'Rek Koran'
function parseRekKoranSheet(ws) {
  const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const transactions = [];
  let lastDate = '';

  for (let i = 2; i <= 44 && i < rawData.length; i++) {
    const r = rawData[i];
    if (!r || r.length === 0) continue;

    let dStr = excelDateToISO(r[0]);
    if (dStr) lastDate = dStr;
    else dStr = lastDate;

    let uraian = (r[1] || '').trim();
    if (!uraian && i === 2) {
      uraian = 'Saldo Awal Tahun';
    }

    const debit = typeof r[2] === 'number' ? r[2] : 0;
    const kredit = typeof r[3] === 'number' ? r[3] : 0;
    const saldo = typeof r[4] === 'number' ? r[4] : 0;

    if (debit === 0 && kredit === 0 && !uraian) continue;

    let tipe = 'PENGELUARAN';
    let kategori = 'BELANJA_OPERASIONAL';

    if (debit > 0) {
      tipe = 'PENERIMAAN';
      if (uraian.toLowerCase().includes('cair')) {
        kategori = 'PENCAIRAN_BOS';
      } else if (uraian.toLowerCase().includes('bunga')) {
        kategori = 'BUNGA_BANK';
      } else {
        kategori = 'SALDO_AWAL';
      }
    } else if (uraian.toLowerCase().includes('gaji')) {
      kategori = 'GAJI_HONOR';
    } else if (uraian.toLowerCase().includes('listrik') || uraian.toLowerCase().includes('internet')) {
      kategori = 'LANGGANAN_DAYA_JASA';
    } else if (uraian.toLowerCase().includes('siplah')) {
      kategori = 'BELANJA_SIPLAH';
    }

    transactions.push({
      id: 'RK-' + String(transactions.length + 1).padStart(3, '0'),
      rowIndex: i + 1,
      serialDate: r[0] || null,
      tanggal: dStr,
      uraian: uraian,
      tipe: tipe,
      kategori: kategori,
      debit: debit,
      kredit: kredit,
      saldo: saldo
    });
  }

  return transactions;
}

// Utility HTML escape
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =========================================================
// INITIALIZE REKONSILIASI MODULE & EVENT LISTENERS
// =========================================================

export function initRekonsiliasi(siBatchesProvider, toastNotifier, options = {}) {
  getSIBatches = siBatchesProvider || (() => []);
  notifyToast = toastNotifier || ((msg) => console.log(msg));
  canWrite = Boolean(options.canWrite);
  onRekChange = options.onChange || (() => {});

  // Tab switching buttons
  const btnTabMutasi = document.getElementById('btnTabRekKoranMutasi');
  const btnTabPencocokan = document.getElementById('btnTabRekKoranPencocokan');
  const btnTabBunga = document.getElementById('btnTabRekKoranBunga');

  const containerMutasi = document.getElementById('rekonContainerMutasi');
  const containerPencocokan = document.getElementById('rekonContainerPencocokan');
  const containerBunga = document.getElementById('rekonContainerBunga');

  function setSubTab(tabName) {
    currentSubTab = tabName;
    [btnTabMutasi, btnTabPencocokan, btnTabBunga].forEach(b => b?.classList.remove('active'));

    if (tabName === 'mutasi') {
      btnTabMutasi?.classList.add('active');
      if (containerMutasi) containerMutasi.style.display = 'block';
      if (containerPencocokan) containerPencocokan.style.display = 'none';
      if (containerBunga) containerBunga.style.display = 'none';
    } else if (tabName === 'pencocokan') {
      btnTabPencocokan?.classList.add('active');
      if (containerMutasi) containerMutasi.style.display = 'none';
      if (containerPencocokan) containerPencocokan.style.display = 'block';
      if (containerBunga) containerBunga.style.display = 'none';
    } else if (tabName === 'bunga') {
      btnTabBunga?.classList.add('active');
      if (containerMutasi) containerMutasi.style.display = 'none';
      if (containerPencocokan) containerPencocokan.style.display = 'none';
      if (containerBunga) containerBunga.style.display = 'block';
    }

    renderRekonsiliasi();
  }

  btnTabMutasi?.addEventListener('click', () => setSubTab('mutasi'));
  btnTabPencocokan?.addEventListener('click', () => setSubTab('pencocokan'));
  btnTabBunga?.addEventListener('click', () => setSubTab('bunga'));

  // Filters & Search
  document.getElementById('rekonFilterTipe')?.addEventListener('change', () => renderRekonsiliasi());
  document.getElementById('rekonFilterBulan')?.addEventListener('change', () => renderRekonsiliasi());
  document.getElementById('rekonFilterStatus')?.addEventListener('change', () => renderRekonsiliasi());
  document.getElementById('rekonSearchInput')?.addEventListener('input', () => renderRekonsiliasi());

  // Upload Modal Events
  document.getElementById('btnSaveUploadedRekKoran')?.addEventListener('click', applyPendingUploadedData);

  const dropzone = document.getElementById('rekKoranDropzone');
  const fileInput = document.getElementById('rekKoranFileInput');

  dropzone?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  });

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '#0284c7';
    dropzone.style.background = '#eff6ff';
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.style.borderColor = '#93c5fd';
    dropzone.style.background = '#f8fafc';
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '#93c5fd';
    dropzone.style.background = '#f8fafc';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  });

  // Attach global functions for HTML onclick
  window.openUploadRekKoranModal = openUploadRekKoranModal;
  window.closeUploadRekKoranModal = closeUploadRekKoranModal;
  window.exportRekKoranToExcel = exportRekKoranToExcel;
  window.printRekKoranOfficial = printRekKoranOfficial;
}

