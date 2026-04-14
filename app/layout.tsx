import type { Metadata } from "next";
import "./globals.css";
import AdBanner from "@/components/AdBanner";

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
      <body className="flex flex-col min-h-screen">
        {/* 상단 고정 헤더 */}
        <header className="fixed top-0 w-full h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 z-50">
          <div className="container-main h-full px-4 flex items-center justify-between gap-8">
            {/* 로고 */}
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-black text-white tracking-tighter hover:text-blue-500 transition-colors">
                ARCA.
              </a>
            </div>

            {/* 중앙 검색창 */}
            <div className="flex-1 max-w-2xl relative">
              <input 
                type="text" 
                placeholder="관심 있는 주제를 검색해 보세요"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600/50 outline-none transition-all placeholder:text-zinc-600"
              />
              <span className="absolute right-3 top-2.5 text-zinc-500 cursor-pointer">🔍</span>
            </div>

            {/* 우측 유틸리티 */}
            <div className="flex items-center gap-2">
              <button className="text-zinc-400 hover:text-white transition-all text-sm font-bold px-3 py-2">
                로그인
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-900/20 transition-all">
                회원가입
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors text-xl">
                🌙
              </button>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 구조 */}
        <div className="container-main pt-20 flex gap-6 min-h-screen px-4">
          {/* 왼쪽 사이드바 (240px) */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0 space-y-8">
            <nav className="space-y-1">
              <h3 className="px-3 text-[11px] font-black text-zinc-500 uppercase tracking-[2px] mb-2">Navigation</h3>
              <div className="sidebar-item font-bold text-white bg-zinc-900">🏠 전체 게시판</div>
              <div className="sidebar-item">🔥 실시간 베스트</div>
              <div className="sidebar-item">💎 인기 게시판</div>
            </nav>

            <nav className="space-y-1">
              <h3 className="px-3 text-[11px] font-black text-zinc-500 uppercase tracking-[2px] mb-2">Categories</h3>
              <div className="sidebar-item">🎮 게임 채널</div>
              <div className="sidebar-item">📺 애니메이션</div>
              <div className="sidebar-item">💻 IT & 테크</div>
              <div className="sidebar-item">🖼️ 유머 / 짤방</div>
              <div className="sidebar-item">💬 자유 게시판</div>
            </nav>

            <nav className="space-y-1">
              <h3 className="px-3 text-[11px] font-black text-zinc-500 uppercase tracking-[2px] mb-2">Favorites</h3>
              <div className="sidebar-item text-zinc-600 italic">즐겨찾기가 없습니다.</div>
            </nav>
          </aside>

          {/* 중앙 섹션 (Flex-1) */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

          {/* 오른쪽 사이드바 (300px) */}
          <aside className="hidden xl:block w-[300px] flex-shrink-0 space-y-6">
            {/* 로그인 위젯 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="text-sm text-zinc-400 mb-4 font-medium leading-relaxed">
                커뮤니티에 가입하고<br/>관심 있는 주제의 정보를 나눠보세요!
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all mb-3">
                로그인 시작하기
              </button>
              <div className="flex justify-center gap-4 text-xs text-zinc-500">
                <a href="#" className="hover:text-zinc-300">아이디 찾기</a>
                <span>|</span>
                <a href="#" className="hover:text-zinc-300">회원가입</a>
              </div>
            </div>

            {/* 실시간 인기 글 */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">실시간 인기 글</h3>
                <span className="text-[10px] text-zinc-500">More</span>
              </div>
              <div className="p-2 space-y-1">
                {[...Array(5)].map((_, i) => (
                  <a key={i} href="#" className="flex gap-3 p-2 rounded-lg hover:bg-zinc-900 transition-colors group">
                    <span className="text-blue-500 font-bold italic w-4">{i + 1}</span>
                    <span className="text-xs text-zinc-300 line-clamp-1 group-hover:text-white transition-colors">
                      {i === 0 ? "나히다 성유물 세팅 정보 집대성" : "내일 날씨 전국 비 소식 알려드림"}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* 광고 영역 */}
            <AdBanner label="Sidebar Ad" />
          </aside>
        </div>

      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 mt-12">
        <div className="container-main px-4 text-center">
          <div className="text-2xl font-black text-zinc-800 mb-4 tracking-tighter">ARCA.</div>
          <p className="text-xs text-zinc-600">&copy; 2026 Arca Community Platform. All rights reserved.</p>
        </div>
      </footer>
    </body>
    </html>
  );
}
