import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tpzzcirpbwajbuvhzaiz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Q4UcyPcC358nFWh8ZJCx4g_mHmms6WW';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);