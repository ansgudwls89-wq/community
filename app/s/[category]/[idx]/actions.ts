'use server';

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

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요한 서비스입니다.');
  }

  // Get IP address safely
  let ip = '127.0.0.1';
  try {
    const headerList = await headers();
    ip = headerList.get('x-forwarded-for')?.split(',')[0] || headerList.get('x-real-ip') || '127.0.0.1';
  } catch (e) {
    console.error('Failed to get headers:', e);
  }

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

  // Revalidate the entire site to update counts, or specific paths if needed
  revalidatePath('/', 'layout');

  return newComment;
}

export async function updateCommentAction(commentId: number, content: string) {
  if (!content.trim()) throw new Error('내용을 입력해 주세요.');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', user.id).single();

  const { data: comment } = await supabase.from('comments').select('author').eq('id', commentId).single();
  if (!comment || comment.author !== profile?.nickname) throw new Error('수정 권한이 없습니다.');

  const { error } = await supabase.from('comments').update({ content: content.trim() }).eq('id', commentId);
  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
}

export async function deleteCommentAction(commentId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', user.id).single();

  const { data: comment } = await supabase.from('comments').select('author').eq('id', commentId).single();
  if (!comment || comment.author !== profile?.nickname) throw new Error('삭제 권한이 없습니다.');

  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
}
