import { login } from '@/app/auth/actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  const { error } = await searchParams

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden transition-colors">
        <header className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 text-center">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
            LOGIN TO <span className="text-blue-600 dark:text-blue-500">NOL2</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-bold">다시 만나서 반가워요!</p>
        </header>

        <form action={login} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-1">ID</label>
            <input 
              name="email"
              type="text"
              placeholder="아이디를 입력하세요"
              required
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Password</label>
              <a href="#" className="text-[10px] font-bold text-blue-600 dark:text-blue-500 hover:underline">비밀번호 찾기</a>
            </div>
            <input 
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-600/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-4 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] mt-4"
          >
            로그인
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100 dark:border-zinc-900"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-white dark:bg-zinc-950 px-2 text-zinc-400">Or connect with</span></div>
          </div>

          <p className="text-center text-[11px] text-zinc-500 dark:text-zinc-400">
            아직 계정이 없으신가요? <a href="/signup" className="text-blue-600 dark:text-blue-500 font-black hover:underline ml-1">회원가입</a>
          </p>
        </form>
      </div>
    </div>
  )
}
