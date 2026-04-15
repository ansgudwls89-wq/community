'use server';

import { supabase } from '@/utils/supabase';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

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

  const supabaseClient = await createClient();
  const { data: { user } } = await supabaseClient.auth.getUser();

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

  // 3. 에너지 지급 (로그인한 경우에만)
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('energy')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      await supabase
        .from('profiles')
        .update({ energy: (profile.energy || 0) + 10 }) // 글 작성 시 에너지 10 지급
        .eq('id', user.id);
    }
  }

  revalidatePath('/');
  revalidatePath(`/s/${encodeURIComponent(category)}`);
  
  return newPost;
}
