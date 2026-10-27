// Format Helper Utilities

export function formatRupiah(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return 'Rp ' + Number(amount).toLocaleString('id-ID');
}

export function formatNumber(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  return Number(amount).toLocaleString('id-ID');
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

// Fungsi Terbilang Bahasa Indonesia Resmi untuk Dokumen SI Bank
export function terbilang(angka) {
  angka = Math.floor(Math.abs(Number(angka)));
  if (angka === 0) return 'Nol Rupiah';

  const bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];

  function convert(n) {
    if (n < 12) {
      return bilangan[n];
    } else if (n < 20) {
      return convert(n - 10) + ' Belas';
    } else if (n < 100) {
      return convert(Math.floor(n / 10)) + ' Puluh ' + convert(n % 10);
    } else if (n < 200) {
      return 'Seratus ' + convert(n - 100);
    } else if (n < 1000) {
      return convert(Math.floor(n / 100)) + ' Ratus ' + convert(n % 100);
    } else if (n < 2000) {
      return 'Seribu ' + convert(n - 1000);
    } else if (n < 1000000) {
      return convert(Math.floor(n / 1000)) + ' Ribu ' + convert(n % 1000);
    } else if (n < 1000000000) {
      return convert(Math.floor(n / 1000000)) + ' Juta ' + convert(n % 1000000);
    } else if (n < 1000000000000) {
      return convert(Math.floor(n / 1000000000)) + ' Miliar ' + convert(n % 1000000000);
    } else {
      return convert(Math.floor(n / 1000000000000)) + ' Triliun ' + convert(n % 1000000000000);
    }
  }

  const result = convert(angka).replace(/\s+/g, ' ').trim();
  return result + ' Rupiah';
}
