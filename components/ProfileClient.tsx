'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import Image from 'next/image';
import { updateNicknameAction, updateAvatarAction, updatePasswordAction } from '@/app/profile/actions';

interface Post {
  id: number;
  idx: number;
  category: string;
  title: string;
  views: number;
  likes: number;
  comments_count: number;
  created_at: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  post_id: number;
  posts: {
    idx: number;
    category: string;
    title: string;
  } | null;
}

interface ProfileClientProps {
  profile: {
    id: string;
    nickname: string;
    avatar_url?: string | null;
    email: string;
    energy: number;
    created_at: string;
  };
  posts: Post[];
  comments: Comment[];
}

export default function ProfileClient({ profile, posts, comments }: ProfileClientProps) {
  const [tab, setTab] = useState<'posts' | 'comments' | 'bookmarks'>('posts');
  const [bookmarks, setBookmarks] = useState<{postId:number;title:string;category:string;idx:number;savedAt:string}[]>([]);

  useEffect(() => {
    try {
      setBookmarks(JSON.parse(localStorage.getItem('nol2_bookmarks') || '[]'));
    } catch {}
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);
  const [nickname, setNickname] = useState(profile.nickname);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [avatarError, setAvatarError] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [isSavingPw, setIsSavingPw] = useState(false);

  async function handlePasswordChange() {
    setPwError(''); setPwSuccess(false);
    setIsSavingPw(true);
    const result = await updatePasswordAction(currentPw, newPw);
    setIsSavingPw(false);
    if (result.error) { setPwError(result.error); }
    else { setPwSuccess(true); setCurrentPw(''); setNewPw(''); setTimeout(() => { setPwSuccess(false); setShowPasswordForm(false); }, 2000); }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError('');
    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);
    const result = await updateAvatarAction(formData);
    setIsUploadingAvatar(false);
    if (result.error) {
      setAvatarError(result.error);
    } else if (result.avatarUrl) {
      setAvatarUrl(result.avatarUrl);
    }
  }

  function handleSave() {
    setErrorMsg('');
    startTransition(async () => {
      const result = await updateNicknameAction(nicknameInput);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        setNickname(nicknameInput);
        setIsEditing(false);
      }
    });
  }

  function handleCancel() {
    setNicknameInput(nickname);
    setErrorMsg('');
    setIsEditing(false);
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const maskedEmail = profile.email.includes('@nol2.com')
    ? profile.email.replace('@nol2.com', '')
    : profile.email;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-20">
      {/* 헤더 */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
          내 <span className="text-blue-600 dark:text-blue-500">프로필</span>
        </h1>
        <a href="/" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
          ← 메인으로
        </a>
      </div>

      {/* 프로필 카드 */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-5">
          {/* 아바타 */}
          <div className="relative flex-shrink-0 group">
            <div
              className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-black text-white uppercase shadow-lg shadow-blue-500/30 overflow-hidden cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
              title="클릭하여 프로필 사진 변경"
            >
              {avatarUrl ? (
                <Image src={avatarUrl} alt="프로필 사진" width={64} height={64} className="w-full h-full object-cover" />
              ) : (
                nickname[0] || '?'
              )}
            </div>
            <div
              className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              <span className="text-white text-[10px] font-black">변경</span>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {isUploadingAvatar && (
              <div className="absolute inset-0 rounded-2xl bg-white/70 dark:bg-zinc-900/70 flex items-center justify-center">
                <span className="text-[10px] font-black text-zinc-500 animate-pulse">업로드 중</span>
              </div>
            )}
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0">
            {/* 닉네임 */}
            <div className="flex items-center gap-3 mb-1">
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    maxLength={20}
                    className="flex-1 max-w-[200px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm font-black text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="text-xs font-black text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                  >
                    {isPending ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-xs font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xl font-black text-zinc-900 dark:text-white">{nickname}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[10px] font-black text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 border border-zinc-200 dark:border-zinc-700 px-2 py-1 rounded-lg transition-all"
                  >
                    닉네임 변경
                  </button>
                </>
              )}
            </div>
            {errorMsg && (
              <p className="text-xs text-red-500 font-bold mb-1">{errorMsg}</p>
            )}
            {avatarError && (
              <p className="text-xs text-red-500 font-bold mb-1">{avatarError}</p>
            )}

            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mb-3">
              {maskedEmail}
            </p>

            {/* 배지들 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-800/50">
                ⚡ {profile.energy || 0} 에너지
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold">
                {joinDate} 가입
              </span>
            </div>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {!showPasswordForm ? (
            <button onClick={() => setShowPasswordForm(true)} className="text-[10px] font-black text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-lg transition-all">
              비밀번호 변경
            </button>
          ) : (
            <div className="space-y-2 max-w-xs">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">비밀번호 변경</p>
              <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="현재 비밀번호" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600/50 transition-all" />
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="새 비밀번호 (6자 이상)" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600/50 transition-all" />
              {pwError && <p className="text-xs text-red-500 font-bold">{pwError}</p>}
              {pwSuccess && <p className="text-xs text-green-500 font-bold">비밀번호가 변경되었습니다!</p>}
              <div className="flex gap-2">
                <button onClick={handlePasswordChange} disabled={isSavingPw} className="text-xs font-black text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-all disabled:opacity-50">{isSavingPw ? '변경 중...' : '변경'}</button>
                <button onClick={() => { setShowPasswordForm(false); setPwError(''); setCurrentPw(''); setNewPw(''); }} className="text-xs font-bold text-zinc-400 hover:text-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-all">취소</button>
              </div>
            </div>
          )}
        </div>

        {/* 통계 */}
        <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3 gap-4">
          {[
            { label: '작성한 글', value: posts.length },
            { label: '작성한 댓글', value: comments.length },
            { label: '에너지', value: profile.energy || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-zinc-900 dark:text-white">{value}</div>
              <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 w-fit">
        {([['posts', `작성한 글 (${posts.length})`], ['comments', `작성한 댓글 (${comments.length})`], ['bookmarks', `저장한 글 (${bookmarks.length})`]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`px-5 py-1.5 text-xs font-black rounded-lg transition-all ${tab === key ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* 작성한 글 목록 */}
      {tab === 'posts' && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          {posts.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 dark:text-zinc-600 italic text-sm">
              작성한 글이 없습니다.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">
                  <th className="py-3 px-4 text-left">제목</th>
                  <th className="py-3 px-4 w-[80px] hidden sm:table-cell">스페이스</th>
                  <th className="py-3 px-4 w-[60px] hidden sm:table-cell">조회</th>
                  <th className="py-3 px-4 w-[60px] hidden sm:table-cell">추천</th>
                  <th className="py-3 px-4 w-[110px] hidden md:table-cell">작성일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all group text-[13px]">
                    <td className="py-3 px-4">
                      <a
                        href={`/s/${encodeURIComponent(post.category)}/${post.idx}`}
                        className="font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 flex items-center gap-1.5"
                      >
                        <span className="truncate">{post.title}</span>
                        {post.comments_count > 0 && (
                          <span className="text-[11px] font-black text-blue-600/80 dark:text-blue-500/80 flex-shrink-0">[{post.comments_count}]</span>
                        )}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-center hidden sm:table-cell">
                      <a
                        href={`/s/${encodeURIComponent(post.category)}`}
                        className="text-[11px] font-black text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-all"
                      >
                        {post.category}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-center text-[11px] font-bold text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">
                      {post.views ?? 0}
                    </td>
                    <td className="py-3 px-4 text-center text-[11px] font-bold text-blue-600 dark:text-blue-400 hidden sm:table-cell">
                      {post.likes ?? 0}
                    </td>
                    <td className="py-3 px-4 text-center text-[11px] text-zinc-400 dark:text-zinc-500 hidden md:table-cell">
                      {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 저장한 글 목록 */}
      {tab === 'bookmarks' && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl divide-y divide-zinc-100 dark:divide-zinc-900">
          {bookmarks.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 dark:text-zinc-600 italic text-sm">저장한 글이 없습니다.</div>
          ) : (
            bookmarks.slice().reverse().map((b) => (
              <div key={b.postId} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all flex items-center justify-between gap-3">
                <a href={`/s/${encodeURIComponent(b.category)}/${b.idx}`} className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors">{b.title}</p>
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase mt-0.5">{b.category}</p>
                </a>
                <button
                  onClick={() => {
                    const updated = bookmarks.filter(bm => bm.postId !== b.postId);
                    localStorage.setItem('nol2_bookmarks', JSON.stringify(updated));
                    setBookmarks(updated);
                  }}
                  className="text-[10px] font-bold text-zinc-400 hover:text-red-500 px-2 py-1 rounded transition-colors flex-shrink-0"
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* 작성한 댓글 목록 */}
      {tab === 'comments' && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl divide-y divide-zinc-100 dark:divide-zinc-900">
          {comments.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 dark:text-zinc-600 italic text-sm">
              작성한 댓글이 없습니다.
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all group">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2 line-clamp-2 leading-relaxed">
                  {comment.content}
                </p>
                <div className="flex items-center justify-between gap-2">
                  {comment.posts ? (
                    <a
                      href={`/s/${encodeURIComponent(comment.posts.category)}/${comment.posts.idx}`}
                      className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate flex items-center gap-1"
                    >
                      <span className="text-blue-600 dark:text-blue-500 font-black uppercase">[{comment.posts.category}]</span>
                      <span className="truncate">{comment.posts.title}</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-zinc-300 dark:text-zinc-700">삭제된 게시글</span>
                  )}
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-600 flex-shrink-0">
                    {new Date(comment.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
