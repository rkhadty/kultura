import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getUserRole = (user) => {
  const role = String(user?.app_metadata?.role || user?.user_metadata?.role || '').toLowerCase();
  return role === 'admin' || role === 'administrator' ? 'admin' : 'siswa';
};

export const isAdmin = (user) => getUserRole(user) === 'admin';

export const getUserDisplayName = (user) =>
  user?.user_metadata?.full_name ||
  user?.user_metadata?.name ||
  user?.email?.split('@')[0] ||
  'Pengguna';