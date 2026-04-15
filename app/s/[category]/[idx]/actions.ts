'use server';

import { supabase } from '@/utils/supabase';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function createCommentAction(data: {
  postId: number;
  content: string;
  author: string;
  parentId?: number | null;
  isAnonymous?: boolean;
}) {
  const { postId, content, author, parentId, isAnonymous } = data;

  if (!postId || !content) {
    throw new Error('내용을 입력해 주세요.');
  }

  const supabaseClient = await createClient();
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요한 서비스입니다.');
  }

  // Get IP address
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  const { data: newComment, error } = await supabase
    .from('comments')
    .insert([
      { 
        post_id: postId, 
        content, 
        author: author || '익명',
        parent_id: parentId || null,
        is_anonymous: isAnonymous || false,
        ip_address: ip
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('댓글 작성 중 에러 발생:', error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/s/[category]/[idx]`, 'page');
  
  return newComment;
}
