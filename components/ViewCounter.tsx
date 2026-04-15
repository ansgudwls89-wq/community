'use client';

import { supabase } from '@/utils/supabase';
import { useEffect } from 'react';

interface ViewCounterProps {
  postId: number;
}

export default function ViewCounter({ postId }: ViewCounterProps) {
  useEffect(() => {
    const incrementView = async () => {
      // 세션 스토리지 체크 (브라우저 탭 세션 동안 중복 방지)
      const storageKey = `viewed_post_${postId}`;
      const hasViewed = sessionStorage.getItem(storageKey);

      if (!hasViewed) {
        const { error } = await supabase.rpc('increment_views', { post_id: postId });
        if (!error) {
          sessionStorage.setItem(storageKey, 'true');
        } else {
          // RPC 실패 시 수동 업데이트 시도 (상세 페이지 로직과 동일)
          console.error('RPC Error (Views):', error.message);
          const { data: currentData } = await supabase.from('posts').select('views').eq('id', postId).single();
          if (currentData) {
            await supabase.from('posts').update({ views: (currentData.views || 0) + 1 }).eq('id', postId);
            sessionStorage.setItem(storageKey, 'true');
          }
        }
      }
    };

    incrementView();
  }, [postId]);

  return null; // 화면에 렌더링할 필요 없음
}
