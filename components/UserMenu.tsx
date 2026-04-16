'use client'

import { signOut } from '@/app/auth/actions'
import { useState } from 'react'

interface UserMenuProps {
  user: {
    email?: string
    nickname?: string
    energy?: number
    newCommentCount?: number
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
        <div className="flex items-center gap-1.5 mr-1 pr-2 border-r border-zinc-200 dark:border-zinc-800">
          <span className="text-blue-600 dark:text-blue-400 text-[10px]">⚡</span>
          <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">{user.energy || 0}</span>
        </div>
        <div className="relative w-6 h-6">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black text-white uppercase">
            {(user.nickname || user.email || '?')[0]}
          </div>
          {(user.newCommentCount ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white leading-none">
              {user.newCommentCount! > 9 ? '9+' : user.newCommentCount}
            </span>
          )}
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
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">계정 정보</p>
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 truncate">{user.email}</p>
            </div>
            <a href="/profile" className="flex items-center justify-between px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              내 프로필
              {(user.newCommentCount ?? 0) > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  새 댓글 {user.newCommentCount}
                </span>
              )}
            </a>
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
