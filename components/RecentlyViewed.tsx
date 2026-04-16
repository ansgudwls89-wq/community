'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'nol2_recently_viewed';
const MAX_ITEMS = 10;

export interface RecentPost {
  id: number;
  idx: number;
  title: string;
  category: string;
  viewedAt: string;
}

export function recordView(post: Omit<RecentPost, 'viewedAt'>) {
  try {
    const list: RecentPost[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = list.filter(p => p.id !== post.id);
    const updated = [{ ...post, viewedAt: new Date().toISOString() }, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export default function RecentlyViewed() {
  const [posts, setPosts] = useState<RecentPost[]>([]);

  useEffect(() => {
    try {
      setPosts(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {}
  }, []);

  if (posts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">최근 본 글</h3>
      <div className="space-y-2">
        {posts.map(post => (
          <a
            key={post.id}
            href={`/s/${encodeURIComponent(post.category)}/${post.idx}`}
            className="block group"
          >
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors leading-tight">
              {post.title}
            </p>
            <p className="text-[10px] font-black text-zinc-400 uppercase mt-0.5">{post.category}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
