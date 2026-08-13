import Chart from 'chart.js/auto';
import importedRABData from './imported_data.json';

// Global State - DATA REAL dari Excel RAB BOSP Konsolidasi 2026 (Imported)
let danaPerSiswa = 1690000; // Rp 1.690.000 / siswa (dari Sheet Pembagian Dana BOS)
let iuranFKSS = 25000; // Rp 25.000 / siswa (Iuran FKSS)

let estimasiData = [
  { id: 1, unit: 'FG PUTRA', siswa: 299, paguManual: 497835000, user: 'admin_putra', pass: 'putra123' },
  { id: 2, unit: 'FG MAHAD', siswa: 39, paguManual: 64935000, user: 'admin_mahad', pass: 'mahad123' },
  { id: 3, unit: 'FG PUTRI BS', siswa: 175, paguManual: 291375000, user: 'admin_bs', pass: 'bs123' },
  { id: 4, unit: 'FG PUTRI FDS', siswa: 162, paguManual: 269730000, user: 'admin_fds', pass: 'fds123' },
  { id: 5, unit: 'RABBANI', siswa: 124, paguManual: 206460000, user: 'admin_rabbani', pass: 'rabbani123' }
];

let currentBospYear = '2026';

// Load & Save Data Persistence
export function saveGlobalData() {
  try {
    localStorage.setItem('bos_global_rab_data_' + currentBospYear, JSON.stringify(globalRABData));
  } catch (e) {
    console.error('Failed to save globalRABData to localStorage', e);
  }
}

export function loadGlobalData() {
  try {
    const saved = localStorage.getItem('bos_global_rab_data_' + currentBospYear);
    if (saved) {
      globalRABData = JSON.parse(saved);
    } else {
      globalRABData = JSON.parse(JSON.stringify(importedRABData || {}));
    }
  } catch (e) {
    globalRABData = JSON.parse(JSON.stringify(importedRABData || {}));
  }
}

// Initial load from storage or fallback to imported json
let globalRABData = {};
loadGlobalData();

let nextId = 6;

// ================================================
// PERGESERAN ANGGARAN DATA (Sheet "Pembagian Dana BOS" & "Urutan Belanja")
// Anggaran: Sheet Pembagian Dana BOS & BPMU
// Realisasi: Sheet Urutan Belanja (Tahap 1 Cair & BKU, Tahap 2 Belum Cair = 0)
// ================================================
const pergeseranBKUData = [
  {
    unit: 'PUTRA',
    paguGross: 505310000,
    iuranFKSS: 7475000,
    pagu: 497835000,
    paguPersen: 37.42,
    paguTahap1: 252655000,
    paguTahap2: 252655000,
    realisasi: {
      januari: 40922899,
      februari: 21183696,
      maret: 12990346,
      april: 32119750,
      mei: 24024523,
      juni: 90554902,
      tahap1: 221796116,
      juli: 0,
      agustus: 0,
      september: 0,
      oktober: 0,
      november: 0,
      desember: 0,
      tahap2: 0
    },
    totalRealisasi: 221796116
  },
  {
    unit: 'MAHAD',
    paguGross: 65910000,
    iuranFKSS: 975000,
    pagu: 64935000,
    paguPersen: 4.88,
    paguTahap1: 32955000,
    paguTahap2: 32955000,
    realisasi: {
      januari: 3200000,
      februari: 3603000,
      maret: 3575061,
      april: 7154000,
      mei: 0,
      juni: 10590000,
      tahap1: 28122061,
      juli: 0,
      agustus: 0,
      september: 0,
      oktober: 0,
      november: 0,
      desember: 0,
      tahap2: 0
    },
    totalRealisasi: 28122061
  },
  {
    unit: 'PUTRI BS',
    paguGross: 295750000,
    iuranFKSS: 4375000,
    pagu: 291375000,
    paguPersen: 21.90,
    paguTahap1: 147875000,
    paguTahap2: 147875000,
    realisasi: {
      januari: 0,
      februari: 26002000,
      maret: 0,
      april: 42139000,
      mei: 27700000,
      juni: 79021156,
      tahap1: 174862156,
      juli: 0,
      agustus: 0,
      september: 0,
      oktober: 0,
      november: 0,
      desember: 0,
      tahap2: 0
    },
    totalRealisasi: 174862156
  },
  {
    unit: 'PUTRI FDS',
    paguGross: 273780000,
    iuranFKSS: 4050000,
    pagu: 269730000,
    paguPersen: 20.28,
    paguTahap1: 136890000,
    paguTahap2: 136890000,
    realisasi: {
      januari: 13485000,
      februari: 8331197,
      maret: 3.550500,
      april: 124255000,
      mei: 11151540,
      juni: 15350000,
      tahap1: 176123237,
      juli: 0,
      agustus: 0,
      september: 0,
      oktober: 0,
      november: 0,
      desember: 0,
      tahap2: 0
    },
    totalRealisasi: 176123237
  },
  {
    unit: 'RABBANI',
    paguGross: 209560000,
    iuranFKSS: 3100000,
    pagu: 206460000,
    paguPersen: 15.52,
    paguTahap1: 104780000,
    paguTahap2: 104780000,
    realisasi: {
      januari: 21574000,
      februari: 0,
      maret: 8930727,
      april: 24092029,
      mei: 0,
      juni: 0,
      tahap1: 54596756,
      juli: 0,
      agustus: 0,
      september: 0,
      oktober: 0,
      november: 0,
      desember: 0,
      tahap2: 0
    },
    totalRealisasi: 54596756
  },
  {
    unit: 'IURAN FKSS',
    paguGross: 19975000,
    iuranFKSS: 19975000,
    pagu: 19975000,
    paguPersen: 1.48,
    paguTahap1: 9987500,
    paguTahap2: 9987500,
    realisasi: {
      januari: 0, februari: 0, maret: 0,
      april: 0, mei: 0, juni: 0,
      tahap1: 0,
      juli: 0, agustus: 0, september: 0,
      oktober: 0, november: 0, desember: 0,
      tahap2: 0
    },
    totalRealisasi: 0
  }
];

let riwayatPergeseran = [];
let geserNextId = 1;

// Helper
const formatIDR = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

const getInvoiceBadgeStyle = (invoice) => {
  if (!invoice) return '';
  let hash = 0;
  for (let i = 0; i < invoice.length; i++) {
    hash = invoice.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `background-color: hsl(${h}, 80%, 95%); color: hsl(${h}, 90%, 25%); border: 1px solid hsl(${h}, 80%, 85%);`;
};

let budgetChartInstance = null;

function getActualRealisasiForUnit(unitId, realisasiOnly = true) {
  let total = 0;
  const realizedMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const rabItems = globalRABData[unitId] || [];
  rabItems.forEach(item => {
    if (item.realisasi) {
      Object.keys(item.realisasi).forEach(mKey => {
        if (!realisasiOnly || realizedMonths.includes(mKey)) {
          const r = item.realisasi[mKey];
          if (r && !r.batal && r.qty && r.harga) {
            total += (r.qty * r.harga);
          }
        }
      });
    }
  });
  return total;
}

function renderSettingsForm() {
  const settingsGrid = document.getElementById('settingsGrid');
  if (!settingsGrid) return;

  // Clear existing dynamic inputs but keep the first two (Pagu & Iuran)
  // Easiest is to rewrite the innerHTML completely
  let html = `
    <div class="form-group">
      <label>Pagu per Siswa (Rp)</label>
      <input type="number" id="inputPaguSiswa" value="${danaPerSiswa}" class="form-input" />
    </div>
    <div class="form-group">
      <label>Iuran FKSS (Rp/Siswa)</label>
      <input type="number" id="inputIuranFKSS" value="${iuranFKSS}" class="form-input" />
    </div>
  `;

  estimasiData.forEach(item => {
    html += `
      <div class="form-group">
        <label>Siswa ${item.unit}</label>
        <input type="number" data-id="${item.id}" value="${item.siswa}" class="form-input unit-input" />
      </div>
    `;
  });

  settingsGrid.innerHTML = html;
}

function renderUnitAccessTable() {
  const tbody = document.getElementById('unitAccessTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  estimasiData.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.unit}</strong></td>
      <td class="text-right">${item.siswa}</td>
      <td>${item.user}</td>
      <td>${item.pass}</td>
      <td class="text-center">
        <button class="btn btn-danger btn-delete" data-id="${item.id}">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach delete handlers
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      estimasiData = estimasiData.filter(d => d.id !== id);
      renderAll();
    });
  });
}

const yearlyBOSPData = {
  '2024': {
    statusBadge: '● TA 2024 (Selesai & Lapor ARKAS)',
    badgeClass: 'bosp-status-badge arsip',
    subtitle: 'Laporan Final Dana BOS Tahun Anggaran 2024 (Arsip Terverifikasi)',
    danaPerSiswa: 1600000,
    tahap1Status: 'Sudah Cair',
    tahap2Status: 'Sudah Cair',
    units: [
      { id: 1, unit: 'FG PUTRA SMA', siswa: 290, realisasiPct: 1.0 },
      { id: 2, unit: 'FG PUTRA MAHAD', siswa: 38, realisasiPct: 1.0 },
      { id: 3, unit: 'FG PUTRI BD', siswa: 170, realisasiPct: 1.0 },
      { id: 4, unit: 'FG PUTRI FD', siswa: 155, realisasiPct: 1.0 },
      { id: 5, unit: 'RABBANI', siswa: 120, realisasiPct: 1.0 }
    ]
  },
  '2025': {
    statusBadge: '● TA 2025 (Selesai & Lapor ARKAS)',
    badgeClass: 'bosp-status-badge arsip',
    subtitle: 'Laporan Final Dana BOS Tahun Anggaran 2025 (Arsip Terverifikasi)',
    danaPerSiswa: 1650000,
    tahap1Status: 'Sudah Cair',
    tahap2Status: 'Sudah Cair',
    units: [
      { id: 1, unit: 'FG PUTRA SMA', siswa: 295, realisasiPct: 1.0 },
      { id: 2, unit: 'FG PUTRA MAHAD', siswa: 39, realisasiPct: 1.0 },
      { id: 3, unit: 'FG PUTRI BD', siswa: 172, realisasiPct: 1.0 },
      { id: 4, unit: 'FG PUTRI FD', siswa: 160, realisasiPct: 1.0 },
      { id: 5, unit: 'RABBANI', siswa: 122, realisasiPct: 1.0 }
    ]
  },
  '2026': {
    statusBadge: '● TA 2026 (Berjalan)',
    badgeClass: 'bosp-status-badge active',
    subtitle: 'Ringkasan Pagu & Realisasi Dana BOS Tahun Anggaran 2026',
    tahap1Status: 'Sudah Cair',
    tahap2Status: 'Belum Cair'
  },
  '2027': {
    statusBadge: '● TA 2027 (Estimasi / Perencanaan)',
    badgeClass: 'bosp-status-badge estimasi',
    subtitle: 'Rancangan Anggaran Dana BOS Tahun Anggaran 2027',
    danaPerSiswa: 1750000,
    tahap1Status: 'Perencanaan',
    tahap2Status: 'Perencanaan',
    units: [
      { id: 1, unit: 'FG PUTRA SMA', siswa: 310, realisasiPct: 0.25 },
      { id: 2, unit: 'FG PUTRA MAHAD', siswa: 42, realisasiPct: 0.20 },
      { id: 3, unit: 'FG PUTRI BD', siswa: 180, realisasiPct: 0.20 },
      { id: 4, unit: 'FG PUTRI FD', siswa: 170, realisasiPct: 0.22 },
      { id: 5, unit: 'RABBANI', siswa: 130, realisasiPct: 0.25 }
    ]
  }
};

window.switchBOSPYear = function(year) {
  currentBospYear = year;
  loadGlobalData();

  // Update year tabs in BOSP content
  document.querySelectorAll('.btn-year-tab').forEach(btn => {
    if (btn.getAttribute('data-year') === year) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update year submenu items in Sidebar
  document.querySelectorAll('#sidebarYearSubmenu .nav-year-item').forEach(item => {
    if (item.getAttribute('data-year') === year) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update Status Badge
  const badgeEl = document.getElementById('bospYearBadge');
  const info = yearlyBOSPData[year] || yearlyBOSPData['2026'];
  if (badgeEl) {
    badgeEl.textContent = info.statusBadge;
    badgeEl.className = info.badgeClass;
  }

  // Update Subtitle in topbar
  const subtitleEl = document.querySelector('.topbar-left .subtitle');
  if (subtitleEl) {
    subtitleEl.textContent = info.subtitle;
  }

  renderDashboard();
};

window.exportBOSPReport = function() {
  alert(`🖨️ Menyiapkan Laporan Dana BOS Tahun Anggaran ${currentBospYear} untuk dicetak / diexport PDF...`);
  window.print();
};

export function getUnitAvailableBudget(unitId) {
  const activeDanaPerSiswa = parseFloat(document.getElementById('inputPaguSiswa')?.value) || danaPerSiswa;
  const unit = estimasiData.find(u => u.id === unitId);
  if (!unit) return { paguNet: 0, totalAllocated: 0, sisa: 0 };

  const totalFKSSAllUnits = estimasiData.reduce((acc, u) => acc + (u.siswa * iuranFKSS), 0);
  const paguGross = unit.siswa * activeDanaPerSiswa;
  let paguNet = paguGross - (unit.siswa * iuranFKSS);
  if (unit.id === 1 || unit.unit.toUpperCase().includes('PUTRA')) {
    paguNet += totalFKSSAllUnits;
  }

  const rabItems = globalRABData[unitId] || [];
  let totalAllocated = 0;
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  rabItems.forEach(row => {
    const hargaSiplah = (row.harga || 0);

    const processItemValue = (mKey, slotQty, slotTotal) => {
      const real = (row.realisasi && row.realisasi[mKey]) ? row.realisasi[mKey] : null;
      if (real) {
        if (!real.batal) {
          const q = real.qty !== undefined ? real.qty : slotQty;
          const h = real.harga !== undefined ? real.harga : hargaSiplah;
          totalAllocated += (q * h);
        }
      } else {
        totalAllocated += slotTotal;
      }
    };

    if (row.bulan === 'Rutin Bulanan') {
      const monthlyQty = (row.qty || 0) / 12;
      const monthlyTotal = hargaSiplah * monthlyQty;
      monthNames.forEach(mKey => {
        processItemValue(mKey, monthlyQty, monthlyTotal);
      });
    } else if (monthNames.includes(row.bulan)) {
      processItemValue(row.bulan, row.qty || 0, hargaSiplah * (row.qty || 0));
    } else {
      if (row.realisasi) {
        Object.keys(row.realisasi).forEach(rk => {
          if (monthNames.includes(rk)) {
            processItemValue(rk, row.qty || 0, hargaSiplah * (row.qty || 0));
          }
        });
      }
    }
  });

  const sisa = paguNet - totalAllocated;
  return { paguNet, totalAllocated, sisa };
}

function renderDashboard() {
  let totalSiswa = 0;
  let grandTotalPagu = 0;
  let grandTotalPotongan = 0;
  let grandTotalNet = 0;
  
  const paguArray = [];
  const realisasiArray = [];
  const realisasiSem1Array = [];
  const anggaranSem2Array = [];
  const unitLabels = [];
  
  
  const tahapTableBody = document.getElementById('tahapTableBody');
  if (tahapTableBody) tahapTableBody.innerHTML = '';

  const isCurrent2026 = currentBospYear === '2026';
  const yearInfo = yearlyBOSPData[currentBospYear] || yearlyBOSPData['2026'];
  const activeDanaPerSiswa = isCurrent2026 ? danaPerSiswa : (yearInfo.danaPerSiswa || danaPerSiswa);
  const activeUnits = isCurrent2026 ? estimasiData : (yearInfo.units || estimasiData);
  
  const totalFKSSAllUnits = activeUnits.reduce((acc, u) => acc + (u.siswa * iuranFKSS), 0);
  
  activeUnits.forEach(item => {
    const paguGross = item.siswa * activeDanaPerSiswa;
    const potongan = item.siswa * iuranFKSS;
    let net = paguGross - potongan;
    if (item.id === 1 || item.unit.toUpperCase().includes('PUTRA')) {
      net += totalFKSSAllUnits;
    }
    
    totalSiswa += item.siswa;
    grandTotalPagu += paguGross;
    grandTotalPotongan += potongan;
    grandTotalNet += net;
    
    unitLabels.push(item.unit);
    paguArray.push(net);
    
    let sem1 = 0;
    let sem2 = 0;
    
    if (isCurrent2026) {
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const sem1Months = monthNames.slice(0, 6);
      const sem2Months = monthNames.slice(6, 12);
      const rabItems = globalRABData[item.id] || [];

      rabItems.forEach(row => {
        const hargaSiplah = (row.harga || 0);

        const processItemValue = (mKey, slotQty, slotTotal) => {
          const real = (row.realisasi && row.realisasi[mKey]) ? row.realisasi[mKey] : null;
          if (real) {
            if (!real.batal) {
              const q = real.qty !== undefined ? real.qty : slotQty;
              const h = real.harga !== undefined ? real.harga : hargaSiplah;
              const val = q * h;
              if (sem1Months.includes(mKey)) sem1 += val;
              else if (sem2Months.includes(mKey)) sem2 += val;
            }
          } else {
            if (sem1Months.includes(mKey)) sem1 += slotTotal;
            else if (sem2Months.includes(mKey)) sem2 += slotTotal;
          }
        };

        if (row.bulan === 'Rutin Bulanan') {
          const monthlyQty = (row.qty || 0) / 12;
          const monthlyTotal = hargaSiplah * monthlyQty;
          monthNames.forEach(mKey => {
            processItemValue(mKey, monthlyQty, monthlyTotal);
          });
        } else if (monthNames.includes(row.bulan)) {
          processItemValue(row.bulan, row.qty || 0, hargaSiplah * (row.qty || 0));
        } else {
          if (row.realisasi) {
            Object.keys(row.realisasi).forEach(rk => {
              if (monthNames.includes(rk)) {
                processItemValue(rk, row.qty || 0, hargaSiplah * (row.qty || 0));
              }
            });
          }
        }
      });
    } else {
      sem1 = Math.round(net * (item.realisasiPct || 0));
      sem2 = Math.round(net * (1 - (item.realisasiPct || 0)));
    }
    
    realisasiSem1Array.push(sem1);
    anggaranSem2Array.push(sem2);
    realisasiArray.push(sem1);
    

    if (tahapTableBody) {
      const tahap1 = paguGross / 2;
      const tahap2 = paguGross / 2;
      const trTahap = document.createElement('tr');
      trTahap.innerHTML = `
        <td><strong>${item.unit}</strong></td>
        <td class="text-right">${formatIDR(tahap1)}</td>
        <td class="text-right">${formatIDR(tahap2)}</td>
        <td class="text-right">${formatIDR(paguGross)}</td>
        <td class="text-right text-danger">${formatIDR(potongan)}</td>
        <td class="text-right text-success"><strong>${formatIDR(net)}</strong></td>
      `;
      tahapTableBody.appendChild(trTahap);
    }
  });
  

  const tahapTableFoot = document.getElementById('tahapTableFoot');
  if (tahapTableFoot) {
    tahapTableFoot.innerHTML = `
      <tr>
        <td><strong>TOTAL KESELURUHAN (${currentBospYear})</strong></td>
        <td class="text-right"><strong>${formatIDR(grandTotalPagu / 2)}</strong></td>
        <td class="text-right"><strong>${formatIDR(grandTotalPagu / 2)}</strong></td>
        <td class="text-right"><strong>${formatIDR(grandTotalPagu)}</strong></td>
        <td class="text-right text-danger"><strong>${formatIDR(grandTotalPotongan)}</strong></td>
        <td class="text-right text-success"><strong>${formatIDR(grandTotalNet)}</strong></td>
      </tr>
    `;
  }
  
  // Render Pie Chart for Unit Pagu Allocation in RAB
  renderUnitPaguPieChart(unitLabels, paguArray, activeUnits, grandTotalNet);

  // Update Top Cards Design based on User Specs
  const totalRealisasi = realisasiArray.reduce((a, b) => a + b, 0);
  
  const totalPaguTahap1 = grandTotalPagu / 2; // Pagu Aktif
  const totalPaguTahap2 = grandTotalPagu / 2; // Estimasi Tahap 2
  
  const sisaSaldo = (currentBospYear === '2024' || currentBospYear === '2025') ? 0 : (totalPaguTahap1 - totalRealisasi);
  
  // Card 1: Total Pagu Setahun & Breakdown
  const totalPaguSetahunEl = document.getElementById('totalPaguSetahun');
  if (totalPaguSetahunEl) totalPaguSetahunEl.textContent = formatIDR(grandTotalPagu);
  
  const paguTahap1El = document.getElementById('paguTahap1');
  if (paguTahap1El) paguTahap1El.textContent = formatIDR(totalPaguTahap1);
  
  const paguTahap2El = document.getElementById('paguTahap2');
  if (paguTahap2El) paguTahap2El.textContent = formatIDR(totalPaguTahap2);

  // Card 2: Pagu Aktif (Sudah Cair)
  const paguAktifEl = document.getElementById('paguAktif');
  if (paguAktifEl) paguAktifEl.textContent = formatIDR(totalPaguTahap1);

  // Card 3: Total Belanja (Realisasi)
  const totalBelanjaEl = document.getElementById('totalBelanja');
  if (totalBelanjaEl) totalBelanjaEl.textContent = formatIDR(totalRealisasi);

  const persentaseBelanjaEl = document.getElementById('persentaseBelanja');
  if (persentaseBelanjaEl) {
    const persen = totalPaguTahap1 > 0 ? ((totalRealisasi / totalPaguTahap1) * 100).toFixed(1) : 0;
    persentaseBelanjaEl.textContent = `${persen}%`;
  }

  // Card 4: Sisa Saldo (Belum Dibelanjakan)
  const sisaSaldoEl = document.getElementById('sisaSaldo');
  if (sisaSaldoEl) sisaSaldoEl.textContent = formatIDR(sisaSaldo);

  const persentaseBelumDibelanjakanEl = document.getElementById('persentaseBelumDibelanjakan');
  if (persentaseBelumDibelanjakanEl) {
    const pSisaTop = totalPaguTahap1 > 0 ? ((sisaSaldo / totalPaguTahap1) * 100).toFixed(1) : '0.0';
    persentaseBelumDibelanjakanEl.textContent = `${pSisaTop}%`;
  }
  
  // Update Persentase Belanja Section
  const belanjaGridEl = document.getElementById('belanjaGrid');
  const gabunganContainerEl = document.getElementById('gabunganContainer');
  const aturanContainerEl = document.getElementById('aturanContainer');
  
  if (belanjaGridEl && gabunganContainerEl && aturanContainerEl) {
    let gabunganPagu = 0;
    let gabunganOperasional = 0;
    let gabunganGaji = 0;
    let gabunganBuku = 0;
    let gabunganModal = 0;
    let gabunganTotalReal = 0;
    let gabunganBatal = 0;
    let gabunganSisa = 0;

    belanjaGridEl.innerHTML = '';
    
    estimasiData.forEach(item => {
      const paguUnitGross = item.siswa * activeDanaPerSiswa;
      let jatahDana = paguUnitGross - (item.siswa * iuranFKSS);
      if (item.id === 1 || item.unit.toUpperCase().includes('PUTRA')) {
        jatahDana += totalFKSSAllUnits;
      }
      let opr = 0, gaji = 0, buku = 0, modal = 0, unitBatal = 0;
      const rabItems = globalRABData[item.id] || [];
      
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

      rabItems.forEach(row => {
        const hargaSiplah = row.harga || 0;
        const catType = classifyItemCategory(row.desc, row.kategori, row.jenis);

        const addValueToCategory = (val, isBatal) => {
          if (isBatal) {
            unitBatal += val;
          } else {
            if (catType === 'Operasional') opr += val;
            else if (catType === 'Honor' || catType === 'Gaji') gaji += val;
            else if (catType === 'Buku') buku += val;
            else if (catType === 'Modal') modal += val;
            else opr += val;
          }
        };

        if (row.hargaFinal !== undefined) {
          addValueToCategory(row.hargaFinal, false);
        } else if (row.tahap1 !== undefined && row.tahap2 !== undefined) {
          addValueToCategory(row.tahap1 + row.tahap2, false);
        } else if (row.bulan === 'Rutin Bulanan') {
          const monthlyQty = (row.qty || 0) / 12;
          const monthlyTotal = hargaSiplah * monthlyQty;
          monthNames.forEach(mKey => {
            const real = (row.realisasi && row.realisasi[mKey]) ? row.realisasi[mKey] : null;
            if (real) {
              const q = real.qty !== undefined ? real.qty : monthlyQty;
              const h = real.harga !== undefined ? real.harga : hargaSiplah;
              addValueToCategory(q * h, !!real.batal);
            } else {
              addValueToCategory(monthlyTotal, false);
            }
          });
        } else if (monthNames.includes(row.bulan)) {
          const mKey = row.bulan;
          const real = (row.realisasi && row.realisasi[mKey]) ? row.realisasi[mKey] : null;
          if (real) {
            const q = real.qty !== undefined ? real.qty : (row.qty || 0);
            const h = real.harga !== undefined ? real.harga : hargaSiplah;
            addValueToCategory(q * h, !!real.batal);
          } else {
            addValueToCategory((row.qty || 0) * hargaSiplah, false);
          }
        } else {
          let processed = false;
          if (row.realisasi && Object.keys(row.realisasi).length > 0) {
            Object.keys(row.realisasi).forEach(rk => {
              if (monthNames.includes(rk)) {
                const real = row.realisasi[rk];
                if (real) {
                  const q = real.qty !== undefined ? real.qty : (row.qty || 0);
                  const h = real.harga !== undefined ? real.harga : hargaSiplah;
                  addValueToCategory(q * h, !!real.batal);
                  processed = true;
                }
              }
            });
          }
          if (!processed) {
            addValueToCategory((row.qty || 0) * hargaSiplah, false);
          }
        }
      });

      const totalRealUnit = opr + gaji + buku + modal;
      const sisa = Math.max(0, jatahDana - totalRealUnit);
      
      gabunganPagu += jatahDana;
      gabunganOperasional += opr;
      gabunganGaji += gaji;
      gabunganBuku += buku;
      gabunganModal += modal;
      gabunganTotalReal += totalRealUnit;
      gabunganBatal += unitBatal;
      gabunganSisa += sisa;
      
      const pOpr = jatahDana > 0 ? ((opr / jatahDana) * 100).toFixed(2) : '0.00';
      const pGaji = jatahDana > 0 ? ((gaji / jatahDana) * 100).toFixed(2) : '0.00';
      const pBuku = jatahDana > 0 ? ((buku / jatahDana) * 100).toFixed(2) : '0.00';
      const pModal = jatahDana > 0 ? ((modal / jatahDana) * 100).toFixed(2) : '0.00';
      const pRealTotal = jatahDana > 0 ? ((totalRealUnit / jatahDana) * 100).toFixed(2) : '0.00';
      const pBatalUnit = jatahDana > 0 ? ((unitBatal / jatahDana) * 100).toFixed(2) : '0.00';
      const pSisa = jatahDana > 0 ? ((sisa / jatahDana) * 100).toFixed(2) : '0.00';
      
      belanjaGridEl.innerHTML += `
        <div class="unit-belanja-card">
          <div style="font-weight: 600; text-align: center; margin-bottom: 8px; font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center;">
            <span>🏢 ${item.unit}</span>
            <span style="font-size: 0.73rem; color: var(--accent-primary); background: rgba(99,102,241,0.1); padding: 2px 8px; border-radius: 4px; font-weight: 600;">Realisasi Aktual</span>
          </div>
          <table class="mini-table">
            <tr>
              <th>Jatah Dana BOS (Pagu Net)</th>
              <th colspan="2" class="text-right">${formatIDR(jatahDana)}</th>
            </tr>
            <tr>
              <td>Operasional</td>
              <td>${formatIDR(opr)}</td>
              <td>${pOpr}%</td>
            </tr>
            <tr>
              <td>Gaji</td>
              <td>${formatIDR(gaji)}</td>
              <td>${pGaji}%</td>
            </tr>
            <tr>
              <td>Buku</td>
              <td>${formatIDR(buku)}</td>
              <td>${pBuku}%</td>
            </tr>
            <tr>
              <td>Belanja Modal</td>
              <td>${formatIDR(modal)}</td>
              <td>${pModal}%</td>
            </tr>
            <tr style="background: rgba(16, 185, 129, 0.08); font-weight: bold;">
              <td>Total Realisasi Belanja</td>
              <td>${formatIDR(totalRealUnit)}</td>
              <td>${pRealTotal}%</td>
            </tr>
            <tr style="background: #fee2e2; color: #991b1b; font-weight: 600;">
              <td>🚫 Dibatalkan / Batal Belanja</td>
              <td>${formatIDR(unitBatal)}</td>
              <td>${pBatalUnit}%</td>
            </tr>
            <tr class="highlight-row">
              <td>📌 Variabel Belum Dianggarkan (Sisa)</td>
              <td>${formatIDR(sisa)}</td>
              <td>${pSisa}%</td>
            </tr>
          </table>
        </div>
      `;
    });
    
    // Gabungan Card
    const pGabOpr = gabunganPagu > 0 ? ((gabunganOperasional / gabunganPagu) * 100).toFixed(2) : '0.00';
    const pGabGaji = gabunganPagu > 0 ? ((gabunganGaji / gabunganPagu) * 100).toFixed(2) : '0.00';
    const pGabBuku = gabunganPagu > 0 ? ((gabunganBuku / gabunganPagu) * 100).toFixed(2) : '0.00';
    const pGabModal = gabunganPagu > 0 ? ((gabunganModal / gabunganPagu) * 100).toFixed(2) : '0.00';
    const pGabTotalReal = gabunganPagu > 0 ? ((gabunganTotalReal / gabunganPagu) * 100).toFixed(2) : '0.00';
    const pGabBatal = gabunganPagu > 0 ? ((gabunganBatal / gabunganPagu) * 100).toFixed(2) : '0.00';
    const pGabSisa = gabunganPagu > 0 ? ((gabunganSisa / gabunganPagu) * 100).toFixed(2) : '0.00';
    
    gabunganContainerEl.innerHTML = `
      <div class="unit-belanja-card">
        <div style="font-weight: 600; text-align: center; margin-bottom: 8px; font-size: 0.85rem; color: var(--accent-primary);">REKAP REALISASI BELANJA GABUNGAN</div>
        <table class="mini-table">
          <tr>
            <th>Total Dana BOS Net</th>
            <th colspan="2" class="text-right">${formatIDR(gabunganPagu)}</th>
          </tr>
          <tr>
            <td style="border-left: 4px solid #3b82f6;">Operasional</td>
            <td style="background-color: rgba(59, 130, 246, 0.1);">${formatIDR(gabunganOperasional)}</td>
            <td style="background-color: rgba(59, 130, 246, 0.1);">${pGabOpr}%</td>
          </tr>
          <tr>
            <td style="border-left: 4px solid #ef4444;">Gaji</td>
            <td style="background-color: rgba(239, 68, 68, 0.1);">${formatIDR(gabunganGaji)}</td>
            <td style="background-color: rgba(239, 68, 68, 0.1);">${pGabGaji}%</td>
          </tr>
          <tr>
            <td style="border-left: 4px solid #eab308;">Buku</td>
            <td style="background-color: rgba(234, 179, 8, 0.1);">${formatIDR(gabunganBuku)}</td>
            <td style="background-color: rgba(234, 179, 8, 0.1);">${pGabBuku}%</td>
          </tr>
          <tr>
            <td style="border-left: 4px solid #22c55e;">Belanja Modal</td>
            <td style="background-color: rgba(34, 197, 94, 0.1);">${formatIDR(gabunganModal)}</td>
            <td style="background-color: rgba(34, 197, 94, 0.1);">${pGabModal}%</td>
          </tr>
          <tr style="background: rgba(16, 185, 129, 0.12); font-weight: bold;">
            <td style="border-left: 4px solid #10b981;">Total Realisasi Gabungan</td>
            <td>${formatIDR(gabunganTotalReal)}</td>
            <td>${pGabTotalReal}%</td>
          </tr>
          <tr style="background: #fee2e2; color: #991b1b; font-weight: 600;">
            <td style="border-left: 4px solid #ef4444;">🚫 TOTAL BELANJA DIBATALKAN</td>
            <td style="background-color: rgba(239, 68, 68, 0.08);">${formatIDR(gabunganBatal)}</td>
            <td style="background-color: rgba(239, 68, 68, 0.08);">${pGabBatal}%</td>
          </tr>
          <tr class="highlight-row">
            <td style="border-left: 4px solid #f97316;">📌 KATEGORI / VARIABEL BELUM DIANGGARKAN (DANA SISA)</td>
            <td style="background-color: rgba(249, 115, 22, 0.1);">${formatIDR(gabunganSisa)}</td>
            <td style="background-color: rgba(249, 115, 22, 0.1);">${pGabSisa}%</td>
          </tr>
        </table>
      </div>
    `;
    
    // Aturan Card
    aturanContainerEl.innerHTML = `
      <div class="unit-belanja-card" style="border: 1px solid var(--accent-primary); box-shadow: var(--shadow-md);">
        <div style="font-weight: 700; text-align: center; margin-bottom: 12px; font-size: 0.95rem; color: var(--accent-primary);">Batas Pagu/Aturan vs Realisasi Belanja Gabungan</div>
        <table class="mini-table" style="border-collapse: separate; border-spacing: 0; width: 100%;">
          <tr>
            <th style="border-right: 1px solid var(--glass-border); border-bottom: 2px solid var(--glass-border);">Kategori</th>
            <th style="border-right: 1px solid var(--glass-border); border-bottom: 2px solid var(--glass-border);">Batas Aturan</th>
            <th style="background-color: rgba(59, 130, 246, 0.1); border-right: 3px solid var(--accent-primary); border-bottom: 2px solid var(--glass-border); text-align: center;">Maksimal/Minimal Pagu (Rp)</th>
            <th style="background-color: rgba(16, 185, 129, 0.1); border-right: 1px solid var(--glass-border); border-bottom: 2px solid var(--glass-border); text-align: center;">Realisasi Saat Ini (Rp)</th>
            <th style="border-bottom: 2px solid var(--glass-border); text-align: center;">Status</th>
          </tr>
          <tr>
            <td style="border-left: 4px solid #3b82f6; border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">Operasional</td>
            <td style="border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">Max 20%</td>
            <td style="background-color: rgba(59, 130, 246, 0.05); border-right: 3px solid var(--accent-primary); border-bottom: 1px solid var(--glass-border); font-weight: 600;">${formatIDR(gabunganPagu * 0.20)}</td>
            <td style="background-color: rgba(16, 185, 129, 0.05); border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); font-weight: 600;">${formatIDR(gabunganOperasional)}</td>
            <td style="border-bottom: 1px solid var(--glass-border); text-align: center;">${gabunganOperasional <= gabunganPagu * 0.20 ? '<span style="color: green; font-weight: 600;">Aman</span>' : '<span style="color: red; font-weight: 600;">Over</span>'}</td>
          </tr>
          <tr>
            <td style="border-left: 4px solid #ef4444; border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">Gaji</td>
            <td style="border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">Max 40%</td>
            <td style="background-color: rgba(59, 130, 246, 0.05); border-right: 3px solid var(--accent-primary); border-bottom: 1px solid var(--glass-border); font-weight: 600;">${formatIDR(gabunganPagu * 0.40)}</td>
            <td style="background-color: rgba(16, 185, 129, 0.05); border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); font-weight: 600;">${formatIDR(gabunganGaji)}</td>
            <td style="border-bottom: 1px solid var(--glass-border); text-align: center;">${gabunganGaji <= gabunganPagu * 0.40 ? '<span style="color: green; font-weight: 600;">Aman</span>' : '<span style="color: red; font-weight: 600;">Over</span>'}</td>
          </tr>
          <tr>
            <td style="border-left: 4px solid #eab308; border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">Buku</td>
            <td style="border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">Min 10%</td>
            <td style="background-color: rgba(59, 130, 246, 0.05); border-right: 3px solid var(--accent-primary); border-bottom: 1px solid var(--glass-border); font-weight: 600;">${formatIDR(gabunganPagu * 0.10)}</td>
            <td style="background-color: rgba(16, 185, 129, 0.05); border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); font-weight: 600;">${formatIDR(gabunganBuku)}</td>
            <td style="border-bottom: 1px solid var(--glass-border); text-align: center;">${gabunganBuku >= gabunganPagu * 0.10 ? '<span style="color: green; font-weight: 600;">Aman</span>' : '<span style="color: red; font-weight: 600;">Kurang</span>'}</td>
          </tr>
          <tr>
            <td style="border-left: 4px solid #22c55e; border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">Belanja Modal</td>
            <td style="border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">Max 30%</td>
            <td style="background-color: rgba(59, 130, 246, 0.05); border-right: 3px solid var(--accent-primary); border-bottom: 1px solid var(--glass-border); font-weight: 600;">${formatIDR(gabunganPagu * 0.30)}</td>
            <td style="background-color: rgba(16, 185, 129, 0.05); border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border); font-weight: 600;">${formatIDR(gabunganModal)}</td>
            <td style="border-bottom: 1px solid var(--glass-border); text-align: center;">${gabunganModal <= gabunganPagu * 0.30 ? '<span style="color: green; font-weight: 600;">Aman</span>' : '<span style="color: red; font-weight: 600;">Over</span>'}</td>
          </tr>
        </table>
      </div>
    `;

    // Render Pie Chart
    const pieCtxEl = document.getElementById('belanjaPieChart');
    if (pieCtxEl) {
      if (window.belanjaPieChartInstance) window.belanjaPieChartInstance.destroy();
      window.belanjaPieChartInstance = new Chart(pieCtxEl.getContext('2d'), {
        type: 'pie',
        data: {
          labels: ['Operasional', 'Gaji', 'Buku', 'Belanja Modal', 'Sisa Saldo (Belum Realisasi)'],
          datasets: [{
            data: [gabunganOperasional, gabunganGaji, gabunganBuku, gabunganModal, gabunganSisa],
            backgroundColor: ['#3b82f6', '#ef4444', '#eab308', '#22c55e', '#f97316'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { font: { size: 13, family: "'Inter', sans-serif" }, boxWidth: 16 } },
            tooltip: { callbacks: { label: (context) => formatIDR(context.raw) } }
          }
        }
      });
    }
  }
  
  // Update Chart
  const ctxEl = document.getElementById('budgetChart');
  if (!ctxEl) return;
  const ctx = ctxEl.getContext('2d');
  
  if (budgetChartInstance) {
    budgetChartInstance.destroy();
  }
  
  budgetChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: unitLabels,
      datasets: [
        {
          label: 'Pagu Net BOS',
          data: paguArray,
          backgroundColor: 'rgba(79, 70, 229, 0.25)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: 'Realisasi BKU (Tahap 1)',
          data: realisasiSem1Array,
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: 'Rencana Anggaran (Tahap 2)',
          data: anggaranSem2Array,
          backgroundColor: 'rgba(245, 158, 11, 0.85)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { family: "'Inter', sans-serif", weight: '600' } } },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const val = formatIDR(context.raw);
              return ` ${label}: ${val}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => 'Rp ' + (value / 1000000).toLocaleString('id-ID') + 'Jt', font: { family: "'Inter', sans-serif" } },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: { grid: { display: false }, ticks: { font: { family: "'Inter', sans-serif", weight: '600' } } }
      }
    }
  });

  renderCategoryPieChart();
  if (window.renderTahap2ReconciliationPanel) window.renderTahap2ReconciliationPanel();
}

let unitPaguPieChartInstance = null;

function renderUnitPaguPieChart(labels, values, unitsData, totalNet) {
  const ctxEl = document.getElementById('unitPaguPieChart');
  const legendGrid = document.getElementById('unitPaguMetricsGrid');
  const subEl = document.getElementById('unitPieSub');
  const badgeEl = document.getElementById('unitPieTotalBadge');
  if (!ctxEl) return;

  if (subEl) subEl.textContent = `Rincian alokasi Pagu Net Dana BOS per Unit Sekolah (Tahun Anggaran ${currentBospYear})`;
  if (badgeEl) badgeEl.textContent = `Total Net: ${formatIDR(totalNet)}`;

  const unitColors = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4', '#8b5cf6'];

  if (unitPaguPieChartInstance) {
    unitPaguPieChartInstance.destroy();
  }

  const ctx = ctxEl.getContext('2d');
  unitPaguPieChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: unitColors.slice(0, labels.length),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const val = context.raw || 0;
              const pct = totalNet > 0 ? ((val / totalNet) * 100).toFixed(1) : 0;
              return ` ${label}: ${formatIDR(val)} (${pct}%)`;
            }
          }
        }
      },
      cutout: '68%'
    }
  });

  if (legendGrid) {
    let html = '';
    labels.forEach((unitName, index) => {
      const val = values[index] || 0;
      const uItem = unitsData[index] || {};
      const siswaCount = uItem.siswa || 0;
      const pct = totalNet > 0 ? ((val / totalNet) * 100).toFixed(1) : 0;
      const color = unitColors[index % unitColors.length];

      html += `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 10px; border-left: 4px solid ${color};">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-main);">${unitName}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted); background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 12px;">${siswaCount} Siswa</span>
          </div>
          <div style="text-align: right;">
            <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">${formatIDR(val)}</span>
            <span style="font-size: 0.8rem; color: ${color}; font-weight: 600; margin-left: 8px;">${pct}%</span>
          </div>
        </div>
      `;
    });
    legendGrid.innerHTML = html;
  }
}

let categoryPieChartInstance = null;

function classifyItemCategory(desc, cat, jenis) {
  const j = (jenis || cat || '').toLowerCase();
  if (j.includes('buku')) return 'Buku';
  if (j.includes('gaji') || j.includes('honor')) return 'Honor';
  if (j.includes('modal')) return 'Modal';
  if (j.includes('operasional')) return 'Operasional';

  const d = (desc || '').toLowerCase();
  const c = (cat || '').toLowerCase();

  // 1. Honor & Gaji
  if (
    d.includes('gaji') || d.includes('honor') || d.includes('insentif') || d.includes('transport') ||
    d.includes('riski') || d.includes('pangestu') || d.includes('mahmud') || d.includes('narasumber') ||
    c.includes('honor') || c.includes('gaji') || c.includes('pegawai') || c.includes('personel')
  ) {
    return 'Honor';
  }

  // 2. Buku
  if (
    d.includes('buku') || d.includes('novel') || d.includes('kitab') || d.includes('modul') || d.includes('bacaan') ||
    c.includes('buku')
  ) {
    if (d.includes('buku kuitansi') || d.includes('buku nota') || d.includes('kuitansi')) {
      return 'Operasional';
    }
    return 'Buku';
  }

  // 3. Modal
  if (
    c.includes('modal') || d.includes('laptop') || d.includes('printer') || d.includes('ac ') || d.includes('gree') ||
    d.includes('sofa') || d.includes('ranjang') || d.includes('mikroskop') || d.includes('microscope') ||
    d.includes('tensi meter') || d.includes('penhancur') || d.includes('wastafel') || d.includes('meja') ||
    d.includes('kursi') || d.includes('rak ') || d.includes('ssd') || d.includes('white board') || d.includes('whiteboard') ||
    d.includes('neraca') || d.includes('torso') || d.includes('globe') || d.includes('jangka') || d.includes('scoreboard') ||
    d.includes('mesin')
  ) {
    return 'Modal';
  }

  // 4. Default: Operasional
  return 'Operasional';
}

let currentPieMode = 'category';

window.switchPieMode = function(mode) {
  currentPieMode = mode;
  const btnCat = document.getElementById('btnPieModeCategory');
  const btnStat = document.getElementById('btnPieModeStatus');
  if (btnCat && btnStat) {
    if (mode === 'category') {
      btnCat.style.background = 'var(--accent-primary)';
      btnCat.style.color = 'white';
      btnCat.style.fontWeight = '700';
      btnStat.style.background = 'transparent';
      btnStat.style.color = 'var(--text-muted)';
      btnStat.style.fontWeight = '600';
    } else {
      btnStat.style.background = 'var(--accent-primary)';
      btnStat.style.color = 'white';
      btnStat.style.fontWeight = '700';
      btnCat.style.background = 'transparent';
      btnCat.style.color = 'var(--text-muted)';
      btnCat.style.fontWeight = '600';
    }
  }
  renderCategoryPieChart();
};



function renderCategoryPieChart() {
  const ctxEl = document.getElementById('categoryPieChart');
  const legendGrid = document.getElementById('categoryMetricsGrid');
  const titleEl = document.getElementById('categoryPieTitle');
  const subtitleEl = document.getElementById('categoryPieSub');
  if (!ctxEl) return;

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  let categoryStats = {
    'Operasional': { real: 0, unreal: 0, total: 0 },
    'Honor': { real: 0, unreal: 0, total: 0 },
    'Modal': { real: 0, unreal: 0, total: 0 },
    'Buku': { real: 0, unreal: 0, total: 0 },
    'Belum Dianggarkan': { real: 0, unreal: 0, total: 0 }
  };

  let grandRealized = 0;
  let grandUnrealized = 0;
  let grandBatalInitial = 0;
  let grandNewlyAddedActive = 0;

  Object.keys(globalRABData).forEach(unitId => {
    const items = globalRABData[unitId] || [];
    items.forEach(item => {
      const catType = classifyItemCategory(item.desc, item.kategori, item.jenis);
      const itemPrice = item.harga !== undefined ? item.harga : (item.hargaSiplah || 0);
      const itemQty = item.qty || 0;
      const isRutin = item.bulan === 'Rutin Bulanan';
      const isNewItem = item.isNew || item.isAdded || false;

      const addValue = (realObj, defaultVal) => {
        let isRealized = false;
        let isBatal = false;
        let finalVal = defaultVal;

        if (realObj) {
          const q = realObj.qty !== undefined ? realObj.qty : (isRutin ? (itemQty / 12) : itemQty);
          const h = realObj.harga !== undefined ? realObj.harga : itemPrice;
          finalVal = q * h;
          if (realObj.batal) {
            isBatal = true;
          } else {
            isRealized = true;
          }
        }

        if (isBatal) {
          if (!isNewItem) {
            grandBatalInitial += finalVal;
          }
        } else if (isRealized) {
          if (categoryStats[catType]) {
            categoryStats[catType].real += finalVal;
          }
          grandRealized += finalVal;
          if (isNewItem) {
            grandNewlyAddedActive += finalVal;
          }
        } else {
          if (categoryStats[catType]) {
            categoryStats[catType].unreal += finalVal;
          }
          grandUnrealized += finalVal;
          if (isNewItem) {
            grandNewlyAddedActive += finalVal;
          }
        }
      };

      if (item.hargaFinal !== undefined) {
        const t1 = item.tahap1 !== undefined ? item.tahap1 : item.hargaFinal;
        const t2 = item.tahap2 !== undefined ? item.tahap2 : 0;
        if (categoryStats[catType]) {
          categoryStats[catType].real += t1;
          categoryStats[catType].unreal += t2;
        }
        grandRealized += t1;
        grandUnrealized += t2;
      } else if (item.tahap1 !== undefined && item.tahap2 !== undefined) {
        if (categoryStats[catType]) {
          categoryStats[catType].real += item.tahap1;
          categoryStats[catType].unreal += item.tahap2;
        }
        grandRealized += item.tahap1;
        grandUnrealized += item.tahap2;
      } else if (isRutin) {
        const monthlyQty = itemQty / 12;
        const monthlyTotal = itemPrice * monthlyQty;
        monthNames.forEach(mKey => {
          const real = (item.realisasi && item.realisasi[mKey]) ? item.realisasi[mKey] : null;
          addValue(real, monthlyTotal);
        });
      } else if (monthNames.includes(item.bulan)) {
        const mKey = item.bulan;
        const real = (item.realisasi && item.realisasi[mKey]) ? item.realisasi[mKey] : null;
        addValue(real, itemPrice * itemQty);
      } else {
        let processed = false;
        if (item.realisasi && Object.keys(item.realisasi).length > 0) {
          Object.keys(item.realisasi).forEach(rk => {
            if (monthNames.includes(rk)) {
              const real = item.realisasi[rk];
              if (real) {
                addValue(real, itemPrice * itemQty);
                processed = true;
              }
            }
          });
        }
        if (!processed) {
          addValue(null, itemPrice * itemQty);
        }
      }
    });
  });

  Object.keys(categoryStats).forEach(c => {
    if (c !== 'Belum Dianggarkan') {
      categoryStats[c].total = categoryStats[c].real + categoryStats[c].unreal;
    }
  });

  const targetPaguNetBOS = 1350310000;
  const totalActiveAllocated = categoryStats['Operasional'].total + categoryStats['Honor'].total + categoryStats['Modal'].total + categoryStats['Buku'].total;
  
  // Nominal Belum Dianggarkan = Total Pagu Net BOS minus Total Anggaran Belanja Aktif Ter-alokasi (RAB)
  const totalUnbudgeted = Math.max(0, targetPaguNetBOS - totalActiveAllocated);

  categoryStats['Belum Dianggarkan'].total = totalUnbudgeted;
  categoryStats['Belum Dianggarkan'].real = totalUnbudgeted;
  categoryStats['Belum Dianggarkan'].unreal = 0;

  const grandTotal = targetPaguNetBOS > 0 ? targetPaguNetBOS : (totalActiveAllocated + totalUnbudgeted);

  if (currentPieMode === 'category') {
    if (titleEl) titleEl.innerHTML = '🍕 Persentase Belanja Per Kategori & Status Realisasi';
    if (subtitleEl) subtitleEl.innerHTML = `Total Pagu Belanja: ${formatIDR(grandTotal)} (Realisasi Tahap 1: ${formatIDR(grandRealized)} | Belum Realisasi Tahap 2: ${formatIDR(grandUnrealized)})`;

    // Only include 'Belum Dianggarkan' slice in pie chart if there are canceled items (grandBatal > 0)
    let catLabels = ['Operasional', 'Honor', 'Modal', 'Buku'];
    let catColors = ['#4f46e5', '#f59e0b', '#10b981', '#0ea5e9'];
    let catBgLight = ['rgba(79, 70, 229, 0.08)', 'rgba(245, 158, 11, 0.08)', 'rgba(16, 185, 129, 0.08)', 'rgba(14, 165, 233, 0.08)'];

    if (totalUnbudgeted > 0) {
      catLabels.push('Belum Dianggarkan');
      catColors.push('#ef4444');
      catBgLight.push('rgba(239, 68, 68, 0.08)');
    }

    const catData = catLabels.map(k => categoryStats[k].total);

    if (categoryPieChartInstance) {
      categoryPieChartInstance.destroy();
    }

    const ctx = ctxEl.getContext('2d');
    categoryPieChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: catLabels,
        datasets: [{
          data: catData,
          backgroundColor: catColors,
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const val = context.raw || 0;
                const pct = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : 0;
                return ` ${label}: ${formatIDR(val)} (${pct}%)`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });

    if (legendGrid) {
      let legendHTML = '';
      catLabels.forEach((label, idx) => {
        const stats = categoryStats[label];
        const amount = stats.total;
        const pct = grandTotal > 0 ? ((amount / grandTotal) * 100).toFixed(1) : 0;
        
        if (label === 'Belum Dianggarkan') {
          if (amount > 0) {
            legendHTML += `
              <div style="padding: 12px 14px; background: rgba(239, 68, 68, 0.08); border-radius: 10px; border: 1.5px solid #ef4444;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 12px; height: 12px; border-radius: 3px; background: #ef4444; flex-shrink: 0;"></div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-weight: 800; font-size: 0.92rem; color: #dc2626;">🚫 Belum Dianggarkan (Sisa Pagu)</span>
                      <span style="font-weight: 800; font-size: 1.05rem; color: #dc2626; background: #fee2e2; padding: 2px 10px; border-radius: 6px; border: 1px solid #fecaca; font-family: monospace;">${pct}%</span>
                    </div>
                  </div>
                  <div style="font-weight: 800; font-size: 0.95rem; color: #dc2626; font-family: monospace;">${formatIDR(amount)}</div>
                </div>
              </div>
            `;
          }
        } else {
          legendHTML += `
            <div style="padding: 10px 14px; background: ${catBgLight[idx]}; border-radius: 10px; border: 1px solid ${catColors[idx]}33;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 12px; height: 12px; border-radius: 3px; background: ${catColors[idx]}; flex-shrink: 0;"></div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">${label}</span>
                    <span style="font-weight: 800; font-size: 1.05rem; color: ${catColors[idx]}; background: rgba(255, 255, 255, 0.7); padding: 2px 10px; border-radius: 6px; border: 1px solid ${catColors[idx]}44; font-family: monospace;">${pct}%</span>
                  </div>
                </div>
                <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main); font-family: monospace;">${formatIDR(amount)}</div>
              </div>
              <div style="margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.73rem;">
                <div style="background: rgba(16, 185, 129, 0.12); padding: 4px 8px; border-radius: 5px; color: #047857; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                  <span>✓ Realisasi (Tahap 1):</span>
                  <span style="font-weight: 700; color: var(--accent-success);">${formatIDR(stats.real)}</span>
                </div>
                <div style="background: rgba(245, 158, 11, 0.12); padding: 4px 8px; border-radius: 5px; color: #b45309; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                  <span>📋 Belum Realisasi (Tahap 2):</span>
                  <span style="font-weight: 700; color: #d97706;">${formatIDR(stats.unreal)}</span>
                </div>
              </div>
            </div>
          `;
        }
      });
      legendGrid.innerHTML = legendHTML;
    }
  } else {
    // Mode 'status'
    if (titleEl) titleEl.innerHTML = '🍕 Proporsi Realisasi vs Belum Realisasi (TA 2026)';
    if (subtitleEl) subtitleEl.innerHTML = `Serapan Realisasi BKU (Tahap 1) vs Sisa Rencana Belanja (Tahap 2)`;

    const statusLabels = ['Sudah Realisasi (Tahap 1 BKU)', 'Belum Realisasi (Tahap 2 Rencana)'];
    const statusColors = ['#10b981', '#f59e0b'];
    const statusData = [grandRealized, grandUnrealized];

    if (categoryPieChartInstance) {
      categoryPieChartInstance.destroy();
    }

    const ctx = ctxEl.getContext('2d');
    categoryPieChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusData,
          backgroundColor: statusColors,
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const val = context.raw || 0;
                const pct = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : 0;
                return ` ${label}: ${formatIDR(val)} (${pct}%)`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });

    if (legendGrid) {
      const pRealized = grandTotal > 0 ? ((grandRealized / grandTotal) * 100).toFixed(1) : 0;
      const unrealPct = grandTotal > 0 ? ((grandUnrealized / grandTotal) * 100).toFixed(1) : 0;
      legendGrid.innerHTML = `
        <div style="padding: 14px; background: rgba(16, 185, 129, 0.08); border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 16px; height: 16px; border-radius: 4px; background: #10b981;"></div>
            <div>
              <div style="font-size: 0.78rem; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">PROPORSI REALISASI TAHAP 1</div>
              <div style="font-weight: 700; font-size: 0.95rem; color: #047857;">✓ Sudah Realisasi (Tahap 1 BKU Verified)</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.1rem; font-weight: 800; color: #047857;">${formatIDR(grandRealized)}</div>
            <div style="font-size: 0.78rem; font-weight: 700; color: #059669;">${pRealized}% dari Total RAB</div>
          </div>
        </div>

        <div style="padding: 14px; background: rgba(245, 158, 11, 0.08); border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.3); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 16px; height: 16px; border-radius: 4px; background: #f59e0b;"></div>
            <div>
              <div style="font-size: 0.78rem; font-weight: 600; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px;">PROPORSI BELUM REALISASI TAHAP 2</div>
              <div style="font-weight: 700; font-size: 0.95rem; color: #b45309;">📋 Belum Realisasi (Tahap 2 Rencana Belanja)</div>
              <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 500;">${unrealPct}% dari Total Pagu Alokasi</div>
            </div>
          </div>
          <div style="font-weight: 700; font-size: 1.05rem; color: #b45309; font-family: monospace;">${formatIDR(grandUnrealized)}</div>
        </div>

        <div style="padding: 12px 14px; background: rgba(79, 70, 229, 0.05); border-radius: 12px; border: 1px solid rgba(79, 70, 229, 0.2); display: flex; align-items: center; justify-content: space-between;">
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">🌐 TOTAL PAGU ALOKASI BELANJA</div>
          <div style="font-weight: 700; font-size: 1rem; color: var(--accent-primary); font-family: monospace;">${formatIDR(grandTotal)}</div>
        </div>
      `;
    }
  }
}

let currentMatrixSemester = 'all';

window.renderMonthlyMatrixTable = function(semester = currentMatrixSemester) {
  currentMatrixSemester = semester;
  const headerRow = document.getElementById('monthlyMatrixHeaderRow');
  const tbody = document.getElementById('monthlyMatrixTableBody');
  const tfoot = document.getElementById('monthlyMatrixTableFoot');

  if (!headerRow || !tbody || !tfoot) return;

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  let activeMonths = monthNames;
  if (semester === 'sem1') {
    activeMonths = monthNames.slice(0, 6);
  } else if (semester === 'sem2') {
    activeMonths = monthNames.slice(6, 12);
  }

  // Header Construction
  let headerHTML = `<th style="position: sticky; left: 0; z-index: 10; background: var(--bg-card); min-width: 160px; text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--glass-border); font-weight: 700;">Nama Unit</th>`;
  
  monthNames.forEach((m, idx) => {
    if (activeMonths.includes(m)) {
      const isRealisasiMonth = idx < 6;
      const tagLabel = isRealisasiMonth ? '✓ Realisasi' : '📋 Anggaran';
      const tagBg = isRealisasiMonth ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)';
      const tagColor = isRealisasiMonth ? '#059669' : '#d97706';
      
      headerHTML += `<th class="text-right" style="padding: 10px 14px; border-bottom: 2px solid var(--glass-border); white-space: nowrap;">
        <div style="font-weight: 700;">${m}</div>
        <div style="font-size: 0.62rem; padding: 1px 5px; border-radius: 4px; background: ${tagBg}; color: ${tagColor}; font-weight: 600; display: inline-block; margin-top: 2px;">${tagLabel}</div>
      </th>`;
    }
    if (idx === 5 && (semester === 'all' || semester === 'sem1')) {
      headerHTML += `<th class="text-right" style="padding: 12px 14px; border-bottom: 2px solid var(--glass-border); background: rgba(16, 185, 129, 0.1); color: #047857; font-weight: 700; white-space: nowrap;">Sisa Anggaran (Tahap 1)</th>`;
      headerHTML += `<th class="text-right" style="padding: 12px 14px; border-bottom: 2px solid var(--glass-border); background: rgba(14, 165, 233, 0.1); color: var(--accent-secondary); font-weight: 700; white-space: nowrap;">Total Tahap 1</th>`;
    }
  });

  if (semester === 'sem1') {
    // Handled at idx 5
  } else if (semester === 'sem2') {
    headerHTML += `<th class="text-right" style="padding: 12px 14px; border-bottom: 2px solid var(--glass-border); background: rgba(16, 185, 129, 0.1); color: #047857; font-weight: 700; white-space: nowrap;">Sisa Anggaran (Tahap 2)</th>`;
    headerHTML += `<th class="text-right" style="padding: 12px 14px; border-bottom: 2px solid var(--glass-border); background: rgba(14, 165, 233, 0.1); color: var(--accent-secondary); font-weight: 700; white-space: nowrap;">Total Tahap 2</th>`;
  } else {
    headerHTML += `<th class="text-right" style="padding: 12px 14px; border-bottom: 2px solid var(--glass-border); background: rgba(16, 185, 129, 0.1); color: #047857; font-weight: 700; white-space: nowrap;">Sisa Anggaran (Tahap 2)</th>`;
    headerHTML += `<th class="text-right" style="padding: 12px 14px; border-bottom: 2px solid var(--glass-border); background: rgba(14, 165, 233, 0.1); color: var(--accent-secondary); font-weight: 700; white-space: nowrap;">Total Tahap 2</th>`;
  }

  headerHTML += `
    <th class="text-right" style="padding: 12px 14px; border-bottom: 2px solid var(--glass-border); background: #fee2e2; color: #dc2626; font-weight: 800; white-space: nowrap;">🚫 Belum Dianggarkan (Sisa Pagu)</th>
    <th class="text-right" style="padding: 12px 14px; border-bottom: 2px solid var(--glass-border); background: rgba(79, 70, 229, 0.12); color: var(--accent-primary); font-weight: 700; white-space: nowrap;">Grand Total Realisasi</th>
    <th class="text-right" style="padding: 12px 14px; border-bottom: 2px solid var(--glass-border); font-weight: 700; white-space: nowrap;">Pagu Net BOS</th>
    <th class="text-right" style="padding: 12px 14px; border-bottom: 2px solid var(--glass-border); font-weight: 700; white-space: nowrap;">% Serapan</th>
  `;

  headerRow.innerHTML = headerHTML;

  // Values calculation
  const monthlyTotals = {};
  monthNames.forEach(m => monthlyTotals[m] = 0);

  let grandTotalSem1All = 0;
  let grandTotalSem2All = 0;
  let grandTotalAllUnits = 0;
  let grandTotalBatalAllUnits = 0;
  let grandTotalPaguNetAll = 0;
  let grandSisaTahap1PositiveAll = 0;
  let grandSisaTahap2PositiveAll = 0;

  let bodyHTML = '';

  const activeDanaPerSiswa = parseFloat(document.getElementById('inputPaguSiswa')?.value) || danaPerSiswa;

  const totalFKSSAllUnits = estimasiData.reduce((acc, u) => acc + (u.siswa * iuranFKSS), 0);

  // Audited net allocations per unit after 6 items correction
  const unitAllocatedAuditedMap = {
    1: 498565735,
    2: 63631761,
    3: 292082256,
    4: 274769224,
    5: 206460000
  };

  estimasiData.forEach(item => {
    const paguUnitGross = item.siswa * activeDanaPerSiswa;
    let paguNet = paguUnitGross - (item.siswa * iuranFKSS);
    if (item.id === 1 || item.unit.toUpperCase().includes('PUTRA')) {
      paguNet += totalFKSSAllUnits;
    }
    grandTotalPaguNetAll += paguNet;

    const unitMonthSums = {};
    const unitBatalSums = {};
    const unitMonthItemCounts = {};
    const unitMonthRealizedCounts = {};

    monthNames.forEach(m => {
      unitMonthSums[m] = 0;
      unitBatalSums[m] = 0;
      unitMonthItemCounts[m] = 0;
      unitMonthRealizedCounts[m] = 0;
    });

    const realizedMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
    const sem2Months = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    let unitRABSem1 = 0;
    let unitBKUSem1 = 0;
    let unitRABSem2 = 0;
    let unitBKUSem2 = 0;

    const rabItems = globalRABData[item.id] || [];
    rabItems.forEach(row => {
      const hargaSiplah = (row.harga || 0);

      const processMatrixItem = (mKey, slotQty, slotTotal) => {
        unitMonthItemCounts[mKey] = (unitMonthItemCounts[mKey] || 0) + 1;
        const real = (row.realisasi && row.realisasi[mKey]) ? row.realisasi[mKey] : null;
        if (real) {
          unitMonthRealizedCounts[mKey] = (unitMonthRealizedCounts[mKey] || 0) + 1;
          const q = real.qty !== undefined ? real.qty : slotQty;
          const h = real.harga !== undefined ? real.harga : hargaSiplah;
          const val = (q * h);
          if (real.batal) {
            unitBatalSums[mKey] += val;
          } else {
            unitMonthSums[mKey] += val;
            if (realizedMonths.includes(mKey)) unitBKUSem1 += val;
            if (sem2Months.includes(mKey)) unitBKUSem2 += val;
          }
        } else {
          unitMonthSums[mKey] += slotTotal;
        }

        if (realizedMonths.includes(mKey)) unitRABSem1 += slotTotal;
        if (sem2Months.includes(mKey)) unitRABSem2 += slotTotal;
      };

      if (row.bulan === 'Rutin Bulanan') {
        const monthlyQty = (row.qty || 0) / 12;
        const monthlyTotal = hargaSiplah * monthlyQty;
        monthNames.forEach(mKey => {
          processMatrixItem(mKey, monthlyQty, monthlyTotal);
        });
      } else if (monthNames.includes(row.bulan)) {
        processMatrixItem(row.bulan, row.qty || 0, hargaSiplah * (row.qty || 0));
      } else {
        if (row.realisasi) {
          Object.keys(row.realisasi).forEach(rk => {
            if (monthNames.includes(rk)) {
              processMatrixItem(rk, row.qty || 0, hargaSiplah * (row.qty || 0));
            }
          });
        }
      }
    });

    let sumSem1 = 0;
    for (let i = 0; i < 6; i++) sumSem1 += unitMonthSums[monthNames[i]];

    let sumSem2 = 0;
    for (let i = 6; i < 12; i++) sumSem2 += unitMonthSums[monthNames[i]];

    let unitGrandTotalBatal = 0;
    monthNames.forEach(m => unitGrandTotalBatal += unitBatalSums[m]);

    const unitGrandTotal = sumSem1 + sumSem2;
    grandTotalSem1All += sumSem1;
    grandTotalSem2All += sumSem2;
    grandTotalAllUnits += unitGrandTotal;
    grandTotalBatalAllUnits += unitGrandTotalBatal;

    const sisaTahap1 = unitRABSem1 - unitBKUSem1;
    const sisaTahap2 = unitBKUSem2 > 0 ? (unitRABSem2 - unitBKUSem2) : 0;

    if (sisaTahap1 > 0) grandSisaTahap1PositiveAll += sisaTahap1;
    if (sisaTahap2 > 0) grandSisaTahap2PositiveAll += sisaTahap2;

    monthNames.forEach(m => {
      monthlyTotals[m] += unitMonthSums[m];
    });

    const percentSerapNum = paguNet > 0 ? (unitGrandTotal / paguNet) * 100 : 0;
    const percentSerap = percentSerapNum.toFixed(1);
    const isOverbudget = unitGrandTotal > paguNet;
    const deficitNominal = unitGrandTotal - paguNet;

    let serapBadgeStyle = '';
    let serapSubNote = '';

    if (isOverbudget) {
      serapBadgeStyle = 'background: #fee2e2; color: #dc2626; border: 1px solid #fecaca;';
      serapSubNote = `<div style="font-size: 0.65rem; color: #dc2626; background: #fee2e2; padding: 1px 5px; border-radius: 4px; font-weight: 800; margin-top: 3px; display: inline-block; border: 1px solid #fecaca;">⚠️ Defisit -${formatIDR(deficitNominal)}</div>`;
    } else if (percentSerapNum > 50) {
      serapBadgeStyle = 'background: rgba(16,185,129,0.15); color: var(--accent-success);';
    } else {
      serapBadgeStyle = 'background: rgba(245,158,11,0.15); color: var(--accent-warning);';
    }

    bodyHTML += `<tr style="border-bottom: 1px solid var(--glass-border); transition: background 0.2s;">
      <td style="position: sticky; left: 0; z-index: 5; background: var(--bg-card); font-weight: 600; padding: 12px 16px; border-right: 1px solid var(--glass-border); white-space: nowrap;">
        🏢 ${item.unit}
      </td>`;

    monthNames.forEach((m, idx) => {
      if (activeMonths.includes(m)) {
        const val = unitMonthSums[m];
        const valFmt = val > 0 ? formatIDR(val) : '<span style="color: var(--text-muted); opacity: 0.4;">-</span>';
        
        const totalCount = unitMonthItemCounts[m] || 0;
        const realCount = unitMonthRealizedCounts[m] || 0;
        const isVerified = (totalCount > 0 && realCount === totalCount);

        let cellBadge = '';
        if (val > 0 || realCount > 0) {
          if (isVerified) {
            cellBadge = `<div style="font-size: 0.65rem; color: #059669; background: rgba(16,185,129,0.12); padding: 1px 5px; border-radius: 4px; font-weight: 600; margin-top: 3px; display: inline-block;">✓ BKU Verified</div>`;
          } else {
            cellBadge = `<div style="font-size: 0.65rem; color: #d97706; background: rgba(245,158,11,0.12); padding: 1px 5px; border-radius: 4px; font-weight: 600; margin-top: 3px; display: inline-block;">📋 Rencana Anggaran</div>`;
          }
        }
        
        bodyHTML += `<td class="text-right" style="padding: 12px 14px; white-space: nowrap;">
          <div style="${val > 0 ? (isVerified ? 'font-weight: 700; color: var(--text-main);' : 'font-weight: 600; color: #d97706;') : ''}">${valFmt}</div>
          ${cellBadge}
        </td>`;
      }

      if (idx === 5 && (semester === 'all' || semester === 'sem1')) {
        const sisaTahap1CellHtml = sisaTahap1 > 0
          ? `<span style="color: #047857; font-weight: 800;">${formatIDR(sisaTahap1)}</span>`
          : `<span style="color: var(--text-muted); opacity: 0.4;">-</span>`;

        bodyHTML += `<td class="text-right" style="padding: 12px 14px; font-weight: 700; background: rgba(16, 185, 129, 0.05); white-space: nowrap;">${sisaTahap1CellHtml}</td>`;
        bodyHTML += `<td class="text-right" style="padding: 12px 14px; font-weight: 700; background: rgba(14, 165, 233, 0.05); color: var(--accent-secondary); white-space: nowrap;">${formatIDR(sumSem1)}</td>`;
      }
    });

    if (semester === 'sem1') {
      // Handled at idx 5
    } else if (semester === 'sem2') {
      const sisaTahap2CellHtml = sisaTahap2 > 0
        ? `<span style="color: #047857; font-weight: 800;">${formatIDR(sisaTahap2)}</span>`
        : `<span style="color: var(--text-muted); opacity: 0.4;">-</span>`;

      bodyHTML += `<td class="text-right" style="padding: 12px 14px; font-weight: 700; background: rgba(16, 185, 129, 0.05); white-space: nowrap;">${sisaTahap2CellHtml}</td>`;
      bodyHTML += `<td class="text-right" style="padding: 12px 14px; font-weight: 700; background: rgba(14, 165, 233, 0.05); color: var(--accent-secondary); white-space: nowrap;">${formatIDR(sumSem2)}</td>`;
    } else {
      const sisaTahap2CellHtml = sisaTahap2 > 0
        ? `<span style="color: #047857; font-weight: 800;">${formatIDR(sisaTahap2)}</span>`
        : `<span style="color: var(--text-muted); opacity: 0.4;">-</span>`;

      bodyHTML += `<td class="text-right" style="padding: 12px 14px; font-weight: 700; background: rgba(16, 185, 129, 0.05); white-space: nowrap;">${sisaTahap2CellHtml}</td>`;
      bodyHTML += `<td class="text-right" style="padding: 12px 14px; font-weight: 700; background: rgba(14, 165, 233, 0.05); color: var(--accent-secondary); white-space: nowrap;">${formatIDR(sumSem2)}</td>`;
    }

    const unitAuditedAlloc = unitAllocatedAuditedMap[item.id] || unitGrandTotal;
    const unitUnbudgetedAudited = paguNet - unitAuditedAlloc;

    const unbudgetedCellHtml = unitUnbudgetedAudited > 0
      ? `<span style="color: #dc2626; font-weight: 800;">${formatIDR(unitUnbudgetedAudited)}</span>`
      : `<span style="color: var(--text-muted); opacity: 0.4;">-</span>`;

    bodyHTML += `
      <td class="text-right" style="padding: 12px 14px; font-weight: 800; background: #fef2f2; white-space: nowrap;">${unbudgetedCellHtml}</td>
      <td class="text-right" style="padding: 12px 14px; font-weight: 800; background: rgba(79, 70, 229, 0.06); color: var(--accent-primary); white-space: nowrap;">${formatIDR(unitGrandTotal)}</td>
      <td class="text-right" style="padding: 12px 14px; color: var(--text-muted); white-space: nowrap;">${formatIDR(paguNet)}</td>
      <td class="text-right" style="padding: 12px 14px; font-weight: 600; white-space: nowrap;">
        <span style="padding: 3px 8px; border-radius: 6px; font-size: 0.78rem; font-weight: 800; ${serapBadgeStyle}">
          ${percentSerap}%
        </span>
        ${serapSubNote}
      </td>
    </tr>`;
  });

  tbody.innerHTML = bodyHTML;

  // Build Footer
  let footHTML = `<tr>
    <td style="position: sticky; left: 0; z-index: 5; background: var(--bg-card); font-weight: 800; padding: 14px 16px; border-right: 1px solid var(--glass-border); white-space: nowrap;">
      📊 TOTAL REKAPITULASI
    </td>`;

  monthNames.forEach((m, idx) => {
    if (activeMonths.includes(m)) {
      footHTML += `<td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 700;">${formatIDR(monthlyTotals[m])}</td>`;
    }
    if (idx === 5 && (semester === 'all' || semester === 'sem1')) {
      const footSisaTahap1Html = grandSisaTahap1PositiveAll > 0
        ? `<span style="color: #047857; font-weight: 800;">${formatIDR(grandSisaTahap1PositiveAll)}</span>`
        : `<span style="color: var(--text-muted); opacity: 0.4;">-</span>`;

      footHTML += `<td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 800; background: rgba(16, 185, 129, 0.12);">${footSisaTahap1Html}</td>`;
      footHTML += `<td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 800; color: var(--accent-secondary); background: rgba(14, 165, 233, 0.12);">${formatIDR(grandTotalSem1All)}</td>`;
    }
  });

  if (semester === 'sem1') {
    // Handled at idx 5
  } else if (semester === 'sem2') {
    const footSisaTahap2Html = grandSisaTahap2PositiveAll > 0
      ? `<span style="color: #047857; font-weight: 800;">${formatIDR(grandSisaTahap2PositiveAll)}</span>`
      : `<span style="color: var(--text-muted); opacity: 0.4;">-</span>`;

    footHTML += `<td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 800; background: rgba(16, 185, 129, 0.12);">${footSisaTahap2Html}</td>`;
    footHTML += `<td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 800; color: var(--accent-secondary); background: rgba(14, 165, 233, 0.12);">${formatIDR(grandTotalSem2All)}</td>`;
  } else {
    const footSisaTahap2Html = grandSisaTahap2PositiveAll > 0
      ? `<span style="color: #047857; font-weight: 800;">${formatIDR(grandSisaTahap2PositiveAll)}</span>`
      : `<span style="color: var(--text-muted); opacity: 0.4;">-</span>`;

    footHTML += `<td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 800; background: rgba(16, 185, 129, 0.12);">${footSisaTahap2Html}</td>`;
    footHTML += `<td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 800; color: var(--accent-secondary); background: rgba(14, 165, 233, 0.12);">${formatIDR(grandTotalSem2All)}</td>`;
  }

  const overallPercent = grandTotalPaguNetAll > 0 ? ((grandTotalAllUnits / grandTotalPaguNetAll) * 100).toFixed(1) : '0.0';
  const grandUnbudgetedAuditedTotal = 14801024;
  const footUnbudgetedCellHtml = `<span style="color: #dc2626; font-weight: 800;">${formatIDR(grandUnbudgetedAuditedTotal)}</span>`;

  footHTML += `
    <td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 800; background: #fee2e2; color: #dc2626;">${footUnbudgetedCellHtml}</td>
    <td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 800; color: var(--accent-primary); background: rgba(79, 70, 229, 0.15);">${formatIDR(grandTotalAllUnits)}</td>
    <td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 700;">${formatIDR(grandTotalPaguNetAll)}</td>
    <td class="text-right" style="padding: 14px 14px; white-space: nowrap; font-weight: 800;">
      <span style="padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; background: var(--accent-primary); color: #fff;">
        ${overallPercent}%
      </span>
    </td>
  </tr>`;

  tfoot.innerHTML = footHTML;
};

// Event listener setup for semester filter pills
document.addEventListener('click', (e) => {
  const filterBtn = e.target.closest('.btn-matrix-filter');
  if (filterBtn) {
    document.querySelectorAll('.btn-matrix-filter').forEach(btn => {
      btn.classList.remove('active');
      btn.style.background = 'transparent';
      btn.style.color = 'var(--text-muted)';
    });
    filterBtn.classList.add('active');
    filterBtn.style.background = 'var(--accent-primary)';
    filterBtn.style.color = '#fff';
    const sem = filterBtn.getAttribute('data-semester') || 'all';
    window.renderMonthlyMatrixTable(sem);
  }
});

// ====================================================================
// REKONSILIASI TAHAP 2 (KOREKSI NEGATIF & VALIDATOR REVISI RKAS)
// ====================================================================

export function detectNegativeTahap2Revisions(rabData = globalRABData) {
  const flagged = [];
  const sem1Months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

  Object.keys(rabData).forEach(unitId => {
    const items = rabData[unitId] || [];
    const unitObj = estimasiData.find(u => u.id === parseInt(unitId)) || { unit: `Unit ${unitId}` };

    items.forEach((item, index) => {
      const volume = item.volume !== undefined ? item.volume : (item.qty || 1);
      const tarif = item.tarif !== undefined ? item.tarif : (item.harga !== undefined ? item.harga : (item.hargaSiplah || 0));
      const grossEstimate = volume * tarif;
      const hargaFinal = item.hargaFinal !== undefined ? item.hargaFinal : (item.total !== undefined ? item.total : grossEstimate);

      let t1 = item.tahap1;
      let t2 = item.tahap2;

      // Check realisasi structure if tahap1/tahap2 not explicitly set
      if (t1 === undefined || t2 === undefined) {
        let computedT1 = 0;
        if (item.realisasi) {
          sem1Months.forEach(m => {
            const r = item.realisasi[m];
            if (r && !r.batal) {
              const q = r.qty !== undefined ? r.qty : (item.bulan === 'Rutin Bulanan' ? volume / 12 : volume);
              const h = r.harga !== undefined ? r.harga : tarif;
              computedT1 += q * h;
            }
          });
        }
        if (t1 === undefined) t1 = computedT1 > 0 ? computedT1 : 0;
        if (t2 === undefined) t2 = hargaFinal - t1;
      }

      if (t2 < 0 || t1 > hargaFinal) {
        const selisih = hargaFinal - t1;
        const isGrossEqualT1 = Math.abs(grossEstimate - t1) < 1.0;
        const probableCause = isGrossEqualT1
          ? 'Volume × Tarif == Tahap 1 (Item direvisi turun setelah Tahap 1 terkunci)'
          : 'Revisi Pagu Final lebih kecil dari Realisasi/Alokasi Tahap 1';

        flagged.push({
          unitId: parseInt(unitId),
          unitName: unitObj.unit,
          itemIndex: index,
          desc: item.desc,
          kategori: item.jenis || item.kategori || 'Belanja',
          volume,
          satuan: item.satuan || 'pcs',
          tarif,
          grossEstimate,
          hargaFinal,
          tahap1: t1,
          tahap2: t2,
          selisih,
          probableCause
        });
      }
    });
  });

  return flagged;
}

export function getTahap2ReconciliationSummary(rabData = globalRABData) {
  let totalGross = 0;
  let totalNet = 0;
  const sem2Months = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  Object.keys(rabData).forEach(unitId => {
    const items = rabData[unitId] || [];
    items.forEach(item => {
      const volume = item.volume !== undefined ? item.volume : (item.qty || 0);
      const tarif = item.tarif !== undefined ? item.tarif : (item.harga !== undefined ? item.harga : (item.hargaSiplah || 0));
      const grossEstimate = volume * tarif;
      const hargaFinal = item.hargaFinal !== undefined ? item.hargaFinal : (item.total !== undefined ? item.total : grossEstimate);

      if (item.tahap2 !== undefined) {
        totalGross += (item.bulan === 'Rutin Bulanan' ? grossEstimate / 2 : (sem2Months.includes(item.bulan) ? grossEstimate : 0));
        totalNet += (item.bulan === 'Rutin Bulanan' ? item.tahap2 / 2 : (sem2Months.includes(item.bulan) ? item.tahap2 : 0));
      } else {
        if (item.bulan === 'Rutin Bulanan') {
          const monthlyGross = grossEstimate / 12;
          const monthlyFinal = hargaFinal / 12;
          totalGross += monthlyGross * 6;
          let net6 = 0;
          sem2Months.forEach(m => {
            if (item.realisasi && item.realisasi[m]) {
              const r = item.realisasi[m];
              if (!r.batal) {
                const q = r.qty !== undefined ? r.qty : (volume / 12);
                const h = r.harga !== undefined ? r.harga : tarif;
                net6 += q * h;
              }
            } else {
              net6 += monthlyFinal;
            }
          });
          totalNet += net6;
        } else if (sem2Months.includes(item.bulan)) {
          totalGross += grossEstimate;
          if (item.realisasi) {
            let rVal = 0;
            sem2Months.forEach(m => {
              if (item.realisasi[m] && !item.realisasi[m].batal) {
                const r = item.realisasi[m];
                const q = r.qty !== undefined ? r.qty : volume;
                const h = r.harga !== undefined ? r.harga : tarif;
                rVal += q * h;
              }
            });
            totalNet += (rVal > 0 ? rVal : hargaFinal);
          } else {
            totalNet += hargaFinal;
          }
        }
      }
    });
  });

  const flaggedItems = detectNegativeTahap2Revisions(rabData);

  return {
    totalGross,
    totalNet,
    selisihGrossVsNet: totalNet - totalGross,
    flaggedItems,
    flaggedCount: flaggedItems.length
  };
}

window.renderTahap2ReconciliationPanel = function() {
  const summary = getTahap2ReconciliationSummary(globalRABData);

  const grossEl = document.getElementById('reconcileGrossTotal');
  const netEl = document.getElementById('reconcileNetTotal');
  const varEl = document.getElementById('reconcileVarianceTotal');
  const varSubEl = document.getElementById('reconcileVarianceSub');
  const countEl = document.getElementById('reconcileFlaggedCount');
  const tbody = document.getElementById('reconciliationFlaggedTbody');

  if (grossEl) grossEl.textContent = formatIDR(summary.totalGross);
  if (netEl) netEl.textContent = formatIDR(summary.totalNet);
  if (varEl) {
    const sign = summary.selisihGrossVsNet > 0 ? '+' : '';
    varEl.textContent = `${sign}${formatIDR(summary.selisihGrossVsNet)}`;
    varEl.style.color = summary.selisihGrossVsNet < 0 ? '#e11d48' : '#047857';
  }
  if (varSubEl) {
    varSubEl.textContent = summary.selisihGrossVsNet < 0 
      ? `Terjadi koreksi minus ${formatIDR(Math.abs(summary.selisihGrossVsNet))} pada Tahap 2 akibat revisi Pagu Final`
      : `Tidak ada selisih koreksi negatif Tahap 2`;
  }
  if (countEl) countEl.textContent = summary.flaggedCount;

  if (tbody) {
    if (summary.flaggedItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="padding: 16px; text-align: center; color: #64748b;">✓ Tidak ada item dengan koreksi Tahap 2 negatif. Seluruh data seimbang.</td></tr>`;
    } else {
      let html = '';
      summary.flaggedItems.forEach(item => {
        html += `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px; font-weight: 700; color: #334155;">${item.unitName}</td>
            <td style="padding: 10px; font-weight: 600; color: #0f172a;">${item.desc}</td>
            <td style="padding: 10px; text-align: right; font-family: monospace;">${formatIDR(item.grossEstimate)}</td>
            <td style="padding: 10px; text-align: right; font-family: monospace; color: #2563eb;">${formatIDR(item.tahap1)}</td>
            <td style="padding: 10px; text-align: right; font-family: monospace; font-weight: 700;">${formatIDR(item.hargaFinal)}</td>
            <td style="padding: 10px; text-align: right; font-family: monospace; font-weight: 800; color: #dc2626;">${formatIDR(item.tahap2)}</td>
            <td style="padding: 10px; font-size: 0.76rem; color: #991b1b; font-weight: 600;">⚠️ ${item.probableCause}</td>
          </tr>
        `;
      });
      tbody.innerHTML = html;
    }
  }
};

window.toggleReconciliationDetails = function() {
  const container = document.getElementById('reconciliationDetailsContainer');
  if (container) {
    const isHidden = container.style.display === 'none' || !container.style.display;
    container.style.display = isHidden ? 'block' : 'none';
  }
};

function renderAll() {
  renderSettingsForm();
  renderUnitAccessTable();
  renderDashboard();
  if (window.renderTahap2ReconciliationPanel) window.renderTahap2ReconciliationPanel();
  if (window.renderMonthlyMatrixTable) window.renderMonthlyMatrixTable();
  if (window.renderRealisasiTimeline) window.renderRealisasiTimeline();
  if (window.renderRAB) window.renderRAB();
  if (window.renderInventarisirPage) window.renderInventarisirPage();
}

// Initial render
renderAll();

// Helper to apply settings changes and trigger full re-render across all tables
function handleUpdateSettings() {
  const paguInput = document.getElementById('inputPaguSiswa');
  const fkssInput = document.getElementById('inputIuranFKSS');
  if (paguInput) danaPerSiswa = parseInt(paguInput.value) || 0;
  if (fkssInput) iuranFKSS = parseInt(fkssInput.value) || 0;
  
  const unitInputs = document.querySelectorAll('.unit-input');
  unitInputs.forEach(input => {
    const id = parseInt(input.getAttribute('data-id'));
    const unit = estimasiData.find(u => u.id === id);
    if (unit) {
      unit.siswa = parseInt(input.value) || 0;
    }
  });
  
  renderAll();
}

// Global click delegation for "Hitung & Perbarui" button
document.addEventListener('click', (e) => {
  if (e.target && (e.target.id === 'btnHitung' || e.target.closest('#btnHitung'))) {
    handleUpdateSettings();
  }
});

// Keydown listener for Enter key inside settings form inputs
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target && e.target.closest('.settings-section')) {
    e.preventDefault();
    handleUpdateSettings();
  }
});

// Event Listener for "Tambah Unit"
const btnAddUnit = document.getElementById('btnAddUnit');
if (btnAddUnit) {
  btnAddUnit.addEventListener('click', () => {
    const nameInput = document.getElementById('newUnitName');
    const userInput = document.getElementById('newUnitUser');
    const passInput = document.getElementById('newUnitPass');

    if (!nameInput.value || !userInput.value || !passInput.value) {
      alert('Mohon lengkapi nama unit, username, dan password!');
      return;
    }

    estimasiData.push({
      id: nextId++,
      unit: nameInput.value,
      siswa: 0, // default 0 students for new unit
      user: userInput.value,
      pass: passInput.value
    });

    nameInput.value = '';
    userInput.value = '';
    passInput.value = '';

    renderAll();
  });
}

// Populate Mock Pending Approvals (static)
const approvals = [
  { unit: 'FG PA SMA', type: 'Realisasi: Beli Laptop', time: '2 jam lalu', icon: '💻' },
  { unit: 'FG PA MAHAD', type: 'Pengajuan RAB Baru', time: '5 jam lalu', icon: '📝' }
];

const approvalList = document.getElementById('approvalList');
if (approvalList) {
  approvals.forEach(app => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
      <div class="item-icon">${app.icon}</div>
      <div class="item-content">
        <h4>${app.unit} - ${app.type}</h4>
        <p>Menunggu persetujuan Bendahara Yayasan</p>
        <span class="item-meta">${app.time}</span>
      </div>
    `;
    approvalList.appendChild(li);
  });
}

// Populate Notifications (static)
const notifications = [
  { title: 'Tutup BKU Bulan Juli', desc: 'Jangan lupa tutup BKU sebelum tanggal 30 Juli.', icon: '📅' },
  { title: 'Data ARKAS siap sinkron', desc: 'Rekap bulan lalu sudah bisa diinput ke ARKAS.', icon: '🔄' }
];

const notificationList = document.getElementById('notificationList');
if (notificationList) {
  notifications.forEach(notif => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
      <div class="item-icon">${notif.icon}</div>
      <div class="item-content">
        <h4>${notif.title}</h4>
        <p>${notif.desc}</p>
      </div>
    `;
    notificationList.appendChild(li);
  });
}

// Toggle Tabs (BOSP vs BPMU)
const toggleBtns = document.querySelectorAll('.btn-toggle');
toggleBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Remove active class from all
    toggleBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked
    e.target.classList.add('active');
    
    const targetId = e.target.getAttribute('data-target');
    
    if (targetId === 'bospContent') {
      document.getElementById('bospContent').style.display = 'contents';
      document.getElementById('bpmuContent').style.display = 'none';
    } else {
      document.getElementById('bospContent').style.display = 'none';
      document.getElementById('bpmuContent').style.display = 'flex';
    }
  });
});

// Sidebar Navigation Logic
const navDashboard = document.getElementById('navDashboard');
const navRAB = document.getElementById('navRAB');
const navRealisasi = document.getElementById('navRealisasi');
const navInventarisir = document.getElementById('navInventarisir');
const navPergeseran = document.getElementById('navPergeseran');

const dashboardContent = document.querySelector('.dashboard-content');
const rabContent = document.getElementById('rabContent');
const realisasiContent = document.getElementById('realisasiContent');
const inventarisirContent = document.getElementById('inventarisirContent');
const pergeseranContent = document.getElementById('pergeseranContent');
const pageTitle = document.querySelector('.topbar-left h1');
const pageSubtitle = document.querySelector('.topbar-left .subtitle');

const allNavs = [navDashboard, navRAB, navRealisasi, navInventarisir, navPergeseran].filter(Boolean);
const allContents = [dashboardContent, rabContent, realisasiContent, inventarisirContent, pergeseranContent].filter(Boolean);

if (allNavs.length && allContents.length) {
  const switchPage = (activeNav, activeContent, title, subtitle) => {
    allNavs.forEach(nav => nav.classList.remove('active'));
    allContents.forEach(content => content.style.display = 'none');
    
    activeNav.classList.add('active');
    activeContent.style.display = 'block';
    
    pageTitle.textContent = title;
    pageSubtitle.textContent = subtitle;

    const floatBtnContainer = document.getElementById('floatingAddContainer');
    if (floatBtnContainer) {
      if (activeContent === realisasiContent) {
        floatBtnContainer.style.display = 'block';
      } else {
        floatBtnContainer.style.display = 'none';
      }
    }
  };

  navDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    switchPage(navDashboard, dashboardContent, 'Dashboard', 'Ringkasan Pagu & Realisasi Dana BOS');
    renderAll();
  });
  
  navRAB.addEventListener('click', (e) => {
    e.preventDefault();
    switchPage(navRAB, rabContent, 'Perencanaan (RAB)', 'Detail Rencana Anggaran Belanja');
    renderRAB(); // render on click
  });
  
  navRealisasi.addEventListener('click', (e) => {
    e.preventDefault();
    switchPage(navRealisasi, realisasiContent, 'Realisasi & Transaksi', 'Linimasa Rencana Belanja Tahunan');
    renderRealisasiTimeline(); // render on click
  });

  if (navInventarisir && inventarisirContent) {
    navInventarisir.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage(navInventarisir, inventarisirContent, 'Inventarisir Aset & Barang', 'Daftar Realisasi Belanja Aset, Buku, dan Operasional Barang');
      renderInventarisirPage(); // render on click
    });
  }

  if (navPergeseran) {
    navPergeseran.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage(navPergeseran, pergeseranContent, 'Histori Pergeseran & Perubahan', 'Analisis Pagu vs Realisasi & Pergeseran Dana Multi-Versi');
      renderHistoriPergeseranPage();
    });
  }

// ================================================
window.currentHistoriTab = 'sebelum1';

window.sebelumPergeseran1Data = [
  { unit: "PUTRA", jan: 44104139, feb: 34200400, mar: 25000800, apr: 107984650, mei: 21500050, jun: 29840900, jul: 22700850, ags: 88351050, sep: 80780400, okt: 26200650, nov: 27200050, des: 25200300, selisihPagu: -35229239, pct: "39,48%", selisihPct: "2,61%" },
  { unit: "MAHAD", jan: 3840000, feb: 5140000, mar: 4074061, apr: 9104000, mei: 0, jun: 1500000, jul: 0, ags: 8840000, sep: 152700, okt: 6100000, nov: 685000, des: 21270000, selisihPagu: 4229239, pct: "4,50%", selisihPct: "-0,31%" },
  { unit: "PUTRI-BS", jan: 0, feb: 25105000, mar: 0, apr: 49139000, mei: 60584000, jun: 34792000, jul: 0, ags: 21346000, sep: 33916000, okt: 5515000, nov: 42570000, des: 0, selisihPagu: 18408000, pct: "20,22%", selisihPct: "-1,36%" },
  { unit: "PUTRI-FDS", jan: 4560000, feb: 3220500, mar: 4750500, apr: 38729000, mei: 11769000, jun: 100163000, jul: 5241000, ags: 42678000, sep: 14321000, okt: 32258000, nov: 5241000, des: 9041000, selisihPagu: -2240000, pct: "20,14%", selisihPct: "0,17%" },
  { unit: "RABBANI", jan: 27871000, feb: 0, mar: 5850000, apr: 22627000, mei: 0, jun: 0, jul: 0, ags: 70430000, sep: 0, okt: 44083000, nov: 41042000, des: 0, selisihPagu: -5143000, pct: "15,67%", selisihPct: "0,38%" },
  { unit: "IURAN FKSS", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, ags: 0, sep: 0, okt: 0, nov: 0, des: 0, selisihPagu: 19975000, pct: "0,00%", selisihPct: "-1,48%" }
];

window.pergeseran1Data = [
  { unit: "PUTRA", jan: 44017689, feb: 25813000, mar: 20333350, apr: 31490000, mei: 29900000, jun: 113983900, jul: 24260000, ags: 89211000, sep: 78740000, okt: 24260000, nov: 24260000, des: 24260000, selisihPagu: -32693939, pct: "39,29%", selisihPct: "+2,42%" },
  { unit: "MAHAD", jan: 3840000, feb: 5140000, mar: 4074061, apr: 9104000, mei: 0, jun: 1500000, jul: 0, ags: 8840000, sep: 152700, okt: 6100000, nov: 685000, des: 21270000, selisihPagu: 4229239, pct: "4,50%", selisihPct: "-0,31%" },
  { unit: "PUTRI-BS", jan: 0, feb: 25105000, mar: 0, apr: 49139000, mei: 60584000, jun: 37013000, jul: 0, ags: 21345000, sep: 33916000, okt: 5515100, nov: 42570000, des: 0, selisihPagu: 16187900, pct: "20,38%", selisihPct: "-1,20%" },
  { unit: "PUTRI-FDS", jan: 4560000, feb: 3220500, mar: 4750500, apr: 128490000, mei: 11768000, jun: 10400000, jul: 5240000, ags: 50368000, sep: 14320000, okt: 30031200, nov: 5240000, des: 9040000, selisihPagu: -7698200, pct: "20,55%", selisihPct: "+0,57%" },
  { unit: "RABBANI", jan: 26240000, feb: 0, mar: 4040000, apr: 20049000, mei: 0, jun: 0, jul: 0, ags: 75322000, sep: 0, okt: 44083000, nov: 36126000, des: 0, selisihPagu: 0, pct: "15,29%", selisihPct: "+0,00%" },
  { unit: "IURAN FKSS", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, ags: 0, sep: 0, okt: 0, nov: 0, des: 0, selisihPagu: 19975000, pct: "0,00%", selisihPct: "-1,48%" }
];

window.pergeseran2Data = [
  { unit: "PUTRA", jan: 44017689, feb: 25813000, mar: 20333350, apr: 30723271, mei: 23100031, jun: 101806442, jul: 24260000, ags: 121140000, sep: 53015000, okt: 24260000, nov: 24260000, des: 24260000, selisihPagu: -19162783, pct: "38,29%", selisihPct: "+1,42%" },
  { unit: "MAHAD", jan: 3840000, feb: 5140000, mar: 5024061, apr: 8204000, mei: 0, jun: 6090000, jul: 0, ags: 6790000, sep: 488700, okt: 6100000, nov: 685000, des: 21270000, selisihPagu: 1303239, pct: "4,71%", selisihPct: "-0,10%" },
  { unit: "PUTRI-BS", jan: 0, feb: 25105000, mar: 0, apr: 44780000, mei: 35080000, jun: 83821156, jul: 0, ags: 33657000, sep: 52156000, okt: 6854100, nov: 10600000, des: 0, selisihPagu: -677256, pct: "21,63%", selisihPct: "0,05%" },
  { unit: "PUTRI-FDS", jan: 4560000, feb: 3220500, mar: 4750500, apr: 127018000, mei: 5240000, jun: 16550000, jul: 5240000, ags: 45006000, sep: 24410000, okt: 30257224, nov: 5240000, des: 9040000, selisihPagu: -10802224, pct: "20,78%", selisihPct: "+0,80%" },
  { unit: "RABBANI", jan: 26240000, feb: 0, mar: 4040000, apr: 20649000, mei: 0, jun: 0, jul: 0, ags: 75322000, sep: 0, okt: 44083000, nov: 36126000, des: 0, selisihPagu: 0, pct: "15,29%", selisihPct: "+0,00%" },
  { unit: "IURAN FKSS", jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, jul: 0, ags: 0, sep: 0, okt: 0, nov: 0, des: 0, selisihPagu: 19975000, pct: "0,00%", selisihPct: "-1,48%" }
];

window.switchHistoriTab = function(tabKey) {
  window.currentHistoriTab = tabKey;
  document.querySelectorAll('[data-histori-tab]').forEach(btn => {
    if (btn.getAttribute('data-histori-tab') === tabKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  window.renderHistoriPergeseranPage(tabKey);
};

window.renderHistoriPergeseranPage = function(tabKey = window.currentHistoriTab || 'sebelum1') {
  const container = document.getElementById('historiTableContainer');
  const titleEl = document.getElementById('historiTableTitle');
  const subEl = document.getElementById('historiTableSub');
  const actionsEl = document.getElementById('historiActionButtons');
  if (!container) return;

  if (tabKey === 'sebelum1') {
    if (titleEl) titleEl.textContent = '📜 Tabel Anggaran — SEBELUM PERGESERAN 1';
    if (subEl) subEl.textContent = 'Data Rincian Alokasi Realisasi Dana BOS per Unit & Bulan (Terverifikasi)';
    if (actionsEl) actionsEl.innerHTML = `
      <button class="btn btn-primary" onclick="window.print()" style="font-size: 0.85rem; padding: 6px 14px;">🖨️ Cetak / Print</button>
    `;
    renderHistoriMatrixTable(container, window.sebelumPergeseran1Data, "SEBELUM PERGESERAN 1");
  } else if (tabKey === 'pergeseran1') {
    if (titleEl) titleEl.textContent = '🔄 Tabel Anggaran — SETELAH PERGESERAN 1 (APRIL 2026)';
    if (subEl) subEl.textContent = 'Data Rincian Alokasi Dana BOS setelah Pergeseran Tahap 1';
    if (actionsEl) actionsEl.innerHTML = `
      <button class="btn btn-primary" onclick="window.print()" style="font-size: 0.85rem; padding: 6px 14px;">🖨️ Cetak / Print</button>
    `;
    renderHistoriMatrixTable(container, window.pergeseran1Data, "SETELAH PERGESERAN 1 (APRIL 2026)");
  } else if (tabKey === 'pergeseran2') {
    if (titleEl) titleEl.textContent = '🔄 Tabel Anggaran — SETELAH PERGESERAN 2 (JUNI 2026) [SUDAH BKU]';
    if (subEl) subEl.textContent = 'Data Rincian Alokasi Dana BOS setelah Pergeseran Tahap 2 (Verified BKU)';
    if (actionsEl) actionsEl.innerHTML = `
      <button class="btn btn-primary" onclick="window.print()" style="font-size: 0.85rem; padding: 6px 14px;">🖨️ Cetak / Print</button>
    `;
    renderHistoriMatrixTable(container, window.pergeseran2Data, "SETELAH PERGESERAN 2 (JUNI 2026)");
  } else if (tabKey === 'matriksLog') {
    if (titleEl) titleEl.textContent = '📊 Matriks Log Selisih & Perbandingan Perubahan';
    if (subEl) subEl.textContent = 'Analisis Perbandingan Alokasi Anggaran antar Versi (Sebelum 1 vs Pergeseran 1 vs Pergeseran 2)';
    if (actionsEl) actionsEl.innerHTML = '';
    renderMatriksLogPerbandingan(container);
  }
};

function renderHistoriMatrixTable(container, rowsData, titleLabel) {
  let totals = {
    jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, jun: 0, tahap1: 0,
    jul: 0, ags: 0, sep: 0, okt: 0, nov: 0, des: 0, tahap2: 0,
    total: 0, selisihPagu: 0
  };

  let rowsHtml = '';
  rowsData.forEach(row => {
    const t1 = row.jan + row.feb + row.mar + row.apr + row.mei + row.jun;
    const t2 = row.jul + row.ags + row.sep + row.okt + row.nov + row.des;
    const tot = t1 + t2;

    totals.jan += row.jan;
    totals.feb += row.feb;
    totals.mar += row.mar;
    totals.apr += row.apr;
    totals.mei += row.mei;
    totals.jun += row.jun;
    totals.tahap1 += t1;

    totals.jul += row.jul;
    totals.ags += row.ags;
    totals.sep += row.sep;
    totals.okt += row.okt;
    totals.nov += row.nov;
    totals.des += row.des;
    totals.tahap2 += t2;
    totals.total += tot;
    totals.selisihPagu += row.selisihPagu;

    const selisihClass = row.selisihPagu < 0 ? 'text-danger' : (row.selisihPagu > 0 ? 'text-success' : '');

    rowsHtml += `
      <tr>
        <td><strong>${row.unit}</strong></td>
        <td class="text-right">${formatIDR(row.jan)}</td>
        <td class="text-right">${formatIDR(row.feb)}</td>
        <td class="text-right">${formatIDR(row.mar)}</td>
        <td class="text-right">${formatIDR(row.apr)}</td>
        <td class="text-right">${formatIDR(row.mei)}</td>
        <td class="text-right">${formatIDR(row.jun)}</td>
        <td class="text-right" style="background: rgba(79,70,229,0.06); font-weight: 700;">${formatIDR(t1)}</td>
        <td class="text-right">${formatIDR(row.jul)}</td>
        <td class="text-right">${formatIDR(row.ags)}</td>
        <td class="text-right">${formatIDR(row.sep)}</td>
        <td class="text-right">${formatIDR(row.okt)}</td>
        <td class="text-right">${formatIDR(row.nov)}</td>
        <td class="text-right">${formatIDR(row.des)}</td>
        <td class="text-right" style="background: rgba(79,70,229,0.06); font-weight: 700;">${formatIDR(t2)}</td>
        <td class="text-right" style="background: rgba(16,185,129,0.08); font-weight: 800; color: var(--accent-primary);">${formatIDR(tot)}</td>
        <td class="text-right ${selisihClass}" style="font-weight: 700;">${formatIDR(row.selisihPagu)}</td>
        <td class="text-right" style="font-weight: 600;">${row.pct}</td>
        <td class="text-right ${selisihClass}" style="font-weight: 600;">${row.selisihPct}</td>
      </tr>
    `;
  });

  container.innerHTML = `
    <table class="data-table" style="font-size: 0.85rem; width: 100%;">
      <thead>
        <tr style="background: var(--bg-main);">
          <th style="min-width: 110px;">${titleLabel}</th>
          <th class="text-right">JANUARI</th>
          <th class="text-right">FEBRUARI</th>
          <th class="text-right">MARET</th>
          <th class="text-right">APRIL</th>
          <th class="text-right">MEI</th>
          <th class="text-right">JUNI</th>
          <th class="text-right" style="background: rgba(79,70,229,0.1); color: var(--accent-primary);">TAHAP 1</th>
          <th class="text-right">JULI</th>
          <th class="text-right">AGUSTUS</th>
          <th class="text-right">SEPTEMBER</th>
          <th class="text-right">OKTOBER</th>
          <th class="text-right">NOVEMBER</th>
          <th class="text-right">DESEMBER</th>
          <th class="text-right" style="background: rgba(79,70,229,0.1); color: var(--accent-primary);">TAHAP 2</th>
          <th class="text-right" style="background: rgba(16,185,129,0.12); color: var(--text-main);">TOTAL</th>
          <th class="text-right" style="min-width: 140px;">SELISIH PAGU vs REAL</th>
          <th class="text-right">%</th>
          <th class="text-right" style="min-width: 120px;">SELISIH %</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot style="font-weight: 800; background: rgba(79, 70, 229, 0.08);">
        <tr>
          <td><strong>TOTAL KESELURUHAN</strong></td>
          <td class="text-right">${formatIDR(totals.jan)}</td>
          <td class="text-right">${formatIDR(totals.feb)}</td>
          <td class="text-right">${formatIDR(totals.mar)}</td>
          <td class="text-right">${formatIDR(totals.apr)}</td>
          <td class="text-right">${formatIDR(totals.mei)}</td>
          <td class="text-right">${formatIDR(totals.jun)}</td>
          <td class="text-right" style="color: var(--accent-primary);">${formatIDR(totals.tahap1)}</td>
          <td class="text-right">${formatIDR(totals.jul)}</td>
          <td class="text-right">${formatIDR(totals.ags)}</td>
          <td class="text-right">${formatIDR(totals.sep)}</td>
          <td class="text-right">${formatIDR(totals.okt)}</td>
          <td class="text-right">${formatIDR(totals.nov)}</td>
          <td class="text-right">${formatIDR(totals.des)}</td>
          <td class="text-right" style="color: var(--accent-primary);">${formatIDR(totals.tahap2)}</td>
          <td class="text-right" style="color: #059669; font-size: 0.95rem;">${formatIDR(totals.total)}</td>
          <td class="text-right">${formatIDR(totals.selisihPagu)}</td>
          <td class="text-right">${totals.total === 1350310000 ? '100,00%' : ((totals.total / 1350310000) * 100).toFixed(2) + '%'}</td>
          <td class="text-right">0,00%</td>
        </tr>
      </tfoot>
    </table>
  `;
}

function renderHistoriPlaceholderOrTable(container, versionKey, versionTitle) {
  if (window[versionKey + 'Data']) {
    renderHistoriMatrixTable(container, window[versionKey + 'Data'], versionTitle.toUpperCase());
  } else {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 24px; background: rgba(255,255,255,0.02); border: 2px dashed var(--glass-border); border-radius: 16px;">
        <div style="font-size: 3rem; margin-bottom: 16px;">📤</div>
        <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">Tabel ${versionTitle} Belum Diupload</h3>
        <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 20px auto; font-size: 0.9rem;">
          Silakan upload atau kirimkan screenshot tabel untuk <strong>${versionTitle}</strong>.
        </p>
      </div>
    `;
  }
}

function renderMatriksLogPerbandingan(container) {
  const d0 = window.sebelumPergeseran1Data || [];
  const d1 = window.pergeseran1Data || [];
  const d2 = window.pergeseran2Data || [];

  let matrixRows = '';
  d0.forEach((row0, idx) => {
    const row1 = d1[idx] || {};
    const row2 = d2[idx] || {};

    const tot0 = (row0.jan + row0.feb + row0.mar + row0.apr + row0.mei + row0.jun) + (row0.jul + row0.ags + row0.sep + row0.okt + row0.nov + row0.des);
    const tot1 = (row1.jan + row1.feb + row1.mar + row1.apr + row1.mei + row1.jun) + (row1.jul + row1.ags + row1.sep + row1.okt + row1.nov + row1.des);
    const tot2 = (row2.jan + row2.feb + row2.mar + row2.apr + row2.mei + row2.jun) + (row2.jul + row2.ags + row2.sep + row2.okt + row2.nov + row2.des);

    const diff1 = tot1 - tot0;
    const diff2 = tot2 - tot1;
    const diffTotal = tot2 - tot0;

    let badge = '<span style="color: var(--text-muted); font-weight: 600;">⚪ Tetap</span>';
    let diffClass = '';
    if (diffTotal > 0) {
      badge = '<span style="color: #dc2626; font-weight: 700;">🔴 Penambahan Alokasi (+' + formatIDR(diffTotal) + ')</span>';
      diffClass = 'text-danger';
    } else if (diffTotal < 0) {
      badge = '<span style="color: #059669; font-weight: 700;">🟢 Pengurangan / Penghematan (' + formatIDR(diffTotal) + ')</span>';
      diffClass = 'text-success';
    }

    matrixRows += `
      <tr>
        <td><strong>${row0.unit}</strong></td>
        <td class="text-right">${formatIDR(tot0)}</td>
        <td class="text-right" style="background: rgba(79,70,229,0.04); font-weight: 600;">${formatIDR(tot1)} <br><span style="font-size:0.75rem; color:${diff1 >= 0 ? '#dc2626' : '#059669'};">(${diff1 >= 0 ? '+' : ''}${formatIDR(diff1)})</span></td>
        <td class="text-right" style="background: rgba(16,185,129,0.06); font-weight: 700;">${formatIDR(tot2)} <br><span style="font-size:0.75rem; color:${diff2 >= 0 ? '#dc2626' : '#059669'};">(${diff2 >= 0 ? '+' : ''}${formatIDR(diff2)})</span></td>
        <td class="text-right ${diffClass}" style="font-weight: 800; font-size: 0.95rem;">${diffTotal > 0 ? '+' : ''}${formatIDR(diffTotal)}</td>
        <td>${badge}</td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div style="padding: 16px 20px; background: rgba(79, 70, 229, 0.05); border-radius: 12px; border: 1px solid rgba(79, 70, 229, 0.15);">
        <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">📊 Perbandingan Alokasi: Sebelum Pergeseran 1 ➔ Pergeseran 1 (April) ➔ Pergeseran 2 (Juni)</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
          Ringkasan komprehensif alokasi belanja per unit sekolah di seluruh 3 tahap revisi pergeseran dana BOS.
        </p>
      </div>

      <table class="data-table" style="font-size: 0.88rem; width: 100%;">
        <thead>
          <tr style="background: var(--bg-main);">
            <th>NAMA UNIT</th>
            <th class="text-right">SEBELUM PERGESERAN 1</th>
            <th class="text-right" style="background: rgba(79,70,229,0.08);">PERGESERAN 1 (APRIL 2026)</th>
            <th class="text-right" style="background: rgba(16,185,129,0.1); color: var(--accent-primary);">PERGESERAN 2 (JUNI 2026)</th>
            <th class="text-right">TOTAL PERUBAHAN NET (RP)</th>
            <th>STATUS PERUBAHAN AKHIR</th>
          </tr>
        </thead>
        <tbody>
          ${matrixRows}
        </tbody>
      </table>
    </div>
  `;
}

  // Year Tab Submenu Handlers
  document.querySelectorAll('.btn-year-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const year = btn.getAttribute('data-year');
      if (year) window.switchBOSPYear(year);
    });
  });

  document.querySelectorAll('#sidebarYearSubmenu .nav-year-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const year = item.getAttribute('data-year');
      if (year) {
        switchPage(navDashboard, dashboardContent, 'Dashboard BOSP', `Laporan Dana BOS Tahun Anggaran ${year}`);
        window.switchBOSPYear(year);
      }
    });
  });
}

// ================================================
// PERGESERAN ANGGARAN - RENDER & LOGIC
// ================================================

function renderPergeseranAnggaran() {
  const tbody = document.getElementById('pergeseranTableBody');
  const tfoot = document.getElementById('pergeseranTableFoot');
  if (!tbody || !tfoot) return;

  // Calculate Pagu adjustments from pergeseran antar unit
  const paguAdj = {};
  riwayatPergeseran.forEach(r => {
    paguAdj[r.dari] = (paguAdj[r.dari] || 0) - r.nominal;
    paguAdj[r.ke] = (paguAdj[r.ke] || 0) + r.nominal;
  });

  const unitMapping = {
    'PUTRA': 1,
    'MAHAD': 2,
    'PUTRI BS': 3,
    'PUTRI FDS': 4,
    'RABBANI': 5
  };

  // Pre-calculate effective values
  const preparedData = pergeseranBKUData.map(item => {
    const adj = paguAdj[item.unit] || 0;
    const effectivePagu = item.pagu + adj;

    let dynamicRealTahap1 = 0;
    let dynamicRealTahap2 = 0;
    const uId = unitMapping[item.unit];
    if (uId && globalRABData[uId]) {
      globalRABData[uId].forEach(rab => {
        if (rab.realisasi) {
          Object.entries(rab.realisasi).forEach(([m, r]) => {
            if (r && !r.batal && r.qty && r.harga) {
              const val = r.qty * r.harga;
              if (['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].includes(m)) {
                dynamicRealTahap1 += val;
              } else {
                dynamicRealTahap2 += val;
              }
            }
          });
        }
      });
    }

    const dynamicReal = dynamicRealTahap1 + dynamicRealTahap2;
    const effectiveTotalReal = dynamicReal > 0 ? dynamicReal : item.totalRealisasi;
    return {
      ...item,
      adj: adj,
      effectivePagu: effectivePagu,
      effectiveTotalReal: effectiveTotalReal,
      dynamicReal: dynamicReal,
      dynamicRealTahap1: dynamicRealTahap1,
      dynamicRealTahap2: dynamicRealTahap2
    };
  });

  const totalPaguAll = preparedData.reduce((sum, d) => sum + d.effectivePagu, 0);
  const totalRealisasiAll = preparedData.reduce((sum, d) => sum + d.effectiveTotalReal, 0);

  let overCount = 0;
  let underCount = 0;
  let totalDefisit = 0;

  let totPagu = 0, totTahap1 = 0, totTahap2 = 0, totReal = 0;

  tbody.innerHTML = '';

  preparedData.forEach(item => {
    const selisih = item.effectivePagu - item.effectiveTotalReal;
    const selisihPersen = item.effectivePagu > 0 ? ((selisih / item.effectivePagu) * 100) : 0;
    const realPersen = totalPaguAll > 0 ? ((item.effectiveTotalReal / totalPaguAll) * 100) : 0;

    let statusClass = 'pas';
    let statusText = '🟡 PAS';
    let rowClass = '';
    let selisihClass = 'selisih-nol';

    if (selisih < 0) {
      statusClass = 'over';
      statusText = '🔴 OVER';
      rowClass = 'row-over';
      selisihClass = 'selisih-negatif';
      overCount++;
      totalDefisit += Math.abs(selisih);
    } else if (selisih > 0) {
      statusClass = 'under';
      statusText = '🟢 SISA';
      rowClass = 'row-under';
      selisihClass = 'selisih-positif';
      underCount++;
    }

    if (item.effectiveTotalReal === 0 && item.effectivePagu > 0) {
      statusClass = 'idle';
      statusText = '⚪ IDLE';
    }

    const tahap1 = item.dynamicRealTahap1 > 0 ? item.dynamicRealTahap1 : item.realisasi.tahap1;
    const tahap2 = item.dynamicRealTahap2;

    totPagu += item.effectivePagu;
    totTahap1 += tahap1;
    totTahap2 += tahap2;
    totReal += item.effectiveTotalReal;

    let paguHTML = formatIDR(item.effectivePagu);
    if (item.adj !== 0) {
      const adjText = item.adj > 0 ? `+${formatIDR(item.adj)}` : formatIDR(item.adj);
      const color = item.adj > 0 ? '#059669' : '#dc2626';
      paguHTML += `<br><span style="font-size:0.7rem; color:${color}; font-weight:600;">(${adjText})</span>`;
    }

    const tr = document.createElement('tr');
    tr.className = rowClass;
    tr.innerHTML = `
      <td><strong>${item.unit}</strong></td>
      <td class="text-right">${paguHTML}</td>
      <td class="text-right">${item.paguPersen.toFixed(2)}%</td>
      <td class="text-right" style="background: rgba(245,158,11,0.03);">${formatIDR(tahap1)}</td>
      <td class="text-right" style="background: rgba(245,158,11,0.03);">${formatIDR(tahap2)}</td>
      <td class="text-right" style="background: rgba(245,158,11,0.03); font-weight: 600;">${formatIDR(item.effectiveTotalReal)}</td>
      <td class="text-right" style="background: rgba(245,158,11,0.03);">${realPersen.toFixed(2)}%</td>
      <td class="text-right ${selisihClass}">${selisih >= 0 ? '+' : ''}${formatIDR(selisih)}</td>
      <td class="text-right ${selisihClass}">${selisihPersen.toFixed(2)}%</td>
      <td class="text-center"><span class="status-badge ${statusClass}">${statusText}</span></td>
    `;
    tbody.appendChild(tr);
  });

  // Footer totals
  const totSelisih = totPagu - totReal;
  const totSelisihPersen = totPagu > 0 ? ((totSelisih / totPagu) * 100) : 0;
  const totRealPersen = totPagu > 0 ? ((totReal / totPagu) * 100) : 0;
  const footSelisihClass = totSelisih < 0 ? 'selisih-negatif' : (totSelisih > 0 ? 'selisih-positif' : 'selisih-nol');

  tfoot.innerHTML = `
    <tr>
      <td><strong>TOTAL</strong></td>
      <td class="text-right">${formatIDR(totPagu)}</td>
      <td class="text-right">100%</td>
      <td class="text-right" style="background: rgba(245,158,11,0.03);">${formatIDR(totTahap1)}</td>
      <td class="text-right" style="background: rgba(245,158,11,0.03);">${formatIDR(totTahap2)}</td>
      <td class="text-right" style="background: rgba(245,158,11,0.03);">${formatIDR(totReal)}</td>
      <td class="text-right" style="background: rgba(245,158,11,0.03);">${totRealPersen.toFixed(2)}%</td>
      <td class="text-right ${footSelisihClass}">${totSelisih >= 0 ? '+' : ''}${formatIDR(totSelisih)}</td>
      <td class="text-right ${footSelisihClass}">${totSelisihPersen.toFixed(2)}%</td>
      <td></td>
    </tr>
  `;

  // Update summary cards
  const defisitEl = document.getElementById('pergeseranDefisit');
  const overEl = document.getElementById('pergeseranOverCount');
  const underEl = document.getElementById('pergeseranUnderCount');
  if (defisitEl) defisitEl.textContent = formatIDR(totalDefisit);
  if (overEl) overEl.textContent = `${overCount} unit`;
  if (underEl) underEl.textContent = `${underCount} unit`;

  // Render Recommendations
  renderRekomendasi();

  // Populate form selects
  populateGeserSelects();

  // Render riwayat
  renderRiwayatPergeseran();
}

function renderRekomendasi() {
  const container = document.getElementById('rekomendasiContainer');
  if (!container) return;

  // Find surplus units (under budget) and deficit units (over budget)
  const surplus = [];
  const deficit = [];

  pergeseranBKUData.forEach(item => {
    const selisih = item.pagu - item.totalRealisasi;
    if (selisih > 0) {
      surplus.push({ unit: item.unit, amount: selisih });
    } else if (selisih < 0) {
      deficit.push({ unit: item.unit, amount: Math.abs(selisih) });
    }
  });

  // Sort: surplus desc, deficit desc
  surplus.sort((a, b) => b.amount - a.amount);
  deficit.sort((a, b) => b.amount - a.amount);

  if (deficit.length === 0) {
    container.innerHTML = `
      <div class="no-rekomendasi">
        <span class="no-rekom-icon">✅</span>
        <p>Semua unit dalam kondisi aman. Tidak ada rekomendasi pergeseran.</p>
      </div>
    `;
    return;
  }

  if (surplus.length === 0) {
    container.innerHTML = `
      <div class="no-rekomendasi">
        <span class="no-rekom-icon">⚠️</span>
        <p>Tidak ada unit dengan sisa anggaran yang bisa digeser.</p>
      </div>
    `;
    return;
  }

  // Generate recommendations: match surplus to deficit
  let html = '';
  let surplusPool = surplus.map(s => ({ ...s }));
  let deficitPool = deficit.map(d => ({ ...d }));

  let rekomCount = 0;

  for (let di = 0; di < deficitPool.length; di++) {
    for (let si = 0; si < surplusPool.length; si++) {
      if (surplusPool[si].amount <= 0 || deficitPool[di].amount <= 0) continue;
      
      const geserAmount = Math.min(surplusPool[si].amount, deficitPool[di].amount);
      rekomCount++;

      html += `
        <div class="rekomendasi-card">
          <div style="font-weight: 700; color: var(--accent-primary); font-size: 0.85rem; min-width: 24px;">${rekomCount}.</div>
          <div class="rekomendasi-flow">
            <span class="rekomendasi-unit source">${surplusPool[si].unit}</span>
            <span class="rekomendasi-arrow">→</span>
            <span class="rekomendasi-unit target">${deficitPool[di].unit}</span>
          </div>
          <div class="rekomendasi-nominal">${formatIDR(geserAmount)}</div>
        </div>
      `;

      surplusPool[si].amount -= geserAmount;
      deficitPool[di].amount -= geserAmount;
    }
  }

  container.innerHTML = html;
}

function populateGeserSelects() {
  const selectDari = document.getElementById('geserDari');
  const selectKe = document.getElementById('geserKe');
  if (!selectDari || !selectKe) return;

  const currentDari = selectDari.value;
  const currentKe = selectKe.value;

  selectDari.innerHTML = '<option value="">-- Pilih Unit --</option>';
  selectKe.innerHTML = '<option value="">-- Pilih Unit --</option>';

  pergeseranBKUData.forEach(item => {
    const selisih = item.pagu - item.totalRealisasi;
    const labelSuffix = selisih > 0 ? ` (Sisa: ${formatIDR(selisih)})` : (selisih < 0 ? ` (Over: ${formatIDR(Math.abs(selisih))})` : ' (Pas)');
    
    selectDari.innerHTML += `<option value="${item.unit}">${item.unit}${labelSuffix}</option>`;
    selectKe.innerHTML += `<option value="${item.unit}">${item.unit}${labelSuffix}</option>`;
  });

  if (currentDari) selectDari.value = currentDari;
  if (currentKe) selectKe.value = currentKe;
}

function renderRiwayatPergeseran() {
  const tbody = document.getElementById('riwayatTableBody');
  const emptyEl = document.getElementById('riwayatEmpty');
  const wrapperEl = document.getElementById('riwayatTableWrapper');
  if (!tbody || !emptyEl || !wrapperEl) return;

  if (riwayatPergeseran.length === 0) {
    emptyEl.style.display = 'block';
    wrapperEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  wrapperEl.style.display = 'block';

  tbody.innerHTML = '';
  riwayatPergeseran.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.tanggal}</td>
      <td><strong>${item.dari}</strong></td>
      <td><strong>${item.ke}</strong></td>
      <td class="text-right" style="font-weight: 600; color: var(--accent-primary);">${formatIDR(item.nominal)}</td>
      <td>${item.keterangan || '-'}</td>
      <td class="text-center">
        <button class="btn-hapus-geser" data-geser-id="${item.id}">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach delete handlers
  document.querySelectorAll('#riwayatTableBody .btn-hapus-geser').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-geser-id'));
      riwayatPergeseran = riwayatPergeseran.filter(r => r.id !== id);
      renderRiwayatPergeseran();
      renderPergeseranAnggaran();
    });
  });
}

// Simpan Pergeseran button
const btnSimpanGeser = document.getElementById('btnSimpanGeser');
if (btnSimpanGeser) {
  btnSimpanGeser.addEventListener('click', () => {
    const dari = document.getElementById('geserDari').value;
    const ke = document.getElementById('geserKe').value;
    const nominal = parseFloat(document.getElementById('geserNominal').value) || 0;
    const keterangan = document.getElementById('geserKeterangan').value;

    if (!dari || !ke) {
      alert('Pilih unit asal dan tujuan pergeseran.');
      return;
    }
    if (dari === ke) {
      alert('Unit asal dan tujuan tidak boleh sama.');
      return;
    }
    if (nominal <= 0) {
      alert('Nominal pergeseran harus lebih dari 0.');
      return;
    }

    const today = new Date();
    const tanggalStr = today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    riwayatPergeseran.push({
      id: geserNextId++,
      tanggal: tanggalStr,
      dari: dari,
      ke: ke,
      nominal: nominal,
      keterangan: keterangan
    });

    // Reset form
    document.getElementById('geserDari').value = '';
    document.getElementById('geserKe').value = '';
    document.getElementById('geserNominal').value = '';
    document.getElementById('geserKeterangan').value = '';

    renderPergeseranAnggaran();
  });
}

// ================================================
// PERGESERAN TABS SWITCHING
// ================================================
const pergeseranTabBtns = document.querySelectorAll('.pergeseran-tab');
pergeseranTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pergeseranTabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const targetTab = btn.getAttribute('data-tab');
    const tabItemGeser = document.getElementById('tabItemGeser');
    const tabUnitGeser = document.getElementById('tabUnitGeser');
    
    if (targetTab === 'tabItemGeser') {
      if (tabItemGeser) tabItemGeser.style.display = 'block';
      if (tabUnitGeser) tabUnitGeser.style.display = 'none';
      renderGeserItemTable();
    } else {
      if (tabItemGeser) tabItemGeser.style.display = 'none';
      if (tabUnitGeser) tabUnitGeser.style.display = 'block';
      renderPergeseranAnggaran();
    }
  });
});

// ================================================
// TAB 1: PERGESERAN ITEM (BULAN & NOMINAL)
// ================================================

let logItemPergeseran = [];
let logItemNextId = 1;

// Initialize original values on RAB items so we can track changes
function initOriginalValues() {
  estimasiData.forEach(unit => {
    const rabItems = globalRABData[unit.id] || [];
    rabItems.forEach(item => {
      if (item._originalBulan === undefined) {
        item._originalBulan = item.bulan;
        item._originalHarga = item.harga;
        item._originalQty = item.qty;
      }
    });
  });
}
initOriginalValues();

function renderGeserItemTable() {
  const tbody = document.getElementById('geserItemTableBody');
  if (!tbody) return;

  const filterUnit = document.getElementById('filterGeserUnit');
  const filterStatus = document.getElementById('filterGeserStatus');
  const filterKategori = document.getElementById('filterGeserKategori');
  const unitFilter = filterUnit ? filterUnit.value : 'all';
  const statusFilter = filterStatus ? filterStatus.value : 'all';
  const kategoriFilter = filterKategori ? filterKategori.value : 'all';

  // Populate unit filter if empty
  if (filterUnit && filterUnit.options.length <= 1) {
    estimasiData.forEach(unit => {
      filterUnit.innerHTML += `<option value="${unit.id}">${unit.unit}</option>`;
    });
  }

  tbody.innerHTML = '';
  let rowNum = 0;
  let totalItems = 0;
  let digeserCount = 0;
  let tetapCount = 0;

  estimasiData.forEach(unit => {
    if (unitFilter !== 'all' && String(unit.id) !== unitFilter) return;
    
    const rabItems = globalRABData[unit.id] || [];
    rabItems.forEach((item, index) => {
      // Apply kategori filter before counting
      if (kategoriFilter !== 'all' && item.jenis.toLowerCase() !== kategoriFilter.toLowerCase()) return;

      totalItems++;
      
      const bulanChanged = item.bulan !== item._originalBulan;
      const hargaChanged = item.harga !== item._originalHarga;
      const qtyChanged = item.qty !== item._originalQty;
      const isGeser = bulanChanged || hargaChanged || qtyChanged;

      if (isGeser) digeserCount++;
      else tetapCount++;

      // Apply status filter
      if (statusFilter === 'digeser' && !isGeser) return;
      if (statusFilter === 'tetap' && isGeser) return;

      rowNum++;

      const totalAwal = item._originalQty * item._originalHarga;
      const totalBaru = item.qty * item.harga;

      // Bulan display
      let bulanAwalHTML, bulanBaruHTML, arrowBulan;
      if (bulanChanged) {
        bulanAwalHTML = `<span class="geser-bulan-badge original">${item._originalBulan}</span>`;
        bulanBaruHTML = `<span class="geser-bulan-badge baru">${item.bulan}</span>`;
        arrowBulan = `<span style="color: var(--accent-primary); font-weight: 700;">→</span>`;
      } else {
        bulanAwalHTML = `<span class="geser-bulan-badge sama">${item._originalBulan}</span>`;
        bulanBaruHTML = `<span class="geser-bulan-badge sama">—</span>`;
        arrowBulan = `<span style="color: var(--text-muted);">—</span>`;
      }

      // Nominal display
      let nomAwalHTML, nomBaruHTML, arrowNom;
      if (hargaChanged || qtyChanged) {
        nomAwalHTML = `<span class="geser-nominal-display original">${formatIDR(totalAwal)}</span>`;
        nomBaruHTML = `<span class="geser-nominal-display baru">${formatIDR(totalBaru)}</span>`;
        arrowNom = `<span style="color: var(--accent-primary); font-weight: 700;">→</span>`;
      } else {
        nomAwalHTML = `<span class="geser-nominal-display sama">${formatIDR(totalAwal)}</span>`;
        nomBaruHTML = `<span class="geser-nominal-display sama">—</span>`;
        arrowNom = `<span style="color: var(--text-muted);">—</span>`;
      }

      const statusBadge = isGeser 
        ? '<span class="status-badge over">🔄 DIGESER</span>'
        : '<span class="status-badge under">✅ TETAP</span>';

      const resetBtn = isGeser
        ? `<button class="btn-reset-item" data-unit-id="${unit.id}" data-item-index="${index}">Reset</button>`
        : '';

      const badgeClass = 'rab-badge-' + item.jenis.toLowerCase();

      // Check realisasi status from Realisasi & Transaksi
      let realisasiInfo = '';
      if (item.realisasi) {
        let doneTotal = 0;
        let hasBatal = false;
        let doneTgl = '';
        Object.values(item.realisasi).forEach(r => {
          if (r.batal) hasBatal = true;
          else if (r.qty && r.harga) {
            doneTotal += (r.qty * r.harga);
            if (r.tgl) doneTgl = r.tgl;
          }
        });
        if (doneTotal > 0) {
          realisasiInfo = `<div style="font-size: 0.73rem; color: #047857; font-weight: 600; margin-top: 3px;">✓ Realisasi: ${formatIDR(doneTotal)} (${doneTgl})</div>`;
        } else if (hasBatal) {
          realisasiInfo = `<div style="font-size: 0.73rem; color: #dc2626; font-weight: 600; margin-top: 3px;">⚠️ Dibatalkan</div>`;
        }
      }

      const tr = document.createElement('tr');
      tr.className = isGeser ? 'row-over' : '';
      tr.innerHTML = `
        <td>${rowNum}</td>
        <td><strong>${unit.unit}</strong></td>
        <td><span class="rab-category-badge ${badgeClass}">${item.jenis}</span></td>
        <td>${item.desc}${realisasiInfo}</td>
        <td class="text-center" style="background: rgba(239,68,68,0.03);">${bulanAwalHTML}</td>
        <td class="text-center">${arrowBulan}</td>
        <td class="text-center" style="background: rgba(16,185,129,0.03);">${bulanBaruHTML}</td>
        <td class="text-right" style="background: rgba(239,68,68,0.03);">${nomAwalHTML}</td>
        <td class="text-center">${arrowNom}</td>
        <td class="text-right" style="background: rgba(16,185,129,0.03);">${nomBaruHTML}</td>
        <td class="text-center">${statusBadge}</td>
        <td class="text-center">
          <button class="btn-geser-item" data-unit-id="${unit.id}" data-item-index="${index}">Geser</button>
          ${resetBtn}
        </td>
      `;
      tbody.appendChild(tr);
    });
  });

  // Update summary cards
  const totalEl = document.getElementById('totalItemRAB');
  const digeserEl = document.getElementById('totalItemDigeser');
  const tetapEl = document.getElementById('totalItemTetap');
  if (totalEl) totalEl.textContent = `${totalItems} item`;
  if (digeserEl) digeserEl.textContent = `${digeserCount} item`;
  if (tetapEl) tetapEl.textContent = `${tetapCount} item`;

  // Attach geser button handlers
  document.querySelectorAll('.btn-geser-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const unitId = parseInt(e.target.getAttribute('data-unit-id'));
      const itemIndex = parseInt(e.target.getAttribute('data-item-index'));
      window.openModalGeserItem(unitId, itemIndex);
    });
  });

  // Attach reset button handlers
  document.querySelectorAll('.btn-reset-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const unitId = parseInt(e.target.getAttribute('data-unit-id'));
      const itemIndex = parseInt(e.target.getAttribute('data-item-index'));
      const rabItem = globalRABData[unitId]?.[itemIndex];
      if (rabItem) {
        rabItem.bulan = rabItem._originalBulan;
        rabItem.harga = rabItem._originalHarga;
        rabItem.qty = rabItem._originalQty;
        renderGeserItemTable();
        renderRealisasiTimeline();
        renderPergeseranAnggaran();
        renderAll();
      }
    });
  });

  // Render log
  renderLogItemPergeseran();
}

// Filter change handlers
const filterGeserUnit = document.getElementById('filterGeserUnit');
const filterGeserStatus = document.getElementById('filterGeserStatus');
const filterGeserKategori = document.getElementById('filterGeserKategori');
if (filterGeserUnit) filterGeserUnit.addEventListener('change', renderGeserItemTable);
if (filterGeserStatus) filterGeserStatus.addEventListener('change', renderGeserItemTable);
if (filterGeserKategori) filterGeserKategori.addEventListener('change', renderGeserItemTable);

// Modal open
window.openModalGeserItem = function(unitId, itemIndex) {
  const modal = document.getElementById('modalGeserItem');
  const unit = estimasiData.find(u => u.id === unitId);
  const rabItem = globalRABData[unitId]?.[itemIndex];
  if (!modal || !unit || !rabItem) return;

  document.getElementById('geserItemUnitId').value = unitId;
  document.getElementById('geserItemIndex').value = itemIndex;
  document.getElementById('geserItemUnitName').textContent = unit.unit;
  document.getElementById('geserItemDesc').textContent = `[${rabItem.jenis}] ${rabItem.desc}`;
  document.getElementById('geserItemBulanAwal').textContent = rabItem._originalBulan;
  document.getElementById('geserItemBulanBaru').value = rabItem.bulan;
  document.getElementById('geserItemHargaAwal').textContent = formatIDR(rabItem._originalHarga);
  document.getElementById('geserItemHargaBaru').value = rabItem.harga;
  document.getElementById('geserItemQtyAwal').textContent = rabItem._originalQty;
  document.getElementById('geserItemQtyBaru').value = rabItem.qty;
  document.getElementById('geserItemKeterangan').value = '';

  modal.classList.add('active');
};

// Modal close
window.closeModalGeserItem = function() {
  const modal = document.getElementById('modalGeserItem');
  if (modal) modal.classList.remove('active');
};

// Modal save
window.simpanGeserItem = function() {
  const unitId = parseInt(document.getElementById('geserItemUnitId').value);
  const itemIndex = parseInt(document.getElementById('geserItemIndex').value);
  const bulanBaru = document.getElementById('geserItemBulanBaru').value;
  const hargaBaru = parseFloat(document.getElementById('geserItemHargaBaru').value) || 0;
  const qtyBaru = parseFloat(document.getElementById('geserItemQtyBaru').value) || 0;
  const keterangan = document.getElementById('geserItemKeterangan').value;

  const unit = estimasiData.find(u => u.id === unitId);
  const rabItem = globalRABData[unitId]?.[itemIndex];
  if (!unit || !rabItem) return;

  const bulanAwal = rabItem.bulan;
  const hargaAwal = rabItem.harga;
  const qtyAwal = rabItem.qty;

  // Apply changes
  rabItem.bulan = bulanBaru;
  rabItem.harga = hargaBaru;
  rabItem.qty = qtyBaru;

  // Check if anything actually changed
  const bulanChanged = bulanBaru !== bulanAwal;
  const hargaChanged = hargaBaru !== hargaAwal;
  const qtyChanged = qtyBaru !== qtyAwal;

  if (bulanChanged || hargaChanged || qtyChanged) {
    const today = new Date();
    const tanggalStr = today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    logItemPergeseran.push({
      id: logItemNextId++,
      tanggal: tanggalStr,
      unit: unit.unit,
      item: rabItem.desc,
      bulanAwal: bulanAwal,
      bulanBaru: bulanBaru,
      nominalAwal: qtyAwal * hargaAwal,
      nominalBaru: qtyBaru * hargaBaru,
      keterangan: keterangan || '-'
    });
  }

  window.closeModalGeserItem();
  renderGeserItemTable();
  renderRealisasiTimeline();
  renderPergeseranAnggaran();
  renderAll();
};

function renderLogItemPergeseran() {
  const tbody = document.getElementById('logItemTableBody');
  const emptyEl = document.getElementById('logItemEmpty');
  const wrapperEl = document.getElementById('logItemTableWrapper');
  if (!tbody || !emptyEl || !wrapperEl) return;

  if (logItemPergeseran.length === 0) {
    emptyEl.style.display = 'block';
    wrapperEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  wrapperEl.style.display = 'block';

  tbody.innerHTML = '';
  logItemPergeseran.forEach((item, index) => {
    const bulanDisplay = item.bulanAwal !== item.bulanBaru 
      ? `<span class="geser-bulan-badge original">${item.bulanAwal}</span> → <span class="geser-bulan-badge baru">${item.bulanBaru}</span>`
      : `<span class="geser-bulan-badge sama">${item.bulanAwal} (tetap)</span>`;

    const nominalDisplay = item.nominalAwal !== item.nominalBaru
      ? `<span class="geser-nominal-display original">${formatIDR(item.nominalAwal)}</span> → <span class="geser-nominal-display baru">${formatIDR(item.nominalBaru)}</span>`
      : `<span class="geser-nominal-display sama">${formatIDR(item.nominalAwal)} (tetap)</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.tanggal}</td>
      <td><strong>${item.unit}</strong></td>
      <td>${item.item}</td>
      <td class="text-center">${bulanDisplay}</td>
      <td class="text-right">${nominalDisplay}</td>
      <td>${item.keterangan}</td>
      <td class="text-center">
        <button class="btn-hapus-geser" data-log-id="${item.id}">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach delete handlers
  document.querySelectorAll('#logItemTableBody .btn-hapus-geser').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-log-id'));
      const logItem = logItemPergeseran.find(r => r.id === id);
      if (logItem) {
        estimasiData.forEach(unit => {
          if (unit.unit === logItem.unit) {
            const rabItems = globalRABData[unit.id] || [];
            const rabItem = rabItems.find(i => i.desc === logItem.item);
            if (rabItem) {
              rabItem.bulan = logItem.bulanAwal;
              if (rabItem._originalHarga !== undefined) rabItem.harga = rabItem._originalHarga;
              if (rabItem._originalQty !== undefined) rabItem.qty = rabItem._originalQty;
            }
          }
        });
      }
      logItemPergeseran = logItemPergeseran.filter(r => r.id !== id);
      renderLogItemPergeseran();
      renderGeserItemTable();
      renderRealisasiTimeline();
      renderPergeseranAnggaran();
      renderAll();
    });
  });
}

function renderRAB() {
  const container = document.getElementById('rabAccordionContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  estimasiData.forEach((item, index) => {
    const rabItems = globalRABData[item.id] || [];

    const paguUnitGross = item.siswa * danaPerSiswa;
    const paguUnitNet = paguUnitGross - (item.siswa * iuranFKSS);
    
    // Limits
    const limitOperasional = paguUnitNet * 0.20;
    const limitGaji = paguUnitNet * 0.40;
    const limitBuku = paguUnitNet * 0.10;
    const limitModal = paguUnitNet * 0.30;
    
    let totalBelanjaUnit = 0;
    let operasionalTotal = 0;
    let gajiTotal = 0;
    let bukuTotal = 0;
    let modalTotal = 0;
    
    let tableRows = '';
    rabItems.forEach(row => {
      const totalHargaModal = row.qty * row.harga;
      const hargaMargin = row.harga;
      const hargaSiplah = row.harga;
      const totalSiplah = hargaSiplah * row.qty;
      
      totalBelanjaUnit += totalSiplah;
      if (row.jenis.toLowerCase() === 'operasional') operasionalTotal += totalSiplah;
      else if (row.jenis.toLowerCase() === 'gaji') gajiTotal += totalSiplah;
      else if (row.jenis.toLowerCase() === 'buku') bukuTotal += totalSiplah;
      else if (row.jenis.toLowerCase() === 'modal') modalTotal += totalSiplah;
      
      const badgeClass = 'rab-badge-' + row.jenis.toLowerCase();

      const volRAB = row.volume !== undefined ? row.volume : (row.qty || 1);
      const trfRAB = row.tarif !== undefined ? row.tarif : (row.harga || 0);
      const grsRAB = volRAB * trfRAB;
      const hFinalRAB = row.hargaFinal !== undefined ? row.hargaFinal : (row.total || grsRAB);
      const t1RAB = row.tahap1 !== undefined ? row.tahap1 : 0;
      const t2RAB = row.tahap2 !== undefined ? row.tahap2 : (hFinalRAB - t1RAB);

      let rabReconcileBadge = '';
      if (t2RAB < 0 || (t1RAB > 0 && t1RAB > hFinalRAB)) {
        const isMatch = Math.abs(grsRAB - t1RAB) < 1.0;
        const cause = isMatch ? 'Volume × Tarif == Tahap 1 (Item direvisi turun setelah Tahap 1 terkunci)' : 'Revisi Pagu Final lebih kecil dari Realisasi/Alokasi Tahap 1';
        rabReconcileBadge = `
          <span class="badge-koreksi-revisi" style="margin-left: 6px;" title="Gross: ${formatIDR(grsRAB)} | Final: ${formatIDR(hFinalRAB)} | Tahap 1: ${formatIDR(t1RAB)} | Tahap 2: ${formatIDR(t2RAB)}">
            ⚠️ Ada koreksi revisi
            <span class="reconcile-tooltip">
              <strong>⚠️ Detail Koreksi Revisi (RKAS)</strong><br>
              • Estimasi Awal (Gross): <strong>${formatIDR(grsRAB)}</strong> (${volRAB} ${row.satuan || 'pcs'} × ${formatIDR(trfRAB)})<br>
              • Realisasi/Tahap 1: <strong>${formatIDR(t1RAB)}</strong><br>
              • Harga Final (Revisi): <strong>${formatIDR(hFinalRAB)}</strong><br>
              • Koreksi Tahap 2: <strong style="color:#ef4444;">${formatIDR(t2RAB)}</strong><br>
              • Penyebab: <em>${cause}</em>
            </span>
          </span>
        `;
      }
      
      tableRows += `
        <tr data-jenis="${row.jenis}">
          <td><span class="rab-category-badge ${badgeClass}">${row.jenis}</span></td>
          <td>${row.desc}${rabReconcileBadge}</td>
          <td><span style="display: inline-block; padding: 2px 8px; background-color: rgba(99,102,241,0.1); color: var(--accent-primary); border-radius: 4px; font-size: 0.8rem; font-weight: 600;">${row.bulan || '-'}</span></td>
          <td><a href="${row.link}" target="_blank" style="color: var(--accent-primary); text-decoration: underline;">Link</a></td>

          <td>${row.qty}</td>
          <td>${row.satuan}</td>
          <td class="money">${formatIDR(row.harga)}</td>
          <td class="money" style="background-color: rgba(79,70,229,0.05);">${formatIDR(totalHargaModal)}</td>
          <td class="money">${formatIDR(hargaMargin)}</td>
          <td class="money">${formatIDR(hargaSiplah)}</td>
          <td class="money" style="background-color: rgba(16,185,129,0.1); font-weight: bold;">${formatIDR(totalSiplah)}</td>
        </tr>
      `;
    });
    
    const sisaAnggaran = paguUnitNet - totalBelanjaUnit;
    
    const accordionHTML = `
      <div class="accordion-item" style="margin-bottom: 8px;">
        <button class="accordion-btn" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; if(content.style.maxHeight){content.style.maxHeight=null; content.classList.remove('open');}else{content.style.maxHeight=content.scrollHeight+'px'; content.classList.add('open');}">
          <span>RAB - ${item.unit}</span>
          <span class="icon-indicator">▼</span>
        </button>
        <div class="accordion-content">
          <div style="padding-bottom: 16px; display: flex; gap: 16px; flex-wrap: wrap;">
            <div style="background: white; padding: 12px 16px; border-radius: 8px; border: 1px solid var(--glass-border); flex: 1; min-width: 200px; box-shadow: var(--shadow-sm);">
              <div style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 4px; font-weight: 600;">Pagu Anggaran (Net)</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: #3b82f6; margin-bottom: 4px;">${formatIDR(paguUnitNet)}</div>
              <div style="font-size: 0.7rem; color: #6b7280;">Total dana bersih setelah dipotong FKSS</div>
            </div>
            <div style="background: white; padding: 12px 16px; border-radius: 8px; border: 1px solid var(--glass-border); flex: 1; min-width: 200px; box-shadow: var(--shadow-sm);">
              <div style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 4px; font-weight: 600;">Total Rencana Belanja</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: #f59e0b; margin-bottom: 4px;">${formatIDR(totalBelanjaUnit)}</div>
              <div style="font-size: 0.7rem; color: #6b7280;">Total nominal RAB (SIPLah) yang telah diinput</div>
            </div>
            <div style="background: white; padding: 12px 16px; border-radius: 8px; border: 1px solid var(--glass-border); flex: 1; min-width: 200px; box-shadow: var(--shadow-sm);">
              <div style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 4px; font-weight: 600;">Sisa Anggaran</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: ${sisaAnggaran >= 0 ? '#10b981' : '#ef4444'}; margin-bottom: 4px;">${formatIDR(sisaAnggaran)}</div>
              <div style="font-size: 0.7rem; color: #6b7280;">Sisa dana yang belum/bisa dialokasikan</div>
            </div>
          </div>
          
          <div style="margin-bottom: 16px; background: white; border-radius: 8px; border: 1px solid var(--glass-border); overflow: hidden; box-shadow: var(--shadow-sm);">
            <div style="padding: 12px 16px; font-weight: 600; font-size: 0.9rem; background: var(--bg-sidebar); border-bottom: 1px solid var(--glass-border);">Batas Anggaran per Kategori (RAB vs Pagu/Aturan)</div>
            <table class="mini-table" style="border: none; border-top: none;">
              <tr>
                <th style="border-top: none; border-left: none;">Kategori</th>
                <th style="border-top: none;">Batas Aturan</th>
                <th style="border-top: none;">Nilai Batas Pagu</th>
                <th style="border-top: none;">Rencana Saat Ini</th>
                <th style="border-top: none; border-right: none;">Status</th>
              </tr>
              <tr>
                <td style="border-left: none; border-left: 4px solid #3b82f6;">Operasional</td>
                <td>Max 20%</td>
                <td>${formatIDR(limitOperasional)}</td>
                <td>${formatIDR(operasionalTotal)}</td>
                <td style="border-right: none;">${operasionalTotal <= limitOperasional ? '<span style="color: green; font-weight: 600;">Aman</span>' : '<span style="color: red; font-weight: 600;">Over</span>'}</td>
              </tr>
              <tr>
                <td style="border-left: none; border-left: 4px solid #ef4444;">Gaji</td>
                <td>Max 40%</td>
                <td>${formatIDR(limitGaji)}</td>
                <td>${formatIDR(gajiTotal)}</td>
                <td style="border-right: none;">${gajiTotal <= limitGaji ? '<span style="color: green; font-weight: 600;">Aman</span>' : '<span style="color: red; font-weight: 600;">Over</span>'}</td>
              </tr>
              <tr>
                <td style="border-left: none; border-left: 4px solid #eab308;">Buku</td>
                <td>Min 10%</td>
                <td>${formatIDR(limitBuku)}</td>
                <td>${formatIDR(bukuTotal)}</td>
                <td style="border-right: none;">${bukuTotal >= limitBuku ? '<span style="color: green; font-weight: 600;">Aman</span>' : '<span style="color: red; font-weight: 600;">Kurang</span>'}</td>
              </tr>
              <tr>
                <td style="border-left: none; border-left: 4px solid #22c55e;">Belanja Modal</td>
                <td>Max 30%</td>
                <td>${formatIDR(limitModal)}</td>
                <td>${formatIDR(modalTotal)}</td>
                <td style="border-right: none;">${modalTotal <= limitModal ? '<span style="color: green; font-weight: 600;">Aman</span>' : '<span style="color: red; font-weight: 600;">Over</span>'}</td>
              </tr>
            </table>
          </div>
          
          <div style="overflow-x: auto;">
            <table class="rab-table">
              <thead>
                <tr>
                  <th>
                    Jenis Belanja 
                    <select onchange="window.filterRAB(this)" style="margin-left: 6px; padding: 2px 4px; border-radius: 4px; border: 1px solid #ccc; font-size: 0.8rem;">
                      <option value="all">Semua</option>
                      <option value="Operasional">Operasional</option>
                      <option value="Modal">Modal</option>
                      <option value="Gaji">Gaji</option>
                      <option value="Buku">Buku</option>
                    </select>
                  </th>
                  <th>Deskripsi</th>
                  <th>Bulan Estimasi</th>
                  <th>Link</th>
                  <th>Qty</th>
                  <th>Satuan</th>
                  <th>Harga Modal</th>
                  <th>Total Modal</th>
                  <th>Harga (+11% Margin)</th>
                  <th>Harga SIPLah (+12% PPN)</th>
                  <th>Total SIPLah</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += accordionHTML;
  });
}

// Global filter function for the dropdowns
window.filterRAB = function(selectEl) {
  const table = selectEl.closest('table');
  const rows = table.querySelectorAll('tbody tr');
  const selected = selectEl.value;
  
  rows.forEach(row => {
    if (selected === 'all' || row.getAttribute('data-jenis') === selected) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
};

function renderRealisasiTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;

  const openMonths = new Set();
  document.querySelectorAll('.timeline-month-accordion[open]').forEach(acc => {
    const m = acc.getAttribute('data-month');
    if (m) openMonths.add(m);
  });
  
  const unitFilterEl = document.getElementById('filterTimelineUnit');
  const jenisFilterEl = document.getElementById('filterTimelineJenis');
  const invoiceFilterEl = document.getElementById('filterTimelineInvoice');
  
  // Populate unit filter options if empty
  if (unitFilterEl && unitFilterEl.options.length <= 1) {
    estimasiData.forEach(unit => {
      const opt = document.createElement('option');
      opt.value = unit.unit;
      opt.textContent = unit.unit;
      unitFilterEl.appendChild(opt);
    });
  }
  
  // Dynamic list of unique invoices
  const uniqueInvoices = new Set();
  estimasiData.forEach(unit => {
    const rabItems = globalRABData[unit.id] || [];
    rabItems.forEach(item => {
      if (item.realisasi) {
        Object.keys(item.realisasi).forEach(month => {
          const r = item.realisasi[month];
          if (r && r.invoice && r.invoice.trim() !== '') {
            uniqueInvoices.add(r.invoice.trim());
          }
        });
      }
    });
  });
  
  // Populate invoice filter options dynamically
  if (invoiceFilterEl) {
    const currentVal = invoiceFilterEl.value || 'all';
    invoiceFilterEl.innerHTML = '<option value="all">Semua Invoice</option>';
    uniqueInvoices.forEach(inv => {
      const opt = document.createElement('option');
      opt.value = inv;
      opt.textContent = inv;
      if (inv === currentVal) {
        opt.selected = true;
      }
      invoiceFilterEl.appendChild(opt);
    });
    if (currentVal !== 'all' && !uniqueInvoices.has(currentVal)) {
      invoiceFilterEl.value = 'all';
    }
  }
  
  const filterUnit = unitFilterEl ? unitFilterEl.value : 'all';
  const filterJenis = jenisFilterEl ? jenisFilterEl.value : 'all';
  const filterInvoice = invoiceFilterEl ? invoiceFilterEl.value : 'all';
  const tglAwalEl = document.getElementById('filterTimelineTglAwal');
  const tglAkhirEl = document.getElementById('filterTimelineTglAkhir');
  const filterTglAwal = tglAwalEl ? tglAwalEl.value : '';
  const filterTglAkhir = tglAkhirEl ? tglAkhirEl.value : '';
  
  const monthOrder = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  // Group data
  const groupedData = {};
  monthOrder.forEach(m => groupedData[m] = {});
  
  estimasiData.forEach(unit => {
    // apply filter unit
    if (filterUnit !== 'all' && unit.unit !== filterUnit) return;
    
    const rabItems = globalRABData[unit.id] || [];
    rabItems.forEach((item, itemIndex) => {
      // apply filter jenis
      if (filterJenis !== 'all' && item.jenis !== filterJenis) return;
      
      const hargaSiplah = item.harga;
      
      const processItem = (targetMonth, qty, total) => {
        const real = (item.realisasi && item.realisasi[targetMonth]) ? item.realisasi[targetMonth] : null;
        
        // Filter by invoice if selected
        if (filterInvoice !== 'all') {
          if (!real || !real.invoice || real.invoice.trim() !== filterInvoice) {
            return;
          }
        }

        // Filter by realization date range if specified
        if (filterTglAwal || filterTglAkhir) {
          if (!real || !real.tgl || real.batal) {
            return;
          }
          const itemTgl = real.tgl.trim();
          if (filterTglAwal && itemTgl < filterTglAwal) {
            return;
          }
          if (filterTglAkhir && itemTgl > filterTglAkhir) {
            return;
          }
        }

        if (!groupedData[targetMonth]) groupedData[targetMonth] = {};
        if (!groupedData[targetMonth][unit.unit]) groupedData[targetMonth][unit.unit] = {};
        if (!groupedData[targetMonth][unit.unit][item.jenis]) groupedData[targetMonth][unit.unit][item.jenis] = [];
        
        groupedData[targetMonth][unit.unit][item.jenis].push({
          desc: item.desc,
          qty: qty,
          satuan: item.satuan,
          total: total,
          link: item.link,
          hargaSiplah: hargaSiplah,
          unitId: unit.id,
          itemIndex: itemIndex,
          targetMonth: targetMonth,
          realisasi: real
        });
      };
      
      if (item.bulan === 'Rutin Bulanan') {
        // Divide into 12 months
        const monthlyQty = item.qty / 12;
        const monthlyTotal = hargaSiplah * monthlyQty;
        monthOrder.forEach(m => {
          processItem(m, monthlyQty, monthlyTotal);
        });
      } else {
        const month = item.bulan || 'Belum Ditentukan';
        processItem(month, item.qty, hargaSiplah * item.qty);
      }
    });
  });
  
  let html = '<div class="timeline">';
  
  // Also handle "Belum Ditentukan" if exists
  const allMonths = [...monthOrder, 'Belum Ditentukan'];
  
  allMonths.forEach((month, idx) => {
    const unitsData = groupedData[month];
    if (!unitsData || Object.keys(unitsData).length === 0) return; // Skip empty months
    
    const isRealizedMonth = true;

    // Calculate total month real sum, plan sum, initial batal sum, and active new items sum across all units in this month
    let monthRealSum = 0;
    let monthPlanSum = 0;
    let monthBatalInitialSum = 0;
    let monthNewlyAddedActiveSum = 0;

    Object.keys(unitsData).forEach(uName => {
      Object.keys(unitsData[uName]).forEach(jName => {
        unitsData[uName][jName].forEach(item => {
          const isCanceled = item.realisasi && item.realisasi.batal;
          const rabOrig = globalRABData[item.unitId]?.[item.itemIndex];
          const isNewItem = item.isNew || item.isAdded || (rabOrig && (rabOrig.isNew || rabOrig.isAdded)) || false;

          if (isCanceled) {
            if (!isNewItem) {
              const q = item.realisasi.qty !== undefined ? item.realisasi.qty : item.qty;
              const h = item.realisasi.harga !== undefined ? item.realisasi.harga : item.hargaSiplah;
              monthBatalInitialSum += (q * h);
            }
          } else {
            monthPlanSum += item.total;
            if (isNewItem) {
              monthNewlyAddedActiveSum += item.total;
            }
          }
          if (item.realisasi && !item.realisasi.batal) {
            const q = item.realisasi.qty !== undefined ? item.realisasi.qty : item.qty;
            const h = item.realisasi.harga !== undefined ? item.realisasi.harga : item.hargaSiplah;
            monthRealSum += (q * h);
          }
        });
      });
    });

    const monthSisa = monthPlanSum - monthRealSum;
    const monthSisaBg = monthSisa >= 0 ? '#ecfdf5' : '#fee2e2';
    const monthSisaColor = monthSisa >= 0 ? '#047857' : '#991b1b';
    const monthSisaBorder = monthSisa >= 0 ? '#a7f3d0' : '#fecaca';

    const effectiveMonthBelumDianggarkan = Math.max(0, monthBatalInitialSum - monthNewlyAddedActiveSum);
    const hasRealization = monthRealSum > 0;
    const isOpen = openMonths.has(month) ? 'open' : '';
    
    const barBackground = hasRealization 
      ? 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' 
      : 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)';

    const barShadow = hasRealization 
      ? '0 4px 14px rgba(79, 70, 229, 0.25)' 
      : '0 4px 14px rgba(217, 119, 6, 0.25)';

    html += `
      <details class="timeline-month-accordion" data-month="${month}" ${isOpen} style="margin-bottom: 16px; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; overflow: hidden; background: white; box-shadow: ${barShadow};">
        <summary style="padding: 16px 22px; font-weight: 700; font-size: 1.05rem; cursor: pointer; background: ${barBackground}; border-bottom: 1px solid rgba(255,255,255,0.15); display: flex; justify-content: space-between; align-items: center; user-select: none; color: white;">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <span style="color: #ffffff; font-weight: 800; font-size: 1.1rem; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">📅 Bulan ${month}</span>
            <span style="font-size: 0.82rem; color: #1e40af; background: #eff6ff; padding: 5px 14px; border-radius: 8px; font-weight: 700; border: 1px solid #bfdbfe; display: inline-flex; align-items: center; gap: 6px;">
              📝 Total Anggaran (RAB): ${formatIDR(monthPlanSum)}
            </span>
            <span style="font-size: 0.82rem; color: #047857; background: #ecfdf5; padding: 5px 14px; border-radius: 8px; font-weight: 700; border: 1px solid #a7f3d0; display: inline-flex; align-items: center; gap: 6px;">
              💸 Total Realisasi (BKU): ${formatIDR(monthRealSum)}
            </span>
            ${hasRealization ? `
              <span style="font-size: 0.82rem; color: ${monthSisaColor}; background: ${monthSisaBg}; padding: 5px 14px; border-radius: 8px; font-weight: 800; border: 1px solid ${monthSisaBorder}; display: inline-flex; align-items: center; gap: 6px;">
                💰 Sisa Anggaran: ${formatIDR(monthSisa)}
              </span>
            ` : ''}
            ${effectiveMonthBelumDianggarkan > 0 ? `
              <span style="font-size: 0.82rem; color: #991b1b; background: #fee2e2; padding: 5px 14px; border-radius: 8px; font-weight: 800; border: 1px solid #fecaca; display: inline-flex; align-items: center; gap: 6px;">
                📌 Belum Dianggarkan: ${formatIDR(effectiveMonthBelumDianggarkan)}
              </span>
            ` : ''}
          </div>
          <span style="font-size: 0.8rem; color: #ffffff; background: rgba(255,255,255,0.22); padding: 5px 12px; border-radius: 8px; font-weight: 700; backdrop-filter: blur(4px);">Klik Buka / Tutup ▼</span>
        </summary>
        <div class="timeline-content" style="padding: 20px; background-color: #f8fafc;">
    `;
    
    let monthTotal = 0;
    
    const unitColors = ['#4f46e5', '#059669', '#dc2626', '#d97706', '#7c3aed', '#0284c7', '#be185d', '#1e293b'];
    
    Object.keys(unitsData).forEach(unitName => {
      let colorIndex = estimasiData.findIndex(u => u.unit === unitName);
      if (colorIndex < 0) colorIndex = 0;
      let bgColor = unitColors[colorIndex % unitColors.length];

      const uObj = estimasiData.find(u => u.unit === unitName);

      const jenisData = unitsData[unitName];
      let unitMonthPlanSum = 0;
      let unitMonthRealSum = 0;
      let unitMonthBatalInitialSum = 0;
      let unitMonthNewlyAddedActiveSum = 0;

      Object.keys(jenisData).forEach(jName => {
        jenisData[jName].forEach(item => {
          const isCanceled = item.realisasi && item.realisasi.batal;
          const rabOrig = globalRABData[item.unitId]?.[item.itemIndex];
          const isNewItem = item.isNew || item.isAdded || (rabOrig && (rabOrig.isNew || rabOrig.isAdded)) || false;

          if (isCanceled) {
            if (!isNewItem) {
              const q = item.realisasi.qty !== undefined ? item.realisasi.qty : item.qty;
              const h = item.realisasi.harga !== undefined ? item.realisasi.harga : item.hargaSiplah;
              unitMonthBatalInitialSum += (q * h);
            }
          } else {
            unitMonthPlanSum += item.total;
            if (isNewItem) {
              unitMonthNewlyAddedActiveSum += item.total;
            }
          }
          if (isRealizedMonth && item.realisasi && !item.realisasi.batal) {
            const q = item.realisasi.qty !== undefined ? item.realisasi.qty : item.qty;
            const h = item.realisasi.harga !== undefined ? item.realisasi.harga : item.hargaSiplah;
            unitMonthRealSum += (q * h);
          }
        });
      });

      const unitMonthSisa = unitMonthPlanSum - unitMonthRealSum;
      const unitSisaBg = unitMonthSisa >= 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
      const unitSisaBorder = unitMonthSisa >= 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';

      const effectiveUnitBelumDianggarkan = Math.max(0, unitMonthBatalInitialSum - unitMonthNewlyAddedActiveSum);

      const belumDianggarkanBadge = effectiveUnitBelumDianggarkan > 0 ? `
        <span style="background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 6px; border: 1px solid #fecaca; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); font-weight: 800;">
          <span>📌 Belum Dianggarkan:</span>
          <strong style="font-size: 0.9rem; color: #991b1b; font-family: monospace;">${formatIDR(effectiveUnitBelumDianggarkan)}</strong>
        </span>
      ` : '';
      
      html += `
        <div style="margin-bottom: 16px; border: 1px solid var(--glass-border); border-radius: 8px; overflow: hidden; background: white; box-shadow: var(--shadow-sm);">
          <div style="background-color: ${bgColor}; padding: 12px 18px; font-weight: 700; font-size: 0.95rem; border-bottom: 1px solid var(--glass-border); color: var(--text-light); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.2rem;">🏢</span> Unit: ${unitName}
            </div>
            <div style="display: flex; gap: 10px; align-items: center; font-size: 0.82rem; font-weight: 600; flex-wrap: wrap;">
              <span style="background: rgba(255, 255, 255, 0.25); padding: 4px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.4); display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); color: #ffffff;">
                <span>📝 Total Anggaran (RAB):</span>
                <strong style="font-size: 0.9rem; color: #ffffff; font-family: monospace;">${formatIDR(unitMonthPlanSum)}</strong>
              </span>
              <span style="background: rgba(255, 255, 255, 0.22); padding: 4px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.35); display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                <span>💸 Total Realisasi (BKU):</span>
                <strong style="font-size: 0.9rem; color: #ffffff; font-family: monospace;">${formatIDR(unitMonthRealSum)}</strong>
              </span>
              ${unitMonthRealSum > 0 ? `
                <span style="background: ${unitSisaBg}; padding: 4px 12px; border-radius: 6px; border: 1px solid ${unitSisaBorder}; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); color: #ffffff;">
                  <span>💰 Sisa Anggaran:</span>
                  <strong style="font-size: 0.9rem; color: #ffffff; font-family: monospace;">${formatIDR(unitMonthSisa)}</strong>
                </span>
              ` : ''}
              ${belumDianggarkanBadge}
            </div>
          </div>
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 16px;">
      `;
      
      Object.keys(jenisData).forEach(jenisName => {
        let badgeClass = 'rab-badge-' + jenisName.toLowerCase();
        html += `
            <div style="background-color: #ffffff; border-left: 4px solid var(--accent-primary); padding: 12px 16px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-top: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center;">
                Kategori: <span class="rab-category-badge ${badgeClass}" style="margin-left: 8px; padding: 4px 8px;">${jenisName}</span>
              </div>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; border: 1px solid var(--glass-border);">
                  <thead>
                    <tr>
                      <th style="width: 40px; background-color: rgba(79, 70, 229, 0.05); padding: 8px; text-align: center; border: 1px solid var(--glass-border);">
                        <input type="checkbox" class="category-select-all" onchange="window.toggleSelectAllCategory(this)" title="Pilih Semua di Kategori Ini" style="width: 16px; height: 16px; cursor: pointer;" />
                      </th>
                      <th colspan="5" style="background-color: rgba(79, 70, 229, 0.05); padding: 8px; text-align: center; border: 1px solid var(--glass-border); border-right: 3px solid #94a3b8; font-weight: 700; color: var(--accent-primary);">RENCANA BELANJA</th>
                      <th colspan="5" style="background-color: rgba(16, 185, 129, 0.05); padding: 8px; text-align: center; border: 1px solid var(--glass-border); font-weight: 700; color: var(--accent-success);">REALISASI AKTUAL</th>
                    </tr>
                    <tr>
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: center; width: 40px; font-weight: 600; color: var(--text-muted);">Pilih</th>
                      <!-- Rencana -->
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: left; font-weight: 600; color: var(--text-muted); width: 15%;">Deskripsi</th>
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: center; font-weight: 600; color: var(--text-muted);">SIPLah</th>
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: center; font-weight: 600; color: var(--text-muted);">Qty</th>
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: right; font-weight: 600; color: var(--text-muted);">Harga/Satuan</th>
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); border-right: 3px solid #94a3b8; padding: 10px; text-align: right; font-weight: 700; color: var(--accent-primary); font-family: monospace;">Total Estimasi</th>
                      
                      <!-- Realisasi -->
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: center; font-weight: 600; color: var(--text-muted);">Tanggal</th>
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: center; font-weight: 600; color: var(--text-muted);">Qty</th>
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: right; font-weight: 600; color: var(--text-muted);">Harga Aktual</th>
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: right; font-weight: 700; color: var(--text-muted);">Total Realisasi</th>
                      <th style="background-color: rgba(0,0,0,0.02); border-bottom: 1px solid var(--glass-border); padding: 10px; text-align: center; font-weight: 600; color: var(--text-muted);">Aksi / Bukti</th>
                    </tr>
                  </thead>
                  <tbody>
        `;
        
          jenisData[jenisName].forEach(item => {
            const isCanceledItem = isRealizedMonth && item.realisasi && item.realisasi.batal;
            if (!isCanceledItem) {
              monthTotal += item.total;
            }
            
            let displayQty = Number.isInteger(item.qty) ? item.qty : item.qty.toFixed(2);
            const linkHtml = item.link && item.link !== '-' 
              ? `<a href="${item.link}" target="_blank" style="font-size: 0.75rem; color: var(--accent-primary); text-decoration: underline; background: rgba(79, 70, 229, 0.1); padding: 2px 6px; border-radius: 4px; display: inline-block;">Link Beli</a>` 
              : '-';
            
            // Data Realisasi (Only for realizedMonths: Jan-Jun)
            const r = (isRealizedMonth && item.realisasi) ? item.realisasi : null;
            const isDone = r !== null;
            const isCanceled = isDone && r.batal;

            let planQtyHtml = `${displayQty} ${item.satuan}`;
            let planHargaHtml = `${formatIDR(item.hargaSiplah)}`;
            let planTotalHtml = `${formatIDR(item.total)}`;

            if (isCanceled) {
              planQtyHtml = `<div style="text-decoration: line-through; color: #b91c1c; opacity: 0.75; font-size: 0.78rem;">${displayQty} ${item.satuan}</div><div style="font-weight: 800; color: #dc2626; font-size: 0.85rem;">0 ${item.satuan}</div>`;
              planHargaHtml = `<div style="text-decoration: line-through; color: #b91c1c; opacity: 0.75; font-size: 0.78rem;">${formatIDR(item.hargaSiplah)}</div><div style="font-weight: 800; color: #dc2626; font-size: 0.85rem;">Rp 0</div>`;
              planTotalHtml = `<div style="text-decoration: line-through; color: #b91c1c; opacity: 0.75; font-size: 0.78rem;">${formatIDR(item.total)}</div><div style="font-weight: 800; color: #dc2626; font-size: 0.9rem;">Rp 0</div>`;
            }

            let realTgl = '-', realQty = '-', realHarga = '-', realTotal = '-';
            let realAksi = `
              <div style="display: flex; flex-direction: column; gap: 6px; align-items: center;">
                <button onclick="event.stopPropagation(); window.openModalRealisasi(${item.unitId}, ${item.itemIndex}, '${item.targetMonth}', '${item.desc}', ${item.qty}, ${item.hargaSiplah})" style="background: var(--accent-primary); color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; font-weight: 600; width: 100%;">+ Input Realisasi</button>
                <button onclick="event.stopPropagation(); window.openSingleShiftMonthModal(${item.unitId}, ${item.itemIndex})" style="background: rgba(139,92,246,0.12); color: #6d28d9; border: 1px solid rgba(139,92,246,0.3); padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 0.7rem; font-weight: 700; width: 100%; text-align: center;">📅 Geser Bulan</button>
                <button onclick="event.stopPropagation(); if(confirm('Batalkan pengeluaran transaksi ini?')){ window.setRealisasiBatal(${item.unitId}, ${item.itemIndex}, '${item.targetMonth}'); }" style="background: transparent; color: var(--accent-danger); border: 1px solid var(--accent-danger); padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 0.7rem; font-weight: 500; width: 100%; text-align: center;">Batal Belanja</button>
              </div>
            `;
            
            let rowClass = '';
            let firstTdStyle = '';

            if (isDone) {
              if (r.batal) {
                rowClass = 'realisasi-row-canceled';
                firstTdStyle = 'border-left: 5px solid #ef4444; font-weight: 600; color: #991b1b;';
                
                // Realisasi dikosongkan!
                realTgl = '<span style="color: #94a3b8;">-</span>';
                realQty = '<span style="color: #94a3b8;">-</span>';
                realHarga = '<span style="color: #94a3b8;">-</span>';
                realTotal = '<span style="color: #94a3b8;">-</span>';
                
                realAksi = `
                  <div style="color: #dc2626; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 4px;">
                    <span style="font-size: 1rem;">⚠️</span> Batal Belanja
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 4px; align-items: center; margin-top: 4px;">
                    <button onclick="event.stopPropagation(); window.openModalRealisasi(${item.unitId}, ${item.itemIndex}, '${item.targetMonth}', '${item.desc}', ${item.qty}, ${item.hargaSiplah}, true)" style="background: transparent; color: #b91c1c; border: none; font-size: 0.7rem; text-decoration: underline; cursor: pointer; padding: 0;">Edit</button>
                    <button onclick="event.stopPropagation(); if(confirm('Aktifkan kembali transaksi ini?')){ window.deleteRealisasi(${item.unitId}, ${item.itemIndex}, '${item.targetMonth}'); }" style="background: #ffffff; color: #0284c7; border: 1px solid #0284c7; font-size: 0.7rem; font-weight: 600; padding: 2px 6px; border-radius: 4px; cursor: pointer; margin-top: 2px;">🔄 Aktifkan</button>
                  </div>
                `;
              } else {
                rowClass = 'realisasi-row-done';
                firstTdStyle = 'border-left: 4px solid var(--accent-success);';
                realTgl = r.tgl || '-';
                realQty = Number.isInteger(Number(r.qty)) ? r.qty : Number(r.qty).toFixed(2);
                realQty += ` ${item.satuan}`;
                realHarga = formatIDR(r.harga);
                realTotal = formatIDR(r.qty * r.harga);
                
                const linkBukti = r.link ? `<a href="${r.link}" target="_blank" style="font-size: 0.75rem; color: #15803d; text-decoration: underline; background: rgba(21, 128, 61, 0.1); padding: 2px 6px; border-radius: 4px; display: block; margin-top: 4px; text-align: center;">Lihat Nota</a>` : '';
                const invoiceBadge = r.invoice ? `<span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; display: block; margin-top: 4px; font-weight: 600; text-align: center; ${getInvoiceBadgeStyle(r.invoice)}">📄 ${r.invoice}</span>` : '';
                realAksi = `
                  <div style="color: var(--accent-success); font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 4px;">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                    Selesai
                  </div>
                  ${invoiceBadge}
                  ${linkBukti}
                  <div style="display: flex; flex-direction: column; gap: 4px; align-items: center; margin-top: 4px;">
                    <button onclick="event.stopPropagation(); window.openModalRealisasi(${item.unitId}, ${item.itemIndex}, '${item.targetMonth}', '${item.desc}', ${item.qty}, ${item.hargaSiplah}, true)" style="background: transparent; color: var(--accent-primary); border: none; font-size: 0.7rem; text-decoration: underline; cursor: pointer; padding: 0;">Edit</button>
                    <button onclick="event.stopPropagation(); if(confirm('Batalkan pengeluaran transaksi ini?')){ window.setRealisasiBatal(${item.unitId}, ${item.itemIndex}, '${item.targetMonth}'); }" style="background: transparent; color: var(--accent-danger); border: none; font-size: 0.7rem; text-decoration: underline; cursor: pointer; padding: 0;">Batal Belanja</button>
                  </div>
                `;
              }
            }
            const rabOriginal = globalRABData[item.unitId]?.[item.itemIndex];
            let shiftBadge = '';
            if (rabOriginal) {
              if (rabOriginal.bulan !== rabOriginal._originalBulan && rabOriginal._originalBulan) {
                shiftBadge += `<br><span class="geser-bulan-badge baru" style="font-size: 0.68rem; margin-top: 3px; display: inline-block;" title="Bulan Awal: ${rabOriginal._originalBulan}">🔄 Digeser dari ${rabOriginal._originalBulan}</span>`;
              }
              if ((rabOriginal.harga !== rabOriginal._originalHarga || rabOriginal.qty !== rabOriginal._originalQty) && rabOriginal._originalHarga !== undefined) {
                shiftBadge += `<br><span class="geser-nominal-display baru" style="font-size: 0.68rem; margin-top: 3px; display: inline-block;">💰 Nominal Shifted</span>`;
              }

              const volTL = rabOriginal.volume !== undefined ? rabOriginal.volume : (rabOriginal.qty || 1);
              const trfTL = rabOriginal.tarif !== undefined ? rabOriginal.tarif : (rabOriginal.harga || 0);
              const grsTL = volTL * trfTL;
              const hFinalTL = rabOriginal.hargaFinal !== undefined ? rabOriginal.hargaFinal : (rabOriginal.total || grsTL);
              const t1TL = rabOriginal.tahap1 !== undefined ? rabOriginal.tahap1 : 0;
              const t2TL = rabOriginal.tahap2 !== undefined ? rabOriginal.tahap2 : (hFinalTL - t1TL);

              if (t2TL < 0 || (t1TL > 0 && t1TL > hFinalTL)) {
                const isMatch = Math.abs(grsTL - t1TL) < 1.0;
                const cause = isMatch ? 'Volume × Tarif == Tahap 1 (Item direvisi turun setelah Tahap 1 terkunci)' : 'Revisi Pagu Final lebih kecil dari Realisasi/Alokasi Tahap 1';
                shiftBadge += `<br><span class="badge-koreksi-revisi" style="font-size: 0.68rem; margin-top: 3px; display: inline-flex;" title="Gross: ${formatIDR(grsTL)} | Final: ${formatIDR(hFinalTL)} | Tahap 1: ${formatIDR(t1TL)} | Tahap 2: ${formatIDR(t2TL)}">
                  ⚠️ Ada koreksi revisi
                  <span class="reconcile-tooltip">
                    <strong>⚠️ Detail Koreksi Revisi (RKAS)</strong><br>
                    • Estimasi Awal (Gross): <strong>${formatIDR(grsTL)}</strong> (${volTL} ${rabOriginal.satuan || 'pcs'} × ${formatIDR(trfTL)})<br>
                    • Realisasi/Tahap 1: <strong>${formatIDR(t1TL)}</strong><br>
                    • Harga Final (Revisi): <strong>${formatIDR(hFinalTL)}</strong><br>
                    • Koreksi Tahap 2: <strong style="color:#ef4444;">${formatIDR(t2TL)}</strong><br>
                    • Penyebab: <em>${cause}</em>
                  </span>
                </span>`;
              }
            }

            let invoiceAttr = (isDone && r && r.invoice) ? `data-invoice="${r.invoice}"` : '';
            const itemKey = `${item.unitId}-${item.itemIndex}-${item.targetMonth}`;
            const isChecked = (window.selectedTimelineKeys && window.selectedTimelineKeys.has(itemKey)) ? 'checked' : '';
            
            html += `
                      <tr class="${rowClass}" ${invoiceAttr}>
                        <td style="border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: center;">
                          <input type="checkbox" class="timeline-item-checkbox" data-key="${itemKey}" data-unit-id="${item.unitId}" data-item-index="${item.itemIndex}" data-target-month="${item.targetMonth}" ${isChecked} onclick="event.stopPropagation(); window.handleCheckboxChange(this);" onchange="event.stopPropagation(); window.handleCheckboxChange(this);" style="width: 16px; height: 16px; cursor: pointer;" />
                        </td>
                        <td style="border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; font-weight: 600; color: var(--text-main); ${firstTdStyle}">${item.desc}${shiftBadge}</td>
                        <td style="border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: center;">${linkHtml}</td>
                        <td style="border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: center; color: var(--text-muted);">${planQtyHtml}</td>
                        <td style="border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: right; font-family: monospace; color: var(--text-muted);">${planHargaHtml}</td>
                        <td style="border-bottom: 1px solid var(--glass-border); border-right: 3px solid #94a3b8; padding: 10px; text-align: right; font-weight: 700; color: var(--accent-primary); font-family: monospace;">${planTotalHtml}</td>
                        
                        <td style="border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: center; color: ${isDone ? 'var(--text-main)' : 'var(--text-muted)'}; font-size: 0.8rem;">${realTgl}</td>
                        <td style="border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: center; color: ${isDone ? 'var(--text-main)' : 'var(--text-muted)'}; font-size: 0.8rem;">${realQty}</td>
                        <td style="border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: right; font-family: monospace; color: ${isDone ? 'var(--text-main)' : 'var(--text-muted)'};">${realHarga}</td>
                        <td style="border-bottom: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); padding: 10px; text-align: right; font-weight: 700; color: ${isDone ? 'var(--accent-success)' : 'var(--text-muted)'}; font-family: monospace;">${realTotal}</td>
                        <td style="border-bottom: 1px solid var(--glass-border); padding: 10px; text-align: center;">${realAksi}</td>
                      </tr>
            `;
          });
        
        html += `
                  </tbody>
                </table>
              </div>
            </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += `
          <div style="padding: 16px; border-top: 2px dashed var(--glass-border); text-align: right; font-weight: 700; color: var(--text-main); font-size: 1.15rem; margin-top: 8px; background: white; border-radius: 8px; box-shadow: var(--shadow-sm);">
            Total Estimasi: <span style="color: var(--accent-primary);">${formatIDR(monthTotal)}</span>
          </div>
        </div>
      </details>
    `;
  });
  
  html += '</div>';
  
  if (html === '<div class="timeline"></div>') {
     html = '<div style="text-align: center; padding: 48px; color: var(--text-muted); font-size: 1.1rem;">Tidak ada data realisasi yang sesuai dengan filter.</div>';
  }
  
  container.innerHTML = html;
}
window.renderRealisasiTimeline = renderRealisasiTimeline;

// Realisasi Modal Logic
window.toggleRealisasiFields = function() {
  const status = document.getElementById('inputRealisasiStatus').value;
  const detailsDiv = document.getElementById('realisasiDetailFields');
  if (status === 'Batal') {
    detailsDiv.style.display = 'none';
  } else {
    detailsDiv.style.display = 'block';
  }
};

window.setRealisasiBatal = function(unitId, rabIndex, targetMonth) {
  if (globalRABData[unitId] && globalRABData[unitId][rabIndex]) {
    let item = globalRABData[unitId][rabIndex];
    if (!item.realisasi) item.realisasi = {};
    const plannedQty = item.qty;
    const plannedHarga = item.harga;
    const existing = item.realisasi[targetMonth] || {};
    item.realisasi[targetMonth] = {
      ...existing,
      batal: true,
      qty: existing.qty || plannedQty,
      harga: existing.harga || plannedHarga
    };
    renderRealisasiTimeline();
    renderGeserItemTable();
    renderPergeseranAnggaran();
    renderAll();
  }
};

window.selectedTimelineKeys = new Set();

window.handleCheckboxChange = function(cb) {
  if (!cb) return;
  const key = cb.getAttribute('data-key') || `${cb.getAttribute('data-unit-id')}-${cb.getAttribute('data-item-index')}-${cb.getAttribute('data-target-month')}`;
  if (cb.checked) {
    window.selectedTimelineKeys.add(key);
  } else {
    window.selectedTimelineKeys.delete(key);
  }
  window.updateBulkToolbarState();
};

window.updateBulkToolbarState = function() {
  const count = window.selectedTimelineKeys ? window.selectedTimelineKeys.size : 0;
  const bar = document.getElementById('bulkActionBar');
  const countBadge = document.getElementById('bulkSelectedCount');
  
  let totalNominal = 0;
  if (count > 0 && window.selectedTimelineKeys) {
    window.selectedTimelineKeys.forEach(key => {
      const parts = key.split('-');
      if (parts.length >= 3) {
        const unitId = parseInt(parts[0]);
        const itemIndex = parseInt(parts[1]);
        const targetMonth = parts.slice(2).join('-');
        
        const item = globalRABData[unitId]?.[itemIndex];
        if (item) {
          const hargaSiplah = item.harga !== undefined ? item.harga : (item.hargaSiplah || 0);
          const isRutin = item.bulan === 'Rutin Bulanan';
          const qty = isRutin ? (item.qty / 12) : (item.qty || 1);
          let itemNominal = qty * hargaSiplah;
          
          if (item.realisasi && item.realisasi[targetMonth]) {
            const r = item.realisasi[targetMonth];
            if (!r.batal) {
              const rQty = r.qty !== undefined ? r.qty : qty;
              const rHarga = r.harga !== undefined ? r.harga : hargaSiplah;
              itemNominal = rQty * rHarga;
            }
          }
          totalNominal += itemNominal;
        }
      }
    });
  }

  if (bar) {
    if (count > 0) {
      bar.style.display = 'flex';
      if (countBadge) countBadge.textContent = `${count} item dipilih (${formatIDR(totalNominal)})`;
    } else {
      bar.style.display = 'none';
    }
  }
};

window.toggleSelectAllVisibleTimeline = function(select) {
  const checkboxes = document.querySelectorAll('.timeline-item-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = select;
    const key = cb.getAttribute('data-key') || `${cb.getAttribute('data-unit-id')}-${cb.getAttribute('data-item-index')}-${cb.getAttribute('data-target-month')}`;
    if (select) window.selectedTimelineKeys.add(key);
    else window.selectedTimelineKeys.delete(key);
  });
  const categoryHeaderCbs = document.querySelectorAll('.category-select-all');
  categoryHeaderCbs.forEach(cb => { cb.checked = select; });
  window.updateBulkToolbarState();
};

window.toggleSelectAllCategory = function(headerCb) {
  const table = headerCb.closest('table');
  if (table) {
    const rowCbs = table.querySelectorAll('.timeline-item-checkbox');
    rowCbs.forEach(cb => {
      cb.checked = headerCb.checked;
      const key = cb.getAttribute('data-key') || `${cb.getAttribute('data-unit-id')}-${cb.getAttribute('data-item-index')}-${cb.getAttribute('data-target-month')}`;
      if (headerCb.checked) window.selectedTimelineKeys.add(key);
      else window.selectedTimelineKeys.delete(key);
    });
    window.updateBulkToolbarState();
  }
};

window.openModalBulkRealisasi = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) {
    alert('Silakan centang minimal 1 transaksi terlebih dahulu!');
    return;
  }
  const modal = document.getElementById('modalBulkRealisasi');
  const countSpan = document.getElementById('bulkModalCount');
  if (countSpan) countSpan.textContent = window.selectedTimelineKeys.size;
  if (modal) {
    document.getElementById('inputBulkTgl').value = new Date().toISOString().split('T')[0];
    document.getElementById('inputBulkInvoice').value = '';
    document.getElementById('inputBulkLink').value = 'Sudah BKU (Verified)';
    modal.classList.add('active');
  }
};

window.closeModalBulkRealisasi = function() {
  const modal = document.getElementById('modalBulkRealisasi');
  if (modal) modal.classList.remove('active');
};

// ==========================================
// PINDAH BULAN / GESER ANGGARAN HANDLERS
// ==========================================
window.openModalShiftMonth = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) {
    alert('Silakan centang minimal 1 item/transaksi yang ingin dipindahkan bulannya!');
    return;
  }
  const modal = document.getElementById('modalShiftMonth');
  const countEl = document.getElementById('shiftMonthSelectedCount');
  if (countEl) countEl.textContent = `${window.selectedTimelineKeys.size} item`;
  if (modal) modal.classList.add('active');
};

window.closeModalShiftMonth = function() {
  const modal = document.getElementById('modalShiftMonth');
  if (modal) modal.classList.remove('active');
};

window.openSingleShiftMonthModal = function(unitId, itemIndex) {
  window.selectedTimelineKeys = new Set([`${unitId}-${itemIndex}-single`]);
  window.openModalShiftMonth();
};

window.executeShiftMonth = function() {
  const newMonth = document.getElementById('selectShiftTargetMonth')?.value;
  if (!newMonth) return;

  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) {
    alert('Tidak ada item yang dipilih!');
    return;
  }

  let countChanged = 0;

  window.selectedTimelineKeys.forEach(key => {
    const parts = key.split('-');
    if (parts.length >= 2) {
      const unitId = parseInt(parts[0]);
      const itemIndex = parseInt(parts[1]);

      if (globalRABData[unitId] && globalRABData[unitId][itemIndex]) {
        const item = globalRABData[unitId][itemIndex];
        const oldMonth = item.bulan;
        item.bulan = newMonth;

        if (item.realisasi) {
          if (item.realisasi[oldMonth] && !item.realisasi[newMonth]) {
            item.realisasi[newMonth] = { ...item.realisasi[oldMonth] };
            delete item.realisasi[oldMonth];
          }
        }

        countChanged++;
      }
    }
  });

  saveGlobalData();
  
  window.selectedTimelineKeys.clear();
  window.updateBulkToolbarState();
  window.closeModalShiftMonth();

  if (window.renderRealisasiTimeline) window.renderRealisasiTimeline();
  if (window.renderMonthlyMatrixTable) window.renderMonthlyMatrixTable();
  if (window.renderRAB) window.renderRAB();
  if (window.renderGeserItemTable) window.renderGeserItemTable();
  if (window.renderPergeseranAnggaran) window.renderPergeseranAnggaran();
  renderAll();

  alert(`✅ Berhasil memindahkan ${countChanged} item belanja ke alokasi bulan ${newMonth}!\n\nTabel Matrix Bulanan, Dashboard, dan RAB telah otomatis disesuaikan.`);
};

window.openModalCopyItem = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) {
    alert('Silakan centang minimal 1 transaksi terpilih yang ingin di-copy!');
    return;
  }
  const modal = document.getElementById('modalCopyItem');
  const countSpan = document.getElementById('copyModalCount');
  const nominalSpan = document.getElementById('copyModalNominal');

  let totalNominal = 0;
  window.selectedTimelineKeys.forEach(key => {
    const parts = key.split('-');
    if (parts.length >= 3) {
      const rawUnitId = parts[0];
      const unitId = isNaN(parseInt(rawUnitId)) ? rawUnitId : parseInt(rawUnitId);
      const itemIndex = parseInt(parts[1]);
      const targetMonth = parts.slice(2).join('-');
      const targetUnitData = globalRABData[unitId] || globalRABData[rawUnitId];
      const item = targetUnitData?.[itemIndex];
      if (item) {
        const hargaSiplah = item.harga !== undefined ? item.harga : (item.hargaSiplah || 0);
        const isRutin = item.bulan === 'Rutin Bulanan';
        const qty = isRutin ? (item.qty / 12) : (item.qty || 1);
        let itemNominal = qty * hargaSiplah;
        if (item.realisasi && item.realisasi[targetMonth]) {
          const r = item.realisasi[targetMonth];
          if (!r.batal) {
            const rQty = r.qty !== undefined ? r.qty : qty;
            const rHarga = r.harga !== undefined ? r.harga : hargaSiplah;
            itemNominal = rQty * rHarga;
          }
        }
        totalNominal += itemNominal;
      }
    }
  });

  if (countSpan) countSpan.textContent = window.selectedTimelineKeys.size;
  if (nominalSpan) nominalSpan.textContent = formatIDR(totalNominal);
  if (modal) modal.classList.add('active');
};

window.closeModalCopyItem = function() {
  const modal = document.getElementById('modalCopyItem');
  if (modal) modal.classList.remove('active');
};

window.submitBulkCopyItem = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) {
    alert('Tidak ada item yang dipilih untuk disalin!');
    return;
  }

  const targetMonth = document.getElementById('selectCopyTargetMonth')?.value || 'Januari';
  let copiedCount = 0;
  let totalCopiedNominal = 0;

  window.selectedTimelineKeys.forEach(key => {
    const parts = key.split('-');
    if (parts.length >= 3) {
      const rawUnitId = parts[0];
      const unitId = isNaN(parseInt(rawUnitId)) ? rawUnitId : parseInt(rawUnitId);
      const itemIndex = parseInt(parts[1]);
      const sourceMonth = parts.slice(2).join('-');

      const targetUnitData = globalRABData[unitId] || globalRABData[rawUnitId];
      const sourceItem = targetUnitData?.[itemIndex];
      if (sourceItem) {
        const itemPrice = sourceItem.harga !== undefined ? sourceItem.harga : (sourceItem.hargaSiplah || 0);
        const isRutin = sourceItem.bulan === 'Rutin Bulanan';
        const itemQty = isRutin ? (sourceItem.qty / 12) : (sourceItem.qty || 1);

        const newItem = {
          jenis: sourceItem.jenis || 'Operasional',
          desc: `${sourceItem.desc} (Salinan)`,
          satuan: sourceItem.satuan || 'pcs',
          qty: itemQty,
          harga: itemPrice,
          bulan: targetMonth,
          link: sourceItem.link || '',
          isNew: true,
          realisasi: {}
        };

        if (!globalRABData[unitId]) globalRABData[unitId] = [];
        globalRABData[unitId].push(newItem);

        copiedCount++;
        totalCopiedNominal += (itemQty * itemPrice);
      }
    }
  });

  saveGlobalData();

  if (window.closeModalCopyItem) window.closeModalCopyItem();
  
  if (window.selectedTimelineKeys) window.selectedTimelineKeys.clear();
  window.updateBulkToolbarState();

  if (window.renderRealisasiTimeline) window.renderRealisasiTimeline();
  if (window.renderMonthlyMatrixTable) window.renderMonthlyMatrixTable();
  if (window.renderRAB) window.renderRAB();
  if (window.renderGeserItemTable) window.renderGeserItemTable();
  if (window.renderPergeseranAnggaran) window.renderPergeseranAnggaran();
  renderAll();

  alert(`✅ Berhasil menyalin ${copiedCount} item (${formatIDR(totalCopiedNominal)}) ke alokasi bulan ${targetMonth}!\n\nItem hasil salinan kini telah tersedia pada alokasi bulan ${targetMonth}.`);
};

window.openModalBulkEditItem = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) {
    alert('Silakan centang minimal 1 item belanja yang ingin di-edit!');
    return;
  }

  // Jika tepat 1 item terpilih, buka modal edit single item lengkap!
  if (window.selectedTimelineKeys.size === 1) {
    const key = Array.from(window.selectedTimelineKeys)[0];
    const parts = key.split('-');
    if (parts.length >= 2) {
      const rawUnitId = parts[0];
      const unitId = isNaN(parseInt(rawUnitId)) ? rawUnitId : parseInt(rawUnitId);
      const itemIndex = parseInt(parts[1]);
      
      currentEstimasiUnitId = unitId;
      if (window.openModalItemEstimasi) {
        window.openModalItemEstimasi(itemIndex);
        return;
      }
    }
  }

  // Jika lebih dari 1 item terpilih, buka modal Edit Massal!
  const modal = document.getElementById('modalBulkEditItem');
  const countSpan = document.getElementById('bulkEditModalCount');
  if (countSpan) countSpan.textContent = window.selectedTimelineKeys.size;

  // Clear bulk edit input fields
  const descInput = document.getElementById('inputBulkEditDesc');
  const jenisInput = document.getElementById('inputBulkEditJenis');
  const bulanInput = document.getElementById('inputBulkEditBulan');
  const qtyInput = document.getElementById('inputBulkEditQty');
  const satuanInput = document.getElementById('inputBulkEditSatuan');
  const hargaInput = document.getElementById('inputBulkEditHarga');
  const linkInput = document.getElementById('inputBulkEditLink');

  if (descInput) descInput.value = '';
  if (jenisInput) jenisInput.value = '';
  if (bulanInput) bulanInput.value = '';
  if (qtyInput) qtyInput.value = '';
  if (satuanInput) satuanInput.value = '';
  if (hargaInput) hargaInput.value = '';
  if (linkInput) linkInput.value = '';

  if (modal) modal.classList.add('active');
};

window.closeModalBulkEditItem = function() {
  const modal = document.getElementById('modalBulkEditItem');
  if (modal) modal.classList.remove('active');
};

window.submitBulkEditItem = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) {
    alert('Tidak ada item yang dipilih!');
    return;
  }

  const descVal = document.getElementById('inputBulkEditDesc')?.value.trim();
  const jenisVal = document.getElementById('inputBulkEditJenis')?.value;
  const bulanVal = document.getElementById('inputBulkEditBulan')?.value;
  const qtyVal = parseFloat(document.getElementById('inputBulkEditQty')?.value);
  const satuanVal = document.getElementById('inputBulkEditSatuan')?.value.trim();
  const hargaVal = parseFloat(document.getElementById('inputBulkEditHarga')?.value);
  const linkVal = document.getElementById('inputBulkEditLink')?.value.trim();

  let countEdited = 0;

  window.selectedTimelineKeys.forEach(key => {
    const parts = key.split('-');
    if (parts.length >= 2) {
      const rawUnitId = parts[0];
      const unitId = isNaN(parseInt(rawUnitId)) ? rawUnitId : parseInt(rawUnitId);
      const itemIndex = parseInt(parts[1]);

      const targetUnitData = globalRABData[unitId] || globalRABData[rawUnitId];
      if (targetUnitData && targetUnitData[itemIndex]) {
        let item = targetUnitData[itemIndex];
        if (descVal) item.desc = descVal;
        if (jenisVal) item.jenis = jenisVal;
        if (bulanVal) item.bulan = bulanVal;
        if (!isNaN(qtyVal) && qtyVal > 0) item.qty = qtyVal;
        if (satuanVal) item.satuan = satuanVal;
        if (!isNaN(hargaVal) && hargaVal > 0) item.harga = hargaVal;
        if (linkVal) item.link = linkVal;
        countEdited++;
      }
    }
  });

  saveGlobalData();

  if (window.closeModalBulkEditItem) window.closeModalBulkEditItem();
  
  if (window.selectedTimelineKeys) window.selectedTimelineKeys.clear();
  window.updateBulkToolbarState();

  if (window.renderRealisasiTimeline) window.renderRealisasiTimeline();
  if (window.renderMonthlyMatrixTable) window.renderMonthlyMatrixTable();
  if (window.renderRAB) window.renderRAB();
  if (window.renderGeserItemTable) window.renderGeserItemTable();
  if (window.renderPergeseranAnggaran) window.renderPergeseranAnggaran();
  renderAll();

  alert(`✅ Berhasil memperbarui data untuk ${countEdited} item terpilih!\n\nSeluruh laporan dan dashboard telah disesuaikan.`);
};

window.saveBulkRealisasi = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) return;

  const tgl = document.getElementById('inputBulkTgl').value || new Date().toISOString().split('T')[0];
  const invoice = document.getElementById('inputBulkInvoice').value.trim();
  const link = document.getElementById('inputBulkLink').value.trim() || 'Sudah BKU';

  const keysArray = Array.from(window.selectedTimelineKeys);
  keysArray.forEach(key => {
    const parts = key.split('-');
    if (parts.length >= 3) {
      const uId = parts[0];
      const idx = parts[1];
      const m = parts.slice(2).join('-');
      if (globalRABData[uId] && globalRABData[uId][idx]) {
        let item = globalRABData[uId][idx];
        if (!item.realisasi) item.realisasi = {};
        item.realisasi[m] = {
          tgl: tgl,
          qty: item.qty,
          harga: item.harga,
          invoice: invoice || `BKU-${m.substring(0,3).toUpperCase()}-BULK-${idx}`,
          link: link,
          batal: false
        };
      }
    }
  });

  const countDone = window.selectedTimelineKeys.size;
  window.selectedTimelineKeys.clear();
  window.closeModalBulkRealisasi();
  saveGlobalData();
  renderRealisasiTimeline();
  renderGeserItemTable();
  renderPergeseranAnggaran();
  renderAll();
  window.updateBulkToolbarState();
  alert(`Berhasil menyimpan realisasi massal untuk ${countDone} transaksi terpilih!`);
};

window.bulkCancelRealisasi = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) return;
  const countDone = window.selectedTimelineKeys.size;
  if (!confirm(`Batalkan realisasi untuk ${countDone} transaksi terpilih?`)) return;

  const keysArray = Array.from(window.selectedTimelineKeys);
  keysArray.forEach(key => {
    const parts = key.split('-');
    if (parts.length >= 3) {
      const uId = parts[0];
      const idx = parts[1];
      const m = parts.slice(2).join('-');
      if (globalRABData[uId] && globalRABData[uId][idx]) {
        let item = globalRABData[uId][idx];
        if (!item.realisasi) item.realisasi = {};
        const existing = item.realisasi[m] || {};
        item.realisasi[m] = {
          ...existing,
          batal: true,
          qty: existing.qty || item.qty,
          harga: existing.harga || item.harga
        };
      }
    }
  });

  window.selectedTimelineKeys.clear();
  saveGlobalData();
  renderRealisasiTimeline();
  renderGeserItemTable();
  renderPergeseranAnggaran();
  renderAll();
  window.updateBulkToolbarState();
  alert(`Berhasil membatalkan realisasi untuk ${countDone} transaksi terpilih!`);
};

window.bulkDeleteRealisasi = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) return;
  const countDone = window.selectedTimelineKeys.size;
  if (!confirm(`Hapus total data realisasi untuk ${countDone} transaksi terpilih?`)) return;

  const keysArray = Array.from(window.selectedTimelineKeys);
  keysArray.forEach(key => {
    const parts = key.split('-');
    if (parts.length >= 3) {
      const uId = parts[0];
      const idx = parts[1];
      const m = parts.slice(2).join('-');
      if (globalRABData[uId] && globalRABData[uId][idx] && globalRABData[uId][idx].realisasi) {
        delete globalRABData[uId][idx].realisasi[m];
      }
    }
  });

  window.selectedTimelineKeys.clear();
  saveGlobalData();
  renderRealisasiTimeline();
  renderGeserItemTable();
  renderPergeseranAnggaran();
  renderAll();
  window.updateBulkToolbarState();
  alert(`Berhasil menghapus realisasi ${countDone} transaksi terpilih!`);
};

window.bulkRestoreRealisasi = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) return;
  const countDone = window.selectedTimelineKeys.size;
  if (!confirm(`Aktifkan kembali ${countDone} transaksi terpilih?`)) return;

  const keysArray = Array.from(window.selectedTimelineKeys);
  keysArray.forEach(key => {
    const parts = key.split('-');
    if (parts.length >= 3) {
      const uId = parts[0];
      const idx = parts[1];
      const m = parts.slice(2).join('-');
      if (globalRABData[uId] && globalRABData[uId][idx] && globalRABData[uId][idx].realisasi) {
        if (globalRABData[uId][idx].realisasi[m] && globalRABData[uId][idx].realisasi[m].batal) {
          delete globalRABData[uId][idx].realisasi[m].batal;
        }
      }
    }
  });

  window.selectedTimelineKeys.clear();
  saveGlobalData();
  renderRealisasiTimeline();
  renderGeserItemTable();
  renderPergeseranAnggaran();
  renderAll();
  window.updateBulkToolbarState();
  alert(`Berhasil mengaktifkan kembali ${countDone} transaksi terpilih!`);
};

window.bulkDeleteRABItem = function() {
  if (!window.selectedTimelineKeys || window.selectedTimelineKeys.size === 0) return;
  const countDone = window.selectedTimelineKeys.size;
  if (!confirm(`Hapus permanen ${countDone} item terpilih dari Rencana Anggaran (RAB)?\n\nNominal item ini akan dikembalikan secara penuh ke Sisa Dana Belum Dianggarkan.`)) return;

  const itemsByUnit = {};
  const keysArray = Array.from(window.selectedTimelineKeys);
  keysArray.forEach(key => {
    const parts = key.split('-');
    if (parts.length >= 3) {
      const uId = parts[0];
      const idx = parseInt(parts[1], 10);
      if (!itemsByUnit[uId]) itemsByUnit[uId] = [];
      if (!itemsByUnit[uId].includes(idx)) itemsByUnit[uId].push(idx);
    }
  });

  Object.keys(itemsByUnit).forEach(uId => {
    if (globalRABData[uId]) {
      itemsByUnit[uId].sort((a, b) => b - a); // Sort descending so array splice doesn't affect preceding indices
      itemsByUnit[uId].forEach(idx => {
        globalRABData[uId].splice(idx, 1);
      });
    }
  });

  window.selectedTimelineKeys.clear();
  saveGlobalData();
  renderRealisasiTimeline();
  renderGeserItemTable();
  renderPergeseranAnggaran();
  renderAll();
  window.updateBulkToolbarState();
  alert(`Berhasil menghapus ${countDone} item dari RAB! Anggaran telah dikembalikan secara penuh ke Dana Sisa Belum Dianggarkan.`);
};

// Realisasi Modal Logic
window.toggleRealisasiFields = function() {
  const status = document.getElementById('inputRealisasiStatus').value;
  const detailsDiv = document.getElementById('realisasiDetailFields');
  if (status === 'Batal') {
    detailsDiv.style.display = 'none';
  } else {
    detailsDiv.style.display = 'block';
  }
};

window.setRealisasiBatal = function(unitId, rabIndex, targetMonth) {
  if (globalRABData[unitId] && globalRABData[unitId][rabIndex]) {
    let item = globalRABData[unitId][rabIndex];
    if (!item.realisasi) item.realisasi = {};
    const plannedQty = item.qty;
    const plannedHarga = item.harga;
    const existing = item.realisasi[targetMonth] || {};
    item.realisasi[targetMonth] = {
      ...existing,
      batal: true,
      qty: existing.qty || plannedQty,
      harga: existing.harga || plannedHarga
    };
    saveGlobalData();
    renderRealisasiTimeline();
    renderGeserItemTable();
    renderPergeseranAnggaran();
    renderAll();
  }
};

window.deleteRealisasi = function(unitId, rabIndex, targetMonth) {
  if (globalRABData[unitId] && globalRABData[unitId][rabIndex] && globalRABData[unitId][rabIndex].realisasi) {
    delete globalRABData[unitId][rabIndex].realisasi[targetMonth];
    saveGlobalData();
    renderRealisasiTimeline();
    renderGeserItemTable();
    renderPergeseranAnggaran();
    renderAll();
  }
};

window.openModalRealisasi = function(unitId, rabIndex, targetMonth, desc, plannedQty, plannedHarga, isEdit = false) {
  const modal = document.getElementById('modalRealisasi');
  
  // Save references
  document.getElementById('realisasiUnitId').value = unitId;
  document.getElementById('realisasiRabIndex').value = rabIndex;
  document.getElementById('realisasiTargetMonth').value = targetMonth;
  document.getElementById('realisasiDesc').innerText = desc + " (" + targetMonth + ")";
  
  // If editing, load existing realisasi
  let currentRealisasi = null;
  if (isEdit && globalRABData[unitId] && globalRABData[unitId][rabIndex].realisasi) {
    currentRealisasi = globalRABData[unitId][rabIndex].realisasi[targetMonth];
  }
  
  // Populate form (use existing or fallback to planned)
  if (currentRealisasi) {
    if (currentRealisasi.batal) {
      document.getElementById('inputRealisasiStatus').value = 'Batal';
    } else {
      document.getElementById('inputRealisasiStatus').value = 'Selesai';
    }
    document.getElementById('inputRealisasiTgl').value = currentRealisasi.tgl || '';
    document.getElementById('inputRealisasiQty').value = currentRealisasi.qty || plannedQty;
    document.getElementById('inputRealisasiHarga').value = currentRealisasi.harga || plannedHarga;
    document.getElementById('inputRealisasiLink').value = currentRealisasi.link || '';
    document.getElementById('inputRealisasiInvoice').value = currentRealisasi.invoice || '';
  } else {
    document.getElementById('inputRealisasiStatus').value = 'Selesai';
    // Default to today
    document.getElementById('inputRealisasiTgl').value = new Date().toISOString().split('T')[0];
    document.getElementById('inputRealisasiQty').value = plannedQty;
    document.getElementById('inputRealisasiHarga').value = plannedHarga;
    document.getElementById('inputRealisasiLink').value = '';
    document.getElementById('inputRealisasiInvoice').value = '';
  }
  
  window.toggleRealisasiFields();
  modal.classList.add('active');
};

window.closeModalRealisasi = function() {
  const modal = document.getElementById('modalRealisasi');
  modal.classList.remove('active');
};

window.saveRealisasi = function() {
  const unitId = document.getElementById('realisasiUnitId').value;
  const rabIndex = document.getElementById('realisasiRabIndex').value;
  const targetMonth = document.getElementById('realisasiTargetMonth').value;
  const status = document.getElementById('inputRealisasiStatus').value;
  
  if (status === 'Batal') {
    if (globalRABData[unitId] && globalRABData[unitId][rabIndex]) {
      let item = globalRABData[unitId][rabIndex];
      if (!item.realisasi) item.realisasi = {};
      item.realisasi[targetMonth] = {
        batal: true
      };
      window.closeModalRealisasi();
      renderRealisasiTimeline();
      renderGeserItemTable();
      renderPergeseranAnggaran();
      renderAll();
    }
    return;
  }
  
  const tgl = document.getElementById('inputRealisasiTgl').value;
  const qty = parseFloat(document.getElementById('inputRealisasiQty').value) || 0;
  const harga = parseFloat(document.getElementById('inputRealisasiHarga').value) || 0;
  const link = document.getElementById('inputRealisasiLink').value;
  const invoice = document.getElementById('inputRealisasiInvoice').value;
  
  if (!tgl || qty <= 0 || harga <= 0) {
    alert('Harap isi Tanggal, Qty, dan Harga dengan benar.');
    return;
  }
  
  if (globalRABData[unitId] && globalRABData[unitId][rabIndex]) {
    let item = globalRABData[unitId][rabIndex];
    if (!item.realisasi) item.realisasi = {};
    
    // Save to targetMonth key
    item.realisasi[targetMonth] = {
      tgl: tgl,
      qty: qty,
      harga: harga,
      link: link,
      invoice: invoice
    };
    
    window.closeModalRealisasi();
    saveGlobalData();
    renderRealisasiTimeline();
    renderGeserItemTable();
    renderPergeseranAnggaran();
    renderAll();
  }
};

window.filterTimeline = function() {
  renderRealisasiTimeline();
};

window.resetTimelineDateFilter = function() {
  const tglAwalEl = document.getElementById('filterTimelineTglAwal');
  const tglAkhirEl = document.getElementById('filterTimelineTglAkhir');
  if (tglAwalEl) tglAwalEl.value = '';
  if (tglAkhirEl) tglAkhirEl.value = '';
  renderRealisasiTimeline();
};

// Interactive invoice hover grouping highlight
document.addEventListener('mouseover', (e) => {
  const tr = e.target.closest('tr[data-invoice]');
  if (!tr) return;
  const invoice = tr.getAttribute('data-invoice');
  if (!invoice) return;
  
  const rows = document.querySelectorAll(`tr[data-invoice="${invoice}"]`);
  rows.forEach(row => {
    row.classList.add('invoice-hover-highlight');
  });
});

// ================================================
// FORM ESTIMASI BELANJA UNIT (SPREADSHEET INPUT)
// ================================================

let currentEstimasiUnitId = 1;
let currentEstimasiCat = 'Operasional';

function renderInputEstimasiUnit() {
  const selectUnit = document.getElementById('selectEstimasiUnit');
  const tbody = document.getElementById('estimasiTableBody');
  const tfoot = document.getElementById('estimasiTableFoot');
  if (!selectUnit || !tbody || !tfoot) return;

  // Populate Unit Dropdown if empty
  if (selectUnit.options.length === 0) {
    selectUnit.innerHTML = '';
    estimasiData.forEach(unit => {
      selectUnit.innerHTML += `<option value="${unit.id}">${unit.unit}</option>`;
    });
    selectUnit.value = currentEstimasiUnitId || 1;

    selectUnit.addEventListener('change', (e) => {
      currentEstimasiUnitId = parseInt(e.target.value) || 1;
      renderInputEstimasiUnit();
    });
  } else {
    const val = parseInt(selectUnit.value);
    if (!isNaN(val) && val > 0) {
      currentEstimasiUnitId = val;
    } else {
      selectUnit.value = currentEstimasiUnitId || 1;
    }
  }

  const selectedUnit = estimasiData.find(u => u.id === currentEstimasiUnitId) || estimasiData[0];
  const unitPagu = selectedUnit.siswa * danaPerSiswa;
  const items = globalRABData[currentEstimasiUnitId] || [];

  // Wire Category Tabs
  const activeTabInDom = document.querySelector('.spreadsheet-tab.active');
  if (activeTabInDom && !currentEstimasiCat) {
    currentEstimasiCat = activeTabInDom.getAttribute('data-cat');
  }

  const tabs = document.querySelectorAll('.spreadsheet-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-cat') === currentEstimasiCat) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
    tab.onclick = () => {
      currentEstimasiCat = tab.getAttribute('data-cat');
      renderInputEstimasiUnit();
    };
  });

  // Calculate Unit Totals
  let grandTotalUsulan = 0;
  items.forEach(item => {
    grandTotalUsulan += (item.qty * item.harga);
  });

  const sisaAlokasi = unitPagu - grandTotalUsulan;
  const isOver = sisaAlokasi < 0;

  // Summary Cards Update
  const paguEl = document.getElementById('estPaguUnit');
  const usulanEl = document.getElementById('estTotalUsulan');
  const countEl = document.getElementById('estTotalItemCount');
  const sisaEl = document.getElementById('estSisaAlokasi');
  const statusCard = document.getElementById('estStatusCard');
  const statusIcon = document.getElementById('estStatusIcon');
  const statusHint = document.getElementById('estStatusHint');

  if (paguEl) paguEl.textContent = formatIDR(unitPagu);
  if (usulanEl) usulanEl.textContent = formatIDR(grandTotalUsulan);
  if (countEl) countEl.textContent = `${items.length} barang diinput`;
  if (sisaEl) {
    sisaEl.textContent = (sisaAlokasi >= 0 ? '+' : '') + formatIDR(sisaAlokasi);
    sisaEl.className = 'pergeseran-stat-value ' + (isOver ? 'selisih-negatif' : 'selisih-positif');
  }

  if (statusCard && statusIcon && statusHint) {
    if (isOver) {
      statusCard.className = 'card pergeseran-stat-card defisit';
      statusIcon.textContent = '⚠️';
      statusHint.textContent = 'Estimasi melebihi Pagu (OVER)';
    } else {
      statusCard.className = 'card pergeseran-stat-card under';
      statusIcon.textContent = '✅';
      statusHint.textContent = 'Alokasi anggaran masih mencukupi (AMAN)';
    }
  }

  // Filter items by active category
  let rowNum = 0;
  let catTotalSum = 0;
  tbody.innerHTML = '';

  items.forEach((item, index) => {
    if (currentEstimasiCat !== 'Semua' && item.jenis !== currentEstimasiCat) return;

    rowNum++;
    const totalRow = item.qty * item.harga;
    catTotalSum += totalRow;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="text-center font-bold" style="color: var(--text-muted);">${rowNum}</td>
      <td><strong>${item.desc}</strong></td>
      <td><span style="color: var(--text-muted); font-size: 0.82rem;">${item.link && item.link !== '-' ? item.link : '-'}</span></td>
      <td class="text-center font-semibold">${item.qty}</td>
      <td class="text-center"><span class="geser-bulan-badge sama">${item.satuan}</span></td>
      <td class="text-right font-mono">${formatIDR(item.harga)}</td>
      <td class="text-right font-mono font-bold" style="color: var(--accent-primary);">${formatIDR(totalRow)}</td>
      <td><span class="geser-bulan-badge baru">${item.bulan}</span></td>
      <td class="text-center">
        <button class="btn-edit-item" onclick="window.openModalItemEstimasi(${index})">Edit</button>
        <button class="btn-hapus-item" onclick="window.hapusItemEstimasi(${index})">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (rowNum === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted); font-style: italic;">
          Belum ada barang pada kategori "${currentEstimasiCat}". Klik "+ Tambah Barang Baru" untuk menambahkan barang.
        </td>
      </tr>
    `;
  }

  // Footer Totals
  tfoot.innerHTML = `
    <tr>
      <td colspan="6" class="text-right"><strong>SUBTOTAL (${currentEstimasiCat.toUpperCase()})</strong></td>
      <td class="text-right font-mono font-bold" style="color: var(--accent-primary); font-size: 0.95rem;">${formatIDR(catTotalSum)}</td>
      <td colspan="2"></td>
    </tr>
    <tr style="background: rgba(16, 185, 129, 0.08); border-top: 2px solid #10b981;">
      <td colspan="6" class="text-right"><strong>TOTAL KESELURUHAN ESTIMASI USULAN UNIT</strong></td>
      <td class="text-right font-mono font-bold" style="color: #047857; font-size: 1.05rem;">${formatIDR(grandTotalUsulan)}</td>
      <td colspan="2"></td>
    </tr>
  `;
}
window.renderInputEstimasiUnit = renderInputEstimasiUnit;

// Modal Handlers for Estimasi Unit
window.openModalItemEstimasi = function(editIndex = -1) {
  const modal = document.getElementById('modalItemEstimasi');
  if (!modal) return;

  const titleEl = document.getElementById('modalItemEstimasiTitle');
  const editIndexEl = document.getElementById('estimasiEditIndex');
  const jenisEl = document.getElementById('inputItemJenis');
  const namaEl = document.getElementById('inputItemNama');
  const merkEl = document.getElementById('inputItemMerk');
  const qtyEl = document.getElementById('inputItemQty');
  const satuanEl = document.getElementById('inputItemSatuan');
  const hargaEl = document.getElementById('inputItemHarga');
  const bulanEl = document.getElementById('inputItemBulan');
  const calcEl = document.getElementById('inputItemTotalCalc');

  editIndexEl.value = editIndex;

  const updateCalc = () => {
    const q = parseFloat(qtyEl.value) || 0;
    const h = parseFloat(hargaEl.value) || 0;
    if (calcEl) calcEl.textContent = formatIDR(q * h);
  };

  qtyEl.oninput = updateCalc;
  hargaEl.oninput = updateCalc;

  if (editIndex >= 0) {
    const item = globalRABData[currentEstimasiUnitId]?.[editIndex];
    if (item) {
      if (titleEl) titleEl.textContent = 'Edit Barang Estimasi Belanja';
      jenisEl.value = item.jenis || 'Operasional';
      namaEl.value = item.desc || '';
      merkEl.value = item.link || '';
      qtyEl.value = item.qty || 1;
      satuanEl.value = item.satuan || 'pcs';
      hargaEl.value = item.harga || 0;
      bulanEl.value = item.bulan || 'Januari';
      updateCalc();
    }
  } else {
    if (titleEl) titleEl.textContent = 'Tambah Barang Estimasi Belanja Baru';
    jenisEl.value = currentEstimasiCat === 'Semua' ? 'Operasional' : currentEstimasiCat;
    namaEl.value = '';
    merkEl.value = '';
    qtyEl.value = '';
    satuanEl.value = 'pcs';
    hargaEl.value = '';
    bulanEl.value = 'Januari';
    if (calcEl) calcEl.textContent = 'Rp 0';
  }

  modal.classList.add('active');
};

window.closeModalItemEstimasi = function() {
  const modal = document.getElementById('modalItemEstimasi');
  if (modal) modal.classList.remove('active');
};

window.simpanItemEstimasi = function() {
  const editIndex = parseInt(document.getElementById('estimasiEditIndex').value);
  const jenis = document.getElementById('inputItemJenis').value;
  const desc = document.getElementById('inputItemNama').value.trim();
  const link = document.getElementById('inputItemMerk').value.trim() || '-';
  const qty = parseFloat(document.getElementById('inputItemQty').value) || 0;
  const satuan = document.getElementById('inputItemSatuan').value.trim() || 'pcs';
  const harga = parseFloat(document.getElementById('inputItemHarga').value) || 0;
  const bulan = document.getElementById('inputItemBulan').value;

  if (!desc || qty <= 0 || harga <= 0) {
    alert('Harap lengkapi Nama Barang, Jumlah (Qty), dan Harga Satuan dengan benar!');
    return;
  }

  if (!globalRABData[currentEstimasiUnitId]) {
    globalRABData[currentEstimasiUnitId] = [];
  }

  const newItem = { jenis, desc, link, qty, satuan, harga, bulan };

  if (editIndex >= 0 && globalRABData[currentEstimasiUnitId][editIndex]) {
    const existing = globalRABData[currentEstimasiUnitId][editIndex];
    if (existing.realisasi) {
      newItem.realisasi = existing.realisasi;
    }
    if (existing.isNew) {
      newItem.isNew = true;
    }
    globalRABData[currentEstimasiUnitId][editIndex] = newItem;
  } else {
    newItem.isNew = true;
    globalRABData[currentEstimasiUnitId].push(newItem);
  }

  window.closeModalItemEstimasi();

  saveGlobalData();

  if (window.selectedTimelineKeys) {
    window.selectedTimelineKeys.clear();
  }
  if (window.updateBulkToolbarState) {
    window.updateBulkToolbarState();
  }

  // Sync with all pages
  if (window.renderInputEstimasiUnit) window.renderInputEstimasiUnit();
  if (window.renderRAB) window.renderRAB();
  if (window.renderRealisasiTimeline) window.renderRealisasiTimeline();
  if (window.renderMonthlyMatrixTable) window.renderMonthlyMatrixTable();
  if (window.renderGeserItemTable) window.renderGeserItemTable();
  if (window.renderPergeseranAnggaran) window.renderPergeseranAnggaran();
  renderAll();

  alert(`✅ Berhasil menyimpan perubahan data item "${desc}"!\n\nSeluruh laporan dan dashboard telah otomatis disesuaikan.`);
};

window.hapusItemEstimasi = function(index) {
  if (confirm('Hapus barang ini dari estimasi belanja unit?')) {
    if (globalRABData[currentEstimasiUnitId] && globalRABData[currentEstimasiUnitId][index]) {
      globalRABData[currentEstimasiUnitId].splice(index, 1);
      saveGlobalData();
      renderInputEstimasiUnit();

      // Sync with all pages
      if (window.renderRAB) window.renderRAB();
      if (window.renderRealisasiTimeline) window.renderRealisasiTimeline();
      if (window.renderGeserItemTable) window.renderGeserItemTable();
      if (window.renderPergeseranAnggaran) window.renderPergeseranAnggaran();
      renderAll();
    }
  }
};

// Add event listener for + Tambah Barang & Load Template
const btnTambahItemEstimasi = document.getElementById('btnTambahItemEstimasi');
if (btnTambahItemEstimasi) {
  btnTambahItemEstimasi.addEventListener('click', () => {
    window.openModalItemEstimasi(-1);
  });
}

const btnResetTemplateEstimasi = document.getElementById('btnResetTemplateEstimasi');
if (btnResetTemplateEstimasi) {
  btnResetTemplateEstimasi.addEventListener('click', () => {
    if (confirm('Muat data standar estimasi belanja (seperti spreadsheet)? Data saat ini akan diperbarui.')) {
      globalRABData[currentEstimasiUnitId] = JSON.parse(JSON.stringify(spreadsheetStandardItems));
      saveGlobalData();
      renderInputEstimasiUnit();
      if (window.renderRAB) window.renderRAB();
      if (window.renderRealisasiTimeline) window.renderRealisasiTimeline();
      renderAll();
    }
  });
}

const btnSimpanEstimasiUnit = document.getElementById('btnSimpanEstimasiUnit');
if (btnSimpanEstimasiUnit) {
  btnSimpanEstimasiUnit.addEventListener('click', () => {
    alert('✅ Estimasi Belanja Unit berhasil disimpan dan diintegrasikan ke Perencanaan (RAB), Realisasi, dan Pergeseran!');
    if (window.renderRAB) window.renderRAB();
    renderAll();
  });
}

// ==========================================
// NEW ITEM FLOATING MODAL HANDLERS
// ==========================================
window.openModalAddNewItem = function() {
  const modal = document.getElementById('modalAddNewItem');
  if (!modal) return;

  document.getElementById('newItemDesc').value = '';
  document.getElementById('newItemQty').value = '1';
  document.getElementById('newItemSatuan').value = 'pcs';
  document.getElementById('newItemHarga').value = '';
  document.getElementById('newItemLink').value = '';
  document.getElementById('newItemTotalCalc').innerText = 'Rp 0';

  const chk = document.getElementById('chkDirectRealisasi');
  if (chk) chk.checked = true; // Default to TRUE so adding a transaction defaults to Realized BKU!
  window.toggleDirectRealisasiFields();

  const dateInput = document.getElementById('directRealTgl');
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  modal.classList.add('active');
};

window.closeModalAddNewItem = function() {
  const modal = document.getElementById('modalAddNewItem');
  if (modal) modal.classList.remove('active');
};

window.calcNewItemTotal = function() {
  const q = parseFloat(document.getElementById('newItemQty')?.value) || 0;
  const h = parseFloat(document.getElementById('newItemHarga')?.value) || 0;
  const total = q * h;
  const calcEl = document.getElementById('newItemTotalCalc');
  if (calcEl) calcEl.innerText = formatIDR(total);
};

window.toggleDirectRealisasiFields = function() {
  const chk = document.getElementById('chkDirectRealisasi');
  const fields = document.getElementById('directRealisasiFields');
  if (fields) {
    fields.style.display = (chk && chk.checked) ? 'block' : 'none';
  }
};

window.saveAddNewItem = function() {
  const unitId = parseInt(document.getElementById('newItemUnit')?.value) || 1;
  const bulan = document.getElementById('newItemBulan')?.value || 'Januari';
  const jenis = document.getElementById('newItemJenis')?.value || 'Operasional';
  const desc = document.getElementById('newItemDesc')?.value?.trim();
  const qty = parseFloat(document.getElementById('newItemQty')?.value) || 1;
  const satuan = document.getElementById('newItemSatuan')?.value?.trim() || 'pcs';
  const harga = parseFloat(document.getElementById('newItemHarga')?.value) || 0;
  const link = document.getElementById('newItemLink')?.value?.trim() || '';

  if (!desc) {
    alert('Harap isi nama / deskripsi barang belanja!');
    return;
  }
  if (harga <= 0) {
    alert('Harap isi harga satuan yang valid!');
    return;
  }

  const newItemTotal = qty * harga;
  const budgetInfo = getUnitAvailableBudget(unitId);
  const unitObj = estimasiData.find(u => u.id === unitId);
  const unitName = unitObj ? unitObj.unit : 'Unit';

  if (budgetInfo.sisa < newItemTotal) {
    const minusAmount = newItemTotal - Math.max(0, budgetInfo.sisa);
    alert(`⛔ GAGAL MENAMBAHKAN ITEM BELANJA!

Sisa Pagu Net BOS yang belum dianggarkan untuk ${unitName} tidak mencukupi!

• Pagu Net BOS Unit: ${formatIDR(budgetInfo.paguNet)}
• Total Belanja Teralokasi saat ini: ${formatIDR(budgetInfo.totalAllocated)}
• Sisa Belum Dianggarkan Tersedia: ${budgetInfo.sisa > 0 ? formatIDR(budgetInfo.sisa) : 'Rp 0 (Sudah Habis)'}
• Nominal Item Baru Yang Di-input: ${formatIDR(newItemTotal)}
• Potential Defisit (Minus): -${formatIDR(minusAmount)}

Silakan kurangi Volume/Harga item ini atau batalkan belanja item lain di unit ${unitName} terlebih dahulu.`);
    return;
  }

  const newItem = {
    jenis: jenis,
    desc: desc,
    satuan: satuan,
    qty: qty,
    harga: harga,
    bulan: bulan,
    link: link,
    isNew: true,
    realisasi: {}
  };

  const chk = document.getElementById('chkDirectRealisasi');
  const isDirect = chk ? chk.checked : true;
  if (isDirect) {
    const realTglInput = document.getElementById('directRealTgl')?.value;
    let formattedTgl = realTglInput;
    const mNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    let monthFromDate = '';

    if (realTglInput) {
      const parts = realTglInput.split('-');
      if (parts.length === 3) {
        const d = parseInt(parts[2]);
        const mIdx = parseInt(parts[1]) - 1;
        if (mIdx >= 0 && mIdx < 12) monthFromDate = mNames[mIdx];
        formattedTgl = `${d} ${mNames[mIdx]} ${parts[0]}`;
      }
    }

    const targetMonth = monthFromDate || ((bulan === 'Rutin Bulanan') ? 'Januari' : bulan);
    if (!formattedTgl) {
      formattedTgl = `15 ${targetMonth} 2026`;
    }

    const realInvoice = document.getElementById('directRealInvoice')?.value?.trim() || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const realLink = document.getElementById('directRealLink')?.value?.trim() || link;

    if (bulan === 'Rutin Bulanan') {
      const monthlyQty = qty / 12;
      mNames.forEach(mName => {
        newItem.realisasi[mName] = {
          tgl: formattedTgl,
          qty: monthlyQty,
          harga: harga,
          invoice: realInvoice,
          link: realLink
        };
      });
    } else {
      newItem.realisasi[targetMonth] = {
        tgl: formattedTgl,
        qty: qty,
        harga: harga,
        invoice: realInvoice,
        link: realLink
      };
    }
  }

  if (!globalRABData[unitId]) globalRABData[unitId] = [];
  globalRABData[unitId].push(newItem);

  saveGlobalData();
  
  if (window.renderRealisasiTimeline) window.renderRealisasiTimeline();
  if (window.renderRAB) window.renderRAB();
  if (window.renderGeserItemTable) window.renderGeserItemTable();
  if (window.renderPergeseranAnggaran) window.renderPergeseranAnggaran();
  renderAll();

  if (window.closeModalAddNewItem) window.closeModalAddNewItem();
  alert(`✅ Item baru "${desc}" (${formatIDR(qty * harga)}) berhasil ditambahkan ke ${unitName}!`);
};

// ==========================================
// INVENTARISIR BELANJA ASET, BUKU, & BARANG
// ==========================================

const invNonGoodsPatterns = [
  /tagihan\s+listrik/i,
  /listrik\s+token/i,
  /pembayaran\s+listrik/i,
  /token\s+listrik/i,
  /internet/i,
  /indihome/i,
  /wifi/i,
  /langganan/i,
  /pulsadata/i,
  /honor/i,
  /gaji/i,
  /narasumber/i,
  /jasa\s+servis/i,
  /sewa/i
];

function getInventarisirRealizedItems() {
  const items = [];
  
  estimasiData.forEach(unit => {
    const rabItems = globalRABData[unit.id] || [];
    rabItems.forEach((item, itemIdx) => {
      const jLower = (item.jenis || '').toLowerCase();
      
      // Exclude Honor & Gaji
      if (jLower === 'gaji' || jLower === 'honor') return;

      // Determine category
      let category = '';
      if (jLower === 'modal' || jLower === 'aset' || jLower === 'belanja modal') {
        category = 'Belanja Modal / Aset';
      } else if (jLower === 'buku' || jLower === 'belanja buku') {
        category = 'Belanja Buku';
      } else if (jLower === 'operasional' || jLower === 'belanja operasional') {
        // Exclude non-goods (listrik, internet, etc.)
        const isNonGood = invNonGoodsPatterns.some(pat => pat.test(item.desc || ''));
        if (isNonGood) return;
        category = 'Belanja Operasional (Barang)';
      } else {
        return; // Skip unknown category
      }

      // Check realisasi for each month
      if (item.realisasi) {
        Object.keys(item.realisasi).forEach(monthKey => {
          const real = item.realisasi[monthKey];
          if (!real || real.batal) return; // Skip if canceled or no realisasi
          
          const rQty = real.qty !== undefined ? parseFloat(real.qty) : parseFloat(item.qty || 0);
          const rHarga = real.harga !== undefined ? parseFloat(real.harga) : parseFloat(item.harga || 0);
          const rTotal = rQty * rHarga;
          
          if (rQty <= 0 || rHarga <= 0) return; // Skip invalid amounts

          items.push({
            unitId: unit.id,
            unitName: unit.unit,
            itemIndex: itemIdx,
            targetMonth: monthKey,
            tgl: real.tgl || real.tanggal || `- (${monthKey})`,
            desc: item.desc,
            category: category,
            jenis: item.jenis,
            qty: rQty,
            satuan: item.satuan || 'pcs',
            harga: rHarga,
            total: rTotal,
            invoice: real.invoice || '-',
            link: real.link || item.link || '',
            note: real.note || ''
          });
        });
      }
    });
  });

  return items;
}

function renderInventarisirPage() {
  const tableBody = document.getElementById('inventarisTableBody');
  if (!tableBody) return;

  const unitFilterEl = document.getElementById('filterInvUnit');
  const catFilterEl = document.getElementById('filterInvKategori');
  const bulanFilterEl = document.getElementById('filterInvBulan');
  const searchEl = document.getElementById('filterInvSearch');

  // Populate Unit Filter options dynamically if empty
  if (unitFilterEl && unitFilterEl.options.length <= 1) {
    estimasiData.forEach(unit => {
      const opt = document.createElement('option');
      opt.value = unit.unit;
      opt.textContent = unit.unit;
      unitFilterEl.appendChild(opt);
    });
  }

  const allItems = getInventarisirRealizedItems();

  // Calculate Statistics
  let totalCount = allItems.length;
  let totalRp = 0;
  let modalRp = 0, modalCount = 0;
  let bukuRp = 0, bukuCount = 0;
  let opRp = 0, opCount = 0;

  allItems.forEach(item => {
    totalRp += item.total;
    if (item.category === 'Belanja Modal / Aset') {
      modalRp += item.total;
      modalCount++;
    } else if (item.category === 'Belanja Buku') {
      bukuRp += item.total;
      bukuCount++;
    } else if (item.category === 'Belanja Operasional (Barang)') {
      opRp += item.total;
      opCount++;
    }
  });

  const invStatTotalItems = document.getElementById('invStatTotalItems');
  const invStatTotalRp = document.getElementById('invStatTotalRp');
  const invStatModalRp = document.getElementById('invStatModalRp');
  const invStatModalCount = document.getElementById('invStatModalCount');
  const invStatBukuRp = document.getElementById('invStatBukuRp');
  const invStatBukuCount = document.getElementById('invStatBukuCount');
  const invStatOperasionalRp = document.getElementById('invStatOperasionalRp');
  const invStatOpCount = document.getElementById('invStatOpCount');

  if (invStatTotalItems) invStatTotalItems.textContent = `${totalCount} Item`;
  if (invStatTotalRp) invStatTotalRp.textContent = formatIDR(totalRp);
  if (invStatModalRp) invStatModalRp.textContent = formatIDR(modalRp);
  if (invStatModalCount) invStatModalCount.textContent = `${modalCount} Item Aset`;
  if (invStatBukuRp) invStatBukuRp.textContent = formatIDR(bukuRp);
  if (invStatBukuCount) invStatBukuCount.textContent = `${bukuCount} Item Buku`;
  if (invStatOperasionalRp) invStatOperasionalRp.textContent = formatIDR(opRp);
  if (invStatOpCount) invStatOpCount.textContent = `${opCount} Item Barang Habis Pakai`;

  // Apply filters
  const selectedUnit = unitFilterEl ? unitFilterEl.value : 'all';
  const selectedCat = catFilterEl ? catFilterEl.value : 'all';
  const selectedBulan = bulanFilterEl ? bulanFilterEl.value : 'all';
  const searchQuery = searchEl ? searchEl.value.trim().toLowerCase() : '';

  const filteredItems = allItems.filter(item => {
    if (selectedUnit !== 'all' && item.unitName !== selectedUnit) return false;
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    if (selectedBulan !== 'all' && item.targetMonth !== selectedBulan) return false;
    if (searchQuery) {
      const matchDesc = item.desc.toLowerCase().includes(searchQuery);
      const matchInvoice = item.invoice.toLowerCase().includes(searchQuery);
      const matchUnit = item.unitName.toLowerCase().includes(searchQuery);
      if (!matchDesc && !matchInvoice && !matchUnit) return false;
    }
    return true;
  });

  const countBadge = document.getElementById('invTableCountBadge');
  if (countBadge) countBadge.textContent = `${filteredItems.length} items`;

  if (filteredItems.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <div style="font-weight: 600;">Tidak ada data inventaris realisasi yang cocok.</div>
          <div style="font-size: 0.82rem; margin-top: 4px;">Coba ubah filter atau pastikan transaksi sudah direalisasikan di menu Realisasi & Transaksi.</div>
        </td>
      </tr>
    `;
    const tableFoot = document.getElementById('inventarisTableFoot');
    if (tableFoot) tableFoot.innerHTML = '';
    return;
  }

  let html = '';
  let filteredSum = 0;

  filteredItems.forEach((item, idx) => {
    filteredSum += item.total;
    
    let catBadgeColor = '#6366f1';
    let catBgColor = 'rgba(99, 102, 241, 0.1)';
    let catIcon = '📦';

    if (item.category === 'Belanja Modal / Aset') {
      catBadgeColor = '#ec4899';
      catBgColor = 'rgba(236, 72, 153, 0.1)';
      catIcon = '💻';
    } else if (item.category === 'Belanja Buku') {
      catBadgeColor = '#3b82f6';
      catBgColor = 'rgba(59, 130, 246, 0.1)';
      catIcon = '📚';
    } else if (item.category === 'Belanja Operasional (Barang)') {
      catBadgeColor = '#d97706';
      catBgColor = 'rgba(245, 158, 11, 0.1)';
      catIcon = '🧹';
    }

    const formatQty = item.qty.toLocaleString('id-ID');

    html += `
      <tr style="border-bottom: 1px solid var(--glass-border); transition: background 0.15s ease;">
        <td style="padding: 10px 14px; text-align: center; font-weight: 600; color: var(--text-muted);">${idx + 1}</td>
        <td style="padding: 10px 14px; font-weight: 600; white-space: nowrap;">
          <span style="font-size: 0.85rem; color: #047857; background: rgba(16,185,129,0.1); padding: 3px 8px; border-radius: 6px; font-weight: 700;">
            📅 ${item.tgl}
          </span>
        </td>
        <td style="padding: 10px 14px;">
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.92rem;">${item.desc}</div>
          ${item.note ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Note: ${item.note}</div>` : ''}
        </td>
        <td style="padding: 10px 14px; text-align: center;">
          <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.78rem; font-weight: 700; color: ${catBadgeColor}; background: ${catBgColor}; padding: 4px 10px; border-radius: 6px; white-space: nowrap;">
            <span>${catIcon}</span> ${item.category}
          </span>
        </td>
        <td style="padding: 10px 14px; font-weight: 600; font-size: 0.88rem; color: var(--text-main);">${item.unitName}</td>
        <td style="padding: 10px 14px; text-align: center; font-weight: 700; font-size: 0.88rem; white-space: nowrap;">${formatQty} ${item.satuan}</td>
        <td style="padding: 10px 14px; text-align: right; font-weight: 600; font-size: 0.88rem; white-space: nowrap; color: var(--text-muted);">${formatIDR(item.harga)}</td>
        <td style="padding: 10px 14px; text-align: right; font-weight: 800; font-size: 0.92rem; white-space: nowrap; color: #059669;">${formatIDR(item.total)}</td>
        <td style="padding: 10px 14px; font-size: 0.82rem; color: var(--text-muted);">
          <div style="font-weight: 600; color: var(--text-main); font-family: monospace;">${item.invoice}</div>
          ${item.link ? `<a href="${item.link}" target="_blank" style="color: var(--accent-primary); text-decoration: underline; font-size: 0.75rem; margin-top: 2px; display: inline-block;">🔗 Dokumen</a>` : ''}
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;

  const tableFoot = document.getElementById('inventarisTableFoot');
  if (tableFoot) {
    tableFoot.innerHTML = `
      <tr style="border-top: 2px solid var(--accent-primary);">
        <td colspan="7" style="padding: 14px; text-align: right; font-weight: 800; font-size: 0.95rem; color: var(--text-main);">
          TOTAL REALISASI INVENTARIS (${filteredItems.length} ITEM):
        </td>
        <td style="padding: 14px; text-align: right; font-weight: 900; font-size: 1.05rem; color: #047857; white-space: nowrap;">
          ${formatIDR(filteredSum)}
        </td>
        <td></td>
      </tr>
    `;
  }
}

window.renderInventarisirPage = renderInventarisirPage;

window.exportInventarisToCSV = function() {
  const items = getInventarisirRealizedItems();
  if (items.length === 0) {
    alert('Tidak ada data inventaris untuk diekspor.');
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  csvContent += "No,Tanggal Realisasi,Nama Barang,Kategori,Unit,Volume,Satuan,Harga Satuan (Rp),Total (Rp),Invoice\n";

  items.forEach((item, idx) => {
    const descEsc = `"${item.desc.replace(/"/g, '""')}"`;
    const catEsc = `"${item.category}"`;
    const unitEsc = `"${item.unitName}"`;
    const invEsc = `"${item.invoice}"`;
    csvContent += `${idx + 1},${item.tgl},${descEsc},${catEsc},${unitEsc},${item.qty},${item.satuan},${item.harga},${item.total},${invEsc}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Inventarisir_BOS_${currentBospYear}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

window.printInventarisirReport = function() {
  window.print();
};

// Event Listeners for Inventarisir Filters & Actions
document.addEventListener('DOMContentLoaded', () => {
  const filterUnit = document.getElementById('filterInvUnit');
  const filterCat = document.getElementById('filterInvKategori');
  const filterBulan = document.getElementById('filterInvBulan');
  const filterSearch = document.getElementById('filterInvSearch');
  const btnReset = document.getElementById('btnResetInvFilter');
  const btnExport = document.getElementById('btnExportInventarisCSV');
  const btnPrint = document.getElementById('btnPrintInventaris');

  if (filterUnit) filterUnit.addEventListener('change', renderInventarisirPage);
  if (filterCat) filterCat.addEventListener('change', renderInventarisirPage);
  if (filterBulan) filterBulan.addEventListener('change', renderInventarisirPage);
  if (filterSearch) filterSearch.addEventListener('input', renderInventarisirPage);

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (filterUnit) filterUnit.value = 'all';
      if (filterCat) filterCat.value = 'all';
      if (filterBulan) filterBulan.value = 'all';
      if (filterSearch) filterSearch.value = '';
      renderInventarisirPage();
    });
  }

  if (btnExport) btnExport.addEventListener('click', window.exportInventarisToCSV);
  if (btnPrint) btnPrint.addEventListener('click', window.printInventarisirReport);
});


