'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">NOL2.</a>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">비밀번호 찾기</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📧</div>
              <p className="font-black text-zinc-900 dark:text-white">이메일을 확인하세요</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                <strong>{email}</strong>로 비밀번호 재설정 링크를 발송했습니다.
              </p>
              <a href="/login" className="block text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline mt-4">
                로그인으로 돌아가기
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-widest">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="가입한 이메일 주소"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                />
              </div>
              {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                {loading ? '전송 중...' : '재설정 링크 전송'}
              </button>
              <a href="/login" className="block text-center text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                로그인으로 돌아가기
              </a>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
