'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const STORAGE_KEY = 'nol2_recent_searches';
const MAX_RECENT = 8;

function getRecentSearches(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveSearch(query: string) {
  const prev = getRecentSearches().filter(q => q !== query);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([query, ...prev].slice(0, MAX_RECENT)));
}

function removeSearch(query: string) {
  const prev = getRecentSearches().filter(q => q !== query);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused) setRecentSearches(getRecentSearches());
  }, [isFocused]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    saveSearch(trimmed);
    setIsFocused(false);
    setQuery('');
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearch(query);
  }

  function handleRemove(e: React.MouseEvent, q: string) {
    e.stopPropagation();
    removeSearch(q);
    setRecentSearches(getRecentSearches());
  }

  const showDropdown = isFocused && recentSearches.length > 0 && !query;

  return (
    <div className="flex-1 relative">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="글 검색..."
          className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        />
        <button
          type="submit"
          className="absolute right-3 top-2.5 text-zinc-400 dark:text-zinc-500 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          🔍
        </button>
      </form>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl py-1 z-50 overflow-hidden"
        >
          <div className="px-3 py-1.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">최근 검색어</div>
          {recentSearches.map(q => (
            <div
              key={q}
              className="flex items-center justify-between px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer group"
              onClick={() => handleSearch(q)}
            >
              <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{q}</span>
              <button
                onClick={e => handleRemove(e, q)}
                className="text-zinc-300 dark:text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-400 text-xs ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
            <button
              onClick={() => { localStorage.removeItem(STORAGE_KEY); setRecentSearches([]); }}
              className="w-full text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 py-1.5 transition-colors"
            >
              전체 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
