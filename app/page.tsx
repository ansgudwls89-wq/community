import { supabase } from '@/utils/supabase';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const isEnvMissing = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isEnvMissing) {
    return (
      <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
        <h2 className="text-xl font-bold mb-4 text-white">⚙️ 설정 필요</h2>
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

  // 주간 인기 (조회수순) - 실제 운영 시에는 최근 7일 필터링이 필요할 수 있음
  const { data: weeklyPosts } = await supabase
    .from('posts')
    .select('*')
    .order('views', { ascending: false })
    .limit(10);

  const PostList = ({ title, posts, badgeColor }: { title: string, posts: any[] | null, badgeColor: string }) => (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between pb-2 mb-4 border-b border-zinc-800">
        <h2 className="text-sm font-black text-white px-2 py-1 bg-zinc-900 rounded-md border border-zinc-800">{title}</h2>
        <button className="text-zinc-500 hover:text-zinc-300 text-[11px] font-bold transition-all">더보기 +</button>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <th className="py-2.5 px-3 text-left">Subject</th>
              <th className="py-2.5 px-3 text-center w-[60px]">Views</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {(!posts || posts.length === 0) ? (
              <tr><td colSpan={2} className="py-12 text-center text-zinc-500 italic">게시글이 없습니다.</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/40 transition-all group cursor-pointer text-zinc-300">
                  <td className="py-2.5 px-3 truncate font-medium">
                    <a href={`/post/${post.id}`} className="flex items-center gap-2 group-hover:translate-x-1 transition-transform overflow-hidden">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${badgeColor}`}></span>
                      <span className="truncate group-hover:text-blue-400 transition-colors">{post.title}</span>
                      <span className="text-[10px] font-black text-blue-500/80">[{post.comments_count || 0}]</span>
                    </a>
                  </td>
                  <td className="py-2.5 px-3 text-center text-zinc-500 text-[10px] font-bold">
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

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        <PostList title="실시간 베스트" posts={realtimePosts} badgeColor="bg-blue-500" />
        <PostList title="주간 인기" posts={weeklyPosts} badgeColor="bg-orange-500" />
      </div>

      <div className="flex items-center justify-end pt-4">
        <a href="/write" className="bg-white text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-all shadow-xl">
          새 글 작성
        </a>
      </div>
    </div>
  );
}
