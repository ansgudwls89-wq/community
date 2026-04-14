import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "아카라이브 - 전체",
  description: "아카라이브 스타일 커뮤니티",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        {/* 상단 네비게이션 바 */}
        <header className="bg-arca-blue text-white">
          <div className="container-arca h-[46px] flex items-center justify-between">
            <div className="flex items-center h-full">
              <a href="/" className="text-xl font-black mr-6 flex items-center h-full">ARCA.LIVE</a>
              <nav className="hidden md:flex items-center h-full text-sm">
                <a href="#" className="px-4 h-full flex items-center hover:bg-white/10 font-bold">베스트</a>
                <a href="#" className="px-4 h-full flex items-center hover:bg-white/10">채널</a>
                <a href="#" className="px-4 h-full flex items-center hover:bg-white/10">위키</a>
              </nav>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold h-full">
              <div className="flex items-center h-full px-2 hover:bg-white/10 cursor-pointer">🔍</div>
              <a href="#" className="h-full flex items-center px-2 hover:bg-white/10">로그인</a>
            </div>
          </div>
        </header>

        {/* 서브 네비게이션 (채널 바로가기) */}
        <div className="bg-white border-b border-arca-border/50 text-xs">
          <div className="container-arca flex h-[34px] items-center text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <a href="#" className="mr-4 hover:text-arca-blue">종합</a>
            <a href="#" className="mr-4 hover:text-arca-blue font-bold text-arca-blue">전체</a>
            <a href="#" className="mr-4 hover:text-arca-blue">인기</a>
            <span className="text-slate-200 mx-2">|</span>
            <a href="#" className="mx-2 hover:text-arca-blue">원신</a>
            <a href="#" className="mx-2 hover:text-arca-blue">게임</a>
            <a href="#" className="mx-2 hover:text-arca-blue">사회</a>
            <a href="#" className="mx-2 hover:text-arca-blue">일상</a>
          </div>
        </div>

        {/* 메인 레이아웃 (게시판 리스트 + 우측 사이드바) */}
        <main className="container-arca flex gap-4 mt-4 px-2 pb-10 flex-1">
          <div className="w-full lg:w-[calc(100%-300px)] flex flex-col gap-4">
            {children}
          </div>

          {/* 우측 사이드바 위젯 */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0 space-y-4">
            {/* 최근 댓글 위젯 */}
            <div className="bg-white border border-arca-border/60">
              <div className="bg-slate-50 border-b border-arca-border/60 px-3 py-2 text-[12px] font-bold text-slate-700 flex justify-between items-center">
                <span>최근 댓글</span>
                <span className="text-[10px] font-normal text-slate-400">더보기</span>
              </div>
              <div className="p-2 space-y-1.5 text-xs text-slate-600">
                {["ㅋㅋㅋㅋㅋ 이거 진짜인가요?", "M4 맥북 오늘 주문했습니다.", "성수동 맛집 정보 감사합니다.", "다들 내일 출근하시나요?", "고양이 너무 귀엽네요ㅠㅠ"].map((txt, i) => (
                  <div key={i} className="flex gap-2 truncate hover:text-arca-blue cursor-pointer items-center">
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="truncate">{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 인기 채널 위젯 */}
            <div className="bg-white border border-arca-border/60">
              <div className="bg-slate-50 border-b border-arca-border/60 px-3 py-2 text-[12px] font-bold text-slate-700">채널 순위</div>
              <div className="p-0">
                {[
                  { name: "원신 채널", rank: "1", up: true },
                  { name: "블루 아카이브", rank: "2", up: true },
                  { name: "사회 채널", rank: "3", up: false },
                  { name: "유머 채널", rank: "4", up: true },
                  { name: "자유 게시판", rank: "5", up: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-1.5 border-b border-slate-50 hover:bg-slate-50 cursor-pointer text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-4 text-center font-bold italic ${i < 3 ? 'text-arca-blue' : 'text-slate-400'}`}>{item.rank}</span>
                      <span className="text-slate-700 hover:text-arca-blue truncate max-w-[180px]">{item.name}</span>
                    </div>
                    <span className={`text-[10px] ${item.up ? 'text-red-500' : 'text-blue-500'}`}>{item.up ? '▲' : '▼'}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>

        <footer className="bg-[#444] text-[#ccc] py-8 text-xs">
          <div className="container-arca flex justify-between">
            <div className="space-x-4">
              <a href="#" className="hover:text-white">회사소개</a>
              <a href="#" className="hover:text-white">이용약관</a>
              <a href="#" className="hover:text-white font-bold">개인정보처리방침</a>
            </div>
            <span>&copy; ArcaLive Copy. All rights reserved.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
