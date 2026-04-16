'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TipTapEditor from './TipTapEditor';
import { createPostAction } from '@/app/s/[category]/write/actions';

interface WriteFormProps {
  categories: string[];
  defaultCategory?: string;
  initialNickname?: string;
}

export default function WriteForm({ categories, defaultCategory, initialNickname }: WriteFormProps) {
  const router = useRouter();
  const draftKey = `nol2_draft_${defaultCategory || 'general'}`;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(defaultCategory || (categories.length > 0 ? categories[0] : ''));
  const [author, setAuthor] = useState(initialNickname || '');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // 임시저장 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.title || draft.content) setHasDraft(true);
      }
    } catch {}
  }, [draftKey]);

  // 자동 저장 (1초 디바운스)
  const saveDraft = useCallback(() => {
    if (!title && !content) return;
    localStorage.setItem(draftKey, JSON.stringify({ title, content, savedAt: new Date().toISOString() }));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 1500);
  }, [title, content, draftKey]);

  useEffect(() => {
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [saveDraft]);

  function loadDraft() {
    try {
      const saved = localStorage.getItem(draftKey);
      if (!saved) return;
      const draft = JSON.parse(saved);
      if (draft.title) setTitle(draft.title);
      if (draft.content) setContent(draft.content);
      setHasDraft(false);
    } catch {}
  }

  function clearDraft() {
    localStorage.removeItem(draftKey);
    setHasDraft(false);
  }

  const isLoggedIn = !!initialNickname;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    if (!title || !category || !content) {
      alert('제목, 카테고리, 내용을 모두 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPostAction({ title, category, content, author });
      clearDraft();
    } catch (error: any) {
      if (error.message === 'NEXT_REDIRECT') return;
      alert(`글 작성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-2xl transition-colors">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-xl font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tight">로그인 필요</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">게시글을 작성하려면 로그인이 필요합니다.</p>
        <button 
          onClick={() => router.push('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-10 py-3 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-95"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-colors">
      <header className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight transition-colors">
            <span className="text-blue-600 dark:text-blue-500 mr-2">[{category}]</span>
            새 글 작성
          </h1>
          <div className="flex items-center gap-2">
            {draftSaved && <span className="text-[10px] text-zinc-400 font-bold animate-pulse">임시저장됨</span>}
            {hasDraft && (
              <button onClick={loadDraft} className="text-[10px] font-black text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                임시저장 불러오기
              </button>
            )}
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1 transition-colors">제목</label>
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="제목을 입력해 주세요"
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-base text-zinc-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1 transition-colors">내용</label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-900 transition-colors">
          <button 
            type="button"
            onClick={() => router.back()}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all px-4 py-2 transition-colors"
          >
            취소
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-black px-10 py-3 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '작성 중...' : '작성 완료'}
          </button>
        </div>
      </form>
    </div>
  );
}
