export default function Home() {
  const notices = [
    { id: 101, title: "[공지] 커뮤니티 이용 규칙 안내 (필독)", author: "운영진", date: "24.01.01", likes: 1250 },
    { id: 102, title: "[공지] 신규 채널 개설 신청 게시판", author: "운영진", date: "24.01.05", likes: 420 },
  ];

  const posts = [
    { id: 1, channel: "게임", title: "롤드컵 결승 보시는 분 계신가요?", author: "페이커팬", date: "21:30", likes: 45, comments: 12 },
    { id: 2, channel: "IT", title: "M4 아이패드 프로 13인치 한달 사용기", author: "애플농장", date: "20:15", likes: 32, comments: 8 },
    { id: 3, channel: "일상", title: "오늘 퇴근길 노을 진짜 예쁘네요 (사진)", author: "풍경덕후", date: "19:40", likes: 85, comments: 24 },
    { id: 4, channel: "질문", title: "코딩 공부 독학 vs 학원 추천 좀 해주세요", author: "뉴비", date: "18:22", likes: 12, comments: 45 },
    { id: 5, channel: "게임", title: "스팀 세일 품목 중에서 살만한 거 있나요?", author: "할인마", date: "17:50", likes: 28, comments: 15 },
    { id: 6, channel: "IT", title: "엔비디아 주가 어디까지 갈까요?", author: "개미", date: "16:10", likes: 64, comments: 52 },
    { id: 7, channel: "반려동물", title: "우리집 고양이 꾹꾹이 보고 가세요", author: "집사1", date: "15:30", likes: 142, comments: 10 },
  ];

  return (
    <div className="bg-white border border-border">
      {/* 탭 네비게이션 */}
      <div className="flex bg-[#f8f9fa] border-b border-border">
        <button className="px-4 py-2.5 text-[13px] font-bold border-b-2 border-primary text-primary bg-white">전체</button>
        <button className="px-4 py-2.5 text-[13px] font-medium text-slate-500 hover:text-slate-800">베스트</button>
        <button className="px-4 py-2.5 text-[13px] font-medium text-slate-500 hover:text-slate-800">정보</button>
      </div>

      <table className="board-table">
        <colgroup>
          <col width="50" />
          <col width="80" />
          <col />
          <col width="100" />
          <col width="70" />
          <col width="60" />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>채널</th>
            <th className="text-left px-3">제목</th>
            <th>작성자</th>
            <th>날짜</th>
            <th>추천</th>
          </tr>
        </thead>
        <tbody className="text-[13px]">
          {/* 공지사항 */}
          {notices.map((notice) => (
            <tr key={notice.id} className="bg-red-50/30 font-bold">
              <td className="text-center text-accent text-xs">공지</td>
              <td className="text-center"><span className="badge-channel bg-accent">운영</span></td>
              <td className="px-3">
                <a href="#" className="hover:underline">{notice.title}</a>
              </td>
              <td className="text-center text-slate-500">{notice.author}</td>
              <td className="text-center text-slate-400 text-xs">{notice.date}</td>
              <td className="text-center text-accent font-bold">{notice.likes}</td>
            </tr>
          ))}

          {/* 일반 게시글 */}
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-slate-50/80 cursor-pointer">
              <td className="text-center text-slate-400 text-xs">{post.id}</td>
              <td className="text-center"><span className="badge-channel">{post.channel}</span></td>
              <td className="px-3">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="truncate hover:underline text-slate-900">{post.title}</span>
                  <span className="text-[11px] text-primary font-bold">[{post.comments}]</span>
                  <span className="text-[10px] text-primary">🖼️</span>
                </div>
              </td>
              <td className="text-center text-slate-600 truncate max-w-[100px]">{post.author}</td>
              <td className="text-center text-slate-400 text-xs">{post.date}</td>
              <td className="text-center text-slate-500 font-medium">{post.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 하단 글쓰기 및 검색 */}
      <div className="flex items-center justify-between p-3 bg-[#f8f9fa] border-t border-border">
        <div className="flex gap-1">
          <button className="px-3 py-1.5 bg-white border border-border text-xs font-bold rounded hover:bg-slate-50 transition-colors">새로고침</button>
        </div>
        <div className="flex gap-1">
          <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-primary-light transition-colors shadow-sm">글쓰기</button>
        </div>
      </div>
    </div>
  );
}
