'use client';

import { supabase } from '@/utils/supabase';
import { useEffect, useState, useTransition } from 'react';
import { signOut } from '@/app/auth/actions';
import { renameSpace, deleteSpace, createSpace, syncSpacesFromPosts } from './actions';

interface Profile {
  id: string;
  email: string;
  nickname: string;
  energy: number;
  updated_at: string;
}

interface Space {
  slug: string;
  name: string;
}

export default function AdminPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [newSlug, setNewSlug] = useState('');
  const [newName, setNewName] = useState('');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'spaces' | 'users'>('spaces');
  const [isPending, startTransition] = useTransition();
  const [syncMsg, setSyncMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);

    // spaces 테이블에서 슬러그+이름 조회
    const { data: spacesData } = await supabase
      .from('spaces')
      .select('slug, name')
      .order('slug');
    setSpaces(spacesData || []);

    // Fetch Users (Profiles)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .order('energy', { ascending: false });
    setUsers(profileData || []);

    setLoading(false);
  }

  async function handleAddSpace() {
    const slugRegex = /^[a-zA-Z0-9-]+$/;
    if (!newSlug.trim()) return;
    if (!slugRegex.test(newSlug)) {
      alert('스페이스 주소(URL)는 영문, 숫자, 하이픈(-)만 가능합니다.');
      return;
    }
    const slug = newSlug.trim().toLowerCase();
    const name = newName.trim() || slug;

    startTransition(async () => {
      const result = await createSpace(slug, name);
      if (result.error) { alert('스페이스 생성 실패: ' + result.error); return; }
      setNewSlug('');
      setNewName('');
      fetchData();
    });
  }

  async function handleRenameSpace(slug: string) {
    if (!editingName.trim()) return;
    startTransition(async () => {
      const result = await renameSpace(slug, editingName.trim());
      if (result.error) { alert('이름 변경 실패: ' + result.error); return; }
      setEditingSlug(null);
      setEditingName('');
      fetchData();
    });
  }

  async function handleDeleteSpace(slug: string, name: string) {
    if (!confirm(`'${name}' 스페이스의 모든 게시글이 삭제됩니다. 정말 삭제하시겠습니까?`)) return;
    startTransition(async () => {
      await deleteSpace(slug);
      fetchData();
    });
  }

  function handleSyncSpaces() {
    startTransition(async () => {
      setSyncMsg('동기화 중...');
      const result = await syncSpacesFromPosts();
      setSyncMsg(result.error ? '오류: ' + result.error : `완료! ${result.count}개 스페이스 동기화됨`);
      fetchData();
      setTimeout(() => setSyncMsg(''), 3000);
    });
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
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="URL 주소 (영문, 예: humor)"
                className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="표시 이름 (예: 유머)"
                className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
              <button
                onClick={handleAddSpace}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
              >
                스페이스 생성
              </button>
            </div>
            <p className="mt-3 text-[11px] text-zinc-400 dark:text-zinc-500 italic">
              * URL 주소는 영문 소문자·숫자·하이픈만 가능합니다. 표시 이름은 한글·영어 모두 가능합니다.
            </p>
          </div>

          {/* 스페이스 관리 섹션 */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl transition-colors">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 transition-colors flex items-center justify-between">
              <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest transition-colors">
                스페이스 목록 ({spaces.length})
              </h2>
              <div className="flex items-center gap-3">
                {syncMsg && <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">{syncMsg}</span>}
                <button
                  onClick={handleSyncSpaces}
                  disabled={isPending}
                  className="text-[10px] font-black text-blue-600 dark:text-blue-500 hover:underline disabled:opacity-50"
                >
                  게시판→스페이스 동기화
                </button>
              </div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-900 transition-colors">
              {loading ? (
                <div className="p-10 text-center text-zinc-400 animate-pulse">데이터를 불러오는 중...</div>
              ) : spaces.length === 0 ? (
                <div className="p-10 text-center text-zinc-400 italic">생성된 스페이스가 없습니다.</div>
              ) : (
                spaces.map(space => (
                  <div key={space.slug} className="p-4 sm:p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-lg font-black text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-800 transition-colors flex-shrink-0 uppercase">
                        {space.slug[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingSlug === space.slug ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={e => setEditingName(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleRenameSpace(space.slug); if (e.key === 'Escape') setEditingSlug(null); }}
                              autoFocus
                              className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-blue-400 rounded-lg px-3 py-1.5 text-sm font-black outline-none"
                            />
                            <button onClick={() => handleRenameSpace(space.slug)} className="text-xs font-black text-white bg-blue-600 px-3 py-1.5 rounded-lg">저장</button>
                            <button onClick={() => setEditingSlug(null)} className="text-xs font-bold text-zinc-400 px-3 py-1.5 rounded-lg border border-zinc-200">취소</button>
                          </div>
                        ) : (
                          <>
                            <a
                              href={`/s/${encodeURIComponent(space.slug)}`}
                              className="font-black text-zinc-900 dark:text-zinc-100 transition-colors hover:text-blue-600 dark:hover:text-blue-400 block"
                            >
                              {space.name}
                            </a>
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold transition-colors">
                              URL: /s/{space.slug}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {editingSlug !== space.slug && (
                        <button
                          onClick={() => { setEditingSlug(space.slug); setEditingName(space.name); }}
                          className="px-3 py-2 text-xs font-black text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                        >
                          이름 변경
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSpace(space.slug, space.name)}
                        className="px-3 py-2 text-xs font-black text-zinc-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      >
                        삭제
                      </button>
                    </div>
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
                  <th className="py-3 px-4">에너지</th>
                  <th className="py-3 px-4">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 transition-colors">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-zinc-400 animate-pulse">데이터를 불러오는 중...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-zinc-400 italic">가입된 회원이 없습니다.</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all text-xs">
                      <td className="py-4 px-4 font-bold text-zinc-700 dark:text-zinc-300">
                        {user.email?.replace('@nol2.com', '')}
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-normal ml-1">({user.email})</span>
                      </td>
                      <td className="py-4 px-4 text-center font-black text-zinc-900 dark:text-zinc-100">
                        {user.nickname}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg font-black border border-blue-100 dark:border-blue-800/50">
                          ⚡ {user.energy || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-[11px] text-zinc-400 dark:text-zinc-600">
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
