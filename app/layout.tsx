import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Community",
  description: "현대적인 커뮤니티 경험",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen bg-slate-50">
        {/* 네비게이션 */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="container-custom h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a href="/" className="text-2xl font-black tracking-tight text-primary">COMMU.</a>
              <nav className="hidden md:flex items-center gap-1">
                <a href="/" className="nav-link">홈</a>
                <a href="/popular" className="nav-link">인기</a>
                <a href="/channels" className="nav-link">채널</a>
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="text-sm font-semibold px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors">
                로그인
              </button>
              <button className="text-sm font-semibold px-5 py-2.5 bg-primary text-white rounded-xl shadow-sm hover:bg-primary-dark transition-all">
                회원가입
              </button>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="container-custom flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
          <div className="lg:col-span-8">
            {children}
          </div>

          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            {/* 검색창 */}
            <div className="card p-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="관심있는 게시글을 검색해보세요"
                  className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* 인기 채널 목록 */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800">🔥 인기 채널</h2>
                <button className="text-xs text-slate-400 hover:text-primary transition-colors">더보기</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "게임 라운지", icon: "🎮", count: "1.2k" },
                  { name: "IT & 테크 뉴스", icon: "💻", count: "850" },
                  { name: "오늘의 일상", icon: "☕", count: "2.4k" },
                  { name: "질문 & 답변", icon: "💡", count: "420" }
                ].map((channel, i) => (
                  <a key={i} href="#" className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-lg text-lg group-hover:bg-white transition-colors">{channel.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{channel.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{channel.count}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </main>

        <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
          <div className="container-custom flex flex-col items-center gap-4">
            <span className="text-xl font-black text-slate-200">COMMU.</span>
            <p className="text-sm text-slate-400">&copy; 2026 Community Platform Inc.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
