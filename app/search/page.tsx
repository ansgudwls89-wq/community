import { supabase } from '@/utils/supabase';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const MAX_RESULTS = 50;
const MIN_QUERY_LENGTH = 2;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q: query } = await searchParams;
  return {
    title: query ? `"${query}" 검색 결과 — NOL2` : '검색 — NOL2',
  };
}

export default async function SearchResultsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: query } = await searchParams;

  if (!query) {
    return (
      <div className="w-full p-20 text-center text-zinc-400">검색어를 입력해 주세요.</div>
    );
  }

  if (query.trim().length < MIN_QUERY_LENGTH) {
    return (
      <div className="w-full p-20 text-center text-zinc-400">
        검색어는 {MIN_QUERY_LENGTH}자 이상 입력해 주세요.
      </div>
    );
  }

  // title만 검색 (content는 HTML이 포함되어 부정확하고 부하가 큼)
  // 최대 50개 결과로 제한
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, idx, title, category, author, views, comments_count, created_at')
    .ilike('title', `%${query.trim()}%`)
    .order('created_at', { ascending: false })
    .limit(MAX_RESULTS);

  if (error) {
    console.error('Search error:', error);
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
            "<span className="text-blue-600 dark:text-blue-500">{query}</span>" <span className="ml-1">검색 결과</span>
          </h1>
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 uppercase transition-colors">
            {posts?.length || 0}개{posts?.length === MAX_RESULTS ? ' (최대)' : ''}
          </span>
        </div>
        <a href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
          ← 메인으로
        </a>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-widest transition-colors text-center">
              <th className="py-3 px-4 w-[60px] hidden sm:table-cell">번호</th>
              <th className="py-3 px-4 w-[100px]">스페이스</th>
              <th className="py-3 px-4 text-left">제목</th>
              <th className="py-3 px-4 w-[100px] hidden md:table-cell">작성자</th>
              <th className="py-3 px-4 w-[70px] hidden sm:table-cell">조회수</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {(!posts || posts.length === 0) ? (
              <tr><td colSpan={5} className="py-16 text-center transition-colors">
                <p className="text-zinc-400 dark:text-zinc-600 italic mb-3">
                  "<span className="font-bold not-italic text-zinc-600 dark:text-zinc-400">{query}</span>"에 대한 검색 결과가 없습니다.
                </p>
                <div className="flex items-center justify-center gap-2 text-[11px]">
                  <span className="text-zinc-400">다른 검색어를 시도하거나</span>
                  <a href="/" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">스페이스 둘러보기</a>
                </div>
              </td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-zinc-100 dark:border-zinc-900 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all group cursor-pointer text-zinc-600 dark:text-zinc-400">
                  <td className="py-3 px-4 text-center text-zinc-400 dark:text-zinc-600 text-[10px] font-mono hidden sm:table-cell">{post.idx || post.id}</td>
                  <td className="py-3 px-4 text-center">
                    <a
                      href={`/s/${encodeURIComponent(post.category)}`}
                      className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      {post.category}
                    </a>
                  </td>
                  <td className="py-3 px-4 truncate font-medium">
                    <a href={`/s/${encodeURIComponent(post.category)}/${post.idx}`} className="flex items-center gap-2 group-hover:translate-x-1 transition-transform overflow-hidden">
                      <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{post.title}</span>
                      <span className="text-[11px] font-black text-blue-600/80 dark:text-blue-500/80 flex-shrink-0">[{post.comments_count || 0}]</span>
                    </a>
                  </td>
                  <td className="py-3 px-4 text-center text-[12px] truncate hidden md:table-cell">{post.author || '익명'}</td>
                  <td className="py-3 px-4 text-center text-zinc-500 dark:text-zinc-500 text-[11px] font-bold hidden sm:table-cell">
                    {post.views || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
