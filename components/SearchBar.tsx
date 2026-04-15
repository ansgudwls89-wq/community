'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 relative">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="글 검색..."
        className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-600/50 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
      />
      <button 
        type="submit"
        className="absolute right-3 top-2.5 text-zinc-400 dark:text-zinc-500 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        🔍
      </button>
    </form>
  );
}
