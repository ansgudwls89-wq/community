import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 1. 조회수 1 증가 (조회수 컬럼이 없을 경우 에러가 나지만 무시됨)
  await supabase.rpc('increment_views', { post_id: id }).catch(() => {
    // RPC가 없는 경우 직접 업데이트 시도 (대안)
    console.log('Using direct update for views');
  });
  
  // 직접 업데이트 방식 (RPC 설정 전까지 사용)
  const { data: currentPost } = await supabase.from('posts').select('views').eq('id', id).single();
  if (currentPost) {
    await supabase.from('posts').update({ views: (currentPost.views || 0) + 1 }).eq('id', id);
  }

  // 2. 게시글 데이터 가져오기
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    return (
      <div className="w-full p-10 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 text-center">
        <h2 className="text-xl font-bold mb-4 text-white">게시글을 불러올 수 없습니다.</h2>
        <a href="/" className="text-blue-400 hover:underline">← 목록으로 돌아가기</a>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <header className="p-5 sm:p-6 border-b border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-zinc-700 font-bold">/</span>
            <span className="text-[10px] text-zinc-600 font-bold">#{post.id}</span>
          </div>
          
          <h1 className="text-xl sm:text-2xl font-black text-white mb-4 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="font-bold text-zinc-300">{post.author || '익명'}</span>
              <span>|</span>
              <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
            </div>
            <div className="flex items-center gap-4 font-medium">
              <span className="flex items-center gap-1">조회 <span className="text-zinc-300">{post.views || 0}</span></span>
              <span>추천 {post.likes || 0}</span>
              <span className="text-blue-500 font-bold">댓글 {post.comments_count || 0}</span>
            </div>
          </div>
        </header>

        <article className="p-6 sm:p-8 min-h-[300px]">
          <div className="prose prose-invert !max-w-none w-full text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {post.content || '본문 내용이 없습니다.'}
          </div>
          
          <div className="mt-16 mb-8 flex justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-blue-600/10 hover:border-blue-500 transition-all active:scale-95 group">
              <span className="text-xl">👍</span>
              <span className="text-[11px] font-bold text-zinc-400 group-hover:text-blue-400">추천 {post.likes || 0}</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-red-600/10 hover:border-red-500 transition-all active:scale-95 group">
              <span className="text-xl">👎</span>
              <span className="text-[11px] font-bold text-zinc-400 group-hover:text-red-400">비추천 0</span>
            </button>
          </div>
        </article>

        <section className="border-t border-zinc-800 bg-zinc-900/10">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-xs font-black text-white uppercase tracking-wider">Comments</h2>
            <span className="text-[10px] text-zinc-500 font-bold">{post.comments_count || 0}</span>
          </div>
          
          <div className="p-5 bg-zinc-950/50">
            <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 focus-within:border-blue-500/50 transition-all">
              <textarea 
                placeholder="댓글을 입력하세요"
                className="w-full bg-transparent border-none outline-none text-sm text-zinc-300 min-h-[80px] resize-none placeholder:text-zinc-700"
              />
              <div className="flex justify-end mt-3 pt-3 border-t border-zinc-800/50">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black px-5 py-2 rounded-lg transition-all shadow-lg active:scale-95">
                  등록
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="p-5 border-t border-zinc-800 flex justify-between bg-zinc-950 items-center">
          <a href="/" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest">
            ← Back to Board
          </a>
          <div className="flex gap-4">
            <button className="text-[10px] font-bold text-zinc-700 hover:text-zinc-400 uppercase transition-colors">Report</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
