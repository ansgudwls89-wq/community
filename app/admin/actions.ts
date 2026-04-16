'use server';

import { createAdminClient } from '@/utils/supabase/admin';

// posts 카테고리 → spaces 테이블 동기화 (서비스 롤 키 사용)
export async function syncSpacesFromPosts() {
  const supabase = createAdminClient();

  const { data: posts, error } = await supabase
    .from('posts')
    .select('category');

  if (error) return { error: error.message };

  const slugs = [...new Set((posts || []).map(p => p.category).filter(Boolean))];
  const rows = slugs.map(slug => ({ slug, name: slug }));

  const { error: upsertError } = await supabase
    .from('spaces')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: true });

  return { error: upsertError?.message || null, count: rows.length };
}

export async function renameSpace(slug: string, name: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('spaces')
    .update({ name })
    .eq('slug', slug);
  return { error: error?.message || null };
}

export async function deleteSpace(slug: string) {
  const supabase = createAdminClient();
  await supabase.from('posts').delete().eq('category', slug);
  await supabase.from('spaces').delete().eq('slug', slug);
  return { error: null };
}

export async function createSpace(slug: string, name: string) {
  const supabase = createAdminClient();

  const { error: spaceError } = await supabase
    .from('spaces')
    .upsert({ slug, name }, { onConflict: 'slug' });
  if (spaceError) return { error: spaceError.message };

  // 최대 idx 조회
  const { data: existing } = await supabase
    .from('posts')
    .select('idx')
    .eq('category', slug)
    .order('idx', { ascending: false })
    .limit(1);

  const nextIdx = (existing?.[0]?.idx ?? 0) + 1;

  const { error: postError } = await supabase.from('posts').insert([{
    title: `${name} 스페이스가 생성되었습니다.`,
    category: slug,
    content: '새로운 스페이스의 시작을 축하합니다!',
    author: '시스템',
    idx: nextIdx,
    views: 0,
    likes: 0,
    comments_count: 0,
  }]);

  return { error: postError?.message || null };
}
