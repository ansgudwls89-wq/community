'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { signOut } from '@/app/auth/actions';

interface MobileMenuProps {
  user: {
    email?: string
    nickname?: string
    energy?: number
    newCommentCount?: number
  } | null
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors relative"
        aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
        {!isOpen && (user?.newCommentCount ?? 0) > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setIsOpen(false)}
          />

          {/* 슬라이드 패널 (오른쪽에서 등장) */}
          <div className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-200">
            {/* 헤더 */}
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-lg font-black text-zinc-900 dark:text-white tracking-tighter">NOL2.</span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button onClick={() => setIsOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 유저 정보 */}
            {user && (
              <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-black text-zinc-900 dark:text-white truncate">{user.nickname || user.email}</p>
                  <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-800/50">⚡ {user.energy || 0}</span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
              </div>
            )}

            {/* 메뉴 항목 */}
            <nav className="flex-1 overflow-y-auto py-2">
              <div className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">탐색</div>
              <a href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                홈
              </a>
              <a href="/s/best" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                실시간 베스트
              </a>
              <a href="/s/popular" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                주간 인기
              </a>

              <div className="px-3 py-2 mt-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-t border-zinc-100 dark:border-zinc-800 pt-4">계정</div>
              {user ? (
                <>
                  <a href="/profile" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-5 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    내 프로필
                    {(user.newCommentCount ?? 0) > 0 && (
                      <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">새 댓글 {user.newCommentCount}</span>
                    )}
                  </a>
                  <a href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    관리자 패널
                  </a>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-5 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    로그인
                  </a>
                  <a href="/signup" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    회원가입
                  </a>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
