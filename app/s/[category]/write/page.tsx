import WriteForm from '@/components/WriteForm';
import { createClient } from '@/utils/supabase/server';


export default async function WritePage({
  params
}: {
  params: Promise<{ category: string }>
}) {
  const { category: encodedCategory } = await params;
  const category = decodeURIComponent(encodedCategory);

  const supabase = await createClient();

  // spaces 테이블에서 카테고리 목록 조회
  const [
    { data: spacesData },
    { data: { user } },
  ] = await Promise.all([
    supabase.from('spaces').select('slug, name').order('slug'),
    supabase.auth.getUser(),
  ]);

  const categories = (spacesData || []).map(s => s.slug);

  let nickname = '';
  let isLoggedIn = false;
  if (user) {
    isLoggedIn = true;
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
        defaultCategory={category}
        initialNickname={nickname}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
