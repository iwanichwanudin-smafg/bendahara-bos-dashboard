// =========================================================
// AUTH — login Supabase Auth + pengecekan peran
//
// Peran (tabel akses_pengguna):
//   bendahara -> boleh melihat dan mengubah data
//   kepsek / pembaca -> hanya boleh melihat
// Pengguna yang berhasil login tetapi tidak terdaftar di akses_pengguna
// tidak mendapat akses apa pun (RLS di database menolak semuanya).
// =========================================================
import { supabase, configOk } from './supabaseClient.js';

const STYLE_ID = 'auth-style';

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const css = `
  .auth-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%);padding:20px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
  .auth-card{background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.35);width:100%;max-width:400px;padding:32px 28px}
  .auth-logo{width:52px;height:52px;border-radius:14px;background:#1d4ed8;color:#fff;font-weight:800;font-size:1.6rem;
    display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
  .auth-card h1{margin:0 0 4px;text-align:center;font-size:1.35rem;color:#0f172a}
  .auth-card p.sub{margin:0 0 22px;text-align:center;font-size:.85rem;color:#64748b}
  .auth-card label{display:block;font-size:.8rem;font-weight:600;color:#334155;margin:0 0 6px}
  .auth-card input{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #cbd5e1;border-radius:9px;font-size:.95rem;margin-bottom:14px}
  .auth-card input:focus{outline:2px solid #3b82f6;outline-offset:1px;border-color:#3b82f6}
  .auth-card button.primary{width:100%;padding:12px;border:0;border-radius:9px;background:#1d4ed8;color:#fff;font-weight:700;font-size:.95rem;cursor:pointer}
  .auth-card button.primary:disabled{opacity:.6;cursor:wait}
  .auth-card button.link{background:none;border:0;color:#1d4ed8;font-size:.85rem;cursor:pointer;margin-top:12px;width:100%}
  .auth-error{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:9px;padding:10px 12px;font-size:.85rem;margin-bottom:14px}
  .auth-note{font-size:.78rem;color:#94a3b8;text-align:center;margin-top:16px}
  .auth-user-card{display:block;box-sizing:border-box;width:100%;margin-top:10px;padding:8px 10px;border-radius:10px;
    background:#eef2ff;border:1px solid #c7d2fe;color:#1e293b;font-size:.74rem;line-height:1.35}
  .auth-user-card .auth-who{display:block;font-weight:700;overflow-wrap:anywhere;word-break:normal}
  .auth-user-card .auth-row{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:4px}
  .auth-user-card .auth-role{display:inline-block;padding:1px 8px;border-radius:999px;background:#1d4ed8;color:#fff;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
  .auth-user-card .auth-sync{display:block;margin-top:4px;font-size:.7rem;color:#475569}
  .auth-user-card .auth-logout{display:block;width:100%;margin-top:6px;padding:5px;border-radius:8px;border:1px solid #94a3b8;background:#fff;color:#334155;cursor:pointer;font-size:.74rem}
  .auth-user-card .auth-logout:hover{background:#f1f5f9}
  .readonly-banner{background:#fef3c7;color:#92400e;border-bottom:1px solid #fde68a;padding:8px 16px;font-size:.82rem;text-align:center}
  `;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = css;
  document.head.appendChild(el);
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) node.appendChild(c);
  return node;
}

function overlay(card) {
  injectStyle();
  const old = document.getElementById('authOverlay');
  if (old) old.remove();
  const root = el('div', { class: 'auth-overlay', id: 'authOverlay' }, [card]);
  document.body.appendChild(root);
  return root;
}

function header(title, subtitle) {
  return [
    el('div', { class: 'auth-logo', text: 'B' }),
    el('h1', { text: title }),
    el('p', { class: 'sub', text: subtitle })
  ];
}

export function showFatal(title, message) {
  overlay(el('div', { class: 'auth-card' }, [...header(title, 'SMAS Future Gate'), el('div', { class: 'auth-error', text: message })]));
}

async function fetchProfile() {
  const { data, error } = await supabase.from('akses_pengguna').select('peran,nama').limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return data; // null jika email tidak terdaftar
}

export async function logout() {
  try {
    await supabase.auth.signOut();
  } finally {
    window.location.reload();
  }
}

function showNotRegistered(email) {
  const btn = el('button', { class: 'primary', type: 'button', text: 'Keluar' });
  btn.addEventListener('click', logout);
  overlay(
    el('div', { class: 'auth-card' }, [
      ...header('Akun belum terdaftar', 'Login berhasil, tetapi akses belum diberikan'),
      el('div', { class: 'auth-error', text: `Akun ${email} belum didaftarkan sebagai pengguna aplikasi ini. Hubungi Bendahara untuk meminta akses.` }),
      btn
    ])
  );
}

function showLogin(onSuccess) {
  const errBox = el('div', { class: 'auth-error', style: 'display:none' });
  const email = el('input', { type: 'email', id: 'authEmail', autocomplete: 'username', required: '', placeholder: 'nama@smafg.sch.id' });
  const pass = el('input', { type: 'password', id: 'authPass', autocomplete: 'current-password', required: '', placeholder: '••••••••' });
  const submit = el('button', { class: 'primary', type: 'submit', text: 'Masuk' });
  const form = el('form', {}, [
    errBox,
    el('label', { for: 'authEmail', text: 'Email' }), email,
    el('label', { for: 'authPass', text: 'Password' }), pass,
    submit
  ]);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.style.display = 'none';
    submit.disabled = true;
    submit.textContent = 'Memeriksa...';
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value.trim().toLowerCase(),
      password: pass.value
    });
    pass.value = '';
    submit.disabled = false;
    submit.textContent = 'Masuk';
    if (error) {
      errBox.textContent = 'Email atau password salah.';
      errBox.style.display = 'block';
      return;
    }
    onSuccess();
  });

  overlay(
    el('div', { class: 'auth-card' }, [
      ...header('BOSku', 'Dashboard Bendahara BOS — SMAS Future Gate'),
      form,
      el('div', { class: 'auth-note', text: 'Khusus pengguna terdaftar. Lupa password? Hubungi Bendahara.' })
    ])
  );
  email.focus();
}

/**
 * Menahan aplikasi sampai pengguna login dan terdaftar.
 * Resolve: { user, peran, nama, canWrite }
 */
export function requireLogin() {
  return new Promise((resolve) => {
    if (!configOk) {
      showFatal(
        'Konfigurasi belum lengkap',
        'Environment variable VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY belum dipasang pada deployment ini.'
      );
      return; // sengaja tidak resolve: aplikasi tidak boleh jalan tanpa konfigurasi
    }

    const proceed = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!user) return showLogin(proceed);
        const profile = await fetchProfile();
        if (!profile) return showNotRegistered(user.email);
        document.getElementById('authOverlay')?.remove();
        document.body.classList.add('auth-ok');
        resolve({ user, peran: profile.peran, nama: profile.nama || user.email, canWrite: profile.peran === 'bendahara' });
      } catch (err) {
        console.error(err);
        showFatal('Gagal memeriksa akun', err.message);
      }
    };

    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') window.location.reload();
    });

    proceed();
  });
}

const PERAN_LABEL = { bendahara: 'Bendahara', kepsek: 'Kepala Sekolah', pembaca: 'Pembaca' };

export function titleCase(text) {
  const t = String(text || '').trim();
  if (!t) return t;
  // Nama yang ditulis HURUF BESAR semua diubah menjadi huruf kapital di awal kata saja
  if (t !== t.toUpperCase()) return t;
  return t.toLowerCase().replace(/(^|[\s.'-])([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

export function initials(text) {
  const parts = String(text || '').split(/[\s.]+/).filter(Boolean);
  const letters = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  return (letters || '?').toUpperCase();
}

/** Perbarui kotak profil di header agar menampilkan akun yang sedang login. */
function updateTopbarProfile(session) {
  const card = document.querySelector('.topbar-right .user-badge');
  if (!card) return;
  const nama = titleCase(session.nama);
  const avatar = card.querySelector('.user-avatar');
  const name = card.querySelector('.user-name');
  const role = card.querySelector('.user-role');
  if (avatar) avatar.textContent = initials(nama);
  if (name) name.textContent = nama;
  if (role) role.textContent = (PERAN_LABEL[session.peran] || session.peran) + ' — SMAS FG';
}

/** Badge pengguna + tombol keluar di sidebar; mengembalikan fungsi untuk memperbarui status simpan. */
export function mountUserBadge(session) {
  injectStyle();
  const footer = document.querySelector('.sidebar-footer');
  const syncLine = el('span', { class: 'auth-sync', text: session.canWrite ? 'Tersimpan' : 'Mode lihat saja' });
  const logoutBtn = el('button', { type: 'button', class: 'auth-logout', text: 'Keluar' });
  logoutBtn.addEventListener('click', logout);
  const badge = el('div', { class: 'auth-user-card' }, [
    el('span', { class: 'auth-who', text: session.user.email }),
    el('div', { class: 'auth-row' }, [
      el('span', { class: 'auth-role', text: PERAN_LABEL[session.peran] || session.peran })
    ]),
    syncLine,
    logoutBtn
  ]);
  (footer || document.body).appendChild(badge);
  updateTopbarProfile(session);

  if (!session.canWrite) {
    const banner = el('div', { class: 'readonly-banner', text: 'Akun Anda hanya dapat melihat data. Perubahan tidak akan disimpan.' });
    document.body.prepend(banner);
  }

  return (status, message) => {
    if (!session.canWrite) return;
    const map = {
      saving: 'Menyimpan…',
      saved: '✓ Tersimpan di server',
      error: '⚠ Gagal menyimpan: ' + (message || 'periksa koneksi')
    };
    syncLine.textContent = map[status] || '';
  };
}
