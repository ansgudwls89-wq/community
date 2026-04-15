'use client';

import { useState } from 'react';
import { createCommentAction } from '@/app/s/[category]/[idx]/actions';

interface Comment {
  id: number;
  post_id: number;
  author: string;
  content: string;
  created_at: string;
  parent_id: number | null;
  is_anonymous: boolean;
  ip_address: string | null;
}

interface CommentFormProps {
  postId: number;
  parentId?: number | null;
  onSuccess?: (newComment: Comment) => void;
  placeholder?: string;
  autoFocus?: boolean;
  initialNickname?: string;
}

export default function CommentForm({ postId, parentId = null, onSuccess, placeholder = "댓글을 입력하세요", autoFocus = false, initialNickname = "" }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(initialNickname || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If no initialNickname, user is likely not logged in (passed from parent)
  // But let's check it more explicitly in the UI
  const isLoggedIn = !!initialNickname;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || !content.trim()) return;

    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newComment = await createCommentAction({
        postId,
        content: content.trim(),
        author: author.trim() || '익명',
        parentId,
        isAnonymous
      });
      
      setContent('');
      if (!initialNickname) setAuthor('');
      
      if (onSuccess && newComment) {
        onSuccess(newComment as any);
      }
    } catch (error: any) {
      alert(`댓글 작성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoggedIn && !parentId) {
    return (
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 p-6 sm:p-8 text-center transition-colors">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <a href="/login" className="text-blue-600 dark:text-blue-500 font-bold hover:underline">로그인</a> 후 댓글을 작성할 수 있습니다.
        </p>
      </section>
    );
  }

  if (!isLoggedIn && parentId) return null; // Don't show reply form if not logged in

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <input 
            type="text"
            placeholder="닉네임 (익명)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isAnonymous}
            className="w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-sm disabled:opacity-50"
          />
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-[11px] font-bold text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">익명으로 작성</span>
          </label>
        </div>
      </div>
      <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 focus-within:border-blue-500/50 transition-all shadow-sm">
        <textarea 
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          autoFocus={autoFocus}
          className="w-full bg-transparent border-none outline-none text-sm text-zinc-700 dark:text-zinc-300 min-h-[80px] resize-none transition-colors"
        />
        <div className="flex justify-end mt-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
          <button 
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black px-6 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? '등록 중...' : parentId ? '답글 등록' : '댓글 등록'}
          </button>
        </div>
      </div>
    </form>
  );

  if (parentId) {
    return (
      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
        {formContent}
      </div>
    );
  }

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 p-6 sm:p-8 transition-colors">
      <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2 transition-colors">
        <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
        댓글 쓰기
      </h2>
      {formContent}
    </section>
  );
}
