'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateNicknameAction(nickname: string) {
  if (!nickname || nickname.trim().length < 2) {
    return { error: '닉네임은 2자 이상이어야 합니다.' };
  }
  if (nickname.trim().length > 20) {
    return { error: '닉네임은 20자 이하여야 합니다.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  // 닉네임 중복 확인
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname.trim())
    .neq('id', user.id)
    .single();

  if (existing) {
    return { error: '이미 사용 중인 닉네임입니다.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ nickname: nickname.trim(), updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) {
    return { error: '닉네임 변경에 실패했습니다.' };
  }

  revalidatePath('/profile');
  revalidatePath('/', 'layout');
  return { success: true };
}
