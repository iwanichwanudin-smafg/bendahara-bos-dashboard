// =========================================================
// SUPABASE CLIENT
// Konfigurasi dibaca dari environment variable (diatur di Vercel):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_PUBLISHABLE_KEY
// Kunci "publishable" memang dirancang publik; keamanan data dijaga
// oleh login + Row Level Security (RLS) di database.
// JANGAN PERNAH memasukkan service_role key ke aplikasi ini.
// =========================================================
import { createClient } from '@supabase/supabase-js';

// `import.meta.env` hanya ada saat dijalankan lewat Vite; di Node (test) nilainya kosong.
const env = import.meta.env ?? {};
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const configOk = Boolean(url && key);

export const supabase = configOk
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    })
  : null;
