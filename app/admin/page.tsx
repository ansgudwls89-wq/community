'use client';

import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';

interface Profile {
  id: string;
  email: string;
  nickname: string;
  updated_at: string;
}

export default function AdminPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'spaces' | 'users'>('spaces');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    // Fetch Spaces
    const { data: postData } = await supabase.from('posts').select('category');
    const uniqueCategories = Array.from(new Set(postData?.map(p => p.category) || []));
    setCategories(uniqueCategories);

    // Fetch Users (Profiles)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });
    setUsers(profileData || []);
    
    setLoading(false);
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    
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
      fetchData();
    }
  }

  async function handleDeleteCategory(category: string) {
    if (!confirm(`'${category}' 스페이스의 모든 게시글이 삭제됩니다. 정말 삭제하시겠습니까?`)) return;

    const { error } = await supabase.from('posts').delete().eq('category', category);
    if (!error) {
      fetchData();
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter transition-colors">
          관리자 <span className="text-blue-600 dark:text-blue-500 ml-1">패널</span>
        </h1>
        <div className="flex gap-4 items-center">
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <button 
              onClick={() => setActiveTab('spaces')}
              className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === 'spaces' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              스페이스 관리
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === 'users' ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              회원 관리
            </button>
          </div>
          <a href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
            ← 메인으로
          </a>
        </div>
      </div>

      {activeTab === 'spaces' ? (
        <>
          {/* 스페이스 추가 섹션 */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl transition-colors">
            <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2 transition-colors">
              <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
              새 스페이스 생성
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
          </div>

          {/* 스페이스 관리 섹션 */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl transition-colors">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors">
              <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest transition-colors">
                스페이스 목록 ({categories.length})
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
                        <a 
                          href={`/s/${encodeURIComponent(cat)}`}
                          className="font-black text-zinc-900 dark:text-zinc-100 uppercase transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {cat}
                        </a>
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
        </>
      ) : (
        /* 회원 관리 섹션 */
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl transition-colors">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors flex justify-between items-center">
            <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest transition-colors">
              회원 목록 ({users.length})
            </h2>
            <button 
              onClick={fetchData}
              className="text-[10px] font-black text-blue-600 dark:text-blue-500 hover:underline"
            >
              새로고침
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">
                  <th className="py-3 px-4">아이디 (이메일)</th>
                  <th className="py-3 px-4">닉네임</th>
                  <th className="py-3 px-4">가입일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 transition-colors">
                {loading ? (
                  <tr><td colSpan={3} className="p-10 text-center text-zinc-400 animate-pulse">데이터를 불러오는 중...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={3} className="p-10 text-center text-zinc-400 italic">가입된 회원이 없습니다.</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all text-xs">
                      <td className="py-4 px-4 font-bold text-zinc-700 dark:text-zinc-300">
                        {user.email?.replace('@nol2.com', '')} 
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-normal ml-1">({user.email})</span>
                      </td>
                      <td className="py-4 px-4 text-center font-black text-blue-600 dark:text-blue-400">
                        {user.nickname}
                      </td>
                      <td className="py-4 px-4 text-center text-zinc-400 dark:text-zinc-600 font-medium">
                        {new Date(user.updated_at).toLocaleDateString('ko-KR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
