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

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex gap-4">
          <button className="text-sm font-black text-white border-b-2 border-blue-500 pb-2">실시간 베스트</button>
          <button className="text-sm font-bold text-zinc-500 hover:text-zinc-300 pb-2">주간 인기</button>
        </div>
        <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-zinc-800 transition-all">새로고침</button>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl w-full">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-zinc-800 text-[11px] font-black text-zinc-500 uppercase tracking-widest">
              <th className="py-3 px-4 text-center w-[70px]">No</th>
              <th className="py-3 px-4 text-center w-[90px]">Space</th>
              <th className="py-3 px-4 text-left">Subject</th>
              <th className="py-3 px-4 text-center w-[70px]">Views</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {(!posts || posts.length === 0) ? (
              <tr><td colSpan={4} className="py-12 text-center text-zinc-500 italic">게시글이 없습니다.</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/40 transition-all group cursor-pointer text-zinc-300">
                  <td className="py-3 px-4 text-center text-zinc-600 text-[10px] font-mono">{post.id}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-zinc-900 text-blue-400 text-[9px] font-black px-2 py-0.5 rounded border border-zinc-800 uppercase">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 truncate font-medium">
                    <a href={`/post/${post.id}`} className="flex items-center gap-2 group-hover:translate-x-1 transition-transform overflow-hidden">
                      <span className="truncate group-hover:text-blue-400 transition-colors">{post.title}</span>
                      <span className="text-[11px] font-black text-blue-500/80">[{post.comments_count || 0}]</span>
                    </a>
                  </td>
                  <td className="py-3 px-4 text-center text-zinc-500 text-[11px] font-bold">
                    {post.views || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-1">
          <button className="w-8 h-8 rounded-lg text-xs font-bold bg-blue-600 text-white">1</button>
        </div>
        <a href="/write" className="bg-white text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-all shadow-xl">
          새 글 작성
        </a>
      </div>
    </div>
  );
}
