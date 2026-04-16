'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const params = useParams();
  const category = params?.category as string | undefined;

  return (
    <div className="w-full p-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center transition-colors">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2">게시글을 불러오지 못했습니다</h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        {error.message || '알 수 없는 오류가 발생했습니다.'}
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/20"
        >
          다시 시도
        </button>
        {category && (
          <a
            href={`/s/${category}`}
            className="border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
          >
            목록으로
          </a>
        )}
        <a
          href="/"
          className="border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
        >
          메인으로
        </a>
      </div>
    </div>
  );
}
