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
    <div className="w-full flex flex-col items-stretch">
      {/* 게시글 전체 카드 */}
      <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* 헤더 */}
        <header className="w-full p-6 sm:p-8 border-b border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-zinc-700 text-sm font-bold">/</span>
            <span className="text-xs text-zinc-600 font-bold tracking-tighter">POST ID: {post.id}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-6 leading-[1.2] tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4 text-zinc-400">
              <span className="font-black text-zinc-200">{post.author || '익명'}</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
              <span>{new Date(post.created_at).toLocaleString('ko-KR', { dateStyle: 'long', timeStyle: 'short' })}</span>
            </div>
            <div className="flex items-center gap-5 font-bold text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="text-[10px] text-zinc-700">VIEWS</span> 1,242</span>
              <span className="flex items-center gap-1.5"><span className="text-[10px] text-zinc-700">VOTES</span> {post.likes || 0}</span>
              <span className="flex items-center gap-1.5 text-blue-500"><span className="text-[10px] text-zinc-700">COMMENTS</span> {post.comments_count || 0}</span>
            </div>
          </div>
        </header>

        {/* 본문 - max-w-none을 !important로 적용 */}
        <article className="w-full p-6 sm:p-10 min-h-[500px] flex flex-col">
          <div className="prose prose-invert !max-w-full w-full text-zinc-300 text-base sm:text-lg leading-[1.8] whitespace-pre-wrap break-words">
            {post.content || '본문 내용이 없습니다.'}
          </div>
          
          <div className="mt-24 mb-12 flex justify-center gap-8">
            <button className="flex flex-col items-center gap-3 px-12 py-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-blue-600/10 hover:border-blue-500 transition-all group active:scale-95">
              <span className="text-4xl group-hover:scale-110 transition-transform">👍</span>
              <span className="text-[11px] font-black text-zinc-500 group-hover:text-blue-500 uppercase tracking-[0.2em]">Upvote {post.likes || 0}</span>
            </button>
            <button className="flex flex-col items-center gap-3 px-12 py-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:bg-red-600/10 hover:border-red-500 transition-all group active:scale-95">
              <span className="text-4xl group-hover:scale-110 transition-transform">👎</span>
              <span className="text-[11px] font-black text-zinc-500 group-hover:text-red-500 uppercase tracking-[0.2em]">Downvote 0</span>
            </button>
          </div>
        </article>

        {/* 댓글 섹션 */}
        <section className="w-full border-t border-zinc-800 bg-zinc-900/10">
          <div className="p-6 sm:p-8 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.1em] flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              Join the Conversation
            </h2>
            <span className="text-[10px] font-black text-zinc-600 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
              {post.comments_count || 0} COMMENTS
            </span>
          </div>
          
          <div className="p-6 sm:p-8 bg-zinc-950/50">
            <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
              <textarea 
                placeholder="Share your thoughts with the community..."
                className="w-full bg-transparent border-none outline-none text-base text-zinc-300 min-h-[120px] resize-none placeholder:text-zinc-700 leading-relaxed"
              />
              <div className="flex justify-between items-center mt-6 pt-5 border-t border-zinc-800/50">
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Markdown supported</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-8 py-3 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 푸터 */}
        <footer className="w-full p-6 sm:p-8 border-t border-zinc-800 flex justify-between items-center bg-zinc-950">
          <a href="/" className="text-[10px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em] flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Board
          </a>
          <div className="flex gap-6">
            <button className="text-[10px] font-black text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors">Share</button>
            <button className="text-[10px] font-black text-zinc-700 hover:text-zinc-400 uppercase tracking-widest transition-colors">Report</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
