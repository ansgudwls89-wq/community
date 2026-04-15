'use client'

import { signOut } from '@/app/auth/actions'
import { useState } from 'react'

interface UserMenuProps {
  user: {
    email?: string
    nickname?: string
  }
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative group">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all shadow-sm"
      >
        <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black text-white uppercase">
          {(user.nickname || user.email || '?')[0]}
        </div>
        <span className="text-xs font-black text-zinc-700 dark:text-zinc-300 max-w-[80px] truncate">
          {user.nickname || user.email?.split('@')[0]}
        </span>
        <span className={`text-[8px] text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Account</p>
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 truncate">{user.email}</p>
            </div>
            <a href="/profile" className="block px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">내 프로필</a>
            <a href="/admin" className="block px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">관리자 패널</a>
            <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
              <button 
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
