import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Community - 아카라이브 스타일 커뮤니티",
  description: "채널 기반 커뮤니티 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex flex-col">
        {/* 상단 네비게이션 */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="container-custom h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-primary">MyCommunity</h1>
              <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
                <a href="/" className="hover:text-primary transition-colors">전체</a>
                <a href="/channels" className="hover:text-primary transition-colors">채널 목록</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm px-3 py-1.5 rounded-md hover:bg-gray-100">로그인</button>
              <button className="text-sm px-3 py-1.5 bg-primary text-white rounded-md">회원가입</button>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="container-custom flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 py-8">
          {/* 중앙 게시판 영역 */}
          <div className="lg:col-span-9">
            {children}
          </div>

          {/* 우측 사이드바 (채널 순위 등) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="card p-4">
              <h2 className="font-bold mb-3 border-b pb-2">인기 채널</h2>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:underline"># 게임 채널</a></li>
                <li><a href="#" className="hover:underline"># 자유 게시판</a></li>
                <li><a href="#" className="hover:underline"># IT 뉴스</a></li>
              </ul>
            </div>
          </aside>
        </main>

        {/* 하단 푸터 */}
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="container-custom text-center text-sm text-gray-500">
            &copy; 2026 MyCommunity. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
