import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 1. 게시글 데이터 가져오기
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    return notFound();
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* 게시글 헤더 영역 */}
      <header className="p-6 border-b border-zinc-800 bg-zinc-900/30">
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
          <div className="flex items-center gap-4">
            <span>조회 1,242</span>
            <span>추천 {post.likes || 0}</span>
            <span>댓글 {post.comments_count || 0}</span>
          </div>
        </div>
      </header>

      {/* 게시글 본문 영역 */}
      <article className="p-8 min-h-[400px]">
        <div className="prose prose-invert max-w-none text-zinc-300 leading-loose whitespace-pre-wrap">
          {post.content || '본문 내용이 없습니다.'}
        </div>
        
        {/* 게시글 하단 추천/비추천 버튼 */}
        <div className="mt-16 flex justify-center gap-4">
          <button className="flex flex-col items-center gap-1 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-blue-600/10 hover:border-blue-500 transition-all group">
            <span className="text-2xl group-hover:scale-110 transition-transform">👍</span>
            <span className="text-xs font-bold text-zinc-400 group-hover:text-blue-400">추천 {post.likes || 0}</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-red-600/10 hover:border-red-500 transition-all group">
            <span className="text-2xl group-hover:scale-110 transition-transform">👎</span>
            <span className="text-xs font-bold text-zinc-400 group-hover:text-red-400">비추천 0</span>
          </button>
        </div>
      </article>

      {/* 댓글 섹션 헤더 */}
      <section className="border-t border-zinc-800 bg-zinc-900/20">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Comments</h2>
          <span className="text-xs text-zinc-500">총 {post.comments_count || 0}개</span>
        </div>
        
        {/* 댓글 입력창 placeholder */}
        <div className="p-6 bg-zinc-900/40">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <textarea 
              placeholder="댓글을 입력해 주세요"
              className="w-full bg-transparent border-none outline-none text-sm text-zinc-300 min-h-[80px] resize-none"
            />
            <div className="flex justify-end mt-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                등록
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 목록으로 이동 버튼 */}
      <footer className="p-6 border-t border-zinc-800 flex justify-between bg-zinc-900/10">
        <a href="/" className="text-xs font-bold text-zinc-500 hover:text-white transition-all">
          ← 목록으로 돌아가기
        </a>
        <div className="flex gap-2">
          <button className="text-xs font-bold text-zinc-500 hover:text-white px-3 py-1">신고</button>
          <button className="text-xs font-bold text-zinc-500 hover:text-white px-3 py-1">수정</button>
        </div>
      </footer>
    </div>
  );
}
