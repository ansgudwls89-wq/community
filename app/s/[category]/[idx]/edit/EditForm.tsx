'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TipTapEditor from '@/components/TipTapEditor';
import { updatePostAction } from '@/app/s/[category]/write/actions';
import { toast } from 'sonner';

interface Post {
  id: number;
  idx: number;
  title: string;
  content: string;
  category: string;
}

export default function EditForm({ post }: { post: Post }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { redirectTo } = await updatePostAction({
        postId: post.id,
        category: post.category,
        idx: post.idx,
        title,
        content,
      });
      router.push(redirectTo);
    } catch (error: any) {
      toast.error(`수정 중 오류가 발생했습니다: ${error.message}`);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
      <header className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors">
        <h1 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
          <span className="text-blue-600 dark:text-blue-500 mr-2">[{post.category}]</span>
          게시글 수정
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base text-zinc-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">내용</label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-900">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all px-4 py-2"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-black px-10 py-3 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '수정 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </div>
  );
}
