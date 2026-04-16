import { supabase } from '@/utils/supabase';


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

  // 주간 인기 (최근 7일 내 조회수순)
  const weeklyFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: weeklyPosts } = await supabase
    .from('posts')
    .select('*')
    .gte('created_at', weeklyFrom)
    .order('views', { ascending: false })
    .limit(10);

  // spaces 테이블에서 슬러그+이름 조회
  const { data: spacesData } = await supabase
    .from('spaces')
    .select('slug, name')
    .order('slug');

  const spaces = spacesData || [];

  // 카테고리별 최신 5개 병렬 조회
  const categoryResults = await Promise.all(
    spaces.map(s =>
      supabase
        .from('posts')
        .select('id, idx, category, title, views, likes, comments_count, has_image, thumbnail_url, created_at, author')
        .eq('category', s.slug)
        .order('created_at', { ascending: false })
        .limit(5)
    )
  );

  const postsByCategory = spaces.reduce((acc, s, i) => {
    acc[s.slug] = categoryResults[i].data || [];
    return acc;
  }, {} as Record<string, any[]>);

  const PostList = ({ title, posts, showView = true, href, showRank = false }: { title: string, posts: any[] | null, showView?: boolean, href?: string, showRank?: boolean }) => (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        {href ? (
          <a href={href} className="group">
            <h2 className="text-[12px] font-black text-zinc-700 dark:text-zinc-200 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 uppercase cursor-pointer">{title}</h2>
          </a>
        ) : (
          <h2 className="text-[12px] font-black text-zinc-700 dark:text-zinc-200 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 transition-colors uppercase">{title}</h2>
        )}
        {href ? (
          <a href={href} className="text-zinc-400 dark:text-zinc-600 hover:text-blue-500 dark:hover:text-blue-400 text-[10px] font-bold transition-all">더보기</a>
        ) : (
          <button className="text-zinc-400 dark:text-zinc-600 hover:text-blue-500 dark:hover:text-blue-400 text-[10px] font-bold transition-all cursor-default">더보기</button>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-colors">
        <table className="w-full border-collapse">
          <tbody className="text-[12px]">
            {(!posts || posts.length === 0) ? (
              <tr><td colSpan={3} className="py-8 text-center text-zinc-400 dark:text-zinc-500 italic text-[11px]">게시글이 없습니다.</td></tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group cursor-pointer text-zinc-600 dark:text-zinc-300">
                  <td className="py-1.5 px-3 text-center text-zinc-400 dark:text-zinc-600 text-[10px] font-mono w-10">
                    {showRank ? (
                      <span className={index < 3 ? 'text-blue-600 dark:text-blue-500 font-black' : ''}>{index + 1}</span>
                    ) : (
                      post.idx || post.id
                    )}
                  </td>
                  <td className="py-1.5 px-3 font-medium max-w-0 w-full">
                    <div className="relative group/thumb flex items-center gap-2 overflow-hidden">
                      <a href={`/s/${encodeURIComponent(post.category)}/${post.idx}`} className="flex items-center gap-2 min-w-0 overflow-hidden">
                        {post.has_image && <span className="text-[10px] flex-shrink-0">🖼</span>}
                        <span className="truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{post.title}</span>
                        <span className="text-[10px] font-black text-blue-600/60 dark:text-blue-500/60 flex-shrink-0">[{post.comments_count || 0}]</span>
                      </a>
                      {post.thumbnail_url && (
                        <div className="pointer-events-none absolute left-0 top-full mt-1 z-50 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-150">
                          <img
                            src={post.thumbnail_url}
                            alt=""
                            className="w-48 h-32 object-cover rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700"
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  {showView && (
                    <td className="py-1.5 px-3 text-right text-zinc-400 dark:text-zinc-600 text-[10px] font-bold w-12 transition-colors">
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
        <PostList title="실시간 베스트" posts={realtimePosts} href="/s/best" showRank={true} />
        <PostList title="주간 인기" posts={weeklyPosts} href="/s/popular" showRank={true} />
      </div>

      {/* 카테고리별 섹션 (그리드) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 border-t border-zinc-100 dark:border-zinc-800 pt-10 transition-colors">
        {spaces.map(space => (
          <PostList
            key={space.slug}
            title={space.name}
            posts={postsByCategory[space.slug]}
            showView={false}
            href={`/s/${encodeURIComponent(space.slug)}`}
          />
        ))}
      </div>
    </div>
  );
}
