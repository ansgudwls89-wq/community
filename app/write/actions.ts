'use server';

import { supabase } from '@/utils/supabase';
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
        has_image: content.includes('<img'), // 간이 이미지 포함 여부 체크
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

  revalidatePath('/');
  revalidatePath(`/space/${encodeURIComponent(category)}`);
  
  return newPost;
}
