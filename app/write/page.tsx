import { supabase } from '@/utils/supabase';
import WriteForm from '@/components/WriteForm';

export const dynamic = 'force-dynamic';

export default async function WritePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: defaultCategory } = await searchParams;

  // Fetch current categories from database for the select options
  const { data: postsData } = await supabase.from('posts').select('category');
  const categories = Array.from(new Set(postsData?.map(p => p.category) || []));

  return (
    <div className="w-full max-w-4xl mx-auto">
      <WriteForm categories={categories} defaultCategory={defaultCategory} />
    </div>
  );
}
