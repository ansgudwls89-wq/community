import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { error: rpcError } = await supabase.rpc('increment_views', { post_id: id });
  
  if (rpcError) {
    console.error('RPC Error (Views):', rpcError.message);
    const { data: currentData } = await supabase.from('posts').select('views').eq('id', id).single();
    if (currentData) {
      await supabase.from('posts').update({ views: (currentData.views || 0) + 1 }).eq('id', id);
    }
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    return (
      <div className="w-full p-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-500 dark:text-zinc-400 text-center transition-colors">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">게시글을 찾을 수 없습니다.</h2>
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">← 목록으로 돌아가기</a>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
        <header className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors">
          <div className="flex items-center gap-2 mb-3 text-[10px]">
            <span className="font-black text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider transition-colors">
              {post.category}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 font-bold">/</span>
            <span className="text-zinc-400 dark:text-zinc-600 font-bold tracking-tighter transition-colors">POST #{post.idx || post.id}</span>
          </div>
          
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight leading-tight transition-colors">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-500 transition-colors">
            <div className="flex items-center gap-3">
              <span className="font-black text-zinc-700 dark:text-zinc-200 transition-colors">{post.author || '익명'}</span>
              <span className="text-zinc-200 dark:text-zinc-800">|</span>
              <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
            </div>
            <div className="flex items-center gap-4 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="text-blue-600 dark:text-blue-500 animate-pulse transition-colors">●</span> 조회 
                <span className="text-zinc-900 dark:text-zinc-100 font-black transition-colors">{post.views ?? 0}</span>
              </span>
              <span>추천 {post.likes ?? 0}</span>
              <span className="text-blue-600 dark:text-blue-500 transition-colors">댓글 {post.comments_count ?? 0}</span>
            </div>
          </div>
        </header>

        <article className="p-6 sm:p-8 min-h-[300px] bg-white dark:bg-zinc-950 transition-colors">
          <div 
            className="prose dark:prose-invert !max-w-none w-full text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed transition-colors"
            dangerouslySetInnerHTML={{ __html: post.content || '<p>본문 내용이 없습니다.</p>' }}
          />
          
          <div className="mt-16 mb-8 flex justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-blue-600/10 hover:border-blue-500 transition-all group active:scale-95 shadow-lg">
              <span className="text-lg">👍</span>
              <span className="text-[11px] font-black text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">추천 {post.likes || 0}</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-red-600/10 hover:border-red-500 transition-all group active:scale-95 shadow-lg">
              <span className="text-lg">👎</span>
              <span className="text-[11px] font-black text-zinc-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">비추천 0</span>
            </button>
          </div>
        </article>

        <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/10 p-6 sm:p-8 text-center sm:text-left transition-colors">
          <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2 justify-center sm:justify-start transition-colors">
            <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
            Comments
          </h2>
          <div className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 focus-within:border-blue-500/50 transition-all">
            <textarea 
              placeholder="댓글을 입력하세요"
              className="w-full bg-transparent border-none outline-none text-sm text-zinc-700 dark:text-zinc-300 min-h-[80px] resize-none transition-colors"
            />
            <div className="flex justify-end mt-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black px-6 py-2 rounded-lg transition-all shadow-xl shadow-blue-900/20">
                등록
              </button>
            </div>
          </div>
        </section>

        <footer className="p-5 border-t border-zinc-200 dark:border-zinc-800 flex justify-between bg-zinc-50 dark:bg-zinc-950 items-center transition-colors">
          <a href="/" className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all uppercase tracking-widest px-4 py-2 border border-zinc-200 dark:border-zinc-900 rounded-lg hover:bg-white dark:hover:bg-zinc-900 transition-colors">
            ← Back to Board
          </a>
          <button className="text-[10px] font-bold text-zinc-400 dark:text-zinc-700 hover:text-red-500 uppercase transition-colors px-4 py-2">Report</button>
        </footer>
      </div>
    </div>
  );
}
