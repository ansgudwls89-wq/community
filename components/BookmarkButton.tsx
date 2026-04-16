'use client';

import { useEffect, useState } from 'react';

interface BookmarkButtonProps {
  postId: number;
  title: string;
  category: string;
  idx: number;
}

const STORAGE_KEY = 'nol2_bookmarks';

interface Bookmark {
  postId: number;
  title: string;
  category: string;
  idx: number;
  savedAt: string;
}

function getBookmarks(): Bookmark[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function BookmarkButton({ postId, title, category, idx }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setBookmarked(getBookmarks().some(b => b.postId === postId));
  }, [postId]);

  function toggle() {
    const bookmarks = getBookmarks();
    const exists = bookmarks.some(b => b.postId === postId);
    if (exists) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.filter(b => b.postId !== postId)));
      setBookmarked(false);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([
        ...bookmarks,
        { postId, title, category, idx, savedAt: new Date().toISOString() },
      ]));
      setBookmarked(true);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
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
