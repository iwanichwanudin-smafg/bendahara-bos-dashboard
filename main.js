// =========================================================
// MAIN.JS - DASHBOARD BENDAHARA BOSKU (SMAS FUTURE GATE)
// Logika Aplikasi Ringkas, Bersih, dan Reaktif
// =========================================================

import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import {
  PROFIL_SEKOLAH,
  PAGU_DATA,
  INITIAL_SI_BATCHES,
  INITIAL_TRANSAKSI_LIST
} from './src/data/initialData.js';
import {
  formatRupiah,
  formatNumber,
  formatDate,
  terbilang
} from './src/utils/format.js';

// =========================================================
// 1. STATE MANAGEMENT & LOCAL STORAGE PERSISTENCE
// =========================================================

const STORAGE_KEY_TRX = 'bosku_transaksi_items_2026';
const STORAGE_KEY_SI = 'bosku_si_batches_2026';

let transaksiList = [];
let siBatches = [];
let activeSIBatchId = null;
let currentParsedSI = null;
let budgetBarChartInstance = null;
let categoryPieChartInstance = null;
let currentBarMode = 'stacked'; // 'stacked', 'grouped', or 'percent'
let currentCetakTab = 'surat'; // 'surat' or 'lampiran'

function getActiveSIBatch() {
  if (!siBatches || siBatches.length === 0) return null;
  if (!activeSIBatchId || activeSIBatchId === 'ALL') return null;
  const found = siBatches.find(b => b.id === activeSIBatchId);
  return found || null;
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.innerHTML = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// =========================================================
// CHRONOLOGICAL SORTING HELPERS (Oldest to Newest)
// =========================================================

export function sortSIBatchesChronological(batches) {
  if (!Array.isArray(batches)) return [];
  return [...batches].sort((a, b) => {
    const dateA = a.tanggal || '';
    const dateB = b.tanggal || '';
    if (dateA !== dateB) {
      return dateA.localeCompare(dateB);
    }
    const numA = parseInt((a.nomorSI || '').match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt((b.nomorSI || '').match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  });
}

export function sortTransaksiChronological(items) {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const dateA = a.tanggal || '';
    const dateB = b.tanggal || '';
    if (dateA !== dateB) {
      return dateA.localeCompare(dateB);
    }
    const numA = parseInt((a.noSI || '').match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt((b.noSI || '').match(/\d+/)?.[0] || '0', 10);
    if (numA !== numB) {
      return numA - numB;
    }
    return (a.id || '').localeCompare(b.id || '');
  });
}

const CURRENT_DATA_VERSION = 'bosku_30_si_official_clean_v11';

function loadData() {
  const currentVersionInStorage = localStorage.getItem('bosku_dataset_version');
  const isUserExplicitEmpty = localStorage.getItem('bosku_explicit_empty') === 'true';

  if (isUserExplicitEmpty) {
    siBatches = [];
    transaksiList = [];
    activeSIBatchId = null;
    return;
  }

  // If storage is from an old version or unversioned, purge cache and initialize clean 30 SI
  if (currentVersionInStorage !== CURRENT_DATA_VERSION) {
    console.log('🔄 Menginisialisasi 30 SI Resmi BJB (Feb - Okt 2026)...');
    localStorage.removeItem(STORAGE_KEY_SI);
    localStorage.removeItem(STORAGE_KEY_TRX);
    localStorage.removeItem('bosku_explicit_empty');
    localStorage.setItem('bosku_dataset_version', CURRENT_DATA_VERSION);

    siBatches = sortSIBatchesChronological(JSON.parse(JSON.stringify(INITIAL_SI_BATCHES)));
    transaksiList = sortTransaksiChronological(JSON.parse(JSON.stringify(INITIAL_TRANSAKSI_LIST)));
    activeSIBatchId = 'ALL';
    saveData();
    return;
  }

  let savedSIList = [];
  let savedTrxList = [];

  try {
    const rawSI = localStorage.getItem(STORAGE_KEY_SI);
    if (rawSI) savedSIList = JSON.parse(rawSI);
  } catch (e) {
    console.error('Error parsing saved SI:', e);
  }

  try {
    const rawTrx = localStorage.getItem(STORAGE_KEY_TRX);
    if (rawTrx) savedTrxList = JSON.parse(rawTrx);
  } catch (e) {
    console.error('Error parsing saved Transaksi:', e);
  }

  // Gunakan data tersimpan dari user secara langsung (tanpa merge paksa yg membangkitkan transaksi lama)
  if (Array.isArray(savedSIList) && savedSIList.length > 0) {
    siBatches = sortSIBatchesChronological(savedSIList);
  } else {
    siBatches = sortSIBatchesChronological(JSON.parse(JSON.stringify(INITIAL_SI_BATCHES)));
  }

  if (Array.isArray(savedTrxList) && savedTrxList.length > 0) {
    // Pastikan tidak ada ID transaksi duplikat
    const seenIds = new Set();
    const cleanTrx = [];
    savedTrxList.forEach(t => {
      if (t && t.id && !seenIds.has(t.id)) {
        seenIds.add(t.id);
        cleanTrx.push(t);
      }
    });
    transaksiList = sortTransaksiChronological(cleanTrx);
  } else {
    transaksiList = sortTransaksiChronological(JSON.parse(JSON.stringify(INITIAL_TRANSAKSI_LIST)));
  }

  if (!activeSIBatchId || (activeSIBatchId !== 'ALL' && !siBatches.some(b => b.id === activeSIBatchId))) {
    activeSIBatchId = 'ALL';
  }

  saveData();
}

function saveData() {
  try {
    siBatches = sortSIBatchesChronological(siBatches);
    const seenIds = new Set();
    transaksiList = transaksiList.filter(t => {
      if (!t || !t.id) return false;
      if (seenIds.has(t.id)) return false;
      seenIds.add(t.id);
      return true;
    });
    transaksiList = sortTransaksiChronological(transaksiList);
    localStorage.setItem(STORAGE_KEY_TRX, JSON.stringify(transaksiList));
    localStorage.setItem(STORAGE_KEY_SI, JSON.stringify(siBatches));
    localStorage.setItem('bosku_dataset_version', CURRENT_DATA_VERSION);
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
  }
}

window.resetKe30SIResmi = function() {
  const confirmed = confirm('Reset dan tampilkan ulang 30 Dokumen SI Resmi BJB (Februari - Oktober 2026)?\n\nSemua nomor surat, tanggal, dan rincian belanja akan disinkronkan kembali.');
  if (confirmed) {
    localStorage.removeItem(STORAGE_KEY_SI);
    localStorage.removeItem(STORAGE_KEY_TRX);
    localStorage.removeItem('bosku_explicit_empty');
    localStorage.setItem('bosku_dataset_version', CURRENT_DATA_VERSION);

    siBatches = sortSIBatchesChronological(JSON.parse(JSON.stringify(INITIAL_SI_BATCHES)));
    transaksiList = sortTransaksiChronological(JSON.parse(JSON.stringify(INITIAL_TRANSAKSI_LIST)));
    activeSIBatchId = 'ALL';
    saveData();
    renderAll();
    showToast('✅ <strong>30 SI Resmi Berhasil Disinkronkan!</strong> Data tampil bersih dan terurut.');
  }
};

window.kosongkanSemuaTransaksi = function() {
  const confirmed = confirm('Apakah Anda yakin ingin mengosongkan SELURUH data transaksi dan dokumen SI?\n\nDashboard akan kembali bersih (0 realisasi, 100% saldo kas) siap untuk mengunggah dokumen SI yang sebenarnya.');
  if (confirmed) {
    transaksiList = [];
    siBatches = [];
    activeSIBatchId = null;
    localStorage.setItem('bosku_explicit_empty', 'true');
    saveData();
    renderAll();
    showToast('🗑️ <strong>Semua data transaksi & SI berhasil dikosongkan.</strong> Dashboard sekarang siap untuk upload dokumen SI baru.');
  }
};

// =========================================================
// 2. COMPUTED METRICS
// =========================================================

function getMetrics() {
  const totalPagu = PAGU_DATA.totalPaguNetto;
  const totalRealisasi = transaksiList.reduce((sum, item) => sum + (Number(item.totalNominal || item.nominal || item.netto) || 0), 0);
  const sisaKas = totalPagu - totalRealisasi;
  const pctRealisasi = totalPagu > 0 ? ((totalRealisasi / totalPagu) * 100).toFixed(2) : 0;

  // Breakdown per Unit
  const unitStats = PAGU_DATA.units.map(unit => {
    const realisasiUnit = transaksiList
      .filter(item => item.unitId === unit.id)
      .reduce((sum, item) => sum + (Number(item.totalNominal || item.nominal || item.netto) || 0), 0);
    const sisa = unit.pagu - realisasiUnit;
    const pct = unit.pagu > 0 ? ((realisasiUnit / unit.pagu) * 100).toFixed(1) : 0;
    return {
      ...unit,
      realisasi: realisasiUnit,
      sisa: sisa,
      pct: pct
    };
  });

  // Breakdown per Kategori
  const kategoriList = ['Operasional', 'Modal', 'Buku', 'Honor'];
  const kategoriStats = kategoriList.map(kat => {
    const total = transaksiList
      .filter(item => (item.kategori || '').toLowerCase() === kat.toLowerCase())
      .reduce((sum, item) => sum + (Number(item.totalNominal || item.nominal || item.netto) || 0), 0);
    const pct = totalRealisasi > 0 ? ((total / totalRealisasi) * 100).toFixed(1) : 0;
    return { kategori: kat, total, pct };
  });

  return {
    totalPagu,
    totalRealisasi,
    sisaKas,
    pctRealisasi,
    unitStats,
    kategoriStats,
    totalItemsCount: transaksiList.length
  };
}

// =========================================================
// 3. RENDER VIEWS
// =========================================================

// --- DASHBOARD ---
function renderDashboard() {
  const metrics = getMetrics();

  // 1. Metric Cards
  const elPagu = document.getElementById('cardPaguTotal');
  const elRealisasi = document.getElementById('cardRealisasiTotal');
  const elSisaKas = document.getElementById('cardSisaKas');
  const elTotalItem = document.getElementById('cardTotalItem');
  const elPctRealisasi = document.getElementById('badgePctRealisasi');

  if (elPagu) elPagu.textContent = formatRupiah(metrics.totalPagu);
  if (elRealisasi) elRealisasi.textContent = formatRupiah(metrics.totalRealisasi);
  if (elSisaKas) elSisaKas.textContent = formatRupiah(metrics.sisaKas);
  if (elTotalItem) elTotalItem.textContent = `${metrics.totalItemsCount} Item`;
  if (elPctRealisasi) elPctRealisasi.textContent = `${metrics.pctRealisasi}%`;

  const badgeDetailRealisasi = document.getElementById('badgeDetailRealisasi');
  if (badgeDetailRealisasi) {
    if (siBatches.length > 0) {
      badgeDetailRealisasi.textContent = `Dari ${siBatches.length} Dokumen SI`;
    } else {
      badgeDetailRealisasi.textContent = 'Belum ada transaksi SI';
    }
  }

  const badgeTotalBatch = document.getElementById('badgeTotalBatch');
  if (badgeTotalBatch) {
    badgeTotalBatch.textContent = `${siBatches.length} Batch Transfer`;
  }

  // 2. Diagram Batang Modern: Alokasi Pagu & Realisasi per Unit
  renderBudgetBarChart(metrics);

  // 3. Grafik Pie: Komposisi Belanja per Kategori
  renderCategoryPieChart(metrics.kategoriStats);

  // 4. Pagu & Anggaran per Unit on Dashboard
  renderPaguDashboardTable(metrics);

  // 5. Data Dokumen SI Bank BJB on Dashboard (di bawah data pagu)
  renderSIDashboardSection(metrics);

  // Render Table Rekap Seluruh Dokumen SI (Urut Paling Lama ke Paling Baru)
  const allBatchesBody = document.getElementById('siAllBatchesTableBody');
  if (allBatchesBody) {
    if (siBatches.length === 0) {
      allBatchesBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted);">
            Belum ada dokumen SI yang terdaftar.
          </td>
        </tr>
      `;
    } else {
      allBatchesBody.innerHTML = siBatches.map((b, idx) => {
        const isActive = b.id === activeBatch?.id;
        return `
          <tr style="${isActive ? 'background: #f0fdf4;' : ''}">
            <td style="font-weight: 700; text-align: center;">${idx + 1}</td>
            <td style="white-space: nowrap; font-size: 0.82rem; font-weight: 600;">
              📅 ${b.tanggalFormat || formatDate(b.tanggal)}
            </td>
            <td>
              <strong style="color: var(--accent-primary); font-family: var(--font-mono);">${b.nomorSI}</strong>
              ${isActive ? '<span class="stat-badge green" style="margin-left: 6px; font-size: 0.7rem;">Aktif</span>' : ''}
            </td>
            <td style="font-size: 0.82rem; max-width: 280px; color: var(--text-main);">
              ${b.perihal || 'Surat Perintah Pemindahbukuan'}
            </td>
            <td style="text-align: center; font-weight: 700;">
              ${b.transfers.length} Transfer
            </td>
            <td class="table-num" style="font-weight: 700; color: #0284c7;">
              ${formatRupiah(b.totalNominal)}
            </td>
            <td style="text-align: center;">
              <span class="stat-badge green">✓ ${b.statusBadge || 'Lunas / Cair'}</span>
            </td>
            <td style="text-align: center; white-space: nowrap;">
              <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.78rem; margin-right: 4px;" onclick="window.selectAndShowSIBatch('${b.id}')">
                🔍 Buka SI
              </button>
              <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.78rem; border-color: #059669; color: #059669;" onclick="window.printSIBatch('${b.id}')">
                🖨️ Cetak
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

// Helper format Rupiah Ringkas untuk kartu eksekutif (misal: Rp 517,8 Jt)
function formatRupiahShort(val) {
  const num = Number(val) || 0;
  if (num === 0) return 'Rp 0';
  if (num >= 1000000000) {
    return 'Rp ' + (num / 1000000000).toFixed(2).replace('.', ',') + ' M';
  }
  if (num >= 1000000) {
    return 'Rp ' + (num / 1000000).toFixed(1).replace('.', ',') + ' Jt';
  }
  return formatRupiah(num);
}

// =========================================================
// DIAGRAM BATANG MODERN: ALOKASI PAGU VS REALISASI PER UNIT
// Desain Bersih, Elegan, Tidak Terlalu Banyak Data (Clutter-Free)
// =========================================================
function renderBudgetBarChart(metrics) {
  const canvas = document.getElementById('budgetBarChart');
  if (!canvas) return;

  const labels = metrics.unitStats.map(u => u.nama);
  const paguData = metrics.unitStats.map(u => u.pagu);
  const realisasiData = metrics.unitStats.map(u => u.realisasi);

  if (budgetBarChartInstance) {
    budgetBarChartInstance.destroy();
  }

  // Linear vertical gradients for sleek, premium executive look
  function createBarGradient(colorBottom, colorTop) {
    return function(context) {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      if (!chartArea) {
        return colorTop;
      }
      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, colorBottom);
      gradient.addColorStop(1, colorTop);
      return gradient;
    };
  }

  budgetBarChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Plafon Pagu BOS',
          data: paguData,
          backgroundColor: createBarGradient('#0891b2', '#22d3ee'),
          hoverBackgroundColor: createBarGradient('#0e7490', '#67e8f9'),
          borderColor: '#06b6d4',
          borderWidth: 1.5,
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.65,
          categoryPercentage: 0.6,
        },
        {
          label: 'Realisasi Belanja SI',
          data: realisasiData,
          backgroundColor: createBarGradient('#e11d48', '#fb7185'),
          hoverBackgroundColor: createBarGradient('#be123c', '#fda4af'),
          borderColor: '#f43f5e',
          borderWidth: 1.5,
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.65,
          categoryPercentage: 0.6,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
        easing: 'easeOutQuart'
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false, // Menggunakan legend pill di header panel agar bersih
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#ffffff',
          titleFont: {
            family: 'Plus Jakarta Sans, sans-serif',
            size: 13,
            weight: '700'
          },
          bodyColor: '#f1f5f9',
          bodyFont: {
            family: 'Plus Jakarta Sans, sans-serif',
            size: 12
          },
          padding: 12,
          boxPadding: 6,
          cornerRadius: 8,
          borderColor: '#334155',
          borderWidth: 1,
          callbacks: {
            title: function(items) {
              const idx = items[0].dataIndex;
              const u = metrics.unitStats[idx];
              return `${u.nama} (${u.siswa} Siswa BOS)`;
            },
            label: function(context) {
              const val = context.raw || 0;
              return ` ${context.dataset.label}: ${formatRupiah(val)}`;
            },
            afterBody: function(items) {
              const idx = items[0].dataIndex;
              const u = metrics.unitStats[idx];
              const lines = [
                ` Sisa Kas Tersedia: ${formatRupiah(u.sisa)}`,
                ` Persentase Serapan: ${u.pct}%`
              ];
              if (u.talanganFKSS) {
                lines.push(` *Termasuk talangan FKSS: ${formatRupiah(u.talanganFKSS)}`);
              }
              return lines;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#475569',
            font: {
              family: 'Plus Jakarta Sans, sans-serif',
              size: 11,
              weight: '700'
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(226, 232, 240, 0.8)',
            borderDash: [3, 3],
            drawBorder: false,
          },
          ticks: {
            color: '#94a3b8',
            font: {
              family: 'JetBrains Mono, monospace',
              size: 10,
            },
            callback: function(val) {
              if (val === 0) return '0';
              if (val >= 1000000000) return (val / 1000000000).toFixed(1).replace('.', ',') + ' M';
              if (val >= 1000000) return (val / 1000000).toFixed(0) + ' Jt';
              return val;
            }
          }
        }
      }
    }
  });
}

// --- GRAFIK PIE / DOUGHNUT MODERN: PERSENTASE BELANJA PER KATEGORI ---
function renderCategoryPieChart(kategoriStats) {
  const canvas = document.getElementById('categoryPieChart');
  if (!canvas) return;

  const gradientPairs = [
    ['#1d4ed8', '#38bdf8'], // Operasional: Royal Blue -> Sky Blue
    ['#6d28d9', '#c084fc'], // Modal: Deep Violet -> Luminous Purple
    ['#d97706', '#fcd34d'], // Buku: Amber Gold -> Radiant Yellow
    ['#be185d', '#f472b6']  // Honor: Deep Rose -> Vivid Bright Pink
  ];

  const legendGradients = [
    'linear-gradient(135deg, #1d4ed8, #38bdf8)',
    'linear-gradient(135deg, #6d28d9, #c084fc)',
    'linear-gradient(135deg, #d97706, #fcd34d)',
    'linear-gradient(135deg, #be185d, #f472b6)'
  ];

  function getPieSliceGradient(context) {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) {
      return gradientPairs[context.dataIndex % gradientPairs.length][0];
    }
    const idx = context.dataIndex % gradientPairs.length;
    const pair = gradientPairs[idx];
    const gradient = ctx.createLinearGradient(chartArea.left, chartArea.top, chartArea.right, chartArea.bottom);
    gradient.addColorStop(0, pair[0]);
    gradient.addColorStop(1, pair[1]);
    return gradient;
  }

  function getPieSliceHoverGradient(context) {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) {
      return gradientPairs[context.dataIndex % gradientPairs.length][1];
    }
    const idx = context.dataIndex % gradientPairs.length;
    const pair = gradientPairs[idx];
    const gradient = ctx.createLinearGradient(chartArea.left, chartArea.bottom, chartArea.right, chartArea.top);
    gradient.addColorStop(0, pair[1]);
    gradient.addColorStop(1, pair[0]);
    return gradient;
  }

  const labels = kategoriStats.map(k => k.kategori);
  const data = kategoriStats.map(k => k.total);
  const totalAll = data.reduce((a, b) => a + b, 0);

  // Update Center Metric Value inside the Donut
  const centerAmount = document.getElementById('pieCenterAmount');
  if (centerAmount) {
    centerAmount.textContent = formatRupiah(totalAll);
  }

  if (categoryPieChartInstance) {
    categoryPieChartInstance.destroy();
  }

  if (totalAll === 0) {
    categoryPieChartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Belum Ada Realisasi Belanja'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e2e8f0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        cutout: '72%'
      }
    });

    const legendsEl = document.getElementById('categoryLegends');
    if (legendsEl) {
      legendsEl.innerHTML = kategoriStats.map((k, idx) => `
        <div class="legend-card">
          <div class="legend-title">
            <span class="legend-dot" style="background: ${legendGradients[idx]}; box-shadow: 0 1px 4px ${gradientPairs[idx][1]}60;"></span>
            <span>${k.kategori} (0%)</span>
          </div>
          <div class="legend-value">Rp 0</div>
        </div>
      `).join('');
    }
    return;
  }

  categoryPieChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: getPieSliceGradient,
        hoverBackgroundColor: getPieSliceHoverGradient,
        borderWidth: 2.5,
        borderColor: '#ffffff',
        spacing: 4,
        borderRadius: 8,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#e2e8f0',
          padding: 12,
          cornerRadius: 10,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: { family: "'Plus Jakarta Sans', sans-serif", weight: '700', size: 13 },
          bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const pct = totalAll > 0 ? ((value / totalAll) * 100).toFixed(1) : 0;
              return ` ${label}: ${formatRupiah(value)} (${pct}%)`;
            }
          }
        }
      },
      cutout: '72%'
    }
  });

  // Render Legends Grid with luminous gradients
  const legendsEl = document.getElementById('categoryLegends');
  if (legendsEl) {
    legendsEl.innerHTML = kategoriStats.map((k, idx) => `
      <div class="legend-card">
        <div class="legend-title">
          <span class="legend-dot" style="background: ${legendGradients[idx]}; box-shadow: 0 1px 4px ${gradientPairs[idx][1]}60;"></span>
          <span>${k.kategori} (${k.pct}%)</span>
        </div>
        <div class="legend-value">${formatRupiah(k.total)}</div>
      </div>
    `).join('');
  }
}

// --- PAGU & ANGGARAN UNIT (DASHBOARD & TAB PAGU) ---
function renderPaguDashboardTable(metrics) {
  const tbody = document.getElementById('dashboardPaguTableBody');
  const tfoot = document.getElementById('dashboardPaguTableFoot');
  if (!tbody) return;

  const unitStats = metrics?.unitStats || PAGU_DATA.units.map(unit => {
    const realisasiUnit = transaksiList
      .filter(item => item.unitId === unit.id)
      .reduce((sum, item) => sum + (Number(item.totalNominal || item.nominal || item.netto) || 0), 0);
    const sisa = unit.pagu - realisasiUnit;
    const pct = unit.pagu > 0 ? ((realisasiUnit / unit.pagu) * 100).toFixed(1) : 0;
    return { ...unit, realisasi: realisasiUnit, sisa, pct };
  });

  const totalSiswa = unitStats.reduce((sum, u) => sum + (u.siswa || 0), 0);
  const totalPaguMurni = unitStats.reduce((sum, u) => sum + (u.paguMurni || 0), 0);
  const totalTalanganFKSS = unitStats.reduce((sum, u) => sum + (u.talanganFKSS || 0), 0);
  const totalPaguBJB = unitStats.reduce((sum, u) => sum + (u.pagu || 0), 0);
  const totalRealisasi = unitStats.reduce((sum, u) => sum + (u.realisasi || 0), 0);
  const totalSisa = totalPaguBJB - totalRealisasi;
  const overallPct = totalPaguBJB > 0 ? ((totalRealisasi / totalPaguBJB) * 100).toFixed(2) : 0;

  // Mini summary cards on Dashboard
  const elRealisasi = document.getElementById('dashPaguTotalRealisasi');
  const elPct = document.getElementById('dashPaguTotalPct');
  const elSisa = document.getElementById('dashPaguTotalSisa');
  if (elRealisasi) elRealisasi.textContent = formatRupiah(totalRealisasi);
  if (elPct) elPct.textContent = `${overallPct}% Terserap`;
  if (elSisa) elSisa.textContent = formatRupiah(totalSisa);

  tbody.innerHTML = unitStats.map((u, idx) => {
    const pctNum = parseFloat(u.pct) || 0;
    let badgeColor = 'green';
    let statusText = 'Normal';

    if (pctNum >= 90) {
      badgeColor = 'amber';
      statusText = 'Hampir Habis';
    } else if (pctNum >= 75) {
      badgeColor = 'blue';
      statusText = 'Penyerapan Baik';
    } else {
      badgeColor = 'green';
      statusText = 'Tersedia';
    }

    const trxCount = transaksiList.filter(t => t.unitId === u.id).length;

    return `
      <tr>
        <td style="font-weight: 700; text-align: center;">${idx + 1}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${u.color || '#0284c7'};"></span>
            <strong style="color: var(--text-main); font-size: 0.92rem;">${u.nama}</strong>
          </div>
          ${u.catatan ? `<div style="font-size: 0.73rem; color: var(--text-dim); margin-top: 2px; padding-left: 18px;">${u.catatan}</div>` : ''}
        </td>
        <td class="table-num" style="font-weight: 600;">${u.siswa} Siswa</td>
        <td class="table-num">${formatRupiah(u.paguMurni)}</td>
        <td class="table-num" style="color: ${u.talanganFKSS > 0 ? '#d97706' : 'var(--text-dim)'}; font-weight: ${u.talanganFKSS > 0 ? '700' : 'normal'};">
          ${u.talanganFKSS > 0 ? `+${formatRupiah(u.talanganFKSS)}` : '-'}
        </td>
        <td class="table-num" style="font-weight: 700; color: #0284c7;">${formatRupiah(u.pagu)}</td>
        <td class="table-num" style="font-weight: 700; color: #e11d48;">${formatRupiah(u.realisasi)}</td>
        <td class="table-num" style="font-weight: 700; color: #059669;">${formatRupiah(u.sisa)}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; height: 7px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
              <div style="width: ${Math.min(pctNum, 100)}%; height: 100%; background: ${u.color || '#0284c7'}; border-radius: 999px;"></div>
            </div>
            <span style="font-size: 0.8rem; font-weight: 700; min-width: 44px; text-align: right; font-family: var(--font-mono); color: var(--text-main);">${u.pct}%</span>
          </div>
        </td>
        <td style="text-align: center;">
          <span class="stat-badge ${badgeColor}">${statusText}</span>
        </td>
        <td style="text-align: center; white-space: nowrap;">
          <button type="button" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.78rem; border-color: #0284c7; color: #0284c7;" onclick="window.filterTransaksiByUnit('${u.id}')" title="Lihat ${trxCount} transaksi belanja ${u.nama}">
            🔍 Belanja (${trxCount})
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (tfoot) {
    tfoot.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: left; padding-left: 14px; font-weight: 800; font-size: 0.9rem;">
          TOTAL SELURUH 5 UNIT
        </td>
        <td class="table-num" style="font-weight: 800;">${totalSiswa} Siswa</td>
        <td class="table-num" style="font-weight: 800;">${formatRupiah(totalPaguMurni)}</td>
        <td class="table-num" style="font-weight: 800; color: #d97706;">+${formatRupiah(totalTalanganFKSS)}</td>
        <td class="table-num" style="font-weight: 800; color: #0284c7;">${formatRupiah(totalPaguBJB)}</td>
        <td class="table-num" style="font-weight: 800; color: #e11d48;">${formatRupiah(totalRealisasi)}</td>
        <td class="table-num" style="font-weight: 800; color: #059669;">${formatRupiah(totalSisa)}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; height: 7px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
              <div style="width: ${Math.min(overallPct, 100)}%; height: 100%; background: #0284c7; border-radius: 999px;"></div>
            </div>
            <span style="font-size: 0.82rem; font-weight: 800; min-width: 44px; text-align: right; font-family: var(--font-mono); color: #0284c7;">${overallPct}%</span>
          </div>
        </td>
        <td style="text-align: center;">
          <span class="stat-badge green">✓ Terkendali</span>
        </td>
        <td style="text-align: center;">
          <a href="#transaksi" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.78rem; text-decoration: none;">Semua →</a>
        </td>
      </tr>
    `;
  }
}

// --- DATA DOKUMEN SI BANK BJB (DI BAWAH DATA PAGU & ANGGARAN UNIT) ---
function renderSIDashboardSection(metrics) {
  const isViewAll = !activeSIBatchId || activeSIBatchId === 'ALL';
  const activeBatch = isViewAll ? null : getActiveSIBatch();
  const siBatchSelect = document.getElementById('siBatchSelect');
  const siDisplayTitle = document.getElementById('siBatchDisplayTitle');
  const siDisplayMeta = document.getElementById('siBatchDisplayMeta');
  const siStatusBadge = document.getElementById('siBatchStatusBadge');
  const siTableBody = document.getElementById('siBatchTableBody');
  const btnEditSIDashboard = document.getElementById('btnEditSIDashboard');
  const btnHapusSIDashboard = document.getElementById('btnHapusSIDashboard');

  const allTransfersCombined = [];
  siBatches.forEach(b => {
    (b.transfers || []).forEach(t => {
      allTransfersCombined.push({
        ...t,
        nomorSI: b.nomorSI,
        tanggalSI: b.tanggalFormat || formatDate(b.tanggal),
        batchId: b.id
      });
    });
  });

  if (siBatches.length > 0) {
    if (siBatchSelect) {
      siBatchSelect.innerHTML = `
        <option value="ALL" ${isViewAll ? 'selected' : ''}>
          📑 Semua Dokumen SI (${siBatches.length} Dokumen SI — ${allTransfersCombined.length} Transfer — ${formatRupiah(metrics.totalRealisasi)})
        </option>
        ${siBatches.map((b, idx) => `
          <option value="${b.id}" ${b.id === activeSIBatchId ? 'selected' : ''}>
            ${idx + 1}. ${b.nomorSI} (${b.tanggalFormat || formatDate(b.tanggal)}) — ${formatRupiah(b.totalNominal)} (${b.transfers.length} trf)
          </option>
        `).join('')}
      `;
    }

    if (isViewAll) {
      if (btnEditSIDashboard) btnEditSIDashboard.style.display = 'none';
      if (btnHapusSIDashboard) btnHapusSIDashboard.style.display = 'none';

      if (siDisplayTitle) siDisplayTitle.textContent = `🏦 Seluruh Dokumen Surat Instruksi (SI): ${siBatches.length} Dokumen Terdaftar`;
      if (siDisplayMeta) siDisplayMeta.innerHTML = `Menampilkan total <strong>${allTransfersCombined.length} baris transfer pemindahbukuan</strong> dari ke-${siBatches.length} dokumen SI yang telah terealisasi resmi Bank BJB.`;
      if (siStatusBadge) {
        siStatusBadge.style.display = 'inline-flex';
        siStatusBadge.textContent = `✓ ${siBatches.length} DOKUMEN SI LUNAS / CAIR`;
      }

      if (siTableBody) {
        siTableBody.innerHTML = allTransfersCombined.map((t, idx) => `
          <tr>
            <td style="font-weight: 700; text-align: center;">${idx + 1}</td>
            <td>
              <strong style="color: var(--accent-primary); font-family: var(--font-mono); font-size: 0.85rem;">${t.nomorSI}</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">📅 ${t.tanggalSI}</div>
            </td>
            <td>
              <span class="tag-unit ${(t.unitId || '').toLowerCase()}">${t.unitNama}</span>
            </td>
            <td>
              <span class="tag-kategori ${(t.kategori || '').toLowerCase()}">${t.kategori}</span>
            </td>
            <td style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--accent-primary);">
              ${t.vaSiplah || t.rekening || '-'}
            </td>
            <td style="max-width: 300px; font-size: 0.82rem; line-height: 1.4;">
              ${t.uraian || t.ket || '-'}
            </td>
            <td class="table-num" style="color: #0284c7; font-weight: 700;">
              ${formatRupiah(t.netto)}
            </td>
            <td style="text-align: center;">
              <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="window.showBatchDetail(${t.no}, '${t.batchId}')">
                🔍 Rincian
              </button>
            </td>
          </tr>
        `).join('');
      }
    } else {
      if (btnEditSIDashboard) btnEditSIDashboard.style.display = 'inline-flex';
      if (btnHapusSIDashboard) btnHapusSIDashboard.style.display = 'inline-flex';

      if (siDisplayTitle) siDisplayTitle.textContent = `🏦 Surat Instruksi (SI) Yang Ditransaksikan: ${activeBatch.nomorSI}`;
      if (siDisplayMeta) siDisplayMeta.innerHTML = `Tanggal: <strong>${activeBatch.tanggalFormat || formatDate(activeBatch.tanggal)}</strong> | Bank: <strong>${activeBatch.namaBank || 'Bank BJB KCP Jatiasih'}</strong> | Rekening: <strong>${activeBatch.rekeningSumber || '0120640100100'}</strong> (${activeBatch.atasNamaSumber || 'SMAS FUTURE GATE'})`;
      if (siStatusBadge) {
        siStatusBadge.style.display = 'inline-flex';
        siStatusBadge.textContent = `✓ ${activeBatch.statusBadge || '100% LUNAS / DITRANSAKSIKAN'}`;
      }

      if (siTableBody) {
        siTableBody.innerHTML = activeBatch.transfers.map((t, idx) => `
          <tr>
            <td style="font-weight: 700; text-align: center;">${t.no || idx + 1}</td>
            <td>
              <strong style="color: var(--accent-primary); font-family: var(--font-mono); font-size: 0.85rem;">${activeBatch.nomorSI}</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">📅 ${activeBatch.tanggalFormat || formatDate(activeBatch.tanggal)}</div>
            </td>
            <td>
              <span class="tag-unit ${(t.unitId || '').toLowerCase()}">${t.unitNama}</span>
            </td>
            <td>
              <span class="tag-kategori ${(t.kategori || '').toLowerCase()}">${t.kategori}</span>
            </td>
            <td style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-primary);">
              ${t.vaSiplah || t.rekening || '-'}
            </td>
            <td style="max-width: 320px; font-size: 0.85rem; line-height: 1.4;">
              ${t.uraian || t.ket || '-'}
            </td>
            <td class="table-num" style="color: var(--text-main); font-weight: 700;">
              ${formatRupiah(t.netto)}
            </td>
            <td style="text-align: center;">
              <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.78rem;" onclick="window.showBatchDetail(${t.no}, '${activeBatch.id}')">
                🔍 Rincian
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  } else {
    if (btnEditSIDashboard) btnEditSIDashboard.style.display = 'none';
    if (btnHapusSIDashboard) btnHapusSIDashboard.style.display = 'none';

    if (siBatchSelect) {
      siBatchSelect.innerHTML = `<option value="">Belum Ada Dokumen SI</option>`;
    }
    if (siDisplayTitle) siDisplayTitle.textContent = 'Belum Ada Dokumen SI yang Diunggah';
    if (siDisplayMeta) siDisplayMeta.innerHTML = 'Silakan unggah dokumen SI (Excel Bank BJB) untuk memulai pencatatan transaksi real.';
    if (siStatusBadge) siStatusBadge.style.display = 'none';

    if (siTableBody) {
      siTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
            <div style="font-size: 2.2rem; margin-bottom: 8px;">📂</div>
            <strong style="color: var(--text-main); font-size: 1rem;">Belum ada Dokumen SI (Standing Instruction)</strong>
            <p style="margin: 6px 0 16px 0; font-size: 0.85rem;">Unggah file Excel Surat Instruksi BJB untuk melihat rincian pemindahbukuan dan otomatis mencatat realisasi.</p>
            <button class="btn btn-emerald" onclick="window.openUploadSIModal()">📤 Upload SI (Excel) Sekarang</button>
          </td>
        </tr>
      `;
    }
  }
}


window.filterTransaksiByUnit = function(unitId) {
  const filterUnit = document.getElementById('filterUnit');
  if (filterUnit) {
    filterUnit.value = unitId;
  }
  window.location.hash = '#transaksi';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.exportPaguExcel = function() {
  const metrics = getMetrics();
  const unitStats = metrics.unitStats || [];

  const rows = unitStats.map((u, idx) => ({
    'No': idx + 1,
    'Nama Unit': u.nama,
    'Jumlah Siswa': u.siswa,
    'Pagu Murni (Rp)': u.paguMurni,
    'Talangan FKSS (Rp)': u.talanganFKSS,
    'Total Pagu BOS BJB (Rp)': u.pagu,
    'Realisasi Belanja SI (Rp)': u.realisasi,
    'Sisa Anggaran (Rp)': u.sisa,
    'Persentase Penyerapan (%)': `${u.pct}%`,
    'Catatan': u.catatan || ''
  }));

  const totalSiswa = unitStats.reduce((sum, u) => sum + (u.siswa || 0), 0);
  const totalPaguMurni = unitStats.reduce((sum, u) => sum + (u.paguMurni || 0), 0);
  const totalTalanganFKSS = unitStats.reduce((sum, u) => sum + (u.talanganFKSS || 0), 0);
  const totalPaguBJB = unitStats.reduce((sum, u) => sum + (u.pagu || 0), 0);
  const totalRealisasi = unitStats.reduce((sum, u) => sum + (u.realisasi || 0), 0);
  const totalSisa = totalPaguBJB - totalRealisasi;
  const overallPct = totalPaguBJB > 0 ? ((totalRealisasi / totalPaguBJB) * 100).toFixed(2) : 0;

  rows.push({
    'No': 'TOTAL',
    'Nama Unit': '5 Unit Sekolah',
    'Jumlah Siswa': totalSiswa,
    'Pagu Murni (Rp)': totalPaguMurni,
    'Talangan FKSS (Rp)': totalTalanganFKSS,
    'Total Pagu BOS BJB (Rp)': totalPaguBJB,
    'Realisasi Belanja SI (Rp)': totalRealisasi,
    'Sisa Anggaran (Rp)': totalSisa,
    'Persentase Penyerapan (%)': `${overallPct}%`,
    'Catatan': 'Alokasi Pagu & Realisasi Resmi BOSP 2026'
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pagu & Anggaran Unit');
  XLSX.writeFile(wb, 'Pagu_dan_Anggaran_Unit_BOS_2026.xlsx');
  showToast('📥 <strong>File Excel Pagu & Anggaran Unit berhasil diunduh.</strong>');
};

// --- RINCIAN BELANJA & TRANSAKSI ---
function renderTransaksi() {
  const tbody = document.getElementById('transaksiTableBody');
  const countText = document.getElementById('transaksiCountText');
  const totalText = document.getElementById('transaksiTotalNominalText');
  if (!tbody) return;

  const searchInput = (document.getElementById('searchTransaksi')?.value || '').toLowerCase().trim();
  const filterSIBatch = document.getElementById('filterSIBatch')?.value || 'ALL';
  const filterUnit = document.getElementById('filterUnit')?.value || 'ALL';
  const filterKategori = document.getElementById('filterKategori')?.value || 'ALL';

  // Sync SI Batch filter options (Sorted Oldest to Newest)
  const filterSIEl = document.getElementById('filterSIBatch');
  if (filterSIEl) {
    const prevVal = filterSIEl.value;
    if (siBatches.length > 0) {
      filterSIEl.innerHTML = `<option value="ALL">Semua Dokumen SI (${siBatches.length} SI)</option>` +
        siBatches.map((b, idx) => `<option value="${b.nomorSI}">${idx + 1}. ${b.nomorSI} (${b.tanggalFormat || formatDate(b.tanggal)})</option>`).join('');
    } else {
      filterSIEl.innerHTML = `<option value="ALL">Semua Dokumen SI (0 SI)</option>`;
    }
    if (prevVal && [...filterSIEl.options].some(o => o.value === prevVal)) {
      filterSIEl.value = prevVal;
    }
  }

  // Ensure transaction list is sorted chronologically from oldest to newest
  const sortedTransaksi = sortTransaksiChronological(transaksiList);

  const filtered = sortedTransaksi.filter(item => {
    const matchSearch =
      (item.namaBarang || '').toLowerCase().includes(searchInput) ||
      (item.vaSiplah || '').toLowerCase().includes(searchInput) ||
      (item.noSI || '').toLowerCase().includes(searchInput) ||
      (item.keterangan || '').toLowerCase().includes(searchInput);

    const matchSI = filterSIBatch === 'ALL' || item.noSI === filterSIBatch || item.batchId === filterSIBatch;
    const matchUnit = filterUnit === 'ALL' || item.unitId === filterUnit;
    const matchKategori = filterKategori === 'ALL' || (item.kategori || '').toLowerCase() === filterKategori.toLowerCase();

    return matchSearch && matchSI && matchUnit && matchKategori;
  });

  const totalFiltered = filtered.reduce((sum, item) => sum + (Number(item.totalNominal) || 0), 0);

  if (countText) countText.textContent = `Menampilkan ${filtered.length} dari ${transaksiList.length} item belanja`;
  if (totalText) totalText.textContent = `Total Belanja Terfilter: ${formatRupiah(totalFiltered)}`;

  if (filtered.length === 0) {
    if (transaksiList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
            <div style="font-size: 2.6rem; margin-bottom: 12px;">📂</div>
            <strong style="color: var(--text-main); font-size: 1.05rem; display: block; margin-bottom: 6px;">Data Transaksi Belanja Masih Kosong</strong>
            <p style="font-size: 0.85rem; max-width: 480px; margin: 0 auto 18px auto; line-height: 1.5;">
              Belum ada data belanja yang dicatat. Silakan unggah dokumen <strong>Surat Instruksi (SI) Excel</strong> atau gunakan tombol <strong>Catat Belanja Baru</strong>.
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-emerald" onclick="window.openUploadSIModal()">📤 Upload SI (Excel)</button>
              <button class="btn btn-primary" onclick="document.getElementById('btnOpenModalAdd')?.click()">+ Catat Belanja Baru</button>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align: center; padding: 36px; color: var(--text-dim);">
            🔍 Tidak ada data transaksi belanja yang cocok dengan filter pencarian.
          </td>
        </tr>
      `;
    }
    return;
  }

  tbody.innerHTML = filtered.map((item, idx) => {
    const title = item.namaBarang || item.ket || item.uraian || 'Belanja Operasional';
    const desc = item.keterangan || item.note || '';
    const qty = item.qty != null ? item.qty : 1;
    const satuan = item.satuan || 'Paket';
    const nominal = Number(item.totalNominal || item.nominal || item.netto) || 0;
    const hargaSatuan = Number(item.hargaSatuan || (nominal / (qty || 1))) || nominal;

    return `
    <tr>
      <td style="font-weight: 700; text-align: center;">${idx + 1}</td>
      <td style="white-space: nowrap; font-size: 0.82rem; color: var(--text-muted);">${formatDate(item.tanggal)}</td>
      <td><span class="tag-unit ${(item.unitId || '').toLowerCase()}">${item.unitNama || item.unitId || '-'}</span></td>
      <td><span class="tag-kategori ${(item.kategori || '').toLowerCase()}">${item.kategori || 'Operasional'}</span></td>
      <td style="font-weight: 600; color: var(--text-main);">
        ${title}
        ${desc && desc !== title ? `<div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 2px;">${desc}</div>` : ''}
      </td>
      <td style="text-align: center; font-weight: 700;">${qty}</td>
      <td style="color: var(--text-muted);">${satuan}</td>
      <td class="table-num">${formatRupiah(hargaSatuan)}</td>
      <td class="table-num" style="color: #0284c7; font-weight: 700;">${formatRupiah(nominal)}</td>
      <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
        ${item.vaSiplah || item.noSI || '-'}
      </td>
      <td>
        <span class="stat-badge green">${item.status || 'Ditransaksikan'}</span>
      </td>
      <td style="text-align: center;">
        <button class="btn btn-danger" style="padding: 4px 8px; font-size: 0.75rem;" title="Hapus Item" onclick="window.deleteTransaksiItem('${item.id}')">
          🗑️
        </button>
      </td>
    </tr>
  `;
  }).join('');
}

function renderCetakSI() {
  const container = document.getElementById('siPaperContainer');
  if (!container) return;

  const cetakSelect = document.getElementById('cetakSIBatchSelect');
  const btnEditSICetak = document.getElementById('btnEditSICetak');
  const btnHapusSICetak = document.getElementById('btnHapusSICetak');
  const mainSI = getActiveSIBatch() || (siBatches.length > 0 ? siBatches[0] : null);

  if (!mainSI) {
    if (btnEditSICetak) btnEditSICetak.style.display = 'none';
    if (btnHapusSICetak) btnHapusSICetak.style.display = 'none';

    if (cetakSelect) cetakSelect.innerHTML = `<option value="">Belum Ada Dokumen SI</option>`;
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--text-muted); background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="font-size: 3.5rem; margin-bottom: 16px;">📄</div>
        <h3 style="color: var(--text-main); font-size: 1.25rem; margin-bottom: 8px;">Belum Ada Dokumen SI yang Diunggah</h3>
        <p style="font-size: 0.9rem; max-width: 480px; margin: 0 auto 24px auto; line-height: 1.6;">
          Halaman ini akan otomatis menyusun <strong>Surat Perintah Pemindahbukuan Resmi (SI BJB)</strong> dan <strong>Lampiran Rincian Transfer</strong> siap cetak setelah Anda mengunggah file Excel SI.
        </p>
        <button class="btn btn-emerald" onclick="window.openUploadSIModal()" style="font-size: 0.95rem; padding: 10px 20px;">📤 Upload SI (Excel) Sekarang</button>
      </div>
    `;
    return;
  }

  if (btnEditSICetak) btnEditSICetak.style.display = 'inline-flex';
  if (btnHapusSICetak) btnHapusSICetak.style.display = 'inline-flex';

  if (cetakSelect && siBatches.length > 0) {
    cetakSelect.innerHTML = siBatches.map((b, idx) => `
      <option value="${b.id}" ${b.id === mainSI.id ? 'selected' : ''}>
        ${idx + 1}. ${b.nomorSI} (${b.tanggalFormat || formatDate(b.tanggal)}) — ${formatRupiah(b.totalNominal)}
      </option>
    `).join('');
  }

  const totalNetto = mainSI.transfers.reduce((sum, t) => sum + t.netto, 0);
  const terbilangStr = terbilang(totalNetto);

  if (currentCetakTab === 'surat') {
    // SURAT PERINTAH PEMINDAHBUKUAN (SI)
    container.innerHTML = `
      <div class="si-letterhead">
        <h2>${PROFIL_SEKOLAH.namaYayasan}</h2>
        <h2>${PROFIL_SEKOLAH.nama}</h2>
        <p>${PROFIL_SEKOLAH.alamat}</p>
        <p>Email: info@smafg.sch.id | NPSN: ${PROFIL_SEKOLAH.npsn}</p>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 12px; font-size: 11pt;">
        Bekasi, ${formatDate(mainSI.tanggal)}
      </div>

      <div class="si-title-block">
        <h3>STANDING INSTRUCTION</h3>
        <div style="font-size: 11pt;">Nomor: ${mainSI.nomorSI}</div>
      </div>

      <table class="si-meta-table">
        <tr>
          <td style="width: 120px;">Sifat</td>
          <td style="width: 10px;">:</td>
          <td>Penting</td>
        </tr>
        <tr>
          <td>Lampiran</td>
          <td>:</td>
          <td>1 (Satu) Berkas Daftar Rekap Transfer</td>
        </tr>
        <tr>
          <td>Perihal</td>
          <td>:</td>
          <td><strong>${mainSI.perihal}</strong></td>
        </tr>
      </table>

      <div style="margin-bottom: 16px; font-size: 11pt;">
        Kepada Yth,<br>
        <strong>Pemimpin ${mainSI.namaBank}</strong><br>
        di Tempat
      </div>

      <div class="si-body-text">
        Dengan hormat,<br>
        Kami yang bertandatangan di bawah ini, dengan ini memohon bantuan untuk melakukan <strong>Pemindahbukuan dana BOS Reguler 2026</strong> dari rekening sekolah kami dengan data sebagai berikut:
      </div>

      <table class="si-meta-table" style="margin-left: 16px;">
        <tr>
          <td style="width: 180px;">Nomor Rekening</td>
          <td style="width: 10px;">:</td>
          <td><strong style="font-family: monospace; font-size: 12pt;">${PROFIL_SEKOLAH.noRekening}</strong></td>
        </tr>
        <tr>
          <td>Nama Rekening</td>
          <td>:</td>
          <td><strong>${PROFIL_SEKOLAH.namaRekening}</strong></td>
        </tr>
        <tr>
          <td>Unit Kerja</td>
          <td>:</td>
          <td>${PROFIL_SEKOLAH.nama}</td>
        </tr>
        <tr>
          <td>Nama Kepala Sekolah</td>
          <td>:</td>
          <td>${PROFIL_SEKOLAH.namaKepsek}</td>
        </tr>
        <tr>
          <td>Nama Bendahara</td>
          <td>:</td>
          <td>${PROFIL_SEKOLAH.namaBendahara} (Hp: ${PROFIL_SEKOLAH.hpBendahara})</td>
        </tr>
      </table>

      <div class="si-body-text">
        Untuk dilakukan pemindahbukuan / transfer ke rekening Virtual Account (VA) SIPLAH dan penerima sebagaimana terlampir, dengan total nominal:
      </div>

      <div class="si-highlight-box">
        <div style="font-size: 13pt; font-weight: bold; color: #0f172a;">
          Total: ${formatRupiah(totalNetto)}
        </div>
        <div style="font-style: italic; color: #334155; margin-top: 4px;">
          Terbilang: "${terbilangStr}"
        </div>
      </div>

      <div class="si-body-text">
        Dengan adanya Standing Instruction ini, Bank dibebaskan dari segala tuntutan atau akibat yang timbul dari pelaksanaan perintah pemindahbukuan sesuai data terlampir.<br>
        Demikian permohonan ini kami sampaikan, atas bantuan dan kerjasamanya kami ucapkan terima kasih.
      </div>

      <div class="si-signatures">
        <div class="si-sign-box">
          <div>Mengetahui / Menyetujui,</div>
          <div><strong>Kepala Sekolah</strong></div>
          <div class="si-sign-space"></div>
          <div class="si-sign-name">${PROFIL_SEKOLAH.namaKepsek}</div>
        </div>
        <div class="si-sign-box">
          <div>Bekasi, ${formatDate(mainSI.tanggal)}</div>
          <div><strong>Bendahara BOS</strong></div>
          <div class="si-sign-space"></div>
          <div class="si-sign-name">${PROFIL_SEKOLAH.namaBendahara}</div>
        </div>
      </div>
    `;
  } else {
    // LAMPIRAN RINCIAN REKAP TRANSFER
    container.innerHTML = `
      <div class="si-letterhead">
        <h2>LAMPIRAN SURAT INSTRUKSI PEMINDAHBUKUAN</h2>
        <p>Nomor Surat: ${mainSI.nomorSI} | Tanggal: ${formatDate(mainSI.tanggal)}</p>
        <p>Rekening Sumber: ${PROFIL_SEKOLAH.noRekening} — a.n ${PROFIL_SEKOLAH.namaRekening}</p>
      </div>

      <h3 style="text-align: center; margin: 16px 0; font-size: 12pt;">DAFTAR RINCIAN BELANJA / REKAP TRANSFER KE SIPLAH BJB</h3>

      <table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 24px;" border="1">
        <thead>
          <tr style="background: #f1f5f9;">
            <th style="padding: 6px;">NO</th>
            <th style="padding: 6px;">UNIT KERJA</th>
            <th style="padding: 6px;">REKENING / VA</th>
            <th style="padding: 6px;">NAMA BANK</th>
            <th style="padding: 6px;">PENERIMA</th>
            <th style="padding: 6px;">RINCIAN BARANG BELANJA</th>
            <th style="padding: 6px; text-align: right;">NETTO (RP)</th>
          </tr>
        </thead>
        <tbody>
          ${mainSI.transfers.map(t => `
            <tr>
              <td style="padding: 6px; text-align: center;">${t.no}</td>
              <td style="padding: 6px; font-weight: bold;">${t.unitNama}</td>
              <td style="padding: 6px; font-family: monospace;">${t.vaSiplah || t.rekening || '-'}</td>
              <td style="padding: 6px; text-align: center;">${t.namaBank || 'BJB'}</td>
              <td style="padding: 6px;">${t.atasNama || 'VA SIPLAH'}</td>
              <td style="padding: 6px; font-size: 8.5pt;">${t.uraian || t.ket || '-'}</td>
              <td style="padding: 6px; text-align: right; font-weight: bold; font-family: monospace;">
                ${formatNumber(t.netto)}
              </td>
            </tr>
          `).join('')}
          <tr style="background: #f8fafc; font-weight: bold;">
            <td colspan="6" style="padding: 8px; text-align: right;">TOTAL PEMINDAHBUKUAN (RP):</td>
            <td style="padding: 8px; text-align: right; font-family: monospace; font-size: 10pt;">
              ${formatNumber(totalNetto)}
            </td>
          </tr>
        </tbody>
      </table>

      <div style="font-size: 10pt; font-style: italic; margin-bottom: 24px;">
        Terbilang: <strong>${terbilangStr}</strong>
      </div>

      <div class="si-signatures">
        <div class="si-sign-box">
          <div>Setuju Dibayar,</div>
          <div><strong>Kepala Sekolah</strong></div>
          <div class="si-sign-space"></div>
          <div class="si-sign-name">${PROFIL_SEKOLAH.namaKepsek}</div>
        </div>
        <div class="si-sign-box">
          <div>Lunas Dibayar,</div>
          <div><strong>Bendahara BOS</strong></div>
          <div class="si-sign-space"></div>
          <div class="si-sign-name">${PROFIL_SEKOLAH.namaBendahara}</div>
        </div>
      </div>
    `;
  }
}

// --- PAGU & ANGGARAN UNIT ---
function renderPagu() {
  const tbody = document.getElementById('paguTableBody');
  if (!tbody) return;

  const metrics = getMetrics();
  renderPaguDashboardTable(metrics);

  tbody.innerHTML = metrics.unitStats.map((u, idx) => `
    <tr>
      <td style="font-weight: 700; text-align: center;">${idx + 1}</td>
      <td>
        <span class="tag-unit ${u.id.toLowerCase()}" style="font-size: 0.85rem;">${u.nama}</span>
        ${u.talanganFKSS ? `<div style="font-size: 0.74rem; color: #0284c7; margin-top: 3px; font-weight: 600;">⚡ Netto: ${formatRupiah(u.paguMurni)} + Talangan FKSS: ${formatRupiah(u.talanganFKSS)}</div>` : ''}
        ${u.catatan && !u.talanganFKSS ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">${u.catatan}</div>` : ''}
      </td>
      <td class="table-num">${u.siswa} Siswa</td>
      <td class="table-num" style="color: var(--text-main); font-weight: 700;">${formatRupiah(u.pagu)}</td>
      <td class="table-num" style="color: #0284c7; font-weight: 700;">${formatRupiah(u.realisasi)}</td>
      <td class="table-num" style="color: #059669; font-weight: 700;">${formatRupiah(u.sisa)}</td>
      <td style="text-align: center;">
        <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
          <div class="progress-track" style="width: 80px;">
            <div class="progress-fill" style="width: ${Math.min(u.pct, 100)}%; background: ${u.color};"></div>
          </div>
          <span style="font-weight: 700; font-size: 0.8rem; color: ${u.color};">${u.pct}%</span>
        </div>
      </td>
      <td>
        <span class="stat-badge green">Aktif / Berjalan</span>
      </td>
    </tr>
  `).join('');
}

// =========================================================
// 4. MODALS & ACTIONS
// =========================================================

// Modal Detail Batch SI
window.showBatchDetail = function(batchNo) {
  const mainSI = getActiveSIBatch() || siBatches[0];
  if (!mainSI) return;
  const transfer = mainSI.transfers.find(t => t.no === batchNo);
  if (!transfer) return;

  const modal = document.getElementById('modalDetailBatch');
  const title = document.getElementById('modalDetailBatchTitle');
  const content = document.getElementById('modalDetailBatchContent');

  if (title) title.textContent = `Batch #${transfer.no}: ${transfer.unitNama} — ${formatRupiah(transfer.netto)}`;

  // Find all items belonging to this unit in the SI
  const relatedItems = transaksiList.filter(item =>
    item.unitId === transfer.unitId &&
    (item.kategori || '').toLowerCase() === transfer.kategori.toLowerCase()
  );

  let itemsHtml = '';
  if (relatedItems.length > 0) {
    itemsHtml = `
      <div class="table-responsive" style="margin-top: 10px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>NAMA BARANG</th>
              <th>QTY</th>
              <th class="table-num">HARGA SATUAN</th>
              <th class="table-num">TOTAL NOMINAL</th>
            </tr>
          </thead>
          <tbody>
            ${relatedItems.map((it, idx) => {
              const itTitle = it.namaBarang || it.ket || it.uraian || 'Belanja';
              const itQty = it.qty != null ? it.qty : 1;
              const itSatuan = it.satuan || 'Paket';
              const itNominal = Number(it.totalNominal || it.nominal || it.netto) || 0;
              const itHargaSatuan = Number(it.hargaSatuan || (itNominal / (itQty || 1))) || itNominal;
              return `
              <tr>
                <td>${idx + 1}</td>
                <td style="font-weight: 600; color: var(--text-main);">${itTitle}</td>
                <td>${itQty} ${itSatuan}</td>
                <td class="table-num">${formatRupiah(itHargaSatuan)}</td>
                <td class="table-num" style="color: #0284c7; font-weight: 700;">${formatRupiah(itNominal)}</td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    itemsHtml = `<p style="color: var(--text-muted); font-size: 0.9rem;">${transfer.uraian}</p>`;
  }

  if (content) {
    content.innerHTML = `
      <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.88rem;">
          <div><strong style="color: var(--text-muted);">Unit Pemohon:</strong> ${transfer.unitNama}</div>
          <div><strong style="color: var(--text-muted);">Kategori:</strong> ${transfer.kategori}</div>
          <div><strong style="color: var(--text-muted);">VA SIPLAH:</strong> <span style="font-family: monospace; color: var(--accent-primary);">${transfer.vaSiplah}</span></div>
          <div><strong style="color: var(--text-muted);">Total Nominal:</strong> <strong style="color: #38bdf8;">${formatRupiah(transfer.netto)}</strong></div>
        </div>
      </div>
      <h4 style="margin-bottom: 8px; font-size: 0.95rem;">Rincian Barang yang Dibelanjakan:</h4>
      ${itemsHtml}
      <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 10px;">
        <button type="button" class="btn btn-outline" style="border-color: #0284c7; color: #0284c7; font-size: 0.85rem;" onclick="document.getElementById('modalDetailBatch')?.classList.remove('active'); window.openEditSIModal('${mainSI.id}')">✏️ Edit Dokumen SI Ini</button>
      </div>
    `;
  }

  if (modal) modal.classList.add('active');
};

// Delete Transaksi Item
window.deleteTransaksiItem = function(id) {
  const item = transaksiList.find(i => i.id === id);
  if (!item) return;

  if (confirm(`Apakah Anda yakin ingin menghapus belanja "${item.namaBarang}" (${formatRupiah(item.totalNominal)})?`)) {
    transaksiList = transaksiList.filter(i => i.id !== id);
    saveData();
    renderAll();
  }
};

// =========================================================
// FITUR EDIT & HAPUS DOKUMEN SI (STANDING INSTRUCTION)
// =========================================================

let tempEditTransfers = [];

window.openEditSIModal = function(batchId) {
  const targetId = batchId || activeSIBatchId || (siBatches.length > 0 ? siBatches[0].id : null);
  if (!targetId || siBatches.length === 0) {
    alert('Belum ada dokumen SI yang tersimpan untuk diedit. Silakan unggah dokumen SI terlebih dahulu.');
    return;
  }

  const batch = siBatches.find(b => b.id === targetId);
  if (!batch) {
    alert('Dokumen SI tidak ditemukan.');
    return;
  }

  const modal = document.getElementById('modalEditSI');
  if (!modal) return;

  const inputBatchId = document.getElementById('editSIBatchId');
  const inputNomorSI = document.getElementById('editNomorSI');
  const inputTanggalSI = document.getElementById('editTanggalSI');
  const inputBankSumberSI = document.getElementById('editBankSumberSI');
  const inputRekSumberSI = document.getElementById('editRekSumberSI');
  const inputPerihalSI = document.getElementById('editPerihalSI');

  if (inputBatchId) inputBatchId.value = batch.id;
  if (inputNomorSI) inputNomorSI.value = batch.nomorSI || '';
  if (inputTanggalSI) inputTanggalSI.value = batch.tanggal ? batch.tanggal.slice(0, 10) : '';
  if (inputBankSumberSI) inputBankSumberSI.value = batch.namaBank || 'Bank BJB KCP Jatiasih di Bekasi';
  if (inputRekSumberSI) inputRekSumberSI.value = batch.rekeningSumber || '0120640100100';
  if (inputPerihalSI) inputPerihalSI.value = batch.perihal || 'Surat Perintah Pemindahbukuan (SI BJB - BOSP Reguler)';

  // Deep clone rincian transfer
  tempEditTransfers = JSON.parse(JSON.stringify(batch.transfers || []));

  renderEditTransferRows();
  updateEditSITotalDisplay();

  modal.classList.add('active');
};

window.closeEditSIModal = function() {
  const modal = document.getElementById('modalEditSI');
  if (modal) modal.classList.remove('active');
  tempEditTransfers = [];
};

function renderEditTransferRows() {
  const tbody = document.getElementById('editTransferTableBody');
  if (!tbody) return;

  if (tempEditTransfers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">
          Belum ada baris transfer pemindahbukuan. Silakan klik tombol <strong>+ Tambah Baris Transfer</strong>.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = tempEditTransfers.map((t, idx) => `
    <tr data-index="${idx}">
      <td style="font-weight: 700; text-align: center; vertical-align: middle;">${idx + 1}</td>
      <td style="vertical-align: middle;">
        <select class="table-select" style="min-width: 105px; font-weight: 600;" onchange="window.updateEditTransferField(${idx}, 'unitId', this.value)">
          ${PAGU_DATA.units.map(u => `
            <option value="${u.id}" ${u.id === t.unitId ? 'selected' : ''}>${u.nama}</option>
          `).join('')}
        </select>
      </td>
      <td style="vertical-align: middle;">
        <select class="table-select" style="min-width: 105px;" onchange="window.updateEditTransferField(${idx}, 'kategori', this.value)">
          ${['Operasional', 'Modal', 'Buku', 'Honor'].map(k => `
            <option value="${k}" ${k.toLowerCase() === (t.kategori || '').toLowerCase() ? 'selected' : ''}>${k}</option>
          `).join('')}
        </select>
      </td>
      <td style="vertical-align: middle;">
        <input type="text" class="form-control" style="padding: 4px 6px; font-size: 0.8rem; font-family: var(--font-mono); min-width: 110px;" 
               value="${t.vaSiplah || t.rekening || ''}" 
               placeholder="No Rekening / VA"
               onchange="window.updateEditTransferField(${idx}, 'vaSiplah', this.value)">
      </td>
      <td style="vertical-align: middle;">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <input type="text" class="form-control" style="padding: 3px 6px; font-size: 0.78rem; min-width: 130px;" 
                 value="${t.namaBank || 'Bank BJB'}" 
                 placeholder="Nama Bank"
                 onchange="window.updateEditTransferField(${idx}, 'namaBank', this.value)">
          <input type="text" class="form-control" style="padding: 3px 6px; font-size: 0.78rem; min-width: 130px;" 
                 value="${t.atasNama || ''}" 
                 placeholder="Atas Nama Rekening"
                 onchange="window.updateEditTransferField(${idx}, 'atasNama', this.value)">
        </div>
      </td>
      <td style="vertical-align: middle;">
        <textarea class="form-control" style="padding: 4px 6px; font-size: 0.8rem; min-width: 160px; height: 50px; resize: vertical;" 
                  placeholder="Uraian belanja pemindahbukuan"
                  onchange="window.updateEditTransferField(${idx}, 'uraian', this.value)">${t.uraian || t.ket || ''}</textarea>
      </td>
      <td style="vertical-align: middle;">
        <input type="number" class="form-control" style="padding: 4px 6px; font-size: 0.85rem; font-family: var(--font-mono); font-weight: 700; color: #0284c7; min-width: 110px; text-align: right;" 
               value="${t.netto || 0}" 
               min="0" step="1000"
               oninput="window.updateEditTransferField(${idx}, 'netto', Number(this.value))">
      </td>
      <td style="text-align: center; vertical-align: middle;">
        <button type="button" class="btn btn-danger" style="padding: 4px 8px; font-size: 0.75rem;" title="Hapus Baris Ini" onclick="window.removeEditTransferRow(${idx})">
          ❌
        </button>
      </td>
    </tr>
  `).join('');
}

window.updateEditTransferField = function(idx, field, value) {
  if (!tempEditTransfers[idx]) return;
  tempEditTransfers[idx][field] = value;
  if (field === 'unitId') {
    const unitObj = PAGU_DATA.units.find(u => u.id === value);
    tempEditTransfers[idx].unitNama = unitObj ? unitObj.nama : value;
  }
  if (field === 'netto') {
    updateEditSITotalDisplay();
  }
};

window.addEditTransferRow = function() {
  const newRow = {
    no: tempEditTransfers.length + 1,
    unitId: 'PUTRA',
    unitNama: 'FG Putra',
    kategori: 'Operasional',
    vaSiplah: '',
    namaBank: 'Bank BJB',
    atasNama: '',
    bruto: 0,
    pajak: 0,
    netto: 0,
    uraian: ''
  };
  tempEditTransfers.push(newRow);
  renderEditTransferRows();
  updateEditSITotalDisplay();
};

window.removeEditTransferRow = function(idx) {
  if (tempEditTransfers.length <= 1) {
    if (!confirm('Ini adalah satu-satunya baris transfer pada dokumen SI ini. Yakin ingin menghapusnya?')) {
      return;
    }
  }
  tempEditTransfers.splice(idx, 1);
  renderEditTransferRows();
  updateEditSITotalDisplay();
};

function updateEditSITotalDisplay() {
  const total = tempEditTransfers.reduce((sum, t) => sum + (Number(t.netto) || 0), 0);
  const el = document.getElementById('editSITotalDisplay');
  if (el) el.textContent = formatRupiah(total);
}

window.saveEditedSI = function() {
  const batchId = document.getElementById('editSIBatchId')?.value;
  const batch = siBatches.find(b => b.id === batchId);
  if (!batch) {
    alert('Dokumen SI tidak ditemukan untuk disimpan.');
    return;
  }

  const nomorSI = document.getElementById('editNomorSI')?.value.trim();
  const tanggalSI = document.getElementById('editTanggalSI')?.value;
  const bankSumber = document.getElementById('editBankSumberSI')?.value.trim() || 'Bank BJB KCP Jatiasih di Bekasi';
  const rekSumber = document.getElementById('editRekSumberSI')?.value.trim() || '0120640100100';
  const perihal = document.getElementById('editPerihalSI')?.value.trim() || 'Surat Perintah Pemindahbukuan (SI BJB - BOSP Reguler)';

  if (!nomorSI) {
    alert('Nomor Surat Instruksi (SI) tidak boleh kosong.');
    document.getElementById('editNomorSI')?.focus();
    return;
  }

  if (!tanggalSI) {
    alert('Tanggal pencairan / pelaksanaan SI tidak boleh kosong.');
    document.getElementById('editTanggalSI')?.focus();
    return;
  }

  if (tempEditTransfers.length === 0) {
    alert('Dokumen SI harus memiliki minimal 1 baris transfer.');
    return;
  }

  // Finalisasi rincian transfer
  const finalizedTransfers = tempEditTransfers.map((t, idx) => {
    const unitObj = PAGU_DATA.units.find(u => u.id === t.unitId);
    const nettoVal = Math.max(0, Number(t.netto) || 0);
    return {
      no: idx + 1,
      unitId: t.unitId || 'PUTRA',
      unitNama: unitObj ? unitObj.nama : (t.unitNama || 'FG Putra'),
      kategori: t.kategori || 'Operasional',
      vaSiplah: t.vaSiplah || t.rekening || '-',
      namaBank: t.namaBank || 'Bank BJB',
      atasNama: t.atasNama || '-',
      bruto: nettoVal,
      pajak: 0,
      netto: nettoVal,
      uraian: t.uraian || t.ket || `Belanja ${t.kategori || 'Operasional'} (${unitObj ? unitObj.nama : 'Unit'})`
    };
  });

  const totalNominal = finalizedTransfers.reduce((sum, t) => sum + t.netto, 0);

  const oldNomorSI = batch.nomorSI;

  // Perbarui data batch SI
  batch.nomorSI = nomorSI;
  batch.tanggal = tanggalSI;
  batch.tanggalFormat = formatDate(tanggalSI);
  batch.perihal = perihal;
  batch.namaBank = bankSumber;
  batch.rekeningSumber = rekSumber;
  batch.totalNominal = totalNominal;
  batch.transfers = finalizedTransfers;

  // Sinkronisasi transaksiList untuk batch ini: hapus transaksi lama berdasarkan batchId dan nomorSI
  const batchNumPrefix = (oldNomorSI || nomorSI || '').split('/')[0];
  transaksiList = transaksiList.filter(t => {
    if (t.batchId && t.batchId === batch.id) return false;
    if (t.noSI && (t.noSI === oldNomorSI || t.noSI === nomorSI)) return false;
    if (batchNumPrefix && t.noSI && t.noSI.startsWith(batchNumPrefix + '/')) return false;
    return true;
  });

  finalizedTransfers.forEach((t, i) => {
    const cleanTitle = t.uraian || t.ket || `Belanja ${t.kategori} (${t.unitNama})`;
    const itemNote = t.note || `Transfer SI No. ${t.no} ke ${t.atasNama} (${t.namaBank} ${t.vaSiplah || '-'})`;
    transaksiList.push({
      id: `TRX-${batch.id}-${i + 1}`,
      batchId: batch.id,
      noSI: batch.nomorSI,
      tanggal: batch.tanggal,
      unitId: t.unitId,
      unitNama: t.unitNama,
      kategori: t.kategori,
      namaBarang: cleanTitle,
      uraian: cleanTitle,
      qty: 1,
      satuan: 'Paket',
      hargaSatuan: t.netto,
      nominal: t.netto,
      totalNominal: t.netto,
      netto: t.netto,
      bruto: t.netto,
      vaSiplah: t.vaSiplah,
      namaBank: t.namaBank,
      atasNama: t.atasNama,
      status: 'Sudah Ditransaksikan',
      ket: t.ket || cleanTitle,
      keterangan: itemNote
    });
  });

  saveData();
  renderAll();
  window.closeEditSIModal();

  showToast(`💾 Perubahan Dokumen SI <strong>${batch.nomorSI}</strong> berhasil disimpan! (${finalizedTransfers.length} transfer, total: ${formatRupiah(totalNominal)})`);
};

window.deleteActiveSI = function(batchId) {
  const targetId = batchId || activeSIBatchId || (siBatches.length > 0 ? siBatches[0].id : null);
  if (!targetId || siBatches.length === 0) {
    alert('Tidak ada dokumen SI yang dapat dihapus.');
    return;
  }

  const batch = siBatches.find(b => b.id === targetId);
  if (!batch) {
    alert('Dokumen SI tidak ditemukan.');
    return;
  }

  const confirmed = confirm(
    `Apakah Anda yakin ingin MENGHAPUS dokumen SI:\n"${batch.nomorSI}" (${formatRupiah(batch.totalNominal)})?\n\n` +
    `Perhatian: ${batch.transfers ? batch.transfers.length : 0} rincian transfer dan seluruh transaksi belanja terkait SI ini akan ikut dihapus dari dashboard.`
  );

  if (confirmed) {
    siBatches = siBatches.filter(b => b.id !== targetId);
    transaksiList = transaksiList.filter(t => t.batchId !== targetId && t.noSI !== batch.nomorSI);

    activeSIBatchId = siBatches.length > 0 ? siBatches[0].id : null;

    saveData();
    renderAll();

    showToast(`🗑️ Dokumen SI <strong>${batch.nomorSI}</strong> beserta seluruh transaksinya berhasil dihapus.`);
  }
};

// Export to Excel
function exportToExcel() {
  if (transaksiList.length === 0) {
    alert('Tidak ada data transaksi untuk diekspor!');
    return;
  }

  const exportData = transaksiList.map((item, idx) => ({
    'No': idx + 1,
    'Tanggal Transaksi': item.tanggal,
    'Unit Sekolah': item.unitNama,
    'Kategori': item.kategori,
    'Nama Barang / Belanja': item.namaBarang,
    'Qty': item.qty,
    'Satuan': item.satuan,
    'Harga Satuan (Rp)': item.hargaSatuan,
    'Total Nominal (Rp)': item.totalNominal,
    'No SI / VA Siplah': item.vaSiplah || item.noSI || '',
    'Status': item.status,
    'Keterangan': item.keterangan || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Realisasi Belanja SI');

  const fileName = `Realisasi_Belanja_SI_BOS_SMAS_FG_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

// Render All Components
function renderAll() {
  renderDashboard();
  renderTransaksi();
  renderCetakSI();
  renderPagu();
}

// =========================================================
// 5. NAVIGATION & EVENT LISTENERS
// =========================================================

function setupNavigation() {
  const navDashboard = document.getElementById('navDashboard');
  const navTransaksi = document.getElementById('navTransaksi');
  const navCetakSI = document.getElementById('navCetakSI');
  const navPagu = document.getElementById('navPagu');

  const viewDashboard = document.getElementById('viewDashboard');
  const viewTransaksi = document.getElementById('viewTransaksi');
  const viewCetakSI = document.getElementById('viewCetakSI');
  const viewPagu = document.getElementById('viewPagu');

  const pageTitle = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');

  const navs = [navDashboard, navTransaksi, navCetakSI, navPagu].filter(Boolean);
  const views = [viewDashboard, viewTransaksi, viewCetakSI, viewPagu].filter(Boolean);

  // Mobile sidebar drawer elements
  const btnMobileToggle = document.getElementById('btnMobileToggle');
  const btnSidebarClose = document.getElementById('btnSidebarClose');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const sidebar = document.getElementById('sidebar');

  function openMobileSidebar() {
    sidebar?.classList.add('mobile-open');
    sidebarBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    sidebar?.classList.remove('mobile-open');
    sidebarBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  btnMobileToggle?.addEventListener('click', openMobileSidebar);
  btnSidebarClose?.addEventListener('click', closeMobileSidebar);
  sidebarBackdrop?.addEventListener('click', closeMobileSidebar);

  function switchPage(activeNav, activeView, title, subtitle) {
    navs.forEach(n => n.classList.remove('active'));
    views.forEach(v => v.classList.remove('active'));

    if (activeNav) activeNav.classList.add('active');
    if (activeView) activeView.classList.add('active');

    if (pageTitle) pageTitle.textContent = title;
    if (pageSubtitle) pageSubtitle.textContent = subtitle;

    // Auto close sidebar on mobile after navigation
    closeMobileSidebar();

    // Refresh chart if going to dashboard
    if (activeView === viewDashboard) {
      setTimeout(() => renderDashboard(), 50);
    } else if (activeView === viewCetakSI) {
      renderCetakSI();
    } else if (activeView === viewTransaksi) {
      renderTransaksi();
    } else if (activeView === viewPagu) {
      renderPagu();
    }
  }

  function handleRoute() {
    const hash = window.location.hash || '#dashboard';
    if (hash === '#transaksi') {
      switchPage(navTransaksi, viewTransaksi, 'Rincian Belanja & Transaksi SI', 'Daftar Pengeluaran Dana BOS yang Telah Dicairkan & Ditransaksikan');
    } else if (hash === '#cetak-si') {
      switchPage(navCetakSI, viewCetakSI, 'Cetak Dokumen SI Bank', 'Surat Instruksi Pemindahbukuan & Lampiran Rekap Transfer Resmi BJB');
    } else if (hash === '#pagu') {
      switchPage(navPagu, viewPagu, 'Pagu & Anggaran Unit', 'Rencana Alokasi Pagu Dana BOS per Unit Sekolah TA 2026');
    } else {
      switchPage(navDashboard, viewDashboard, 'Dashboard Ringkas', 'Ringkasan Pagu & Realisasi SI yang Sudah Ditransaksikan');
    }
  }

  window.addEventListener('hashchange', handleRoute);

  navDashboard?.addEventListener('click', () => { window.location.hash = '#dashboard'; });
  navTransaksi?.addEventListener('click', () => { window.location.hash = '#transaksi'; });
  navCetakSI?.addEventListener('click', () => { window.location.hash = '#cetak-si'; });
  navPagu?.addEventListener('click', () => { window.location.hash = '#pagu'; });

  document.getElementById('btnGoToCetakSI')?.addEventListener('click', () => { window.location.hash = '#cetak-si'; });
  document.getElementById('btnLihatSemuaPagu')?.addEventListener('click', () => { window.location.hash = '#pagu'; });

  // SI Batch Selectors in Dashboard and Cetak SI
  document.getElementById('siBatchSelect')?.addEventListener('change', (e) => {
    activeSIBatchId = e.target.value;
    renderDashboard();
    renderCetakSI();
  });

  document.getElementById('cetakSIBatchSelect')?.addEventListener('change', (e) => {
    activeSIBatchId = e.target.value;
    renderDashboard();
    renderCetakSI();
  });

  // Global helper functions to switch and print SI
  window.selectAndShowSIBatch = function(batchId) {
    activeSIBatchId = batchId;
    const select = document.getElementById('siBatchSelect');
    if (select) select.value = batchId;
    renderDashboard();
    renderCetakSI();
  };

  window.printSIBatch = function(batchId) {
    activeSIBatchId = batchId;
    const cetakSelect = document.getElementById('cetakSIBatchSelect');
    if (cetakSelect) cetakSelect.value = batchId;
    window.location.hash = '#cetak-si';
    renderCetakSI();
  };

  handleRoute();
}

// =========================================================
// 6. EXCEL PARSER & UPLOAD SI LOGIC
// =========================================================

function parseIndonesianDateToISO(dateStr) {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  const months = {
    januari: '01', februari: '02', maret: '03', april: '04',
    mei: '05', juni: '06', juli: '07', agustus: '08',
    september: '09', oktober: '10', november: '11', desember: '12'
  };
  const parts = String(dateStr).trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1].toLowerCase()] || '02';
    const year = parts[2];
    if (!isNaN(parseInt(year)) && !isNaN(parseInt(day))) {
      return `${year}-${month}-${day}`;
    }
  }
  return new Date().toISOString().slice(0, 10);
}

function parseSIExcel(arrayBuffer, fileName) {
  const wb = XLSX.read(arrayBuffer, { type: 'array' });

  // 1. Find the best sheet containing SI / Rekap Transfer table
  let targetSheetName = wb.SheetNames[0];
  for (const name of wb.SheetNames) {
    const s = wb.Sheets[name];
    if (!s) continue;
    const testRows = XLSX.utils.sheet_to_json(s, { header: 1, defval: '' });
    const hasMatch = testRows.some(row => {
      const str = row.map(c => String(c).toUpperCase()).join(' ');
      return str.includes('DAFTAR RINCIAN BELANJA') ||
        str.includes('REKAP TRANSFER') ||
        str.includes('STANDING INSTRUCTION') ||
        (str.includes('NO') && str.includes('BELANJA') && (str.includes('NETTO') || str.includes('REKENING') || str.includes('JUMLAH')));
    });
    if (hasMatch) {
      targetSheetName = name;
      break;
    }
  }

  const sheet = wb.Sheets[targetSheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  let namaKegiatan = '';
  let bulan = '';
  let tahun = '2026';
  let noTabungan = '0120640100100';
  let tglSelesai = '';
  let kepsek = '';
  let bendahara = '';
  let headerRowIndex = -1;

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const rowStr = row.map(c => String(c).trim().toUpperCase()).join(' ');
    if (rowStr.includes('NAMA KEGIATAN')) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('NAMA KEGIATAN'));
      namaKegiatan = row.slice(idx + 1).find(c => c && c !== ':') || '';
    }
    if (rowStr.includes('NOMOR TABUNGAN')) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('NOMOR TABUNGAN'));
      const val = row.slice(idx + 1).find(c => c && c !== ':');
      if (val) noTabungan = String(val).padStart(13, '0');
    }
    if (rowStr.includes('BULAN')) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('BULAN'));
      bulan = row.slice(idx + 1).find(c => c && c !== ':') || '';
    }
    if (rowStr.includes('TAHUN')) {
      const idx = row.findIndex(c => String(c).toUpperCase().includes('TAHUN'));
      tahun = row.slice(idx + 1).find(c => c && c !== ':') || '2026';
    }
    if (rowStr.includes('NO') && (rowStr.includes('BELANJA') || rowStr.includes('URAIAN')) && (rowStr.includes('NETTO') || rowStr.includes('REKENING') || rowStr.includes('JUMLAH'))) {
      headerRowIndex = i;
    }
  }

  // Find footer info
  for (let i = rawRows.length - 1; i >= 0; i--) {
    const row = rawRows[i];
    for (const cell of row) {
      const cStr = String(cell).trim();
      if (cStr.toLowerCase().includes('lunas dibayar')) {
        tglSelesai = cStr.replace(/lunas dibayar/i, '').trim();
      }
      if (cStr.toLowerCase().includes('ghazi')) kepsek = cStr;
      if (cStr.toLowerCase().includes('iwan')) bendahara = cStr;
    }
  }

  // Dynamic column detection
  let colIdxNo = 0;
  let colIdxBelanja = 1;
  let colIdxRekening = 2;
  let colIdxBank = 3;
  let colIdxAtasNama = 4;
  let colIdxIdPelanggan = 5;
  let colIdxNetto = 13;
  let colIdxKet = 14;

  if (headerRowIndex >= 0) {
    const hRow = rawRows[headerRowIndex].map(c => String(c).trim().toUpperCase());
    hRow.forEach((c, idx) => {
      if (c === 'NO' || c === 'NO.') colIdxNo = idx;
      else if (c.includes('BELANJA') || c.includes('URAIAN')) colIdxBelanja = idx;
      else if (c.includes('REKENING') || c.includes('NO REK') || c.includes('VA')) colIdxRekening = idx;
      else if (c.includes('BANK')) colIdxBank = idx;
      else if (c.includes('ATAS NAMA') || c.includes('PENERIMA')) colIdxAtasNama = idx;
      else if (c.includes('ID PELANGGAN')) colIdxIdPelanggan = idx;
      else if (c === 'NETTO' || c.includes('JUMLAH NETTO')) colIdxNetto = idx;
      else if (c.includes('KET') || c.includes('KETERANGAN')) colIdxKet = idx;
    });
    if (colIdxNetto === 13 && !hRow[13]?.includes('NETTO')) {
      const totIdx = hRow.findIndex(c => c.includes('NETTO') || c === 'TOTAL' || c.includes('JUMLAH'));
      if (totIdx >= 0) colIdxNetto = totIdx;
    }
  }

  const transfers = [];
  const startRow = headerRowIndex >= 0 ? headerRowIndex + 1 : 9;
  for (let i = startRow; i < rawRows.length; i++) {
    const row = rawRows[i];
    const firstCell = String(row[0] || '').trim().toUpperCase();
    const secondCell = String(row[1] || '').trim().toUpperCase();

    if (firstCell === 'TOTAL' || secondCell === 'TOTAL') break;

    const noVal = parseInt(firstCell);
    if (!isNaN(noVal) && noVal > 0) {
      const jenisBelanja = String(row[colIdxBelanja] || 'Transfer').trim();
      const rekening = String(row[colIdxRekening] || '').trim();
      const bank = String(row[colIdxBank] || 'BJB').trim();
      const atasNama = String(row[colIdxAtasNama] || '').trim();
      const idPelanggan = String(row[colIdxIdPelanggan] || '-').trim();

      let netto = 0;
      if (typeof row[colIdxNetto] === 'number') netto = row[colIdxNetto];
      else if (row[colIdxNetto]) netto = Number(String(row[colIdxNetto]).replace(/[^0-9.-]+/g, '')) || 0;
      else if (typeof row[13] === 'number') netto = row[13];
      else if (row[13]) netto = Number(String(row[13]).replace(/[^0-9.-]+/g, '')) || 0;
      else if (typeof row[11] === 'number') netto = row[11];
      else if (row[11]) netto = Number(String(row[11]).replace(/[^0-9.-]+/g, '')) || 0;

      const ket = String(row[colIdxKet] || row[14] || '').trim();
      const note = String(row[colIdxKet + 1] || row[15] || '').trim();

      // Auto-detect Unit
      let unitId = 'PUTRA';
      let unitNama = 'FG Putra';
      const combinedText = (ket + ' ' + note + ' ' + atasNama + ' ' + jenisBelanja).toLowerCase();
      if (combinedText.includes('rabbani')) {
        unitId = 'RABBANI'; unitNama = 'FG Rabbani';
      } else if (combinedText.includes('fds') || combinedText.includes('fullday')) {
        unitId = 'FDS'; unitNama = 'FG Putri (FDS)';
      } else if (combinedText.includes('mahad') || combinedText.includes('asrama')) {
        unitId = 'MAHAD'; unitNama = 'FG Mahad';
      } else if (combinedText.includes('putri (bs)') || combinedText.includes('(bs)') || combinedText.includes(' bs') || combinedText.includes('boarding')) {
        unitId = 'BS'; unitNama = 'FG Putri (BS)';
      } else if (combinedText.includes('putra')) {
        unitId = 'PUTRA'; unitNama = 'FG Putra';
      }

      // Auto-detect Category
      let kategori = 'Operasional';
      if (combinedText.includes('honor') || combinedText.includes('gaji') || combinedText.includes('insentif') || combinedText.includes('narasumber')) {
        kategori = 'Honor';
      } else if (combinedText.includes('balanja modal') || combinedText.includes('belanja modal')) {
        kategori = 'Modal';
      } else if (combinedText.includes('balanja operasional') || combinedText.includes('belanja operasional')) {
        kategori = 'Operasional';
      } else if (combinedText.includes('buku') || combinedText.includes('kitab') || combinedText.includes('lks') || combinedText.includes('modul')) {
        kategori = 'Buku';
      } else if (combinedText.includes('modal') || combinedText.includes('aset') || combinedText.includes('manekin') || combinedText.includes('printer canon') || combinedText.includes('cctv') || combinedText.includes('karpet') || combinedText.includes('laptop') || combinedText.includes('meja printer') || combinedText.includes('kursi') || combinedText.includes('monitor') || combinedText.includes('keyboard')) {
        kategori = 'Modal';
      }

      let displayTitle = ket;
      if (!displayTitle || displayTitle.toLowerCase() === 'transfer' || displayTitle.toLowerCase() === 'transfer dana') {
        displayTitle = `Belanja ${kategori} (${unitNama})`;
      }

      transfers.push({
        no: noVal,
        jenisBelanja,
        rekening,
        namaBank: bank,
        atasNama,
        idPelanggan,
        netto,
        kategori,
        unitId,
        unitNama,
        ket: displayTitle,
        note,
        uraian: displayTitle + (note ? ' — ' + note.replace(/^>>>\s*/, '') : '')
      });
    }
  }

  const totalNominal = transfers.reduce((sum, t) => sum + t.netto, 0);

  // Smart suggested Nomor SI
  let suggestedNomorSI = '';
  const numMatch = fileName.match(/^(\d{3})/) || fileName.match(/\b(\d{3})\b/);
  const feb2Match = fileName.match(/Feb(?:ruari)?\s*2/i);
  const feb1Match = fileName.match(/Feb(?:ruari)?\s*1/i);
  const monthMatch = (bulan || fileName).match(/Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des/i);
  let romanMonth = 'II';
  if (monthMatch) {
    const m = monthMatch[0].toLowerCase();
    const romanMap = { jan: 'I', feb: 'II', mar: 'III', apr: 'IV', mei: 'V', jun: 'VI', jul: 'VII', agu: 'VIII', sep: 'IX', okt: 'X', nov: 'XI', des: 'XII' };
    romanMonth = romanMap[m] || 'II';
  }

  if (feb2Match) {
    suggestedNomorSI = `432/SI/SMA-FG/${romanMonth}/2026`;
  } else if (feb1Match) {
    suggestedNomorSI = `431/SI/SMA-FG/${romanMonth}/2026`;
  } else if (numMatch) {
    suggestedNomorSI = `${numMatch[1]}/SI/SMA-FG/${romanMonth}/2026`;
  } else {
    suggestedNomorSI = `${430 + siBatches.length + 1}/SI/SMA-FG/${romanMonth}/2026`;
  }

  return {
    fileName,
    suggestedNomorSI,
    namaKegiatan: namaKegiatan || 'Belanja Operasional BOSP',
    bulan: bulan || 'Februari',
    tahun: tahun || '2026',
    noTabungan,
    tglSelesai: tglSelesai || '27 Februari 2026',
    isoDate: parseIndonesianDateToISO(tglSelesai),
    kepsek: kepsek || PROFIL_SEKOLAH.namaKepsek,
    bendahara: bendahara || PROFIL_SEKOLAH.namaBendahara,
    transfers,
    totalNominal
  };
}

function setupUploadSIModal() {
  const modalUpload = document.getElementById('modalUploadSI');
  const btnCloseModalUpload = document.getElementById('btnCloseModalUpload');
  const btnCancelUpload = document.getElementById('btnCancelUpload');
  const siDropzone = document.getElementById('siDropzone');
  const siFileInput = document.getElementById('siFileInput');
  const btnBrowseFile = document.getElementById('btnBrowseFile');
  const btnLoadSampleSI = document.getElementById('btnLoadSampleSI');
  const siUploadPreviewArea = document.getElementById('siUploadPreviewArea');
  const btnReuploadFile = document.getElementById('btnReuploadFile');
  const btnSaveUploadedSI = document.getElementById('btnSaveUploadedSI');

  const metaNomorSI = document.getElementById('metaNomorSI');
  const metaTanggalSI = document.getElementById('metaTanggalSI');
  const metaPerihalSI = document.getElementById('metaPerihalSI');
  const previewFileInfo = document.getElementById('previewFileInfo');
  const previewFileMeta = document.getElementById('previewFileMeta');
  const previewTableBody = document.getElementById('previewTransferTableBody');

  const openUploadModal = () => {
    modalUpload?.classList.add('active');
  };

  const closeUploadModal = () => {
    modalUpload?.classList.remove('active');
  };

  window.openUploadSIModal = openUploadModal;
  window.closeUploadSIModal = closeUploadModal;

  document.getElementById('btnUploadSIDashboard')?.addEventListener('click', openUploadModal);
  document.getElementById('btnOpenModalUploadSI')?.addEventListener('click', openUploadModal);
  document.getElementById('btnUploadSICetak')?.addEventListener('click', openUploadModal);

  btnCloseModalUpload?.addEventListener('click', closeUploadModal);
  btnCancelUpload?.addEventListener('click', closeUploadModal);

  // File browsing
  btnBrowseFile?.addEventListener('click', (e) => {
    e.stopPropagation();
    siFileInput?.click();
  });

  siDropzone?.addEventListener('click', () => {
    siFileInput?.click();
  });

  // Drag and drop
  ['dragenter', 'dragover'].forEach(eventName => {
    siDropzone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      siDropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    siDropzone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      siDropzone.classList.remove('dragover');
    });
  });

  siDropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    siDropzone.classList.remove('dragover');
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  });

  siFileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  });

  // Load sample file button
  btnLoadSampleSI?.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      btnLoadSampleSI.textContent = '⏳ Membaca file contoh...';
      const resp = await fetch('/samples/SI_BJB_BOSP_Februari_1.xlsx');
      if (!resp.ok) throw new Error('File contoh tidak dapat diakses di server');
      const buffer = await resp.arrayBuffer();
      processBuffer(buffer, 'SI BJB - BOSP (Februari 1).xlsx');
    } catch (err) {
      console.error('Error fetching sample file:', err);
      alert('Gagal memuat file contoh: ' + err.message);
    } finally {
      btnLoadSampleSI.textContent = '⚡ Muat Contoh: SI BJB - BOSP (Februari 1)';
    }
  });

  function processSelectedFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      processBuffer(e.target.result, file.name);
    };
    reader.readAsArrayBuffer(file);
  }

  function processBuffer(buffer, fileName) {
    try {
      const parsed = parseSIExcel(buffer, fileName);
      if (!parsed.transfers || parsed.transfers.length === 0) {
        alert('Tidak ditemukan baris transaksi transfer pada file Excel tersebut. Pastikan format sesuai template SI BJB.');
        return;
      }

      currentParsedSI = parsed;

      // Populate preview UI
      if (previewFileInfo) previewFileInfo.textContent = `File Berhasil Dibaca: ${fileName}`;
      if (previewFileMeta) previewFileMeta.textContent = `${parsed.transfers.length} Transfer Terdeteksi | Total: ${formatRupiah(parsed.totalNominal)}`;

      if (metaNomorSI) metaNomorSI.value = parsed.suggestedNomorSI;
      if (metaTanggalSI) metaTanggalSI.value = parsed.isoDate;
      if (metaPerihalSI) metaPerihalSI.value = parsed.namaKegiatan ? `Surat Perintah Pemindahbukuan (${parsed.namaKegiatan})` : 'Surat Perintah Pemindahbukuan (SI BJB - BOSP Reguler)';

      // Render table rows
      if (previewTableBody) {
        previewTableBody.innerHTML = parsed.transfers.map((t, idx) => `
          <tr data-index="${idx}">
            <td style="font-weight: 700; text-align: center;">${t.no}</td>
            <td>
              <select class="table-select preview-unit-select" data-index="${idx}">
                ${PAGU_DATA.units.map(u => `
                  <option value="${u.id}" ${u.id === t.unitId ? 'selected' : ''}>${u.nama}</option>
                `).join('')}
              </select>
            </td>
            <td>
              <select class="table-select preview-kategori-select" data-index="${idx}">
                ${['Operasional', 'Modal', 'Buku', 'Honor'].map(k => `
                  <option value="${k}" ${k.toLowerCase() === t.kategori.toLowerCase() ? 'selected' : ''}>${k}</option>
                `).join('')}
              </select>
            </td>
            <td style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-primary);">
              ${t.rekening}
            </td>
            <td style="font-size: 0.82rem;">
              <strong>${t.namaBank}</strong> - ${t.atasNama}
            </td>
            <td style="font-size: 0.82rem; max-width: 220px;">
              ${t.uraian || t.ket}
            </td>
            <td class="table-num" style="font-weight: 700; color: #0284c7;">
              ${formatRupiah(t.netto)}
            </td>
          </tr>
        `).join('');
      }

      if (siUploadPreviewArea) siUploadPreviewArea.style.display = 'block';
      if (siDropzone) siDropzone.style.display = 'none';
      if (btnSaveUploadedSI) btnSaveUploadedSI.disabled = false;
    } catch (err) {
      console.error('Error parsing SI Excel:', err);
      alert('Terjadi kesalahan saat membaca file Excel: ' + err.message);
    }
  }

  btnReuploadFile?.addEventListener('click', () => {
    if (siUploadPreviewArea) siUploadPreviewArea.style.display = 'none';
    if (siDropzone) siDropzone.style.display = 'block';
    if (btnSaveUploadedSI) btnSaveUploadedSI.disabled = true;
    if (siFileInput) siFileInput.value = '';
    currentParsedSI = null;
  });

  // Save Uploaded SI
  btnSaveUploadedSI?.addEventListener('click', () => {
    if (!currentParsedSI) return;

    const noSI = metaNomorSI?.value.trim() || currentParsedSI.suggestedNomorSI;
    const tanggal = metaTanggalSI?.value || currentParsedSI.isoDate;
    const perihal = metaPerihalSI?.value.trim() || 'Surat Perintah Pemindahbukuan (SI BJB - BOSP Reguler)';

    const unitSelects = document.querySelectorAll('.preview-unit-select');
    const kategoriSelects = document.querySelectorAll('.preview-kategori-select');

    // Update transfers with user selections
    const updatedTransfers = currentParsedSI.transfers.map((t, idx) => {
      const uSelect = unitSelects[idx];
      const kSelect = kategoriSelects[idx];
      const unitId = uSelect ? uSelect.value : t.unitId;
      const unitObj = PAGU_DATA.units.find(u => u.id === unitId);
      const kategori = kSelect ? kSelect.value : t.kategori;

      return {
        no: idx + 1,
        unitId: unitId,
        unitNama: unitObj ? unitObj.nama : t.unitNama,
        kategori: kategori,
        vaSiplah: t.rekening,
        namaBank: t.namaBank,
        atasNama: t.atasNama,
        bruto: t.netto,
        pajak: 0,
        netto: t.netto,
        uraian: t.uraian || t.ket
      };
    });

    const totalNetto = updatedTransfers.reduce((sum, t) => sum + t.netto, 0);
    const newBatchId = 'SI-' + Date.now().toString().slice(-6);

    const newBatch = {
      id: newBatchId,
      nomorSI: noSI,
      tanggal: tanggal,
      tanggalFormat: formatDate(tanggal),
      perihal: perihal,
      namaBank: 'Bank BJB KCP Jatiasih di Bekasi',
      rekeningSumber: currentParsedSI.noTabungan || '0120640100100',
      atasNamaSumber: PROFIL_SEKOLAH.namaRekening,
      totalNominal: totalNetto,
      status: 'SELESAI TRANSAKSI',
      statusBadge: 'Lunas / Cair',
      catatan: `Import dari file: ${currentParsedSI.fileName}`,
      transfers: updatedTransfers
    };

    siBatches.push(newBatch);
    siBatches = sortSIBatchesChronological(siBatches);

    const chkAutoAdd = document.getElementById('chkAutoAddTransaksi');
    if (chkAutoAdd && chkAutoAdd.checked) {
      updatedTransfers.forEach((t, i) => {
        const cleanTitle = t.ket || `Belanja ${t.kategori} (${t.unitNama})`;
        const itemNote = t.note ? t.note.replace(/^>>>\s*/, '') : `Transfer SI No. ${t.no} ke ${t.atasNama} (${t.namaBank} ${t.vaSiplah || '-'})`;
        const newItem = {
          id: `TRX-${Date.now().toString().slice(-5)}-${i + 1}`,
          batchId: newBatch.id,
          noSI: newBatch.nomorSI,
          tanggal: newBatch.tanggal,
          unitId: t.unitId,
          unitNama: t.unitNama,
          kategori: t.kategori,
          namaBarang: cleanTitle,
          qty: 1,
          satuan: 'paket',
          hargaSatuan: t.netto,
          totalNominal: t.netto,
          vaSiplah: t.vaSiplah,
          status: 'Sudah Ditransaksikan',
          keterangan: itemNote
        };
        transaksiList.push(newItem);
      });
      transaksiList = sortTransaksiChronological(transaksiList);
    }

    const chkSetActive = document.getElementById('chkSetAsActiveSI');
    if (chkSetActive && chkSetActive.checked) {
      activeSIBatchId = newBatch.id;
    }

    localStorage.removeItem('bosku_explicit_empty');
    saveData();
    renderAll();
    closeUploadModal();

    // Reset modal state
    if (siUploadPreviewArea) siUploadPreviewArea.style.display = 'none';
    if (siDropzone) siDropzone.style.display = 'block';
    if (btnSaveUploadedSI) btnSaveUploadedSI.disabled = true;
    if (siFileInput) siFileInput.value = '';
    currentParsedSI = null;

    showToast(`✅ Berhasil import Dokumen SI: <strong>${newBatch.nomorSI}</strong> (${updatedTransfers.length} transfer, ${formatRupiah(totalNetto)})`);
  });
}

function setupFormAndModals() {
  // Modal Add
  const modalAdd = document.getElementById('modalAddTransaksi');
  const btnOpenModalAdd = document.getElementById('btnOpenModalAdd');
  const btnCloseModalAdd = document.getElementById('btnCloseModalAdd');
  const btnCancelAdd = document.getElementById('btnCancelAdd');
  const formAdd = document.getElementById('formAddTransaksi');

  const addQty = document.getElementById('addQty');
  const addHarga = document.getElementById('addHarga');
  const addTotalCalculated = document.getElementById('addTotalCalculated');
  const addTanggal = document.getElementById('addTanggal');

  if (addTanggal) {
    addTanggal.value = new Date().toISOString().slice(0, 10);
  }

  function updateTotal() {
    const q = Number(addQty?.value) || 0;
    const h = Number(addHarga?.value) || 0;
    const total = q * h;
    if (addTotalCalculated) addTotalCalculated.textContent = formatRupiah(total);
  }

  addQty?.addEventListener('input', updateTotal);
  addHarga?.addEventListener('input', updateTotal);

  btnOpenModalAdd?.addEventListener('click', () => {
    modalAdd?.classList.add('active');
    updateTotal();
  });

  const closeModal = () => modalAdd?.classList.remove('active');
  btnCloseModalAdd?.addEventListener('click', closeModal);
  btnCancelAdd?.addEventListener('click', closeModal);

  formAdd?.addEventListener('submit', (e) => {
    e.preventDefault();

    const unitId = document.getElementById('addUnit')?.value || 'PUTRA';
    const unitObj = PAGU_DATA.units.find(u => u.id === unitId);
    const q = Number(addQty?.value) || 1;
    const h = Number(addHarga?.value) || 0;
    const total = q * h;

    const newItem = {
      id: 'TRX-' + Date.now().toString().slice(-5),
      noSI: document.getElementById('addNoSI')?.value || '432/SI/SMA-FG/II/2026',
      tanggal: addTanggal?.value || new Date().toISOString().slice(0, 10),
      unitId: unitId,
      unitNama: unitObj ? unitObj.nama : unitId,
      kategori: document.getElementById('addKategori')?.value || 'Operasional',
      namaBarang: document.getElementById('addNamaBarang')?.value || '',
      qty: q,
      satuan: document.getElementById('addSatuan')?.value || 'pcs',
      hargaSatuan: h,
      totalNominal: total,
      vaSiplah: document.getElementById('addVA')?.value || '-',
      status: 'Sudah Ditransaksikan',
      keterangan: document.getElementById('addKet')?.value || ''
    };

    transaksiList.unshift(newItem);
    saveData();
    closeModal();
    formAdd.reset();
    if (addTanggal) addTanggal.value = new Date().toISOString().slice(0, 10);
    renderAll();
  });

  // Modal Detail Batch
  const modalDetail = document.getElementById('modalDetailBatch');
  const btnCloseModalDetail = document.getElementById('btnCloseModalDetail');
  const btnCloseModalDetailBtn = document.getElementById('btnCloseModalDetailBtn');
  const closeDetail = () => modalDetail?.classList.remove('active');
  btnCloseModalDetail?.addEventListener('click', closeDetail);
  btnCloseModalDetailBtn?.addEventListener('click', closeDetail);

  // Close modals on overlay click
  const modalUpload = document.getElementById('modalUploadSI');
  const modalEditSI = document.getElementById('modalEditSI');
  window.addEventListener('click', (e) => {
    if (e.target === modalAdd) closeModal();
    if (e.target === modalDetail) closeDetail();
    if (e.target === modalUpload) modalUpload.classList.remove('active');
    if (e.target === modalEditSI) window.closeEditSIModal();
  });

  // Modal Edit SI Add Row Button
  document.getElementById('btnEditAddTransferRow')?.addEventListener('click', window.addEditTransferRow);

  // Search and Filter Listeners
  document.getElementById('searchTransaksi')?.addEventListener('input', renderTransaksi);
  document.getElementById('filterSIBatch')?.addEventListener('change', renderTransaksi);
  document.getElementById('filterUnit')?.addEventListener('change', renderTransaksi);
  document.getElementById('filterKategori')?.addEventListener('change', renderTransaksi);

  // Export Excel
  document.getElementById('btnExportExcel')?.addEventListener('click', exportToExcel);

  // Kosongkan / Reset Seluruh Transaksi
  document.getElementById('btnResetData')?.addEventListener('click', window.kosongkanSemuaTransaksi);
  document.getElementById('btnKosongkanTransaksi')?.addEventListener('click', window.kosongkanSemuaTransaksi);
  document.getElementById('btnKosongkanDashboard')?.addEventListener('click', window.kosongkanSemuaTransaksi);



  // SI Document Tab Toggles
  const btnTabSurat = document.getElementById('btnTabSuratSI');
  const btnTabLampiran = document.getElementById('btnTabLampiranSI');

  btnTabSurat?.addEventListener('click', () => {
    currentCetakTab = 'surat';
    btnTabSurat.classList.add('active');
    btnTabLampiran?.classList.remove('active');
    renderCetakSI();
  });

  btnTabLampiran?.addEventListener('click', () => {
    currentCetakTab = 'lampiran';
    btnTabLampiran.classList.add('active');
    btnTabSurat?.classList.remove('active');
    renderCetakSI();
  });

  // Setup Upload SI Modal
  setupUploadSIModal();
}

// =========================================================
// 7. INITIALIZATION
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupNavigation();
  setupFormAndModals();
  renderAll();
});
