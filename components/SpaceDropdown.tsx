'use client';

import { useState } from 'react';

export default function SpaceDropdown({ initialCategories }: { initialCategories: string[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = initialCategories.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative group">
      {/* 드롭다운 버튼 */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-black text-zinc-500 dark:text-zinc-400 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-2 min-w-[100px] justify-between">
        <span>전체 스페이스</span>
        <span className="text-[8px] text-zinc-400 dark:text-zinc-600 group-hover:rotate-180 transition-transform duration-200">▼</span>
      </div>

      {/* 드롭다운 메뉴 */}
      <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100 max-h-[80vh] flex flex-col">
        
        {/* 상단 고정 섹션 */}
        <div className="px-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Main</div>
          <a href="/space/best" className="block px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors">실시간 베스트</a>
          <a href="/space/popular" className="block px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors">주간 인기</a>
        </div>

        {/* 스페이스 검색창 */}
        <div className="p-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="스페이스 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-[11px] outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
            <span className="absolute right-2 top-2 text-[10px]">🔍</span>
          </div>
        </div>

        {/* 스페이스 리스트 (스크롤 영역) */}
        <div className="flex-1 overflow-y-auto px-2 min-h-0">
          <div className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Spaces</div>
          <div className="space-y-0.5">
            {filteredCategories.length === 0 ? (
              <div className="px-3 py-4 text-[11px] text-zinc-400 italic text-center">검색 결과가 없습니다.</div>
            ) : (
              filteredCategories.map(cat => (
                <a 
                  key={cat} 
                  href={`/space/${encodeURIComponent(cat)}`} 
                  className="block px-3 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors uppercase truncate"
                >
                  {cat}
                </a>
              ))
            )}
          </div>
        </div>

        {/* 어드민 링크 (선택 사항) */}
        <div className="mt-2 px-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <a href="/admin" className="block px-3 py-2 text-[10px] font-black text-zinc-400 hover:text-blue-500 transition-colors uppercase tracking-widest text-center">
            Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}
