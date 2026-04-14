import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    return notFound();
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto space-y-6">
      {/* 게시글 메인 카드 */}
      <article className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* 상단 헤더 */}
        <header className="p-8 sm:p-12 border-b border-zinc-800 bg-zinc-900/20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
              {post.category}
            </span>
            <span className="text-zinc-700 font-bold">/</span>
            <span className="text-xs text-zinc-500 font-bold tracking-tighter">#{post.id}</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-zinc-900">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                {post.author?.[0] || '익'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-zinc-200">{post.author || '익명'}</span>
                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">
                  {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-[11px] font-black text-zinc-500 tracking-widest uppercase">
              <span className="flex flex-col items-center gap-1"><span className="text-zinc-700">Views</span> 1,242</span>
              <span className="flex flex-col items-center gap-1"><span className="text-zinc-700">Votes</span> {post.likes || 0}</span>
              <span className="flex flex-col items-center gap-1 text-blue-500"><span className="text-zinc-700">Comments</span> {post.comments_count || 0}</span>
            </div>
          </div>
        </header>

        {/* 게시글 본문 */}
        <div className="p-8 sm:p-12 min-h-[600px]">
          <div className="prose prose-invert !max-w-none w-full text-zinc-300 text-lg sm:text-xl leading-[1.8] whitespace-pre-wrap">
            {post.content || '본문 내용이 없습니다.'}
          </div>
          
          {/* 추천 버튼 영역 */}
          <div className="mt-32 mb-16 flex justify-center gap-8">
            <button className="flex flex-col items-center gap-3 px-16 py-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:bg-blue-600/10 hover:border-blue-500 transition-all group active:scale-95 shadow-xl">
              <span className="text-5xl group-hover:scale-110 transition-transform">👍</span>
              <span className="text-[11px] font-black text-zinc-500 group-hover:text-blue-400 uppercase tracking-[0.3em]">추천 {post.likes || 0}</span>
            </button>
            <button className="flex flex-col items-center gap-3 px-16 py-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:bg-red-600/10 hover:border-red-500 transition-all group active:scale-95 shadow-xl">
              <span className="text-5xl group-hover:scale-110 transition-transform">👎</span>
              <span className="text-[11px] font-black text-zinc-500 group-hover:text-red-400 uppercase tracking-[0.3em]">비추천 0</span>
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <section className="border-t border-zinc-800 bg-zinc-900/10">
          <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></span>
              Comments
            </h2>
          </div>
          
          <div className="p-8 bg-zinc-950/50">
            <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 focus-within:border-blue-500/50 transition-all">
              <textarea 
                placeholder="Share your thoughts..."
                className="w-full bg-transparent border-none outline-none text-lg text-zinc-300 min-h-[150px] resize-none placeholder:text-zinc-800"
              />
              <div className="flex justify-end mt-6 pt-6 border-t border-zinc-800/50">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-blue-900/20">
                  POST COMMENT
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <footer className="p-8 border-t border-zinc-800 flex justify-between items-center bg-zinc-950">
          <a href="/" className="text-[11px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em] flex items-center gap-3 group">
            <span className="group-hover:-translate-x-2 transition-transform">←</span> Back to Board
          </a>
          <div className="flex gap-8">
            <button className="text-[11px] font-black text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors">Share</button>
            <button className="text-[11px] font-black text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors">Report</button>
          </div>
        </footer>
      </article>
    </div>
  );
}
