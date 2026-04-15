import { supabase } from '@/utils/supabase';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const isEnvMissing = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isEnvMissing) {
    return (
      <div className="p-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 dark:text-zinc-400 transition-colors">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">⚙️ 설정 필요</h2>
        <p>환경 변수를 설정해 주세요.</p>
      </div>
    );
  }

  // 실시간 베스트 (최신순)
  const { data: realtimePosts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  // 주간 인기 (조회수순)
  const { data: weeklyPosts } = await supabase
    .from('posts')
    .select('*')
    .order('views', { ascending: false })
    .limit(10);

  // 모든 게시글을 가져와 카테고리별로 그룹화 (최신순 5개씩)
  const { data: allPosts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  const categories = Array.from(new Set(allPosts?.map(p => p.category) || []));
  const postsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = allPosts?.filter(p => p.category === cat).slice(0, 5) || [];
    return acc;
  }, {} as Record<string, any[]>);

  const PostList = ({ title, posts, showView = true, href }: { title: string, posts: any[] | null, showView?: boolean, href?: string }) => (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <h2 className="text-[12px] font-black text-zinc-700 dark:text-zinc-200 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 transition-colors">{title}</h2>
        {href ? (
          <a href={href} className="text-zinc-400 dark:text-zinc-600 hover:text-blue-500 dark:hover:text-blue-400 text-[10px] font-bold transition-all">더보기</a>
        ) : (
          <button className="text-zinc-400 dark:text-zinc-600 hover:text-blue-500 dark:hover:text-blue-400 text-[10px] font-bold transition-all cursor-default">더보기</button>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-colors">
        <table className="w-full border-collapse table-fixed">
          <tbody className="text-[12px]">
            {(!posts || posts.length === 0) ? (
              <tr><td colSpan={2} className="py-8 text-center text-zinc-400 dark:text-zinc-500 italic text-[11px]">게시글이 없습니다.</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group cursor-pointer text-zinc-600 dark:text-zinc-300">
                  <td className="py-1.5 px-3 truncate font-medium transition-colors">
                    <a href={`/post/${post.id}`} className="flex items-center gap-2 overflow-hidden">
                      <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</span>
                      <span className="text-[10px] font-black text-blue-600/60 dark:text-blue-400/60">[{post.comments_count || 0}]</span>
                    </a>
                  </td>
                  {showView && (
                    <td className="py-1.5 px-3 text-right text-zinc-400 dark:text-zinc-500 text-[10px] font-bold w-[50px] transition-colors">
                      {post.views || 0}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 w-full pb-20">
      {/* 상단 메인 리스트 */}
      <div className="flex flex-col lg:flex-row gap-6">
        <PostList title="실시간 베스트" posts={realtimePosts} href="/space/best" />
        <PostList title="주간 인기" posts={weeklyPosts} href="/space/popular" />
      </div>

      {/* 카테고리별 섹션 (그리드) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 border-t border-zinc-100 dark:border-zinc-800 pt-10 transition-colors">
        {categories.map(category => (
          <PostList 
            key={category} 
            title={category.toUpperCase()} 
            posts={postsByCategory[category]} 
            showView={false}
            href={`/space/${encodeURIComponent(category)}`}
          />
        ))}
      </div>
    </div>
  );
}
