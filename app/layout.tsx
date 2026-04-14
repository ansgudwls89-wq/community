import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Community - 아카라이브 스타일",
  description: "커뮤니티 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        {/* 상단 네비게이션 */}
        <header className="bg-primary text-white sticky top-0 z-50">
          <div className="container-custom h-12 flex items-center justify-between px-3">
            <div className="flex items-center gap-4">
              <a href="/" className="text-xl font-black tracking-tight uppercase">MyCommunity</a>
              <nav className="hidden md:flex items-center gap-1">
                <a href="/best" className="px-3 py-1.5 hover:bg-white/10 rounded font-bold">개념</a>
                <a href="/all" className="px-3 py-1.5 hover:bg-white/10 rounded">전체</a>
                <a href="/recent" className="px-3 py-1.5 hover:bg-white/10 rounded">최신</a>
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <input 
                  type="text" 
                  placeholder="통합 검색"
                  className="bg-black/20 border-none rounded py-1 px-3 text-xs focus:ring-1 focus:ring-white outline-none w-40"
                />
              </div>
              <button className="text-xs font-bold hover:underline">로그인</button>
            </div>
          </div>
        </header>

        {/* 메인 레이아웃 (2컬럼) */}
        <main className="container-custom flex gap-4 mt-4 px-3 flex-1">
          <div className="w-full lg:w-[calc(100%-320px)]">
            {children}
          </div>

          {/* 우측 사이드바 (아카라이브 특유의 구성) */}
          <aside className="hidden lg:block w-[300px]">
            {/* 최근 댓글 */}
            <div className="sidebar-card">
              <div className="sidebar-header">최근 댓글</div>
              <div className="p-2 space-y-1.5 text-xs">
                {[
                  "이거 진짜 대박인듯ㅋㅋㅋ",
                  "M4 맥북 가성비 미쳤네요",
                  "성수동 거기 저도 가봤는데 굿",
                  "내년 출시 게임 다들 뭐 기다림?",
                  "고양이 사진 좀 더 올려주세요"
                ].map((comment, i) => (
                  <div key={i} className="flex items-center gap-2 truncate text-slate-600 hover:text-primary cursor-pointer">
                    <span className="text-[10px] text-slate-300">•</span> {comment}
                  </div>
                ))}
              </div>
            </div>

            {/* 인기 채널 순위 */}
            <div className="sidebar-card">
              <div className="sidebar-header">채널 순위 <span className="text-[10px] font-normal text-slate-400">전체보기</span></div>
              <div className="p-0">
                {[
                  { name: "게임 라운지", rank: "1", up: true },
                  { name: "IT & 테크", rank: "2", up: true },
                  { name: "오늘의 일상", rank: "3", up: false },
                  { name: "질문 & 답변", rank: "4", up: true },
                  { name: "반려동물", rank: "5", up: false }
                ].map((channel, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 border-b border-gray-50 last:border-none hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className={`w-4 text-center font-bold italic ${i < 3 ? 'text-primary' : 'text-slate-400'}`}>{channel.rank}</span>
                      <span className="text-[13px] text-slate-700 font-medium group-hover:text-primary">{channel.name}</span>
                    </div>
                    <span className={`text-[10px] ${channel.up ? 'text-red-500' : 'text-blue-500'}`}>{channel.up ? '▲' : '▼'}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 mt-8">
          <div className="container-custom px-3 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex gap-4">
              <a href="#" className="hover:underline">회사소개</a>
              <a href="#" className="hover:underline">이용약관</a>
              <a href="#" className="hover:underline font-bold text-slate-600">개인정보처리방침</a>
            </div>
            <span>&copy; MyCommunity Corp.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
