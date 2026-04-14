export default function Home() {
  const notices = [
    { id: 0, channel: "공지", title: "커뮤니티 이용 규칙 안내 (24.01.01 수정)", author: "운영진", date: "24.01.01", view: "152k", likes: 125 },
    { id: -1, channel: "공지", title: "채널 개설 신청 및 관리 가이드", author: "운영진", date: "24.01.05", view: "42k", likes: 85 },
  ];

  const posts = [
    { id: 1234567, channel: "원신", title: "나히다 성유물 세팅 질문드려요", author: "여행자", date: "14:22", view: "1.2k", likes: 12, comments: 24, hasImg: true },
    { id: 1234566, channel: "사회", title: "내일 날씨 전국적으로 비 온다고 하네요", author: "기상캐스터", date: "14:15", view: "850", likes: 5, comments: 3, hasImg: false },
    { id: 1234565, channel: "일상", title: "오늘 점심 제육볶음 먹었는데 꿀맛이네요", author: "직장인A", date: "13:50", view: "2.1k", likes: 32, comments: 15, hasImg: true },
    { id: 1234564, channel: "게임", title: "M4 아이패드로 게임 돌려보신 분 계신가요?", author: "겜돌이", date: "13:40", view: "3.4k", likes: 45, comments: 52, hasImg: false },
    { id: 1234563, channel: "유머", title: "댕댕이 꾹꾹이 시도하다 실패하는 짤.gif", author: "멍멍이", date: "13:20", view: "12k", likes: 156, comments: 84, hasImg: true },
    { id: 1234562, channel: "IT", title: "엔비디아 시총 1위 달성 관련 분석글", author: "주식개미", date: "12:55", view: "5.2k", likes: 82, comments: 31, hasImg: false },
    { id: 1234561, channel: "일상", title: "서울 야경 명소 추천 부탁드립니다", author: "야경꾼", date: "12:30", view: "1.5k", likes: 24, comments: 18, hasImg: true },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* 채널 헤더 / 필터 */}
      <div className="flex items-center justify-between py-1 border-b border-arca-border/40">
        <h2 className="text-lg font-bold flex items-center gap-2">
          전체 게시글
        </h2>
        <div className="flex gap-1">
          <button className="px-2 py-1 bg-white border border-arca-border/60 text-[11px] hover:bg-slate-50">최신순</button>
          <button className="px-2 py-1 bg-white border border-arca-border/60 text-[11px] hover:bg-slate-50">추천순</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="arca-table">
          <colgroup>
            <col className="hidden sm:table-column w-[70px]" />
            <col className="w-[80px]" />
            <col />
            <col className="w-[100px]" />
            <col className="w-[60px]" />
            <col className="hidden sm:table-column w-[60px]" />
            <col className="w-[50px]" />
          </colgroup>
          <thead>
            <tr>
              <th className="hidden sm:table-cell">번호</th>
              <th>분류</th>
              <th className="text-left px-2">제목</th>
              <th>작성자</th>
              <th>날짜</th>
              <th className="hidden sm:table-cell">조회</th>
              <th>추천</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {/* 공지사항 */}
            {notices.map((notice) => (
              <tr key={notice.id} className="arca-notice">
                <td className="hidden sm:table-cell text-center text-red-500">공지</td>
                <td className="text-center"><span className="badge badge-notice">운영</span></td>
                <td className="px-2">
                  <a href="#" className="hover:underline text-slate-900 line-clamp-1">{notice.title}</a>
                </td>
                <td className="text-center text-slate-500 font-normal">{notice.author}</td>
                <td className="text-center text-slate-400">{notice.date}</td>
                <td className="hidden sm:table-cell text-center text-slate-400">{notice.view}</td>
                <td className="text-center text-red-500">{notice.likes}</td>
              </tr>
            ))}

            {/* 일반 게시글 */}
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="hidden sm:table-cell text-center text-slate-400 text-[10px]">{post.id}</td>
                <td className="text-center"><span className="badge badge-channel">{post.channel}</span></td>
                <td className="px-2">
                  <div className="flex items-center gap-1">
                    <a href="#" className="hover:underline text-slate-800 line-clamp-1">{post.title}</a>
                    <span className="comment-count">[{post.comments}]</span>
                    {post.hasImg && <span className="text-[10px] text-arca-blue">🖼️</span>}
                  </div>
                </td>
                <td className="text-center text-slate-600 truncate max-w-[100px]">{post.author}</td>
                <td className="text-center text-slate-400 text-[11px]">{post.date}</td>
                <td className="hidden sm:table-cell text-center text-slate-400">{post.view}</td>
                <td className={`text-center font-bold ${post.likes >= 100 ? 'text-orange-500' : post.likes >= 50 ? 'text-green-600' : 'text-slate-500'}`}>
                  {post.likes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 버튼 및 검색 */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-1">
          <button className="px-3 py-1.5 bg-white border border-arca-border/60 text-xs font-bold hover:bg-slate-50">새로고침</button>
        </div>
        <div className="flex gap-1">
          <button className="px-5 py-1.5 bg-arca-blue text-white text-xs font-bold shadow-sm hover:opacity-90">글쓰기</button>
        </div>
      </div>

      {/* 하단 페이지네이션 (단순화) */}
      <div className="flex justify-center gap-1 mt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
          <button key={n} className={`w-7 h-7 flex items-center justify-center text-xs border ${n === 1 ? 'border-arca-blue text-arca-blue font-bold bg-white' : 'border-arca-border/30 text-slate-500 bg-white hover:bg-slate-50'}`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
