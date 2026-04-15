'use client';

import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { signOut } from '@/app/auth/actions';

interface MobileMenuProps {
  user: {
    email?: string
    nickname?: string
  } | null
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[60]"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-16 right-4 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[70] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">메뉴</span>
              <ThemeToggle />
            </div>
            
            {user ? (
              <>
                <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs font-black text-zinc-900 dark:text-white truncate">{user.nickname || user.email}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                </div>
                <a href="/profile" className="block px-4 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">내 프로필</a>
                <a href="/admin" className="block px-4 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">관리자 패널</a>
                <button 
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="block px-4 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors" onClick={() => setIsOpen(false)}>
                  로그인
                </a>
                <a href="/signup" className="block px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors" onClick={() => setIsOpen(false)}>
                  회원가입
                </a>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
