export default function SignupSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 shadow-2xl transition-colors">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tighter">가입을 축하합니다!</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
          NOL2 커뮤니티의 일원이 되신 것을 환영합니다.<br />
          이메일 인증이 필요한 경우 메일을 확인해 주세요.<br />
          (테스트 환경에서는 바로 로그인이 가능할 수 있습니다.)
        </p>
        <a 
          href="/login"
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-4 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-95"
        >
          로그인하러 가기
        </a>
      </div>
    </div>
  )
}
