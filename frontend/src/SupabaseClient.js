import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'SUPABASE_URL';
const supabaseAnonKey = 'PUBLIC_ANON_KEY'; // Safe to use in Frontend

export const supabase = createClient(supabaseUrl, supabaseAnonKey);