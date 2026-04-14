import { createClient } from '@supabase/supabase-js';

// .env.local에서 가져오는 환경 변수는 NEXT_PUBLIC_ 접두사가 있어야 브라우저/서버 모두에서 안전하게 읽힙니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
