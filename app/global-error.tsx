'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="flex flex-col items-center justify-center min-h-screen bg-white text-zinc-900 p-8 text-center">
        <div className="text-5xl mb-6">⚠️</div>
        <h1 className="text-2xl font-black mb-3">예상치 못한 오류가 발생했습니다</h1>
        <p className="text-sm text-zinc-500 mb-8 max-w-md">
          {error.message || '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-6 py-2.5 rounded-xl transition-all"
          >
            다시 시도
          </button>
          <a
            href="/"
            className="border border-zinc-200 text-zinc-600 hover:text-zinc-900 font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
          >
            메인으로
          </a>
        </div>
      </body>
    </html>
  );
}
