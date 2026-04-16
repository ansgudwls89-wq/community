'use server';

import { createClient } from '@/utils/supabase/server';

async function getAdminClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) throw new Error('관리자 권한이 필요합니다.');
  return supabase;
}

export async function syncSpacesFromPosts() {
  const supabase = await getAdminClient();

  const { data: posts, error } = await supabase.from('posts').select('category');
  if (error) return { error: error.message };

  const slugs = [...new Set((posts || []).map(p => p.category).filter(Boolean))];
  const rows = slugs.map(slug => ({ slug, name: slug }));

  const { error: upsertError } = await supabase
    .from('spaces')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: true });

  return { error: upsertError?.message || null, count: rows.length };
}

export async function renameSpace(slug: string, name: string) {
  const supabase = await getAdminClient();
  const { error } = await supabase.from('spaces').update({ name }).eq('slug', slug);
  return { error: error?.message || null };
}

export async function deleteSpace(slug: string) {
  const supabase = await getAdminClient();
  await supabase.from('posts').delete().eq('category', slug);
  await supabase.from('spaces').delete().eq('slug', slug);
  return { error: null };
}

export async function updateReportStatus(id: number, status: 'resolved' | 'dismissed') {
  const supabase = await getAdminClient();
  const { error } = await supabase.from('reports').update({ status }).eq('id', id);
  return { error: error?.message || null };
}

export async function deleteReportedContent(targetType: 'post' | 'comment', targetId: number, reportId: number) {
  const supabase = await getAdminClient();
  if (targetType === 'post') {
    await supabase.from('posts').delete().eq('id', targetId);
  } else {
    await supabase.from('comments').delete().eq('id', targetId);
  }
  await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId);
  return { error: null };
}

export async function createSpace(slug: string, name: string) {
  const supabase = await getAdminClient();

  const { error: spaceError } = await supabase
    .from('spaces')
    .upsert({ slug, name }, { onConflict: 'slug' });
  if (spaceError) return { error: spaceError.message };

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
