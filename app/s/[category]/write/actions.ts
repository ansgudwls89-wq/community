'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getAuthorNickname() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', user.id).single();
  return { supabase, user, nickname: profile?.nickname || '' };
}

export async function updatePostAction(data: {
  postId: number;
  category: string;
  idx: number;
  title: string;
  content: string;
}): Promise<{ redirectTo: string }> {
  const auth = await getAuthorNickname();
  if (!auth) throw new Error('로그인이 필요한 서비스입니다.');
  const { supabase, nickname } = auth;

  const { data: post } = await supabase
    .from('posts')
    .select('author')
    .eq('id', data.postId)
    .single();

  if (!post || post.author !== nickname) throw new Error('수정 권한이 없습니다.');

  const { error } = await supabase
    .from('posts')
    .update({ title: data.title, content: data.content, has_image: data.content.includes('<img') })
    .eq('id', data.postId);

  if (error) throw new Error(error.message);

  revalidatePath(`/s/${encodeURIComponent(data.category)}/${data.idx}`, 'page');
  return { redirectTo: `/s/${encodeURIComponent(data.category)}/${data.idx}` };
}

export async function deletePostAction(postId: number, category: string): Promise<{ redirectTo: string }> {
  const auth = await getAuthorNickname();
  if (!auth) throw new Error('로그인이 필요한 서비스입니다.');
  const { supabase, nickname } = auth;

  const { data: post } = await supabase
    .from('posts')
    .select('author')
    .eq('id', postId)
    .single();

  if (!post || post.author !== nickname) throw new Error('삭제 권한이 없습니다.');

  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw new Error(error.message);

  revalidatePath(`/s/${encodeURIComponent(category)}`, 'page');
  return { redirectTo: `/s/${encodeURIComponent(category)}` };
}

export async function createPostAction(data: {
  title: string;
  category: string;
  content: string;
}): Promise<{ redirectTo: string }> {
  const { title, category, content } = data;

  if (!title || !category || !content) {
    throw new Error('필수 입력 항목이 누락되었습니다.');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('로그인이 필요한 서비스입니다.');

  // 프로필 + idx를 병렬로 조회
  const [{ data: profileData }, { data: idxData }] = await Promise.all([
    supabase.from('profiles').select('nickname, energy').eq('id', user.id).single(),
    supabase.rpc('get_next_idx', { p_category: category }),
  ]);

  const author = profileData?.nickname || '익명';
  const nextIdx = idxData ?? 1;

  const { data: newPost, error } = await supabase
    .from('posts')
    .insert([{
      title,
      category,
      content,
      author,
      idx: nextIdx,
      has_image: content.includes('<img'),
      comments_count: 0,
      likes: 0,
      views: 0,
    }])
    .select('idx')
    .single();

  if (error) throw new Error(error.message);

  // 에너지 지급 (비동기, 실패해도 글 작성 성공)
  supabase.from('profiles')
    .update({ energy: (profileData?.energy || 0) + 10 })
    .eq('id', user.id)
    .then(() => {});

  revalidatePath(`/s/${encodeURIComponent(category)}`, 'page');

  return { redirectTo: `/s/${encodeURIComponent(category)}/${newPost.idx}` };
}
