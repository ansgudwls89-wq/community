import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 1. Supabase에서 게시글 데이터 가져오기
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  // 2. 에러 디버깅 정보
  if (error) {
    return (
      <div className="w-full p-10 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
        <h2 className="text-xl font-bold mb-4 text-white">게시글을 불러올 수 없습니다 (ID: {id})</h2>
        <pre className="text-xs bg-black/50 p-4 rounded-lg overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
        <a href="/" className="inline-block mt-4 text-blue-400 hover:underline">← 홈으로 돌아가기</a>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <div className="w-full">
      {/* 게시글 전체 카드 - 메인 페이지의 게시판 컨테이너와 동일한 설정 */}
      <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* 헤더 */}
        <header className="w-full p-6 border-b border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-500 font-medium">#{post.id}</span>
          </div>
          
          <h1 className="text-2xl font-black text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="font-bold text-zinc-300">{post.author || '익명'}</span>
              <span>|</span>
              <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>조회 1,242</span>
              <span>추천 {post.likes || 0}</span>
              <span>댓글 {post.comments_count || 0}</span>
            </div>
          </div>
        </header>

        {/* 본문 - prose의 폭 제한을 !max-w-none으로 확실히 해제 */}
        <article className="w-full p-6 sm:p-8 min-h-[400px]">
          <div className="prose prose-invert !max-w-none w-full text-zinc-300 leading-loose whitespace-pre-wrap">
            {post.content || '본문 내용이 없습니다.'}
          </div>
          
          {/* 추천/비추천 버튼 */}
          <div className="mt-20 mb-10 flex justify-center gap-6">
            <button className="flex flex-col items-center gap-2 px-10 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-blue-600/10 hover:border-blue-500 transition-all group">
              <span className="text-3xl group-hover:scale-110 transition-transform">👍</span>
              <span className="text-sm font-black text-zinc-400 group-hover:text-blue-400 uppercase tracking-widest">추천 {post.likes || 0}</span>
            </button>
            <button className="flex flex-col items-center gap-2 px-10 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-red-600/10 hover:border-red-500 transition-all group">
              <span className="text-3xl group-hover:scale-110 transition-transform">👎</span>
              <span className="text-sm font-black text-zinc-400 group-hover:text-red-400 uppercase tracking-widest">비추천 0</span>
            </button>
          </div>
        </article>

        {/* 댓글 섹션 */}
        <section className="w-full border-t border-zinc-800 bg-zinc-900/20">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              Comments
            </h2>
            <span className="text-[11px] font-bold text-zinc-500">Total {post.comments_count || 0}</span>
          </div>
          
          <div className="p-6 bg-zinc-900/40">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
              <textarea 
                placeholder="커뮤니티 가이드를 준수하여 댓글을 작성해 주세요"
                className="w-full bg-transparent border-none outline-none text-sm text-zinc-300 min-h-[100px] resize-none placeholder:text-zinc-700"
              />
              <div className="flex justify-end mt-4 border-t border-zinc-900 pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                  댓글 등록
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 푸터 버튼 */}
        <footer className="w-full p-6 border-t border-zinc-800 flex justify-between bg-zinc-950 items-center">
          <a href="/" className="text-[11px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-widest border border-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-900">
            ← Back to List
          </a>
          <div className="flex gap-4">
            <button className="text-[11px] font-bold text-zinc-600 hover:text-white transition-colors">Report</button>
            <button className="text-[11px] font-bold text-zinc-600 hover:text-white transition-colors">Edit</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
