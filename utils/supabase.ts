import { createClient } from '@supabase/supabase-js';

// NEXT_PUBLIC_ 접두사가 붙은 환경 변수를 가져옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 빌드 시점에 환경 변수가 없어도 에러가 나지 않도록 처리합니다.
// 실제 런타임에 변수가 없다면 데이터 페칭 시점에 에러가 발생하며, 이는 page.tsx에서 처리됩니다.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
