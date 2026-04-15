'use client';

import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function MobileMenu() {
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
          <div className="absolute top-16 right-4 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[70] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Menu</span>
              <ThemeToggle />
            </div>
            <button className="w-full text-left px-4 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              로그인
            </button>
            <button className="w-full text-left px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              회원가입
            </button>
            <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1">
              <a 
                href="/admin" 
                className="block px-4 py-3 text-[10px] font-black text-zinc-400 hover:text-blue-500 transition-colors uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                Admin Panel
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
