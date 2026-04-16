import { supabase } from '@/utils/supabase';
import type { Metadata } from 'next';

const MAX_RESULTS = 50;
const MIN_QUERY_LENGTH = 2;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q: query } = await searchParams;
  return { title: query ? `"${query}" 검색 결과 — NOL2` : '검색 — NOL2' };
}

function highlight(text: string, query: string) {
  if (!text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? `<mark class="bg-yellow-200 dark:bg-yellow-700/50 text-zinc-900 dark:text-white rounded px-0.5">${part}</mark>`
      : part
  ).join('');
}

function extractSnippet(htmlContent: string, query: string, maxLen = 120): string {
  const text = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, maxLen) + (text.length > maxLen ? '…' : '');
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + query.length + 80);
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

export default async function SearchResultsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: query } = await searchParams;

  if (!query) return <div className="w-full p-20 text-center text-zinc-400">검색어를 입력해 주세요.</div>;
  if (query.trim().length < MIN_QUERY_LENGTH) {
    return <div className="w-full p-20 text-center text-zinc-400">검색어는 {MIN_QUERY_LENGTH}자 이상 입력해 주세요.</div>;
  }

  const q = query.trim();
  const escaped = q.replace(/[%_\\]/g, '\\$&');

  // 제목 + 본문 검색 (OR)
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, idx, title, category, author, views, comments_count, created_at, content')
    .or(`title.ilike.%${escaped}%,content.ilike.%${escaped}%`)
    .order('created_at', { ascending: false })
    .limit(MAX_RESULTS);

  if (error) {
    return (
      <div className="w-full p-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center transition-colors">
        <p className="text-red-500 font-bold mb-4">검색 중 오류가 발생했습니다.</p>
        <a href="/" className="text-blue-600 hover:underline text-sm">← 메인으로</a>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter transition-colors">
            "<span className="text-blue-600 dark:text-blue-500">{q}</span>" 검색 결과
          </h1>
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 uppercase transition-colors">
            {posts?.length || 0}개{posts?.length === MAX_RESULTS ? ' (최대)' : ''}
          </span>
        </div>
        <a href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">← 메인으로</a>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
        {(!posts || posts.length === 0) ? (
          <div className="py-16 text-center">
            <p className="text-zinc-400 dark:text-zinc-600 italic mb-3">
              "<span className="font-bold not-italic text-zinc-600 dark:text-zinc-400">{q}</span>"에 대한 검색 결과가 없습니다.
            </p>
            <a href="/" className="text-blue-600 dark:text-blue-400 text-[11px] font-bold hover:underline">스페이스 둘러보기</a>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {posts.map((post) => {
              const titleInContent = post.title.toLowerCase().includes(q.toLowerCase());
              const snippet = post.content ? extractSnippet(post.content, q) : null;
              const showSnippet = !titleInContent && snippet;

              return (
                <a
                  key={post.id}
                  href={`/s/${encodeURIComponent(post.category)}/${post.idx}`}
                  className="block px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded uppercase flex-shrink-0 mt-0.5">
                      {post.category}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm leading-snug"
                        dangerouslySetInnerHTML={{ __html: highlight(post.title, q) + `<span class="text-[11px] font-black text-blue-600/70 dark:text-blue-500/70 ml-1">[${post.comments_count || 0}]</span>` }}
                      />
                      {showSnippet && (
                        <div
                          className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: highlight(snippet!, q) }}
                        />
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-zinc-400 dark:text-zinc-600 font-bold">
                        <span>{post.author || '익명'}</span>
                        <span>조회 {post.views || 0}</span>
                        <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
