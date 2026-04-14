import AdBanner from "@/components/AdBanner";

export default function Home() {
  const posts = [
    { id: 104256, category: "원신", title: "나히다 2돌 체감 확실하네요 ㄷㄷ", comments: 142 },
    { id: 104255, category: "IT", title: "M4 맥북 프로 램 16GB 기본 탑재 확정?", comments: 56 },
    { id: 104254, category: "사회", title: "내일 수도권 출근길 폭설 주의보", comments: 89 },
    { id: 104253, category: "게임", title: "스팀 가을 세일 오늘부터 시작입니다!", comments: 12 },
    { id: 104252, category: "유머", title: "퇴근길에 본 고양이 꾹꾹이 실력", comments: 245 },
    { id: 104251, category: "테크", title: "엔비디아 주가 시총 1위 다시 탈환", comments: 72 },
    { id: 104250, category: "애니", title: "이번 분기 신작 추천 리스트 (스압)", comments: 110 },
    { id: 104249, category: "일상", title: "성수동 웨이팅 없는 카페 공유함", comments: 8 },
    { id: 104248, category: "사회", title: "청년 주택 드림 청약 정보 요약", comments: 34 },
    { id: 104247, category: "테크", title: "아이폰 16 Pro 카메라 데드픽셀 이슈?", comments: 65 },
  ];

  return (
    <div className="space-y-4 w-full">
      {/* 상단 탭 및 필터 */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex gap-4">
          <button className="text-sm font-black text-white border-b-2 border-blue-500 pb-2">실시간 베스트</button>
          <button className="text-sm font-bold text-zinc-500 hover:text-zinc-300 pb-2 transition-colors">주간 인기</button>
          <button className="text-sm font-bold text-zinc-500 hover:text-zinc-300 pb-2 transition-colors">월간 인기</button>
        </div>
        <div className="flex gap-2">
          <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-zinc-800 transition-all">새로고침</button>
        </div>
      </div>

      {/* 게시글 리스트 테이블 */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl w-full">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-zinc-800 text-[11px] font-black text-zinc-500 uppercase tracking-widest">
              <th className="py-3 px-4 text-center w-[80px]">No</th>
              <th className="py-3 px-4 text-center w-[100px]">Cat</th>
              <th className="py-3 px-4 text-left">Subject</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {posts.map((post, index) => (
              <>
                {index === 5 && (
                  <tr key="ad-row">
                    <td colSpan={3} className="p-0 border-b border-zinc-800 bg-zinc-900/20">
                      <div className="px-4 py-2">
                        <AdBanner label="In-feed Ad" />
                      </div>
                    </td>
                  </tr>
                )}
                <tr key={post.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/40 transition-all group cursor-pointer">
                  <td className="py-3 px-4 text-center text-zinc-600 text-[11px] truncate">{post.id}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="bg-zinc-900 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800 block truncate">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 truncate">
                    <a href={`/post/${post.id}`} className="flex items-center gap-2 group-hover:translate-x-1 transition-transform overflow-hidden">
                      <span className="text-zinc-200 font-medium truncate group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </span>
                      <span className="text-[11px] font-black text-blue-500/80 flex-shrink-0">
                        [{post.comments}]
                      </span>
                      {index % 3 === 0 && <span className="text-[10px] flex-shrink-0">🖼️</span>}
                    </a>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* 하단 페이지네이션 및 액션 */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${n === 1 ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'}`}>
              {n}
            </button>
          ))}
        </div>
        <button className="bg-white text-black font-black text-sm px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-95">
          새 글 작성
        </button>
      </div>
    </div>
  );
}
