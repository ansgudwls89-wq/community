'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface BookmarkButtonProps {
  postId: number;
  title: string;
  category: string;
  idx: number;
}

const STORAGE_KEY = 'nol2_bookmarks';

export default function BookmarkButton({ postId, title, category, idx }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', postId)
          .maybeSingle();
        setBookmarked(!!data);
      } else {
        // 비로그인: localStorage fallback
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          setBookmarked(saved.some((b: any) => b.postId === postId));
        } catch {}
      }
    }
    init();
  }, [postId]);

  async function toggle() {
    if (userId) {
      // 로그인: DB 저장
      if (bookmarked) {
        await supabase.from('bookmarks').delete().eq('user_id', userId).eq('post_id', postId);
        setBookmarked(false);
        toast('북마크가 해제되었습니다.');
      } else {
        await supabase.from('bookmarks').insert({ user_id: userId, post_id: postId });
        setBookmarked(true);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);
        toast.success('북마크에 저장했습니다.');
      }
    } else {
      // 비로그인: localStorage fallback
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (bookmarked) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.filter((b: any) => b.postId !== postId)));
          setBookmarked(false);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([
            ...saved,
            { postId, title, category, idx, savedAt: new Date().toISOString() },
          ]));
          setBookmarked(true);
          setAnimate(true);
          setTimeout(() => setAnimate(false), 300);
        }
      } catch {}
    }
  }

  return (
    <button
      onClick={toggle}
      title={bookmarked ? '북마크 해제' : '북마크'}
      className={`text-[10px] font-bold uppercase transition-all px-4 py-2 rounded-lg border ${
        bookmarked
          ? 'text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
          : 'text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
      } ${animate ? 'scale-110' : 'scale-100'}`}
    >
      {bookmarked ? '★ 저장됨' : '☆ 저장'}
    </button>
  );
}
