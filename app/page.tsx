import { supabase } from '@/utils/supabase';
import AdBanner from "@/components/AdBanner";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const isEnvMissing = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isEnvMissing) {
    return (
      <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
        <h2 className="text-xl font-bold mb-4 text-white">⚙️ 설정 필요 (Vercel/Local)</h2>
        <div className="space-y-4 text-sm">
          <p>Supabase 환경 변수가 감지되지 않았습니다. Vercel 대시보드에서 등록 후 재배포하세요.</p>
        </div>
      </div>
    );
  }

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-10 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="flex gap-6 w-full">
      {/* 1. 왼쪽 사이드바 (240px) */}
      <aside className="hidden lg:block w-[240px] flex-shrink-0 space-y-8">
        <nav className="space-y-1 text-zinc-400 text-sm">
          <h3 className="px-3 text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-3">Navigation</h3>
          <div className="flex items-center px-3 py-2 text-white bg-zinc-900 rounded-lg font-bold cursor-pointer">🏠 전체 게시판</div>
          <div className="hover:text-white px-3 py-2 cursor-pointer transition-colors">🔥 실시간 베스트</div>
          <div className="hover:text-white px-3 py-2 cursor-pointer transition-colors">💎 인기 게시판</div>
        </nav>
        <nav className="space-y-1 text-zinc-400 text-sm">
          <h3 className="px-3 text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-3">Channels</h3>
          <div className="hover:text-white px-3 py-2 cursor-pointer">🎮 게임 채널</div>
          <div className="hover:text-white px-3 py-2 cursor-pointer">📺 애니메이션</div>
          <div className="hover:text-white px-3 py-2 cursor-pointer">💻 IT & 테크</div>
        </nav>
      </aside>

      {/* 2. 중앙 게시판 리스트 (Flex-1) */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex gap-4">
            <button className="text-sm font-black text-white border-b-2 border-blue-500 pb-2">실시간 베스트</button>
            <button className="text-sm font-bold text-zinc-500 hover:text-zinc-300 pb-2">주간 인기</button>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl w-full">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800 text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                <th className="py-3 px-4 text-center w-[80px]">No</th>
                <th className="py-3 px-4 text-center w-[100px]">Cat</th>
                <th className="py-3 px-4 text-left">Subject</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {(!posts || posts.length === 0) ? (
                <tr><td colSpan={3} className="py-12 text-center text-zinc-500 italic">게시글이 없습니다.</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/40 transition-all group cursor-pointer">
                    <td className="py-3 px-4 text-center text-zinc-600 text-[11px]">{post.id}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-zinc-900 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800">{post.category}</span>
                    </td>
                    <td className="py-3 px-4 truncate">
                      <a href={`/post/${post.id}`} className="flex items-center gap-2 group-hover:translate-x-1 transition-transform overflow-hidden">
                        <span className="text-zinc-200 font-medium truncate group-hover:text-blue-400">{post.title}</span>
                        <span className="text-[11px] font-black text-blue-500/80">[{post.comments_count || 0}]</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 오른쪽 사이드바 (300px) */}
      <aside className="hidden xl:block w-[300px] flex-shrink-0 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-sm text-zinc-400 mb-4 font-medium">커뮤니티에 가입하고 활동해 보세요!</div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">로그인</button>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 text-xs font-black text-white">실시간 인기 글</div>
          <div className="p-2 space-y-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 p-2 text-xs text-zinc-400 hover:bg-zinc-900 cursor-pointer rounded-lg">
                <span className="text-blue-500 font-bold">{i + 1}</span>
                <span className="truncate">인기 게시글 제목 예시입니다.</span>
              </div>
            ))}
          </div>
        </div>
        <AdBanner label="Sidebar Ad" />
      </aside>
    </div>
  );
}
