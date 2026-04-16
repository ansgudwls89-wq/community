import type { Metadata } from 'next';
import { connection } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';
import { supabase } from '@/utils/supabase';

export const metadata: Metadata = {
  title: 'NOL2 커뮤니티',
  description: 'NOL2 커뮤니티 게시글',
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ category: string; idx: string }>;
}) {
  await connection();
  const { category: encodedCategory, idx } = await params;
  const category = decodeURIComponent(encodedCategory);

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .eq('idx', parseInt(idx))
    .single();

  if (error || !post) {
    return (
      <div className="w-full p-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 dark:text-zinc-400 text-center transition-colors">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">게시글을 찾을 수 없습니다.</h2>
        <a href={`/s/${encodedCategory}`} className="text-blue-600 dark:text-blue-400 hover:underline">← 목록으로 돌아가기</a>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
        <header className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors">
          <div className="flex items-center gap-2 mb-3 text-[10px]">
            <a
              href={`/s/${encodeURIComponent(post.category)}`}
              className="font-black text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider"
            >
              {post.category}
            </a>
            <span className="text-zinc-300 dark:text-zinc-700 font-bold">/</span>
            <span className="text-zinc-400 dark:text-zinc-600 font-bold tracking-tighter">포스트 #{post.idx || post.id}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="font-black text-zinc-700 dark:text-zinc-200">{post.author || '익명'}</span>
              <span className="text-zinc-200 dark:text-zinc-800">|</span>
              <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
            </div>
            <div className="flex items-center gap-4 font-bold">
              <span>조회 {post.views ?? 0}</span>
              <span className="text-blue-600 dark:text-blue-500">추천 {post.likes ?? 0}</span>
              <span className="text-red-600 dark:text-red-500">비추천 {post.dislikes ?? 0}</span>
              <span>댓글 {post.comments_count ?? 0}</span>
            </div>
          </div>
        </header>

        <article className="p-6 sm:p-8 min-h-[300px] bg-white dark:bg-zinc-950">
          <div
            className="prose dark:prose-invert !max-w-none w-full text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '<p>본문 내용이 없습니다.</p>', { ADD_TAGS: ['iframe'], ADD_ATTR: ['allowfullscreen', 'frameborder'] }) }}
          />
        </article>

        <footer className="p-5 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap justify-between gap-2 bg-zinc-50 dark:bg-zinc-950 items-center">
          <a href={`/s/${encodeURIComponent(post.category)}`} className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white uppercase tracking-widest px-4 py-2 border border-zinc-200 dark:border-zinc-900 rounded-lg hover:bg-white dark:hover:bg-zinc-900 transition-colors">
            ← 목록으로
          </a>
        </footer>
      </div>
    </div>
  );
}
