import { supabase } from '@/utils/supabase';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: encodedCategory } = await params;
  const category = decodeURIComponent(encodedCategory);

  const titleMap: Record<string, string> = {
    best: '실시간 베스트',
    popular: '주간 인기',
  };
  const title = titleMap[category.toLowerCase()] ?? `${category.toUpperCase()} 스페이스`;

  return {
    title: `${title} — NOL2`,
    description: `NOL2 커뮤니티 ${title} 게시판`,
    openGraph: {
      title: `${title} — NOL2`,
      description: `NOL2 커뮤니티 ${title} 게시판`,
    },
  };
}

export default async function SpacePage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category: encodedCategory } = await params;
  const { page: pageParam } = await searchParams;
  const category = decodeURIComponent(encodedCategory);
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase.from('posts').select('*', { count: 'exact' });
  let title = category;

  if (category.toLowerCase() === 'best') {
    query = query.order('created_at', { ascending: false });
    title = '실시간 베스트';
  } else if (category.toLowerCase() === 'popular') {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte('created_at', since).order('views', { ascending: false });
    title = '주간 인기';
  } else {
    query = query.eq('category', category).order('created_at', { ascending: false });
    title = `${category} 스페이스`;
  }

  const { data: posts, error, count } = await query.range(from, to);

  if (error) {
    console.error('Error fetching posts:', error);
    return (
      <div className="w-full p-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 dark:text-zinc-400 text-center transition-colors">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">데이터를 불러오는 중 오류가 발생했습니다.</h2>
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">← 메인으로 돌아가기</a>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter transition-colors">
            {title}
          </h1>
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 uppercase">
            {count || 0}개의 글
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
              <th className="py-3 px-4 text-left">제목</th>
              <th className="py-3 px-4 w-[100px]">작성자</th>
              <th className="py-3 px-4 w-[120px] hidden md:table-cell">작성일</th>
              <th className="py-3 px-4 w-[70px] hidden sm:table-cell">조회수</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {(!posts || posts.length === 0) ? (
              <tr><td colSpan={5} className="py-20 text-center text-zinc-400 dark:text-zinc-600 italic">게시글이 없습니다. 첫 글의 주인공이 되어보세요!</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-zinc-100 dark:border-zinc-900 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all group cursor-pointer text-zinc-600 dark:text-zinc-400">
                  <td className="py-3 px-4 text-center text-zinc-400 dark:text-zinc-600 text-[10px] font-mono hidden sm:table-cell">{post.idx || post.id}</td>
                  <td className="py-3 px-4 truncate font-medium">
                    <a href={`/s/${encodeURIComponent(post.category)}/${post.idx}`} className="flex items-center gap-2 group-hover:translate-x-1 transition-transform overflow-hidden">
                      <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{post.title}</span>
                      <span className="text-[11px] font-black text-blue-600/80 dark:text-blue-500/80 flex-shrink-0">[{post.comments_count || 0}]</span>
                    </a>
                  </td>
                  <td className="py-3 px-4 text-center text-[12px] truncate">{post.author || '익명'}</td>
                  <td className="py-3 px-4 text-center text-[11px] text-zinc-400 dark:text-zinc-500 hidden md:table-cell">
                    {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-center text-zinc-500 dark:text-zinc-500 text-[11px] font-bold hidden sm:table-cell">
                    {post.views || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(() => {
        const totalPages = Math.ceil((count || 0) / PAGE_SIZE);
        const baseUrl = `/s/${encodeURIComponent(category)}`;
        const pageUrl = (p: number) => `${baseUrl}?page=${p}`;

        const getPageNumbers = () => {
          const delta = 2;
          const pages: (number | '...')[] = [];
          for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
              pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
              pages.push('...');
            }
          }
          return pages;
        };

        return (
          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-1 items-center">
              {currentPage > 1 && (
                <a href={pageUrl(currentPage - 1)} className="w-8 h-8 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  ‹
                </a>
              )}
              {getPageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-zinc-400">…</span>
                ) : (
                  <a
                    key={p}
                    href={pageUrl(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center border ${
                      p === currentPage
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border-blue-600'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    {p}
                  </a>
                )
              )}
              {currentPage < totalPages && (
                <a href={pageUrl(currentPage + 1)} className="w-8 h-8 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  ›
                </a>
              )}
            </div>
            {(category.toLowerCase() !== 'best' && category.toLowerCase() !== 'popular') && (
              <a href={`/s/${encodeURIComponent(category)}/write`} className="bg-zinc-900 dark:bg-white text-white dark:text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all shadow-xl">
                새 글 작성
              </a>
            )}
          </div>
        );
      })()}
    </div>
  );
}
