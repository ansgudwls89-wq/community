'use client';

import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase.from('posts').select('category');
    const uniqueCategories = Array.from(new Set(data?.map(p => p.category) || []));
    setCategories(uniqueCategories);
    setLoading(false);
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    
    // category 테이블이 따로 없으므로 샘플 게시글을 생성하여 카테고리를 등록하는 방식
    // 실제 운영 환경에서는 별도의 categories 테이블이 권장됩니다.
    const { error } = await supabase.from('posts').insert([
      { 
        title: `${newCategory} 스페이스가 생성되었습니다.`, 
        category: newCategory.trim(), 
        content: '새로운 스페이스의 시작을 축하합니다!',
        author: '시스템',
        idx: 1,
        views: 0,
        likes: 0,
        comments_count: 0
      }
    ]);

    if (!error) {
      setNewCategory('');
      fetchCategories();
    }
  }

  async function handleDeleteCategory(category: string) {
    if (!confirm(`'${category}' 스페이스의 모든 게시글이 삭제됩니다. 정말 삭제하시겠습니까?`)) return;

    const { error } = await supabase.from('posts').delete().eq('category', category);
    if (!error) {
      fetchCategories();
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter transition-colors">
          ADMIN <span className="text-blue-600 dark:text-blue-500 ml-1">PANEL</span>
        </h1>
        <a href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
          ← 메인으로
        </a>
      </div>

      {/* 스페이스 추가 섹션 */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl transition-colors">
        <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2 transition-colors">
          <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
          Create New Space
        </h2>
        <div className="flex gap-3">
          <input 
            type="text" 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="새 스페이스 이름 입력 (예: 애니메이션)"
            className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
          />
          <button 
            onClick={handleAddCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
          >
            스페이스 생성
          </button>
        </div>
        <p className="mt-3 text-[11px] text-zinc-400 dark:text-zinc-500 italic">
          * 새 스페이스를 생성하면 환영 게시글이 자동으로 하나 작성됩니다.
        </p>
      </div>

      {/* 스페이스 관리 섹션 */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl transition-colors">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors">
          <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest transition-colors">
            Manage Spaces
          </h2>
        </div>
        
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900 transition-colors">
          {loading ? (
            <div className="p-10 text-center text-zinc-400 animate-pulse">데이터를 불러오는 중...</div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center text-zinc-400 italic">생성된 스페이스가 없습니다.</div>
          ) : (
            categories.map(cat => (
              <div key={cat} className="p-4 sm:p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-lg font-black text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-800 transition-colors uppercase">
                    {cat[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-zinc-900 dark:text-zinc-100 uppercase transition-colors">{cat}</h3>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold transition-colors">ID: {encodeURIComponent(cat)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteCategory(cat)}
                  className="px-4 py-2 text-xs font-black text-zinc-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95"
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
