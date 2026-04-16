import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — 페이지를 찾을 수 없습니다 | NOL2',
};

export default function NotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-32 text-center">
      <div className="text-8xl font-black text-zinc-100 dark:text-zinc-900 mb-6 select-none leading-none">
        404
      </div>
      <h1 className="text-2xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10 max-w-sm">
        요청하신 페이지가 삭제되었거나 주소가 변경되었습니다.
      </p>
      <div className="flex gap-3">
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
        >
          메인으로
        </a>
        <a
          href="/search"
          className="border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-bold text-sm px-8 py-3 rounded-xl transition-all"
        >
          검색하기
        </a>
      </div>
    </div>
  );
}
