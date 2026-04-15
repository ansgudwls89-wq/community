'use client';

import { useState } from 'react';
import { createCommentAction } from '@/app/post/[id]/actions';

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await createCommentAction({
        postId,
        content: content.trim(),
        author: author.trim() || '익명'
      });
      setContent('');
      setAuthor('');
    } catch (error: any) {
      alert(`댓글 작성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 p-6 sm:p-8 transition-colors">
      <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2 transition-colors">
        <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
        Add Comment
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <input 
            type="text"
            placeholder="닉네임 (익명)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
        </div>
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 focus-within:border-blue-500/50 transition-all shadow-sm">
          <textarea 
            placeholder="댓글을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full bg-transparent border-none outline-none text-sm text-zinc-700 dark:text-zinc-300 min-h-[80px] resize-none transition-colors"
          />
          <div className="flex justify-end mt-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <button 
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black px-6 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? '등록 중...' : '댓글 등록'}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
