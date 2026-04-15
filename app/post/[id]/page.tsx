import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';
import VoteButtons from '@/components/VoteButtons';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';

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
            <a 
              href={`/s/${encodeURIComponent(post.category)}`}
              className="font-black text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-all"
            >
              {post.category}
            </a>
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
              <span className="text-blue-600 dark:text-blue-500 transition-colors">추천 {post.likes ?? 0}</span>
              <span className="text-red-600 dark:text-red-500 transition-colors">비추천 {post.dislikes ?? 0}</span>
              <span className="text-zinc-600 dark:text-zinc-400 transition-colors">댓글 {post.comments_count ?? 0}</span>
            </div>
          </div>
        </header>

        <article className="p-6 sm:p-8 min-h-[300px] bg-white dark:bg-zinc-950 transition-colors">
          <div 
            className="prose dark:prose-invert !max-w-none w-full text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed transition-colors"
            dangerouslySetInnerHTML={{ __html: post.content || '<p>본문 내용이 없습니다.</p>' }}
          />
          
          <VoteButtons postId={post.id} initialLikes={post.likes || 0} initialDislikes={post.dislikes || 0} />
        </article>

        <CommentForm postId={post.id} />
        
        <CommentList postId={post.id} />

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
