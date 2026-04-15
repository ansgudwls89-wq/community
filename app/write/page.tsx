import { supabase as supabaseAdmin } from '@/utils/supabase';
import WriteForm from '@/components/WriteForm';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function WritePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: defaultCategory } = await searchParams;

  // Fetch current categories from database for the select options
  const { data: postsData } = await supabaseAdmin.from('posts').select('category');
  const categories = Array.from(new Set(postsData?.map(p => p.category) || []));

  // Fetch user profile for nickname
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let nickname = '';
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', user.id)
      .single();
    nickname = profile?.nickname || '';
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <WriteForm 
        categories={categories} 
        defaultCategory={defaultCategory} 
        initialNickname={nickname}
      />
    </div>
  );
}
