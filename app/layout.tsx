import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arca Style Community",
  description: "Next.js 14 App Router Dark Mode Community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
        {/* 상단 고정 헤더 */}
        <header className="fixed top-0 w-full h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 z-50">
          <div className="max-w-[1280px] mx-auto h-full px-4 flex items-center justify-between gap-4">
            {/* 로고 */}
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-black text-white tracking-tighter hover:text-blue-500 transition-colors">
                ARCA.
              </a>
            </div>

            {/* 중앙 검색 영역 + 커스텀 DIV 드롭다운 */}
            <div className="flex-1 max-w-3xl flex items-center gap-2">
              <div className="relative group">
                {/* 드롭다운 버튼 역할을 하는 DIV */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-black text-zinc-400 cursor-pointer hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-2 min-w-[80px] justify-between">
                  <span>베스트</span>
                  <span className="text-[8px] text-zinc-600 group-hover:rotate-180 transition-transform duration-200">▼</span>
                </div>

                {/* 드롭다운 메뉴 (DIV 리스트) */}
                <div className="absolute top-full left-0 mt-2 w-32 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100">
                  <div className="px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors">베스트</div>
                  <div className="px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors">공지</div>
                  <div className="px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors">문의</div>
                  <div className="px-4 py-2 text-xs font-bold text-zinc-400 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors">유머</div>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="관심 있는 스페이스를 검색해 보세요"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all placeholder:text-zinc-600"
                />
                <span className="absolute right-3 top-2.5 text-zinc-500 cursor-pointer hover:text-white transition-colors">🔍</span>
              </div>
            </div>

            {/* 우측 유틸리티 */}
            <div className="flex items-center gap-2">
              <button className="hidden sm:block text-zinc-400 hover:text-white transition-all text-sm font-bold px-3 py-2">로그인</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95">회원가입</button>
            </div>
          </div>
        </header>

        <main className="max-w-[1280px] mx-auto pt-24 px-4 flex-1 w-full text-zinc-100 font-sans">
          {children}
        </main>

        <footer className="bg-zinc-950 border-t border-zinc-900 py-12 mt-12">
          <div className="max-w-[1280px] mx-auto px-4 text-center text-zinc-100">
            <div className="text-2xl font-black text-zinc-800 mb-4 tracking-tighter">ARCA.</div>
            <p className="text-xs text-zinc-600 font-medium">&copy; 2026 Arca Community Platform. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
