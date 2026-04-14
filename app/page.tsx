import { supabase } from '@/utils/supabase';
import AdBanner from "@/components/AdBanner";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. 환경 변수 체크 (빌드 시점 또는 런타임 시점의 누락 방지)
  const isEnvMissing = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isEnvMissing) {
    return (
      <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
        <h2 className="text-xl font-bold mb-4 text-white">⚙️ 설정 필요</h2>
        <p className="mb-4">Supabase 환경 변수가 설정되지 않았습니다.</p>
        <ul className="list-disc list-inside text-sm space-y-2">
          <li>로컬 개발: <code className="bg-zinc-800 px-1.5 py-0.5 rounded">.env.local</code> 파일 확인</li>
          <li>배포 환경: 서비스 대시보드에서 <code className="bg-zinc-800 px-1.5 py-0.5 rounded">Environment Variables</code> 등록</li>
        </ul>
      </div>
    );
  }

  // 2. Supabase에서 데이터 가져오기
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-10 bg-red-900/10 border border-red-500/50 rounded-2xl text-red-400">
        <h2 className="text-lg font-bold mb-2">데이터베이스 오류</h2>
        <pre className="text-xs bg-black/50 p-4 rounded-lg overflow-auto max-h-40">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* 상단 탭 및 필터 */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex gap-4">
          <button className="text-sm font-black text-white border-b-2 border-blue-500 pb-2">실시간 베스트</button>
          <button className="text-sm font-bold text-zinc-500 hover:text-zinc-300 pb-2 transition-colors">주간 인기</button>
          <button className="text-sm font-bold text-zinc-500 hover:text-zinc-300 pb-2 transition-colors">월간 인기</button>
        </div>
      </div>

      {/* 게시글 리스트 테이블 */}
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
              <tr>
                <td colSpan={3} className="py-12 text-center text-zinc-500 italic">
                  게시글이 존재하지 않습니다. 첫 번째 글을 작성해 보세요!
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <tr key={post.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/40 transition-all group cursor-pointer">
                  <td className="py-3 px-4 text-center text-zinc-600 text-[11px] truncate">{post.id}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-zinc-900 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800 block truncate">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 truncate">
                    <a href={`/post/${post.id}`} className="flex items-center gap-2 group-hover:translate-x-1 transition-transform overflow-hidden">
                      <span className="text-zinc-200 font-medium truncate group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </span>
                      <span className="text-[11px] font-black text-blue-500/80 flex-shrink-0">
                        [{post.comments_count || 0}]
                      </span>
                      {post.has_image && <span className="text-[10px] flex-shrink-0">🖼️</span>}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-1">
          <button className="w-8 h-8 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-900/20">1</button>
        </div>
        <button className="bg-white text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-95">
          새 글 작성
        </button>
      </div>
    </div>
  );
}
