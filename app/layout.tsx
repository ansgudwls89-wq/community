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

            {/* 중앙 검색 영역 + 드롭다운 */}
            <div className="flex-1 max-w-3xl flex items-center gap-2">
              <div className="relative">
                <select className="appearance-none bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold text-zinc-400 outline-none focus:ring-2 focus:ring-blue-600/50 cursor-pointer pr-8 hover:bg-zinc-800 transition-all">
                  <option>베스트</option>
                  <option>공지</option>
                  <option>문의</option>
                  <option>유머</option>
                </select>
                <span className="absolute right-3 top-3.5 text-[8px] text-zinc-600 pointer-events-none">▼</span>
              </div>
              
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="관심 있는 스페이스를 검색해 보세요"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all placeholder:text-zinc-600"
                />
                <span className="absolute right-3 top-2.5 text-zinc-500 cursor-pointer">🔍</span>
              </div>
            </div>

            {/* 우측 유틸리티 */}
            <div className="flex items-center gap-2">
              <button className="hidden sm:block text-zinc-400 hover:text-white transition-all text-sm font-bold px-3 py-2">로그인</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-900/20 transition-all">회원가입</button>
            </div>
          </div>
        </header>

        <main className="max-w-[1280px] mx-auto pt-24 px-4 flex-1 w-full text-zinc-100">
          {children}
        </main>

        <footer className="bg-zinc-950 border-t border-zinc-900 py-12 mt-12">
          <div className="max-w-[1280px] mx-auto px-4 text-center text-zinc-100">
            <div className="text-2xl font-black text-zinc-800 mb-4 tracking-tighter">ARCA.</div>
            <p className="text-xs text-zinc-600">&copy; 2026 Arca Community Platform. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
