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
}) {
  const auth = await getAuthorNickname();
  if (!auth) throw new Error('로그인이 필요한 서비스입니다.');
  const { supabase, nickname } = auth;

  const { data: post } = await supabase
    .from('posts')
    .select('author')
    .eq('id', data.postId)
    .single();

  if (!post || post.author !== nickname) {
    throw new Error('수정 권한이 없습니다.');
  }

  const { error } = await supabase
    .from('posts')
    .update({ title: data.title, content: data.content, has_image: data.content.includes('<img') })
    .eq('id', data.postId);

  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
  redirect(`/s/${encodeURIComponent(data.category)}/${data.idx}`);
}

export async function deletePostAction(postId: number, category: string) {
  const auth = await getAuthorNickname();
  if (!auth) throw new Error('로그인이 필요한 서비스입니다.');
  const { supabase, nickname } = auth;

  const { data: post } = await supabase
    .from('posts')
    .select('author')
    .eq('id', postId)
    .single();

  if (!post || post.author !== nickname) {
    throw new Error('삭제 권한이 없습니다.');
  }

  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
  redirect(`/s/${encodeURIComponent(category)}`);
}

export async function createPostAction(data: {
  title: string;
  category: string;
  content: string;
  author: string;
}) {
  const { title, category, content, author } = data;

  if (!title || !category || !content) {
    throw new Error('필수 입력 항목이 누락되었습니다.');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요한 서비스입니다.');
  }

  // 1. 해당 카테고리의 마지막 idx 가져오기
  const { data: lastPost } = await supabase
    .from('posts')
    .select('idx')
    .eq('category', category)
    .order('idx', { ascending: false })
    .limit(1);
  
  const nextIdx = (lastPost?.[0]?.idx || 0) + 1;

  // 2. Supabase에 데이터 삽입
  const { data: newPost, error } = await supabase
    .from('posts')
    .insert([
      { 
        title, 
        category, 
        content, 
        author: author || '익명',
        idx: nextIdx,
        has_image: content.includes('<img'),
        comments_count: 0,
        likes: 0,
        views: 0
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('글 작성 중 에러 발생:', error.message);
    throw new Error(error.message);
  }

  // 3. 에너지 지급
  const { data: profile } = await supabase
    .from('profiles')
    .select('energy')
    .eq('id', user.id)
    .single();
  
  if (profile) {
    await supabase
      .from('profiles')
      .update({ energy: (profile.energy || 0) + 10 })
      .eq('id', user.id);
  }

  revalidatePath('/', 'layout');
  
  redirect(`/s/${encodeURIComponent(category)}/${newPost.idx}`);
}
