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
      <body className="flex flex-col min-h-screen bg-zinc-950">
        {/* 상단 고정 헤더 */}
        <header className="fixed top-0 w-full h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 z-50">
          <div className="max-w-[1280px] mx-auto h-full px-4 flex items-center justify-between gap-8">
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-black text-white tracking-tighter hover:text-blue-500 transition-colors">
                ARCA.
              </a>
            </div>

            <div className="flex-1 max-w-2xl relative">
              <input 
                type="text" 
                placeholder="관심 있는 주제를 검색해 보세요"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all placeholder:text-zinc-600 text-white"
              />
              <span className="absolute right-3 top-2.5 text-zinc-500 cursor-pointer">🔍</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="text-zinc-400 hover:text-white transition-all text-sm font-bold px-3 py-2">로그인</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-900/20 transition-all">회원가입</button>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 (사이드바 제거됨) */}
        <main className="max-w-[1280px] mx-auto pt-24 px-4 flex-1 w-full">
          {children}
        </main>

        <footer className="bg-zinc-950 border-t border-zinc-900 py-12 mt-12">
          <div className="max-w-[1280px] mx-auto px-4 text-center">
            <div className="text-2xl font-black text-zinc-800 mb-4 tracking-tighter">ARCA.</div>
            <p className="text-xs text-zinc-600">&copy; 2026 Arca Community Platform. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
