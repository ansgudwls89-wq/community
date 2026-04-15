'use server';

import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

export async function createCommentAction(data: {
  postId: number;
  content: string;
  author: string;
}) {
  const { postId, content, author } = data;

  if (!postId || !content) {
    throw new Error('내용을 입력해 주세요.');
  }

  const { data: newComment, error } = await supabase
    .from('comments')
    .insert([
      { 
        post_id: postId, 
        content, 
        author: author || '익명'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('댓글 작성 중 에러 발생:', error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/post/${postId}`);
  
  return newComment;
}
